"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { loaderActions } from "@/store/loaderStore";
import { lightboxActions } from "@/store/lightboxStore";

export default function LoaderProvider({ children }) {
  const pathname = usePathname();

  // These pages own their own loading UI. Pathname-only hide never fires when
  // staying on /search-results and only changing ?query= — those pages must
  // clear the nav loader themselves (see SearchResult).
  const dynamicPages = ["/cart", "/saved-products", "/quotes-history", "/account", "/search-results"];

  useEffect(() => {
    if (!dynamicPages.includes(pathname)) {
      loaderActions.hide();
      lightboxActions.hideAllLightBoxes();
    }
  }, [pathname]);

  return children;
}
