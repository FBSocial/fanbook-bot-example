import express from 'express';
import * as dotenv from 'dotenv';
import leaderboardUpdate from './api/leaderboardUpdate';
import { bindStatus, teamUpdates } from './api/team_api';
dotenv.config();

console.log('Start Fanbook bot exmaple server...');

const app = express();
app.get('/team/binding/status', bindStatus);
app.get('/team/updates', teamUpdates);
app.get('/leaderboard/updates', leaderboardUpdate);

const port = process.env.SERVER_PORT || 3301;
app.listen(port);
console.log(`Server started on port ${port}.`);

