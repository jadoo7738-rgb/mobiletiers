import styles from "../styles/mctiers.module.css";

export default function TierCard({ mode, tier }: any) {
  return (
    <div className={styles.modeCard}>
      <img src={`/gamemodes/${mode}.svg`} width={32} />
      <div className={`${styles.tier} ${styles[tier]}`}>
        {tier}
      </div>
      <span>{mode}</span>
    </div>
  );
}
