import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Player() {
  const router = useRouter();
  const { ign } = router.query;
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    if (!ign) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/players/${ign}`)
      .then(res => res.json())
      .then(setPlayer)
      .catch(err => {
        console.error(err);
      });
  }, [ign]);

  if (!ign) return <p>Loading...</p>;
  if (!player) return <p>Loading player...</p>;

  return (
    <div>
      <h1>{player.ign}</h1>
      {/* PlayerModel REMOVED */}
    </div>
  );
}
