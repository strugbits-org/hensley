import { loaderActions } from '@/store/loaderStore';
import { useRouter, usePathname } from 'next/navigation';

const useRedirectWithLoader = () => {
  const router = useRouter();
  const pathname = usePathname();

  const redirectWithLoader = (slug) => {
    if (typeof window !== 'undefined') {
      document.body.classList.remove('overflow-hidden');
    }

    if (!slug || pathname === slug) return;

    loaderActions.show();
    router.push(slug);
  };

  return redirectWithLoader;
};

export default useRedirectWithLoader;
