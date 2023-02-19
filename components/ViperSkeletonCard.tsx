import clsx from "clsx"

export const ViperSkeletonCard = ({ isLoading }: { isLoading?: boolean }) => (
    <div
        className={clsx("rounded-2xl bg-gray-900/80 p-2 ", {
            "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent":
                isLoading,
        })}
    >
        <div className="space-y-2">
            <div className="h-10 w-10 rounded-full bg-gray-700" />
            <div className="h-2 w-6/12 rounded-lg bg-gray-700" />
            <div className="h-[9px] w-4/12 rounded-lg bg-gray-700" />
            <div className="h-8 w-11/12 rounded-lg bg-gray-700" />
            {/* <div className="h-4 w-11/12 rounded-lg bg-gray-700" /> */}
        </div>
    </div>
)
