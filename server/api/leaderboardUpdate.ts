import { Request, Response } from "express";

export default async function leaderboardUpdate(req: Request, res: Response) {
    console.log("榜单状态更新");
    res.send(await import('../../templates/leaderboard/leaderboard_updates.json'));
}