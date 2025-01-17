    import { useState } from "react";
    import { Button } from "@/components/ui/button";
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";
    import { Card } from "@/components/ui/card";
    import { useToast } from "@/components/ui/use-toast";
    import { supabase } from "@/integrations/supabase/client";
    import { Calendar } from "@/components/ui/calendar";
    import { format, isValid } from "date-fns";
    import { Checkbox } from "@/components/ui/checkbox";

    export const UserCreationForm = () => {
      const [username, setUsername] = useState("");
      const [password, setPassword] = useState("");
      const [accessDays, setAccessDays] = useState<string>("");
      const [unlimitedAccess, setUnlimitedAccess] = useState(false);
      const [isLoading, setIsLoading] = useState(false);
      const { toast } = useToast();

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
          let accessTime = null;
          if (!unlimitedAccess && accessDays) {
            const parsedDate = new Date(accessDays);
            if (isValid(parsedDate)) {
              accessTime = parsedDate.toISOString();
            } else {
              console.error('Data inválida:', accessDays);
              return;
            }
          }

          const { error } = await supabase
            .from('usuarios')
            .insert({ username, password, is_admin: false, access_time: unlimitedAccess ? null : accessTime });

          if (error) {
            console.error('Erro ao criar usuário:', error);
            throw error;
          }

          toast({
            title: "Usuário criado com sucesso",
            description: "O novo usuário foi criado com sucesso!",
          });
          setUsername("");
          setPassword("");
          setAccessDays("");
          setUnlimitedAccess(false);
        } catch (error) {
          console.error('Erro ao criar usuário:', error);
          toast({
            title: "Erro ao criar usuário",
            description: "Ocorreu um erro ao tentar criar o usuário",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      };

      return (
        <Card className="w-full max-w-md p-8 glass-card fade-in">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Usuário</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="unlimited-access"
                  checked={unlimitedAccess}
                  onCheckedChange={setUnlimitedAccess}
                />
                <Label htmlFor="unlimited-access">Acesso Ilimitado</Label>
              </div>
              {!unlimitedAccess && (
                <Input
                  id="access-time"
                  type="date"
                  value={accessDays}
                  onChange={(e) => setAccessDays(e.target.value)}
                  placeholder="YYYY-MM-DD"
                />
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Criando..." : "Criar Usuário"}
            </Button>
          </form>
        </Card>
      );
    };
