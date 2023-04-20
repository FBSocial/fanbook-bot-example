import colors from 'colors/safe';
import OpenApi from '../server/OpenApi';
import { spinner } from './utils';

export default class TeamCommandProcesser {
    get channelId(): string {
        return process.env.FANBOOK_CHANNEL!;
    }
    async sendTeamMessage() {
        console.log(
            colors.gray(
                `发送组队消息至频道 ${this.channelId}\n在 .env 文件中修改目标频道，在 templates/team/team.json 中修改组队消息内容。`
            )
        );

        spinner(
            '发送组队消息...',
            OpenApi.sendMessage(
                this.channelId,
                await import('../templates/team/team.json')
            )
        ).then((res) =>
            console.log('message ID:', res.data.result.message_id.toString())
        );
    }

    async updateTeam(messageId: string): Promise<void> {
        spinner(
            '触发组队消息更新...',
            OpenApi.updateThirdPartyMessage(this.channelId, messageId)
        );
    }
    async archiveTeam(messageId: string) {
        spinner(
            '归档组队...',
            OpenApi.editMessage(
                this.channelId,
                messageId,
                await import('../templates/team/team_archived.json')
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
