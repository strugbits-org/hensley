"use client";

import { useEffect } from "react";
import { logError } from "@/utils";

// Page-level boundary for everything under (root). Catches render/hydration
// errors in the page subtree while keeping the shared Header/Footer, and lets
// the user recover with reset() (a client-only re-render, which clears a
// transient hydration mismatch). Layout-level errors fall through to
// app/global-error.jsx instead.
export default function Error({ error, reset }) {
  useEffect(() => {
    logError("Route error boundary caught:", error);
  }, [error]);

  return (
    <div className="bg-primary min-h-screen w-full flex flex-col items-center justify-center gap-y-8 px-6 text-center">
      <h1 className="text-primary-alt font-recklessRegular leading-none text-[120px] sm:text-[200px] lg:text-[300px]">
        OOPS
      </h1>
      <p className="text-secondary-alt font-haasRegular text-[14px] sm:text-[18px] max-w-[480px]">
        Something went wrong while loading this page.
      </p>
      <button
        onClick={() => reset()}
        className="border border-secondary-alt text-secondary-alt px-8 py-4 font-haasBold uppercase text-xs tracking-[2px] hover:tracking-[4px] transition-all"
      >
        Try again
      </button>
    </div>
  );
}
