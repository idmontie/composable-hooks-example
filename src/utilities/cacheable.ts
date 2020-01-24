import { useCallback } from "react";

export interface Cache {
    get: Function,
    set: Function,
    exists: Function,
}

export interface CacheParams {
    key: string,
    store: Storage
}

function joinKeys(key, subkey) {
    if (subkey) {
        return `${key}/${subkey}`;
    }

    return key;
}

export function useCache({ key, store }: CacheParams): Cache {
    const exists = useCallback((subkey = false) => {
        return store.getItem(joinKeys(key, subkey)) !== null;
    }, [key]);

    const get = useCallback((subkey = false) => {
        const result = store.getItem(joinKeys(key, subkey));

        if (result) {
            return JSON.parse(result);
        }

        return result;
    }, [key]);

    const set = useCallback((item, subkey = false) => {
        return store.setItem(joinKeys(key, subkey), JSON.stringify(item));
    }, [key]);

    return {
        get,
        set,
        exists,
    };
};
