import { Inter } from "next/font/google";
import "./globals.css";
import CrmContextProvider from "../../context/crm/provider";
import ToolContextProvider from "../../context/tools/provider";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import initTranslations from "../i18n";
import { AlertContextProvider } from "../../context/common/AlertContext";
import TranslationsProvider from "../../components/Providers/TranslationsProvider";
import "moment/locale/es";
import moment from "moment";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Easywork",
  description: "Easy work, easy life",
};

const i18nNamespaces = [
  "contacts",
  "common",
  "tools",
  "auth",
  "leads",
  "users",
  "control",
  "operations",
  "import",
  "agentsmanagement",
];
export default async function RootLayout({ children, params: { locale } }) {
  const { resources } = await initTranslations(locale, i18nNamespaces);
  moment.locale(locale ?? "es");
  return (
    <html lang={locale} className="h-full">
      <body className={inter.className}>
        <TranslationsProvider
          namespaces={i18nNamespaces}
          locale={locale}
          resources={resources}
        >
          <AlertContextProvider>
            <CrmContextProvider>
              <ToolContextProvider>
                <ToastContainer style={{ zIndex: 200000 }} />
                {children}
              </ToolContextProvider>
            </CrmContextProvider>
          </AlertContextProvider>
        </TranslationsProvider>
      </body>
    </html>
  );
}
