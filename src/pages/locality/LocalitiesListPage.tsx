import React from 'react';
import LocalitiesTable from './LocalitiesTable';
import PageMeta from '../../components/common/PageMeta';
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useTranslation } from "react-i18next";



const LocalitiesListPage = () => {

  const { t, i18n } = useTranslation();
      
        const changeLanguage = (lng: string) => {
          i18n.changeLanguage(lng);
        };
  return (
    <>
      <PageMeta
        title="OFR | Liste des localités"
        description="Consulter la liste des localités pour Opération Fluidité Routière Agro-bétail"
      />
      <PageBreadcrumb pageTitle={t('locality_list')} />
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Gestion des Localités</h1>
          <p className="page-subtitle">Liste et gestion des localités par pays</p>
        </div>
        <LocalitiesTable />
      </div>
    </>
  );
};

export default LocalitiesListPage;