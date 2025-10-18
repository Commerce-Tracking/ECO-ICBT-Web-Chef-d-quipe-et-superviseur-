// src/pages/ComplaintsPage.tsx
import React, { useEffect } from 'react';
import ComplaintsTableOne from "../../components/tables/DataTables/ComplaintsTableOne.tsx";
import {useComplaint} from "../../providers/complaints/useComplaint.ts";
import PageMeta from "../../components/common/PageMeta.tsx";
import PageBreadcrumb from "../../components/common/PageBreadCrumb.tsx";
import ComponentCard from "../../components/common/ComponentCard.tsx";
import BasicTableOne from "../../components/tables/BasicTables/BasicTableOne.tsx";
import {useTranslation} from "react-i18next";


export default function ComplaintsTables() {
    const {
        complaints,
        totalPages,
        currentPage,
        loading,
        error,
        fetchComplaints,
    } = useComplaint();

    useEffect(() => {
        fetchComplaints().then(r => {
            console.log("Complaints Loaded")});
    }, []);

    const handlePageChange = (event: any) => {
        fetchComplaints(event.page + 1, event.rows).then(r => {
            console.log("Complaints Loaded" + (event.page + 1));
        });
    };

    if (error) {
        return <div className="text-red-600">{error}</div>;
    }


       const { t, i18n } = useTranslation();
    
        const changeLanguage = (lng: string) => {
            i18n.changeLanguage(lng);
        };


    return (
        <>
            <PageMeta
                title="OFR | Admin"
                description="Opération Fluidité Routière Agro-bétail"
            />
            <PageBreadcrumb pageTitle={t('obstacles')} />
            <div className="space-y-6">
                <ComponentCard title={t('obstacle_list')}>
                    <ComplaintsTableOne
                        // @ts-ignore
                        data={complaints?.data || []}
                        totalRecords={complaints?.total || 0}
                        currentPage={currentPage}
                        loading={loading}
                        onPageChange={handlePageChange}
                    />
                </ComponentCard>
            </div>
        </>

    );
}