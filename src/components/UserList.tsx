import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

export const UserList = () => {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('usuarios')
          .select('*');

        if (error) {
          console.error('Erro ao buscar usuários:', error);
          return;
        }

        if (data) {
          setUsers(data);
        }
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Card className="w-full max-w-md p-8 glass-card fade-in">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Users</h2>
        {users.length > 0 ? (
          <ul className="space-y-2">
            {users.map((user) => (
              <li key={user.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <span className="text-sm">{user.username}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No users available.</p>
        )}
      </div>
    </Card>
  );
};
