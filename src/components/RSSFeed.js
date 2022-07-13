import React, { useEffect, useState } from 'react'

export const RSSFeed = () => {

  const CORS_PROXY          = "https://cors-anywhere.herokuapp.com/";
  const feed_url            = 'https://www.wtatennis.com/rss-photos.xml';
  const feed_url_resultados = 'https://www.tennisstats247.com/DailyMatchFeed.aspx?langId=3';

  const [news, setNews] = useState ([]);
  
  useEffect (() => {
    
    const getNews = async () => {
    
      const text   = await fetch(CORS_PROXY + feed_url).then(r => r.text());
      const xmlDoc = new DOMParser().parseFromString (text, "text/xml");
      
      const lastNews = Array.from (xmlDoc.querySelectorAll ("item")).map ( (item) => {
        
        let title             = item.querySelector ("title").textContent;
        
        let description_html  = item.querySelector ("description").textContent;
        let description_match = description_html.match (/<p>(.+)<\/p>/);
        let description       = description_match ? description_match[1] : title;
        
        let img_obj       = item.getElementsByTagName ("media:thumbnail")[0];
        let img_url       = img_obj.getAttribute ('url');
        let img_alt_match = description_html.match (/alt="(.+)"/);
        let img_alt       = img_alt_match ? img_alt_match[1] : title;

        let link = item.querySelector ("link").textContent;

        let date = item.querySelector ("pubDate").textContent;

        return {title, description, img: {url: img_url, alt: img_alt}, link, date};
    });
      
      console.log (xmlDoc);
      setNews (lastNews);
    };

    getNews ();
  }, [])
  
  

  return (
    <div className='rss-feed'>
      {
          news.length <= 0 && (
            <div className="loading">
              <h3>Loading news...</h3>
            </div>
          )
      }
      {
          news.length > 0 && (
            <div className='container'>
              <div className="row">
                  {
                      news.map ( (item, index) => {
                          
                          return (
                              <div className="col-6 p-3" key={item.link}>
                                <div className='card'>
                                  <small className='float-end mt-2'>{item.date}</small>
                                  <img src={item.img.url} className="card-img-top" alt={item.img.alt} />
                                  <div className="card-body">
                                    <h3 className="card-title">{item.title}</h3>
                                    <p className="card-text mb-0" dangerouslySetInnerHTML={{__html: item.description}}></p>
                                    <a href={item.link} className="btn btn-primary float-end mt-4" target="_blank" rel="noreferrer">Go to Gallery</a>
                                  </div>
                                </div>
                              </div>                        
                          )
                      })
                  }
              </div>
            </div>
          )
      }
    </div>
  )
}
