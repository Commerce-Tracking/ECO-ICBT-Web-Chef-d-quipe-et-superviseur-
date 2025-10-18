import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
// import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
// import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
// import DemographicCard from "../../components/ecommerce/DemographicCard";
import PageMeta from "../../components/common/PageMeta";
import useAuth from "../../providers/auth/useAuth.ts";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function Home() {
  // @ts-ignore
  const { userInfo, userData, authMe } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    authMe(userInfo.id);
    console.log(localStorage.getItem("lang"));
  }, []);

  return (
    <div className="page-container">
      <PageMeta
        title={t("dashboard_title")}
        description={t("dashboard_description")}
      />

      <div className="page-header">
        <h1 className="page-title">{t("dashboard")}</h1>
        <p className="page-subtitle">{t("dashboard_subtitle")}</p>
      </div>

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* Bilan des plaintes */}
        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div>

        {/* Métriques des collectes */}
        <div className="col-span-12 xl:col-span-7">
          <EcommerceMetrics />
        </div>

        {/* <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div> */}

        {/* <div className="col-span-12 space-y-6 xl:col-span-7">
          <MonthlySalesChart />
        </div> */}

        {/* Statistiques */}
        {/* <div className="col-span-12">
          <StatisticsChart />
        </div> */}
      </div>
    </div>
  );
}
