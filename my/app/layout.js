 


 
import { Geist, Geist_Mono } from "next/font/google";
import "../app/globals.css"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
}); 


export const metadata = {
  title: "Password Generator",
  description: "Voice-based AI Interview powered by Interview Now",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        
          {children}
         
      </body>
    </html>
  );
}
 

 