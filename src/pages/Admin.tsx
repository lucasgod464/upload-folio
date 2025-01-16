import { FileUpload } from "@/components/FileUpload";

const Admin = () => {
  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-background to-secondary">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Upload and manage your files
          </p>
        </div>
        <FileUpload />
      </div>
    </div>
  );
};

export default Admin;