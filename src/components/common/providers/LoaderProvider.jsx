"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { loaderActions } from "@/store/loaderStore";
import { lightboxActions } from "@/store/lightboxStore";

export default function LoaderProvider({ children }) {
  const pathname = usePathname();

  const dynamicPages = ["/cart", "/saved-products", "/quotes-history", "/account"];

  useEffect(() => {
    if (!dynamicPages.includes(pathname)) {
      loaderActions.hide();
      lightboxActions.hideAllLightBoxes();
    }
  }, [pathname]);

  return children;
}