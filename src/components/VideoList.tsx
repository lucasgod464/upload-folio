import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Pencil } from "lucide-react";

export const VideoList = () => {
  const [videoLinks, setVideoLinks] = useState<any[]>([]);
  const [editingLink, setEditingLink] = useState<string | null>(null);
  const [editedLinkPath, setEditedLinkPath] = useState("");
  const [editedLinkDescription, setEditedLinkDescription] = useState("");
  const [editedLinkVersion, setEditedLinkVersion] = useState("");

  useEffect(() => {
    const fetchVideoLinks = async () => {
      try {
        const { data, error } = await supabase
          .from('files')
          .select('*')
          .eq('filename', 'video');

        if (error) {
          console.error('Erro ao buscar links de vídeo:', error);
          return;
        }

        if (data) {
          setVideoLinks(data);
        }
      } catch (error) {
        console.error('Erro ao buscar links de vídeo:', error);
      }
    };

    fetchVideoLinks();
  }, []);

  const handleEdit = (link: any) => {
    setEditingLink(link.id);
    setEditedLinkPath(link.file_path);
    setEditedLinkDescription(link.description);
    setEditedLinkVersion(link.version);
  };

  const handleCancelEdit = () => {
    setEditingLink(null);
    setEditedLinkPath("");
    setEditedLinkDescription("");
    setEditedLinkVersion("");
  };

  const handleSaveEdit = async (id: string) => {
    try {
      const { error } = await supabase
        .from('files')
        .update({ file_path: editedLinkPath, description: editedLinkDescription, version: editedLinkVersion })
        .eq('id', id);

      if (error) {
        console.error('Erro ao atualizar link de vídeo:', error);
        return;
      }

      setVideoLinks(videoLinks.map(link => link.id === id ? { ...link, file_path: editedLinkPath, description: editedLinkDescription, version: editedLinkVersion } : link));
      setEditingLink(null);
      setEditedLinkPath("");
      setEditedLinkDescription("");
      setEditedLinkVersion("");
    } catch (error) {
      console.error('Erro ao atualizar link de vídeo:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('files')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao excluir link de vídeo:', error);
        return;
      }

      setVideoLinks(videoLinks.filter(link => link.id !== id));
    } catch (error) {
      console.error('Erro ao excluir link de vídeo:', error);
    }
  };

  return (
    <Card className="w-full max-w-md p-8 glass-card fade-in">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Links de Vídeo</h2>
        {videoLinks.length > 0 ? (
          <ul className="space-y-2">
            {videoLinks.map((link) => (
              <li key={link.id} className="flex flex-col p-3 bg-secondary rounded-lg shadow-md">
                {editingLink === link.id ? (
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <Label htmlFor={`link-path-${link.id}`}>Link</Label>
                      <Input
                        id={`link-path-${link.id}`}
                        type="text"
                        value={editedLinkPath}
                        onChange={(e) => setEditedLinkPath(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={`link-description-${link.id}`}>Descrição</Label>
                      <Input
                        id={`link-description-${link.id}`}
                        type="text"
                        value={editedLinkDescription}
                        onChange={(e) => setEditedLinkDescription(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={`link-version-${link.id}`}>Versão</Label>
                      <Input
                        id={`link-version-${link.id}`}
                        type="text"
                        value={editedLinkVersion}
                        onChange={(e) => setEditedLinkVersion(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button size="sm" onClick={() => handleSaveEdit(link.id)}>Salvar</Button>
                      <Button size="sm" variant="ghost" onClick={handleCancelEdit}>Cancelar</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <a href={link.file_path} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">
                      {link.filename}
                    </a>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(link)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(link.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
                {link.description && <p className="text-sm text-muted-foreground mt-1">{link.description}</p>}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Nenhum link de vídeo disponível.</p>
        )}
      </div>
    </Card>
  );
};
