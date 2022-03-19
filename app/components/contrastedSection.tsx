import { Link } from "remix";

type csButton = {
    url: string,
    text: string,
}

type csImage = {
    src: string,
    alt: string,
}

export default function ContrastedSection({
    children,
    title,
    image,
    button,
}: {
    children: string,
    title: string,
    image: csImage,
    button?: csButton,
}) {
    return (
        <section className="contrasted_section">
            <article className="contrasted_section__article">
                <h2 className="contrasted_section__title">{title}</h2>
                <p className="contrasted_section__text">{children}</p>
                {button
                ?   <Link to={button.url} className="contrasted_section__button">
                        {button.text}
                    </Link>
                :   null
                }
            </article>
            <aside className="contrasted_section__aside">
                <img src={image.src} alt={image.alt} className="contrasted_section__image" />
            </aside>
        </section>
    );
}