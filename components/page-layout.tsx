"use client";

import Link from "next/link";
import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { PageHeading } from "./ui/page-heading";
import styles from "./page-layout.module.css";

type Crumb = { label: string; href?: string };
type Props = ComponentPropsWithoutRef<"main"> & {
  title?: string;
  breadcrumbs?: Crumb[];
  headerClassName?: string;
  children: ReactNode;
};

/** Shared subpage frame; each experience retains its own content layout. */
export const PageLayout = forwardRef<HTMLElement, Props>(function PageLayout(
  { title, breadcrumbs, headerClassName, className = "", children, ...props }, ref,
) {
  return <main ref={ref} className={`${styles.page} ${className}`} {...props}>
    {(title || breadcrumbs) && <header className={headerClassName}>
      {breadcrumbs && <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        {breadcrumbs.map((crumb, index) => <span key={`${crumb.label}-${index}`}>
          {index > 0 && <span className={styles.separator} aria-hidden="true">/</span>}
          {crumb.href ? <Link href={crumb.href}>{crumb.label}</Link> : <span aria-current="page">{crumb.label}</span>}
        </span>)}
      </nav>}
      {title && <PageHeading>{title}</PageHeading>}
    </header>}
    {children}
  </main>;
});
