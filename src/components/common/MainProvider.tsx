export default function MainProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="flex flex-col w-full min-h-full">{children}</main>;
}
