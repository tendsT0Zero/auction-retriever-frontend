// Signup component.
import React from "react";
import AuthLayout from "../../layouts/AuthLayout";
import SignupForm from "../../components/auth/SignupForm";
function Signup() {
  return (
    <AuthLayout className="w-full container mx-auto">
      <SignupForm />
    </AuthLayout>
  );
}

export default Signup;
