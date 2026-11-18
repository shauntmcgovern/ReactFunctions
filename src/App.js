import "./styles.css";

import React, { useState, useEffect, Fragment, useMemo } from "react";
//import React, { Fragment } from 'react';

import Text from "react-text";
import { DictionaryProvider as BaseProvider } from "@codedazur/react-dictionary";

function App() {
  // React state to store JSON data
  const [data, setData] = useState([]);//data is a defining variable and is part of the JSON returning methods and here it is declared with React'State()
  const [weather, setWeather] = useState(null);
  const [dailyForecast, setDailyForecast] = useState(null);
  const [weatherError, setWeatherError] = useState("");
  const [weatherLoading, setWeatherLoading] = useState(true);

  const [patient, setPatient] = useState(null);
  const [githubProfile, setGithubProfile] = useState(null);
  const [githubRepositories, setGithubRepositories] = useState([]);
  const [githubError, setGithubError] = useState("");
  const [githubLoading, setGithubLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchGithubProfile = async () => {
      try {
        const headers = {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        };
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

        if (!profileResponse.ok) {
          throw new Error(`GitHub profile request failed (${profileResponse.status})`);
        }
        if (!repositoriesResponse.ok) {
          throw new Error(`GitHub repositories request failed (${repositoriesResponse.status})`);
        }

        const [profile, repositories] = await Promise.all([
          profileResponse.json(),
          repositoriesResponse.json(),
        ]);
        if (!Array.isArray(repositories)) {
          throw new Error("GitHub response did not include a repository list");
        }

        setGithubProfile(profile);
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
          <div class="rectangle-containerPatients">
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
          </div>
        </div>

        <div class="column">

          <div class="rectangled-containerDiagnosisHistory">
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

          <div class="rectangle-containerDiagnosticList">
            {/*TONEFACE DISPLAY AND LIST-GITHUB API VISUAL DATA FETCH-INSTAGRAM TONE LINK APPROVAL-LIVE TONE FACE UPDATE DISPLAY
            https://www.cbsnews.com/latest/rss/main DISPLAYING IN ACCORDANCE WITH SHAUNS GITHUB AND INTELLECTUAL PROPERTY HERO 
            AND iNSiGNiA, fetchGithubAPI, I would like a live toggle like they do at the bottom of the LocalNews so if this 
            than this if this title is displayed could it then do this, if a title is displayed it could display'display'display
			      a 'something' from my Github repositories as well. Just what titles where displayed which '**REALiiT'::){Y}
            Marco(VERPTICKWILLIAMS:09):-; said his current capability is displaying the RSS FEED and the GITHUB API*/}
            <h2 className="panel-title">PersonWants++'</h2>
          </div>
        </div>

        <div class="column">
          <div class="rectangle-containerPatientInformation">
            &nbsp;
            <img
              src="/Assets/{Github'Github'Profile}.jpg"
              alt="PatientPicture"
              className="circle-imagePatientInformation"
            />
          <p className="name-textPatientInformation">PersonalInformation</p>
          
          <div>
          <img src="/Assets/{MicrosoftBabyLogo}.png" alt="DateOfBirthIcon" className="iconPatientInformation" />
          <span class ="textPatientInformation">Date of Birth 
          </span>
          </div>
          
          <div>
          <img src="/Assets/{MicrosoftBabyLogo}.png" alt="GenderIcon" className="iconPatientInformation" />
          <span className="textPatientInformation">Gender
          </span>
          </div>
        
          <div>
          <img src="/Assets/{MicrosoftBabyLogo}.png" alt="PhoneIcon" className="iconPatientInformation" />
          <span className="textPatientInformation">Contact Info.
          </span>
          </div>
          
          <div>
          <img src="/Assets/{MicrosoftBabyLogo}.png" alt="EmergencyPhoneIcon" className="iconPatientInformation" />
          <span className="textPatientInformation">Emergency Contacts
          </span>
          </div>

          <div>
          <img src="/Assets/{MicrosoftBabyLogo}.png" alt="InsuranceIcon" className="iconPatientInformation" />
          <span className="textPatientInformation">Insurance Provider
          </span>
          </div>

          <p className="name-textPatientInformation selected-nav-item">Shaun McGovern</p>
          </div>


          <div class="rectangle-containerLabResults">
            <h2 className="panel-title">LiveInstagram &&(||'((OR))) RozesXAccount, Facebook:{0}9;</h2>
          </div>

        </div>
      </div>
      
    </Fragment>
  );
}
export default App;