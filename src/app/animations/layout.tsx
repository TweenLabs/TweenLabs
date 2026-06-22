import { AppShellLayout } from "@/components/AppShellLayout";

export default function AnimationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShellLayout>{children}</AppShellLayout>;
}
