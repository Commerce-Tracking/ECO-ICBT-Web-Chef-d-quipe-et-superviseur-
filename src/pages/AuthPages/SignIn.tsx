import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
        <PageMeta
            title="OFR | Admin"
            description="Opération Fluidité Routière Agro-bétail"
        />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
