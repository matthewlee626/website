import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

export function PageHeading({ className, ...props }: ComponentPropsWithoutRef<"h1">) {
  return <h1 className={cn("ds-heading", className)} {...props} />;
}
