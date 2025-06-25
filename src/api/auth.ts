import axios, {AxiosError} from "axios";
import { LoginRequest, TokenData } from '../types/apiTypes';

export const loginUser = async (credentials: LoginRequest): Promise<TokenData> => {
    try {
        const response = await axios.post<TokenData>('/api/auth/login', credentials);
        return response.data;
    } catch (err){
        const error = err as AxiosError
        throw error
    }

};

