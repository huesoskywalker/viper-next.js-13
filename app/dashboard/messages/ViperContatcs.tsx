import { Follow } from "../../../types/viper"

export async function ViperContacts({
    contactsPromise,
}: {
    contactsPromise: Promise<Follow[]>
}) {
    const viperFollows = await contactsPromise
    return (
        <div className="space-y-2">
            {viperFollows?.map((follow: Follow) => {
                return (
                    /* @ts-expect-error Async Server Component */
                    <Contacts
                        key={JSON.stringify(follow._id)}
                        id={JSON.stringify(follow._id)}
                    />
                )
            })}
        </div>
    )
}
