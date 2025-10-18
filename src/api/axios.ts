import axios from "axios";

// Configuration de l'URL de base selon l'environnement
const baseURL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD
    ? "https://gateway-api.dev.freetrade-ofr.com" // URL de production
    : "/api"); // URL de développement (proxy Vite)

const axiosInstance = axios.create({ baseURL });

// Variable pour éviter les appels multiples de refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

// Intercepteur de requête
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      config.headers.Accept = "application/json";
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur de réponse pour gérer le refresh automatique des tokens
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si l'erreur est 401 et qu'on n'a pas déjà tenté de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Si un refresh est déjà en cours, on met la requête en queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Appel au endpoint de refresh
        const response = await axios.post("/auth/refresh", {
          refreshToken: refreshToken,
        });

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          response.data;

        // Mettre à jour les tokens dans le localStorage
        localStorage.setItem("accessToken", newAccessToken);
        if (newRefreshToken) {
          localStorage.setItem("refreshToken", newRefreshToken);
        }

        // Mettre à jour l'en-tête de la requête originale
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Traiter la queue des requêtes en attente
        processQueue(null, newAccessToken);

        // Relancer la requête originale
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Si le refresh échoue, on déconnecte l'utilisateur
        processQueue(refreshError, null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userInfo");
        localStorage.removeItem("userData");

        // Rediriger vers la page de connexion
        window.location.href = "/signin";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
