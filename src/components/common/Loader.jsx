"use client";
import { useSnapshot } from 'valtio';
import { loaderState } from '@/store/loaderStore';
import Loading from '@/components/common/Loading';

export default function Loader() {
    const { isLoading } = useSnapshot(loaderState);

    if (!isLoading) return null;

    return <Loading inline={false} />;
}