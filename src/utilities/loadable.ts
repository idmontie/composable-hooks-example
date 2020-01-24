export interface LoadResult {
    items: [any] | null,
    firstPage: string | null | undefined,
    lastPage: string | null | undefined,
    nextPage: string | null | undefined,
    previousPage: string | null | undefined,
    hasNextPage: boolean,
    hasPreviousPage: boolean,
}

export interface LoadParams {
    page?: number,
    pageSize?: number,
}

export type LoadFunction = (params?: LoadParams | undefined) => Promise<LoadResult>;

export interface Loadable {
    load: LoadFunction
};
