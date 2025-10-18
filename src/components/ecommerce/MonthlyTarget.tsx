import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useState, useEffect } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { CalenderIcon } from "../../icons";
import axiosInstance from "../../api/axios";
import useAuth from "../../providers/auth/useAuth";
import { useTranslation } from "react-i18next";

interface CollectionStats {
  submitted_by_collector: number;
  validated_by_team_manager: number;
  validated_by_supervisor: number;
  rejected_by_team_manager: number;
  rejected_by_supervisor: number;
  total_submitted: number;
  total_validated: number;
  total_rejected: number;
  period: any;
}

export default function MonthlyTarget() {
  const auth = useAuth();
  const userInfo = auth?.userInfo;
  const { t } = useTranslation();
  const [stats, setStats] = useState<CollectionStats>({
    submitted_by_collector: 0,
    validated_by_team_manager: 0,
    validated_by_supervisor: 0,
    rejected_by_team_manager: 0,
    rejected_by_supervisor: 0,
    total_submitted: 0,
    total_validated: 0,
    total_rejected: 0,
    period: {},
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axiosInstance.get(
          "/trade-flow/collections/counts/by-level",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.success && res.data.result) {
          setStats(res.data.result);
        }
        setIsLoading(false);
      } catch (error) {
        console.error(t("error_fetching_collection_stats"), error);
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Fonction pour calculer les métriques selon le rôle
  const getMetricsForRole = () => {
    const roleId = userInfo?.role_id;

    if (roleId === 5) {
      // Superviseur
      // Total = collectes validées par le chef d'équipe (ce qu'il doit traiter)
      const totalToProcess = stats.validated_by_team_manager;
      return {
        totalCollections: totalToProcess, // Collectes à traiter par le superviseur
        processedCollections: stats.validated_by_supervisor, // Collectes validées par le superviseur
        rejectedCollections: stats.rejected_by_supervisor, // Collectes rejetées par le superviseur
      };
    } else if (roleId === 4) {
      // Chef d'équipe
      // Total = collectes soumises par les collecteurs (ce qu'il doit traiter)
      const totalToProcess = stats.submitted_by_collector;
      return {
        totalCollections: totalToProcess, // Collectes à traiter par le chef d'équipe
        processedCollections: stats.validated_by_team_manager, // Collectes validées par le chef d'équipe
        rejectedCollections: stats.rejected_by_team_manager, // Collectes rejetées par le chef d'équipe
      };
    } else {
      // Autres rôles - vue globale
      return {
        totalCollections:
          stats.total_submitted + stats.total_validated + stats.total_rejected,
        processedCollections: stats.total_validated,
        rejectedCollections: stats.total_rejected,
      };
    }
  };

  const metrics = getMetricsForRole();

  // Calculate percentage of processed collections for the radial bar
  const processedPercentage = metrics.totalCollections
    ? ((metrics.processedCollections / metrics.totalCollections) * 100).toFixed(
        2
      )
    : 0;
  const series = [Number(processedPercentage)];

  // Calculate percentage change based on performance
  const calculatePercentageChange = () => {
    const currentPercentage = Number(processedPercentage);

    // Logique de calcul du pourcentage de changement
    if (currentPercentage >= 90) {
      return { text: "+15%", isPositive: true }; // Excellent performance
    } else if (currentPercentage >= 80) {
      return { text: "+10%", isPositive: true }; // Bonne performance
    } else if (currentPercentage >= 70) {
      return { text: "+5%", isPositive: true }; // Performance moyenne
    } else if (currentPercentage >= 60) {
      return { text: "+2%", isPositive: true }; // Performance faible
    } else {
      return { text: "-5%", isPositive: false }; // Performance très faible
    }
  };

  // Get current date
  const getCurrentDate = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const options: ApexOptions = {
    colors: ["#1A6C30"], // Vert principal de la nouvelle charte
    chart: {
      fontFamily: "DM Sans, sans-serif",
      type: "radialBar",
      height: 330,
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -85,
        endAngle: 85,
        hollow: {
          size: "80%",
        },
        track: {
          background: "#e1e5ea", // Gris clair de la nouvelle palette
          strokeWidth: "100%",
          margin: 5,
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            fontSize: "36px",
            fontWeight: "600",
            offsetY: -40,
            color: "#1b2e3b", // Gris sombre de la nouvelle palette
            formatter: function (val) {
              return val + "%";
            },
          },
        },
      },
    },
    fill: {
      type: "solid",
      colors: ["#1A6C30"], // Vert principal de la nouvelle charte
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Progress"],
  };

  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  if (isLoading) {
    return <div>{t("loading")}</div>;
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              {t("collection_summary")}
            </h3>
          </div>
          <div className="relative inline-block">
            <button className="dropdown-toggle" onClick={toggleDropdown}>
              <p className="flex items-center justify-center mt-1 gap-1 text-gray-500 text-theme-sm dark:text-gray-400">
                {getCurrentDate()}{" "}
                <CalenderIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
              </p>
            </button>
            <Dropdown
              isOpen={isOpen}
              onClose={closeDropdown}
              className="w-40 p-2"
            >
              <DropdownItem
                onItemClick={closeDropdown}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                ...
              </DropdownItem>
            </Dropdown>
          </div>
        </div>
        <div className="relative">
          <div className="max-h-[330px]" id="chartDarkStyle">
            <Chart
              options={options}
              series={series}
              type="radialBar"
              height={330}
            />
          </div>
          <span
            className={`absolute left-1/2 top-full -translate-x-1/2 -translate-y-[95%] rounded-full px-3 py-1 text-xs font-medium ${
              calculatePercentageChange().isPositive
                ? "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500"
                : "bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500"
            }`}
          >
            {calculatePercentageChange().text}
          </span>
        </div>
        <p className="mx-auto mt-10 w-full max-w-[380px] text-center text-sm text-gray-500 sm:text-base">
          {t("processed_collections_message", {
            count: metrics.processedCollections,
          })}
        </p>
      </div>
      <div className="flex items-center justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5">
        <div>
          <p className="mb-1 text-center text-gray-800 text-theme-xs dark:text-gray-400 sm:text-sm">
            {t("total_collections")}
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            {metrics.totalCollections}
          </p>
        </div>
        <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>
        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            {t("processed_collections")}
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            {metrics.processedCollections}
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.60141 2.33683C7.73885 2.18084 7.9401 2.08243 8.16435 2.08243C8.16475 2.08243 8.16516 2.08243 8.16556 2.08243C8.35773 2.08219 8.54998 2.15535 8.69664 2.30191L12.6968 6.29924C12.9898 6.59203 12.9899 7.0669 12.6971 7.3599C12.4044 7.6529 11.9295 7.65306 11.6365 7.36027L8.91435 4.64004L8.91435 13.5C8.91435 13.9142 8.57856 14.25 8.16435 14.25C7.75013 14.25 7.41435 13.9142 7.41435 13.5L7.41435 4.64442L4.69679 7.36025C4.4038 7.65305 3.92893 7.6529 3.63613 7.35992C3.34333 7.06693 3.34348 6.59206 3.63646 6.29926L7.60141 2.33683Z"
                fill="#039855"
              />
            </svg>
          </p>
        </div>
        <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>
        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            {t("rejected_collections")}
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            {metrics.rejectedCollections}
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.26816 13.6632C7.4056 13.8192 7.60686 13.9176 7.8311 13.9176C7.83148 13.9176 7.83187 13.9176 7.83226 13.9176C8.02445 13.9178 8.21671 13.8447 8.36339 13.6981L12.3635 9.70076C12.6565 9.40797 12.6567 8.9331 12.3639 8.6401C12.0711 8.34711 11.5962 8.34694 11.3032 8.63973L8.5811 11.36L8.5811 2.5C8.5811 2.08579 8.24531 1.75 7.8311 1.75C7.41688 1.75 7.0811 2.08579 7.0811 2.5L7.0811 11.3556L4.36354 8.63975C4.07055 8.34695 3.59568 8.3471 3.30288 8.64009C3.01008 8.93307 3.01023 9.40794 3.30321 9.70075L7.26816 13.6632Z"
                fill="#D92D20"
              />
            </svg>
          </p>
        </div>
      </div>
    </div>
  );
}
