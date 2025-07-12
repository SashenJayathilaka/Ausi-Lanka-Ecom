import Footer from "@/components/home/footer";
import Navbar from "@/components/home/navbar";

type Props = {
  children: React.ReactNode;
};

function Layout({ children }: Props) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-white dark:bg-gray-900">
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex flex-1 pt-16">
          {/*      <AppSidebar /> */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </div>
        <Footer />
      </div>
    </main>
  );
}

export default Layout;
