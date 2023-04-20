import { getCurrentViper } from "@/lib/session"
import { getViperLikedEvents } from "@/lib/vipers"
import { Suspense } from "react"
import Loading from "./loading"
import { Likes } from "@/types/event"
import ViperCollection from "../collection/ViperCollection"

export default async function LikedPage() {
    const viperSession = await getCurrentViper()
    if (!viperSession) throw new Error("No Viper bro")
    const viper = viperSession?.user

    const likes: Promise<Likes[]> = getViperLikedEvents(viper._id)

    return (
        <div>
            <Suspense fallback={<Loading />}>
                {/* @ts-expect-error Async Server Component */}
                <ViperCollection
                    collectionPromise={likes}
                    isCollection={false}
                    viperId={viper._id}
                />
            </Suspense>
        </div>
    )
}
