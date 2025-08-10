"use client";

import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PATHS, PUBLIC_PATHS } from "@/lib/constants";
import Loading from "@/components/Loading";

export default function RouteGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    const isPublic = PUBLIC_PATHS.includes(pathname);

    if (!isPublic && !isAuthenticated) {
      router.replace(PATHS.LOGIN);
      return;
    }

    setIsAllowed(true);
  }, [pathname, isLoading, isAuthenticated, router]);

  if (isLoading || !isAllowed) {
    return <Loading></Loading>;
  }

  return <>{children}</>;
}
