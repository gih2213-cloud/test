import "./globals.css";

export const metadata = {
  title: "바이브 AI 교육 신청",
  description: "바이브 AI 교육 과정 신청 접수 시스템",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
