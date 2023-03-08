import { getCurrentViper } from "../../../lib/session"
import CreateCustomer from "./CreateCustomer"

export default async function CustomerCreatePage() {
    const viper = await getCurrentViper()
    const splitFullName = viper!.name.split(/\s+/)
    const firstName = splitFullName[0]
    const lastName = splitFullName[1]
    return (
        <div>
            <CreateCustomer
                viperId={viper!.id}
                viperFirstName={firstName}
                viperLastName={lastName}
                viperEmail={viper!.email}
                viperLocation={viper!.location}
            />
        </div>
    )
}
