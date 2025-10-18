// src/pages/components/ComplaintsTableOne.tsx
import React, {useEffect, useState} from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import { FilterService, locale } from 'primereact/api';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import {IoCheckmarkCircle} from "react-icons/io5";
import {MdCancel} from "react-icons/md";
import {useTranslation} from "react-i18next";


type Complaint = {
    id: string;
    title: string;
    description: string;
    status: string;
    createdAt: string;
    audioUrl: string | null;
    userId: string;
    countryId: string;
    localityId: string;
    complaintTypeId: string;
    serviceId: string;
    // flowId: string | null;
    loadingNumber: string;
    complaintDate: string;
    complaintTime: string;
    tempsPerdu: string;
    montant: number;
    User: {
        id: string;
        firstname: string;
        lastname: string;
        phone: string;
        email: string;
    };
    Country: { id: string; name: string };
    Locality: { id: string; name: string };
    ComplaintType: { id: string; name: string };
    Service: { id: string; name: string };
    TransportForm: {
        id: string;
        loadingNumber: string;
        productLabel: string;
        productQuantity: number;
        averageWeightKg: number;
        averageUnitPrice: number;
        totalProductValue: number;
        currency: string;
        loadingPoint: string;
        loadingCountry: string;
        unloadingPoint: string;
        unloadingCountry: string;
    };
    images: { id: string; url: string; complaintId: string }[];
};

type ComplaintsTableProps = {
    data: Complaint[];
    totalRecords: number;
    currentPage: number;
    rowsPerPage?: number;
    loading: boolean;
    onPageChange: (event: any) => void;
};

