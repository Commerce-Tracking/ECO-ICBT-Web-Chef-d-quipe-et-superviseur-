import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import useAuth from "../../providers/auth/useAuth.ts";
import { useCustomModal } from "../../context/ModalContext.tsx";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // @ts-ignore
  const { login, getUserInfos } = useAuth();
  const navigate = useNavigate();
  const { openModal } = useCustomModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(username, password);
    try {
      const req = await login(username, password);

      if (req === false) {
        openModal({
          title: "Attention!",
          description: "Erreur interne.",
          content: (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Connexion échoué!
            </p>
          ),
        });
      } else {
        if (req.success === false) {
          openModal({
            title: "Connexion échouée!",
            description: req.message,
            content: "",
          });
        } else {
          console.log("Succes 2");
          await navigate("/");
        }
      }
    } catch (err) {
      openModal({
        title: "Alerte!",
        description: "Erreur de connexion.",
        content: (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Login failed
          </p>
        ),
      });
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Retour
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Se connecter
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Entrez vos identifiants pour vous connecter!
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Email de l'utilisateur{" "}
                    <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input
                    placeholder="exemple@email.com"
                    type={"email"}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div>
                  <Label>
                    Mot de passe <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      value={password}
                      type={showPassword ? "text" : "password"}
                      placeholder="Entrez votre mot de passe"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Rester connecté.
                    </span>
                  </div>
                  {/* <Link
                    to="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Mot de passe oublié?
                  </Link> */}
                </div>
                <div>
                  <Button className="w-full" size="sm">
                    Connexion
                  </Button>
                </div>
              </div>
            </form>

            {/* <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Pas de compte? {""}
                <Link
                  to="/signup"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Créer un compte
                </Link>
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
