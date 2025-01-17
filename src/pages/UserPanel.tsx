    import { useState, useEffect } from "react";
    import { Card } from "@/components/ui/card";
    import { supabase } from "@/integrations/supabase/client";
    import { Button } from "@/components/ui/button";
    import { useNavigate } from "react-router-dom";
    import { format, isPast, differenceInDays, differenceInHours, differenceInMinutes } from "date-fns";

    const UserPanel = () => {
      const [links, setLinks] = useState<any[]>([]);
      const [videoLinks, setVideoLinks] = useState<any[]>([]);
      const [topNotice, setTopNotice] = useState<any | null>(null);
      const [bottomNotice, setBottomNotice] = useState<any | null>(null);
      const [user, setUser] = useState<any | null>(null);
      const [remainingTime, setRemainingTime] = useState<string | null>(null);
      const navigate = useNavigate();

      useEffect(() => {
        const fetchLinks = async () => {
          try {
            const { data, error } = await supabase
              .from('download_links')
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

        const fetchNotices = async () => {
          try {
            const { data, error } = await supabase
              .from('files')
              .select('*')
              .in('filename', ['top_notice', 'bottom_notice']);

            if (error) {
              console.error('Erro ao buscar avisos:', error);
              return;
            }

            if (data) {
              const top = data.find(item => item.filename === 'top_notice' && item.is_active);
              const bottom = data.find(item => item.filename === 'bottom_notice' && item.is_active);
              setTopNotice(top || null);
              setBottomNotice(bottom || null);
            }
          } catch (error) {
            console.error('Erro ao buscar avisos:', error);
          }
        };

        const fetchUser = async () => {
          try {
            const { data, error } = await supabase
              .from('usuarios')
              .select('*')
              .eq('username', localStorage.getItem('username'))
              .maybeSingle();

            if (error) {
              console.error('Erro ao buscar usuário:', error);
              return;
            }

            if (data) {
              setUser(data);
            }
          } catch (error) {
            console.error('Erro ao buscar usuário:', error);
          }
        };

        fetchLinks();
        fetchVideoLinks();
        fetchNotices();
        fetchUser();
      }, []);

      useEffect(() => {
        if (user && user.access_time) {
          const accessDate = new Date(user.access_time);
          if (isPast(accessDate)) {
            navigate("/");
          } else {
            const days = differenceInDays(accessDate, new Date());
            const hours = differenceInHours(accessDate, new Date()) % 24;
            const minutes = differenceInMinutes(accessDate, new Date()) % 60;
            setRemainingTime(`${days} dias, ${hours} horas e ${minutes} minutos`);
          }
        } else {
          setRemainingTime("Acesso Ilimitado");
        }
      }, [user, navigate]);

      const handleLogout = () => {
        // In a real app, you would clear the user's session here
        navigate("/");
      };

      return (
        <div className="min-h-screen p-8 bg-gradient-to-br from-background to-secondary">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold tracking-tight" style={{ color: "#5c67f2" }}>ZPro Atualiza
                <span className="text-lg font-normal ml-4 text-muted-foreground">
                  {remainingTime}
                </span>
              </h1>
              <Button onClick={handleLogout} variant="outline">Sair</Button>
            </div>
            <p className="text-sm text-muted-foreground">
              O tempo de acesso exibido acima é referente ao acesso a esta área de atualizações.
            </p>
            <p className="text-muted-foreground">
              Aqui estão as últimas atualizações e links para download
            </p>
            {topNotice && (
              <Card className="w-full p-4 glass-card fade-in" style={{ backgroundColor: topNotice.content_type || 'white' }}>
                <div className="text-center text-lg font-semibold text-foreground">
                  {topNotice.file_path}
                </div>
              </Card>
            )}
            <Card className="w-full p-8 glass-card fade-in">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Links de Vídeo</h2>
                {videoLinks.length > 0 ? (
                  <div className="space-y-2">
                    {videoLinks.map((link) => (
                      <div key={link.id} className="flex flex-col p-3 bg-secondary rounded-lg shadow-md">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{link.filename}</span>
                          <span className="text-sm text-muted-foreground">
                            {link.version && <p>Versão: {link.version}</p>}
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
                  <p className="text-sm text-muted-foreground">Nenhum link de vídeo disponível.</p>
                )}
              </div>
            </Card>
            {bottomNotice && (
              <Card className="w-full p-4 glass-card fade-in" style={{ backgroundColor: bottomNotice?.content_type || 'white' }}>
                <div className="text-center text-lg font-semibold text-foreground">
                  {bottomNotice.file_path}
                </div>
              </Card>
            )}
            <Card className="w-full p-8 glass-card fade-in">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Links para Download</h2>
                <p className="text-muted-foreground">
                  Aqui estão as últimas atualizações e links para download
                </p>
                {links.length > 0 ? (
                  <ul className="space-y-2">
                    {links.map((link) => (
                      <li key={link.id} className="flex flex-col p-3 bg-secondary rounded-lg shadow-md">
                        <div className="flex items-center justify-between">
                          <a href={link.file_path} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">
                            {link.filename}
                          </a>
                          <span className="text-sm text-muted-foreground">
                            {link.version && <p>Versão: {link.version}</p>}
                          </span>
                        </div>
                        {link.description && <p className="text-sm text-muted-foreground mt-1">{link.description}</p>}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">Nenhum link disponível.</p>
                )}
              </div>
            </Card>
          </div>
        </div>
      );
    };

    export default UserPanel;
