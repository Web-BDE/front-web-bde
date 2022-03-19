export default function TitledSection({
    children,
    title,
    headerMeta,
}: {
    children: JSX.Element | JSX.Element[],
    title: string,
    headerMeta?: JSX.Element
}) {
    return (
        <section className="titled_section">
            <div className="titled_section__header">
                <h2 className="titled_section__title">{title}</h2>
                {headerMeta ? headerMeta : null}
            </div>
            {children}
        </section>
    )
}