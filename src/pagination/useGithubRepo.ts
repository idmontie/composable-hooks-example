import { useCallback } from "react";
import { Loadable, LoadResult, LoadParams } from '../utilities/loadable';

const GITHUB_API = 'https://api.github.com';

function createUrl({ user, page, pageSize }) {
    return `${GITHUB_API}/users/${user}/repos?page=${page}&per_page=${pageSize}`;
}

function getLinks(header) {
    const links = {};

    header
        .split(',')
        .map((part) => part.match(/\<(.*)\>\; rel=\"(.*)\"/))
        .map((match) => {
            if (match) {
                links[match[2]] = match[1];
            }
        });
    return links;
}

export default function useGithubUserRepos({ user, cache }): Loadable {
    const load = useCallback(async (loadParams: LoadParams | undefined) : Promise<LoadResult> => {
        if (!loadParams) {
            throw new Error();
        }

        const { page, pageSize } = loadParams;

        let json;
        let links;
        if (cache && cache.exists(page)) {
            const cached = cache.get(page);
            if (cached) {
                ({ json, links } = cached);
            }
        }
        
        if (!json) {
            const response = await fetch(createUrl({ user, page, pageSize }));
            links = getLinks(response.headers.get('Link'));
            json = await response.json();

            if (cache) {
                cache.set({ json, links }, page);
            }
        }
    
        return {
            items: json,
            firstPage: links['first'],
            lastPage: links['last'],
            nextPage: links['next'],
            previousPage: links['prev'],
            hasNextPage: Boolean(links['next']),
            hasPreviousPage: Boolean(links['prev']),
        };
    }, [user, cache]);

    return {
        load,
    };
}