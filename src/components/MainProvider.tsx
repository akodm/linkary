export default function MainProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-col w-full h-full relative">{children}</main>
  );
}
