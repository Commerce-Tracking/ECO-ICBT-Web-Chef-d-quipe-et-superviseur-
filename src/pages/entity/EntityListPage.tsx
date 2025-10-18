import React from 'react';
// import LocalitiesTable from './LocalitiesTable';
import PageMeta from '../../components/common/PageMeta';
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import EntityTable from './EntityTable';
import { useTranslation } from "react-i18next";



const  EntityListPage = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <>
      <PageMeta
        title="OFR | Liste des entités"
        description="Consulter la liste des entités pour Opération Fluidité Routière Agro-bétail"
      />
      <PageBreadcrumb pageTitle={t('entity_list')} />
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Gestion des Entités</h1>
          <p className="page-subtitle">Liste et gestion des entités de service</p>
        </div>
        <EntityTable />
      </div>
    </>
  );
};

export default EntityListPage;