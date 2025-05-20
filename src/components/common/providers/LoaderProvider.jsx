"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { loaderActions } from "@/store/loaderStore";

export default function LoaderProvider({ children }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    loaderActions.hide();
  }, [pathname, searchParams]);

  return children;
}