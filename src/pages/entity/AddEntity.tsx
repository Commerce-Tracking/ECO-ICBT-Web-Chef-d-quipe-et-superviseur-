
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import axiosInstance from '../../api/axios';
import PageMeta from '../../components/common/PageMeta';
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

import ComponentCard from '../../components/common/ComponentCard';
import Input from '../../components/form/input/InputField';
// import "primereact/resources/themes/lara-light-cyan/theme.css";
import { useTranslation } from "react-i18next";


const AddEntity = () => {
    const [name, setName] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const toast = useRef<Toast>(null);
    const navigate = useNavigate();


    const { t, i18n } = useTranslation();
  
    const changeLanguage = (lng: string) => {
      i18n.changeLanguage(lng);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Soumission du formulaire avec name :', name);

        if (!name.trim()) {
            setError('Le nom de l\'entité est requis.');
            toast.current?.show({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Le nom d\'une entité ne peut pas être vide.',
                // life: 3000,
            });
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                setError('Vous devez être connecté pour ajouter une entité.');
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erreur d’authentification',
                    detail: 'Aucun token d’authentification trouvé. Redirection vers la connexion...',
                    life: 3000,
                });
                setTimeout(() => navigate('/signin'), 3000);
                return;
            }

            const response = await axiosInstance.post(
                '/admin/service',
                { name: name.trim() },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log('Réponse API :', response.data);
            toast.current?.show({
                severity: 'success',
                summary: 'Succès',
                detail: `Entité "${response.data.data.name}" ajouté avec succès.`,
                life: 3000,
            });
            setName('');
        } catch (err: any) {
            console.error('Erreur API :', err);
            let errorMessage = 'Erreur lors de l\'ajout de l\'entité.';
            if (err.response?.status === 401 || err.response?.status === 403) {
                errorMessage = 'Token invalide ou non autorisé. Veuillez vous reconnecter.';
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erreur d’authentification',
                    detail: errorMessage,
                    life: 3000,
                });
                setTimeout(() => navigate('/signin'), 3000);
            } else {
                errorMessage = err.response?.data?.message || err.message || errorMessage;
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: errorMessage,
                    life: 3000,
                });
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <PageMeta
                title="OFR | Ajouter une entité"
                description="Ajouter une nouvelle entité  pour Opération Fluidité Routière Agro-bétail"
            />
            <PageBreadcrumb pageTitle={t('add_entity')} />
            <div className="space-y-6 p-4">
                <ComponentCard title={t('entity_form_title')}>
                    <form onSubmit={handleSubmit} className="p-4">
                        <div className="p-field mb-4">
                            <label htmlFor="name" className="block mb-2 font-bold">
                           {t('entity_name')}
                            </label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={t('enter_entity_name')}
                                className="w-full p-inputtext-lg"
                                disabled={loading}
                            />
                            {error && <p className="text-red-600 mt-2">{error}</p>}
                        </div>
                        <button
                            type="submit"
                            className="px-3 py-1 text-sm text-white bg-blue-900 rounded   flex items-center justify-center"
                            disabled={loading || !name.trim()}
                        >
                            {loading && (
                                <svg
                                    className="animate-spin h-5 w-5 mr-2 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                            )}
                         {t('add')}
                        </button>
                    </form>
                    <Toast ref={toast} position="bottom-right" />
                </ComponentCard>
            </div>
        </>
    );
};

export default AddEntity;