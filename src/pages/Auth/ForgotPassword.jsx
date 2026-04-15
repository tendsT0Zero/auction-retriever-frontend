// ForgotPassword component.
import React from "react";
import AuthLayout from "../../layouts/AuthLayout";
import ForgotPasswordForm from "../../components/auth/ForgotPasswordForm";

function ForgotPassword() {
  return (
    <AuthLayout className="w-full container mx-auto">
      <ForgotPasswordForm />
    </AuthLayout>
  );
}

export default ForgotPassword;
