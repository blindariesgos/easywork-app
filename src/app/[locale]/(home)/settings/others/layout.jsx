export const metadata = {
  title: "Easywork",
  description: "All in one",
};

export const revalidate = 3600;

export default async function HomeLayout({ children, params: { locale } }) {
  // const crmUsers = await getUsers();

  return (
    // <UserProvider users={null}>
    <div className="h-full relative">{children}</div>
    // </UserProvider>
  );
}
