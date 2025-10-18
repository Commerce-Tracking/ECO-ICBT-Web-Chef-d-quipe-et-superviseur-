import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import CollectionsTableOne from "../../components/tables/BasicTables/CollectionsTableOne.tsx";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";

export default function AddUserFormElements() {
  const { t, i18n } = useTranslation();
  const { userInfo } = useAuth();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const getPageTitle = () => {
    if (userInfo?.role_id === 5) {
      return t("validated_collections_by_team_managers");
    }
    return t("agent_collections");
  };

  return (
    <div>
      <PageMeta
        title="OFR | Admin"
        description="Opération Fluidité Routière Agro-bétail"
      />
      <PageBreadcrumb pageTitle={getPageTitle()} />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-12">
          <CollectionsTableOne />
        </div>
      </div>
    </div>
  );
}
