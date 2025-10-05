import { lens } from '@lensjs/nestjs';
import { INestApplication } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
import { createCustomQueryHandler } from 'src/modules/common/lens/mikro-orm-query-handler';
// import { AuthenticatedRequest } from 'src/security/common/application-requests';
// import { JwtUserPayloadDto } from 'src/utils/jwt-payload.dto';
import "dotenv/config";
// import { Request } from 'express';

// const jwtService = new JwtService();

export async function ApplyLensConfigurations(app: INestApplication<any>){
    await lens({
        app,
        appName: "Lab Result Manager Server",
        queryWatcher: {
            enabled: true,
            handler: createCustomQueryHandler()
        },
        cacheWatcherEnabled: true,
        // isAuthenticated: async (req: unknown) => {
        //     console.log("checking is authenticated");
        //     const request : AuthenticatedRequest = req as Request;
        //     const authorization = request.headers.authorization;
        //     let token: string | undefined;

        //     if (authorization?.startsWith('Bearer ')) {
        //         token = authorization.split(' ')[1];
        //     }

        //     if (!token) {
        //         token = request.cookies['token'] as string;
        //     }

        //     if(!token) return false;

        //     try{
        //         await jwtService.verifyAsync<JwtUserPayloadDto>(token, {
        //             secret: process.env.JWT_SECRET
        //         });
        //         return true;
        //     } 
        //     catch{
        //         return false;
        //     }
        // },
        // getUser : async  (request: Request) => {
        //     console.log("entering here in get user");
        //     const authorization = request.headers.authorization;
        //     let token: string | undefined;
            
        //     if (authorization?.startsWith('Bearer ')) {
        //         token = authorization.split(' ')[1];
        //     }

        //     if (!token) {
        //         token = request.cookies['token'] as string;
        //     }

        //     if(!token) {
        //         return {
        //             id: 'error',
        //             name: 'error',
        //             email: 'error',
        //         };
        //     }

        //     try{
        //         const decoded = await jwtService.verifyAsync<JwtUserPayloadDto>(token, {
        //             secret: process.env.JWT_SECRET
        //         });
                
        //         return {
        //             id: decoded.isAdmin ? decoded.adminId as string : decoded.pid as string,
        //             name: decoded.isAdmin? decoded.adminId as string : decoded.pid as string,
        //             email: decoded.isAdmin? decoded.adminId as string : decoded.pid as string
        //         }
        //     } 
        //     catch{
        //         console.log("lens NOT authenticated")
        //         return {
        //             id: 'error',
        //             name: 'error',
        //             email: 'error',
        //         };
        //     }
        // },
        adapter : "express"
    });
}