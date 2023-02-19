import { getViperById } from "../../../../lib/vipers"
import Image from "next/image"
import { cookies } from "next/headers"
import AddComment from "../../AddComment"
import { AddLike } from "../../AddLike"
import Link from "next/link"
import RePostBlog from "../../../../components/RePostBlog"

export async function CommentCard({
    eventId,
    viperId,
    commentId,
    text,
    timestamp,
    likes,
    replies,
    rePosts,
    event,
    blog,
    reply,
    showComment,
}: {
    eventId: string
    commentId: string
    viperId: string
    text: string
    timestamp: number
    likes: number
    replies: number
    rePosts: number
    event: boolean
    blog: boolean
    reply: boolean
    showComment: string
}) {
    const blogger_id = eventId.replace(/['"]+/g, "")
    const blogger = await getViperById(blogger_id)
    const viper_id = viperId.replace(/['"]+/g, "")
    const viper = await getViperById(viper_id)
    const comment_id = commentId.replace(/[\W]+/g, "")

    const likedCookie =
        cookies().get(`_${comment_id}_is_liked`)?.value || "none"
    const commentCookie =
        cookies().get(`_${timestamp}_is_commented`)?.value || "none"
    const rePostCookie =
        cookies().get(`_${timestamp}_is_rePosted`)?.value || "none"

    return (
        <div className="space-y-2 ">
            <Link href={`/vipers/${viper_id}`} className="space-y-4">
                <div className="flex items-center space-x-2">
                    <div className="h-6 w-6 rounded-full bg-gray-700">
                        {" "}
                        <Image
                            src={`/vipers/${blogger?.image}`}
                            alt={`/vipers/${blogger?.image}`}
                            width={50}
                            height={50}
                            className="rounded-full col-start-1 "
                        />
                    </div>
                    <span className="text-sm text-white mt-5 ml-5">
                        {blogger?.name}
                    </span>
                </div>
                <div className="text-gray-300 text-base font-light">{text}</div>
            </Link>

            <div className=" flex justify-items-start space-x-4 space-y-1">
                <AddLike
                    eventId={eventId}
                    commentId={comment_id}
                    replyId={""}
                    likes={likes}
                    timestamp={timestamp}
                    event={false}
                    reply={false}
                    blog={blog}
                    likedCookie={likedCookie}
                />
                <AddComment
                    id={eventId}
                    commentId={comment_id}
                    commentReplies={replies}
                    rePosts={rePosts}
                    viperIdImage={viper!.image}
                    viperIdName={viper!.name}
                    bloggerIdName={blogger!.name}
                    timestamp={timestamp}
                    rePostCookie={rePostCookie}
                    commentCookie={commentCookie}
                    event={event}
                    reply={reply}
                    blog={blog}
                    showComment={showComment}
                />
                {/* {blog ?? (
                    <RePostBlog
                        bloggerId={eventId}
                        blogId={comment_id}
                        viperId={""}
                        rePosts={rePosts}
                        timestamp={timestamp}
                        rePostCookie={rePostCookie}
                    />
                )} */}
            </div>
        </div>
    )
}
