import { SessionProvider } from "next-auth/react";

export default function GoogleLayout({ children }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}
