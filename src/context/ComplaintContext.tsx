// src/context/complaint/ComplaintContext.tsx
import React from 'react';
import {ComplaintType, PaginatedData} from "./complaint/complaint.types.ts.tsx";

type ComplaintState = {
    complaints: PaginatedData | null;
    complaintTypes: ComplaintType[];
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
    fetchComplaints: (page?: number, limit?: number) => Promise<void>;
    fetchComplaintTypes: () => Promise<void>;
};

const ComplaintContext = React.createContext<ComplaintState | undefined>(undefined);

export default ComplaintContext;