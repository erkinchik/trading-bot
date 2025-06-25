import { LoginRequest, TokenData } from '../types/apiTypes';
import {delay} from "../helpers/delay";

const users = [
    { username: 'admin', password: 'admin123' },
    { username: 'trader', password: 'trade2020' }
];

const generateToken = (username: string): string => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
        sub: username,
        exp: Math.floor(Date.now() / 1000) + 3600
    }));
    return `${header}.${payload}.signature`;
};

export const loginUser = async (credentials: LoginRequest): Promise<TokenData> => {
    await delay(500);

    const user = users.find(u =>
        u.username === credentials.username &&
        u.password === credentials.password
    );

    if (!user) {
        throw new Error('Invalid username or password');
    }

    return {
        access_token: generateToken(user.username),
        access_expires: 3600,
        token_type: 'Bearer'
    };
};

export const validateToken = (token: string | null): boolean => {
    if(!token) return false
    const parts = token.split('.');
    if (parts.length !== 3) return false;

    try {
        const payload = JSON.parse(atob(parts[1]));
        return payload.exp > Math.floor(Date.now() / 1000);
    } catch {
        return false;
    }
};

