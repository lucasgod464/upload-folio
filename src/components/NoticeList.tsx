import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

export const NoticeList = () => {
  const [notices, setNotices] = useState<any[]>([]);

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

  return (
    <Card className="w-full max-w-md p-8 glass-card fade-in">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Avisos</h2>
        {notices.length > 0 ? (
          <ul className="space-y-2">
            {notices.map((notice) => (
              <li key={notice.id} className="flex flex-col p-3 bg-secondary rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{notice.filename}</span>
                </div>
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
