import { UserCreationForm } from "@/components/UserCreationForm";
import { LinkInputForm } from "@/components/LinkInputForm";
import { LinkList } from "@/components/LinkList";
import { UserList } from "@/components/UserList";
import { VideoLinkInputForm } from "@/components/VideoLinkInputForm";
import { VideoList } from "@/components/VideoList";
import { NoticeInputForm } from "@/components/NoticeInputForm";
import { NoticeList } from "@/components/NoticeList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Admin = () => {
  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-background to-secondary">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Painel de Admin</h1>
          <p className="text-muted-foreground">
            Gerenciar usuários, links de download e avisos
          </p>
        </div>
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="links">Links</TabsTrigger>
             <TabsTrigger value="videos">Vídeos</TabsTrigger>
             <TabsTrigger value="notices">Avisos</TabsTrigger>
          </TabsList>
          <TabsContent value="users" className="flex gap-8 items-start">
            <div className="flex-1">
              <UserCreationForm />
            </div>
            <div className="flex-1">
              <UserList />
            </div>
          </TabsContent>
          <TabsContent value="links" className="flex gap-8 items-start">
            <div className="flex-1">
              <LinkInputForm />
            </div>
            <div className="flex-1">
              <LinkList />
            </div>
          </TabsContent>
           <TabsContent value="videos" className="flex gap-8 items-start">
            <div className="flex-1">
              <VideoLinkInputForm />
            </div>
            <div className="flex-1">
              <VideoList />
            </div>
          </TabsContent>
          <TabsContent value="notices" className="flex gap-8 items-start">
            <div className="flex-1">
              <NoticeInputForm />
            </div>
            <div className="flex-1">
              <NoticeList />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
