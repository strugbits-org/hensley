"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { loaderActions } from '@/store/loaderStore';
import { scrollToTop } from "@/utils";

export const CustomLink = ({ to, children, className, target, attributes, onClick }) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = (e) => {
    if (typeof window !== 'undefined') {
      document.body.classList.remove('overflow-hidden');
    }

    if (onClick) onClick();

    // Empty target: just scroll. Don't navigate.
    if (to === undefined || !to || to === "") {
      e.preventDefault();
      scrollToTop();
      return;
    }

    // Same-path click: scroll to top, no loader theatre, no navigation.
    if (pathname === to) {
      e.preventDefault();
      scrollToTop();
      return;
    }

    // External / new-tab: let the browser handle it.
    if (target) {
      return;
    }

    // Internal navigation: show the loader and let Next's <Link> push
    // immediately. The loader hides on route change via LoaderProvider.
    loaderActions.show();
  };

  if (to && typeof to === "string" && (to.startsWith("tel") || to.startsWith("mailto"))) {
    return (
      <a
        href={to || ""}
        target={target}
        className={className}
        {...attributes}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={to || ""}
      target={target}
      className={className}
      onClick={handleClick}
      {...attributes}
    >
      {children}
    </Link>
  );
};