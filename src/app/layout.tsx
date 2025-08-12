import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import LayoutClient from "@/components/LayoutClient";
import BootstrapClient from "@/lib/bootstrapClient";
import { AuthProvider } from "@/context/AuthContext";
import RouteGuard from "@/lib/RouteGuard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dental Office Online Scheduling System",
  description:
    "A web application for a dental office that allows patients to schedule and manage their appointments online.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-bs-theme="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
            <RouteGuard>
              <LayoutClient>{children}</LayoutClient>
            </RouteGuard>
        </AuthProvider>
        <BootstrapClient />
      </body>
    </html>
  );
}
