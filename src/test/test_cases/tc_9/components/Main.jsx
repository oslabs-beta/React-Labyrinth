export default function Main (props) {
    const displayName = props.name ? props.name : props.differentName

    return (
            <div>{displayName}</div>
    )
}