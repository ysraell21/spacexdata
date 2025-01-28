import React, { useState } from "react";
// const images = import.meta.glob('/src/assets/*.{png,jpg,jpeg}');

interface IProps {
  flight_number: number;
  mission_name: string;
  launch_year: string;
  launch_success: boolean;
  launch_site: Record<string, any>;
  details: any;
  links: Record<string, any>;
  index: number;
}
const Card: React.FC<IProps> = ({
  flight_number,
  mission_name,
  launch_year,
  launch_success,
  launch_site,
  details,
  links,
  index,
}) => {
  const [viewMoreState, setViewMoreState] = useState<{
    [key: number]: boolean;
  }>({});
  const handleViewMore = (index: number) => {
    setViewMoreState((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  // const imagePath = Object.keys(images).find((path) =>
  //   path.includes(mission_name.replace(/\s+/g, ""))
  // );

  return (
    <div className="bg-[rgb(14,36,67)] p-5 mb-5 border border-gray-600 rounded-lg shadow-sm">
      <div className="flex justify-between items-center ">
        <div className="font-extrabold text-xl  text-[rgb(198,165,120)] font-mono">
          {mission_name}
        </div>
        <span
          className={`${
            launch_success ? "bg-green-500" : "bg-red-500"
          } inline-flex items-center px-3 py-1 text-sm font-medium text-white rounded-full`}
        >
          {launch_success ? "Success" : "Failed"}
        </span>
      </div>
      <div className="mt-2 text-[rgb(198,165,120)] font-mono">
        <div>
          <span className="font-extrabold">Launch Year:</span> {launch_year}
        </div>
        <div>
          <span className="font-extrabold">Flight Number:</span> {flight_number}
        </div>
      </div>

      {viewMoreState[index] ? (
        <div className="mt-2 flex justify-between items-center">
          <div className="text-[rgb(198,165,120)] w-3/4 font-mono">
            <div>
              <span className="font-extrabold">Description: </span>
              {details || "No description available"}
            </div>
            <div>
              <span className="font-extrabold">Launch Site: </span>
              {launch_site.site_name_long || "No description available"}
            </div>
            <span className="font-extrabold">Watch a video: </span>
            <a
              href={links.video_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Click here
            </a>
          </div>
          <div className="w-1/4 pl-4">
            <img
              src={links.mission_patch_small}
              alt={mission_name}
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      ) : null}

      <div className="mt-4">
        <button
          onClick={() => handleViewMore(index)}
          className="px-4 py-2 bg-gray-500 hover:bg-gray-800 text-white rounded-lg border border-white"
        >
          {viewMoreState[index] ? "Show Less" : "View More"}
        </button>
      </div>
    </div>
  );
};

export default Card;
