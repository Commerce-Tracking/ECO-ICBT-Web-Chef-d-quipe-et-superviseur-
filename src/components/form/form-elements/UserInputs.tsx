import { useState, useEffect, useRef } from "react";
import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Input from "../input/InputField";
import Select from "../Select";
import PhoneInput from "../group-input/PhoneInput.tsx";
import { Toast } from "primereact/toast";

import axiosInstance from "../../../api/axios.ts"; // Ajustez le chemin selon votre configuration
import {useTranslation} from "react-i18next";


interface Role {
  id: string;
  name: string;
}

interface Locality {
  id: string;
  name: string;
}

export default function UserInputs() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    // password: "",
    roleId: "",
    localityId: "",
    email: "",
  });
  const [roles, setRoles] = useState<Role[]>([]);
  const [localities, setLocalities] = useState<Locality[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const toast = useRef<Toast>(null);

  // Récupérer les rôles et localités au chargement
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axiosInstance.get("/admin/roles");
        setRoles(response.data);

        
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          "Erreur lors de la créatin de l'utilisateur.";
        setError(errorMessage);
        toast.current?.show({
          severity: "error",
          summary: "Erreur",
          detail: errorMessage,
          life: 3000,
        });
      }
    };

    const fetchLocalities = async () => {
      try {
        const response = await axiosInstance.get("/admin/locality");
        setLocalities(response.data.data.data);
      } catch (err: any) {
        console.error("Erreur lors du chargement des localités:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });
        setError(`Impossible de charger les localités: ${err.message}`);
      }
    };

    fetchRoles();
    fetchLocalities();
  }, []);

  // Options pour les Select
  const roleOptions = roles.map((role) => ({
    value: role.id,
    label: role.name,
  }));

  const localityOptions = localities.map((locality) => ({
    value: locality.id,
    label: locality.name,
  }));

  // Gérer les changements dans les champs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneNumberChange = (phoneNumber: string) => {
    setFormData((prev) => ({ ...prev, phone: phoneNumber.replace(/\D/g, "") }));
  };

  // Valider le formulaire
  const validateForm = () => {
    if (!formData.firstname) return "Le prénom est requis";
    if (!formData.lastname) return "Le nom est requis";
    if (!formData.email.includes("@")) return "L'email est invalide";
    // if (formData.password.length < 8) return "Le mot de passe doit contenir au moins 8 caractères";
    if (!formData.roleId) return "Veuillez sélectionner un rôle";
    if (!formData.localityId) return "Veuillez sélectionner une localité";
    if (!formData.phone || formData.phone.length < 8)
      return "Le numéro de téléphone est invalide";
    return "";
  };

  // Gérer la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post("/admin/create-user", formData);
      toast.current?.show({
  severity: "success",
  summary: "Succès",
  detail: `Utilisateur ${response.data.data.firstname} ${response.data.data.lastname} créé avec succès !`,
  life: 3000,
});
      setFormData({
        firstname: "",
        lastname: "",
        phone: "",
        // password: "",
        roleId: "",
        localityId: "",
        email: "",
      });
    } catch (err: any) {
      console.error("Erreur création utilisateur:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      setError(
        err.response?.data?.message ||
          "Une erreur s'est produite lors de la création de l'utilisateur"
      );
    } finally {
      setLoading(false);
    }
  };

  const countries = [
    { code: "TG", label: "+228" },
    { code: "BJ", label: "+229" },
    { code: "GH", label: "+233" },
  ];

  const { t, i18n } = useTranslation();
            
                const changeLanguage = (lng: string) => {
                    i18n.changeLanguage(lng);
                };

  return (
    <div className="p-4">
      <ComponentCard title={t('form_instruction')}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="text-red-500">{error}</p>}
         

          <div>
            <Label htmlFor="firstname">{t('first_name')}</Label>
            <Input
              type="text"
              id="firstname"
              name="firstname"
              value={formData.firstname}
              onChange={handleInputChange}
              placeholder={t('first_name_placeholder')}
            />
          </div>

          <div>
            <Label htmlFor="lastname">{t('last_name')}</Label>
            <Input
              type="text"
              id="lastname"
              name="lastname"
              value={formData.lastname}
              onChange={handleInputChange}
              placeholder={t('last_name_placeholder')}
            />
          </div>

          <div>
            <Label htmlFor="email">{t('email')}</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={t('email_placeholder')}
            />
          </div>

          <div>
            <Label>{t('role')}</Label>
            <Select
              options={roleOptions}
              placeholder={t('select_role')}
              defaultValue={formData.roleId}
              onChange={handleSelectChange("roleId")}
              className="dark:bg-gray-900"
            />
          </div>

          <div>
            <Label>{t('locality')}</Label>
            <Select
              options={localityOptions}
              placeholder={t('select_locality')}
              defaultValue={formData.localityId}
              onChange={handleSelectChange("localityId")}
              className="dark:bg-gray-900"
            />
          </div>

          <div>
            <Label>{t('phone_number')}</Label>
            <PhoneInput
              selectPosition="start"
              countries={countries}
              placeholder="+228 00 00 00 00"
              defaultValue={formData.phone}
              onChange={handlePhoneNumberChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 bg-blue-900 text-white rounded-lg ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Création en cours..." : t('create_user')}
          </button>
        </form>
      </ComponentCard>
      <Toast ref={toast} position="bottom-right" />
    </div>
  );
}





