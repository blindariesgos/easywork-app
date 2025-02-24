export default async function HomeLayout({ children, params: { locale } }) {
  return <div className="h-full relative">{children}</div>;
}
