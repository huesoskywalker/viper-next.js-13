import { ObjectId } from "mongodb"
import { NextApiRequest, NextApiResponse } from "next"
import clientPromise from "../../lib/mongodb"
import { Viper } from "../../lib/vipers"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const body = req.body
    const client = await clientPromise
    const db = await client.db("viperDb")

    if (req.method === "PUT") {
        try {
            const editProfile = await db
                .collection<Viper>("users")
                .findOneAndUpdate(
                    {
                        _id: new ObjectId(body.viperId),
                    },
                    {
                        $set: {
                            name: body.name,
                            biography: body.biography,
                            image: body.imageUrl,
                            backgroundImage: body.bgImageUrl,
                            location: body.location,
                        },
                    }
                )
            console.log(editProfile)
            return res.status(200).json(editProfile)
        } catch (error) {
            return res.status(400).json(error)
        }
    }
}

// 'https://lh3.googleusercontent.com/a/AEdFTp4aMn5bItl_CDwyHf659hv8nTOw2p4QUxQKCHY=s96-c'
