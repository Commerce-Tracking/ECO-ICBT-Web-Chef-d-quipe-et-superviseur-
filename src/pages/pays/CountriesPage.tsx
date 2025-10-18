import React from 'react';
import CountriesTable from './CountriesTable';
import PageMeta from '../../components/common/PageMeta';
// import PageBreadcrumb from '../../components/common/PageBreadcrumb';
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useTranslation } from "react-i18next";





const CountriesPage = () => {


    const { t, i18n } = useTranslation();
  
    const changeLanguage = (lng: string) => {
      i18n.changeLanguage(lng);
    };


  return (
    <>
      <PageMeta
        title="OFR | Liste des pays"
        description="Consulter la liste des pays pour Opération Fluidité Routière Agro-bétail"
      />
      <PageBreadcrumb pageTitle={t('country_list')} />
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Gestion des Pays</h1>
          <p className="page-subtitle">Liste et gestion des pays du système</p>
        </div>
        <CountriesTable />
      </div>
    </>
  );
};

export default CountriesPage;