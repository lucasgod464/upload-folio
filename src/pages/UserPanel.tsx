import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const UserPanel = () => {
  const [links, setLinks] = useState<any[]>([]);
  const [videoLinks, setVideoLinks] = useState<any[]>([]);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const { data, error } = await supabase
          .from('files')
          .select('*')
          .not('filename', 'eq', 'video');

        if (error) {
          console.error('Erro ao buscar links:', error);
          return;
        }

        if (data) {
          setLinks(data);
        }
      } catch (error) {
        console.error('Erro ao buscar links:', error);
      }
    };

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

    fetchLinks();
    fetchVideoLinks();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-background to-secondary">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">User Panel</h1>
          <p className="text-muted-foreground">
            Here are the latest updates and download links
          </p>
        </div>
        <Card className="w-full p-8 glass-card fade-in">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Download Links</h2>
            {links.length > 0 ? (
              <ul className="space-y-2">
                {links.map((link) => (
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
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No links available.</p>
            )}
          </div>
        </Card>
        <Card className="w-full p-8 glass-card fade-in">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Video Links</h2>
            {videoLinks.length > 0 ? (
              <div className="space-y-2">
                {videoLinks.map((link) => (
                  <div key={link.id} className="flex flex-col p-3 bg-secondary rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{link.filename}</span>
                      <span className="text-sm text-muted-foreground">
                        {link.version && <p>Version: {link.version}</p>}
                      </span>
                    </div>
                    {link.description && <p className="text-sm text-muted-foreground mt-1">{link.description}</p>}
                    <div className="aspect-video w-full mt-2 overflow-hidden rounded-md">
                      <iframe
                        width="560"
                        height="315"
                        src={link.file_path}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="w-full h-full"
                      ></iframe>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No video links available.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default UserPanel;
