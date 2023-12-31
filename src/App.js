import './App.css';
import { useState } from 'react';
import axios from 'axios';

function App() {
  const [title, setTitle] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [titleDetails, setTitleDetails] = useState(null);
  const [streamingInfo, setStreamingInfo] = useState(null);

  const handleSearch = async () => {
    try {
      const response = await axios.get('https://ott-details.p.rapidapi.com/search', {
        params: {
          title: title,
          page: '1',
        },
        headers: {
          'X-RapidAPI-Key': 'a5beeedc25mshbcd7fcc62e2509cp15b4e6jsnf16e4eb52c60',
          'X-RapidAPI-Host': 'ott-details.p.rapidapi.com',
        },
      });

      setSearchResults(response.data.results);
    } catch (error) {
      console.error(error);
    }
  };

  const getTitleDetails = async (imdbId) => {
    try {
      const response = await axios.get('https://ott-details.p.rapidapi.com/gettitleDetails', {
        params: {
          imdbid: imdbId,
        },
        headers: {
          'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY,
          'X-RapidAPI-Host': 'ott-details.p.rapidapi.com',
        },
      });

      setTitleDetails(response.data);

      // Assuming streaming information is available in response.data.streamingInfo
      setStreamingInfo(response.data.streamingAvailability.country.US);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col md:px-12 px-0 relative bg-background font-poppins items-center min-h-screen">
      <h1 className="text-6xl font-bold text-primary mt-20">
        <span className="text-active">Streaming</span> Availability
      </h1>
      <h2 className="text-primary text-2xl font-light mt-6 font-ebas">
        Get Streaming details of Movie and TV Shows from 150+ Streaming platforms
      </h2>
      <form
        className="sm:mx-auto mt-20 justify-center sm:w-full sm:flex"
        onSubmit={(e) => {
          handleSearch();
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <input
          type="text"
          className="flex w-full sm:w-1/3 rounded-lg px-5 py-3 text-base text-background font-semibold focus:outline-none focus:ring-2 focus:ring-active"
          placeholder="Enter a movie/show title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setSearchResults(null);
          }}
        />
        <div className="mt-4 sm:mt-0 sm:ml-3">
          <button
            className="block w-full rounded-lg px-5 py-3 bg-active text-base text-primary font-bold focus:outline-none focus:ring-2 focus:ring-primary sm:px-10"
            type="submit"
          >
            Search
          </button>
        </div>
      </form>
      {searchResults && (
        <div className="mt-10">
          <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {searchResults
              .filter((result) => result.imageurl && result.imageurl[0])
              .map((result) => (
                <div key={result.title} className="pt-6">
                  <div className="flow-root bg-light rounded-lg px-4 pb-8">
                    <div className="-mt-6">
                      <div className="flex items-center justify-center">
                        <span className="p-2">
                          {result.imageurl && result.imageurl[0] && (
                            <img
                              src={result.imageurl[0]}
                              className="w-full h-full rounded-lg"
                              alt={result.title}
                            />
                          )}
                        </span>
                      </div>
                      <div className="text-center justify-center items-center">
                        <h3 className="mt-4 text-lg font-bold w-full break-words overflow-x-auto text-primary tracking-tight">
                          {result.title}
                        </h3>
                        <span className="mt-2 text-sm text-secondary block">
                          {result.released} - {result.genre[0]}
                        </span>
                        <p className="mt-4 text-sm leading-relaxed text-secondary block">
                          {result.synopsis}
                        </p>
                        {titleDetails?.imdbid === result.imdbid ? (
                          // Show streaming information if this is the selected title
                          <span className="mt-4 block max-w-2xl text-primary">
                            {streamingInfo ? (
                              <>
                                Available on:
                                <span className="flex mt-2 text-base gap-2 justify-center">
                                  {streamingInfo.map((item) => (
                                    <a
                                      href={item.url}
                                      className="text-active underline"
                                    >
                                      {item.platform}
                                    </a>
                                  ))}
                                </span>
                              </>
                            ) : (
                              <>Not available on any service.</>
                            )}
                          </span>
                        ) : (
                          // Otherwise, show the button
                          <button
                            className="mt-5 text-md text-active"
                            onClick={() => getTitleDetails(result.imdbid)}
                          >
                            Streaming Details &darr;
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
