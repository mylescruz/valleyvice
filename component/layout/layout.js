export default function Layout({ children }) {
  return (
    <div className="flex flex-col">
      <main className="m-0 flex-1">{children}</main>
    </div>
  );
}
