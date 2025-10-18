import React, { useState, useEffect, useRef, useMemo } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import axiosInstance from "../../api/axios";
import ComponentCard from "../../components/common/ComponentCard";
import { useNavigate } from "react-router-dom";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { useTranslation } from "react-i18next";

interface Transport {
  id: string;
  loadingNumber: string;
  countryId: string;
  localityId: string;
  vehiclePlateNumber: string;
  chargerFirstName: string;
  chargerLastName: string;
  chargerPhone: string;
  productLabel: string;
  productQuantity: number;
  averageWeightKg: number;
  averageUnitPrice: number;
  totalProductValue: number;
  currency: string;
  loadingPoint: string;
  loadingCountry: string;
  unloadingPoint: string;
  unloadingCountry: string;
  drivingLicenseNumber: string;
  drivingLicenseValid: boolean;
  drivingLicenseExpiry: string;
  greyCardNumber: string;
  greyCardValid: boolean;
  greyCardExpiry: string;
  insuranceNumber: string;
  insuranceValid: boolean;
  insuranceExpiry: string;
  exportDeclarationNumber: string;
  exportDeclarationValid: boolean;
  exportDeclarationExpiry: string;
  peopleOnBoard: number;
  idDocumentType: string;
  idDocumentRef: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  additionalPassengers: {
    id: string;
    firstName: string;
    lastName: string;
    documentType: string;
    documentRef: string;
    transportFormId: string;
  }[];
  country: {
    id: string;
    name: string;
  };
  locality: {
    id: string;
    name: string;
    countryId: string;
  };
  user: {
    id: string;
    firstname: string;
    lastname: string;
    phone: string;
    email: string;
  };
  TransportAttachment: {
    id: string;
    transportId: string;
    url: string;
    type: string;
    createdAt: string;
    updatedAt: string;
  }[];
}

interface ApiResponse {
  status: boolean;
  message: string;
  data: {
    data: Transport[];
    total: number;
    page: number;
    lastPage: number;
  };
}

