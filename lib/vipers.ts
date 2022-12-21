import { ObjectId } from "mongodb"
import clientPromise from "./mongodb"

interface Viper {
    readonly _id: ObjectId
    name: string
    email: string
    image: string
    description: string
    address: string
    followers: string[]
    follows: string[]
}

export async function getViper(noteId: string) {
    const client = await clientPromise
    const db = await client.db("viperDb").collection<Viper>("users")

    // const viper = await db.aggregate<User>([
    //     {
    //         $match: { _id: new ObjectId(noteId) },
    //     },
    //     {
    //         $project: {
    //             _id: 1,
    //             name: 1,
    //             email: 1,
    //             image: 1,
    //         },
    //     },
    // ])

    const viper = await db.findOne<Viper>({
        _id: new ObjectId(noteId),
    })

    return viper
}

export async function getVipers() {
    const client = await clientPromise
    const db = await client.db("viperDb").collection<Viper>("users")
    const vipers = await db.find<Viper[]>({}).toArray()

    return vipers
}
