"use client";

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type TextLinkProps = ComponentPropsWithoutRef<typeof Link> & { text?: string };

/** Defaults to the site's existing new-tab behavior; pass target="_self" to override. */
export const TextLink = forwardRef<HTMLAnchorElement, TextLinkProps>(
  ({ text, children, className, target = "_blank", rel, ...props }, ref) => (
    <Link
      ref={ref}
      className={cn("ds-text-link", className)}
      target={target}
      rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)}
      {...props}
    >
      {children ?? text}
    </Link>
  ),
);
TextLink.displayName = "TextLink";
