import { loaderActions } from '@/store/loaderStore';
import { useRouter, usePathname } from 'next/navigation';

const useRedirectWithLoader = () => {
  const router = useRouter();
  const pathname = usePathname();

  const redirectWithLoader = (slug, ignoreSamePath) => {
    // Clear any scroll locks from modals before navigation
    if (typeof window !== 'undefined') {
      document.body.classList.remove('overflow-hidden');
    }
    
    if (pathname === slug) {
      if (ignoreSamePath) {
        loaderActions.show();
        setTimeout(() => loaderActions.hide(), 900);
      }
    } else {
      loaderActions.show();
      router.push(slug);
    }
  };

  return redirectWithLoader;
};

export default useRedirectWithLoader;
