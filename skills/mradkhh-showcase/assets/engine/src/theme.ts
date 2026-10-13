import { loadFont as loadHeading } from "@remotion/google-fonts/GoogleSansCode";
import { loadFont as loadBody } from "@remotion/google-fonts/GoogleSans";
import brand from "../brand.json";

// To change fonts, change brand.json and these two imports together.
const heading = loadHeading("normal", {
  weights: ["500", "700"],
  subsets: ["latin", "latin-ext"],
});
const body = loadBody("normal", {
  weights: ["400", "500", "700"],
  subsets: ["latin", "latin-ext"],
});

export const BRAND = brand;
export const C = brand.video;
export const LABELS = brand.labels;
export const FONT = { heading: heading.fontFamily, body: body.fontFamily };
