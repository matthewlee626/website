import type { Metadata } from "next";
import BeijingMap from "../beijing-map";
import { PageLayout } from "@/components/page-layout";

export const metadata: Metadata = { title: "beijing · interactive map" };

export default function MapPage() { return <PageLayout><BeijingMap /></PageLayout>; }
