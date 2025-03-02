import DefaultLayout from "@/components/Layouts/DefaultLaout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DefaultLayout>
      {children}
    </DefaultLayout>
  );
}
