import { Injectable } from "@nestjs/common";
import Emittery from "emittery";
import { MIKRO_ORM_QUERY_EVENT } from "src/utils/constants";

export const myOrmEventEmitter = new Emittery();

@Injectable()
export class MikroOrmQueryEmitterService {
    emitCustomQuery(query: string, params: any[], duration: number){
        myOrmEventEmitter.emit(MIKRO_ORM_QUERY_EVENT, {query, params, duration})
            .catch(console.error);
    }
}