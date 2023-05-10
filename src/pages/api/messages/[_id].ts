import { NextApiRequest, NextApiResponse } from "next"
import { getVipersMessenger } from "@/lib/vipers"
import { Chats, Message } from "@/types/viper"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {
        query: { _id },
        body,
    } = req
    const viperId: string = body.viper._id
    try {
        if (!Array.isArray(_id) && _id) {
            const vipersMessenger: Chats | null = await getVipersMessenger(_id, viperId)
            return res.status(200).json(vipersMessenger)
        }
    } catch (error) {
        return res.status(400).json(error)
    }
    return res.status(200)
}
