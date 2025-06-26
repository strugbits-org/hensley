"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { loaderActions } from '@/store/loaderStore';
import { scrollToTop } from "@/utils";

export const CustomLink = ({ to, children, className, target, attributes, onClick }) => {
  const router = useRouter();
  const pathname = usePathname();

  const delayedRedirect = (e) => {
    e.preventDefault();

    if (typeof window === 'undefined') {
      document.body.classList.remove('overflow-hidden');
    };

    if (onClick) onClick();

    if (to === undefined || !to || to === "") {
      scrollToTop();
      return;
    };

    if (pathname === to) {
      loaderActions.show();
      scrollToTop();
      setTimeout(() => loaderActions.hide(), 900);
      return;
    }

    if (target === undefined || !target || target === "") {
      loaderActions.show();
      setTimeout(() => {
        router.push(to);
        router.refresh();
      }, 600);
    } else {
      window.open(to, target);
    }

  };

  if (to && (typeof to === "string" && to && to.startsWith("tel") || to.startsWith("mailto"))) {
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
      prefetch={false}
      href={to || ""}
      target={target}
      className={className}
      onClick={delayedRedirect}
      {...attributes}
    >
      {children}
    </Link>
  );
};