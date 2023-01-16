import { PageProps } from "../../../../lib/getCategories"
import { getEventComment, getEventReplies } from "../../../../lib/events"
import { EventCommentsCard } from "../../../../components/EventCommentsCard"

export default async function CommentIdPage({ params }: PageProps) {
    // console.log(params)
    const eventId: string = params.id
    //THIS WAS A RegExp FOR THE EVENT NAME
    // .replace(/[^a-zA-Z]/g, " ")
    // .replace(/  +/g, " ")
    const commentId: string = params.commentId
    const viperId: string = params.viperId

    const eventComment = await getEventComment(eventId, commentId)
    // const mappedComment = eventComment.map((e) => {
    //     return e.viperId
    // })

    const eventReplies = await getEventReplies(eventId, commentId, viperId)
    // console.log(eventReplies)
    const map = eventReplies.map((comment) => {
        return {
            viper: comment.viperId,
            text: comment.text,
        }
    })
    console.log(map)

    return <div></div>
}
