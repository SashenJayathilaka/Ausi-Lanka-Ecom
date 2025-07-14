import AdminSidebar from "@/components/admin/sidebar";
import Navbar from "@/components/home/navbar";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <main className="relative min-h-screen bg-white text-gray-800">
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex flex-1 pt-16">
          {" "}
          {/* pt-16 matches navbar height */}
          <AdminSidebar />
          <div className="flex-1 lg:ml-64 overflow-y-auto p-4 md:p-6 lg:p-8 bg-gray-50">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
