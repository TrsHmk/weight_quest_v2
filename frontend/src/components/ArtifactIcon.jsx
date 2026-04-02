import React from "react";

/**
 * Рендерить іконку артефакту:
 * - якщо icon починається з '/' — показує <img>
 * - інакше — emoji як текст
 */
export default function ArtifactIcon({ icon, alt = "", size = "w-10 h-10", className = "" }) {
  if (icon && icon.startsWith("/")) {
    return (
      <img
        src={icon}
        alt={alt}
        className={`${size} ${className} object-contain pixelated`}
        style={{ imageRendering: "pixelated" }}
      />
    );
  }
  return <span className={`text-2xl leading-none ${className}`}>{icon}</span>;
}
