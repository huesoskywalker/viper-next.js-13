import { getCurrentViper } from "@/lib/session"
import { getViperLikedEvents, preloadViperLikedEvents } from "@/lib/vipers"
import { Suspense } from "react"
import Loading from "./loading"
import { Likes } from "@/types/event"
import ViperCollection from "../collection/ViperCollection"

export default async function LikedPage() {
    const viperSession = await getCurrentViper()
    if (!viperSession) throw new Error("No Viper bro")
    const viper = viperSession?.user

    // const likedEvents: Promise<Likes[]> = getViperLikedEvents()
    // if (!likedEvents) return <div> asdf </div>
    preloadViperLikedEvents()
    // const fetchEvents = await fetch(`http://localhost:3000/api/viper/event/likes`, {
    //     method: "GET",
    //     headers: {
    //         "content-type": "application/json; charset=utf-8",
    //     },
    // })
    // const likedEvents = fetchEvents.json()
    return (
        <div>
            <Suspense fallback={<Loading />}>
                {/* @ts-expect-error Async Server Component */}
                <ViperCollection
                    // collectionPromise={likedEvents}
                    isCollection={false}
                    viperId={viper._id}
                />
            </Suspense>
        </div>
    )
}
