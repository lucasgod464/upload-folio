import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const LinkInputForm = () => {
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");
  const [version, setVersion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('files')
        .insert({ file_path: link, filename: "download", description, version });

      if (error) {
        console.error('Erro ao adicionar link:', error);
        throw error;
      }

      toast({
        title: "Link adicionado com sucesso",
        description: "O novo link foi adicionado com sucesso!",
      });
      setLink("");
      setDescription("");
      setVersion("");
    } catch (error) {
      console.error('Erro ao adicionar link:', error);
      toast({
        title: "Erro ao adicionar link",
        description: "Ocorreu um erro ao tentar adicionar o link",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md p-8 glass-card fade-in">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="link">Link</Label>
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
          <Label htmlFor="description">Description</Label>
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
          <Label htmlFor="version">Version</Label>
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
          {isLoading ? "Adicionando..." : "Adicionar Link"}
        </Button>
      </form>
    </Card>
  );
};
