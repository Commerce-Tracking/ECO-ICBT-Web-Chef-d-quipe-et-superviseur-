import React, { useState, useEffect, useRef, useMemo } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import axiosInstance from "../../../api/axios";
import ComponentCard from "../../common/ComponentCard";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../context/AuthContext";

interface Agent {
  id: number;
  last_name: string;
  first_name: string;
  phone: string;
  email: string;
  role: string;
  validation_count: string;
  collection_count?: string; // Nombre total de collections
  last_activity: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  result: {
    data: Agent[];
    total: number;
    page: number;
    limit: number;
  };
  errors: any;
  except: any;
}

const UsersTableOne = () => {
  const { userInfo } = useAuth();
  const { t, i18n } = useTranslation();
  const [, forceUpdate] = useState({});
  const [tableData, setTableData] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const toast = useRef<Toast>(null);

  // Déterminer le titre selon le rôle
  const getTableTitle = () => {
    if (userInfo?.role_id === 5) {
      return t("assigned_team_managers"); // Chef d'équipe assignés
    }
    return t("assigned_agents"); // Agents assignés
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const url = "/trade-flow/agents/assigned";
        const params: Record<string, string> = {
          page: "1",
          limit: "10",
          search: "string",
        };
        console.log("Tentative de connexion à l'API...");
        console.log(
          "URL complète:",
          `${url}?${new URLSearchParams(params).toString()}`
        );
        console.log("Token d'accès:", localStorage.getItem("accessToken"));

        const response = await axiosInstance.get<ApiResponse>(url, { params });
        console.log(
          "Réponse API complète:",
          JSON.stringify(response.data, null, 2)
        );

        if (response.data.success) {
          // Vérifier si result existe et si result.data est un tableau
          if (
            !response.data.result ||
            !response.data.result.data ||
            !Array.isArray(response.data.result.data)
          ) {
            console.error(
              "response.data.result.data n'est pas un tableau ou est absent:",
              response.data.result
            );
            throw new Error(
              "La réponse de l'API ne contient pas un tableau dans result.data"
            );
          }

          const transformedData: Agent[] = response.data.result.data.map(
            (item: any) => ({
              id: item.agent_id, // Utiliser agent_id au lieu de id
              last_name: item.last_name,
              first_name: item.first_name,
              phone: item.phone,
              email: item.email,
              role: item.role || "Agent", // Valeur par défaut si pas de rôle
              validation_count: item.validation_count || "0", // Valeur par défaut
              collection_count: item.collection_count, // Le champ existe dans l'API
              last_activity: item.last_activity,
            })
          );

          setTableData(transformedData);
          setTotalRecords(response.data.result.total || transformedData.length); // Utiliser result.total pour la pagination
        } else {
          setError(
            response.data.message ||
              "Erreur lors de la récupération des agents."
          );
          setTableData([]);
        }
      } catch (err: any) {
        console.error("Erreur détaillée:", err);
        console.error("Code d'erreur:", err.code);
        console.error("Message d'erreur:", err.message);
        console.error("Réponse d'erreur:", err.response?.data);
        console.error("Statut HTTP:", err.response?.status);
        console.error("URL envoyée:", err.response?.config?.url);

        let errorMessage =
          "Erreur lors de la récupération des agents assignés.";

        if (err.code === "ERR_NETWORK") {
          errorMessage =
            "Erreur de connexion réseau. Vérifiez votre connexion internet.";
        } else if (err.response?.status === 401) {
          errorMessage = "Session expirée. Veuillez vous reconnecter.";
        } else if (err.response?.status === 403) {
          errorMessage = "Accès refusé. Vérifiez vos permissions.";
        } else if (err.response?.status === 404) {
          errorMessage = `Endpoint non trouvé. Vérifiez l'URL de l'API : ${err.response?.config?.url}`;
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else {
          errorMessage =
            err.message ||
            "Erreur inattendue lors de la récupération des agents.";
        }

        setError(errorMessage);
        toast.current?.show({
          severity: "error",
          summary: "Erreur de connexion",
          detail: errorMessage,
          life: 5000,
        });
        setTableData([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Force le re-rendu quand la langue change
  useEffect(() => {
    forceUpdate({});
  }, [i18n.language]);

  const handleViewDetails = (agent: Agent) => {
    setSelectedAgent(agent);
    setTimeout(() => setIsModalVisible(true), 10);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setTimeout(() => setSelectedAgent(null), 300);
  };

  const onPageChange = (event: any) => {
    setCurrentPage(event.page + 1);
    setRowsPerPage(event.rows);
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const actionBodyTemplate = useMemo(() => {
    return (rowData: Agent) => {
      // Forcer le re-rendu en utilisant la langue actuelle
      const currentLang = i18n.language;
      return (
        <button
          onClick={() => handleViewDetails(rowData)}
          className="px-3 py-1 text-sm text-white bg-green-600 rounded"
          key={`${rowData.id}-${currentLang}`}
        >
          {t("view_details")}
        </button>
      );
    };
  }, [i18n.language, t]);

  if (isLoading) {
    return <div>{t("loading")}</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <div className="mb-4">
          <p className="text-red-600 dark:text-red-400 mb-2">
            {t("error")} : {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            {t("retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <ComponentCard title={getTableTitle()}>
        <DataTable
          key={`datatable-${i18n.language}`}
          value={tableData}
          loading={isLoading}
          responsiveLayout="scroll"
          showGridlines
          rows={rowsPerPage}
          first={(currentPage - 1) * rowsPerPage}
          totalRecords={totalRecords}
          onPage={onPageChange}
          filterDisplay="row"
          globalFilterFields={["name", "phone", "email"]}
          emptyMessage={t("no_assigned_agents_found")}
          paginator
          rowsPerPageOptions={[5, 10, 25]}
          tableStyle={{ minWidth: "50rem" }}
          className="p-datatable-sm"
        >
          <Column
            field="first_name"
            header={t("name")}
            body={(rowData) => `${rowData.first_name} ${rowData.last_name}`}
            filter
            filterPlaceholder={t("search_by_name")}
            style={{ width: "25%" }}
          />
          <Column
            field="phone"
            header={t("phone")}
            filter
            filterPlaceholder={t("search_by_phone")}
            style={{ width: "20%" }}
          />
          <Column
            field="email"
            header={t("email")}
            filter
            filterPlaceholder={t("search_by_email")}
            style={{ width: "25%" }}
          />
          <Column
            field={
              userInfo?.role_id === 4 ? "collection_count" : "validation_count"
            }
            header={
              userInfo?.role_id === 5 ? t("validations") : t("collection")
            }
            style={{ width: "15%" }}
          />
          <Column
            header={t("actions")}
            body={actionBodyTemplate}
            style={{ width: "20%" }}
          />
        </DataTable>
      </ComponentCard>
      <Dialog
        visible={isModalVisible}
        header={
          userInfo?.role_id === 5
            ? t("team_manager_details")
            : t("agent_details")
        }
        modal
        style={{ width: "30rem" }}
        onHide={handleCloseModal}
      >
        {selectedAgent && (
          <div className="p-4 space-y-2">
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">{t("full_name")} :</span>{" "}
              {selectedAgent.first_name} {selectedAgent.last_name}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">{t("pers_first_name")} :</span>{" "}
              {selectedAgent.first_name}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">{t("pers_name")} :</span>{" "}
              {selectedAgent.last_name}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">{t("phone")} :</span>{" "}
              {selectedAgent.phone}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">{t("email")} :</span>{" "}
              {selectedAgent.email}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">
                {userInfo?.role_id === 5 ? t("validations") : t("collection")} :
              </span>{" "}
              {userInfo?.role_id === 4
                ? selectedAgent.collection_count
                : selectedAgent.validation_count}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">{t("last_activity")} :</span>{" "}
              {new Date(selectedAgent.last_activity).toLocaleString()}
            </p>
            <div className="flex justify-end mt-4">
              <Button
                label={t("close")}
                icon="pi pi-times"
                unstyled
                className="bg-[#00277F] hover:bg-[#001f66] text-white font-semibold px-4 py-2 rounded-lg shadow-md transition"
                onClick={handleCloseModal}
              />
            </div>
          </div>
        )}
      </Dialog>
      <Toast ref={toast} position="bottom-right" />
    </div>
  );
};

export default UsersTableOne;
