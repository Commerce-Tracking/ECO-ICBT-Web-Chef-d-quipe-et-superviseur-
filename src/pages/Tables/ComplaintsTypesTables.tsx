// src/pages/ComplaintsPage.tsx
import React, { useEffect } from 'react';
import ComplaintsTableOne from "../../components/tables/DataTables/ComplaintsTableOne.tsx";
import {useComplaint} from "../../providers/complaints/useComplaint.ts";
import PageMeta from "../../components/common/PageMeta.tsx";
import PageBreadcrumb from "../../components/common/PageBreadCrumb.tsx";
import ComponentCard from "../../components/common/ComponentCard.tsx";
import BasicTableOne from "../../components/tables/BasicTables/BasicTableOne.tsx";
import ComplaintsTableTypeOne from "../../components/tables/DataTables/ComplaintsTypesTableOne.tsx";
import {useTranslation} from "react-i18next";


export default function ComplaintsTypesTables() {
    const {
        complaintTypes,
        loading,
        error,
        fetchComplaintTypes,
    } = useComplaint();

    useEffect(() => {
        fetchComplaintTypes().then(() => {
            console.log("Types de plaintes chargés");
        });
    }, [fetchComplaintTypes]);

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
            <PageBreadcrumb pageTitle={t('complaint_type')} />
            <div className="space-y-6">
                <ComponentCard title={t('obstacles_list')}>
                    <ComplaintsTableTypeOne
                        data={complaintTypes}
                        totalRecords={complaintTypes.length}
                        currentPage={1}
                        loading={loading}
                        onPageChange={() => {}}
                    />
                </ComponentCard>
            </div>
        </>
    );
}