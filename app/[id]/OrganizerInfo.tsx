import Link from "next/link"
import Image from "next/image"
import getViperFollowById, { getViperById } from "../../lib/vipers"
import { Follow } from "../../components/Follow"
import { cookies } from "next/headers"
import { PageProps } from "../../lib/utils"
import { getCurrentViper } from "../../lib/session"

export default async function OrganizerInfo({
    id,
    eventId,
}: {
    id: string
    eventId: string
}) {
    const viperId = id.replace(/["']+/g, "")
    const viper = await getViperById(viperId)
    const currentViper = await getCurrentViper()
    const isViperFollowed = await getViperFollowById(viperId, currentViper!.id)
    type Truthy = "true" | "false"
    const isFollowed: Truthy = `${isViperFollowed ? true : false}`

    return (
        <div className="grid grid-cols-3">
            <div className="space-y-2 col-span-3 text-xs text-gray-300">
                <div className="flex justify-between ">
                    <Image
                        src={`/vipers/${viper?.image}`}
                        width={50}
                        height={50}
                        className="rounded-full group-hover:opacity-80"
                        alt={viper!.name}
                        placeholder="blur"
                        blurDataURL={"viper.imageBlur"}
                    />
                    <Follow id={viperId} isFollowed={isFollowed} />
                </div>
                <div>
                    <Link href={`/dashboard/vipers/${viperId}`}>
                        <p className="hover:underline">{viper?.name}</p>
                    </Link>
                </div>
                <p>{viper?.biography}</p>
            </div>
        </div>
    )
}
