export default function Separator({
    width = "1px",
    height = "1px",
}: {
    width?: string,
    height?: string,
}) {
    return <div style={{ width: width, height: height }} />
}