import type { Metadata } from "next";
import JapanReader from "./japan-reader";
export const metadata: Metadata = {
  title: "Japan field notes · Matthew Lee",
  description: "Personal field notes on Tokyo, Osaka, Kyoto, and the places in between, with an interactive map.",
};
export default function JapanPage() { return <JapanReader />; }
