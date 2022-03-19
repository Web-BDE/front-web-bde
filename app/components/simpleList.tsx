export default function SimpleList({
    datas,
    messageOnEmpty = "Aucun élément trouvé",
    onClick,
}: {
    datas: string[][],
    messageOnEmpty?: string,
    onClick?: (index: number) => void
}) {
    return (
        <ul className="simple_list">
            {datas.length
                ? datas.map((data, index) => <>
                    {index > 0
                        ? <hr className="simple_list__separator" />
                        : null}
                    {onClick
                        ? <li
                            className="simple_list__item simple_list__item--clickable"
                            onClick={_ => onClick(index)}
                        >
                            {data.map(value => <div className="simple_list__data">{value}</div>)}
                        </li>
                        : <li className="simple_list__item">
                            {data.map(value => <div className="simple_list__data">{value}</div>)}
                        </li>}
                </>)
                : <p className="simple_list__empty">{messageOnEmpty}</p>
            }
        </ul>
    )
}