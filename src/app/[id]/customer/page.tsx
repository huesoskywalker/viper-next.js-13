import { Session } from "next-auth"
import { getCurrentViper } from "@/lib/session"
import CreateCustomer from "./CreateCustomer"

export default async function CustomerCreatePage() {
    const viperSession: Session | null = await getCurrentViper()
    const viper = viperSession?.user
    if (!viper) throw new Error("No viper bro")
    const splitFullName: string[] = viper.name.split(/\s+/)
    const firstName: string = splitFullName[0]
    const lastName: string = splitFullName[1]
    return (
        <div>
            <CreateCustomer
                viperId={viper._id}
                viperFirstName={firstName}
                viperLastName={lastName}
                viperEmail={viper.email}
                viperLocation={viper.location}
            />
        </div>
    )
}
