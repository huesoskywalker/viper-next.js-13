import Link from "next/link"
import Image from "next/image"
import { getViperById, getViperFollowById } from "@/lib/vipers"
import { firstLogin } from "@/lib/utils"
import { Follow, Viper } from "@/types/viper"
import ShowFollows from "../profile/ShowFollows"
import ViperInfo from "../profile/ViperInfo"
import { AddFollow } from "../profile/AddFollow"

export default async function OrganizerInfo({
    organizerId,
    event,
}: {
    organizerId: string
    event: boolean
}) {
    const viperId: string = organizerId.replace(/["']+/g, "")
    const viperData: Promise<Viper | null> = getViperById(viperId)
    const isViperFollowedData: Promise<boolean> = getViperFollowById(viperId)

    const [viper, isViperFollowed] = await Promise.all([
        viperData,
        isViperFollowedData,
    ])
    if (!viper) throw new Error("No viper from OrganizerInfo")
    return (
        <div className="grid grid-cols-3 ">
            <div className="space-y-3 col-span-3 text-xs text-gray-300">
                <div className="flex justify-between ">
                    <Image
                        src={`${
                            firstLogin(viper.image)
                                ? viper.image
                                : `/vipers/${viper.image}`
                        }`}
                        width={50}
                        height={50}
                        className="rounded-full group-hover:opacity-80 h-[50px] w-[50px]"
                        alt={viper.name}
                        placeholder="blur"
                        blurDataURL={"viper.imageBlur"}
                    />
                    <AddFollow
                        id={viperId}
                        isFollowed={isViperFollowed}
                        event={event}
                    />
                </div>
                <div className="h-fit w-fit">
                    <Link href={`/dashboard/vipers/${viperId}`}>
                        <p className="hover:underline text-yellow-600 hover:text-gray-200">
                            {viper.name}
                        </p>
                    </Link>
                </div>
                <p className="text-gray-200">{viper.location}</p>
                <p className="text-white">{viper.biography}</p>
                <div className="mt-5 space-x-8 text-gray-300 text-xs">
                    <ShowFollows
                        follows={viper.follows?.length}
                        followers={false}
                        profile={false}
                    >
                        {viper.follows?.map((follows: Follow) => {
                            return (
                                /* @ts-expect-error Async Server Component */
                                <ViperInfo
                                    key={JSON.stringify(follows._id)}
                                    id={JSON.stringify(follows._id)}
                                />
                            )
                        })}
                    </ShowFollows>

                    <ShowFollows
                        follows={viper.followers?.length}
                        followers={true}
                        profile={false}
                    >
                        {viper.followers?.map((followers: Follow) => {
                            return (
                                /* @ts-expect-error Async Server Component */
                                <ViperInfo
                                    key={JSON.stringify(followers._id)}
                                    id={JSON.stringify(followers._id)}
                                />
                            )
                        })}
                    </ShowFollows>
                </div>
            </div>
        </div>
    )
}
