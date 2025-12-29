import './globals.css'

export const metadata = {
  title: 'LOGOS - The Bible for Classical Studies',
  description: 'Advanced digital humanities platform for classical texts',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-[#0D0D0F] text-[#F5F3EF]">{children}</body>
    </html>
  )
}
