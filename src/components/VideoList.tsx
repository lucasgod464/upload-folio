import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export const VideoList = () => {
  const [videoLinks, setVideoLinks] = useState<any[]>([]);

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
        <h2 className="text-xl font-semibold">Video Links</h2>
        {videoLinks.length > 0 ? (
          <ul className="space-y-2">
            {videoLinks.map((link) => (
              <li key={link.id} className="flex flex-col p-3 bg-secondary rounded-lg">
                <div className="flex items-center justify-between">
                  <a href={link.file_path} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">
                    {link.filename}
                  </a>
                  <span className="text-sm text-muted-foreground">
                    {link.version && <p>Version: {link.version}</p>}
                  </span>
                </div>
                {link.description && <p className="text-sm text-muted-foreground mt-1">{link.description}</p>}
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(link.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No video links available.</p>
        )}
      </div>
    </Card>
  );
};
