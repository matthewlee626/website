import type { Metadata } from "next";
import BeijingReader from "./beijing-reader";
export const metadata: Metadata = { title: "Beijing field notes · Matthew Lee", description: "Explore Beijing with a map alongside personal field notes." };
export default function BeijingPage() { return <BeijingReader />; }
