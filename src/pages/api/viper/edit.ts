import { ModifyResult, ObjectId } from "mongodb"
import { NextApiRequest, NextApiResponse } from "next"
import clientPromise from "@/lib/mongodb"
import { Viper } from "@/types/viper"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const body = req.body
    const _id: string = body._id
    const name: string = body.name
    const biography: string = body.biography
    const image: string = body.image
    const backgroundImage: string = body.backgroundImage
    const location: string = body.location
    const client = await clientPromise
    const db = client.db("viperDb")

    if (req.method === "PUT") {
        try {
            const editProfile: ModifyResult<Viper> = await db
                .collection<Viper>("users")
                .findOneAndUpdate(
                    {
                        _id: new ObjectId(_id),
                    },
                    {
                        $set: {
                            name: name,
                            biography: biography,
                            image: image,
                            backgroundImage: backgroundImage,
                            location: location,
                        },
                    }
                )
            return res.status(200).json(editProfile)
        } catch (error) {
            return res.status(400).json(error)
        }
    }
}
