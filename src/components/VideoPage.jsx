import Link from "next/link";
import React from "react";
import Slide from "react-reveal/Slide";
export default function VideoPage() {
    return (
        <div className="  translate-y-[-130px] md:translate-y-0 py-10 md:py-auto overflow-x-hidden ">
            <Slide bottom>
                <h1 className="text-center font-bold  text-2xl md:text-5xl md:pb-16">
                    See What AI/ML Can Do
                </h1>
            </Slide>
            <div className="grid md:grid-cols-2  group m-10 md:my-10  relative shadow-[3px_3px_30px_3px] md:shadow-[0px_0px_0px_0px] shadow-blue-600">
                <Slide left>
                    <div className=" flex justify-center  shadow-[3px_3px_30px_3px] shadow-blue-600">
                        <video loop muted autoPlay className="">
                            <source
                                src="/videos/quick-draw.mp4"
                                type="video/mp4"
                            />
                        </video>
                    </div>
                </Slide>
                <Slide right>
                    <div className="items-center text-center mx-auto my-auto font-semibold md:text-xl  z-[100] md:relative md:bg-transparent bg-black text-white bg-opacity-80 text-wrap  group-hover:opacity-100 opacity-0 md:opacity-100  transition-all fade-in-out p-5 text-[9px] sm:text-sm md:text-md">
                        <div id="description of quick draw video">
                            {`
"Quick, Draw!" is a game developed by Google where players draw sketches based on prompts and see if a computer can recognize what they've drawn using machine learning. The game gets more difficult as players progress and is a fun way to improve drawing skills and learn about machine learning.`}
                        </div>
                        <Link
                            aria-label=""
                            href="https://quickdraw.withgoogle.com"
                            target={"_blank"}
                        >
                            <button className="mx-auto border-2 p-2 bg-white text-black my-3 rounded-md">
                                Quick Draw
                            </button>
                        </Link>
                    </div>
                </Slide>
            </div>
            <div className="grid md:grid-cols-2  group m-10 md:my-auto relative overflow-x-hidden shadow-[3px_3px_30px_3px] md:shadow-[0px_0px_0px_0px] shadow-blue-600">
                <Slide left>
                    <div className="items-center text-center mx-auto my-auto font-semibold md:text-xl  z-[100] md:relative md:bg-transparent bg-black text-white bg-opacity-80 text-wrap  group-hover:opacity-100 opacity-0 md:opacity-100  transition-all fade-in-out p-5 text-[9px] sm:text-sm md:text-md">
                        <div id="description of semantris video">
                            {`"Semantris" is a word association game by Google that uses machine learning to challenge players to come up with related words. There are two modes: "Arcade" and "Blocks". "Semantris" prompt could be "Animals." In "Arcade" mode, you might start typing words like "cat," "dog," "bird," and "elephant," and the game would suggest related words like "tiger," "puppy," "sparrow," and "mammoth" to help you score more points.
In "Blocks" mode, you might see a group of words like "lion," "tiger," "panther," and "leopard," and you would have to group them together based on the common theme of "big cats." , and the game determines the quality of the groupings using machine learning.`}
                        </div>

                        <Link
                            href="https://research.google.com/semantris"
                            target="_blank"
                        >
                            <button className="mx-auto border-2 p-2 bg-white text-black my-3 rounded-md">
                                Semantris
                            </button>
                        </Link>
                    </div>
                </Slide>
                <Slide right>
                    <div className="md:m-10 flex justify-center  shadow-[3px_3px_30px_3px] shadow-blue-600">
                        <video loop muted autoPlay className="">
                            <source
                                src="/videos/semantris.mp4"
                                type="video/mp4"
                            />
                        </video>
                    </div>
                </Slide>
            </div>
            <div className="grid md:grid-cols-2  group m-10 md:my-auto relative shadow-[3px_3px_30px_3px] md:shadow-[0px_0px_0px_0px] shadow-blue-600">
                <Slide left>
                    <div className="md:m-10 flex  justify-center md:shadow-[3px_3px_30px_3px] md:shadow-blue-600">
                        <video loop muted autoPlay className="">
                            <source
                                src="/videos/thisfacedoesnotexist.mp4"
                                type="video/mp4"
                            />
                        </video>
                    </div>
                </Slide>
                <Slide right>
                    <div className="items-center text-center mx-auto my-auto font-semibold md:text-xl  z-[100] md:relative md:bg-transparent bg-black text-white bg-opacity-80 text-wrap  group-hover:opacity-100 opacity-0 md:opacity-100  transition-all fade-in-out p-5 text-[9px] sm:text-sm md:text-md">
                        <div id="description of the face does not exists video">
                            {`"This Person Does Not Exist" is a website that generates images of fake human faces that look real. It does this using a computer program that learns how to create new faces by looking at lots of pictures of real faces. The result is a bunch of unique and realistic faces that don't belong to any real person.`}
                        </div>
                        <Link
                            href="https://this-person-does-not-exist.com/en"
                            target="_blank"
                        >
                            <button className="mx-auto border-2 p-2 bg-white text-black my-3 rounded-md">
                                This Person Does Not Exist
                            </button>
                        </Link>
                    </div>
                </Slide>
            </div>
            <div className="grid md:grid-cols-2  group m-10 md:my-auto relative shadow-[3px_3px_30px_3px] md:shadow-[0px_0px_0px_0px] shadow-blue-600">
                <Slide left>
                    <div
                        id="card_text"
                        className=" items-center text-center mx-auto my-auto font-semibold md:text-xl  z-[100] md:relative md:bg-transparent bg-black text-white bg-opacity-80 text-wrap  group-hover:opacity-100 opacity-0 md:opacity-100  transition-all fade-in-out p-5 text-[9px] sm:text-sm md:text-md"
                    >
                        <div id="description of the pix2pix  video">
                            {`Pix2pix is a computer program that learns how to turn sketches into realistic images by looking at many examples of paired sketches and their corresponding realistic images. It does this by using a "generator" and a "discriminator" that work together to produce high-quality results. Once it's trained, it can be used to create realistic images from sketches that it hasn't seen before.`}
                        </div>
                        <Link
                            href="https://affinelayer.com/pixsrv/"
                            target="_blank"
                        >
                            <button className="mx-auto border-2 p-2 bg-white text-black my-3 rounded-md">
                                Pix2Pix
                            </button>
                        </Link>
                    </div>
                </Slide>
                <Slide right>
                    <div
                        id="card_video"
                        className="md:m-10  flex justify-center  z-[-1] shadow-[3px_3px_30px_3px] shadow-blue-600"
                    >
                        <video loop muted autoPlay className="">
                            <source
                                type="video/mp4"
                                src="/videos/pix2pix.mp4"
                            />
                        </video>
                    </div>
                </Slide>
            </div>
        </div>
    );
}
