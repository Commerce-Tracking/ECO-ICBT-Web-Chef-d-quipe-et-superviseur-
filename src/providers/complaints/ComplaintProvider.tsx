import ComplaintContext from "../../context/ComplaintContext.tsx";
import React, {useCallback, useEffect, useState} from "react";
import axios from "axios";
import {ComplaintType, PaginatedData} from "../../context/complaint/complaint.types.ts.tsx";
import axiosInstance from "../../api/axios.ts";

const ComplaintProvider = ({ children }) => {
    const [complaints, setComplaints] = useState<PaginatedData | null>(null);
    const [complaintTypes, setComplaintTypes] = useState<ComplaintType[]>([]);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const initComplaint = () => {
            setLoading(false);
        }

        initComplaint();
    }, []);

    const fetchComplaints = useCallback(async (page: number = 1, limit: number = 10) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('accessToken');
            const res = await axiosInstance.get('/complaints', {
                params: { page, limit },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("COMPLAINTS", res.data);
            setComplaints(res.data.data || {
                data: [],
                page: 1,
                limit: 10,
                total: 0,
                totalPages: 1,
            });
            //setTotalPages(res.data.data.totalPages || 1);
            setCurrentPage(page);
        } catch (err: any) {
            console.log(err)
            setError(err.response?.data?.message || 'Erreur lors du chargement des réclamations');

        } finally {
            setLoading(false);
        }
    }, []);





    const fetchComplaintTypes = useCallback(async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const res = await axiosInstance.get('/admin/complaints-types', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("COMPLAINTS TYPES", res.data);
            setComplaintTypes(Array.isArray(res.data?.data?.data) ? res.data.data.data : []);
        } catch (err: any) {
            console.error(err.response?.data?.message || 'Erreur lors du chargement des types de plaintes');
        }
    }, []);

    return (
        <ComplaintContext.Provider
            value={{
                // @ts-ignore
                complaints,
                complaintTypes,
                totalPages,
                currentPage,
                loading,
                error,
                fetchComplaints,
                fetchComplaintTypes
            }}
        >
            {children}
        </ComplaintContext.Provider>
    );

}

export default ComplaintProvider;