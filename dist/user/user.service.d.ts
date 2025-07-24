import { User } from '../../generated/prisma';
export declare class UserService {
    private prisma;
    findByEmail(email: string): Promise<User | null>;
    createUser(email: string, password: string, name?: string): Promise<User>;
}
