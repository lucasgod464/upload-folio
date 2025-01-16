import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const UserList = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editedUsername, setEditedUsername] = useState("");
  const [editedPassword, setEditedPassword] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);

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
          setFilteredUsers(data);
        }
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const handleEdit = (user: any) => {
    setEditingUser(user.id);
    setEditedUsername(user.username);
    setEditedPassword(user.password);
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditedUsername("");
    setEditedPassword("");
  };

  const handleSaveEdit = async (id: string) => {
    try {
      const { error } = await supabase
        .from('usuarios')
        .update({ username: editedUsername, password: editedPassword })
        .eq('id', id);

      if (error) {
        console.error('Erro ao atualizar usuário:', error);
        return;
      }

      setUsers(users.map(user => user.id === id ? { ...user, username: editedUsername, password: editedPassword } : user));
      setEditingUser(null);
      setEditedUsername("");
      setEditedPassword("");
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
    }
  };

  return (
    <Card className="w-full max-w-md p-8 glass-card fade-in">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Usuários</h2>
        <Input
          type="text"
          placeholder="Buscar usuários..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-4"
        />
        {filteredUsers.length > 0 ? (
          <ul className="space-y-2">
            {filteredUsers.map((user) => (
              <li key={user.id} className="flex flex-col p-3 bg-secondary rounded-lg shadow-md">
                {editingUser === user.id ? (
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <Label htmlFor={`username-${user.id}`}>Usuário</Label>
                      <Input
                        id={`username-${user.id}`}
                        type="text"
                        value={editedUsername}
                        onChange={(e) => setEditedUsername(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={`password-${user.id}`}>Senha</Label>
                      <Input
                        id={`password-${user.id}`}
                        type="text"
                        value={editedPassword}
                        onChange={(e) => setEditedPassword(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button size="sm" onClick={() => handleSaveEdit(user.id)}>Salvar</Button>
                      <Button size="sm" variant="ghost" onClick={handleCancelEdit}>Cancelar</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{user.username}</span>
                    <Button size="sm" onClick={() => handleEdit(user)}>Editar</Button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Nenhum usuário disponível.</p>
        )}
      </div>
    </Card>
  );
};
