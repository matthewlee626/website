"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./site-header.module.css";

const labels: Record<string, string> = {
  "/thoughts": "thoughts", "/thoughts/beijing": "beijing",
  "/thoughts/japan": "japan", "/thoughts/beijing/map": "map", "/thoughts/library": "library",
};

/** One breadcrumb bar for every route except the homepage. */
export function SiteHeader() {
  const pathname = usePathname();
  if (!pathname || pathname === "/") return null;
  const segments = pathname.split("/").filter(Boolean);
  const crumbs = [
    { href: "/", label: "home" },
    ...segments.map((segment, index) => {
      const href = `/${segments.slice(0, index + 1).join("/")}`;
      return { href, label: labels[href] || decodeURIComponent(segment).replaceAll("-", " ") };
    }),
  ];
  return <header className={styles.header}>
    <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
      {crumbs.map((crumb, index) => <span key={crumb.href}>
        {index > 0 && <span className={styles.separator} aria-hidden="true">/</span>}
        {index === crumbs.length - 1 ? <span aria-current="page">{crumb.label}</span> : <Link href={crumb.href}>{crumb.label}</Link>}
      </span>)}
    </nav>
  </header>;
}
