import AdminSidebar from "@/components/admin/sidebar";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <main className="relative min-h-screen bg-white dark:bg-slate-950 text-gray-800 dark:text-gray-100">
      <div className="flex flex-col min-h-screen">
        {/* <Navbar /> */}
        <div className="flex flex-1 pt-16">
          {" "}
          {/* pt-16 matches navbar height */}
          <AdminSidebar />
          <div className="flex-1 lg:ml-64 overflow-y-auto p-4 md:p-6 lg:p-8 bg-gray-50 dark:bg-slate-900">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
