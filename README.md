这个仓库提供了两个能力：

1. 一个命令行用户交互接口，用来执行机器人操作，例如发送和修改消息之类。
2. 一个 Bot 服务，这是一个 HTTP 服务器。

该仓库用于测试一个开放能力，代码的风格倾向于让一切可配置。绝大多数的配置可以在以下两处地方找到：

1. 根目录的 *.env* 配置文件。
2. 根目录的 *templates* 文件夹，这里的 JSON 文件是一些数据源。

通过修改上述两个地方，能够在不修改代码的情况下完成大部分测试。

## 运行服务器

```shell
❯ npm run server

> fanbook-bot-example@1.0.0 server
> npx tsx server/main.ts

Start Fanbook bot exmaple server...
Server started on port 3001.
```

## 运行 CLI

```
❯ npm run cli team

> fanbook-bot-example@1.0.0 cli
> npx tsx cli/main.ts "team"

.env file loaded.
Usage: bot-example-cli team [options] [command] <subcommand>

组队相关指令

Options:
  -h, --help            display help for command

Commands:
  send                  发送一条组队消息
  update <message_id>   触发指定组队消息的更新
  archive <message_id>  归档指定组队消息
  result                发送对战结果
  help [command]        display help for command

```

