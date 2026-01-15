import { useEffect, useRef } from "react";
import { SkinViewer } from "skinview3d";
import styles from "../styles/mctiers.module.css";

export default function PlayerModel({ ign }) {
  const ref = useRef(null);
  const viewerRef = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    viewerRef.current = new SkinViewer({
      canvas: ref.current,
      width: 300,
      height: 400,
      skin: `https://mc-heads.net/skin/${ign}`,
    });

    return () => {
      if (viewerRef.current) {
        viewerRef.current.dispose();
        viewerRef.current = null;
      }
    };
  }, [ign]);

  return (
    <canvas
      ref={ref}
      className={styles.playerModel}
    />
  );
}
