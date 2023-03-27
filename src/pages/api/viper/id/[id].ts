import { NextApiRequest, NextApiResponse } from "next"
import { getViperById } from "@/lib/vipers"
import { Viper } from "@/types/viper"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const query = req.query
    try {
        const viper: Viper | null = await getViperById(query.id)
        return res.status(200).json({
            viper,
        })
    } catch (error) {
        return res.status(400).json(error)
    }
}
