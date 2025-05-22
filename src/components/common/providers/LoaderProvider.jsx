"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { loaderActions } from "@/store/loaderStore";

export default function LoaderProvider({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    loaderActions.hide();
  }, [pathname]);

  return children;
}