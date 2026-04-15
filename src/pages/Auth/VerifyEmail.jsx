// VerifyEmail component.
import React from "react";
import AuthLayout from "../../layouts/AuthLayout";
import VerifyEmailForm from "../../components/auth/VerifyEmailForm";
function VerifyEmail() {
  return (
    <AuthLayout className="w-full container mx-auto">
      <VerifyEmailForm />
    </AuthLayout>
  );
}

export default VerifyEmail;
