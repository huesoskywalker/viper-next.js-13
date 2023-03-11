import { getCurrentViper } from "../../../lib/session"
import CreateCustomer from "./CreateCustomer"

export default async function CustomerCreatePage() {
    const viper = await getCurrentViper()
    if (!viper) return
    const splitFullName: string[] = viper.name.split(/\s+/)
    const firstName: string = splitFullName[0]
    const lastName: string = splitFullName[1]
    return (
        <div>
            <CreateCustomer
                viperId={viper.id}
                viperFirstName={firstName}
                viperLastName={lastName}
                viperEmail={viper.email}
                viperLocation={viper.location}
            />
        </div>
    )
}
