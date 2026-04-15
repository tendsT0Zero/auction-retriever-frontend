// Login component.
import AuthLayout from "../../layouts/AuthLayout";
import LoginForm from "../../components/auth/LoginForm";

function Login() {
  return (
    <AuthLayout className="w-full container mx-auto">
      <LoginForm />
    </AuthLayout>
  );
}

export default Login;
