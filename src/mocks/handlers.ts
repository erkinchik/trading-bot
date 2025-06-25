import { http, HttpResponse, delay } from 'msw';
import {bots, stats} from "./data";
import {
    LoginRequest,
    TokenData,
    BotData,
    BotCreateRequest,
    BotUpdateRequest,
} from '../types/apiTypes';


const users = [
    { username: 'admin', password: 'admin123' },
    { username: 'trader', password: 'trade2023' }
];

const generateToken = (username: string): string => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
        sub: username,
        exp: Math.floor(Date.now() / 1000) + 3600
    }));
    return `${header}.${payload}.signature`;
};

const validateToken = (token: string): boolean => {
    const parts = token.split('.');
    if (parts.length !== 3) return false;

    try {
        const payload = JSON.parse(atob(parts[1]));
        return payload.exp > Math.floor(Date.now() / 1000);
    } catch {
        return false;
    }
};

export const handlers = [
    http.post('/api/auth/login', async ({ request }) => {
        const credentials = await request.json() as LoginRequest;

        const user = users.find(u =>
            u.username === credentials.username &&
            u.password === credentials.password
        );

        if (!user) {
            return HttpResponse.json(
                { message: 'Invalid username or password' },
                { status: 401 }
            );
        }

        const tokenData: TokenData = {
            access_token: generateToken(user.username),
            access_expires: 3600,
            token_type: 'Bearer'
        };

        await delay(300);
        return HttpResponse.json(tokenData);
    }),

    http.get('/api/bots', async ({ request }) => {
        const authHeader = request.headers.get('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return HttpResponse.json(
                { message: 'Authorization header is missing' },
                { status: 401 }
            );
        }

        const token = authHeader.split(' ')[1];
        if (!validateToken(token)) {
            return HttpResponse.json(
                { message: 'Invalid or expired token' },
                { status: 401 }
            );
        }

        await delay(500);
        return HttpResponse.json(bots);
    }),

    http.post('/api/bots', async ({ request }) => {
        const authHeader = request.headers.get('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return HttpResponse.json(
                { message: 'Authorization header is missing' },
                { status: 401 }
            );
        }

        const token = authHeader.split(' ')[1];
        if (!validateToken(token)) {
            return HttpResponse.json(
                { message: 'Invalid or expired token' },
                { status: 401 }
            );
        }

        const newBot = await request.json() as BotCreateRequest;

        if (newBot.num_orders <= 0 || !Number.isInteger(newBot.num_orders)) {
            return HttpResponse.json(
                { message: 'Number of orders must be a positive integer' },
                { status: 400 }
            );
        }

        if (newBot.grid_length <= 0 || newBot.grid_length >= 100) {
            return HttpResponse.json(
                { message: 'Grid length must be between 0 and 100' },
                { status: 400 }
            );
        }

        const bot: BotData = {
            ...newBot,
            id: Date.now().toString(),
            status: 'ACTIVE'
        };

        bots.push(bot);

        await delay(500);
        return HttpResponse.json(bot, { status: 201 });
    }),

    http.put('/api/bots', async ({ request }) => {
        const authHeader = request.headers.get('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return HttpResponse.json(
                { message: 'Authorization header is missing' },
                { status: 401 }
            );
        }

        const token = authHeader.split(' ')[1];
        if (!validateToken(token)) {
            return HttpResponse.json(
                { message: 'Invalid or expired token' },
                { status: 401 }
            );
        }

        const updatedBot = await request.json() as BotUpdateRequest;

        if (updatedBot.num_orders <= 0 || !Number.isInteger(updatedBot.num_orders)) {
            return HttpResponse.json(
                { message: 'Number of orders must be a positive integer' },
                { status: 400 }
            );
        }

        if (updatedBot.grid_length <= 0 || updatedBot.grid_length >= 100) {
            return HttpResponse.json(
                { message: 'Grid length must be between 0 and 100' },
                { status: 400 }
            );
        }

        const index = bots.findIndex(b => b.id === updatedBot.id);

        if (index === -1) {
            return HttpResponse.json(
                { message: 'Bot not found' },
                { status: 404 }
            );
        }

        const bot = {
            ...bots[index],
            ...updatedBot
        };

        bots[index] = bot;

        await delay(500);
        return HttpResponse.json(bot);
    }),


    http.get('/api/stats', async ({ request }) => {
        const authHeader = request.headers.get('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return HttpResponse.json(
                { message: 'Authorization header is missing' },
                { status: 401 }
            );
        }

        const token = authHeader.split(' ')[1];
        if (!validateToken(token)) {
            return HttpResponse.json(
                { message: 'Invalid or expired token' },
                { status: 401 }
            );
        }

        await delay(700);
        return HttpResponse.json(stats);
    }),
];
