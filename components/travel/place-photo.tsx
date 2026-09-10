"use client";

import Image from "next/image";
import { useState } from "react";
import type { Place } from "./types";
import styles from "./map.module.css";

export default function PlacePhoto({ name, photos = [] }: { name: string; photos?: Place["photos"] }) {
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState<string[]>([]);
  const available = photos.filter(photo => !failed.includes(photo.src));
  const photo = available[index % Math.max(1, available.length)];
  return <aside className={styles.photoSpace} aria-label="Selected location" data-has-photo={Boolean(photo)}>
    <h2 className={styles.photoTitle} aria-live="polite">{name}</h2>
    {photo && <>
      <Image className={styles.placePhoto} src={photo.src} alt={photo.alt} width={640} height={480}
        sizes="(max-width: 760px) 180px, 280px" unoptimized
        onError={() => setFailed(previous => [...previous, photo.src])} />
      {available.length > 1 && <div className={styles.photoControls}>
        <button type="button" aria-label="Previous photo" onClick={() => setIndex(previous => (previous - 1 + available.length) % available.length)}>←</button>
        <span>{index % available.length + 1} / {available.length}</span>
        <button type="button" aria-label="Next photo" onClick={() => setIndex(previous => (previous + 1) % available.length)}>→</button>
      </div>}
    </>}
  </aside>;
}
