import Link from "next/link"
import Image from "next/image"
import getViperFollowById, { getViperById } from "../../lib/vipers"
import { Follow } from "../../components/Follow"
import { PageProps, firstLogin } from "../../lib/utils"
import { getCurrentViper } from "../../lib/session"

export default async function OrganizerInfo({
    id,
    event,
}: {
    id: string
    event: boolean
}) {
    const viperId = id.replace(/["']+/g, "")
    const viper = await getViperById(viperId)
    const currentViper = await getCurrentViper()
    const isViperFollowed = await getViperFollowById(viperId, currentViper!.id)
    type Truthy = "true" | "false"
    const isFollowed: Truthy = `${isViperFollowed ? true : false}`

    return (
        <div className="grid grid-cols-3 ">
            <div className="space-y-2 col-span-3 text-xs text-gray-300">
                <div className="flex justify-between ">
                    <Image
                        src={`${
                            firstLogin(viper!.image)
                                ? viper?.image
                                : `/vipers/${viper?.image}`
                        }`}
                        width={50}
                        height={50}
                        className="rounded-full group-hover:opacity-80 h-[50px] w-[50px]"
                        alt={viper!.name}
                        placeholder="blur"
                        blurDataURL={"viper.imageBlur"}
                    />
                    <Follow
                        id={viperId}
                        isFollowed={isFollowed}
                        event={event}
                    />
                </div>
                <div>
                    <Link href={`/dashboard/vipers/${viperId}`}>
                        <p className="hover:underline text-yellow-600 hover:text-gray-200">
                            {viper?.name}
                        </p>
                    </Link>
                </div>
                <p className="text-gray-200">{viper?.location}</p>
                <p className="text-white">{viper?.biography}</p>
            </div>
        </div>
    )
}
