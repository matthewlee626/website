"use client";
import TravelMap from "@/components/travel/travel-map";
import type { MapSelectionProps } from "@/components/travel/types";
import { beijingMap } from "./map-config";
export default function BeijingMap(props: MapSelectionProps) { return <TravelMap config={beijingMap} {...props} />; }
