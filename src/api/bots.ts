import axios from 'axios';
import { BotData, BotCreateRequest, BotUpdateRequest } from '../types/apiTypes';


// TODO МОЖНО ВЫНЕСТИ ВСЕ В AXIOS СЕТАП, ДЛЯ ТОГО ЧТОБЫ КАЖДЫЙ РАЗ НЕ ПЕРЕДАВАТЬ ТОКЕН
export const fetchBots = async (token: string | null): Promise<BotData[]> => {
    const response = await axios.get<BotData[]>('/api/bots', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

export const createBot = async (bot: BotCreateRequest, token: string | null): Promise<BotData> => {
    const response = await axios.post<BotData>('/api/bots', bot, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

export const updateBot = async (bot: BotUpdateRequest, token: string | null): Promise<BotData> => {
    const response = await axios.put<BotData>('/api/bots', bot, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};
