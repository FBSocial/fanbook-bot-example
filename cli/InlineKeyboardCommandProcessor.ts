import OpenApi, { InlineKeyboardMarkup } from '../server/OpenApi';
import { spinner } from './utils';

export default class InlineKeyboardCommandProcessor {
    get channelId(): string {
        return process.env.FANBOOK_CHANNEL!;
    }
    async sendInlineKeyboardMessage() {
        let { default: data } = await import(
            '../templates/inline_keyboard/normal.json'
        );
        spinner(
            '发送普通内联键盘消息...',
            OpenApi.sendTextMessage(
                this.channelId,
                'Hello World!',
                data as unknown as InlineKeyboardMarkup
            )
        ).then(console.log);
    }
}
