import type { Metadata } from "next";
import JapanReader from "./japan-reader";
export const metadata: Metadata = {
  title: "Japan travel notes · Matthew Lee",
  description: "Personal travel notes on Tokyo, Osaka, Kyoto, and the places in between, with an interactive map.",
};
export default function JapanPage() { return <JapanReader />; }
