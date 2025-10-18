import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import useAuth from "../../providers/auth/useAuth.ts";
import { useCustomModal } from "../../context/ModalContext.tsx";
import { useTranslation } from "react-i18next";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // @ts-ignore
  const { login, getUserInfos } = useAuth();
  const navigate = useNavigate();
  const { openModal } = useCustomModal();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(username, password);
    try {
      const req = await login(username, password);

      if (!req || req.success === false) {
        openModal({
          title: "Connexion échouée!",
          description: req?.message || "Erreur interne.",
          content: (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Veuillez vérifier vos identifiants et réessayer.
            </p>
          ),
        });
      } else {
        console.log("Connexion réussie !");
        // Redirection immédiate sans modal de succès
        navigate("/");
      }
    } catch (err) {
      openModal({
        title: "Erreur!",
        description: "Une erreur inattendue s'est produite.",
        content: (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Veuillez réessayer plus tard.
          </p>
        ),
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header avec style moderne */}
      <div className="text-center">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-white/80 transition-colors hover:text-white"
          >
            <ChevronLeftIcon className="size-5 mr-2" />
            {t("auth.back_to_home")}
          </Link>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-white">{t("auth.welcome")}</h1>
          <p className="text-white/80 text-lg">{t("auth.connect_to_ecowas")}</p>
          <div className="w-12 h-1 bg-orange-500 mx-auto rounded-full"></div>
        </div>
      </div>

      {/* Formulaire avec style glassmorphism */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-5">
          {/* Champ Email avec icône */}
          <div className="relative">
            <Label className="text-white/90 text-sm font-medium mb-2 block">
              {t("auth.email_label")} <span className="text-orange-400">*</span>
            </Label>
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none top-6">
              <svg
                className="w-5 h-5 text-white/60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                />
              </svg>
            </div>
            <Input
              placeholder={t("auth.email_placeholder")}
              type="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="pl-12 bg-white/10 border-white/20 text-white placeholder-white/60 focus:border-orange-400 focus:ring-orange-400"
            />
          </div>

          {/* Champ Mot de passe avec icône */}
          <div className="relative">
            <Label className="text-white/90 text-sm font-medium mb-2 block">
              {t("auth.password_label")}{" "}
              <span className="text-orange-400">*</span>
            </Label>
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none top-6">
              <svg
                className="w-5 h-5 text-white/60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <Input
              value={password}
              type={showPassword ? "text" : "password"}
              placeholder={t("auth.password_placeholder")}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-12 bg-white/10 border-white/20 text-white placeholder-white/60 focus:border-orange-400 focus:ring-orange-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 pr-4 flex items-center text-white hover:text-orange-200 transition-colors top-8 h-10"
            >
              {showPassword ? (
                <EyeIcon className="size-5 fill-black " />
              ) : (
                <EyeCloseIcon className="size-5 fill-black" />
              )}
            </button>
          </div>
        </div>

        {/* Options avec style moderne */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Checkbox
              checked={isChecked}
              onChange={setIsChecked}
              className="border-white/30 bg-white/10"
            />
            <span className="text-white/80 text-sm">
              {t("auth.remember_me")}
            </span>
          </div>
          <Link
            to="/reset-password"
            className="text-sm text-orange-200 hover:text-orange-100 transition-colors"
          >
            {t("auth.forgot_password")}
          </Link>
        </div>

        {/* Bouton uni orange */}
        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
        >
          {t("auth.sign_in")}
        </button>
      </form>

      {/* Footer avec style moderne */}
      <div className="text-center pt-6 border-t border-white/20">
        <p className="text-white/80 text-sm">
          {t("auth.no_account")}{" "}
          <Link
            to="/signup"
            className="text-orange-200 hover:text-orange-100 font-light transition-colors"
          >
            {t("auth.create_account")}
          </Link>
        </p>
      </div>
    </div>
  );
}
