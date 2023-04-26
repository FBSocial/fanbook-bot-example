import express from 'express';
import * as dotenv from 'dotenv';
import leaderboardUpdate from './api/leaderboardUpdate';
import { bindStatus, teamUpdates } from './api/team_api';
import OpenApi, {
    FbMessage,
    parseFbMessage as parseWsPackage,
} from './OpenApi';
dotenv.config();

console.log('Start Fanbook bot exmaple server...');

const app = express();
app.get('/team/binding/status', bindStatus);
app.get('/team/updates', teamUpdates);
app.get('/leaderboard/updates', leaderboardUpdate);

const port = process.env.SERVER_PORT || 3301;
app.listen(port);
console.log(`Server started on port ${port}.`);

OpenApi.init(process.env.OPEN_API_URL!);

async function connectWeb() {
    const {
        data: { ok, result },
    } = await OpenApi.getMe();
    if (!ok) {
        console.error('getMe error');
        return;
    }

    const ws = OpenApi.connectWebsocket(
        process.env.WEBSOCKET_URL!,
        result.user_token
    );
    let heartbeatTimer: NodeJS.Timer;
    ws.on('open', () => {
        console.log('websocket connected');
        heartbeatTimer = setInterval(() => {
            ws.send('{"type":"ping"}');
        }, 30000);
    });
    ws.on('close', () => {
        console.log('websocket closed');
        clearInterval(heartbeatTimer);
    });
    ws.on('message', async (buffer: string) => {
        // console.log('received: %s', buffer);
        const { action, data: message } = parseWsPackage(buffer);

        if (action == 'miniPush' && message.content.type == 'update') {
            console.log(   message.channel_id,
                message.content.callback_query.id,
                message.user_id,);
            const res = await OpenApi.answerCallbackQuery(
                message.channel_id,
                message.content.callback_query.id,
                message.user_id,
                'ok'
            );
            console.log(   message.channel_id,
                message.content.callback_query.id,
                message.user_id,);
            
            console.log(res);
            
        }
    });
    ws.on('error', console.error);
}
connectWeb();
