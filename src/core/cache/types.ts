export interface CacheClient {
    get: <T>(key: string) => Promise<T | undefined>;
    set: <T>(key: string, value: T, ttlSeconds?: number) => void;
}
