import styles from "../styles/mctiers.module.css";

export default function RegionBadge({ region }: any) {
  return <span className={`${styles.region} ${styles[region]}`}>{region}</span>;
}
