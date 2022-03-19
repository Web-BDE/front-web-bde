import Partnership from "./partnership"

type partnership = {
    name: string,
    imgSrc: string,
}

export default function PartnershipList({
    partnerships
}: {
    partnerships: partnership[],
}) {
    return (
        <div className="partnership_list">
            {partnerships.map(
                partnership => <Partnership name={partnership.name} imgSrc={partnership.imgSrc} />
            )}
        </div>
    )
}