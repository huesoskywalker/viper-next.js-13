import { NextApiRequest, NextApiResponse } from "next"
import { getVipersMessenger } from "@/lib/vipers"
import { Chats } from "@/types/viper"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const body = req.body
    try {
        const vipersMessenger: Chats[] = await getVipersMessenger(
            body.id,
            body.viperId
        )
        return res.status(200).json(vipersMessenger)
    } catch (error) {
        return res.status(400).json(error)
    }
}
