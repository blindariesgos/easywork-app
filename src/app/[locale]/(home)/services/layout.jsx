
export const metadata = {
  title: "Easywork",
  description: "All in one",
};

export default function Layout({ children }) {
  return (
    <div className="p-2 rounded-xl h-full">
      {children}
    </div>
  );
}