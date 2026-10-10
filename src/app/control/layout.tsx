import { ControlShell } from "@/components/control/Shell";
import "./control.css";

export const metadata = {
  title: "V3X Control",
  robots: { index: false, follow: false },
};

export default function ControlLayout({ children }: { children: React.ReactNode }) {
  return <ControlShell>{children}</ControlShell>;
}
