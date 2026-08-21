import { Metadata } from "next";

export const metadata: Metadata = {
  title: "首页",
};

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}