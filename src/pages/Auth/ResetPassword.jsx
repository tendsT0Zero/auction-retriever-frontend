// ResetPassword component.
import React from "react";
import AuthLayout from "../../layouts/AuthLayout";
import ResetPasswordForm from "../../components/auth/ResetPasswordForm";

function ResetPassword() {
  return (
    <AuthLayout className="w-full container mx-auto">
      <ResetPasswordForm />
    </AuthLayout>
  );
}

export default ResetPassword;
