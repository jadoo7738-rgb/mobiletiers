import Link from "next/link";
import styles from "../styles/mctiers.module.css";

export default function Home({ players }) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img src="/logo.png" alt="logo" />
        <h1>MobileTiers</h1>
      </div>

      <div className={styles.leaderboard}>
        {players.map((p, i) => (
          <Link
            href={`/player/${p.ign}`}
            key={p.ign}
            className={styles.row}
          >
            <div
              className={`${styles.rank} ${
                i === 0
                  ? styles.gold
                  : i === 1
                  ? styles.silver
                  : i === 2
                  ? styles.bronze
                  : ""
              }`}
            >
              #{i + 1}
            </div>

            <div className={styles.player}>
              <img src={`https://mc-heads.net/avatar/${p.ign}`} />
              <span className={styles.name}>{p.ign}</span>
            </div>

            <div className={`${styles.region} ${styles[p.region]}`}>
              {p.region}
            </div>

            <div className={`${styles.tier} ${styles[p.overallTier]}`}>
              {p.overallTier}
            </div>

            <div className={styles.points}>{p.points}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const res = await fetch(process.env.API_URL + "/players");
  const players = await res.json();

  return {
    props: { players }
  };
}
