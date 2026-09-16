import type { Metadata } from "next";
import BeijingReader from "./beijing-reader";
export const metadata: Metadata = { title: "beijing travel notes · matthew lee", description: "the imperial capital has much to see" };
export default function BeijingPage() { return <BeijingReader />; }
