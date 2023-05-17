import { ObjectId } from "mongodb"
import clientPromise from "./mongodb"
import {
    Viper,
    Collection,
    Follow,
    Blog,
    Likes,
    ExternalBlog,
    Chats,
    ViperBasicProps,
    Message,
} from "@/types/viper"
import { getCurrentViper } from "./session"
import { Session } from "next-auth"
import { cache } from "react"
import { EventInterface } from "@/types/event"

const client = await clientPromise
const db = client.db("viperDb")
const viperCollection = db.collection<Viper>("users")
const chatCollection = db.collection<Chats>("chats")
const eventCollection = db.collection<EventInterface>("events")
{
    /**
     * Using this to Test with Cypress, sign in Credentials
     */
}
export const getViperByUsername = cache(async (username: string, password: string) => {
    try {
        const viper = await viperCollection.findOne<Viper>({
            name: username,
        })
        return viper
    } catch (error) {
        throw new Error(`${error}`)
    }
})

export const preloadViperById = (viperId: string | ObjectId): void => {
    void getViperById(viperId)
}
export const getViperById = cache(async (viperId: string | ObjectId): Promise<Viper | null> => {
    if (typeof viperId === "object") return null
    const viper = await viperCollection.findOne<Viper>({
        _id: new ObjectId(viperId),
    })
    // if (!viper) return undefined
    return viper
})

export const preloadViperBasicProps = (viperId: string): void => {
    void getViperBasicProps(viperId)
}
export const getViperBasicProps = cache(async (viperId: string): Promise<ViperBasicProps> => {
    try {
        const viper = await viperCollection.findOne<Viper | null>(
            {
                _id: new ObjectId(viperId),
            },
            {
                projection: {
                    _id: 1,
                    name: 1,
                    image: 1,
                    backgroundImage: 1,
                    email: 1,
                    location: 1,
                    biography: 1,
                    followers: 1,
                    follows: 1,
                },
            }
        )
        if (!viper) throw new Error(`Bad viper id request`)
        return viper
    } catch (error) {
        throw new Error(`${error}`)
    }
})

export async function getVipers(): Promise<Viper[]> {
    const vipers = await viperCollection.find<Viper>({}).toArray()
    if (!vipers) throw new Error("No vipers")
    return vipers
}
export const preloadViperCollectionEvents = (viperId: string): void => {
    void getViperCollectionEvents(viperId)
}
export const getViperCollectionEvents = cache(async (viperId: string): Promise<Collection[]> => {
    const events = await viperCollection
        .aggregate<Collection>([
            {
                $match: { _id: new ObjectId(viperId) },
            },
            {
                $unwind: "$myEvents.collection",
            },
            {
                $project: {
                    _id: "$myEvents.collection._id",
                    checkoutId: "$myEvents.collection.checkoutId",
                },
            },
        ])
        .toArray()

    return events
})

// This will be in the api endpoint
export const preloadViperLikedEvents = (viperId: string): void => {
    void getViperLikedEvents(viperId)
}
export async function getViperLikedEvents(viperId: string): Promise<Likes[]> {
    // const viper: Session | null = await getCurrentViper()
    // const viper_id: string | undefined = viper?.user._id
    const likedEvents = await viperCollection
        .aggregate<Likes>([
            {
                $match: { _id: new ObjectId(viperId) },
            },
            {
                $unwind: "$myEvents.likes",
            },
            {
                $project: {
                    _id: "$myEvents.likes._id",
                },
            },
        ])
        .toArray()
    return likedEvents
}

export async function getViperFollows(id: string): Promise<Follow[]> {
    const viperFollows = await viperCollection
        .aggregate<Follow>([
            {
                $match: { _id: new ObjectId(id) },
            },
            {
                $unwind: "$follows",
            },
            {
                $project: {
                    _id: "$follows._id",
                },
            },
        ])
        .toArray()
    return viperFollows
}

export async function getVipersMessenger(id: string, viperId: string): Promise<Chats | null> {
    const vipersMessenger: Chats | null = await chatCollection.findOne<Chats>({
        members: {
            $in: [
                [new ObjectId(id), new ObjectId(viperId)],
                [new ObjectId(viperId), new ObjectId(id)],
            ],
        },
    })

    return vipersMessenger
}

