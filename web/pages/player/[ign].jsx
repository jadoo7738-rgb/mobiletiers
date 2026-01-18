import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Player() {
  const router = useRouter();
  const { ign } = router.query;
  const [player, setPlayer] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!ign) return;

    fetch(`/api/players/${ign}`)
      .then(res => {
        if (!res.ok) throw new Error("API failed");
        return res.json();
      })
      .then(setPlayer)
      .catch(err => {
        console.error(err);
        setError("Player not found");
      });
  }, [ign]);

  if (!ign) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!player) return <p>Loading player...</p>;

  return (
    <div>
      <h1>{player.ign}</h1>
    </div>
  );
}
