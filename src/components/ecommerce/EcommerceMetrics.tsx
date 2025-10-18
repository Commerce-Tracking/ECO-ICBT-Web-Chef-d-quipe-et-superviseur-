import React, { useEffect, useState } from "react";
import { FileIcon, ListIcon } from "../../icons";
import Badge from "../ui/badge/Badge";
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

export default function EcommerceMetrics() {
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
      } catch (error) {
        console.error(t("error_fetching_collection_stats"), error);
      }
    };

    fetchStats();
  }, []);

  // Fonction pour déterminer les métriques selon le rôle
  const getMetricsForRole = () => {
    const roleId = userInfo?.role_id;

    if (roleId === 5) {
      // Superviseur
      return {
        firstCard: {
          title: t("to_validate_team_manager"),
          value: stats.validated_by_team_manager,
          color: "warning" as const,
          icon: (
            <ListIcon className="text-gray-800 size-6 dark:text-white/90" />
          ),
        },
        secondCard: {
          title: t("validated_collections"),
          value: stats.validated_by_supervisor,
          color: "success" as const,
          icon: (
            <FileIcon className="text-gray-800 size-6 dark:text-white/90" />
          ),
        },
      };
    } else if (roleId === 4) {
      // Chef d'équipe
      return {
        firstCard: {
          title: t("submitted_collections"),
          value: stats.submitted_by_collector,
          color: "warning" as const,
          icon: (
            <ListIcon className="text-gray-800 size-6 dark:text-white/90" />
          ),
        },
        secondCard: {
          title: t("validated_collections"),
          value: stats.validated_by_team_manager,
          color: "success" as const,
          icon: (
            <FileIcon className="text-gray-800 size-6 dark:text-white/90" />
          ),
        },
      };
    } else {
      // Par défaut (autres rôles)
      return {
        firstCard: {
          title: t("total_collections"),
          value: stats.total_submitted + stats.total_validated,
          color: "info" as const,
          icon: (
            <ListIcon className="text-gray-800 size-6 dark:text-white/90" />
          ),
        },
        secondCard: {
          title: t("total_rejected"),
          value: stats.total_rejected,
          color: "error" as const,
          icon: (
            <FileIcon className="text-gray-800 size-6 dark:text-white/90" />
          ),
        },
      };
    }
  };

  const metrics = getMetricsForRole();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* Première carte */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          {metrics.firstCard.icon}
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {metrics.firstCard.title}
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {metrics.firstCard.value.toLocaleString()}
            </h4>
          </div>
          {/* <Badge color={metrics.firstCard.color}>Voir tout</Badge> */}
        </div>
      </div>

      {/* Deuxième carte */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          {metrics.secondCard.icon}
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {metrics.secondCard.title}
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {metrics.secondCard.value.toLocaleString()}
            </h4>
          </div>
          {/* <Badge color={metrics.secondCard.color}>Voir tout</Badge> */}
        </div>
      </div>
    </div>
  );
}
