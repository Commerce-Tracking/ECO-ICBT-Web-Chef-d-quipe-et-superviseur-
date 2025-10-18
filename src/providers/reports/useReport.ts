import React from 'react';
import {ReportsContext} from "../../context/ReportContext.tsx";
import {PaginatedReport} from "../../context/report/report.types.ts.tsx";

export const useReport = (): {
    reports: PaginatedReport | null;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
    fetchReports: (page?: number, limit?: number) => void;
    fetchReportTypes: () => void;
} => {
    const context = React.useContext(ReportsContext);
    if (!context) {
        throw new Error('useComplaint must be used within a ComplaintProvider');
    }
    // @ts-ignore
    return context;
};