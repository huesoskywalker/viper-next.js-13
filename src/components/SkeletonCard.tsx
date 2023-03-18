import clsx from "clsx"

export const SkeletonCard = ({ isLoading }: { isLoading?: boolean }) => (
    <div
        className={clsx("rounded-2xl bg-gray-900/80 p-2 ", {
            "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent":
                isLoading,
        })}
    >
        <div className="space-y-3">
            <div className="h-28 rounded-lg bg-gray-700" />
            <div className="h-4 w-9/12 rounded-lg bg-gray-700" />
            {/* <div className="h-9 w-11/12 rounded-lg bg-gray-700" /> */}
            <div className="h-4 w-5/12 rounded-lg bg-gray-700" />
            <div className="h-4 w-8/12 rounded-lg bg-gray-700" />
        </div>
    </div>
)
