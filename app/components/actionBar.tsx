import Add from "~/shapes/add";
import ArrowBack from "~/shapes/arrowBack";
import Remove from "~/shapes/remove";

export default function ActionBar({
    onAdd,
    onRemove,
    onBack,
}: {
    onAdd?: () => void,
    onRemove?: () => void,
    onBack?: () => void,
}) {
    return (
        <div className="action_bar">
            {onRemove
                ? <div className="action_bar__button" onClick={_ => onRemove()}>
                    <Remove />
                </div>
                : null}
            {onAdd
                ? <div className="action_bar__button" onClick={_ => onAdd()}>
                    <Add />
                </div>
                : null}
            {onBack
                ? <div className="action_bar__button" onClick={_ => onBack()}>
                    <ArrowBack />
                </div>
                : null}
        </div>
    )
}