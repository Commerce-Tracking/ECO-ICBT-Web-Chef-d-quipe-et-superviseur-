import PageBreadcrumb from "../components/common/PageBreadCrumb";
import UserMetaCard from "../components/UserProfile/UserMetaCard";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
import UserAddressCard from "../components/UserProfile/UserAddressCard";
import PageMeta from "../components/common/PageMeta";
import LanguageSwitcher from "../components/common/LanguageSwitcher.tsx";
import {useTranslation} from "react-i18next";


export default function UserProfiles() {

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
            <PageBreadcrumb pageTitle="Profil" />
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <div className="mb-5">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                            {t('profile_info')}
                        </h3>
                        <LanguageSwitcher />
                    </div>
                </div>


                <div className="space-y-6">
                    <UserMetaCard />
                    <UserInfoCard />
                    <UserAddressCard />
                </div>
            </div>
        </>
    );
}
