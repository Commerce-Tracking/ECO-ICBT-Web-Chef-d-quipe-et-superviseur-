import React from 'react';
import ReportsTables from './ReportsTables';
import PageMeta from '../../components/common/PageMeta';

// import ErrorBoundary from '../../components/common/ErrorBoundary';
// import ErrorBoundary from '../../components/common/PageBreadCrumb'
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import { useTranslation } from "react-i18next";


const ReportsListPage = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  return (
    <>
      <PageMeta
        title="OFR | Liste des reportings"
        description="Consulter la liste des reportings pour Opération Fluidité Routière Agro-bétail"
      />
      <PageBreadcrumb pageTitle={t('reporting_list')} />
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Liste des Rapports</h1>
          <p className="page-subtitle">Gestion et consultation des rapports</p>
        </div>
        {/* <ErrorBoundary> */}
          <ReportsTables />
        {/* </ErrorBoundary> */}
      </div>
    </>
  );
};

export default ReportsListPage;