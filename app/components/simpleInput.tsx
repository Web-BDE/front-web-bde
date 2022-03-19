export default function SimpleInput({
    label,
    value,
    name,
    type = "text",
    hint = "",
    readOnly = false,
}: {
    label: string,
    value?: string | number,
    name?: string,
    type?: string,
    hint?: string,
    readOnly?: boolean
}) {
    let realName = name || label.toLowerCase().replace(" ", "-")
    return (
        <label className="simple_input">
            <div className="simple_input__label">{label}</div>
            <input
                type={type}
                name={name}
                defaultValue={value}
                placeholder={hint}
                className={"simple_input__input" + (readOnly ? " simple_input__input--readOnly" : "")}
                readOnly={readOnly}
            />
        </label>
    )
}