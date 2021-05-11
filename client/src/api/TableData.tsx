import axios from 'axios';
export const server_check = async () => {
    try {
        const { data } = await axios.get(`http://133.186.229.72:4100`);
        console.log(data);
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