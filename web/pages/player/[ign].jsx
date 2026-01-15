import PlayerModel from "../../components/PlayerModel";

export default function Player({ player }) {
  return (
    <div>
      <h1>{player.ign}</h1>
      <PlayerModel ign={player.ign} />

      {Object.entries(player.gamemodes || {}).map(([m, t]) => (
        <div key={m}>
          {m}: {t}
        </div>
      ))}
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const res = await fetch(process.env.API_URL + "/players/" + params.ign);
  const player = await res.json();

  return {
    props: { player }
  };
}
