import BlogCommentCard from "./BlogCommentCard"
import { EventCommentsCard } from "../../components/EventCommentsCard"
import { getCurrentViper } from "../../lib/session"
import { getViperById } from "../../lib/vipers"

export default async function ProfilePage() {
    const viper = await getCurrentViper()
    const fullViper = await getViperById(viper!.id)
    const stringifyFullViperId = JSON.stringify(fullViper?._id)
    const viperId = stringifyFullViperId.replace(/['"]+/g, "")

    console.log(fullViper?.blog)
    return (
        <div>
            {/* @ts-expect-error Server Component */}
            <EventCommentsCard
                eventId={""}
                viperId={viperId}
                commentId={""}
                text={""}
                commentLikes={0}
                commentReplies={0}
            />
        </div>
    )
}

{
}
