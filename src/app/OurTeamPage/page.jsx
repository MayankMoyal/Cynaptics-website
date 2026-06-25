import Head from "next/head";
import Card from "../../components/Card";
import React from "react";
// ISOLATION: Commented out the members import
import { getMembers } from "src/memberService/memberService.ts";
import { getAlumni } from "src/memberService/alumniService.ts";


export const metadata = {
  title: "Our Team",
};

export default async function OurTeamPage() {
  // ISOLATION: Commented out the members fetch. 
  // const members = (await getMembers()) || [];
  const alumni = (await getAlumni()) || [];
  const members = (await getMembers()) || [];
  console.log("Alumni data fetched:", alumni); // Debugging log
  console.log("Members data fetched:", members); // Debugging log

  return (
    <div id="">
      <h1 className="text-center py-20 text-3xl md:text-5xl font-bold z-[10000]">
        Our Team Members
      </h1>
      <div className="mx-auto !h-fit ">
        {members.length > 0 && (
          <Card
            className="!my-0 !ring-orange-500 !ring-opacity-80 mx-auto !ring-[10px] rounded-xl"
            ele={members[0]}
            index={members[0].id}
          />
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3">
        {members
          .filter((_, i) => i !== 0) // skip the first member already rendered above
          .map((ele) => {
            return (
              <React.Fragment key={ele.id}>
                {ele.position !== "Club Head" && (
                  <div>
                    <Card
                      className={`${
                        ele.position.includes("Head") &&
                        "!ring-[10px] !ring-purple-500 !ring-opacity-70"
                      } ${
                        ele.position.includes("Member") &&
                        "!ring-[10px] !ring-blue-500 !ring-opacity-70"
                      }`}
                      ele={ele}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
      </div>

      <h1 className="text-center py-20 text-3xl md:text-5xl font-bold z-[10000]">
        Our Alumni
      </h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3">
        {alumni.length > 0 ? (
          alumni.map((ele) => {
            return (
              <React.Fragment key={ele.id}>
                <div>
                  <Card
                    className="!ring-[10px] !ring-rose-600 !ring-opacity-70"
                    ele={ele}
                  />
                </div>
              </React.Fragment>
            );
          })
        ) : (
          <p className="text-center col-span-full text-gray-400 mt-5">
            No alumni data found yet. Please check your Firebase database.
          </p>
        )}
      </div>
    </div>
  );
}