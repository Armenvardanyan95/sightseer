export function deepProxy<T extends Record<string | number | symbol, unknown>>(
    obj: T,
    handler: {
        get(target: T, key: keyof T): void;
        set(target: T, key: keyof T, value: any): boolean;
    }
): T {
    return new Proxy(obj, {
        get(target: T, key: keyof T) {
            if (typeof target[key] === 'object') {
                return deepProxy(target[key] as any, handler);
            }
            return handler.get(target, key);
        },
        set: handler.set,
    });
}