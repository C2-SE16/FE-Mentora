export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {/* Có thể thêm header, navigation, footer chung cho group default ở đây */}
      <main>{children}</main>
    </div>
  );
}
