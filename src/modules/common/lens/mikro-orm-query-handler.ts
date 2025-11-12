import { type QueryWatcherHandler } from '@lensjs/watchers';
import { lensUtils } from '@lensjs/core';
import { nowISO } from '@lensjs/date';
import { myOrmEventEmitter } from './mikro-orm-query-emitter.service';
import { MIKRO_ORM_QUERY_EVENT } from 'src/utils/constants';

export function createCustomQueryHandler() : QueryWatcherHandler { 
    return async ({onQuery}) => { // eslint-disable-line @typescript-eslint/require-await
        const databaseType = "postgresql"

        myOrmEventEmitter.on(MIKRO_ORM_QUERY_EVENT, async (payload: { query: string; params: any[]; duration: number }) => {
            await onQuery({
                query: lensUtils.formatSqlQuery(
                lensUtils.interpolateQuery(
                    payload.query,
                    payload.params
                ),
                databaseType,
                ),
                duration: `${payload.duration} ms`,
                type: databaseType,
                createdAt: nowISO(),
            })
        })
    }
}