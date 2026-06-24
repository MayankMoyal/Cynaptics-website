/* eslint-disable @next/next/no-page-custom-font */
import "./globals.css";
import { Roboto_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const robotoMono = Roboto_Mono({ subsets: ["latin"], display: "swap" });

export const metadata = {
    title: {
        default: "The Cynaptics Club - IIT Indore",
        template: "Cynaptics | %s",
    },
    description: "The Cynaptics Club(AI/ML) - IIT INDORE",
    keywords: [
        "Next.js",
        "React",
        "Javascript",
        "Artificial Intelligence",
        "Machine Learning",
        "Indian Institute of Technology Indore",
        "IIT INDORE",
        "The Cynaptics Club",
    ],
};



export default function RootLayout({ children }) {
    return (
        <html lang="en" className={robotoMono.className}>
            <head>
                <meta
                    property="twitter:image"
                    content={`https://avatars.githubusercontent.com/u/62688806?s=200&v=4`}
                />
                <meta
                    property="twitter:title"
                    content="The Cynaptics Club - IIT Indore"
                />
                <meta
                    property="og:title"
                    content="The Cynaptics Club - IIT Indore"
                />
                <meta
                    property="twitter:description"
                    content="The Cynaptics Club(AI/ML) - IIT INDORE"
                />
                <meta
                    property="og:description"
                    content="The Cynaptics Club(AI/ML) - IIT INDORE"
                />
                <meta
                    property="og:image"
                    content={`https://avatars.githubusercontent.com/u/62688806?s=200&v=4`}
                />
                <meta property="og:image:type" content="jpg" />
                <meta property="og:url" content={process.env.SITE_URL} />
            </head>
            <body className={`!z-[1000] !bg-black  `}>
                
                <Navbar />
                <div className="z-[1000] ">{children}</div>
                <Footer />
            </body>
        </html>
    );
}
