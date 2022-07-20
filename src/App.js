import { Header } from "./components/Header";
import { PhotosFeed } from "./components/PhotosFeed";
import { Footer } from "./components/Footer";
import { NewsFeed } from "./components/NewsFeed";
import { ResultsFeed } from "./components/ResultsFeed";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Home } from "./components/Home";
import { Configuration } from "./components/Configuration";

function App () {
  return (
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
      <Footer />
    </BrowserRouter>
  );
}

export default App;
