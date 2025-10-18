import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { BrowserRouter } from "react-router";
import AuthProvider from "./providers/auth/AuthProvider.tsx";
import { locale as setLocale } from "primereact/api";
import fr from "./i18n/prime-react-fr.ts";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n.ts";

// @ts-ignore
// setLocale(fr);

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <StrictMode>
      <I18nextProvider i18n={i18n}>
        <AuthProvider>
          <ThemeProvider>
            <AppWrapper>
              <App />
            </AppWrapper>
          </ThemeProvider>
        </AuthProvider>
      </I18nextProvider>
    </StrictMode>
  </BrowserRouter>
);
