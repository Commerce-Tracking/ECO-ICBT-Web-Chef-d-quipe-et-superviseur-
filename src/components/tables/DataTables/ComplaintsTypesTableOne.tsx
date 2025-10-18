// src/pages/components/ComplaintsTableOne.tsx
import React, { useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import { FilterService } from 'primereact/api';

import "primereact/resources/themes/lara-light-cyan/theme.css";
import {useTranslation} from "react-i18next";



type ComplaintType = {
    id: string;
    name: string;
};

type ComplaintsTableTypeProps = {
    data: ComplaintType[];
    totalRecords: number;
    currentPage: number;
    rowsPerPage?: number;
    loading: boolean;
    onPageChange: (event: any) => void;
};

export default function ComplaintsTableTypeOne(
    {
        data,
        totalRecords,
        currentPage,
        rowsPerPage = 10,
        loading,
        onPageChange,
    } : ComplaintsTableTypeProps) {

    // Enregistrement du filtre personnalisé (utile si tu ajoutes une colonne date plus tard)
    useEffect(() => {
        FilterService.register('custom_date', (value, filters) => {
            const [from, to] = filters ?? [null, null];
            if (!from && !to) return true;
            if (from && !to) return new Date(from) <= new Date(value);
            if (!from && to) return new Date(value) <= new Date(to);
            return new Date(from) <= new Date(value) && new Date(value) <= new Date(to);
        });
    }, []);

    
         const { t, i18n } = useTranslation();
        
            const changeLanguage = (lng: string) => {
                i18n.changeLanguage(lng);
            };

    return (
        <div className="p-4">
         

            <DataTable
                showGridlines
                value={data}
                loading={loading}
                responsiveLayout="scroll"
                paginator
                rows={rowsPerPage}
                first={(currentPage - 1) * rowsPerPage}
                totalRecords={totalRecords}
                onPage={onPageChange}
                globalFilterFields={['name']}
                emptyMessage="Aucun type de plainte trouvé."
            >
                <Column field="name" header={t('obstacles_name')} filter filterPlaceholder="Rechercher par nom" />
            </DataTable>


        </div>
    );
}