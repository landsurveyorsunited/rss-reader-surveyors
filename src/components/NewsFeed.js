import React, { useEffect, useState } from 'react'
import moment from 'moment';
import { Loading } from './Loading';
import { NoItems } from './NoItems';

export const NewsFeed = () => {

  const CORS_PROXY          = "https://cors-anywhere.herokuapp.com/";


  const [loading, setLoading]                       = useState (true);
  const [initialLoad, setInitialLoad]               = useState (true);
  const [all_feeds, setAllFeeds]                    = useState ([]);
  const [photos_filtered, setPhotosFiltered]        = useState ([]);
  const [photos_in_view, setPhotosInView]           = useState ([]);
  const [results_by_page, setResultsByPage]         = useState (12);
  const [page, setPage]                             = useState (1);
  const [total_pages, setTotalPages]                = useState (0);
  const [show_only_bookmarks, setShowOnlyBookmarks] = useState (false);
  
  useEffect (() => {
    
    const feeds_url = [
      {id: 'usa', url: 'https://ftw.usatoday.com/category/tennis/feed', name: 'USA Today - Tennis'},
      {id: 'espn', url: 'https://www.espn.com/espn/rss/tennis/news/', name: 'ESPN - Tennis'},
      {id: 'univ', url: 'https://blog.universaltennis.com/feed/', name: 'Universal Tennis'},
      {id: 'aus', url: 'http://feeds.feedburner.com/tennis-australia', name: 'Tennis Australia'}
    ];

    const getAllFeeds = async () => {
    
      const items_by_site = [];
      feeds_url.map (async (site, index) => {

        const content_text   = await fetch(CORS_PROXY + site.url).then(r => r.text());
        const content_xmlDoc = new DOMParser().parseFromString (content_text, "text/xml");

        const feed_site = content_xmlDoc.querySelector ("channel title").textContent;
        
        const partial_items = Array.from (content_xmlDoc.querySelectorAll ("item")).map ( (item, index2) => {
          
          let id = site.id + '-' + index2;
  
          let title = item.querySelector ("title").textContent;
          
          let img_url = '', img_alt = '';
          if (site.id === 'usa') {

            let img_obj = item.getElementsByTagName ("media:thumbnail");
            if (Array.isArray (img_obj)) {

              img_url     = img_obj[0].getAttribute ('src');
              img_alt     = title;
            }
          } else if (site.id === 'espn') {

            let img_obj = item.querySelector ("enclosure");
            img_url     = img_obj.getAttribute ('url');
            img_alt     = item.querySelector ("description").textContent;
          } else if (site.id === 'univ') {

            let description_html = item.querySelector ("description").textContent;
            img_url     = description_html.match (/<img[^>]* src="([^"]*)"[^>]*>/)[1];
            img_alt     = description_html.match (/<img[^>]* alt="([^"]*)"[^>]*>/)[1];
          } else if (site.id === 'aus') {
            let description_html = item.querySelector ("description").textContent;
            img_url     = description_html.match (/<img[^>]* src="([^"]*)"[^>]*>/)[1];
            img_alt     = title;
          }
          let link = item.querySelector ("link").textContent;
  
          let date          = item.querySelector ("pubDate").textContent;
          let date_moment   = moment (date).utc ();
          let date_modified = date_moment.format ('MM/DD/YYYY HH:mm') + ' UTC';
  
          return {id, title, link, img: {url: img_url, alt: img_alt}, date_moment, date: date_modified, feed_site, bookmark: false};
        });
        
        items_by_site.push (partial_items);

        setTimeout (() => {}, 5000);
      });

      const items = items_by_site.flat ();

      setAllFeeds (items);
      setInitialLoad (false);
    };
    
    getAllFeeds ();
  }, [])
  
  
  useEffect ( () => {

    setLoading (true);
    if (Array.isArray (photos_filtered)) {
      
      setTotalPages (Math.ceil (photos_filtered.length / results_by_page));
      setPhotosInView (photos_filtered.slice ( (page -1) * results_by_page, page * results_by_page));
    } else {
      setTotalPages (0);
      setPhotosInView ([]);
    }
    
  }, [photos_filtered, results_by_page, page]);

  
  useEffect ( () => {
    
    setLoading (true);
    if (show_only_bookmarks) setPhotosFiltered (all_feeds.filter (item => item.bookmark));
    else setPhotosFiltered (all_feeds);
  }, [show_only_bookmarks, all_feeds])
  

  useEffect ( () => {
    setLoading (false);
  }, [photos_filtered])

  const toggleBookmark = (id) => {
    
    setAllFeeds (prev => prev.map (oldItem => {
      if (oldItem.id === id) {
        return {
          ...oldItem,
          bookmark: !oldItem.bookmark
        }
      }
  
      return oldItem;
    }));

    setPhotosFiltered (prev => prev.map (oldItem => {
      if (oldItem.id === id) {
        return {
          ...oldItem,
          bookmark: !oldItem.bookmark
        }
      }
  
      return oldItem;
    }));
  }


  return (
    <div className='rss-feed rss-photo-feed'>
      {
          (! initialLoad && ! loading) && (
            <div className='container-lg'>
              <div className="row mt-3 justify-content-between">
                <div className='col-md-4'>
                    <button className="btn btn-block btn-outline-primary" onClick={() => setShowOnlyBookmarks (current => !current) }>{show_only_bookmarks ? "Show All Items" : "Show Only Bookmarks"} <i className={"fa-solid fa-star"} ></i></button>
                </div>
                { 
                  photos_in_view.length > 0 && (
                    <div className='col-md-4 mt-3 mt-md-0'>
                      <div className='row justify-content-end'>
                        <label htmlFor="resultsbypage" className="col-md-7 col-lg-8 text-md-end col-form-label">Results by page</label>
                        <div className="col-md-5 col-lg-4">
                          <select name="resultsbypage" id="resultsbypage" className="form-select" onChange={e => setResultsByPage (parseInt (e.currentTarget.value))} value={results_by_page}>
                            <option value="12">12</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )
                }
              </div>
            </div>
          )
      }
      {
          (initialLoad || loading) && (
            <Loading />
          )
      }
      {
          ! loading && photos_in_view.length <= 0 && (
            <NoItems />
          )
      }
      {
          (! initialLoad && ! loading) && photos_in_view.length > 0 && (
            <div className='container-lg'>
              <div className="row mt-3">
                  {
                      photos_in_view.map ( (item) => {
                          if (show_only_bookmarks && ! item.bookmark) return '';

                          return (
                              <div className="col-sm-6 col-lg-4 pb-3" key={item.link}>
                                <div className='card og'>
                                    <div onClick={() => toggleBookmark (item.id)} className={"bookmark" + (item.bookmark === true ? ' selected' : '')}>
                                      <i className={"fa-solid fa-star"} ></i>
                                    </div>
                                    <small className='float-end mt-2'>{item.date}</small>
                                    <img src={item.img.url} className="card-img-top" alt={item.img.alt} />
                                  
                                  <div className="card-body">
                                    <h3 className="card-title">{item.title}</h3>
                                    <p className="card-text mb-0" dangerouslySetInnerHTML={{__html: item.description}}></p>
                                    <a href={item.link} className="btn btn-primary float-end mt-2" target="_blank" rel="noreferrer">Go to Gallery <i className="fa-solid fa-arrow-up-right-from-square"></i></a>
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
      {
        (! initialLoad && ! loading) && (total_pages > 0)  && (
          <div className='container-md'>
            <div className="row">
                <div className="col-12">
                    <nav aria-label="Page navigation">
                        <ul className="pagination justify-content-center">
                            <li className={"page-item " + ((page <= 1) ? 'disabled' : '') }>
                                <button className="page-link" onClick={() => setPage (page - 1)}>Previous</button>
                            </li>
                            {
                              [...Array(total_pages)].map ((elementInArray, index) => {
                                
                                let num_page = index + 1;
                                return (
                                  <li className="page-item" key={num_page}>
                                      <button className={"page-link" + ((num_page === page) ? ' active' : '')} onClick={() => setPage (num_page)}>{num_page}</button>
                                  </li>
                                ) 
                              })
                            }
                            <li className={"page-item " + ((page >= total_pages) ? 'disabled' : '')}>
                                <button className="page-link" onClick={() => setPage (page + 1)}>Next</button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
          </div>
        )
      }
    </div>
  )
}
