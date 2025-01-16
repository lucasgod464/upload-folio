import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const VideoLinkInputForm = () => {
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");
  const [version, setVersion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Ensure the link is a valid YouTube embed URL
      const videoId = extractVideoId(link);
      const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : link;

      const { error } = await supabase
        .from('files')
        .insert({ file_path: embedUrl, filename: "video", description, version });

      if (error) {
        console.error('Erro ao adicionar link do vídeo:', error);
        throw error;
      }

      toast({
        title: "Link do vídeo adicionado com sucesso",
        description: "O novo link do vídeo foi adicionado com sucesso!",
      });
      setLink("");
      setDescription("");
      setVersion("");
    } catch (error) {
      console.error('Erro ao adicionar link do vídeo:', error);
      toast({
        title: "Erro ao adicionar link do vídeo",
        description: "Ocorreu um erro ao tentar adicionar o link do vídeo",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to extract video ID from a YouTube URL
  const extractVideoId = (url: string): string | null => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/)
    return match ? match[1] : null;
  };

  return (
    <Card className="w-full max-w-md p-8 glass-card fade-in">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="link">Link do Vídeo</Label>
          <Input
            id="link"
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full"
            required
          />
        </div>
         <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="version">Versão</Label>
          <Input
            id="version"
            type="text"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            className="w-full"
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Adicionando..." : "Adicionar Link do Vídeo"}
        </Button>
      </form>
    </Card>
  );
};
