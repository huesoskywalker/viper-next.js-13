import { Suspense } from "react"
import { getCurrentViper } from "@/lib/session"
import { preloadViperBlogs } from "@/lib/vipers"
import Loading from "./loading"
import { ViperBlogs } from "./ViperBlogs"
import { Session } from "next-auth"

export default async function ProfilePage() {
    const viperSession: Session | null = await getCurrentViper()

    if (!viperSession) throw new Error("No Viper bro")
    const viperId: string = viperSession.user._id

    // Using cache pattern built on top of parallel fetching

    //Documentation quote:
    //This pattern is completely optional and something you can use to optimize on a case-by-case basis.
    //This pattern is a further optimization on top of parallel data fetching.
    //Now you don't have to pass promises down as props and can instead rely on the preload pattern.
    {
        /**
         * Gotta see what to do with preloadViperBlogs and on <ViperBlogs>
         */
    }
    preloadViperBlogs(viperId)

    return (
        <div className="space-y-4 w-full flex flex-wrap">
            <Suspense fallback={<Loading />}>
                {/* @ts-expect-error Server Component */}
                <ViperBlogs viperId={viperId} />
            </Suspense>
        </div>
    )
}
