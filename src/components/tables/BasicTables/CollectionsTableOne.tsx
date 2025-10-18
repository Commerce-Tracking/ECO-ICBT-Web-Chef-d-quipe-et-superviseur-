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
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

interface Collection {
  id: number;
  public_id: string;
  collection_date: string | null;
  collector_id: number;
  operator_gender: string;
  operator_type: string;
  respondent_nature: string;
  other_respondent_nature: string | null;
  merchandise_owner_gender: string;
  merchandise_owner_age_category: string;
  merchandise_owner_has_disability: number;
  collection_point_id: number | null;
  collection_type: string;
  collection_context: string;
  transport_batch_id: number | null;
  origin_city_id: number | null;
  origin_country_id: number;
  intermediate_destination: string | null;
  final_destination_city_id: number | null;
  destination_country_id: number;
  trade_flow_direction: string;
  transport_mode_id: number;
  vehicle_registration_number: string;
  transport_cost: string | null;
  market_day: number | null;
  nearby_markets: string | null;
  currency_id: number;
  payment_method: string;
  season_id: number | null;
  market_condition: string | null;
  market_price_variation: string | null;
  taxes_fees: string | null;
  tax_details: string | null;
  gps_latitude: string | null;
  gps_longitude: string | null;
  has_control_posts: number | null;
  control_posts_count: number | null;
  control_locations: string | null;
  control_duration_type: string | null;
  control_duration_value: string | null;
  taxes_paid: string | null;
  total_weight_kg: string | null;
  tax_amount: string | null;
  illegal_fees_paid: string | null;
  illegal_fees_locations: string | null;
  illegal_fees_amount: string | null;
  knows_community_regulations: number | null;
  knows_national_regulations: number | null;
  other_difficulties: string | null;
  notes: string | null;
  corridor_id: number;
  status: string;
  validated_at: string | null;
  validated_by: number | null;
  created_at: string;
  updated_at: string;
  // Nouvelles relations
  collectionPoint?: {
    id: number;
    public_id: string;
    name: string;
    description: string;
    country_id: number;
    corridor_id: number | null;
    collection_point_type_id: number;
    locality: string;
    region: string;
    coordinates: string | null;
    is_formal: boolean;
    is_border_crossing: boolean;
    is_market: boolean;
    is_fluvial: boolean;
    is_checkpoint: boolean;
    status: string;
    created_at: string;
    updated_at: string;
  };
  originCountry?: {
    id: number;
    public_id: string;
    name: string;
    iso: string;
    prefix: string;
    flag: string;
    currency_id: number;
    status: string;
    metadata: any;
    created_at: string;
    updated_at: string;
  };
  destinationCountry?: {
    id: number;
    public_id: string;
    name: string;
    iso: string;
    prefix: string;
    flag: string;
    currency_id: number;
    status: string;
    metadata: any;
    created_at: string;
    updated_at: string;
  };
  transportMode?: {
    id: number;
    public_id: string;
    name: string;
    description: string;
    transport_method_id: number;
    created_at: string;
    updated_at: string;
  };
  corridor?: {
    id: number;
    public_id: string;
    name: string;
    description: string;
    country_start_id: number;
    country_end_id: number;
    city_start_id: number;
    city_end_id: number;
    distance: number;
    nbre_checkpoints: number;
    created_at: string;
    updated_at: string;
  };
  collectionItems?: Array<{
    id: number;
    public_id: string;
    collection_id: number;
    product_id: number;
    animal_id: number | null;
    quantity: string;
    unity_id: number;
    unit_price: string;
    total_value: string;
    product_quality: string | null;
    product_variety: string | null;
    product_processing_level: string | null;
    product_packaging: string | null;
    animal_count: number | null;
    animal_categories: string | null;
    animal_age_category: string | null;
    animal_gender: string | null;
    animal_condition: string | null;
    animal_breed: string | null;
    average_weight_kg: string;
    specific_origin: string | null;
    specific_destination: string | null;
    losses_quantity: string | null;
    losses_value: string | null;
    loss_reasons: string | null;
    required_special_permits: number | null;
    special_permits_details: string | null;
    item_specific_fees: string | null;
    is_seasonal_product: number | null;
    harvest_period: string | null;
    item_notes: string | null;
    local_unit_weight_kg: string;
    total_weight_kg: string;
    loading_cost: string;
    unloading_cost: string;
    transport_cost: string;
    origin_country_id: number;
    loading_city_id: number;
    unloading_city_id: number;
    product_origin_country_id: number | null;
    customs_registration_number: string | null;
    is_customs_registered: number;
    created_at: string;
    updated_at: string;
    product: {
      id: number;
      public_id: string;
      name: string;
      product_type_id: number;
      HS_code: string;
      description: string;
      created_at: string;
      updated_at: string;
    };
    animal: any | null;
    unity: {
      id: number;
      public_id: string;
      name: string;
      description: string;
      symbol: string;
      created_at: string;
      updated_at: string;
    };
    originCountry: {
      id: number;
      public_id: string;
      name: string;
      iso: string;
      prefix: string;
      flag: string;
      currency_id: number;
      status: string;
      metadata: any;
      created_at: string;
      updated_at: string;
    };
    loadingCity: {
      id: number;
      public_id: string;
      name: string;
      country_id: number;
      location: string | null;
      created_at: string;
      updated_at: string;
    };
    unloadingCity: {
      id: number;
      public_id: string;
      name: string;
      country_id: number;
      location: string | null;
      created_at: string;
      updated_at: string;
    };
    productOriginCountry: any | null;
  }>;
  collectionControls?: Array<{
    id: number;
    collection_id: number;
    checkpoint_id: number | null;
    service_id: number;
    location: string;
    fees_paid: string | null;
    payment_amount: string | null;
    duration_type: string | null;
    control_duration: string | null;
    control_result: string | null;
    control_issues: string | null;
    notes: string | null;
    other_control_body: string;
    control_posts_count: number;
    stop_time_per_post_type: string | null;
    border_crossing_time_type: string | null;
    fees_paid_yes_no: number;
    has_receipt: number;
    tax_type_id: number;
    other_tax_type: string;
    fees_payment_post: string | null;
    fees_payment_amount: string | null;
    illegal_fees_paid: number;
    illegal_fees_post: string | null;
    illegal_fees_amount: string | null;
    knows_community_regulations: number;
    knows_national_regulations: number;
    other_difficulties: string | null;
    created_at: string;
    updated_at: string;
    taxType: {
      id: number;
      name: string;
      description: string;
      created_at: string;
      updated_at: string;
    };
  }>;
  // Champs de validation
  validated_by_team_manager?: boolean;
  validation_result?: string | null;
  validation_action?: string | null;
  validation_notes?: string | null;
  data_quality_score?: number | null;
  rejection_reason?: string | null;
  validated_by_supervisor?: boolean;
  supervisor_validation_result?: string | null;
  supervisor_validated_at?: string | null;
  // Champs calculés
  total_value?: string;
  collector_name?: string;
  total_items?: number;
  // Champs de compatibilité pour l'ancienne structure
  collector?: {
    first_name: string;
    last_name: string;
  };
  originCity?: {
    name: string;
  };
  finalDestinationCity?: {
    name: string;
  };
  // Propriétés de validation supplémentaires
  team_manager_validation_result?: string | null;
  team_manager_validation_date?: string;
  team_manager_rejection_reason?: string;
  supervisor_validation_date?: string;
  supervisor_rejection_reason?: string;
}

