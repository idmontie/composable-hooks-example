import { useCallback, useEffect, useReducer } from "react";
import { Cache } from './cacheable';
import { Loadable } from './loadable';

export interface Pagination {
    loadable: Loadable,
    initialPage?: number,
    pageSize?: number,
    cache?: Cache | null
}

const initialState = {
    page: 1,
    items: null,
    loading: true,
    totalRows: 0,
    hasPreviousPage: false,
    hasNextPage: false,
};

const initializeState = (cache) => () => {
    if (cache) {
        return cache.get('state') || initialState;
    }

    return initialState;
} 

const reducer = (state, action) => {
    switch (action.type) {
        case 'loading':
            return {
                ...state,
                loading: true,
                page: action.page,
            };
        case 'success':
            return {
                ...state,
                loading: false,
                page: action.page,
                items: action.result.items,
                totalRows: action.result.total,
                hasNextPage: action.result.hasNextPage,
                hasPreviousPage: action.result.hasPreviousPage,
            };
        default:
            return state;
    }
};

function saveToCache(reducer, cache) {
    return function (state, action) {
        const nextState = reducer(state, action);

        if (cache) {
            cache.set(nextState, 'state');
        }

        return nextState;
    }
}

export function usePagination({
    loadable,
    initialPage = 1,
    pageSize = 1000,
    cache = null,
}: Pagination) {
    const [state, dispatch] = useReducer(saveToCache(reducer, cache), initialState, initializeState(cache));

    const load = useCallback(async (page) => {
        dispatch({
            type: 'loading',
            page,
        });

        const result = await loadable.load({ page, pageSize });

        dispatch({
            type: 'success',
            result,
            page,
        });
    }, [loadable]);

    useEffect(() => {
        const initialRequestPage = cache ? (cache.get('state') && cache.get('state').page) || initialPage : initialPage;
        load(initialRequestPage);
    }, []);

    const previousPage = useCallback(async () => {
        return load(state.page - 1);
    }, [state]);

    const nextPage = useCallback(async () => {
        return load(state.page + 1);
    }, [state]);

    return {
        ...state,
        previousPage,
        nextPage,
    };
}