import * as dotenv from 'dotenv';
import colors from 'colors/safe';

dotenv.config();
console.log(colors.yellow('.env file loaded.'));

OpenApi.init(process.env.OPEN_API_URL!);

import { Command } from 'commander';
import OpenApi from '../server/OpenApi';
import TeamCommandProcessor from './TeamCommandProcessor';
import LeaderboardCommandProcessor from './LeaderboardCommandProcessor';
import InlineKeyboardCommandProcessor from './InlineKeyboardCommandProcessor';

const program = new Command();

program
    .name('bot-example-cli')
    .description('CLI for bot-example project')
    .version('0.0.1');

function makeTeamCommand(): Command {
    const processor = new TeamCommandProcessor();
    const team = program
        .command('team <subcommand>')
        .description('组队相关指令');
    team.command('send')
        .description('发送一条组队消息')
        .action(() => processor.sendTeamMessage());
    team.command('update <message_id>')
        .description('触发指定组队消息的更新')
        .action((messageId) => processor.updateTeam(messageId));
    team.command('archive <message_id>')
        .description('归档指定组队消息')
        .action((messageId) => processor.archiveTeam(messageId));
    team.command('result')
        .description('发送对战结果')
        .action(() => processor.sendResultMessage());
    return team;
}
function makeLeaderboardCommand(): Command {
    const processor = new LeaderboardCommandProcessor();
    const team = program
        .command('leaderboard <subcommand>')
        .description('榜单相关指令');
    team.command('send')
        .description('发送一条榜单消息')
        .action(() => processor.sendTeamMessage());
    team.command('update <message_id>')
        .description('触发指定榜单消息的更新')
        .action((messageId) => processor.updateTeam(messageId));
    team.command('archive <message_id>')
        .description('归档指定榜单消息')
        .action((messageId) => processor.archiveTeam(messageId));
    return team;
}
function makeInlineKeyboardCommand() {
    const processor = new InlineKeyboardCommandProcessor();
    const cmd = program
        .command('inline_keyboard <subcommand>')
        .description('内联键盘相关指令');
    cmd.command('normal')
        .description('发送一个普通的内联键盘消息')
        .action(() => processor.sendInlineKeyboardMessage());
    return cmd;
}
program.addCommand(makeTeamCommand());
program.addCommand(makeLeaderboardCommand());
program.addCommand(makeInlineKeyboardCommand());

program.parse(process.argv);
