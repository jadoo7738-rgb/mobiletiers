import Link from "next/link";

const MODES = [
  "nethpot",
  "cpvp",
  "axe",
  "sword",
  "smp",
  "mace",
  "uhc",
  "pot"
];

export default function GamemodeTabs() {
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      {MODES.map((mode) => (
        <Link key={mode} href={`/gamemode/${mode}`}>
          <img
            src={`/gamemodes/${mode}.svg`}
            width={36}
            height={36}
            style={{ cursor: "pointer" }}
          />
        </Link>
      ))}
    </div>
  );
}
