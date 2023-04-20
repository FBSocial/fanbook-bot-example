import * as dotenv from 'dotenv';
import axios from 'axios';
import JSONBig from 'json-bigint';

export default class OpenApi {
    static editMessage(channel_id: string, message_id: string, data: any) {
        console.log({
            chat_id: JSONBig.parse(channel_id),
            message_id: JSONBig.parse(message_id),
            parse_mode: 'Fanbook',
            text: JSON.stringify(data),
        });
        return axios.post(
            '/editMessageText',
            JSONBig.stringify({
                chat_id: JSONBig.parse(channel_id),
                message_id: JSONBig.parse(message_id),
                parse_mode: 'Fanbook',
                text: JSON.stringify(data),
            })
        );
    }
    static updateThirdPartyMessage(channel_id: string, message_id: string) {
        return axios.post('/v2/cardNotify', {
            channel_id,
            message_id,
        });
    }
    static init(openApiUrl: string) {
        axios.defaults.baseURL = openApiUrl;

        axios.defaults.headers.post['Content-Type'] = 'application/json';
        axios.defaults.transformResponse = [
            function transform(data) {
                if (typeof data === 'string') {
                    try {
                        data = JSONBig.parse(data);
                    } catch (e) {
                        /* Ignore */
                    }
                }
                return data;
            },
        ];
    }
    static sendMessageCard(chatId: string, data: any) {
        return this.sendMessage(chatId, {
            type: 'messageCard',
            data: JSON.stringify(data),
        });
    }
    static sendMessage(chatId: string, data: any) {
        return axios.post(
            '/sendMessage',
            JSONBig.stringify({
                chat_id: JSONBig.parse(chatId),
                text: JSONBig.stringify(data),
            })
        );
    }
}
