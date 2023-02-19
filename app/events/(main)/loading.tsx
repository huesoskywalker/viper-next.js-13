import { TabGroupCard } from "../../../components/TabGroupCard"
import { SkeletonCard } from "../../../components/SkeletonCard"

export default function Loading() {
    return (
        <div className="space-y-4 ">
            <TabGroupCard isLoading={true} />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <SkeletonCard isLoading={true} />
                <SkeletonCard isLoading={true} />
                <SkeletonCard isLoading={true} />
                <SkeletonCard isLoading={true} />
                <SkeletonCard isLoading={true} />
                <SkeletonCard isLoading={true} />
            </div>
        </div>
    )
}
