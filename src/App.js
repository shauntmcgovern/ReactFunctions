import "./styles.css";
//First run the terminal command of 'npm install' to install the necessary NPM's and then inside the terminal bash
//run the 'npm start' command and it will display across the port of 'http://localhost:3000' this ReactAppProject 
//using Github'Codespaces while updating this index/app/html/styles codebase
import React, { useState, useEffect, Fragment, useMemo } from "react";
//React's internal engine creates the function mechanism when useState() runs.

import Text from "react-text";
import { DictionaryProvider as BaseProvider } from "@codedazur/react-dictionary";

const mentionsXi = (item) => /\bxi\b/i.test(`${item.title} ${item.description || ""}`);
const getRssSummary = (description = "") =>
  String(description)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

function App() {
  // React state to store JSON data
  // This is where the decleration of variables, used and to be used, has been written in code
  const [data, setData] = useState([]);//data is a defining variable and is part of the JSON returning methods and here it is declared with React'State()
  const [weather, setWeather] = useState(null);
  const [dailyForecast, setDailyForecast] = useState(null);
  const [weatherError, setWeatherError] = useState("");
  const [weatherLoading, setWeatherLoading] = useState(true);
  
  const [patient, setPatient] = useState(null);
  //Here is the setGithubProfile method declared within the useState function when you imported React then the 'hooks' of useState became available
  const [githubProfile, setGithubProfile] = useState(null);
  //
  const [githubRepositories, setGithubRepositories] = useState([]);
  const [githubError, setGithubError] = useState("");
  const [githubLoading, setGithubLoading] = useState(true);
  const [rssItems, setRssItems] = useState([]);
  const [rssError, setRssError] = useState("");
  const [rssLoading, setRssLoading] = useState(true);
  const rssTickerKey = useMemo(
    () =>
      rssItems
        .slice(0, 8)
        .map((item) => item.guid || item.link || item.title)
        .join("|"),
    [rssItems]
  );
  const [repositoryExample, setRepositoryExample] = useState(null);
  const [repositoryExampleError, setRepositoryExampleError] = useState("");
  const [repositoryExampleLoading, setRepositoryExampleLoading] = useState(true);
  const [namespaceExample, setNamespaceExample] = useState(null);
  const [namespaceExampleError, setNamespaceExampleError] = useState("");
  const [namespaceExampleLoading, setNamespaceExampleLoading] = useState(true);
  // That is where the decleration of variables, for they will be used and have been written in code
	
  useEffect(() => {
    const controller = new AbortController();
	{/*And this happens when the program is executed it sends a fetch call to MicrosoftGithub, with an async command*/}
    const fetchGithubProfile = async () => {
      try {
		{/*try is a form of statement from the codebase to the communication between github and this App.js file it now declares the headers variable here*/}
		const headers = {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        };
		{/*Inside of this command JavaScript coding languauge is setting the Array through a given await Promise.all() method, given the url address of shauntmcgovern
		it then will set the headers variable which you need inside the fetch method along with the signal and the signal has been declared as a new class and that is object
		of an if mistake, AbortController(), the Promise.all then has another fetch method passed on through the method itself making that two arguments. The difference here is
		the first resting api is an overall updated profile information and the next resting api is the recent updates to the repositories and recent GithubUserActivity*/}
		const [profileResponse, repositoriesResponse] = await Promise.all([
          fetch("https://api.github.com/users/shauntmcgovern", {
            headers,
            signal: controller.signal,
          }),
          fetch("https://api.github.com/users/shauntmcgovern/repos?type=owner&sort=updated&per_page=5", {
            headers,
            signal: controller.signal,
          }),
        ]);
		{/*This is for if any errors occur during the data receive of the GithubAPI*/}
        if (!profileResponse.ok) {
          throw new Error(`GitHub profile request failed (${profileResponse.status})`);
        }
        if (!repositoriesResponse.ok) {
          throw new Error(`GitHub repositories request failed (${repositoriesResponse.status})`);
        }
		{/*This again sets the arrary with the Promise.all method and what it returns with these arguments injected was the complete GithubProfile in a json and declares it as
		profile and the GithubRepositories json and sets that to the const repositories variable*/}
        const [profile, repositories] = await Promise.all([
          profileResponse.json(),
          repositoriesResponse.json(),
        ]);
		{/*It will throw an Error if the GithubUserProfile does not have any repositories to speak of*/}
        if (!Array.isArray(repositories)) {
          throw new Error("GitHub response did not include a repository list");
        }
		{/*Then in the very same try-statement you have these two methods which are setGithubProfile and setGithubRepositories these methods are given so the coder may use them here and 
		profile and the repositories variables are passed into them as the set arguements*/}
        setGithubProfile(profile);
		{/*First, you pull the useState hook out of the React library so your file can use React's built-in memory system, Inside your component function, you call useState([]).
		Passing [] (an empty array) tells React: "Start this piece of memory off as an empty list." useState([]) runs and returns a 2-item array: [ [], function() {...} ]
		setGithubRepositories: Holds the internal React function created specifically to update githubRepositories, the variable named 'repositories' containing your list of repos.
		You pass it as an argument into setGithubRepositories()*/}
        setGithubRepositories(repositories);
      } catch (error) {
	        if (error.name !== "AbortError") {
	          setGithubError(error.message);
	        }
		} finally {
		        if (!controller.signal.aborted) {
		          setGithubLoading(false);
		        }
	    }
	  {/*That will conclude the try loop which fetched the necessary jsons to work with in our App.js file with the JavaScript coding'language and now usually to true computer science
	  form with every try statement, as it used if loops as well inside of it, you conclude the try statement with a catch control-flow block and this is used if there is Errors reported or is happening in real time
	  for instance it could and what this is is a precaution. Usually the try loop and json fetches always truly complete once again only in precaution*/}
    };

    fetchGithubProfile();
    return () => controller.abort();
  }, []);

  //Now I have weather method call abilities for example weather.apparent_temperature
  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({
      latitude: "41.8781",
      longitude: "-87.6298",
      current: "temperature_2m,apparent_temperature",
      daily: "temperature_2m_max,temperature_2m_min,precipitation_probability_max",
      forecast_days: "7",
      temperature_unit: "fahrenheit",
      timezone: "America/Chicago",
    });

    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?${params.toString()}`,
          { signal: controller.signal }
        );
        if (!response.ok) {
          throw new Error(`Weather request failed (${response.status})`);
        }

        const result = await response.json();
        if (!result.current || !Array.isArray(result.daily?.time)) {
          throw new Error("Weather response did not include current conditions and daily forecast");
        }
        setWeather(result.current);
        setDailyForecast(result.daily);
      } catch (error) {
        if (error.name !== "AbortError") {
          setWeatherError(error.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setWeatherLoading(false);
        }
      }
    };

    fetchWeather();
    return () => controller.abort();
  }, []);
  //The Copilot{'} CBS'{NEWS/:'}RSSFEED"-'Effect PullFetch(')
  useEffect(() => {
    const controller = new AbortController();
    const feedUrl = "https://www.cbsnews.com/latest/rss/main";
    const refreshInterval = 30_000;
    let refreshIntervalId;

    const fetchRssFeed = async () => {
      try {
        const response = await fetch(
          `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`,
          { signal: controller.signal }
        );
        if (!response.ok) {
          throw new Error(`CBS News feed request failed (${response.status})`);
        }

        const result = await response.json();
        if (result.status !== "ok" || !Array.isArray(result.items)) {
          throw new Error(result.message || "CBS News feed response was invalid");
        }
        setRssItems(result.items);
        setRssError("");
      } catch (error) {
        if (error.name !== "AbortError") {
          setRssError(error.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setRssLoading(false);
        }
      }
    };

    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") {
        fetchRssFeed();
      }
    };

    fetchRssFeed();
    refreshIntervalId = window.setInterval(fetchRssFeed, refreshInterval);
    document.addEventListener("visibilitychange", refreshWhenVisible);
    window.addEventListener("focus", refreshWhenVisible);

    return () => {
      controller.abort();
      window.clearInterval(refreshIntervalId);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
      window.removeEventListener("focus", refreshWhenVisible);
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const fetchNamespaceExample = async () => {
      try {
        const response = await fetch("/api/github/nineteen-namespace-example", {
          signal: controller.signal,
        });
        const contentType = response.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          throw new Error(
            `GitHub file endpoint returned ${contentType || "non-JSON content"} instead of JSON. In development, restart npm start so src/setupProxy.js is loaded.`
          );
        }
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || `GitHub file request failed (${response.status})`);
        }
        if (
          !result ||
          typeof result !== "object" ||
          Array.isArray(result) ||
          !result.file ||
          typeof result.file !== "object" ||
          Array.isArray(result.file) ||
          typeof result.file.path !== "string" ||
          typeof result.file.html_url !== "string" ||
          !Number.isInteger(result.file.size) ||
          !Number.isInteger(result.file.lineCount) ||
          typeof result.file.preview !== "string"
        ) {
          throw new Error("GitHub response did not include the requested text file preview.");
        }
        setNamespaceExample(result);
      } catch (error) {
        if (error.name !== "AbortError") {
          setNamespaceExampleError(error.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setNamespaceExampleLoading(false);
        }
      }
    };

    fetchNamespaceExample();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const fetchRepositoryExample = async () => {
      try {
        const response = await fetch("/api/github/emoji-heaven-example", {
          signal: controller.signal,
        });
        const contentType = response.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          throw new Error(
            `GitHub file endpoint returned ${contentType || "non-JSON content"} instead of JSON. In development, restart npm start so src/setupProxy.js is loaded.`
          );
        }
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || `GitHub file request failed (${response.status})`);
        }
        if (
          !result ||
          typeof result !== "object" ||
          Array.isArray(result) ||
          !result.file ||
          typeof result.file !== "object" ||
          Array.isArray(result.file) ||
          typeof result.file.path !== "string" ||
          typeof result.file.html_url !== "string" ||
          !Number.isInteger(result.file.size) ||
          !Number.isInteger(result.file.lineCount) ||
          typeof result.file.preview !== "string"
        ) {
          throw new Error("GitHub response did not include the EmojiHeaven.js preview.");
        }
        setRepositoryExample(result);
      } catch (error) {
        if (error.name !== "AbortError") {
          setRepositoryExampleError(error.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setRepositoryExampleLoading(false);
        }
      }
    };

    fetchRepositoryExample();
    return () => controller.abort();
  }, []);

  //substantiation equiping formally attaching the weather ""data to the forecastDays variable for use in the JSX rendering below"Copilot{'}
  const forecastDays = useMemo(() => {
    if (!dailyForecast) return [];

    return dailyForecast.time.map((date, index) => ({
      date: new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      }),
      high: dailyForecast.temperature_2m_max?.[index],
      low: dailyForecast.temperature_2m_min?.[index],
      precipitationChance: dailyForecast.precipitation_probability_max?.[index],
    }));
  }, [dailyForecast]);

  return (
    <Fragment>
      <div class="row">
        <div class="column">
          &nbsp;&nbsp;&nbsp;
          <div class="rectangle-containerWebsites">
            <h2 className="h2 patients-header">
              Websites
              <img
                src="/Assets/{MicrosoftBabyLogo}.png"
                alt="Search patients"
                className="patients-search-button"
              />
            </h2>
            <section className="github-profile" aria-label="GitHub profile">
              <h3 className="github-profile-title">GitHub</h3>
              {githubLoading ? (
                <p>Loading GitHub profile...</p>
              ) : githubError ? (
                <p role="alert">Unable to load GitHub profile: {githubError}</p>
              ) : githubProfile ? (
                <>
                  <a
                    className="github-profile-link"
                    href={githubProfile.html_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {githubProfile.login}
                  </a>
                  <p>{githubProfile.public_repos} public repositories</p>
                  <ul className="github-repository-list">
                    {githubRepositories.map((repository) => (
                      <li key={repository.id}>
                        <a href={repository.html_url} target="_blank" rel="noreferrer">
                          {repository.name}
                        </a>
                        <span>{repository.stargazers_count} stars</span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </section>
            <section
              className="github-file-section"
              aria-label="EmojiHeaven.js source example"
            >
              <h3>EmojiHeaven.js from GitHub</h3>
              {repositoryExampleLoading ? (
                <p>Loading file preview...</p>
              ) : repositoryExampleError ? (
                <p role="alert">Unable to load EmojiHeaven.js: {repositoryExampleError}</p>
              ) : repositoryExample ? (
                <div className="github-file-example">
                  <a
                    href={repositoryExample.file.html_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {repositoryExample.file.path}
                  </a>
                  <pre className="github-file-preview">
                    {repositoryExample.file.preview}
                    {repositoryExample.file.previewTruncated ? "\n…" : ""}
                  </pre>
                </div>
              ) : null}
            </section>
            <section
              className="github-file-section"
              aria-label="NineteenNameSpaceNineteen.txt source example"
            >
              <h3>NineteenNameSpaceNineteen.txt from GitHub</h3>
              {namespaceExampleLoading ? (
                <p>Loading file preview...</p>
              ) : namespaceExampleError ? (
                <p role="alert">Unable to load the text file: {namespaceExampleError}</p>
              ) : namespaceExample ? (
                <div className="github-file-example">
                  <a
                    href={namespaceExample.file.html_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {namespaceExample.file.path}
                  </a>
                  <pre className="github-file-preview">
                    {namespaceExample.file.preview}
                    {namespaceExample.file.previewTruncated ? "\n…" : ""}
                  </pre>
                </div>
              ) : null}
            </section>
          </div>
        </div>

        <div class="column">

          <div class="rectangled-containerWeatherBox">
            &ensp;
            <p aria-live="polite">
              &ensp;
              {weatherLoading
                ? "Loading Chicago weather..."
                : weatherError
                  ? `Unable to load Chicago weather: ${weatherError}`
                  : `Chicago weather: ${weather.temperature_2m}°F (feels like ${weather.apparent_temperature}°F)`}
                  {/*.::/'d'---::P---'---::P---*/}
             </p>
            <section className="weather-forecast" aria-label="7-day weather forecast">
              <h3 className="weather-forecast-title">7-day forecast</h3>
              {weatherLoading ? (
                <p>Loading forecast...</p>
              ) : forecastDays.length > 0 ? (
                <div className="weather-forecast-days">
                  {forecastDays.map((day) => (
                    <article className="weather-forecast-day" key={day.date}>
                      <h4>{day.date}</h4>
                      <p>High {day.high ?? "--"}°F</p>
                      <p>Low {day.low ?? "--"}°F</p>
                      <p>Rain {day.precipitationChance ?? "--"}%</p>
                    </article>
                  ))}
                </div>
              ) : (
                <p>Forecast unavailable.</p>
              )}
            </section>
            
          </div>
          <div class="rectangle-containerRSSFEED">
            {/*TONEFACE DISPLAY AND LIST-GITHUB API VISUAL DATA FETCH-INSTAGRAM TONE LINK APPROVAL-LIVE TONE FACE UPDATE DISPLAY
            https://www.cbsnews.com/latest/rss/main DISPLAYING IN ACCORDANCE WITH SHAUNS GITHUB AND INTELLECTUAL PROPERTY HERO 
            AND iNSiGNiA, fetchGithubAPI, I would like a live toggle like they do at the bottom of the LocalNews so if this 
            than this if this title is displayed could it then do this, if a title is displayed it could display'display'display
			      a 'something' from my Github repositories as well. Just what titles where displayed which '**REALiiT'::){Y}
            Marco(VERPTICKWILLIAMS:09):-; said his current capability is displaying the RSS FEED and the GITHUB API==PersonWants++'*/}
            <h2 className="rss-feed-title">CBS News RSS Feed</h2>
            <a
              className="rss-feed-source"
              href="https://www.cbsnews.com/latest/rss/main"
              target="_blank"
              rel="noreferrer"
            >
              Open source feed
            </a>
            {rssLoading && rssItems.length === 0 ? (
              <p>Loading CBS News headlines...</p>
            ) : rssError && rssItems.length === 0 ? (
              <p role="alert">Unable to load CBS News headlines: {rssError}</p>
            ) : rssItems.length > 0 ? (
              <>
                {rssError ? (
                  <p role="alert">
                    Unable to refresh CBS News headlines: {rssError}. Showing the latest
                    loaded headlines.
                  </p>
                ) : null}
                <ul className="rss-feed-list">
                  {rssItems.slice(0, 8).map((item) => {
                    const itemMentionsXi = mentionsXi(item);
                    const summary = getRssSummary(item.description || "");

                    return (
                      <li className="rss-feed-item" key={item.guid || item.link}>
                        <div className="rss-feed-copy">
                          <a href={item.link} target="_blank" rel="noreferrer">
                            {item.title}
                          </a>
                          {itemMentionsXi ? (
                            <p className="rss-feed-person">
                              Full name: Xi Jinping | Country: China
                            </p>
                          ) : null}
                          {summary ? (
                            <p className="rss-feed-summary">
                              {summary.slice(0, 220)}
                              {summary.length > 220 ? "…" : ""}
                            </p>
                          ) : null}
                        </div>
                        <time>
                          {new Date(item.pubDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </time>
                      </li>
                    );
                  })}
                </ul>
              </>
            ) : (
              <p>No CBS News headlines are available.</p>
            )}
          </div>
        </div>

        <div class="column">
          <div class="rectangle-containerShaunInformation">
            &nbsp;
            <img
              src="/Assets/{Github'Github'Profile}.jpg"
              alt="PatientPicture"
              className="circle-imageShaunInformation"
            />
          <p className="name-textPatientInformation">PersonalInformation</p>
          
          <div>
          <img src="/Assets/{MicrosoftBabyLogo}.png" alt="DateOfBirthIcon" className="MicrosoftLogo" />
          <span class ="textShaunInformation">N/A**'
          </span>
          </div>
          
          <div>
          <img src="/Assets/{MicrosoftBabyLogo}.png" alt="GenderIcon" className="iconPatientInformation" />
          <span className="textShaunInformation">N/A**'
          </span>
          </div>
        
          <div>
          <img src="/Assets/{MicrosoftBabyLogo}.png" alt="PhoneIcon" className="iconPatientInformation" />
          <span className="textShaunInformation">N/A**'
          </span>
          </div>
          
          <div>
          <img src="/Assets/{MicrosoftBabyLogo}.png" alt="EmergencyPhoneIcon" className="iconPatientInformation" />
          <span className="textShaunInformation">N/A**'
          </span>
          </div>

          <div>
          <img src="/Assets/{MicrosoftBabyLogo}.png" alt="InsuranceIcon" className="iconPatientInformation" />
          <span className="textShaunInformation">N/A**'
          </span>
          </div>

          </div>


          <div class="rectangle-containerLabResults">
            <h2>LiveInstagram &&(||'((OR))) RozesXAccount, Facebook:{0}9;</h2>
          </div>
        </div>
      </div>
      {rssItems.length > 0 ? (
        <footer className="rss-ticker" aria-label="Latest CBS News headlines">
          <div key={rssTickerKey} className="rss-ticker-track">
            <div className="rss-ticker-content">
              {rssItems.slice(0, 8).map((item) => (
                <Fragment key={item.guid || item.link || item.title}>
                  <a
                    className="rss-ticker-headline"
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {item.title}
                  </a>
                  <span className="rss-ticker-separator" aria-hidden="true">
                    •
                  </span>
                </Fragment>
              ))}
            </div>
            <div
              className="rss-ticker-content rss-ticker-content-duplicate"
              aria-hidden="true"
            >
              {rssItems.slice(0, 8).map((item) => (
                <Fragment key={item.guid || item.link || item.title}>
                  <span className="rss-ticker-headline">{item.title}</span>
                  <span className="rss-ticker-separator">•</span>
                </Fragment>
              ))}
            </div>
          </div>
        </footer>
      ) : null}
    </Fragment>
  );
}
export default App;
