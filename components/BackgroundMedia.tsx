"use client";

import React, { useEffect, useRef } from "react";
import { ThemeMedia } from "@/lib/themeEngine";

interface BackgroundMediaProps {
  media: ThemeMedia;
  onLoadingChange?: (loading: boolean) => void;
}

export default function BackgroundMedia({
  media,
  onLoadingChange,
}: BackgroundMediaProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (media.type === "video" && videoRef.current) {
      onLoadingChange?.(true);
      videoRef.current.load();
      videoRef.current.play().catch(() => {
        // Autoplay may be restricted before user interaction
      });
    } else {
      onLoadingChange?.(false);
    }
  }, [media, onLoadingChange]);

  return (
    <>
      <img
        id="background-image"
        src={media.type === "image" ? media.src : "/day-themes/random/5.webp"}
        alt=""
        style={{
          display: media.type === "image" ? "block" : "none",
        }}
        onLoad={() => onLoadingChange?.(false)}
      />

      <video
        ref={videoRef}
        id="background-video"
        muted
        loop
        autoPlay
        playsInline
        style={{
          display: media.type === "video" ? "block" : "none",
        }}
        onLoadStart={() => onLoadingChange?.(true)}
        onCanPlayThrough={() => onLoadingChange?.(false)}
      >
        {media.type === "video" && (
          <source id="source-video" src={media.src} type="video/webm" />
        )}
      </video>
    </>
  );
}
