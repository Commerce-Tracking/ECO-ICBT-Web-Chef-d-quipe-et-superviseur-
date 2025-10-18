export type PaginatedReport = {
    data: Report[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
};

export type Report = {
    id: number;
    title: string;
    description: string;
    status: string;
    createdAt: string | Date;
    reportDate: string;
    reportTime: string;
    User: {
        firstname: string;
        lastname: string;
        email: string;
    };
    Country: {
        name: string;
    };
    Region: {
        name: string;
    };
    ReportType: {
        name: string;
    };
    Service: {
        name: string;
    };
    audioUrl?: string;
    images: Array<{ id: number; url: string }>;
    loadingNumber?: string;
}