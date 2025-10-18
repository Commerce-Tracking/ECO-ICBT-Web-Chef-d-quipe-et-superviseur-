import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import UsersTableOne from "../../components/tables/BasicTables/UsersTableOne.tsx";
import UsersRolesTableOne from "../../components/tables/BasicTables/UsersRolesTableOne.tsx";
import { t } from "i18next";
import {useTranslation} from "react-i18next";


export default function UsersRolesTables() {


  const { t, i18n } = useTranslation();
              
                  const changeLanguage = (lng: string) => {
                      i18n.changeLanguage(lng);
                  };
  return (
    <>
      <PageMeta
        title="OFR | Admin"
        description="Opération Fluidité Routière Agro-bétail"
      />
      <PageBreadcrumb pageTitle={t('roles')} />
      <div className="space-y-6">
        <ComponentCard title={t('role_list')}>
          <UsersRolesTableOne />
        </ComponentCard>
      </div>
    </>
  );
}
