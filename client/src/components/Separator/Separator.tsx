import styles from "./Separator.module.css"

interface SeparatorProps {
    text?: string
}

const Separator = (props: SeparatorProps) => {
    return <div className={styles.separator}>{props.text}</div>
}

export default Separator