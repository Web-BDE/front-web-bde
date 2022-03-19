export default function Button({
    children,
    onClick,
    disabled=false,
    darkBackground=false,
}: {
    children: string | JSX.Element | JSX.Element[],
    onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
    disabled?: boolean,
    darkBackground?: boolean,
}) {
    return (
        <button
            className={
                "button"
                + (darkBackground
                    ? " button--variant"
                    : "")
                + (disabled
                    ? " button--disabled"
                    : "")
            }
            onClick={event => {
                if (!disabled) {
                    onClick(event)
                }
            }}
        >
            {children}
        </button>
    )
}