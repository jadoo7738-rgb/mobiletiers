import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Player() {
  const router = useRouter();
  const { ign } = router.query;

  const [player, setPlayer] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!ign) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/players/${ign}`)
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Player not found");
        }
        return res.json();
      })
      .then((data) => {
        setPlayer(data);
        setError(null);
      })
      .catch((err) => {
        console.error("FETCH ERROR:", err.message);
        setError(err.message);
        setPlayer(null);
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
