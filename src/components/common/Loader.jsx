"use client";
import { useSnapshot } from 'valtio';
import { loaderState } from '@/store/loaderStore';
import Loading from '@/app/loading';

export default function Loader() {
    const { isLoading } = useSnapshot(loaderState);

    if (!isLoading) return null;

    return <Loading inline={false} />;
}