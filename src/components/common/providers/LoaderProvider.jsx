"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { loaderActions } from "@/store/loaderStore";
import { storeActions } from "@/store";

export default function LoaderProvider({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    loaderActions.hide();
    storeActions.hideContactForm();
  }, [pathname]);

  return children;
}