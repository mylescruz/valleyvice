import Footer from "./footer";
import Header from "./header";

export default function Layout({ children }) {
  return (
    <div className="flex flex-col">
      <Header />
      <main className="m-0 flex-1">{children}</main>
      <Footer />
    </div>
  );
}
