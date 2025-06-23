"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { loaderActions } from '@/store/loaderStore';

export const CustomLink = ({ to, children, className, target, attributes, onClick }) => {
  const router = useRouter();
  const pathname = usePathname();

  const delayedRedirect = (e) => {
    e.preventDefault();
    if (onClick) onClick();

    if (to === undefined || !to || to === "") return;

    if (pathname === to) {
      loaderActions.show();
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

  if (to && typeof to === "string" && to && to.startsWith("tel") || to.startsWith("mailto")) {
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