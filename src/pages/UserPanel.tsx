import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const UserPanel = () => {
  const [links, setLinks] = useState<any[]>([]);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const { data, error } = await supabase
          .from('files')
          .select('*');

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

    fetchLinks();
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
      </div>
    </div>
  );
};

export default UserPanel;
