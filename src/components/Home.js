import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import { FeedRSSContext } from './context/FeedRSSContext'

export const Home = () => {

  const {vars} = useContext (FeedRSSContext);
  return (
    <div className='home mt-5'>
      <div className='container-md'>
          <div className='row'>
            <div className='col-md-12'>
              <h1 className='mb-0'>
                Welcome to RSS Tennis Feed, a Tennis RSS feed reader. 
              </h1>
              <h4>
                Here you will be able to find the last news & photos about tennis.
              </h4>
              <hr />
              <p className='mb-0 mt-5 '>
                <Link to="/news-feed" className='fw-bold'>News</Link> <span>Here you will find the latest news published on the following websites:</span>
              </p>
              <ul className='ml-0'>
                {
                  vars?.feeds?.map (feed => (<li key={feed.id}><a href={feed.url} target="_blank" rel="noreferrer" >{feed.name}</a></li>))
                }
              </ul>
              <p className='mb-0'>
                <Link to="/photos-feed" className='fw-bold'>Image Gallery</Link> <span>Here you will find the latest photos published by WTA in their official RSS Feed:</span>
              </p>
              <ul className='ml-0'>
                <li><a href="https://www.wtatennis.com/rss-photos.xml" target="_blank" rel="noreferrer" >WTA</a></li>
              </ul>
              <p className='mb-5'>
                <Link to="/configuration" className='fw-bold'><i className='fa fa-solid fa-gear'></i></Link> <span>Here you will be able to activate/deactive any feed and dark mode.</span>
              </p>
              <hr />
              <p className='mt-2'>
                This APP have been developed by <a href="https://github.com/rafasanabria1" target="_blank" rel="noreferrer">@rafasanabria1</a> using ReactJS & Bootstrap to carry out the <a href="https://www.twitch.tv/mouredev" target="_blank" rel="noreferrer">@mourdev</a> monthly challenge.
                <br />
                You can find this APP Code in <a href="https://github.com/rafasanabria1/tennis-rss-reader-mouredev-challenge" target="_blank" rel="noreferrer">GitHub</a>.
              </p>
              <p>
                
              </p>
              <p>
                You can find more information about <a href="https://www.twitch.tv/mouredev"  target="_blank" rel="noreferrer">@mourdev</a>'s monthly challenges in <a href="https://github.com/mouredev/Monthly-App-Challenge-2022" target="_blank" rel="noreferrer">GitHub</a> and in his partner <a href="https://go.rviewer.io/dev-lector-rss-es/?utm_source=mouredev&utm_medium=github_repo&utm_campaign=rss_reader_mouredev" target="_blank" rel="noreferrer">rviewer</a>.
                <br />
                Special thanks to <a href="https://github.com/messier31" target="_blank" rel="noreferrer">@messier31</a> for letting me use his proxy <a href="https://fast-dawn-89938.herokuapp.com/https://ftw.usatoday.com/category/tennis/feed" target="_blank" rel="noreferrer">cors-anywhere</a>.
              </p>
              <p>
                Happy Coding!
              </p>
            </div>
          </div>
      </div>
    </div>
  )
}
