"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { loaderActions } from "@/store/loaderStore";
import { lightboxActions } from "@/store/lightboxStore";

export default function LoaderProvider({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    loaderActions.hide();
    lightboxActions.hideAllLightBoxes();
  }, [pathname]);

  return children;
}