"use client";

import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { PageHeading } from "./ui/page-heading";
import styles from "./page-layout.module.css";

type Props = ComponentPropsWithoutRef<"main"> & {
  title?: string;
  headerClassName?: string;
  children: ReactNode;
};

/** Shared subpage frame; each experience retains its own content layout. */
export const PageLayout = forwardRef<HTMLElement, Props>(function PageLayout(
  { title, headerClassName, className = "", children, ...props }, ref,
) {
  return <main ref={ref} className={`${styles.page} ${className}`} {...props}>
    {title && <header className={headerClassName}>
      {title && <PageHeading>{title}</PageHeading>}
    </header>}
    {children}
  </main>;
});
