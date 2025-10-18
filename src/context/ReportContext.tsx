import {PaginatedReport} from "./report/report.types.ts.tsx";
import {createContext, useContext} from "react";

interface ReportsContextType {
    reports: PaginatedReport | null;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
    fetchReports: (page?: number, limit?: number) => void;
}

export const ReportsContext = createContext<ReportsContextType>({
    reports: null,
    totalPages: 1,
    currentPage: 1,
    loading: false,
    error: null,
    fetchReports: () => {}
});

export const useReports = () => useContext(ReportsContext);