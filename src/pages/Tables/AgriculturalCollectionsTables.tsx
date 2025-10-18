import React from "react";
import PageBreadCrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import AgriculturalCollectionsTableOne from "../../components/tables/BasicTables/AgriculturalCollectionsTableOne";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";

const AgriculturalCollectionsTables = () => {
  const { userInfo } = useAuth();
  const { t } = useTranslation();

  const getPageTitle = () => {
    if (userInfo?.role_id === 4) {
      return t("agricultural_collections");
    } else if (userInfo?.role_id === 5) {
      return t("agricultural_collections");
    }
    return t("agricultural_collections");
  };

  return (
    <div className="space-y-6">
      <PageBreadCrumb pageTitle={getPageTitle()} />
      <ComponentCard title={getPageTitle()}>
        <AgriculturalCollectionsTableOne />
      </ComponentCard>
    </div>
  );
};

export default AgriculturalCollectionsTables;
