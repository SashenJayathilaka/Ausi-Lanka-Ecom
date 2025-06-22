import Navbar from "@/components/home/navbar";

type Props = {
  children: React.ReactNode;
};

function Layout({ children }: Props) {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div className="absolute -top-28 -left-28 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-500/20 to-pink-500/20 rounded-full blur-[80px] -z-10"></div>
      <div className="overflow-hidden">
        <Navbar />
        {children}
      </div>
    </main>
  );
}

export default Layout;
