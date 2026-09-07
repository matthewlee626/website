import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

/** The outlined frame used for profile images, navigation, and social links. */
export function Panel({ flush = false, className, ...props }: ComponentPropsWithoutRef<"div"> & { flush?: boolean }) {
  return <div className={cn("ds-panel", flush && "ds-panel-flush", className)} {...props} />;
}
