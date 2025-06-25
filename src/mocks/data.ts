import {BotData, BotStatisticData} from "../types/apiTypes";

export const bots: BotData[] = [
    {
        id: '1',
        name: 'BTC Grid Bot',
        status: 'ACTIVE',
        symbol: 'BTCUSDT',
        deposit: 5000,
        profit_percentage: 0.8,
        num_orders: 10,
        grid_length: 5
    },
    {
        id: '2',
        name: 'ETH Scalper',
        status: 'PAUSE',
        symbol: 'ETHUSDT',
        deposit: 3000,
        profit_percentage: 1.2,
        num_orders: 8,
        grid_length: 7
    }
];


export const stats: BotStatisticData[] = [
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
    }]
