import { useEffect, useState } from "react";
import Loading from "./Loading";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import Card from "./Card";
import bgImage from "./assets/SpaceX-Makes-History-with-Polaris-Dawn.png";

interface Launch {
  flight_number: number;
  mission_name: string;
  launch_year: string;
  launch_success: boolean;
  launch_site: Record<string, any>;
  details: any;
  links: Record<string, any>;
}

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [page, setPage] = useState(1);
  const limit = 20;

  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const totalLaunchesResponse = await axios.get(
          `https://api.spacexdata.com/v3/launches`
        );
        const totalLaunchesCount = totalLaunchesResponse.data.length;

        const offset = (page - 1) * limit;

        const response = await axios.get(
          `https://api.spacexdata.com/v3/launches?limit=${limit}&offset=${offset}`
        );

        if (offset + response.data.length >= totalLaunchesCount) {
          setHasMore(false);
        }

        setLaunches((prev) => {
          const updatedLaunches = [...prev, ...response.data];
          return Array.from(
            new Map(
              updatedLaunches.map((item) => [item.flight_number, item])
            ).values()
          );
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [page]);

  const loadMoreData = () => {
    if (hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const filteredLaunches = launches.filter((launch) =>
    launch.mission_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="bg-[rgb(14,36,67)] fixed top-0 left-0 right-0 z-50 p-4 shadow-md">
            <div className="w-full max-w-lg items-center justify-center flex mx-auto text-white font-bold">
              <input
                type="text"
                placeholder="Search by mission name"
                className="w-full px-4 py-2 border border-white rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div
            style={{
              backgroundImage: `url(${bgImage})`,
              backgroundSize: "cover",
              backgroundAttachment: "fixed",
            }}
            className="flex justify-center items-center min-h-screen bg-gray-100 p-4 mt-16"
          >
            <div className="w-full max-w-lg">
              <InfiniteScroll
                dataLength={filteredLaunches.length}
                next={loadMoreData}
                hasMore={hasMore}
                loader={<Loading />}
                endMessage={
                  <p className="text-center text-lg italic  text-black font-extrabold">
                    ** No more launches to load **
                  </p>
                }
              >
                {filteredLaunches.map((launch: Launch, index: number) => (
                  <Card
                    key={launch.flight_number}
                    flight_number={launch.flight_number}
                    mission_name={launch.mission_name}
                    launch_year={launch.launch_year}
                    launch_success={launch.launch_success}
                    launch_site={launch.launch_site}
                    details={launch.details}
                    links={launch.links}
                    index={index}
                  />
                ))}
              </InfiniteScroll>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default App;
