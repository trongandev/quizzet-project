import { useState, useEffect, useCallback } from "react";
import { GET_API_WITHOUT_COOKIE } from "@/lib/fetchAPI";

// ✅ Smart Cache với localStorage backup
const CACHE_PREFIX = "quizzet_cache_";
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

interface CacheItem {
    data: any;
    timestamp: number;
}

// ✅ Custom hook để tối ưu data fetching
export function useOptimizedFetch<T>(
    endpoint: string,
    initialData?: T,
    options: {
        cacheKey?: string;
        cacheDuration?: number;
        skipCache?: boolean;
    } = {}
) {
    const [data, setData] = useState<T | null>(initialData || null);
    const [loading, setLoading] = useState(!initialData);
    const [error, setError] = useState<string | null>(null);

    const { cacheKey = endpoint, cacheDuration = CACHE_DURATION, skipCache = false } = options;

    // ✅ Get cached data
    const getCachedData = useCallback(() => {
        if (skipCache || typeof window === "undefined") return null;

        try {
            const cacheItem = localStorage.getItem(`${CACHE_PREFIX}${cacheKey}`);
            if (!cacheItem) return null;

            const { data: cachedData, timestamp }: CacheItem = JSON.parse(cacheItem);
            const isExpired = Date.now() - timestamp > cacheDuration;

            if (isExpired) {
                localStorage.removeItem(`${CACHE_PREFIX}${cacheKey}`);
                return null;
            }

            return cachedData;
        } catch (error) {
            console.warn("Cache read error:", error);
            return null;
        }
    }, [cacheKey, cacheDuration, skipCache]);

    // ✅ Set cached data
    const setCachedData = useCallback(
        (newData: T) => {
            if (skipCache || typeof window === "undefined") return;

            try {
                const cacheItem: CacheItem = {
                    data: newData,
                    timestamp: Date.now(),
                };
                localStorage.setItem(`${CACHE_PREFIX}${cacheKey}`, JSON.stringify(cacheItem));
            } catch (error) {
                console.warn("Cache write error:", error);
            }
        },
        [cacheKey, skipCache]
    );

    // ✅ Fetch data with cache strategy
    const fetchData = useCallback(
        async (force = false) => {
            // 1. Check cache first (if not forcing)
            if (!force && !loading) {
                const cachedData = getCachedData();
                if (cachedData) {
                    setData(cachedData);
                    setError(null);
                    return cachedData;
                }
            }

            try {
                setLoading(true);
                setError(null);

                // 2. Fetch from API
                const response = await GET_API_WITHOUT_COOKIE(endpoint);

                if (!response.ok) {
                    throw new Error(`API Error: ${response.status}`);
                }

                const newData = response.listFlashCards || response;

                // 3. Update state and cache
                setData(newData);
                setCachedData(newData);

                return newData;
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "Unknown error";
                setError(errorMessage);
                console.error("Fetch error:", errorMessage);

                // 4. Fallback to cache if API fails
                const cachedData = getCachedData();
                if (cachedData) {
                    setData(cachedData);
                    return cachedData;
                }

                return null;
            } finally {
                setLoading(false);
            }
        },
        [endpoint, getCachedData, setCachedData, loading]
    );

    // ✅ Auto-fetch on mount if no initial data
    useEffect(() => {
        if (!initialData) {
            fetchData();
        }
    }, [fetchData, initialData]);

    // ✅ Refresh function
    const refresh = useCallback(() => fetchData(true), [fetchData]);

    // ✅ Clear cache function
    const clearCache = useCallback(() => {
        if (typeof window !== "undefined") {
            localStorage.removeItem(`${CACHE_PREFIX}${cacheKey}`);
        }
    }, [cacheKey]);

    return {
        data,
        loading,
        error,
        refresh,
        clearCache,
        fetchData,
    };
}

// ✅ Specialized hook for flashcards
export function useFlashcard(id: string, initialData?: any) {
    return useOptimizedFetch(`/flashcards/${id}`, initialData, {
        cacheKey: `flashcard_${id}`,
        cacheDuration: 30 * 60 * 1000, // 30 minutes
    });
}

// ✅ Clear all cache (useful for development)
export function clearAllCache() {
    if (typeof window === "undefined") return;

    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
        if (key.startsWith(CACHE_PREFIX)) {
            localStorage.removeItem(key);
        }
    });
}
