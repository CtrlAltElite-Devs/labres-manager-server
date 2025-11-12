import { Request, Response, NextFunction } from 'express';
import { JwtUserPayloadDto } from 'src/utils/jwt-payload.dto';
import { NotImplementedException, INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MikroORM } from '@mikro-orm/core';
import { Admin, AdminRole } from 'src/entities/admin.entity';

export const lensJwtServiceInstance = new JwtService();

/**
 * ✅ Helper: Extracts and verifies a JWT from a request (Authorization header or cookies).
 * Returns the decoded payload if valid, otherwise `null`.
 */
export const decodeJwtFromRequest = async (req: Request): Promise<JwtUserPayloadDto | null> => {
    const authHeader = req.headers.authorization;
    let token: string | undefined;

    if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }

    if (!token) {
        token = req.cookies?.['token'] as string;
    }

    if (!token) return null;

    try {
        const decoded = await lensJwtServiceInstance.verifyAsync<JwtUserPayloadDto>(token, {
            secret: process.env.JWT_SECRET,
        });
        return decoded;
    } catch {
        return null;
    }
};

/**
 * 🔒 Middleware: Protects the /lens route.
 */
export const lensProtector = async (app: INestApplication<any>, req: Request, res: Response, next: NextFunction) => {
    const decoded = await decodeJwtFromRequest(req);
    const orm = app.get(MikroORM);
    const em = orm.em.fork();
    
    if (!decoded) {
        return res.status(401).send('Unauthorized: Invalid or missing token');
    }

    if (!decoded.isAdmin) {
        return res.status(403).send('Forbidden: Admins only');
    }

    const admin = await em.findOne(Admin, {id: decoded.adminId});

    if(admin === null) 
        return res.status(404).send('Unauthorized: Admin not found');

    if(admin.role !== AdminRole.SUPER_ADMIN)
        return res.status(404).send('Unauthorized: Lens dashboard is for Super Admins only');
    
    next();
};

/**
 * 🧠 Used by Lens (optional): Determines if a user is authenticated.
 */
export const isAuthenticatedFunction = async (req: Request): Promise<boolean> => {
    const decoded = await decodeJwtFromRequest(req);
    return decoded !== null;
};

/**
 * 👤 Used by Lens (optional): Returns a user object for the dashboard.
 */
export const getUserForLensFunc = async (req: Request) => {
    const decoded = await decodeJwtFromRequest(req);

    if (!decoded) {
        return {
        id: 'unauth',
        name: 'Unauthenticated',
        email: '',
        };
    }

    throw new NotImplementedException();
};
