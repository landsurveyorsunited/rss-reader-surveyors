import { Header } from "./components/Header";
import { PhotosFeed } from "./components/PhotosFeed";
import { Footer } from "./components/Footer";
import { NewsFeed } from "./components/NewsFeed";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Home } from "./components/Home";
import { Configuration } from "./components/Configuration";
import { FeedRSSContext } from "./components/context/FeedRSSContext";
import { useEffect, useState } from "react";

function App () {

  const [vars, setVars] = useState ({});
  
  useEffect ( () => {

    let local_vars = {
      feeds: [
        {id: 'usa', url: 'https://ftw.usatoday.com/category/tennis/feed', name: 'USA Today - Tennis', 'active': true, 'loaded': false},
        {id: 'espn', url: 'https://www.espn.com/espn/rss/tennis/news/', name: 'ESPN - Tennis', 'active': true, 'loaded': false},
        {id: 'univ', url: 'https://blog.universaltennis.com/feed/', name: 'Universal Tennis', 'active': true, 'loaded': false},
        {id: 'aus', url: 'https://feeds.feedburner.com/tennis-australia', name: 'Tennis Australia', 'active': true, 'loaded': false}
      ],
      dark_mode: false
    };

    if (localStorage.getItem ('tennis-rss') !== null) local_vars = JSON.parse (localStorage.getItem ('tennis-rss'));

    setVars (local_vars);
  }, []);

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
          <Route path="/home" element={<Home />} />
          <Route path="*" element={<Navigate to="/news-feed" replace/>} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </FeedRSSContext.Provider>
  );
}

export default App;
