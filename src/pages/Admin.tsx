import { UserCreationForm } from "@/components/UserCreationForm";
import { LinkInputForm } from "@/components/LinkInputForm";
import { LinkList } from "@/components/LinkList";
import { UserList } from "@/components/UserList";
import { VideoLinkInputForm } from "@/components/VideoLinkInputForm";
import { VideoList } from "@/components/VideoList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Admin = () => {
  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-background to-secondary">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage users, download links, and video links
          </p>
        </div>
        <Tabs defaultValue="users" className="w-full">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="links">Links</TabsTrigger>
             <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="userlist">User List</TabsTrigger>
          </TabsList>
          <TabsContent value="users">
            <UserCreationForm />
          </TabsContent>
          <TabsContent value="links">
            <LinkInputForm />
            <LinkList />
          </TabsContent>
           <TabsContent value="videos">
            <VideoLinkInputForm />
            <VideoList />
          </TabsContent>
          <TabsContent value="userlist">
            <UserList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