export default function ComplaintsTableOne({
    data,
    totalRecords,
    currentPage,
    rowsPerPage = 10,
    loading,
    onPageChange,
}: ComplaintsTableProps) {
    const [visible, setVisible] = useState<boolean>(false);
    const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

    useEffect(() => {
        // @ts-ignore
        console.log('Locale courante dans PrimeReact :', locale());
        FilterService.register('custom_date', (value, filters) => {
            const [from, to] = filters ?? [null, null];
            if (!from && !to) return true;
            if (from && !to) return new Date(from) <= new Date(value);
            if (!from && to) return new Date(value) <= new Date(to);
            return new Date(from) <= new Date(value) && new Date(value) <= new Date(to);
        });
    }, []);


    
    
    const dateRangeFilterTemplate = (options: any) => {
        return (
            <div className="p-fluid">
                {/*<label>Date</label>*/}
                <div className="p-inputgroup">
                    <input
                        type="date"
                        onChange={(e) => options.filterApplyCallback(e.target.value)}
                    />
                </div>
            </div>
        );
    };

  const { t, i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

  
    const detailsBodyTemplate = (rowData: Complaint) => {
        return (
            <Button
                label={t('see_details')}
                className="p-button-sm p-button-primary"
                onClick={() => {
                    setSelectedComplaint(rowData);
                    setVisible(true);
                }}
            />
        );
    };
 

    const renderComplaintDetails = () => {
        if (!selectedComplaint) return null;
        return (
            <div className="p-4">
                <h3 className="text-lg font-bold mb-4">{t('obstacle_details')}</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        {/* <p><strong>ID :</strong> {selectedComplaint.id}</p> */}
                        <p><strong>{t('description')} :</strong> {selectedComplaint.description}</p>
                        <p><strong>{t('status')} :</strong> {selectedComplaint.status}</p>
                        <p><strong>{t('date_creation')} :</strong> {new Date(selectedComplaint.createdAt).toLocaleDateString()}</p>
                        <p><strong>{t('complaint_date')} :</strong> {selectedComplaint.complaintDate}</p>
                        <p><strong>{t('complaint_time')} :</strong> {selectedComplaint.complaintTime}</p>
                        <p><strong>{t('time_lost')} :</strong> {selectedComplaint.tempsPerdu}</p>
                        <p><strong>{t('amount')} :</strong> {selectedComplaint.montant} {selectedComplaint.TransportForm.currency}</p>
                    </div>
                    <div>
                        <p><strong>{t('user')} :</strong> {selectedComplaint.User.firstname ?? ''} {selectedComplaint.User.lastname} ({selectedComplaint.User.email})</p>
                        <p><strong>{t('country_obstacles')} :</strong> {selectedComplaint.Country.name}</p>
                        <p><strong>{t('locality')} :</strong> {selectedComplaint.Locality.name}</p>
                        <p><strong>{t('complaint_type')} :</strong> {selectedComplaint.ComplaintType.name}</p>
                        <p><strong>{t('service')} :</strong> {selectedComplaint.Service.name}</p>
                        <p><strong>{t('loading_number')} :</strong> {selectedComplaint.loadingNumber}</p>
                        <p><strong>{t('product')} :</strong> {selectedComplaint.TransportForm.productLabel} ({selectedComplaint.TransportForm.productQuantity} unités)</p>
                    </div>
                </div>
                {selectedComplaint.audioUrl && (
                    <div className="mt-4">
                        <p><strong>Audio :</strong></p>
                        <audio controls src={selectedComplaint.audioUrl} className="w-full" />
                    </div>
                )}
                {selectedComplaint.images.length > 0 && (
                    <div className="mt-4">
                        <p><strong>Images :</strong></p>
                        <div className="flex flex-wrap gap-2">
                            {selectedComplaint.images.map((image) => (
                                <img key={image.id} src={image.url} alt="Preuve" className="w-32 h-32 object-cover" />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };



    return (
        <div className="p-4">
            <DataTable
                value={data}
                loading={loading}
                responsiveLayout="scroll"
                showGridlines
                //paginator
                rows={rowsPerPage}
                first={(currentPage - 1) * rowsPerPage}
                totalRecords={totalRecords}
                onPage={onPageChange}
                filterDisplay="row"
                globalFilterFields={['description', 'status']}
                emptyMessage="Aucune plainte trouvée."
            >
                <Column field="description" header={t('description')} filter filterPlaceholder="Rechercher une description" />
                <Column
                    field="status"
                    header={t('status')}
                    filter
                    filterPlaceholder="Filtrer par statut"
                    body={(rowData: Complaint) => {
                        const status = rowData.status;
                        return (
                            <span className="flex align-items-center gap-2">
                                        {status === 'RESOLU' ? (
                                            <>
                                                {/*<i className="pi pi-check text-green-500" style={{ fontSize: '1.3rem', color: 'green' }}></i>*/}
                                                <IoCheckmarkCircle size={20} color="green" />
                                                <span>Résolu</span>
                                            </>
                                        ) : (
                                            <>
                                                {/*<i className="pi pi-times-circle text-red-500" style={{ fontSize: '1.3rem', color: 'red' }}></i>*/}
                                                <MdCancel size={20} color="red" />
                                                <span>Non résolu</span>
                                            </>
                                        )}
                            </span>
                        );
                    }}
                />
                <Column
                    field="createdAt"
                    header={t('date')}
                    showFilterMenu={false}
                    filter
                    filterElement={dateRangeFilterTemplate}
                    body={(rowData) => new Date(rowData.createdAt).toLocaleDateString()}
                />
                <Column
                    header={t('details')}
                    body={detailsBodyTemplate}
                />
            </DataTable>

            <Paginator
                first={(currentPage - 1) * rowsPerPage}
                rows={rowsPerPage}
                totalRecords={totalRecords}
                onPageChange={onPageChange}
            />

            <Dialog
                // header="Détails de la plainte"
                visible={visible}
                style={{ width: '50vw' }}
                onHide={() => setVisible(false)}
                footer={
                    <div>
                        <Button label="Fermer" icon="pi pi-times" onClick={() => setVisible(false)} className="px-3 py-1 text-sm text-white bg-gray-500 rounded hover:bg-gray-600" />
                    </div>
                }
            >
                {renderComplaintDetails()}
            </Dialog>
        </div>
    );
}