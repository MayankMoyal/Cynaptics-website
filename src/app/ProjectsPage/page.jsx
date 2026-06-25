import React from "react";
import ProjectCarousel from "@/components/ProjectCarousel";
import { getProjects } from "@/memberService/projectService";

export const metadata = {
  title: "Our Projects",
};

export default async function page() {
  const projects = await getProjects();

  return (
    <div>
      <ProjectCarousel projects={projects} />
    </div>
  );
}