import { LoginForm } from "@/components/LoginForm";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-secondary">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-muted-foreground">
            Sign in to access your admin dashboard
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;