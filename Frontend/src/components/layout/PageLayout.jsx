import { Sidebar } from "../Sidebar";

export function PageLayout({ children }) {
  return (
    <div className="w-screen h-screen bg-neutral-950 text-white flex">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
