import axios from 'axios';


export const server_check = async () => {
    try {
        const { data } = await axios.get(`http://133.186.229.72:4100`);
        // console.log(data);
        return data
    } catch (e) {
        throw e;
    }
};


export const get_current_price = async () => {
    try {
        const { data } = await axios.get(`http://133.186.229.72:4100/get_current_price`);
        return data;
    } catch (e) {
        throw e;
    }
};

export type CurrentPrice =  {
    opening_price: string,
    closing_price: string,
    min_price: string,
    max_price: string,
    units_traded: string,
    acc_trade_value: string,
    prev_closing_price: string,
    units_traded_24H: string,
    acc_trade_value_24H: string,
    fluctate_24H:string,
    fluctate_rate_24H:string,
    BULL_5: number | undefined
}


export const get_S13_coins = async () => {
    try {
        const { data } = await axios.get(`http://133.186.229.72:4100/get_S13_coins`);
        return data;
    } catch (e) {
        throw e;
    }
};

export type Get_S13_coins_output =  {
    opening_price: string,
    closing_price: string,
    min_price: string,
    max_price: string,
    units_traded: string,
    acc_trade_value: string,
    prev_closing_price: string,
    units_traded_24H: string,
    acc_trade_value_24H: string,
    fluctate_24H:string,
    fluctate_rate_24H:string,
    BULL_5: number | undefined,
    MMT_TARGET: number | undefined,
    MMT_B: number | undefined,
    BULL_3_CHECK_IN: boolean | undefined,
    BULL_5_CHECK_IN: boolean | undefined,
    BULL_10_CHECK_IN: boolean | undefined,
    BULL_20_CHECK_IN: boolean | undefined,
    S13_CHECK: boolean | undefined
}
