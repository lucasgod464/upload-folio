import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { X, Pencil } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const NoticeList = () => {
  const [notices, setNotices] = useState<any[]>([]);
  const [editingNotice, setEditingNotice] = useState<string | null>(null);
  const [editedNoticeText, setEditedNoticeText] = useState("");
  const [editedNoticeColor, setEditedNoticeColor] = useState("");

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const { data, error } = await supabase
          .from('files')
          .select('*')
          .eq('is_notice', true);

        if (error) {
          console.error('Erro ao buscar avisos:', error);
          return;
        }

        if (data) {
          setNotices(data);
        }
      } catch (error) {
        console.error('Erro ao buscar avisos:', error);
      }
    };

    fetchNotices();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('files')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao excluir aviso:', error);
        return;
      }

      setNotices(notices.filter(notice => notice.id !== id));
    } catch (error) {
      console.error('Erro ao excluir aviso:', error);
    }
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      const { error } = await supabase
        .from('files')
        .update({ is_active: active })
        .eq('id', id);

      if (error) {
        console.error('Erro ao atualizar aviso:', error);
        return;
      }

      setNotices(notices.map(notice => notice.id === id ? { ...notice, is_active: active } : notice));
    } catch (error) {
      console.error('Erro ao atualizar aviso:', error);
    }
  };

  const handleEdit = (notice: any) => {
    setEditingNotice(notice.id);
    setEditedNoticeText(notice.file_path);
    setEditedNoticeColor(notice.content_type);
  };

  const handleCancelEdit = () => {
    setEditingNotice(null);
    setEditedNoticeText("");
    setEditedNoticeColor("");
  };

  const handleSaveEdit = async (id: string, filename: string) => {
    try {
      const { error } = await supabase
        .from('files')
        .update({ file_path: editedNoticeText, content_type: editedNoticeColor })
        .eq('id', id);

      if (error) {
        console.error('Erro ao atualizar aviso:', error);
        return;
      }

      setNotices(notices.map(notice => notice.id === id ? { ...notice, file_path: editedNoticeText, content_type: editedNoticeColor } : notice));
      setEditingNotice(null);
      setEditedNoticeText("");
      setEditedNoticeColor("");
    } catch (error) {
      console.error('Erro ao atualizar aviso:', error);
    }
  };

  return (
    <Card className="w-full max-w-md p-8 glass-card fade-in">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Avisos</h2>
        {notices.length > 0 ? (
          <ul className="space-y-2">
            {notices.map((notice) => (
              <li key={notice.id} className="flex flex-col p-3 bg-secondary rounded-lg shadow-md">
                {editingNotice === notice.id ? (
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <Label htmlFor={`notice-text-${notice.id}`}>Aviso</Label>
                      <Input
                        id={`notice-text-${notice.id}`}
                        type="text"
                        value={editedNoticeText}
                        onChange={(e) => setEditedNoticeText(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={`notice-color-${notice.id}`}>Cor do Aviso</Label>
                      <Input
                        id={`notice-color-${notice.id}`}
                        type="color"
                        value={editedNoticeColor}
                        onChange={(e) => setEditedNoticeColor(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button size="sm" onClick={() => handleSaveEdit(notice.id, notice.filename)}>Salvar</Button>
                      <Button size="sm" variant="ghost" onClick={handleCancelEdit}>Cancelar</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{notice.filename}</span>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`notice-active-${notice.id}`}
                        checked={notice.is_active}
                        onCheckedChange={(checked) => handleToggleActive(notice.id, checked)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(notice)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(notice.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
                {notice.file_path && <p className="text-sm text-muted-foreground mt-1">{notice.file_path}</p>}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Nenhum aviso disponível.</p>
        )}
      </div>
    </Card>
  );
};