// Interface pour la structure de validation du superviseur
interface ValidationItem {
  id: number;
  public_id: string;
  collection_id: number;
  validation_level: string;
  validator_id: number;
  validation_action: string;
  validation_result: string;
  data_quality_score: number | null;
  validation_notes: string | null;
  rejection_reason: string | null;
  correction_instructions: string | null;
  quality_issues: any;
  validation_metadata: any;
  requires_field_verification: number | null;
  requires_data_correction: number | null;
  requires_additional_documentation: number | null;
  validation_deadline: string | null;
  priority_level: string;
  submitted_at: string;
  validated_at: string | null;
  validation_duration_minutes: number | null;
  previous_validation_id: number | null;
  is_current_validation: number;
  revision_number: number;
  validation_source: string;
  system_metadata: any;
  created_at: string;
  updated_at: string;
  collection: Collection;
}

interface ApiResponse {
  success: boolean;
  message: string;
  result: Collection[];
  errors: any;
  except: any;
}

const CollectionsTableOne = () => {
  const [tableData, setTableData] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [selectedRejectionReason, setSelectedRejectionReason] =
    useState<string>("");
  const [validationStatus, setValidationStatus] = useState<string>("");
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const { t, i18n } = useTranslation();
  const [, forceUpdate] = useState({});

  // Fonction pour récupérer les collectes de bétail
  const fetchData = async () => {
    try {
      setIsLoading(true);
      console.log("Récupération des collectes de bétail...");

      let response;

      // Si un statut de validation est sélectionné, utiliser l'endpoint de filtrage approprié
      if (validationStatus) {
        const searchParams: any = {
          collection_type: "livestock",
          page: String(currentPage),
          limit: String(rowsPerPage),
        };

        // Ajouter la recherche globale
        if (globalFilter) {
          searchParams.search = globalFilter;
        }

        if (userInfo?.role_id === 4) {
          // Chef d'équipe : utiliser collection_status
          searchParams.collection_status = validationStatus;
          response = await axiosInstance.get<ApiResponse>(
            "/trade-flow/collections/by-validation-status",
            {
              params: searchParams,
            }
          );
        } else if (userInfo?.role_id === 5) {
          // Superviseur : utiliser validation_status et validation_level
          searchParams.validation_status = validationStatus;
          searchParams.validation_level = "2";
          response = await axiosInstance.get<ApiResponse>(
            "/trade-flow/collections/by-validation-status",
            {
              params: searchParams,
            }
          );
        }
      } else {
        // Sinon, utiliser l'endpoint normal
        const searchParams: any = {
          page: String(currentPage),
          limit: String(rowsPerPage),
          collection_type: "livestock",
        };

        // Ajouter la recherche globale
        if (globalFilter) {
          searchParams.search = globalFilter;
        }

        response = await axiosInstance.get<ApiResponse>(
          "/trade-flow/agents/collections",
          {
            params: searchParams,
          }
        );
      }

      if (response.data.success) {
        let collections: Collection[] = [];

        // Structure de données unifiée pour le nouvel endpoint
        let result: any = null;
        if (Array.isArray(response.data.result)) {
          collections = response.data.result;
        } else if (response.data.result && "data" in response.data.result) {
          result = response.data.result as any;

          // Pour les deux rôles, les données sont directement dans result.data
          collections = result.data;

          setTotalRecords(result.total || collections.length);
        }

        // Récupérer les informations de workflow pour chaque collection
        const processedCollections = await Promise.all(
          collections.map(async (collection, index) => {
            // Vérifier si la collection est valide avant de continuer
            if (!collection || !collection.id) {
              console.warn(
                "Collection invalide trouvée à l'index",
                index,
                collection
              );
              return null;
            }

            const validationData = result ? result.data[index] : collection;

            // Extraire les données de validation depuis collectionValidations
            let teamManagerValidation: any = null;
            let supervisorValidation: any = null;

            if (
              (collection as any).collectionValidations &&
              (collection as any).collectionValidations.length > 0
            ) {
              // Trouver la validation actuelle (is_current_validation: 1)
              const currentValidation =
                (collection as any).collectionValidations.find(
                  (validation: any) => validation.is_current_validation === 1
                ) ||
                (collection as any).collectionValidations[
                  (collection as any).collectionValidations.length - 1
                ];

              // Déterminer si c'est une validation de chef d'équipe ou superviseur
              if (currentValidation.validation_level === "1") {
                teamManagerValidation = currentValidation;
              } else if (currentValidation.validation_level === "2") {
                supervisorValidation = currentValidation;
              }
            }

            try {
              // Récupérer les informations de workflow pour avoir les statuts de validation complets
              const workflowResponse = await axiosInstance.get(
                `/trade-flow/collections/${collection.id}/workflow`
              );

              if (workflowResponse.data.success) {
                const workflow = workflowResponse.data.result;
                const workflowTeamManagerValidation =
                  workflow.team_manager_validation;
                const supervisorValidation = workflow.supervisor_validation;

                return {
                  ...collection,
                  // Informations de validation du chef d'équipe
                  validated_by_team_manager:
                    workflowTeamManagerValidation?.validation_result ===
                    "approved",
                  validation_result:
                    workflowTeamManagerValidation?.validation_result,
                  validation_action:
                    workflowTeamManagerValidation?.validation_action,
                  validated_at: workflowTeamManagerValidation?.validated_at,
                  rejection_reason:
                    workflowTeamManagerValidation?.rejection_reason,
                  data_quality_score:
                    workflowTeamManagerValidation?.data_quality_score,
                  validation_notes:
                    workflowTeamManagerValidation?.validation_notes,
                  // Pour la compatibilité avec l'ancienne structure
                  team_manager_validation_result:
                    workflowTeamManagerValidation?.validation_result,
                  team_manager_validation_date:
                    workflowTeamManagerValidation?.validated_at,
                  team_manager_rejection_reason:
                    workflowTeamManagerValidation?.rejection_reason,
                  // Informations de validation du superviseur
                  validated_by_supervisor:
                    supervisorValidation?.validation_result === "approved",
                  supervisor_validation_result:
                    supervisorValidation?.validation_result,
                  supervisor_validated_at: supervisorValidation?.validated_at,
                  supervisor_validation_date:
                    supervisorValidation?.validated_at,
                  supervisor_rejection_reason:
                    supervisorValidation?.rejection_reason,
                };
              }
            } catch (error) {
              console.error(
                `Erreur pour la collection ${collection.id}:`,
                error
              );
            }

            // Utiliser les données de collectionValidations directement
            return {
              ...collection,
              // Informations de validation du chef d'équipe
              validated_by_team_manager:
                teamManagerValidation?.validation_result === "approved" ||
                collection.status === "validated",
              validation_result:
                teamManagerValidation?.validation_result ||
                (collection.status === "validated" ? "approved" : null),
              validation_action:
                teamManagerValidation?.validation_action ||
                (collection.status === "validated" ? "validated" : null),
              validated_at:
                teamManagerValidation?.validated_at || collection.validated_at,
              rejection_reason: teamManagerValidation?.rejection_reason,
              data_quality_score: teamManagerValidation?.data_quality_score,
              validation_notes: teamManagerValidation?.validation_notes,
              // Pour la compatibilité avec l'ancienne structure
              team_manager_validation_result:
                teamManagerValidation?.validation_result ||
                (collection.status === "validated" ? "approved" : null),
              team_manager_validation_date:
                teamManagerValidation?.validated_at || collection.validated_at,
              team_manager_rejection_reason:
                teamManagerValidation?.rejection_reason,
              // Informations de validation du superviseur
              validated_by_supervisor:
                supervisorValidation?.validation_result === "approved",
              supervisor_validation_result:
                supervisorValidation?.validation_result,
              supervisor_validated_at: supervisorValidation?.validated_at,
              supervisor_validation_date: supervisorValidation?.validated_at,
              supervisor_rejection_reason:
                supervisorValidation?.rejection_reason,
            };
          })
        );

        collections = processedCollections.filter(
          (collection) => collection !== null
        );

        // Pas de filtrage côté client - laisser l'API gérer tous les filtres

        // Traitement des données
        const transformedData = collections.map((item) => ({
          ...item,
          collector_name: item.collector
            ? `${item.collector.first_name} ${item.collector.last_name}`
            : "Non spécifié",
          total_items: item.collectionItems ? item.collectionItems.length : 0,
          total_value: item.collectionItems
            ? item.collectionItems
                .reduce(
                  (sum: number, item) =>
                    sum + parseFloat(item.total_value || "0"),
                  0
                )
                .toFixed(2)
            : "0.00",
        }));

        setTableData(transformedData);
      }
    } catch (err: any) {
      console.error(
        "Erreur lors de la récupération des collectes de bétail:",
        err
      );
      setError(
        err.message || "Erreur lors de la récupération des collectes de bétail"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("=== USEEFFECT TRIGGERED ===");
    console.log("currentPage:", currentPage);
    console.log("rowsPerPage:", rowsPerPage);
    console.log("globalFilter:", globalFilter);
    console.log("validationStatus:", validationStatus);
    console.log("=== FIN USEEFFECT DEBUG ===");

    fetchData();
  }, [currentPage, rowsPerPage, globalFilter, validationStatus]);

  // Force le re-rendu quand la langue change
  useEffect(() => {
    forceUpdate({});
  }, [i18n.language]);

  const handleViewDetails = (collection: Collection) => {
    // Passer les données de la collecte via l'état de navigation
    navigate(`/collection/${collection.id}`, {
      state: { collection },
    });
  };

  const onPageChange = (event: any) => {
    console.log("=== PAGINATION DEBUG ===");
    console.log("Event reçu:", event);
    console.log("Nouvelle page:", event.page + 1);
    console.log("Nouveau nombre de lignes:", event.rows);

    setCurrentPage(event.page + 1);
    setRowsPerPage(event.rows);
  };

  const onFilter = (event: any) => {
    console.log("=== FILTER DEBUG ===");
    console.log("Event de filtre:", event);

    if (event.globalFilter !== undefined) {
      setGlobalFilter(event.globalFilter);
      setCurrentPage(1);
    }
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const actionBodyTemplate = useMemo(() => {
    return (rowData: Collection) => {
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

  const collectorBodyTemplate = (rowData: Collection) => {
    return (
      <div className="flex items-center">
        <div className="flex-shrink-0 w-8 h-8">
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
              {rowData.collector_name?.charAt(0) || "?"}
            </span>
          </div>
        </div>
        <div className="ml-3">
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {rowData.collector_name || "Non spécifié"}
          </div>
        </div>
      </div>
    );
  };

  const dateBodyTemplate = (rowData: Collection) => {
    return rowData.collection_date
      ? new Date(rowData.collection_date).toLocaleDateString()
      : new Date(rowData.created_at).toLocaleDateString();
  };

  const getCollectionTypeLabel = (type: string) => {
    switch (type) {
      case "livestock":
        return "Bétail";
      case "agricultural":
        return "Agricole";
      default:
        return type;
    }
  };

  const collectionTypeBodyTemplate = (rowData: Collection) => {
    return getCollectionTypeLabel(rowData.collection_type);
  };

  const showRejectionReason = (reason: string) => {
    setSelectedRejectionReason(reason);
    setShowRejectionModal(true);
  };

  const handleValidationStatusChange = (status: string) => {
    setValidationStatus(status);
    setCurrentPage(1); // Reset à la première page
  };

  const statusBodyTemplate = (rowData: Collection) => {
    const statusColors = {
      submitted: "bg-yellow-100 text-yellow-800",
      validated: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      draft: "bg-gray-100 text-gray-800",
      approved: "bg-green-100 text-green-800",
      pending: "bg-blue-100 text-blue-800",
    };

    // Pour le chef d'équipe, afficher le statut de validation après ses actions
    let displayStatus = rowData.status;
    let statusLabel = "Statut initial";

    if (userInfo?.role_id === 4) {
      // Chef d'équipe : utiliser directement le status de la collection
      console.log("Chef d'équipe - Données de la collection:", {
        id: rowData.id,
        status: rowData.status,
        validated_by_team_manager: (rowData as any).validated_by_team_manager,
        validation_result: (rowData as any).validation_result,
        validation_action: (rowData as any).validation_action,
        team_manager_validation_result: (rowData as any)
          .team_manager_validation_result,
      });

      // Utiliser directement le status de la collection
      if (rowData.status === "validated") {
        displayStatus = "validated";
        statusLabel = "Validée";
      } else if (rowData.status === "rejected") {
        displayStatus = "rejected";
        statusLabel = "Rejetée";
      } else {
        // Toutes les autres collections (submitted, draft, etc.) sont considérées comme "À traiter"
        displayStatus = "submitted";
        statusLabel = "À traiter";
      }
    } else if (userInfo?.role_id === 5) {
      // Superviseur : vérifier si la collection a été validée par le chef d'équipe mais pas encore par le superviseur
      console.log("Superviseur - Données de la collection:", {
        id: rowData.id,
        status: rowData.status,
        validated_by_supervisor: rowData.validated_by_supervisor,
        supervisor_validation_result: rowData.supervisor_validation_result,
        supervisor_validated_at: rowData.supervisor_validated_at,
        validated_by_team_manager: rowData.validated_by_team_manager,
        validation_result: rowData.validation_result,
      });

      // Vérifier s'il y a une validation du superviseur (validation_level: "2")
      const hasSupervisorValidation =
        rowData.supervisor_validation_result !== undefined &&
        rowData.supervisor_validation_result !== null;

      if (hasSupervisorValidation) {
        // La collection a été traitée par le superviseur
        if (rowData.supervisor_validation_result === "approved") {
          displayStatus = "validated";
          statusLabel = "Validée par superviseur";
        } else if (rowData.supervisor_validation_result === "rejected") {
          displayStatus = "rejected";
          statusLabel = "Rejetée par superviseur";
        } else {
          displayStatus = "pending";
          statusLabel = "En attente superviseur";
        }
      } else if (rowData.status === "validated") {
        // Collection validée par le chef d'équipe mais pas encore traitée par le superviseur
        displayStatus = "pending";
        statusLabel = "En attente superviseur";
      } else {
        // Toutes les autres collections sont en attente du superviseur
        displayStatus = "pending";
        statusLabel = "En attente superviseur";
      }
    }

    return (
      <div className="flex flex-col gap-1">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            statusColors[displayStatus as keyof typeof statusColors] ||
            "bg-gray-100 text-gray-800"
          }`}
        >
          {statusLabel}
        </span>
        {userInfo?.role_id === 4 &&
          ((rowData as any).team_manager_validation_result ||
            (rowData as any).validation_result) && (
            <div className="text-xs text-gray-500">
              <div>
                {(rowData as any).validation_action === "rejected" ||
                (rowData as any).validation_result === "rejected" ||
                (rowData as any).team_manager_validation_result === "rejected"
                  ? "Rejetée le"
                  : "Traitée le"}{" "}
                {(rowData as any).validated_at ||
                (rowData as any).team_manager_validation_date
                  ? new Date(
                      (rowData as any).validated_at ||
                        (rowData as any).team_manager_validation_date
                    ).toLocaleDateString()
                  : "N/A"}
              </div>
              {((rowData as any).rejection_reason ||
                (rowData as any).team_manager_rejection_reason) && (
                <div className="mt-1">
                  <button
                    onClick={() =>
                      showRejectionReason(
                        (rowData as any).rejection_reason ||
                          (rowData as any).team_manager_rejection_reason!
                      )
                    }
                    className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-700 bg-red-100 border border-red-300 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-colors duration-200"
                  >
                    <i className="pi pi-eye mr-1"></i>
                    Voir motif
                  </button>
                </div>
              )}
            </div>
          )}
        {userInfo?.role_id === 5 && (
          <div className="text-xs text-gray-500">
            {rowData.supervisor_validation_result === "approved" ||
            rowData.supervisor_validation_result === "rejected" ? (
              // Collection traitée par le superviseur
              <div>
                <div>
                  {rowData.supervisor_validation_result === "rejected"
                    ? "Rejetée le"
                    : "Validée le"}{" "}
                  {rowData.supervisor_validated_at
                    ? new Date(
                        rowData.supervisor_validated_at
                      ).toLocaleDateString()
                    : "N/A"}
                </div>
                {rowData.supervisor_validation_result === "rejected" &&
                  rowData.supervisor_rejection_reason && (
                    <div className="mt-1">
                      <button
                        onClick={() =>
                          showRejectionReason(
                            rowData.supervisor_rejection_reason!
                          )
                        }
                        className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-700 bg-red-100 border border-red-300 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-colors duration-200"
                      >
                        <i className="pi pi-eye mr-1"></i>
                        Voir motif
                      </button>
                    </div>
                  )}
              </div>
            ) : (
              // Collection en attente du superviseur - afficher la date de validation du chef d'équipe
              <div>
                <div>
                  Validée par chef d'équipe le{" "}
                  {rowData.team_manager_validation_date
                    ? new Date(
                        rowData.team_manager_validation_date
                      ).toLocaleDateString()
                    : rowData.validated_at
                    ? new Date(rowData.validated_at).toLocaleDateString()
                    : "N/A"}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const originBodyTemplate = (rowData: Collection) => {
    // Utiliser les nouvelles données structurées
    let cityName = "Non spécifié";
    let countryName = rowData.originCountry?.name || "Non spécifié";
    let countryFlag = rowData.originCountry?.flag || "";

    // Essayer de récupérer le nom de la ville depuis les collectionItems
    if (rowData.collectionItems && rowData.collectionItems.length > 0) {
      const firstItem = rowData.collectionItems[0];
      if (firstItem.loadingCity?.name) {
        cityName = firstItem.loadingCity.name;
      }
    }

    // Fallback sur les anciens champs si les nouveaux ne sont pas disponibles
    if (cityName === "Non spécifié" && rowData.origin_city_id) {
      cityName = `Ville ID: ${rowData.origin_city_id}`;
    }

    return (
      <div className="text-sm">
        <div className="font-medium">
          {cityName} ({countryFlag} {countryName})
        </div>
      </div>
    );
  };

  const destinationBodyTemplate = (rowData: Collection) => {
    // Utiliser les nouvelles données structurées
    let cityName = "Non spécifié";
    let countryName = rowData.destinationCountry?.name || "Non spécifié";
    let countryFlag = rowData.destinationCountry?.flag || "";

    // Essayer de récupérer le nom de la ville depuis les collectionItems
    if (rowData.collectionItems && rowData.collectionItems.length > 0) {
      const firstItem = rowData.collectionItems[0];
      if (firstItem.unloadingCity?.name) {
        cityName = firstItem.unloadingCity.name;
      }
    }

    // Fallback sur les anciens champs si les nouveaux ne sont pas disponibles
    if (cityName === "Non spécifié" && rowData.final_destination_city_id) {
      cityName = `Ville ID: ${rowData.final_destination_city_id}`;
    }

    return (
      <div className="text-sm">
        <div className="font-medium">
          {cityName} ({countryFlag} {countryName})
        </div>
      </div>
    );
  };

  const totalValueBodyTemplate = (rowData: Collection) => {
    let totalValue = 0;

    // Calculer la valeur totale à partir des collectionItems
    if (rowData.collectionItems && rowData.collectionItems.length > 0) {
      totalValue = rowData.collectionItems.reduce((sum, item) => {
        return sum + parseFloat(item.total_value || "0");
      }, 0);
    } else if (rowData.total_value) {
      // Fallback sur l'ancien champ si disponible
      totalValue = parseFloat(rowData.total_value);
    }

    const formattedValue = totalValue.toLocaleString("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    return (
      <div className="text-sm font-medium text-green-600">{formattedValue}</div>
    );
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <div className="mb-4">
          <p className="text-red-600 dark:text-red-400 mb-2">
            Erreur : {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-green-700 text-white rounded transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  // Debug pour les données
  console.log("=== RENDER DEBUG ===");
  console.log("tableData.length:", tableData.length);
  console.log("totalRecords:", totalRecords);
  console.log("currentPage:", currentPage);
  console.log("rowsPerPage:", rowsPerPage);
  console.log("first:", (currentPage - 1) * rowsPerPage);
  console.log("=== FIN RENDER DEBUG ===");

  return (
    <div className="p-4">
      <ComponentCard title={t("livestock_collections")}>
        {/* Filtre de statut de validation pour le chef d'équipe et le superviseur */}
        {(userInfo?.role_id === 4 || userInfo?.role_id === 5) && (
          <div className="mb-4 flex flex-wrap gap-4">
            <div className="flex flex-col">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Statut de validation
              </label>
              <select
                value={validationStatus}
                onChange={(e) => handleValidationStatusChange(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">Tous les statuts</option>
                {userInfo?.role_id === 4 ? (
                  // Options pour le chef d'équipe
                  <>
                    <option value="submitted">En attente</option>
                    <option value="validated">Validée</option>
                    <option value="rejected">Rejetée</option>
                  </>
                ) : (
                  // Options pour le superviseur
                  <>
                    <option value="pending">En attente</option>
                    <option value="approved">Validée</option>
                    <option value="rejected">Rejetée</option>
                  </>
                )}
              </select>
            </div>
          </div>
        )}
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
          globalFilter={globalFilter}
          onFilter={onFilter}
          globalFilterFields={[
            "collector_name",
            "collection_type",
            "status",
            "total_value",
            "originCountry.name",
            "destinationCountry.name",
            "collectionPoint.name",
            "transportMode.name",
            "corridor.name",
            ...(userInfo?.role_id === 5
              ? ["validation_notes", "data_quality_score"]
              : []),
          ]}
          emptyMessage="Aucune collecte de bétail trouvée."
          paginator
          rowsPerPageOptions={[5, 10, 25]}
          tableStyle={{ minWidth: "50rem" }}
          className="p-datatable-sm"
          lazy={true}
        >
          <Column
            field="collector_name"
            header={t("collector")}
            filter
            filterPlaceholder="Rechercher par collecteur"
            style={{ width: "22%" }}
            body={collectorBodyTemplate}
          />
          <Column
            field="collection_type"
            header={t("collection_type")}
            filter
            filterPlaceholder="Rechercher par type"
            style={{ width: "18%" }}
            body={collectionTypeBodyTemplate}
          />
          <Column
            field="total_value"
            header="Valeur Totale"
            sortable
            filter
            filterPlaceholder="Filtrer par valeur"
            style={{ width: "13%" }}
            body={totalValueBodyTemplate}
          />
          <Column
            field="created_at"
            header={t("date")}
            style={{ width: "12%" }}
            body={dateBodyTemplate}
          />
          <Column
            field="status"
            header="Statut de Validation"
            style={{ width: "15%" }}
            body={statusBodyTemplate}
          />
          <Column
            header={t("actions")}
            body={actionBodyTemplate}
            style={{ width: "10%" }}
          />
        </DataTable>
      </ComponentCard>
      <Toast ref={toast} position="bottom-right" />

      {/* Modal pour afficher la raison de rejet */}
      <Dialog
        header="Motif de rejet"
        visible={showRejectionModal}
        style={{ width: "50vw" }}
        onHide={() => setShowRejectionModal(false)}
        footer={
          <Button
            label="Fermer"
            icon="pi pi-times"
            style={{
              backgroundColor: "#00277F",
              borderColor: "#00277F",
              color: "white",
            }}
            onClick={() => setShowRejectionModal(false)}
            className="w-full sm:w-auto text-sm sm:text-base px-3 py-2 sm:px-4 sm:py-3"
          />
        }
      >
        <div className="p-4">
          <p className="text-gray-700 dark:text-gray-300">
            {selectedRejectionReason}
          </p>
        </div>
      </Dialog>
    </div>
  );
};

export default CollectionsTableOne;
