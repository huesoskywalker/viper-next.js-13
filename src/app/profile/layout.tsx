import { PageProps } from "@/lib/getCategories"
import { getCurrentViper } from "@/lib/session"
import { ProfileMenu, fetchProfile } from "@/lib/getProfile"
import { TabGroup } from "@/components/TabGroup"
import { Profile } from "./Profile"
import { BlogButton } from "./BlogButton"
import { preloadViperById } from "@/lib/vipers"
import { Session } from "next-auth"

export default async function Layout({ children }: PageProps) {
    const categoryData: Promise<ProfileMenu[]> = fetchProfile()
    const viperSession: Promise<Session | null> = getCurrentViper()
    const [category, viper] = await Promise.all([categoryData, viperSession])

    if (!viper) throw new Error("No viper bro")

    // In here as well, we can filter some data, too much data without using it
    preloadViperById(viper.user._id)
    return (
        <div className="justify-center flex-wrap xl:px-20 lg:px-10">
            <div className=" lg:border-x  lg:border-gray-800 rounded-lg bg-vc-border-gradient p-px shadow-lg shadow-black/20 md:py-2 md:px-8">
                {/* @ts-expect-error Async Server Component */}
                <Profile viperId={viper.user._id} profile={true} />
                <div className="flex justify-center lg:border-b lg:border-gray-800 pb-3 lg:ml-4">
                    <BlogButton
                        viperId={viper.user._id}
                        viperName={viper.user.name}
                        viperImage={viper.user.image}
                    />
                    <TabGroup
                        path={`/profile`}
                        items={[
                            {
                                text: "Blog",
                            },
                            ...category.map((x) => ({
                                text: x.name,
                                slug: x.slug,
                            })),
                        ]}
                    />
                </div>
                <div className="mt-3">{children}</div>
            </div>
        </div>
    )
}
