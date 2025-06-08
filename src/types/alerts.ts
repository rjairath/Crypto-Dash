export type Alert = {
    id: number;
    user_id: string;
    cmc_id: number;
    cmc_symbol: string;
    name: string;
    asset_symbol: string;
    lower_limit: number;
    upper_limit: number;
    created_at: string;
    current_price: number | null;
};

export type AlertsResponse = {
    data?: Alert[];
    error?: string;
};

export type SetAlertRequestParams = {
    cmc_id: string;
    name: string;
    asset_symbol: string;
    upper_limit: number;
    lower_limit: number;
};
