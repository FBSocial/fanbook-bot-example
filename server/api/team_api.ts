import { Request, Response } from 'express';

export async function teamUpdates(req: Request, res: Response) {
    console.log('组队状态更新');
    res.send(await import('../../templates/team/team_updates.json'));
}

export async function bindStatus(req: Request, res: Response) {
    console.log(
        '查询绑定状态，始终返回已绑定，如果需要测试未绑定，把服务器关闭即可。'
    );
    res.status(200).send();
}
