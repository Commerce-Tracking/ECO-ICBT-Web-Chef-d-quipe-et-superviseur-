import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { FilterService } from 'primereact/api';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axios';
import ComponentCard from '../../components/common/ComponentCard';
import "primeicons/primeicons.css";
import { useTranslation } from "react-i18next";


interface Country {
  id: string;
  name: string;
  regionId?: string | null;
}

const EntityTable = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editEntity, setEditEntity] = useState<Country | null>(null);
  const [editName, setEditName] = useState<string>('');
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

  const fetchCountries = async (page: number = 1, limit: number = 10) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.current?.show({
          severity: 'error',
          summary: 'Erreur d’authentification',
          detail: 'Token non trouvé. Redirection...',
          life: 3000,
        });
        setTimeout(() => navigate('/signin'), 3000);
        return;
      }



      const response = await axiosInstance.get('/admin/service', {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit },
      });

      console.log('Réponse API:', response.data);

      const countriesData = Array.isArray(response.data.data?.data)
        ? response.data.data.data
        : [];

      setCountries(countriesData);
      setTotalRecords(response.data.data?.total || 0);

      if (countriesData.length === 0) {
        console.warn('Aucune entité trouvé dans la réponse.');
      }
    } catch (err: any) {
      console.error('Erreur API :', err);
      toast.current?.show({
        severity: 'error',
        summary: 'Erreur',
        detail: err.response?.data?.message || 'Erreur de chargement',
        life: 3000,
      });
      setCountries([]);
      if ([401, 403].includes(err.response?.status)) {
        setTimeout(() => navigate('/signin'), 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries(currentPage, rowsPerPage);
  }, [navigate, currentPage, rowsPerPage]);

  const onPageChange = (event: any) => {
    setCurrentPage(event.page + 1);
    setRowsPerPage(event.rows);
  };

  useEffect(() => {
    FilterService.register('custom_date', (value, filters) => {
      const [from, to] = filters ?? [null, null];
      if (!from && !to) return true;
      if (from && !to) return new Date(from) <= new Date(value);
      if (!from && to) return new Date(value) <= new Date(to);
      return new Date(from) <= new Date(value) && new Date(value) <= new Date(to);
    });
  }, []);

  const truncateText = (text: string, maxLength: number) => {
    return text && text.length > maxLength ? text.substring(0, maxLength) + '...' : text || 'Sans nom';
  };

  const nameBodyTemplate = (rowData: Country) => {
    return truncateText(rowData.name, 30);
  };

  const handleEdit = (country: Country) => {
    setEditEntity(country);
    setEditName(country.name || '');
    setEditError(null);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      setEditError('Le nom de l\'entité est requis.');
      return;
    }

    setEditLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Token manquant.');

      const response = await axiosInstance.put(
        `/admin/service/${editEntity?.id}`,
        { name: editName.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.current?.show({
        severity: 'success',
        summary: 'Succès',
        detail: `Entité "${response.data.data.name}" modifié.`,
        life: 3000,
      });

      setEditEntity(null);
      fetchCountries(currentPage, rowsPerPage);
    } catch (err: any) {
      console.error('Erreur API :', err);
      setEditError(err.response?.data?.message || 'Erreur lors de la modification.');
      toast.current?.show({
        severity: 'error',
        summary: 'Erreur',
        detail: editError,
        life: 3000,
      });
      if ([401, 403].includes(err.response?.status)) {
        setTimeout(() => navigate('/signin'), 3000);
      }
    } finally {
      setEditLoading(false);
    }
  };

  const actionBodyTemplate = (rowData: Country) => {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => handleEdit(rowData)}
          className="text-info-500 hover:text-info-600 transition-colors duration-200"
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
        <h1 className="page-title">Gestion des Entités</h1>
        <p className="page-subtitle">Liste et gestion des entités de service</p>
      </div>
      
      <div className="content-card">
        <div className="content-card-header">
          <h2 className="content-card-title">{t('entity_list')}</h2>
        </div>
        <div className="content-card-body">
        <DataTable
          value={countries}
          loading={loading}
          responsiveLayout="scroll"
          showGridlines
          rows={rowsPerPage}
          first={(currentPage - 1) * rowsPerPage}
          totalRecords={totalRecords}
          onPage={onPageChange}
          filterDisplay="row"
          globalFilterFields={['name']}
          emptyMessage="Aucune entité trouvé."
          paginator
          rowsPerPageOptions={[5, 10, 25]}
          tableStyle={{ minWidth: '50rem' }}
          className="p-datatable-sm"
        >
          <Column
            field="name"
            header={t('name')}
            filter
            filterPlaceholder={t('search_name')}
            body={nameBodyTemplate}
            style={{ width: '80%' }}
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
        visible={!!editEntity}
        header={t('edit_entity')}
        modal
        style={{ width: '30rem' }}
        onHide={() => setEditEntity(null)}
      >
        <form onSubmit={handleUpdate} className="p-4 space-y-4">
          <div className="form-group">
            <label htmlFor="editName" className="form-label">
              {t('entity_name')}
            </label>
            <InputText
              id="editName"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Entrez le nom de l'entité"
              className="form-input"
              disabled={editLoading}
            />
            {editError && <p className="error-message mt-2">{editError}</p>}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              label={t('cancel')}
              icon="pi pi-times"
              className="p-button-secondary"
              onClick={() => setEditEntity(null)}
              disabled={editLoading}
            />
            <Button
              label={t('save')}
              icon="pi pi-check"
              type="submit"
              className="p-button-primary"
              disabled={editLoading || !editName.trim()}
              loading={editLoading}
            />
          </div>
        </form>
      </Dialog>

      <Toast ref={toast} position="bottom-right" />
    </div>
  );
};

export default EntityTable;
