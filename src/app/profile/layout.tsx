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
    preloadViperById(viper.user.id)
    if (!viper) throw new Error("No viper bro")
    return (
        <div className="grid grid-cols-7 gap-4 ">
            <div className="col-start-2 col-span-5 mx-2 max-w-6xl  lg:border-x  lg:border-gray-800 rounded-lg bg-vc-border-gradient p-px shadow-lg shadow-black/20 lg:py-2 lg:px-2">
                {/* @ts-expect-error Async Server Component */}
                <Profile viperId={viper.user.id} profile={true} />
                <div className="flex justify-center lg:border-b lg:border-gray-800 pb-3 mr-10">
                    <BlogButton
                        viperId={viper.user.id}
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
