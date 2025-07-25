import { InfoProvider } from "@/contexts/InfoContext";
import Footer from "./footer";
import Header from "./header";

export default function Layout({ children }) {
  return (
    <InfoProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="m-0 flex-1">{children}</main>
        <Footer />
      </div>
    </InfoProvider>
  );
}
