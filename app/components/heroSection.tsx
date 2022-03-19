export default function HeroSection({
    imgSrc,
    alt="Hero",
}: {
    imgSrc: string,
    alt?: string,
}) {
    return (
        <section className="hero_section">
            <img src={imgSrc} alt={alt} className="hero_section__image" />
        </section>
    );
}