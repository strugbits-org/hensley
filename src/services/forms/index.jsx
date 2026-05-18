import { logError } from "@/utils";

export const postForm = async (name, payload) => {
    try {
        const response = await fetch(`/api/submissions/${name}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        logError(error);
        throw new Error(error.message);
    }
};