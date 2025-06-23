export const revalidateCache = async (options: { tag?: string | string[]; path?: string | string[] }) => {
    try {
        const { tag, path } = options;

        const body: any = {};
        if (tag) body.tag = Array.isArray(tag) ? tag : [tag];
        if (path) body.path = Array.isArray(path) ? path : [path];

        const response = await fetch("/api/revalidate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error("Failed to revalidate");
        }

        return await response.json();
    } catch (error) {
        console.error("Revalidation failed:", error);
        throw error;
    }
};
