import React from "react";
import GridShape from "../../components/common/GridShape";
import { Link } from "react-router";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";
import { useTranslation } from "react-i18next";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background uni ECO ICBT */}
      <div className="absolute inset-0 bg-green-600"></div>

      {/* Formes géométriques décoratives harmonisées */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-500/25 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2"></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/10 rounded-full blur-xl transform -translate-x-1/2 -translate-y-1/2"></div>

      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
        {/* Section formulaire - Côté gauche */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            {/* Card moderne avec glassmorphism ECO ICBT */}
            <div className="backdrop-blur-xl bg-white/15 border border-white/30 rounded-2xl p-8 shadow-2xl">
              {children}
            </div>
          </div>
        </div>

        {/* Section logo - Côté droit */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center relative">
          {/* Background avec pattern subtil ECO ICBT */}
          <div className="absolute inset-0 bg-gradient-to-tl from-white via-gray-50 to-green-50"></div>
          <div className="absolute inset-0 opacity-5">
            <GridShape />
          </div>

          <div className="relative z-10 flex flex-col items-center max-w-md text-center px-8">
            {/* Logo avec animation */}
            <div className="mb-8 transform hover:scale-105 transition-transform duration-300">
              <Link to="/" className="block">
                <img
                  width={300}
                  height={80}
                  src="/images/logo/ECO ICBT logo.jpeg"
                  alt="Logo OFR"
                  className="drop-shadow-lg"
                />
              </Link>
            </div>

            {/* Texte avec style moderne ECO ICBT */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                {t("auth.ecowas_title")}
              </h2>
              <p className="text-lg text-green-600 font-semibold">
                {t("auth.platform_subtitle")}
              </p>
              <div className="w-16 h-1 bg-gradient-to-r from-green-500 to-orange-500 mx-auto rounded-full"></div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {t("auth.platform_description")}
              </p>
            </div>

            {/* Icônes décoratives ECO ICBT avec animations automatiques */}
            <div className="flex space-x-4 mt-8">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center hover:bg-green-200 transition-all duration-300 hover:scale-110 cursor-pointer group animate-bounce">
                <div className="w-6 h-6 bg-green-500 rounded-full group-hover:bg-green-600 transition-colors duration-300 animate-pulse"></div>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center hover:bg-orange-200 transition-all duration-300 hover:scale-110 cursor-pointer group animate-pulse">
                <div className="w-6 h-6 bg-orange-500 rounded-full group-hover:bg-orange-600 transition-colors duration-300 animate-bounce"></div>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-all duration-300 hover:scale-110 cursor-pointer group animate-bounce">
                <div className="w-6 h-6 bg-gray-600 rounded-full group-hover:bg-gray-700 transition-colors duration-300 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Theme toggler repositionné ECO ICBT */}
      <div className="fixed z-50 top-6 right-6">
        <div className="backdrop-blur-xl bg-white/15 border border-white/30 rounded-xl p-2">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  );
}
