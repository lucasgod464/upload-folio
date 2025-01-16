import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const NoticeInputForm = () => {
  const [topNotice, setTopNotice] = useState("");
  const [bottomNotice, setBottomNotice] = useState("");
    const [topNoticeColor, setTopNoticeColor] = useState("#ffffff");
  const [bottomNoticeColor, setBottomNoticeColor] = useState("#ffffff");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('files')
        .insert({ filename: "top_notice", file_path: topNotice, is_notice: true, content_type: topNoticeColor, is_active: true });

      if (error) {
        console.error('Erro ao adicionar aviso superior:', error);
        throw error;
      }

      const { error: bottomError } = await supabase
        .from('files')
        .insert({ filename: "bottom_notice", file_path: bottomNotice, is_notice: true, content_type: bottomNoticeColor, is_active: true });

      if (bottomError) {
        console.error('Erro ao adicionar aviso inferior:', bottomError);
        throw bottomError;
      }

      toast({
        title: "Avisos adicionados com sucesso",
        description: "Os novos avisos foram adicionados com sucesso!",
      });
      setTopNotice("");
      setBottomNotice("");
      setTopNoticeColor("#ffffff");
      setBottomNoticeColor("#ffffff");
    } catch (error) {
      console.error('Erro ao adicionar avisos:', error);
      toast({
        title: "Erro ao adicionar avisos",
        description: "Ocorreu um erro ao tentar adicionar os avisos",
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
          <Label htmlFor="topNotice">Aviso Superior</Label>
          <Input
            id="topNotice"
            type="text"
            value={topNotice}
            onChange={(e) => setTopNotice(e.target.value)}
            className="w-full"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="topNoticeColor">Cor do Aviso Superior</Label>
          <Input
            id="topNoticeColor"
            type="color"
            value={topNoticeColor}
            onChange={(e) => setTopNoticeColor(e.target.value)}
            className="w-full"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bottomNotice">Aviso Inferior</Label>
          <Input
            id="bottomNotice"
            type="text"
            value={bottomNotice}
            onChange={(e) => setBottomNotice(e.target.value)}
            className="w-full"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bottomNoticeColor">Cor do Aviso Inferior</Label>
           <Input
            id="bottomNoticeColor"
            type="color"
            value={bottomNoticeColor}
            onChange={(e) => setBottomNoticeColor(e.target.value)}
            className="w-full"
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Adicionando..." : "Adicionar Avisos"}
        </Button>
      </form>
    </Card>
  );
};
