import styles from "../styles/mctiers.module.css";

export default function TitleBadge({ title }: { title: string }) {
  return <div className={styles.title}>{title}</div>;
}
