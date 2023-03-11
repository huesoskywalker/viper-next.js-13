import { PageProps } from "../../lib/getCategories"
import { getCurrentViper } from "../../lib/session"
import { Profile, fetchProfile } from "../../lib/getProfile"
import { TabGroup } from "../../components/TabGroup"
import AddComment from "../../components/AddComment"

export default async function Layout({ children }: PageProps) {
    const category: Profile[] = await fetchProfile()
    const viper = await getCurrentViper()
    if (!viper) return
    return (
        <div className="grid grid-cols-7 gap-4 ">
            <div className="col-start-2 col-span-5 mx-2 max-w-6xl  lg:border-x  lg:border-gray-800 rounded-lg bg-vc-border-gradient p-px shadow-lg shadow-black/20 lg:py-2 lg:px-2">
                {/* @ts-expect-error Async Server Component */}
                <Profile
                    viperId={viper.id}
                    profile={true}
                    currentViper={viper.id}
                />
                <div className="flex justify-center lg:border-b lg:border-gray-800 pb-3 mr-10">
                    <AddComment
                        id={null}
                        commentId={null}
                        viperIdImage={undefined}
                        viperIdName={undefined}
                        bloggerIdName={undefined}
                        commentReplies={null}
                        timestamp={null}
                        commentCookie={"none"}
                        event={false}
                        reply={false}
                        blog={false}
                        showComment={undefined}
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
