import ResetPassword from "@/components/ResetPassword";

export default async function Page({ params }) {
  const { token } = await params;
  
  return <ResetPassword token={token} />;
}

export const metadata = {
  title: "Reset Password | Hensley",
  description: "Reset your password to access your account.",
};
