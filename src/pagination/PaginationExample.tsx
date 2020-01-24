import React from 'react';

import useGithubUserRepos from './useGithubRepo';
import { useCache } from '../utilities/cacheable';
import { usePagination } from '../utilities/pageable';

const user = 'idmontie';

const PaginationExample = () => {
    const cache = useCache({
        key: 'github-user-repos',
        store: window.sessionStorage,
        // replacementStrategy: {
        //     policy: 'lru',
        //     maxSize: '10MB',
        //     maxSubkeys: '10',
        // }
    });

    const cacheTable = useCache({
        key: 'github-user-repos-table',
        store: window.sessionStorage,
    });

    const github = useGithubUserRepos({ user, cache });

    const pagination = usePagination({
        pageSize: 10,
        loadable: github,
        cache: cacheTable,
    });

    if (pagination.loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {pagination.totalRows}

            <div>
                {
                    pagination.items.map((row: any, i: number) => {
                        return (
                            <div key={i}>
                                {row.full_name}
                            </div>
                        )
                    })
                }
            </div>

            {
                pagination.hasPreviousPage && (
                    <button onClick={pagination.previousPage}>
                        Previous Page
                    </button>
                )
            }
            {
                pagination.hasNextPage && (
                    <button onClick={pagination.nextPage}>
                        Next Page
                    </button>
                )
            }    
        </div>
    );
}

export default PaginationExample;