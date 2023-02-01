import clsx from "clsx"

export const TabGroupCard = ({ isLoading }: { isLoading?: boolean }) => (
    // <div
    //     className={clsx("rounded-2xl max-h-8 w-24 bg-gray-900/80 p-4", {
    //         "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent":
    //             isLoading,
    //     })}
    // >
    <div className="space-y-3 grid grid-cols-3 mb-8 ml-2">
        <div className="flex justify-start space-x-2">
            <div className="h-7 w-4/12 rounded-lg " />
            <div className="h-7 w-9/12 rounded-lg bg-gray-700" />
            <div className="h-7 w-10/12 rounded-lg bg-gray-700" />
            {/* <div className="h-4 w-8/12 rounded-lg bg-gray-700" /> */}
        </div>
    </div>
    // </div>
)
