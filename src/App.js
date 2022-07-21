import { Header } from "./components/Header";
import { PhotosFeed } from "./components/PhotosFeed";
import { Footer } from "./components/Footer";
import { NewsFeed } from "./components/NewsFeed";
import { ResultsFeed } from "./components/ResultsFeed";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Home } from "./components/Home";
import { Configuration } from "./components/Configuration";
import { FeedRSSContext } from "./components/context/FeedRSSContext";
import { useState } from "react";

function App () {

  const [vars, setVars] = useState({
    feeds: [
      {id: 'usa', url: 'https://ftw.usatoday.com/category/tennis/feed', name: 'USA Today - Tennis', 'active': true},
      {id: 'espn', url: 'https://www.espn.com/espn/rss/tennis/news/', name: 'ESPN - Tennis', 'active': true},
      {id: 'univ', url: 'https://blog.universaltennis.com/feed/', name: 'Universal Tennis', 'active': true},
      {id: 'aus', url: 'https://feeds.feedburner.com/tennis-australia', name: 'Tennis Australia', 'active': true}
    ],
    dark_mode: false
  });
  
  return (

    <FeedRSSContext.Provider value={{vars, setVars}}>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/news-feed" element={<NewsFeed />} />
          <Route path="/photos-feed" element={<PhotosFeed />} />
          <Route path="/results-feed" element={<ResultsFeed />} />
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
