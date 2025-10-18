import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import UsersTableOne from "../../components/tables/BasicTables/UsersTableOne.tsx";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";

export default function UsersTables() {
  const { t, i18n } = useTranslation();
  const { userInfo } = useAuth();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  // Déterminer le titre selon le rôle
  const getPageTitle = () => {
    if (userInfo?.role_id === 5) {
      return t("assigned_team_managers"); // Chef d'équipe assignés
    }
    return t("assigned_agents"); // Agents assignés
  };
  return (
    <>
      <PageMeta
        title="OFR | Admin"
        description="Opération Fluidité Routière Agro-bétail"
      />
      <PageBreadcrumb pageTitle={getPageTitle()} />
      <div className="space-y-6">
        <ComponentCard title={getPageTitle()}>
          <UsersTableOne />
        </ComponentCard>
      </div>
    </>
  );
}
