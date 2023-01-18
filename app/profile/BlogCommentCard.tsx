export default async function BlogCommentCard() {
    return (
        <div className="space-y-2">
            {/* <Link
                href={`/${id}/${comment.viperId}/${commentId}`}
                className="space-y-4"
            > */}
            {/* <div className="space-y-6"> */}
            <div className="flex items-center space-x-2">
                <div className="h-6 w-6 rounded-full bg-gray-700">
                    {" "}
                    Image
                    {/* <Image
                            src={`/vipers/${viper?.image}`}
                            alt={`/vipers/${viper?.image}`}
                            width={50}
                            height={50}
                            className="rounded-full col-start-1 "
                        /> */}
                </div>
                <span className="text-sm text-white mt-5 ml-5">
                    {/* {viper?.name} */} nombre
                </span>
            </div>
            <div className="text-gray-300 text-base font-light">
                {/* {comment.text} */} texto
            </div>
            {/* </div> */}
            {/* </Link> */}

            <div className="flex justify-items-start space-x-4 space-y-1">
                {/* <AddLike
                    eventId={id}
                    commentId={commentId}
                    likes={comment.likes.length}
                    replyId={""}
                    likedCookie={likedCookie}
                    event={false}
                    reply={false}
                /> */}

                {/* <AddComment
                    id={id}
                    comments={comment.replies?.length}
                    commentId={commentId}
                    // viperComment={comment.text}
                    // viperIdComment={comment.viperId}
                    event={false}
                    reply={true}
                /> */}
            </div>
        </div>
    )
}