// Gotta fix this, and make it way much prettier, thanks
export async function getBlogLikesAndRePosts(id: string): Promise<ExternalBlog[]> {
    const viperBlog = await viperCollection
        .aggregate<ExternalBlog>([
            {
                $match: {
                    _id: new ObjectId(id),
                },
            },
            {
                $project: {
                    _id: 0,
                    blogLikesAndRePosts: {
                        $concatArrays: ["$blogLikes", "$blogRePosts", "$blogCommented"],
                    },
                },
            },
            {
                $unwind: "$blogLikesAndRePosts",
            },
            {
                $project: {
                    _id: "$blogLikesAndRePosts._id",
                    blogOwner_id: "$blogLikesAndRePosts.blogOwner_id",
                    viper_id: "$blogLikesAndRePosts.viper_id",
                    timestamp: "$blogLikesAndRePosts.timestamp",
                    comment: "$blogLikesAndRePosts.comment",
                },
            },
            {
                $sort: { timestamp: -1 },
            },
        ])
        .toArray()
    return viperBlog
}

export const getBlog = cache(
    async (_id: string, blogOwner_id: string): Promise<Blog[] | undefined> => {
        // this looks horrible
        const bId = _id.slice(1, -1)
        const vId = blogOwner_id.slice(1, -1)
        try {
            const viperBlog = await viperCollection
                .aggregate<Blog>([
                    {
                        $match: {
                            _id: new ObjectId(vId),
                            "blog._id": new ObjectId(bId),
                        },
                    },
                    {
                        $project: {
                            blog: {
                                $filter: {
                                    input: "$blog",
                                    as: "b",
                                    cond: {
                                        $eq: ["$$b._id", new ObjectId(bId)],
                                    },
                                },
                            },
                        },
                    },
                    {
                        $unwind: "$blog",
                    },
                    {
                        $project: {
                            _id: "$blog._id",
                            content: "$blog.content",
                            likes: "$blog.likes",
                            comments: "$blog.comments",
                            timestamp: "$blog.timestamp",
                            rePosts: "$blog.rePosts",
                        },
                    },
                ])
                .toArray()
            return viperBlog
        } catch (error) {
            console.error(error)
        }
    }
)
export const preloadViperFollowed = (viperId: string): void => {
    void getViperFollowById(viperId)
}
export const getViperFollowById = cache(async (viperId: string): Promise<boolean> => {
    const viperSession: Session | null = await getCurrentViper()
    if (!viperSession) throw new Error("No Viper bro")
    // if (viperId === currentViper?.id) return false

    const viperFollower = await viperCollection.findOne({
        _id: new ObjectId(viperId),
        "followers._id": new ObjectId(viperSession.user._id),
    })
    if (!viperFollower) return false
    return true
})

export const preloadRequestEventParticipation = (viperId: string, eventId: string): void => {
    void requestEventParticipation(viperId, eventId)
}
export async function requestEventParticipation(
    viperId: string,
    eventId: string
): Promise<boolean> {
    try {
        const request = await viperCollection.findOne({
            _id: new ObjectId(viperId),
            "myEvents.collection._id": new ObjectId(eventId),
        })

        if (!request) return false
        return true
    } catch (error) {
        throw new Error("Error en requestEventParticipation")
    }
}

export const preloadViperBlogs = (viperId: string): void => {
    void getViperBlogs(viperId)
}

export const getViperBlogs = cache(async (viperId: string): Promise<Blog[]> => {
    try {
        const viperBlogs: Blog[] = await viperCollection
            .aggregate<Blog>([
                {
                    $match: {
                        _id: new ObjectId(viperId),
                    },
                },
                {
                    $unwind: "$blog",
                },
                { $unwind: "$blog.myBlog" },
                {
                    $project: {
                        _id: "$blog.myBlog._id",
                        content: "$blog.myBlog.content",
                        likes: "$blog.myBlog.likes",
                        comments: "$blog.myBlog.comments",
                        rePosts: "$blog.myBlog.rePosts",
                        timestamp: "$blog.myBlog.timestamp",
                    },
                },

                { $sort: { timestamp: 1 } },
            ])
            .toArray()
        return viperBlogs
    } catch (error) {
        throw new Error(`Error getViperBlogs`)
    }
})

export const preloadViperCreatedEvents = (viperId: string): void => {
    void getViperCreatedEvents(viperId)
}
export const getViperCreatedEvents = cache(
    async (viperId: string): Promise<EventInterface[] | undefined> => {
        const fullViper = await getViperById(viperId)
        const eventsId = fullViper?.myEvents.created.map((event) => {
            return new ObjectId(event._id)
        })
        if (!eventsId) throw new Error("no EventsId bro")
        const events = await eventCollection
            .find({ _id: { $in: eventsId } })
            .sort({ creationDate: -1 })
            .toArray()

        return events
    }
)
