import type { AppColor } from "~/types/ui";

export interface StatCardConfig {
  title: string;
  key: string;
  icon: string;
  iconColor: AppColor;
}

export const QUEUE_STATS_CONFIG: StatCardConfig[] = [
  { title: "Now Serving", key: "nowServing", icon: "i-lucide-volume-2", iconColor: "primary" },
  { title: "In Queue", key: "inQueue", icon: "i-lucide-users", iconColor: "amber" },
  { title: "Completed", key: "completed", icon: "i-lucide-check-circle", iconColor: "green" },
  { title: "Skipped", key: "skipped", icon: "i-lucide-alert-circle", iconColor: "red" },
];
