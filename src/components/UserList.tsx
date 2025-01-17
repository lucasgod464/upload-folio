    import { useState, useEffect } from "react";
    import { Card } from "@/components/ui/card";
    import { supabase } from "@/integrations/supabase/client";
    import { Button } from "@/components/ui/button";
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";
    import { Calendar } from "@/components/ui/calendar";
    import { format, isValid } from "date-fns";
    import { X, Pencil } from "lucide-react";
    import { Checkbox } from "@/components/ui/checkbox";

    export const UserList = () => {
      const [users, setUsers] = useState<any[]>([]);
      const [editingUser, setEditingUser] = useState<string | null>(null);
      const [editedUsername, setEditedUsername] = useState("");
      const [editedPassword, setEditedPassword] = useState("");
      const [editedAccessDays, setEditedAccessDays] = useState<string>("");
      const [unlimitedAccess, setUnlimitedAccess] = useState(false);
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
        setEditedAccessDays(user.access_time ? format(new Date(user.access_time), 'yyyy-MM-dd') : "");
        setUnlimitedAccess(!user.access_time);
      };

      const handleCancelEdit = () => {
        setEditingUser(null);
        setEditedUsername("");
        setEditedPassword("");
        setEditedAccessDays("");
        setUnlimitedAccess(false);
      };

      const handleSaveEdit = async (id: string) => {
        try {
          let accessTime = null;
          if (!unlimitedAccess && editedAccessDays) {
            const parsedDate = new Date(editedAccessDays);
            if (isValid(parsedDate)) {
              accessTime = parsedDate.toISOString();
            } else {
              console.error('Data inválida:', editedAccessDays);
              return;
            }
          }

          const { error } = await supabase
            .from('usuarios')
            .update({
              username: editedUsername,
              password: editedPassword,
              access_time: unlimitedAccess ? null : accessTime,
            })
            .eq('id', id);

          if (error) {
            console.error('Erro ao atualizar usuário:', error);
            return;
          }

          setUsers(users.map(user => user.id === id ? { ...user, username: editedUsername, password: editedPassword, access_time: unlimitedAccess ? null : accessTime } : user));
          setEditingUser(null);
          setEditedUsername("");
          setEditedPassword("");
          setEditedAccessDays("");
          setUnlimitedAccess(false);
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
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`unlimited-access-${user.id}`}
                              checked={unlimitedAccess}
                              onCheckedChange={setUnlimitedAccess}
                            />
                            <Label htmlFor={`unlimited-access-${user.id}`}>Acesso Ilimitado</Label>
                          </div>
                          {!unlimitedAccess && (
                            <Input
                              id={`access-time-${user.id}`}
                              type="date"
                              value={editedAccessDays}
                              onChange={(e) => setEditedAccessDays(e.target.value)}
                              placeholder="YYYY-MM-DD"
                            />
                          )}
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
