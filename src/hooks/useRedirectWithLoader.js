import { loaderActions } from '@/store/loaderStore';
import { useRouter, usePathname } from 'next/navigation';

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

const useRedirectWithLoader = () => {
  const router = useRouter();
  const pathname = usePathname();

  const redirectWithLoader = (slug) => {
    if (typeof window !== 'undefined') {
      document.body.classList.remove('overflow-hidden');
    }

    if (!slug) return;

    const currentFullPath =
      typeof window !== 'undefined' ? `${pathname}${window.location.search}` : pathname;
    if (normalizePath(currentFullPath) === normalizePath(slug)) return;

    loaderActions.show();
    router.push(slug);
  };

  return redirectWithLoader;
};

export default useRedirectWithLoader;
