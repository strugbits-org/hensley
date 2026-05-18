import { loaderActions } from '@/store/loaderStore';
import { useRouter, usePathname } from 'next/navigation';

const useRedirectWithLoader = () => {
  const router = useRouter();
  const pathname = usePathname();

  const redirectWithLoader = (slug) => {
    if (typeof window !== 'undefined') {
      document.body.classList.remove('overflow-hidden');
    }

    if (!slug) return;

    // Compare full path (incl. query) against the current location so
    // repeat-navigations to the exact same URL don't trip the global
    // loader. Next's router.push is a no-op when the URL is identical,
    // which would otherwise leave the loader showing forever.
    const currentFullPath = typeof window !== 'undefined'
      ? `${pathname}${window.location.search}`
      : pathname;
    if (currentFullPath === slug) return;

    loaderActions.show();
    router.push(slug);
  };

  return redirectWithLoader;
};

export default useRedirectWithLoader;
