import styles from "./post-header.module.css";

const formatter = new Intl.DateTimeFormat("en-US", {
  month: "short", day: "numeric", year: "numeric", timeZone: "UTC",
});

export function PostDate({ date }: { date?: string }) {
  if (!date) return null;
  return <time className={styles.date} dateTime={date}>
    {formatter.format(new Date(`${date}T00:00:00Z`))}
  </time>;
}
