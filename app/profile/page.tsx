import { Suspense } from "react"
import { getCurrentViper } from "../../lib/session"
import { getViperBlogs } from "../../lib/vipers"
import Loading from "./loading"
import { Blog } from "../../types/viper"
import { ViperBlogs } from "./ViperBlogs"

export default async function ProfilePage() {
    const viper = await getCurrentViper()
    if (!viper) throw new Error("No viper bro")
    const viperId: string = viper.id

    const viperBlogs: Promise<Blog[]> = getViperBlogs(viperId)
    return (
        <div className="space-y-4">
            <Suspense fallback={<Loading />}>
                {/* @ts-expect-error Server Component */}
                <ViperBlogs blogsPromise={viperBlogs} viperId={viperId} />
            </Suspense>
        </div>
    )
}
