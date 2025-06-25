import axios from 'axios';
import { BotStatisticData } from '../types/apiTypes';

export const fetchStats = async (token: string | null): Promise<BotStatisticData[]> => {
    const response = await axios.get<BotStatisticData[]>('/api/stats', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};
