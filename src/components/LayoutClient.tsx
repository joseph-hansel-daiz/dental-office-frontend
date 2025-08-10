"use client";

import Navbar from "@/components/NavBar";
import { HIDE_NAVBAR_PATHS } from "@/lib/constants";
import { usePathname } from "next/navigation";

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideNavBar = HIDE_NAVBAR_PATHS.includes(pathname);

  return (
    <>
      {!hideNavBar && <Navbar />}
      <main className="pt-6">
        <div className="container" style={{ minHeight: "95vh" }}>
          {children}
        </div>
      </main>
    </>
  );
}
