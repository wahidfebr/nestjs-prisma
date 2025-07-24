import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
export declare class AuthService {
    private readonly userService;
    private readonly jwtService;
    constructor(userService: UserService, jwtService: JwtService);
    register(email: string, password: string, name?: string): Promise<{
        id: number;
        email: string;
        name: string | null;
    }>;
    validateUser(email: string, password: string): Promise<{
        name: string | null;
        id: number;
        email: string;
        password: string;
        createdAt: Date;
    } | null>;
    login(email: string, password: string): Promise<{
        access_token: string;
    }>;
    validateJwtPayload(payload: {
        sub: number;
        email: string;
    }): Promise<{
        name: string | null;
        id: number;
        email: string;
        password: string;
        createdAt: Date;
    } | null>;
}
