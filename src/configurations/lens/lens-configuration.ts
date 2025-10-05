import { lens } from '@lensjs/nestjs';
import { INestApplication } from '@nestjs/common';
import { createCustomQueryHandler } from 'src/modules/common/lens/mikro-orm-query-handler';
import { decodeJwtFromRequest, isAuthenticatedFunction, lensProtector } from './lens-protector';
import { NextFunction, Request, Response } from 'express';
import { MikroORM } from '@mikro-orm/core';
import { Admin } from 'src/entities/admin.entity';
import { User } from 'src/entities/user.entity';
import { IS_PROD_OR_STAGING } from 'src/utils/environment';

export async function ApplyLensConfigurations(app: INestApplication<any>){
    if(IS_PROD_OR_STAGING){
        console.log("applying lens middleware")
        app.use('/lens', async (req: Request, res: Response, next: NextFunction) => {
            await lensProtector(app, req, res, next);
        });
    }
    
    await lens({
        app,
        appName: "Lab Result Manager Server",
        queryWatcher: {
            enabled: true,
            handler: createCustomQueryHandler()
        },
        cacheWatcherEnabled: true,
        isAuthenticated: isAuthenticatedFunction,
        getUser: async (request: Request) => {
            const decoded = await decodeJwtFromRequest(request);
            const unauthenticated = {
                id: "unautneticated",
                name: "unauthenticated",
                email: "unautneticated"
            }
            
            if(!decoded){
                return unauthenticated
            }   

            const orm = app.get(MikroORM);
            const em = orm.em;
            if(decoded.isAdmin){
                const admin = await em.findOne(Admin, {id : decoded.adminId}, {
                    cache : 5000
                })
                if(admin === null) return unauthenticated;
                return {
                    id: admin?.id,
                    name: admin?.email,
                    email: admin?.email,
                }
            } else {
                const user = await em.findOne(User, {pid: decoded.pid}, {
                    cache: 5000
                })
                if(user === null) return unauthenticated;
                return {
                    id: user.pid,
                    name: "no name",
                    email: "no email"
                }
            }

        },
        adapter : "express"
    });
}