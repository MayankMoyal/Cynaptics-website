"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useRef } from "react";
import parse from "html-react-parser";

const ProjectCarousel = ({ projects = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);
  const itemsPerView = 4;

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? Math.max(0, projects.length - itemsPerView) : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev >= projects.length - itemsPerView ? 0 : prev + 1
    );
  };

  if (!projects || projects.length === 0) {
    return (
      <div className="text-center text-white py-20">
        No projects found. Please check Firebase projects data.
      </div>
    );
  }

  return (
    <div className="w-full py-16 px-4 lg:px-12 bg-white">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl lg:text-6xl font-bold text-black mb-4">
          Our Works
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Witness the beauty of innovation through our lens, as we showcase stunning projects that evoke wonder and showcase our technical excellence.
        </p>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={handlePrev}
          className="absolute left-0 lg:left-[-60px] top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-black text-white rounded-full w-12 h-12 flex items-center justify-center transition-all"
          aria-label="Previous projects"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Carousel */}
        <div
          ref={carouselRef}
          className="overflow-hidden px-8 lg:px-0"
        >
          <div
            className="flex gap-6 transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
            }}
          >
            {projects.map((project, index) => (
              <div
                key={project.id}
                className="flex-shrink-0 w-full lg:w-1/4"
              >
                <Link
                  href={`/ProjectsPage/${project.project_title} + ${project.id.toString()}`}
                  className="group relative h-80 rounded-3xl overflow-hidden block cursor-pointer"
                >
                  {/* Project Image */}
                  {project.display_image && (
                    <img
                      src={project.display_image}
                      alt={project.project_title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  )}

                  {/* Dark Overlay */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all duration-300" />

                  {/* Content Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">
                      {project.project_title}
                    </h3>
                    <p className="text-sm text-gray-200 mb-4 line-clamp-2">
                      {project.display_desc ||
                        project.description_1 ||
                        project.desc1 ||
                        ""}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-gray-700/80 rounded-full text-xs font-medium">
                        {project.category || "Design"}
                      </span>
                      <span className="px-3 py-1 bg-gray-700/80 rounded-full text-xs font-medium">
                        {project.tag || "Development"}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Right Arrow */}
        <button
          onClick={handleNext}
          className="absolute right-0 lg:right-[-60px] top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-black text-white rounded-full w-12 h-12 flex items-center justify-center transition-all"
          aria-label="Next projects"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-8">
        {Array.from({ length: Math.ceil(projects.length / itemsPerView) }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i * itemsPerView)}
            className={`w-3 h-3 rounded-full transition-all ${
              Math.floor(currentIndex / itemsPerView) === i
                ? "bg-black w-8"
                : "bg-gray-400"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          [class*="itemsPerView"] {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ProjectCarousel;