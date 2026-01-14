import { useEffect, useRef } from "react";
import { SkinViewer } from "skinview3d";
import styles from "../styles/mctiers.module.css";

export default function PlayerModel({ ign }: { ign: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<SkinViewer | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    // cleanup old viewer
    if (viewerRef.current) {
      viewerRef.current.dispose();
    }

    viewerRef.current = new SkinViewer({
      domElement: ref.current,
      skin: `https://minotar.net/skin/${ign}`,
      width: 160,
      height: 320,
      renderPaused: false,
    });

    viewerRef.current.camera.position.set(0, 20, 40);
    viewerRef.current.controls.enableZoom = false;
    viewerRef.current.controls.enablePan = false;
    viewerRef.current.controls.enableRotate = true;

    return () => {
      viewerRef.current?.dispose();
      viewerRef.current = null;
    };
  }, [ign]);

  return <div ref={ref} className={styles.playerBody} />;
}
