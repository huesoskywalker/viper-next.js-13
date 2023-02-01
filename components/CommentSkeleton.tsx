import clsx from "clsx"

export const CommentSkeleton = ({ isLoading }: { isLoading?: boolean }) => (
    <div
        className={clsx("rounded-2xl bg-gray-900/80 p-2 w-5/12", {
            "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent":
                isLoading,
        })}
    >
        <div className="space-y-3">
            {/* <div className="h-40 rounded-lg bg-gray-700" /> */}
            <div className="grid grid-cols-6 ">
                <span className="h-7 w-7 rounded-full bg-gray-700"></span>
                <div className="flex items-center col-start-2 col-span-5">
                    <span className=" h-4 w-8/12 rounded-lg bg-gray-700 " />
                </div>
            </div>
            <div className="grid grid-cols-8 space-y-2">
                <span className="col-start-2 col-span-6 h-10  w-12/12 rounded-lg bg-gray-700" />
                <div className="flex items-center col-start-2 col-span-3 gap-6 justify-center">
                    <span className="h-5 w-8 rounded-full bg-gray-700" />
                    <span className="h-5 w-8 rounded-full bg-gray-700" />
                </div>
                {/* <div className="h-4 w-3/12 rounded-lg bg-gray-700" /> */}
            </div>
        </div>
    </div>
)
