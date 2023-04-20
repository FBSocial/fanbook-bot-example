import colors from 'colors/safe';
import OpenApi from '../server/OpenApi';
import { spinner } from './utils';

export default class LeaderboardCommandProcessor {
    get channelId(): string {
        return process.env.FANBOOK_CHANNEL!;
    }
    async sendTeamMessage() {
        console.log(
            colors.gray(
                `发送榜单消息至频道 ${this.channelId}\n在 .env 文件中修改目标频道，在 templates/leaderboard/leaderboard.json 中修改榜单消息内容。`
            )
        );

        spinner(
            '发送榜单消息...',
            OpenApi.sendMessage(
                this.channelId,
                await import('../templates/leaderboard/leaderboard.json')
            )
        ).then((res) =>
            console.log('message ID:', res.data.result.message_id.toString())
        );
    }

    async updateTeam(messageId: string): Promise<void> {
        spinner(
            '触发榜单消息更新...',
            OpenApi.updateThirdPartyMessage(this.channelId, messageId)
        );
    }
    async archiveTeam(messageId: string) {
        spinner(
            '归档榜单...',
            OpenApi.editMessage(
                this.channelId,
                messageId,
                await import('../templates/leaderboard/leaderboard_archived.json')
            )
        );
    }

    async sendResultMessage() {
        spinner(
            '发送对战结果...',
            OpenApi.sendMessageCard(
                this.channelId,
                await import('../templates/message_card/battle_result.json')
            )
        );
    }
}
