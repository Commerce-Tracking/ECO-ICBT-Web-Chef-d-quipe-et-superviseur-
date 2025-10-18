import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import axiosInstance from "../../api/axios";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Input from "../../components/form/input/InputField";
import { useTranslation } from "react-i18next";

interface Admin {
  id: string;
  name: string;
}

const reportTypes = [
  { label: "Incident", value: "Incident" },
  { label: "Rapport", value: "Rapport" },
  { label: "Observation", value: "Observation" },
]; // À ajuster selon ton API

const AddReportForm = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [attachmentUrl, setAttachmentUrl] = useState<string>("");
  const [attachmentFormat, setAttachmentFormat] = useState<string>("pdf");
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();

  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  // Récupérer les infos de l'admin connecté via GET /auth/me
  useEffect(() => {
    const fetchAdmin = async () => {
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

        const response = await axiosInstance.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Réponse API GET /auth/me :", response.data);
        setAdmin({
          id: response.data?.data?.id || "",
          name: response.data?.data?.name || "Admin",
        });
      } catch (err: any) {
        console.error("Erreur API GET /auth/me :", err);
        toast.current?.show({
          severity: "error",
          summary: "Erreur",
          detail: "Erreur lors de la récupération du profil.",
          life: 3000,
        });
        if (err.response?.status === 401 || err.response?.status === 403) {
          setTimeout(() => navigate("/signin"), 3000);
        }
      }
    };

    fetchAdmin();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !type || !admin?.id) {
      setError("Tous les champs obligatoires doivent être remplis.");
      toast.current?.show({
        severity: "error",
        summary: "Erreur",
        detail: "Veuillez remplir tous les champs obligatoires.",
        life: 3000,
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("Aucun token d’authentification trouvé.");
      }

      const body = {
        title: title.trim(),
        description: description.trim(),
        generatedBy: admin.id,
        type,
        attachments: attachmentUrl
          ? [{ url: attachmentUrl, format: attachmentFormat }]
          : [],
      };

      const response = await axiosInstance.post("/reportings", body, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Réponse API POST /reportings :", response.data);
      toast.current?.show({
        severity: "success",
        summary: "Succès",
        detail: `Reporting "${response.data.title}" ajouté avec succès.`,
        life: 3000,
      });
      setTitle("");
      setDescription("");
      setType("");
      setAttachmentUrl("");
      setAttachmentFormat("pdf");
    } catch (err: any) {
      console.error("Erreur API :", err);
      const errorMessage =
        err.response?.data?.message || "Erreur lors de l’ajout du reporting.";
      setError(errorMessage);
      toast.current?.show({
        severity: "error",
        summary: "Erreur",
        detail: errorMessage,
        life: 3000,
      });
      if (err.response?.status === 401 || err.response?.status === 403) {
        setTimeout(() => navigate("/signin"), 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <PageMeta
        title="OFR | Ajouter un reporting"
        description="Ajouter un nouveau reporting pour Opération Fluidité Routière Agro-bétail"
      />
      <PageBreadcrumb pageTitle={t("add_reporting")} />
      
      <div className="page-header">
        <h1 className="page-title">Créer un Rapport</h1>
        <p className="page-subtitle">Générer un nouveau rapport ou signalement</p>
      </div>
      
      <div className="form-container">
        <h2 className="form-title">{t("reporting_form_title")}</h2>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              {t("title")}
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("enter_title")}
              className="form-input"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="description" className="form-label">
              {t("description")}
            </label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("enter_description")}
              className="form-input"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="type" className="form-label">
              {t("type")}
            </label>
            <Dropdown
              id="type"
              value={type}
              options={reportTypes}
              onChange={(e) => setType(e.value)}
              placeholder={t("select_type")}
              className="form-select"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="attachmentUrl" className="form-label">
             {t('attachment_url')}
            </label>
            <Input
              id="attachmentUrl"
              value={attachmentUrl}
              onChange={(e) => setAttachmentUrl(e.target.value)}
              placeholder={t('enter_attachment_url')}
              className="form-input"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label
              htmlFor="attachmentFormat"
              className="form-label"
            >
              {t('attachment_format')}
            </label>
            <Dropdown
              id="attachmentFormat"
              value={attachmentFormat}
              options={[
                { label: "PDF", value: "pdf" },
                { label: "Image", value: "image" },
                { label: "Autre", value: "pdf" },
              ]}
              onChange={(e) => setAttachmentFormat(e.value)}
              placeholder="Sélectionnez un format"
              className="form-select"
              disabled={loading}
            />
          </div>
          {error && <p className="error-message mt-2">{error}</p>}
          <button
            type="submit"
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            disabled={
              loading ||
              !title.trim() ||
              !description.trim() ||
              !type ||
              !admin?.id
            }
          >
            {loading && (
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            {t('add')}
          </button>
        </form>
        <Toast ref={toast} />
      </div>
    </div>
  );
};

export default AddReportForm;
