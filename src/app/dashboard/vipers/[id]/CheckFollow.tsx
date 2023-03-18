import { getViperFollowById } from "@/lib/vipers"
import { AddFollow } from "@/app/profile/AddFollow"

export async function CheckFollow({ viperId }: { viperId: string }) {
    const isViperFollowed: boolean = await getViperFollowById(viperId)

    return (
        <>
            <div className="flex justify-start">
                <AddFollow
                    id={viperId}
                    isFollowed={isViperFollowed}
                    event={true}
                />
            </div>
        </>
    )
}
