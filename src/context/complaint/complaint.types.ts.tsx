export type Complaint = {
    id: string;
    title: string;
    description: string;
    status: 'pending' | 'in_progress' | 'resolved';
    createdAt: string;
};

export type PaginatedData = {
    data: Complaint[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
};

export type ComplaintType = {
    id: string;
    name: string;
};

export type ComplaintContextType = {
    complaints: PaginatedData | null;
    isLoading: boolean;
    fetchComplaints: (page: number, limit: number) => Promise<void>;
};