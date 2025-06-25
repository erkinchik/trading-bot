import { BotStatisticData } from '../types/apiTypes';
import { validateToken } from './auth';
import {delay} from "../helpers/delay";

export const fetchStats = async (token: string | null): Promise<BotStatisticData[]> => {
    await delay(500);

    if (!validateToken(token)) {
        throw new Error('Invalid or expired token');
    }

    return [
        {
            id: '1',
            name: 'BTC Grid Bot',
            symbol: 'BTCUSDT',
            cycles_completed: 12,
            deposit_usdt: 5000,
            profit_usdt: 325.50,
            profit_percentage: 6.51
        },
        {
            id: '2',
            name: 'ETH Scalper',
            symbol: 'ETHUSDT',
            cycles_completed: 8,
            deposit_usdt: 3000,
            profit_usdt: 180.25,
            profit_percentage: 6.01
        },
        {
            id: '3',
            name: 'SOL Trader',
            symbol: 'SOLUSDT',
            cycles_completed: 15,
            deposit_usdt: 2000,
            profit_usdt: 310.75,
            profit_percentage: 15.54
        }
    ];
};
