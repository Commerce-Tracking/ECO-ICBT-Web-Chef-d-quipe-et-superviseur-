import React, { useState, useEffect, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import axiosInstance from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import ComponentCard from '../../components/common/ComponentCard';
import "primeicons/primeicons.css";
import { useTranslation } from "react-i18next";


interface Country {
  id: string;
  name: string;
  regionId: string | null;
}

interface LocalityForm {
  name: string;
  countryId: string;
}

const AddLocality = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [form, setForm] = useState<LocalityForm>({ name: '', countryId: '' });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();

   const { t, i18n } = useTranslation();
        
          const changeLanguage = (lng: string) => {
            i18n.changeLanguage(lng);
          };

  // Charger les pays
  const fetchCountries = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.current?.show({
          severity: 'error',
          summary: 'Erreur d’authentification',
          detail: 'Aucun token d’authentification trouvé.',
          life: 3000,
        });
        setTimeout(() => navigate('/signin'), 3000);
        return;
      }

      const response = await axiosInstance.get('/admin/countries', {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: 1, limit: 1000 }, // Charger tous les pays (ajuster selon l'API)
      });

      console.log('Réponse API GET /admin/countries :', response.data);
      const countriesData = Array.isArray(response.data.data.data) ? response.data.data.data : [];
      setCountries(countriesData);
    } catch (err: any) {
      console.error('Erreur API :', err);
      const errorMessage =
        err.response?.data?.message || 'Erreur lors de la récupération des pays.';
      toast.current?.show({
        severity: 'error',
        summary: 'Erreur',
        detail: errorMessage,
        life: 3000,
      });
      setCountries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, [navigate]);

  // Gérer les changements du formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | { value: string }) => {
    const { name, value } = 'target' in e ? e.target : { name: 'countryId', value: e.value };
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Soumettre le formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.countryId) {
      setError('Tous les champs sont requis.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      await axiosInstance.post('/admin/locality', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.current?.show({
        severity: 'success',
        summary: 'Succès',
        detail: 'Localité ajoutée avec succès.',
        life: 3000,
      });
      setForm({ name: '', countryId: '' });
      setError(null);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Erreur lors de l’ajout de la localité.';
      setError(errorMessage);
      toast.current?.show({
        severity: 'error',
        summary: 'Erreur',
        detail: errorMessage,
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Ajouter une Localité</h1>
        <p className="page-subtitle">Créer une nouvelle localité dans le système</p>
      </div>
      
      <div className="form-container">
        <h2 className="form-title">{t('add_locality')}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
            {t('lacality_name')}
            </label>
            <InputText
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder={t('enter_locality_name')}
              className="form-input"
              disabled={loading}
            />
          </div>
          <div className="p-field">
            <label htmlFor="countryId" className="block mb-2 font-bold">
              {t('country')}
            </label>
            <Dropdown
              id="countryId"
              name="countryId"
              value={form.countryId}
              options={
                Array.isArray(countries)
                  ? countries.map((country) => ({
                      label: country.name,
                      value: country.id,
                    }))
                  : []
              }
              onChange={handleChange}
              placeholder={t('select_country')}
              className="w-full"
              disabled={loading}
            />
          </div>
          {error && <p className="text-red-600">{error}</p>}
          <div className="flex justify-end">
            <Button
              label={t('add')}
              icon="pi pi-check"
              type="submit"
              className="p-button-primary"
              disabled={loading}
              loading={loading}
            />
          </div>
        </form>
        <Toast ref={toast} position="bottom-right" />
      </div>
    </div>
  );
};

export default AddLocality;