const TransportsTable = () => {
  const [transports, setTransports] = useState<Transport[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTransport, setSelectedTransport] = useState<Transport | null>(
    null
  );
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
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

  // Récupérer la liste des transports avec pagination
  const fetchTransports = async (page: number = 1, limit: number = 10) => {
    setIsLoading(true);
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

      const response = await axiosInstance.get<ApiResponse>("/transport", {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit },
      });

      console.log("Réponse API GET /transport :", response.data);
      const transportsData = Array.isArray(response.data.data.data)
        ? response.data.data.data
        : [];
      console.log("Transports extraits :", transportsData);
      setTransports(transportsData);
      setTotalRecords(response.data.data.total || 0);
      if (transportsData.length === 0) {
        console.warn("Aucun transport trouvé dans la réponse API.");
      }
    } catch (err: any) {
      console.error("Erreur API :", err);
      const errorMessage =
        err.response?.data?.message ||
        "Erreur lors de la récupération des transports.";
      setError(errorMessage);
      toast.current?.show({
        severity: "error",
        summary: "Erreur",
        detail: errorMessage,
        life: 3000,
      });
      setTransports([]);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setTimeout(() => navigate("/signin"), 3000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransports(currentPage, rowsPerPage);
  }, [navigate, currentPage, rowsPerPage]);

  // Force le re-rendu quand la langue change
  useEffect(() => {
    forceUpdate({});
  }, [i18n.language]);

  // Gestion de la pagination
  const onPageChange = (event: any) => {
    setCurrentPage(event.page + 1);
    setRowsPerPage(event.rows);
  };

  // Afficher les détails
  const handleViewDetails = (transport: Transport) => {
    setSelectedTransport(transport);
    setTimeout(() => setIsModalVisible(true), 10);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setTimeout(() => setSelectedTransport(null), 300);
  };

  // Template pour les actions
  const actionBodyTemplate = useMemo(() => {
    return (rowData: Transport) => {
      const currentLang = i18n.language;
      return (
        <Button
          label={t("view")}
          className="p-button-sm p-button-primary"
          onClick={() => handleViewDetails(rowData)}
          key={`${rowData.id}-${currentLang}`}
        />
      );
    };
  }, [i18n.language, t]);
  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Gestion des Transports</h1>
        <p className="page-subtitle">
          Liste et suivi des transports de marchandises
        </p>
      </div>

      <div className="content-card">
        <div className="content-card-header">
          <h2 className="content-card-title">{t("transport_list")}</h2>
        </div>
        <div className="content-card-body">
          <DataTable
            key={`datatable-${i18n.language}`}
            value={transports}
            loading={isLoading}
            responsiveLayout="scroll"
            showGridlines
            rows={rowsPerPage}
            first={(currentPage - 1) * rowsPerPage}
            totalRecords={totalRecords}
            onPage={onPageChange}
            filterDisplay="row"
            globalFilterFields={[
              "loadingNumber",
              "productLabel",
              "loadingCountry",
              "unloadingCountry",
            ]}
            emptyMessage="Aucun transport trouvé."
            paginator
            rowsPerPageOptions={[5, 10, 25]}
            tableStyle={{ minWidth: "50rem" }}
            className="p-datatable-sm"
          >
            <Column
              field="loadingNumber"
              header={t("loading_number")}
              filter
              filterPlaceholder="Rechercher par numéro"
              style={{ width: "25%" }}
            />
            <Column
              field="productLabel"
              header={t("product")}
              filter
              filterPlaceholder="Rechercher par produit"
              style={{ width: "25%" }}
            />
            <Column
              field="loadingCountry"
              header={t("loading_country")}
              filter
              filterPlaceholder="Rechercher par pays"
              style={{ width: "20%" }}
            />
            <Column
              field="unloadingCountry"
              header={t("unloading_country")}
              filter
              filterPlaceholder="Rechercher par pays"
              style={{ width: "20%" }}
            />
            <Column
              header={t("actions")}
              body={actionBodyTemplate}
              style={{ width: "10%" }}
            />
          </DataTable>
        </div>
      </div>
      <Dialog
        visible={isModalVisible}
        header={t("transport_details")}
        modal
        style={{ width: "40rem" }}
        onHide={handleCloseModal}
      >
        {selectedTransport && (
          <div className="p-4 space-y-2">
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">{t("loading_number")} :</span>{" "}
              {selectedTransport.loadingNumber}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">{t("product")} :</span>{" "}
              {selectedTransport.productLabel}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">{t("quantity")} :</span>{" "}
              {selectedTransport.productQuantity}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">{t("average_weight")} :</span>{" "}
              {selectedTransport.averageWeightKg}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">{t("average_unit_price")} :</span>{" "}
              {selectedTransport.averageUnitPrice} {selectedTransport.currency}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium"> {t("total_value")} :</span>{" "}
              {selectedTransport.totalProductValue} {selectedTransport.currency}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">{t("loading_point")} :</span>{" "}
              {selectedTransport.loadingPoint}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">{t("loading_country")} :</span>{" "}
              {selectedTransport.loadingCountry}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">{t("unloading_point")}:</span>{" "}
              {selectedTransport.unloadingPoint}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">{t("unloading_country")} :</span>{" "}
              {selectedTransport.unloadingCountry}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">{t("shipper")} :</span>{" "}
              {selectedTransport.chargerFirstName}{" "}
              {selectedTransport.chargerLastName}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium"> {t("shipper_phone")} :</span>{" "}
              {selectedTransport.chargerPhone}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">{t("license_plate")} :</span>{" "}
              {selectedTransport.vehiclePlateNumber}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">{t("license_number")} :</span>{" "}
              {selectedTransport.drivingLicenseNumber}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">{t("license_valid")} :</span>{" "}
              {selectedTransport.drivingLicenseValid ? "Oui" : "Non"}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">{t("license_expiration")} :</span>{" "}
              {new Date(
                selectedTransport.drivingLicenseExpiry
              ).toLocaleDateString()}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">{t("registration_card")} :</span>{" "}
              {selectedTransport.greyCardNumber}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">{t("registration_valid")} :</span>{" "}
              {selectedTransport.greyCardValid ? "Oui" : "Non"}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">
                {t("registration_expiration")} :
              </span>{" "}
              {new Date(selectedTransport.greyCardExpiry).toLocaleDateString()}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">{t("insurance")} :</span>{" "}
              {selectedTransport.insuranceNumber}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">{t("insurance_valid")} :</span>{" "}
              {selectedTransport.insuranceValid ? "Oui" : "Non"}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">{t("insurance_expiration")} :</span>{" "}
              {new Date(selectedTransport.insuranceExpiry).toLocaleDateString()}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">{t("export_declaration")} :</span>{" "}
              {selectedTransport.exportDeclarationNumber}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">{t("declaration_valid")} :</span>{" "}
              {selectedTransport.exportDeclarationValid ? "Oui" : "Non"}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">
                {t("declaration_expiration")}:
              </span>{" "}
              {new Date(
                selectedTransport.exportDeclarationExpiry
              ).toLocaleDateString()}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">{t("people_on_board")}:</span>{" "}
              {selectedTransport.peopleOnBoard}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">{t("document_type")} :</span>{" "}
              {selectedTransport.idDocumentType}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">{t("document_reference")} :</span>{" "}
              {selectedTransport.idDocumentRef}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">{t("country")} :</span>{" "}
              {selectedTransport.country.name}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">{t("locality")} :</span>{" "}
              {selectedTransport.locality.name}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">{t("user")} :</span>{" "}
              {selectedTransport.user.firstname}{" "}
              {selectedTransport.user.lastname} ({selectedTransport.user.email})
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">
                {t("additional_passengers")} :
              </span>
              {selectedTransport.additionalPassengers.length > 0 ? (
                <ul className="list-disc pl-5">
                  {selectedTransport.additionalPassengers.map((passenger) => (
                    <li key={passenger.id}>
                      {passenger.firstName} {passenger.lastName} (
                      {passenger.documentType}: {passenger.documentRef})
                    </li>
                  ))}
                </ul>
              ) : (
                "Aucun"
              )}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">{t("attachments")} :</span>
              {selectedTransport.TransportAttachment.length > 0 ? (
                <ul className="list-disc pl-5">
                  {selectedTransport.TransportAttachment.map((attachment) => (
                    <li key={attachment.id}>
                      {attachment.type}:{" "}
                      <a
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {attachment.url}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                "Aucune"
              )}
            </p>
            <div className="flex justify-end mt-4">
              <Button
                label="Fermer"
                icon="pi pi-times"
                className="p-button-secondary"
                onClick={handleCloseModal}
              />
            </div>
          </div>
        )}
      </Dialog>
      <Toast ref={toast} />
    </div>
  );
};

export default TransportsTable;
