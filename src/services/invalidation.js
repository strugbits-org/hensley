"use server";
import { logError } from "@/utils";
import { revalidatePath } from "next/cache";

export const invalidatePath = async (path) => {
    try {
        revalidatePath(path);
        return `Invalidated Path: ${path}`;
    } catch (error) {
        logError(`Error invalidating: ${path}`, error);
    }
};

export const invalidateLayout = async () => {
    try {
        revalidatePath('/', 'layout');
        return `Site invalidated`;
    } catch (error) {
        logError("Error invalidating site", error);
    }
};
