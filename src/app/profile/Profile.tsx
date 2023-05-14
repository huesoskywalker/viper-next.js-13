import Image from "next/image"
import { getViperById, preloadViperFollowed } from "@/lib/vipers"
import ShowFollows from "./ShowFollows"
import ViperInfo from "./ViperInfo"
import { firstLogin } from "@/lib/utils"
import { Follow, Viper } from "@/types/viper"
import { EditProfileLink } from "./EditProfileLink"
import { CheckFollow } from "@/app/dashboard/vipers/[id]/CheckFollow"

export const Profile = async ({ viperId, profile }: { viperId: string; profile: boolean }) => {
    const fullViper: Viper | null = await getViperById(viperId)
    if (!fullViper) throw new Error("No viper bro")
    preloadViperFollowed(viperId)

    return (
        <div className="grid grid-cols-4">
            <div className="col-span-4 overflow-hidden">
                <Image
                    data-test="background-image"
                    src={
                        fullViper.backgroundImage !== undefined
                            ? `/vipers/${fullViper.backgroundImage}`
                            : fullViper.image
                    }
                    width={580}
                    height={100}
                    className="-z-10 rounded-xl  group-hover:opacity-80 max-h-44 max-w-auto object-cover object-center -mb-2"
                    alt={fullViper.name}
                    placeholder="blur"
                    blurDataURL={fullViper.image}
                ></Image>
                <div className="z-10 relative bottom-9 left-7">
                    <Image
                        data-test="profile-image"
                        src={`${
                            firstLogin(fullViper.image)
                                ? fullViper.image
                                : `/vipers/${fullViper.image}`
                        }`}
                        width={100}
                        height={100}
                        className="  rounded-full border-solid border-2 border-yellow-600 group-hover:opacity-80 max-h-24 max-w-24 object-cover object-top"
                        alt={fullViper.name}
                        placeholder="blur"
                        blurDataURL={fullViper.image}
                        loading="lazy"
                    />
                    <div className="grid grid-cols-2">
                        <h1 data-test="viper-name" className="text-sm text-yellow-700 mt-4">
                            {fullViper.name}
                            <p className="text-xs text-gray-300 mt-1">{fullViper.email}</p>
                            <p className="text-xs text-gray-400 mt-2">
                                Settled in{" "}
                                <span data-test="viper-location" className="text-gray-200 ">
                                    {fullViper.location ?? "Planet Earth"}
                                </span>
                            </p>
                        </h1>
                        {profile ? (
                            <EditProfileLink href={`/profile/edit/${viperId}`} />
                        ) : (
                            /* @ts-expect-error Server Component */
                            <CheckFollow viperId={viperId} />
                        )}
                    </div>
                    <div className="break-after-column">
                        <h1 data-test="viper-biography" className="text-gray-300 text-sm mt-5">
                            {fullViper.biography}
                        </h1>
                    </div>
                    <div className="mt-5 space-x-8 text-gray-300 text-xs">
                        <ShowFollows
                            follows={fullViper.follows.length}
                            followers={false}
                            profile={true}
                        >
                            {fullViper.follows.map((follows: Follow) => {
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
                            follows={fullViper.followers.length}
                            followers={true}
                            profile={true}
                        >
                            {fullViper.followers.map((followers: Follow) => {
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
        </div>
    )
}
