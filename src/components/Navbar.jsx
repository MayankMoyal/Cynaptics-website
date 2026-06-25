"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../public/images/Logos/Logo.jpg";
import { usePathname } from "next/navigation";
import { HiBarsArrowDown, HiBarsArrowUp } from "react-icons/hi2";
import Modal from "react-modal";
import OffCanvasNavbar from "./OffCanvasNavbar";
import { useEffect, useRef, useState } from "react";
import useWindowSize from "@rooks/use-window-size";
import Bounce from "react-reveal/Bounce";
import GlitchText from "@/components/GlitchText";
import GlitchButton from "@/components/GlitchButton";
export default function Navbar() {
    const { innerWidth } = useWindowSize();
    const customStyles = {
        overlay: {
            position: "fixed",
            zIndex: 1020,
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0, 0, 0, 0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
        content: {
            top: "50%",
            left: "50%",
            height: "fit-content",
            transform: "translate(-50%, -50%)",
            background: "transparent",
            overflow: "hidden",
            border: "0px",
        },
    };
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const pathname = usePathname();
    const ref = useRef(null);
    const [scrollbarWidth, setScrollbarWidth] = useState(0);


    useEffect(() => {
        if (pathname !== "/PongGamePage" && window.innerWidth > 1000) {
            setTimeout(() => {
                setIsOpen(true);
            }, 1000 * 60);
        }

        const handleClicKOutsideOffcanvas = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                document.querySelector("#offcanvas")?.classList.remove("smenu");
            }
        };
        document.addEventListener("click", handleClicKOutsideOffcanvas, true);
        return () => {
            document.removeEventListener(
                "click",
                handleClicKOutsideOffcanvas,
                true
            );
        };
    }, []);

    const OpenOffCanvas = () => {
        if (document.getElementById("offcanvas").offsetLeft === -1000) {
            document.querySelector("#offcanvas").classList.add("smenu");
        } else {
            document.querySelector("#offcanvas").classList.remove("smenu");
        }
    };
    useEffect(() => {
        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
            const windowHeight = window.innerHeight;

            // Calculate the scrollable height
            const scrollableHeight = scrollHeight - clientHeight;
            // Calculate the scroll position as a percentage
            const scrollPercentage = (scrollTop / scrollableHeight) * 100;
            
            // Calculate the width of the scrollbar based on the scroll percentage
            const scrollbarWidth = (scrollPercentage * document.documentElement.clientWidth) / 100;

            // Update the scrollbar width state
            setScrollbarWidth(scrollbarWidth);
        };

        // Add the scroll event listener
        window.addEventListener("scroll", handleScroll);

        // Clean up the event listener on unmount
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div>
            <div
                className="scrollbar"
                style={{ width: `${scrollbarWidth}px`}}
            ></div>
            <div
                className={`${pathname === "/PongGamePage"
                    ? "opacity-20 hover:opacity-100 transition-all !z-[10000] fade-in-out"
                    : "block z-[10000]"
                    } z-[10000]`}
            >
                <div
                    id="Navbar_body"
                    className="flex shadow-[3px_3px_30px_3px] rounded-b-md shadow-blue-600 justify-between p-2 bg-black w-screen !z-[100000]"
                >
                    <div className="ml-2">
                        <Image
                            className="rounded-md"
                            src={Logo}
                            alt="Loading"
                            width="70"
                            height="70"
                        />
                    </div>
                    <div className="w-full items-center justify-center hidden lg:flex">
                        <ul className="w-fit flex justify-center  my-auto items-center">
                            <li
                                className={`mx-10 ${pathname === "/"
                                    ? "border-2 -skew-x-12 bg-gray-200 text-black font-semibold"
                                    : "hover:border-t-2 border-gray-200  transition-all fade-in-out "
                                    }  p-2  max-w-[150px] text-center transition-all fade-in-out`}
                            >
                                <Link href="/">Home</Link>
                            </li>
                            <li
                                className={`mx-10 ${pathname === "/ProjectsPage"
                                    ? "border-2 -skew-x-12 bg-gray-200 text-black font-semibold"
                                    : "hover:border-t-2 border-gray-200  transition-all fade-in-out "
                                    }  p-2  max-w-[150px] text-center transition-all fade-in-out`}
                            >
                                <Link href="/ProjectsPage">Projects</Link>
                            </li>
                            <li
                                className={`mx-10 ${pathname === "/EventsPage"
                                    ? "border-2 -skew-x-12 bg-gray-200 text-black font-semibold"
                                    : "hover:border-t-2 border-gray-200  transition-all fade-in-out "
                                    }  p-2  max-w-[150px] text-center transition-all fade-in-out`}
                            >
                                <Link href="/EventsPage">Events</Link>
                            </li>
                            <li
                                className={`mx-10 ${pathname === "/OurTeamPage"
                                    ? "border-2 -skew-x-12 bg-gray-200 text-black font-semibold"
                                    : "hover:border-t-2 border-gray-200  transition-all fade-in-out "
                                    }  p-2  max-w-[150px] text-center transition-all fade-in-out`}
                            >
                                <Link href="/OurTeamPage">Our Team</Link>
                            </li>
                            <li
                                className={`mx-10 ${pathname === "/Achievements"
                                    ? "border-2 -skew-x-12 bg-gray-200 text-black font-semibold"
                                    : "hover:border-t-2 border-gray-200  transition-all fade-in-out "
                                    }  p-2  max-w-[150px] text-center transition-all fade-in-out`}
                            >
                                <Link href="/Achievements">Achievements</Link>
                            </li>
                            <li
                                className={`mx-10 ${pathname === "/BlogPage"
                                    ? "border-2 -skew-x-12 bg-gray-200 text-black font-semibold"
                                    : "hover:border-t-2 border-gray-200  transition-all fade-in-out "
                                    }  p-2  max-w-[150px] text-center transition-all fade-in-out`}
                            >
                                <Link href="/BlogPage">Blogs</Link>
                            </li>
                            <li
                                className={`mx-10 ${pathname === "/AboutUsPage"
                                    ? "border-2 -skew-x-12 bg-gray-200 text-black font-semibold"
                                    : "hover:border-t-2 border-gray-200  transition-all fade-in-out "
                                    }  p-2  max-w-[150px] text-center transition-all fade-in-out`}
                            >
                                <Link href="/AboutUsPage">About Us</Link>
                            </li>
                        </ul>
                    </div>
                    <button
                        onClick={OpenOffCanvas}
                        id="offcanvasbtn"
                        className="my-auto lg:hidden"
                    >
                        <HiBarsArrowDown className="my-auto mx-auto w-9 h-9 mr-2" />
                    </button>
                </div>
                <div className="hidden lg:block">
                    <Bounce>
                        <Modal
                            closeTimeoutMS={500}
                            isOpen={modalIsOpen}
                            onRequestClose={() => {
                                setIsOpen(false);
                            }}
                            style={customStyles}
                        >
                            <div className="w-full flex justify-center text-center">
                                <GlitchText
                                    text={"Need... zzz... Assistance... zzz..."}
                                />
                            </div>
                            <div className="flex flex-col md:flex-row mx-auto w-full  justify-center my-5">
                                <Link
                                    href="/PongGamePage"
                                    onClick={() => {
                                        setIsOpen(false);
                                    }}
                                >
                                    <GlitchButton
                                        setIsOpen={setIsOpen}
                                        className="md:mx-5  p-2 max-w-[150px] mx-auto my-5 md:my-auto"
                                        text="Investigate"
                                    />
                                </Link>
                                <div
                                    onClick={() => {
                                        setIsOpen(false);
                                    }}
                                >
                                    <GlitchButton
                                        setIsOpen={setIsOpen}
                                        className={
                                            "md:mx-5  p-2 max-w-[150px] mx-auto my-5 md:my-auto"
                                        }
                                        text="Ignore"
                                    />
                                </div>
                            </div>
                        </Modal>
                    </Bounce>
                </div>
                <div ref={ref} className="lg:hidden overflow-hidden text-white">
                    <OffCanvasNavbar />
                </div>
            </div>
            <style jsx>
                {`
                     .scrollbar {
                        position: fixed;
                        top: 0;
                        left: 0;
                        height: 5px;
                        width: ${scrollbarWidth}px;
                        background-color: #00ffae;
                        z-index: 10000;
                        transition: width 0.3s ease;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                        border-radius: 2px;
                        opacity: 0.8;
                      }
                    
                      .scrollbar:before {
                        content: "";
                        position: absolute;
                        top: -4px;
                        left: 0;
                        width: 100%;
                        height: 4px;
                        background: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0));
                      }
                    
                      .scrollbar:hover {
                        opacity: 1;
                      }
}
                `}
            </style>
        </div>
    );
}