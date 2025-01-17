    import { LoginForm } from "@/components/LoginForm";
    import { supabase } from "@/integrations/supabase/client";
    import { useToast } from "@/components/ui/use-toast";
    import { useNavigate } from "react-router-dom";
    import { isPast } from "date-fns";
    import { useEffect } from "react";

    const Login = () => {
      const { toast } = useToast();
      const navigate = useNavigate();

      const checkAccess = async (username: string) => {
        try {
          const { data, error } = await supabase
            .from('usuarios')
            .select('access_time')
            .eq('username', username)
            .maybeSingle();

          if (error) {
            console.error('Erro ao verificar acesso:', error);
            return false;
          }

          if (data && data.access_time) {
            const accessDate = new Date(data.access_time);
            if (isPast(accessDate)) {
              toast({
                title: "Acesso Expirado",
                description: "Seu tempo de acesso expirou.",
                variant: "destructive",
              });
              return false;
            }
          }
          return true;
        } catch (error) {
          console.error('Erro ao verificar acesso:', error);
          return false;
        }
      };

      const handleLoginSuccess = async (username: string, isAdmin: boolean) => {
        const hasAccess = await checkAccess(username);
        if (hasAccess) {
          localStorage.setItem('username', username);
          navigate(isAdmin ? '/admin' : '/user');
        }
      };

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-secondary">
          <div className="w-full max-w-md space-y-8 text-center">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight" style={{ color: "#5c67f2" }}>ZPro Atualiza</h1>
            </div>
            <LoginForm onLoginSuccess={handleLoginSuccess} />
          </div>
        </div>
      );
    };

    export default Login;
