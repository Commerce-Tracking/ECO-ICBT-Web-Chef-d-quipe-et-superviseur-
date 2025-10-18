import React, { useState, useEffect, useRef, useMemo } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { FilterService } from "primereact/api";
import { Dropdown } from "primereact/dropdown";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axios";
import ComponentCard from "../../components/common/ComponentCard";
import { useTranslation } from "react-i18next";

interface Reporting {
  id: string;
  title: string;
  description: string;
  generatedBy: string;
  type: string;
  createdAt: string;
  attachments: { id: string; url: string; format: string }[];
}

interface Admin {
  id: string;
  name: string;
}

const reportTypes = [
  { label: "Incident", value: "Incident" },
  { label: "Rapport", value: "Rapport" },
  { label: "Observation", value: "Observation" },
];

const ReportsTables = () => {
  const [reportings, setReportings] = useState<Reporting[]>([]);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedReporting, setSelectedReporting] = useState<Reporting | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();

  const { t, i18n } = useTranslation();
  const [, forceUpdate] = useState({});

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  // Récupérer les reportings et le profil admin
  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.current?.show({
          severity: "error",
          summary: "Erreur d’authentification",
          detail:
            "Aucun token d’authentification trouvé. Redirection vers la connexion...",
          life: 3000,
        });
        setTimeout(() => navigate("/signin"), 3000);
        return;
      }

      const [reportingsResponse, adminResponse] = await Promise.all([
        axiosInstance.get("/reportings", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axiosInstance.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      console.log("Réponse API GET /reportings :", reportingsResponse.data);
      console.log("Réponse API GET /auth/me :", adminResponse.data);

      // Gestion flexible de la structure de la réponse
      const reportingsData = Array.isArray(reportingsResponse.data)
        ? reportingsResponse.data
        : Array.isArray(reportingsResponse.data?.results)
        ? reportingsResponse.data.results
        : Array.isArray(reportingsResponse.data?.data)
        ? reportingsResponse.data.data
        : [];
      setReportings(reportingsData);
      setTotalRecords(reportingsData.length);
      setAdmin({
        id: adminResponse.data?.data?.id || "",
        name: adminResponse.data?.data?.name || "Admin",
      });
    } catch (err: any) {
      console.error("Erreur API :", err);
      const errorMessage =
        err.response?.data?.message ||
        "Erreur lors de la récupération des données.";
      toast.current?.show({
        severity: "error",
        summary: "Erreur",
        detail: errorMessage,
        life: 3000,
      });
      setReportings([]);
      setAdmin(null);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setTimeout(() => navigate("/signin"), 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate]);

  // Force le re-rendu quand la langue change
  useEffect(() => {
    forceUpdate({});
  }, [i18n.language]);

  // Gestion de la pagination
  const onPageChange = (event: any) => {
    setCurrentPage(event.page + 1);
    setRowsPerPage(event.rows);
  };

  // Filtre de date personnalisé
  useEffect(() => {
    FilterService.register("custom_date", (value, filters) => {
      const [from, to] = filters ?? [null, null];
      if (!from && !to) return true;
      if (from && !to) return new Date(from) <= new Date(value);
      if (!from && to) return new Date(value) <= new Date(to);
      return (
        new Date(from) <= new Date(value) && new Date(value) <= new Date(to)
      );
    });
  }, []);

  // Template pour le filtre de date
  const dateRangeFilterTemplate = (options: any) => {
    return (
      <div className="p-fluid">
        <div className="p-inputgroup">
          <input
            type="date"
            onChange={(e) => options.filterApplyCallback(e.target.value)}
          />
        </div>
      </div>
    );
  };

  // Template pour le filtre de type
  const typeFilterTemplate = (options: any) => {
    return (
      <Dropdown
        value={options.value}
        options={reportTypes}
        onChange={(e) => options.filterApplyCallback(e.value)}
        placeholder="Filtrer par type"
        className="p-column-filter"
        showClear
      />
    );
  };

  // Tronquer le texte
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Template pour le titre
  const titleBodyTemplate = (rowData: Reporting) => {
    return truncateText(rowData.title, 30);
  };

  // Template pour la description
  const descriptionBodyTemplate = (rowData: Reporting) => {
    return truncateText(rowData.description, 30);
  };

  // Afficher les attachements
  const attachmentsBodyTemplate = (rowData: Reporting) => {
    return rowData.attachments.length > 0 ? (
      <a
        href={rowData.attachments[0].url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {rowData.attachments[0].format.toUpperCase()}
      </a>
    ) : (
      "Aucun"
    );
  };

  // Colonne des actions
  const actionBodyTemplate = useMemo(() => {
    return (rowData: Reporting) => {
      const currentLang = i18n.language;
      return (
        <button
          onClick={() => setSelectedReporting(rowData)}
          className="px-3 py-1 text-sm text-white bg-blue-900 rounded"
          key={`${rowData.id}-${currentLang}`}
        >
          {t("view_details")}
        </button>
      );
    };
  }, [i18n.language, t]);

  // Détails du reporting dans la modale
  const renderReportingDetails = () => {
    if (!selectedReporting) return null;
    return (
      <div className="p-4">
        <h3 className="text-lg font-bold mb-4">{t("reporting_list")}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p>
              <strong>{t("title")} :</strong> {selectedReporting.title}
            </p>
            <p>
              <strong>{t("description")} :</strong>{" "}
              {selectedReporting.description}
            </p>
          </div>
          <div>
            <p>
              <strong>{t("type")} :</strong> {selectedReporting.type}
            </p>
            <p>
              <strong>{t("date_creation")}:</strong>{" "}
              {new Date(selectedReporting.createdAt).toLocaleDateString()}
            </p>
            <p>
              <strong>{t("attachements")} :</strong>{" "}
              {selectedReporting.attachments.length > 0 ? (
                <a
                  href={selectedReporting.attachments[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {selectedReporting.attachments[0].format.toUpperCase()}
                </a>
              ) : (
                "Aucun"
              )}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Liste des Rapports</h1>
        <p className="page-subtitle">Gestion et consultation des rapports</p>
      </div>

      <div className="content-card">
        <div className="content-card-header">
          <h2 className="content-card-title">{t("reporting_list")}</h2>
        </div>
        <div className="content-card-body">
          <DataTable
            key={`datatable-${i18n.language}`}
            value={reportings || []}
            loading={loading}
            responsiveLayout="scroll"
            showGridlines
            rows={rowsPerPage}
            first={(currentPage - 1) * rowsPerPage}
            totalRecords={totalRecords}
            onPage={onPageChange}
            filterDisplay="row"
            globalFilterFields={["title", "description", "type"]}
            emptyMessage="Aucun reporting trouvé."
            paginator
            rowsPerPageOptions={[5, 10, 25]}
          >
            <Column
              field="title"
              header={t("title")}
              filter
              filterPlaceholder="Rechercher un titre"
              body={titleBodyTemplate}
              style={{ width: "25%" }}
            />
            <Column
              field="description"
              header={t("description")}
              filter
              filterPlaceholder="Rechercher une description"
              body={descriptionBodyTemplate}
              style={{ width: "35%" }}
            />
            <Column
              field="type"
              header={t("type")}
              filter
              filterElement={typeFilterTemplate}
              body={(rowData) => rowData.type}
              style={{ width: "5%" }}
            />
            <Column
              field="createdAt"
              header={t("date_creation")}
              filter
              filterElement={dateRangeFilterTemplate}
              showFilterMenu={false}
              body={(rowData) =>
                new Date(rowData.createdAt).toLocaleDateString()
              }
              style={{ width: "15%" }}
            />
            <Column
              header={t("Attachements")}
              body={attachmentsBodyTemplate}
              style={{ width: "15%" }}
            />
            <Column
              header={t("details")}
              body={actionBodyTemplate}
              style={{ width: "20%" }}
            />
          </DataTable>
        </div>
      </div>
      <Dialog
        header={t("reporting_details")}
        visible={!!selectedReporting}
        style={{ width: "50vw" }}
        onHide={() => setSelectedReporting(null)}
        footer={
          <div>
            <Button
              label={t("close")}
              icon="pi pi-times"
              className="p-button-sm p-button-secondary"
              onClick={() => setSelectedReporting(null)}
            />
          </div>
        }
      >
        {renderReportingDetails()}
      </Dialog>
      <Toast ref={toast} position="bottom-right" />
    </div>
  );
};

export default ReportsTables;
