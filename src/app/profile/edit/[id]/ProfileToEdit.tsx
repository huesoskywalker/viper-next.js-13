import { Viper } from "@/types/viper"
import EditProfile from "./EditProfile"

export async function ProfileToEdit({
    profilePromise,
}: {
    profilePromise: Promise<Viper>
}) {
    const viper: Viper = await profilePromise
    const viperId: string = JSON.stringify(viper._id).replace(/['"]+/g, "")
    return (
        <>
            <div className="flex justify-between">
                <EditProfile
                    viperId={viperId}
                    name={viper.name}
                    biography={viper.biography}
                    location={viper.location}
                />
            </div>
        </>
    )
}
