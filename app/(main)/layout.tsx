import AppSidebar from "@/components/app-sidebar";
import AuthGuard from "@/components/auth-guard";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-slate-100">

        {/* SIDEBAR */}
        <AppSidebar />

        {/* CONTENT */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}