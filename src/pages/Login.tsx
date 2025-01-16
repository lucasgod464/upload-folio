import { LoginForm } from "@/components/LoginForm";

    const Login = () => {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-secondary">
          <div className="w-full max-w-md space-y-8 text-center">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight" style={{ color: "#5c67f2" }}>ZPro Atualiza</h1>
            </div>
            <LoginForm />
          </div>
        </div>
      );
    };

    export default Login;
