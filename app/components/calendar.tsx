interface Day {
    name: string
    daytime: string[]
    evening: string[]
}

export default function Calendar({
    days,
}: {
    days: Day[],
}) {
    return (
        <table className="calendar">
            <thead className="calendar__head">
                <tr className="calendar__row">
                    <th className="calendar__cell">Date</th>
                    <th className="calendar__cell">Journée</th>
                    <th className="calendar__cell">Soirée</th>
                </tr>
            </thead>
            <tbody className="calendar__body">
                {days.map(day =>
                    <tr className="calendar__row">
                        <td className="calendar__cell">{day.name}</td>
                        <td className="calendar__cell">{day.daytime.join(" • ")}</td>
                        <td className="calendar__cell">{day.evening.join(" • ")}</td>
                    </tr>
                )}
            </tbody>
        </table>
    )
}