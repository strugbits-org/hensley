"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { loaderActions } from '@/store/loaderStore';
import { scrollToTop } from "@/utils";

const normalizePath = (path) => {
  if (!path || typeof path !== 'string') return '';
  try {
    const url = new URL(path, 'http://local');
    const params = new URLSearchParams(url.search);
    const sorted = [...params.entries()]
      .map(([k, v]) => [k, v.trim()])
      .sort(([a], [b]) => a.localeCompare(b));
    const qs = new URLSearchParams(sorted).toString();
    const pathname = url.pathname.replace(/\/$/, '') || '/';
    return qs ? `${pathname}?${qs}` : pathname;
  } catch {
    return path;
  }
};

export const CustomLink = ({ to, children, className, target, attributes, onClick, prefetch }) => {
  const pathname = usePathname();

  const handleClick = (e) => {
    if (typeof window !== 'undefined') {
      document.body.classList.remove('overflow-hidden');
    }

    if (onClick) onClick();

    if (to === undefined || !to || to === "") {
      e.preventDefault();
      scrollToTop();
      return;
    }

    const currentFullPath =
      typeof window !== 'undefined' ? `${pathname}${window.location.search}` : pathname;
    if (normalizePath(currentFullPath) === normalizePath(to) || pathname === to) {
      e.preventDefault();
      scrollToTop();
      return;
    }

    if (target) {
      return;
    }

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
      prefetch={prefetch}
      {...attributes}
    >
      {children}
    </Link>
  );
};
