import React from 'react';
import {ComplaintType, PaginatedData} from "../../context/complaint/complaint.types.ts.tsx";
import ComplaintContext from "../../context/ComplaintContext.tsx";

export const useComplaint = (): {
    complaints: PaginatedData | null;
    complaintTypes: ComplaintType[];
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
    fetchComplaints: (page?: number, limit?: number) => Promise<void>;
    fetchComplaintTypes: () => Promise<void>;
} => {
    const context = React.useContext(ComplaintContext);
    if (!context) {
        throw new Error('useComplaint must be used within a ComplaintProvider');
    }
    return context;
};