import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../../styles/mctiers.module.css";

const VALID_MODES = [
  "nethpot",
  "cpvp",
  "axe",
  "sword",
  "smp",
  "mace",
  "uhc",
  "pot",
];

export default function GamemodeRanking() {
  const router = useRouter();
  const { mode } = router.query;

  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!mode || !VALID_MODES.includes(mode as string)) return;

    setLoading(true);

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/gamemode/${mode}`)
      .then((res) => res.json())
      .then((data) => {
        setPlayers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [mode]);

  if (!mode) return null;

  if (loading) {
    return (
      <div className={styles.container}>
        <h2>Loading {mode} rankings…</h2>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* ===== HEADER ===== */}
      <div className={styles.header}>
        <Link href="/" className={styles.back}>
          ← Back
        </Link>

        <div className={styles.modeHeader}>
          <img
            src={`/gamemodes/${mode}.svg`}
            alt={String(mode)}
            className={styles.modeIcon}
          />
          <h1>{String(mode).toUpperCase()} Rankings</h1>
        </div>
      </div>

      {/* ===== TABLE HEADER ===== */}
      <div className={`${styles.row} ${styles.tableHeader}`}>
        <div>#</div>
        <div>Player</div>
        <div>Region</div>
        <div>Tier</div>
        <div>Points</div>
      </div>

      {/* ===== PLAYERS ===== */}
      {players.map((p, i) => {
        const tier = p.modes?.[mode as string] ?? "Unranked";
        const points =
          p.modePoints?.[mode as string] ??
          0;

        return (
          <Link
            key={p.ign}
            href={`/player/${p.ign}`}
            className={styles.row}
          >
            {/* RANK */}
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
              {i + 1}
            </div>

            {/* PLAYER */}
            <div className={styles.player}>
              <img
                src={`https://minotar.net/avatar/${p.ign}/64`}
                className={styles.avatar}
              />
              <span className={styles.name}>{p.ign}</span>
            </div>

            {/* REGION */}
            <div className={`${styles.region} ${styles[p.region]}`}>
              {p.region}
            </div>

            {/* TIER */}
            <div className={`${styles.tier} ${styles[tier]}`}>
              {tier}
            </div>

            {/* POINTS */}
            <div className={styles.points}>
              {points}
            </div>
          </Link>
        );
      })}
    </div>
  );
}

