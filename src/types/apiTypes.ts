export interface LoginRequest {
    username: string
    password: string
}


export interface TokenData {
    access_token: string
    refresh_token?: string
    access_expires: number
    refresh_expires?: number
    token_type: 'Bearer'
}


export interface BotData {
    id: string
    name: string
    status: 'ACTIVE' | 'PAUSE' | 'ERROR'
    symbol: string
    deposit: number
    profit_percentage: number
    num_orders: number
    grid_length: number
}

export type BotCreateRequest = Omit<BotData, 'id' | 'status'>
export type BotUpdateRequest = Omit<BotData, 'status'>


export interface BotStatisticData {
    id: string
    name: string
    symbol: string
    cycles_completed: number
    deposit_usdt: number
    profit_usdt: number
    profit_percentage: number
}
