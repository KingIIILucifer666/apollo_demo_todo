import "@/styles/globals.css";
import NhostApolloClientProvider from "@/context/NhostApolloClientProvider";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Apollo Demo",
  description: "Use Apollo Client to manipulate data",
  icons: "/public/icons/favicon.ico",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Toaster position="top-center" />
        <NhostApolloClientProvider>{children}</NhostApolloClientProvider>
      </body>
    </html>
  );
}
