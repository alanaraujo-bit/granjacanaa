export default function AuthLayout({ children }: LayoutProps<"/">) {
  return <div className="app-frame flex min-h-dvh flex-col">{children}</div>;
}
