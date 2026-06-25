"use client";
import dynamic from "next/dynamic";
import VideoPage from "@/components/VideoPage";
import TextAnimation from "@/components/TextAnimation";

const Model = dynamic(() => import("@/components/Model"), {
  ssr: false,
  loading: () => <div className="absolute h-full w-full z-[-100] bg-black" />,
});

export default function Home() {
    return (
        <div className="overflow-x-hidden">
            <div className="bg-black bg-opacity-30 ">
                <div className="absolute h-full w-full z-[-100]">
                    <Model />
                </div>
                <div className=" text-center items-center z-[100] my-auto h-screen relative ">
                    <div className=" absolute w-full h-fit top-[35%] md:top-[25%]   z-[10000]  ">
                        <div className="text-[50px] m-0 p-0 font-extrabold">
                            <TextAnimation text="IIT INDORE" />
                        </div>
                        <div className="text-[100px] m-0 p-0 font-extrabold">
                            <TextAnimation text="The Cynaptics Club" />
                        </div>
                        <div className="text-[50px]  m-0 p-0 font-extrabold">
                            <TextAnimation text="AI TAKES OVER" />
                        </div>
                    </div>
                </div>
                <div className="!overflow-x-hidden ">
                    <VideoPage />
                </div>
            </div>
        </div>
    );
}
