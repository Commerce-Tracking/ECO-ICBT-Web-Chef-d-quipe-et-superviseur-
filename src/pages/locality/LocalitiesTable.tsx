import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axios';
import ComponentCard from '../../components/common/ComponentCard';
import { useTranslation } from "react-i18next";


interface Locality {
  id: string;
  name: string;
  countryId: string;
}

interface Country {
  id: string;
  name: string;
}

const LocalitiesTable = () => {
  const [localities, setLocalities] = useState<Locality[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editLocality, setEditLocality] = useState<Locality | null>(null);
  const [editName, setEditName] = useState<string>('');
  const [editCountryId, setEditCountryId] = useState<string>('');
  const [editError, setEditError] = useState<string | null>(null);
  const [editLoading, setEditLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();

   const { t, i18n } = useTranslation();
        
          const changeLanguage = (lng: string) => {
            i18n.changeLanguage(lng);
          };

  const truncateText = (text: string, maxLength: number) => {
    return text && text.length > maxLength ? text.substring(0, maxLength) + '...' : text || 'Sans nom';
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.current?.show({
          severity: 'error',
          summary: 'Erreur d’authentification',
          detail: 'Token manquant. Redirection...',
          life: 3000,
        });
        setTimeout(() => navigate('/signin'), 3000);
        return;
      }

      const [localitiesResponse, countriesResponse] = await Promise.all([
        axiosInstance.get('/admin/locality', {
          headers: { Authorization: `Bearer ${token}` },
          params: { page: currentPage, limit: rowsPerPage },
        }),
        axiosInstance.get('/admin/countries', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const localitiesData = Array.isArray(localitiesResponse.data?.data?.data)
        ? localitiesResponse.data.data.data
        : [];
      const countriesData = Array.isArray(countriesResponse.data?.data?.data)
        ? countriesResponse.data.data.data
        : [];

      setLocalities(localitiesData);
      setCountries(countriesData);
      setTotalRecords(localitiesResponse.data?.data?.total || 0);
    } catch (err: any) {
      console.error('Erreur API :', err);
      const errorMessage = err.response?.data?.message || 'Erreur lors du chargement';
      toast.current?.show({
        severity: 'error',
        summary: 'Erreur',
        detail: errorMessage,
        life: 3000,
      });
      if ([401, 403].includes(err.response?.status)) {
        setTimeout(() => navigate('/signin'), 3000);
      }
      setLocalities([]);
      setCountries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate, currentPage, rowsPerPage]);

  const onPageChange = (event: any) => {
    setCurrentPage(event.page + 1);
    setRowsPerPage(event.rows);
  };

  const handleEdit = (locality: Locality) => {
    setEditLocality(locality);
    setEditName(locality.name || '');
    setEditCountryId(locality.countryId || '');
    setEditError(null);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() || !editCountryId) {
      setEditError("Le nom de la localité et le pays sont requis.");
      return;
    }

    setEditLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Token manquant');

      const response = await axiosInstance.put(
        `/admin/locality/${editLocality?.id}`,
        { name: editName.trim(), countryId: editCountryId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.current?.show({
        severity: 'success',
        summary: 'Succès',
        detail: `Localité "${response.data.data.name}" modifiée.`,
        life: 3000,
      });

      setEditLocality(null);
      fetchData();
    } catch (err: any) {
      console.error('Erreur API :', err);
      const errorMessage = err.response?.data?.message || 'Erreur de modification.';
      setEditError(errorMessage);
      toast.current?.show({
        severity: 'error',
        summary: 'Erreur',
        detail: errorMessage,
        life: 3000,
      });
      if ([401, 403].includes(err.response?.status)) {
        setTimeout(() => navigate('/signin'), 3000);
      }
    } finally {
      setEditLoading(false);
    }
  };

  const countryNameBodyTemplate = (rowData: Locality) => {
    const country = countries.find(c => c.id === rowData.countryId);
    return truncateText(country?.name || 'Pays inconnu', 30);
  };

  const nameBodyTemplate = (rowData: Locality) => {
    return truncateText(rowData.name, 30);
  };

  const actionBodyTemplate = (rowData: Locality) => {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => handleEdit(rowData)}
          className="text-blue-500 hover:text-blue-700"
          title="Modifier"
        >
          <i className="pi pi-pencil" />
        </button>
      </div>
    );
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Gestion des Localités</h1>
        <p className="page-subtitle">Liste et gestion des localités par pays</p>
      </div>
      
      <div className="content-card">
        <div className="content-card-header">
          <h2 className="content-card-title">{t('locality_list')}</h2>
        </div>
        <div className="content-card-body">
        <DataTable
          value={localities}
          loading={loading}
          paginator
          rows={rowsPerPage}
          first={(currentPage - 1) * rowsPerPage}
          totalRecords={totalRecords}
          onPage={onPageChange}
          filterDisplay="row"
          globalFilterFields={['name']}
          emptyMessage="Aucune localité trouvée."
          rowsPerPageOptions={[5, 10, 25]}
          tableStyle={{ minWidth: '50rem' }}
          className="p-datatable-sm"
          responsiveLayout="scroll"
        >
          <Column
            field="name"
            header={t('name')}
            filter
            filterPlaceholder={t('search_locality')}
            body={nameBodyTemplate}
            style={{ width: '40%' }}
          />
          <Column
            header={t('country')}
            body={countryNameBodyTemplate}
            filter
            filterPlaceholder={t('search_country')}
            style={{ width: '40%' }}
          />
          <Column
            header={t('actions')}
            body={actionBodyTemplate}
            style={{ width: '20%' }}
          />
        </DataTable>
        </div>
      </div>

      <Dialog
        visible={!!editLocality}
        header={t('edit_locality')}
        modal
        style={{ width: '30rem' }}
        onHide={() => setEditLocality(null)}
      >
        <form onSubmit={handleUpdate} className="p-4 space-y-4">
          <div className="p-field">
            <label htmlFor="editName" className="block mb-2 font-bold">
            {t('lacality_name')}
            </label>
            <InputText
              id="editName"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Entrez le nom"
              className="w-full"
              disabled={editLoading}
            />
          </div>
          <div className="p-field">
            <label htmlFor="editCountry" className="block mb-2 font-bold">
      {t('country')}
            </label>
            <Dropdown
              id="editCountry"
              value={editCountryId}
              options={countries.map((c) => ({ label: c.name, value: c.id }))}
              onChange={(e) => setEditCountryId(e.value)}
              placeholder="Sélectionnez un pays"
              className="w-full"
              disabled={editLoading || countries.length === 0}
            />
          </div>
          {editError && <p className="text-red-600 mt-2">{editError}</p>}
          <div className="flex justify-end gap-2">
            <Button
              label={t('cancel')}
              icon="pi pi-times"
              className="p-button-secondary"
              onClick={() => setEditLocality(null)}
              disabled={editLoading}
            />
            <Button
              label={t('save')}
              icon="pi pi-check"
              type="submit"
              className="p-button-primary"
              disabled={editLoading || !editName.trim() || !editCountryId}
              loading={editLoading}
            />
          </div>
        </form>
      </Dialog>

      <Toast ref={toast} position="bottom-right" />
    </div>
  );
};

export default LocalitiesTable;
