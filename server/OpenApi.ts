import * as dotenv from 'dotenv';
import axios, { AxiosResponse } from 'axios';
import JSONBig from 'json-bigint';
import { WebSocket } from 'ws';

interface FbResponse<T> {
    ok: boolean;
    result: T;
}

interface BotCallbackQuery {
    type: 'update';
    update_id: any;
    callback_query: {
        id: string;
        from: {
            id: any;
            is_bot: boolean;
            first_name: string;
        };
        message: FbMessage;
    };
}
export interface FbWsPackage {
    action: 'miniPush' | 'push';
    data: FbMessage;
}

export interface FbMessage {
    channel_id: string;
    user_id: string;
    content: BotCallbackQuery;
}

export function parseFbMessage(string: string): FbWsPackage {
    const message = JSON.parse(string) as FbWsPackage;

    try {
        // @ts-ignore
        message.data.content = JSON.parse(message.data.content);
    } catch (e) {}
    return message;
}

interface GetMeResponse {
    id: any;
    is_bot: boolean;
    first_name: string;
    last_name: string;
    username: string;
    avatar: string;
    user_token: string;
    owner_id: any;
    can_join_groups: boolean;
    can_read_all_group_messages: boolean;
    supports_inline_queries: boolean;
}

export interface InlineKeyboardButton {
    text: string;
    url: string;
    callbackData: string;
}
export interface InlineKeyboardMarkup {
    inline_keyboard: InlineKeyboardButton[][];
}
export default class OpenApi {
    static getMe<T>(): Promise<AxiosResponse<FbResponse<GetMeResponse>>> {
        return axios.get<FbResponse<GetMeResponse>>('/getMe');
    }
    static connectWebsocket(websocketUrl: string, token: string): WebSocket {
        const device_id = 'bot348383746979790848';
        const verison_number = '1.6.86';

        const header_map = JSON.stringify({
            platform: 'bot',
            version: verison_number,
            channel: 'office',
            device_id: device_id,
            build_number: '1',
        });
        const super_str = Buffer.from(header_map).toString('base64');

        const url = `${websocketUrl}?id=${token}&dId=${device_id}&v=${verison_number}&x-super-properties=${super_str}`;
        console.log('Connecting to websocket: ' + url);

        return new WebSocket(url);
    }
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
        return this.sendTextMessage(chatId, JSONBig.stringify(data));
    }

    static sendTextMessage(
        chatId: string,
        data: string,
        replyMarkup?: InlineKeyboardMarkup
    ) {
        return axios.post(
            '/sendMessage',
            JSONBig.stringify({
                chat_id: JSONBig.parse(chatId),
                text: data,
                reply_markup: replyMarkup,
            })
        );
    }

    static answerCallbackQuery(
        channelId: string,
        callbackQueryId: string,
        userId: string,
        text?: string
    ) {
        return axios.post(
            '/v2/answerCallback',
            JSONBig.stringify({
                callback_id: callbackQueryId,
                text: text,
                user_id: userId,
                channel_id: channelId,
            })
        );
    }
}
