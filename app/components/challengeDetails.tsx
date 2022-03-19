import { Challenge } from "~/models/entities"
import SimpleForm from "./simpleForm"
import SimpleInput from "./simpleInput"

type AccessType = "READ" | "UPDATE" | "CREATE"

export default function ChallengeDetails({
    challenge,
    accessType = "READ",
}: {
    challenge: Challenge,
    accessType?: AccessType
}) {
    return (
        <SimpleForm method={accessType == "READ" ? "get" : accessType == "UPDATE" ? "patch" : "put"}>
            <SimpleInput
                label="Nom"
                name="name"
                value={challenge.name || "Sans nom"}
                readOnly={accessType == "READ"}
            />
            <SimpleInput
                label="Description"
                name="description"
                value={challenge.description || ""}
                readOnly={accessType == "READ"}
            />
            <SimpleInput
                label="Récompense"
                name="reward"
                value={challenge.reward || 0}
                type="number"
                readOnly={accessType == "READ"}
            />
            <SimpleInput
                label="Nombre de tentatives"
                name="maxAttempts"
                value={challenge.maxAtempts || 3}
                type="number"
                readOnly={accessType == "READ"}
            />
        </SimpleForm>
    )
}