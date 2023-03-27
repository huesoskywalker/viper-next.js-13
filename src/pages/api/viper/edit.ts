import { ModifyResult, ObjectId } from "mongodb"
import { NextApiRequest, NextApiResponse } from "next"
import clientPromise from "@/lib/mongodb"
import { Viper } from "@/types/viper"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const body = req.body
    const viperId: string = body.viperId
    const name: string = body.newName
    const biography: string = body.newBiography
    const imageUrl: string = body.imageUrl
    const bgImageUrl: string = body.bgImageUrl
    const location: string = body.newLocation
    const client = await clientPromise
    const db = client.db("viperDb")

    if (req.method === "PUT") {
        try {
            const editProfile: ModifyResult<Viper> = await db
                .collection<Viper>("users")
                .findOneAndUpdate(
                    {
                        _id: new ObjectId(viperId),
                    },
                    {
                        $set: {
                            name: name,
                            biography: biography,
                            image: imageUrl,
                            backgroundImage: bgImageUrl,
                            location: location,

                            //THIS IS PROVISORY TO FETCH THE CONCAT ARRAYS
                            // Need to make the validation schemas from MongoDb Native driver
                            blog: [],
                            blogLikes: [],
                            blogCommented: [],
                            blogRePosts: [],
                        },
                    }
                )
            return res.status(200).json(editProfile)
        } catch (error) {
            return res.status(400).json(error)
        }
    }
}
