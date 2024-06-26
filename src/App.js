import { Header } from "./components/Header";
import { PhotosFeed } from "./components/PhotosFeed";
import { Footer } from "./components/Footer";
import { NewsFeed } from "./components/NewsFeed";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { About } from "./components/About";
import { Configuration } from "./components/Configuration";
import { FeedRSSContext } from "./components/context/FeedRSSContext";
import { useEffect, useState } from "react";

function App () {

  const [vars, setVars] = useState ( () => {
    
    let local_vars = {
      feeds: [
        {id: 'usa', url: 'https://feeds.feedburner.com/smarketplace/latest', name: 'Land Surveyor Market', 'active': true, 'items': [], 'loaded': true},
        {id: 'espn', url: 'https://feeds.feedburner.com/surveyingjobsmegafeed', name: 'Land Surveyor Jobs', 'active': true, 'items': [], 'loaded': false},
        {id: 'univ', url: 'https://feeds.feedburner.com/landsurveyorsunited/latestjobs', name: 'Universal Tennis', 'active': true, 'items': [], 'loaded': false},
        {id: 'aus', url: 'https://feeds.feedburner.com/tennis-australia', name: 'Tennis Australia', 'active': true, 'items': [], 'loaded': false}
      ],
      dark_mode: false
    };
    
    if (localStorage.getItem ('tennis-rss') !== null) {
      let local_vars_memory = JSON.parse (localStorage.getItem ('tennis-rss'));
      local_vars = {
        ...local_vars_memory,
        feeds: local_vars_memory?.feeds?.map (feed => { return {...feed, loaded: false}}),
      }
    }
    return local_vars;
  });

  useEffect ( () => {

    if (vars.dark_mode) document.body.classList.add ('dark-mode');
    else document.body.classList.remove ('dark-mode');
  }, [vars.dark_mode])

  useEffect( () => {

    localStorage.setItem ('tennis-rss', JSON.stringify(vars));
  }, [vars])
  
  return (

    <FeedRSSContext.Provider value={{vars, setVars}}>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/news-feed" element={<NewsFeed />} />
          <Route path="/photos-feed" element={<PhotosFeed />} />
          <Route path="/configuration" element={<Configuration />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Navigate to="/news-feed" replace/>} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </FeedRSSContext.Provider>
  );
}

export default App;
