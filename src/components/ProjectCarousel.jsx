"use client";
import { Projects } from "@/app/ProjectsPage/Projects";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const ProjectCarousel = () => {
    return (
        <div className="min-h-screen px-5 py-10 md:px-20 text-white">
            <h1 className="text-center font-bold text-2xl md:text-5xl mb-16">Projects</h1>

            {Projects.length === 0 && (
                <p className="text-center text-gray-400">No projects yet. Check back soon!</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {Projects.map((project) => (
                    <Link
                        key={project.id}
                        href={`/ProjectsPage/${project.project_title} + ${project.id.toString()}`}
                    >
                        <div className="border border-gray-700 rounded-lg overflow-hidden hover:scale-[1.02] hover:border-cyan-400 transition-all cursor-pointer h-full flex flex-col">
                            <div className="relative w-full h-48 bg-gray-800">
                                {project.display_image ? (
                                    <Image
                                        src={project.display_image}
                                        alt={project.project_title}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                                        No image
                                    </div>
                                )}
                            </div>
                            <div className="p-4">
                                <h2 className="text-lg font-semibold">{project.project_title}</h2>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default ProjectCarousel;