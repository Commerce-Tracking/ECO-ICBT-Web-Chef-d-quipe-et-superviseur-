import {useCallback, useEffect, useState} from "react";
import {PaginatedReport} from "../../context/report/report.types.ts.tsx";
import useAuth from "../auth/useAuth.ts";
import {useNavigate} from "react-router";
import axiosInstance from "../../api/axios.ts";
import { ReportsContext } from "../../context/ReportContext.tsx";

export const ReportsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [reports, setReports] = useState<PaginatedReport | null>(null);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // @ts-ignore
    const { token } = useAuth(); // Si vous avez un AuthProvider
    const navigate = useNavigate();

    // Initialisation rapide
    useEffect(() => {
        const init = () => {
            setLoading(false);
        };
        init();
    }, []);

    // Charger les rapports
    const fetchReports = useCallback(async (page: number = 1, limit: number = 10) => {
        setLoading(true);
        setError(null);

        try {
            const res = await axiosInstance.get("/reportings", {
                params: { page, limit },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = res.data.data || {
                data: [],
                page: 1,
                limit: 10,
                total: 0,
                totalPages: 1,
            };

            setReports(data);
            setTotalPages(data.totalPages || 1);
            setCurrentPage(page);
        } catch (err: any) {
            console.error("Erreur lors du chargement des rapports :", err);
            setError(err.response?.data?.message || "Erreur lors du chargement des rapports");
            if (err.response?.status === 401) {
                navigate("/login"); // Redirection si non connecté
            }
        } finally {
            setLoading(false);
        }
    }, [token, navigate]);

    return (
        <ReportsContext.Provider
            value={{
                reports,
                totalPages,
                currentPage,
                loading,
                error,
                fetchReports
            }}
        >
            {children}
        </ReportsContext.Provider>
    );
};