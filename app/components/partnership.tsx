export default function Partnership({
    name,
    imgSrc,
}: {
    name: string,
    imgSrc: string,
}) {
    return (
        <div className="partnership">
            <img src={imgSrc} alt={name} className="partnership__image" />
            <p className="partnership__name">{name}</p>
        </div>
    )
}