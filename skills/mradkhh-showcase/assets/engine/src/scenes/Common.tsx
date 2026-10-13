import type { ReactNode } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { enter, progress, rise } from "../anim";
import { C, FONT, LABELS } from "../theme";

/**
 * Layout shared by every scene: accent bar + headline on top, then a
 * content box of CONTENT_W × CONTENT_H px that scenes position inside.
 */
export const CONTENT_W = 1680;
export const CONTENT_H = 620;

export function SceneFrame({
  headline,
  children,
}: {
  headline: string;
  children: ReactNode;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ padding: "96px 120px 0" }}>
      <div
        style={{
          width: 110 * progress(frame, 0, 18),
          height: 8,
          borderRadius: 4,
          background: C.accent,
          marginBottom: 28,
        }}
      />
      <h1
        style={{
          margin: 0,
          fontFamily: FONT.heading,
          fontSize: 66,
          fontWeight: 700,
          lineHeight: 1.15,
          letterSpacing: -1,
          ...rise(enter(frame, fps, 2)),
        }}
      >
        {headline}
      </h1>
      <div
        style={{
          position: "relative",
          marginTop: 48,
          width: CONTENT_W,
          height: CONTENT_H,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
}

/** Small pill that marks the part of the picture that is new. */
export function NewBadge({ p }: { p: number }) {
  return (
    <div
      style={{
        display: "inline-block",
        padding: "6px 18px",
        borderRadius: 999,
        background: C.accent,
        color: C.accentForeground,
        fontSize: 24,
        fontWeight: 700,
        letterSpacing: 1,
        textTransform: "uppercase",
        transform: `scale(${p})`,
        opacity: p,
      }}
    >
      {LABELS.new}
    </div>
  );
}

/** Line that draws itself from start to end as `p` goes 0 → 1. */
export function DrawPath({
  d,
  length,
  p,
  color,
  width = 4,
  arrow = false,
}: {
  d: string;
  length: number;
  p: number;
  color: string;
  width?: number;
  arrow?: boolean;
}) {
  const id = `arrow-${color.replace("#", "")}`;
  return (
    <>
      {arrow && (
        <defs>
          <marker
            id={id}
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill={color} />
          </marker>
        </defs>
      )}
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeDasharray={length}
        strokeDashoffset={length * (1 - p)}
        markerEnd={arrow && p > 0.98 ? `url(#${id})` : undefined}
      />
    </>
  );
}
