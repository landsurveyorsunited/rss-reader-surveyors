import React, { useEffect, useState } from 'react'
import moment from 'moment';
import { Loading } from './Loading';
import { NoItems } from './NoItems';

export const NewsFeed = () => {

  const [loading, setLoading]                       = useState (true);
  const [initial_load, setInitialLoad]              = useState (true);
  const [all_feeds, setAllFeeds]                    = useState ([]);
  const [feeds_filtered, setFeedsFiltered]          = useState ([]);
  const [feeds_in_view, setFeedsInView]             = useState ([]);
  const [results_by_page, setResultsByPage]         = useState (24);
  const [page, setPage]                             = useState (1);
  const [total_pages, setTotalPages]                = useState (0);
  const [show_only_bookmarks, setShowOnlyBookmarks] = useState (false);
  
  useEffect (() => {
    
    if (initial_load) {
      const feeds_url = [
        {id: 'usa', url: 'https://ftw.usatoday.com/category/tennis/feed', name: 'USA Today - Tennis', 'active': true},
        {id: 'espn', url: 'https://www.espn.com/espn/rss/tennis/news/', name: 'ESPN - Tennis', 'active': true},
        {id: 'univ', url: 'https://blog.universaltennis.com/feed/', name: 'Universal Tennis', 'active': true},
        {id: 'aus', url: 'https://feeds.feedburner.com/tennis-australia', name: 'Tennis Australia', 'active': true}
      ];

      const getAllFeeds = async () => {
      
        let cors_prefix = '';
        if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") cors_prefix = "http://localhost:8080/";

        feeds_url.filter (site => site.active).map (async (site, index) => {

          const content_text   = await fetch(cors_prefix + site.url).then(r => r.text());
          const content_xmlDoc = new DOMParser().parseFromString (content_text, "text/xml");

          const partial_items = Array.from (content_xmlDoc.querySelectorAll ("item")).map ( (item, index2) => {
            
            let id = site.id + '-' + index2;
    
            let title = item.querySelector ("title").textContent;
            
            let img_url = '', img_alt = '';
            if (site.id === 'usa') {

              let img_obj = item.getElementsByTagName ("media:content");
              if (img_obj[0]) {
                img_url     = img_obj[0].getAttribute ('url');
                img_alt     = title;
              }
              
            } else if (site.id === 'espn') {

              let img_obj = item.querySelector ("enclosure");
              img_url     = img_obj.getAttribute ('url');
              img_alt     = item.querySelector ("description").textContent;

            } else if (site.id === 'univ') {

              let description_html = item.querySelector ("description").textContent;
              let matches          = description_html.match (/<img[^>]* src="([^"]*)\?.*"[^>]* alt="([^"]*)"[^>]*>/);
              img_url     = matches[1];
              img_alt     = matches[2] ? matches[2] : title;

            } else if (site.id === 'aus') {

              let description_html = item.querySelector ("description").textContent;
              let matches          = description_html.match (/<img[^>]* src="([^"]*)\??.*"[^>]* alt="([^"]*)"[^>]* srcset="([^"]*)"[^>]*>/);
              
              img_url     = matches[1];
              img_alt     = matches[2] ? matches[2] : title;
              
              if (matches[3]) {

                let images_by_size = matches[3].trim().split (', ').map (value => value.split (" "));
                let bigger_image   = images_by_size.sort ( (a,b) => parseInt(a[1].slice(0,-1)) > parseInt(b[1].slice(0,-1)) ? -1 : 1).shift ();
                img_url = bigger_image[0];
              }

            }
            let link = item.querySelector ("link").textContent;
    
            let date          = item.querySelector ("pubDate").textContent;
            let date_moment   = moment (date).utc ();
            let date_modified = date_moment.format ('MM/DD/YYYY HH:mm') + ' UTC';
    
            return {id, title, link, img: {url: img_url, alt: img_alt}, date_moment, date: date_modified, site, bookmark: false};
          });
          
          setAllFeeds (current => [...current, ...partial_items].sort ((a, b) => a.date_moment > b.date_moment ? -1 : 1));
        });

        setInitialLoad (false);
      };
      
      getAllFeeds ();
    }
  }, [initial_load]);
  
 
  useEffect ( () => {

    setLoading (true);
    if (Array.isArray (feeds_filtered)) {
      
      setTotalPages (Math.ceil (feeds_filtered.length / results_by_page));
      setFeedsInView (feeds_filtered.slice ( (page -1) * results_by_page, page * results_by_page));
    } else {
      setTotalPages (0);
      setFeedsInView ([]);
    }
    
  }, [feeds_filtered, results_by_page, page]);

  
  useEffect ( () => {
    
    setLoading (true);
    setPage (1);
    if (show_only_bookmarks) setFeedsFiltered (all_feeds.filter (item => item.bookmark));
    else setFeedsFiltered (all_feeds);
  }, [show_only_bookmarks, all_feeds])
  

  useEffect ( () => {
    setLoading (false);
  }, [feeds_in_view]);


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

    setFeedsFiltered (prev => prev.map (oldItem => {
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
    <div className='rss-feed rss-news-feed'>
      {
          (! initial_load && ! loading) && (
            <div className='container-fluid'>
              <div className="row mt-3 justify-content-between">
                <div className='col-md-4'>
                    <button className="btn btn-block btn-outline-primary" onClick={() => setShowOnlyBookmarks (current => !current) }>{show_only_bookmarks ? "Show All Items" : "Show Only Bookmarks"} <i className={"fa-solid fa-star"} ></i></button>
                </div>
                { 
                  feeds_in_view.length > 0 && (
                    <div className='col-md-4 mt-3 mt-md-0'>
                      <div className='row justify-content-end'>
                        <label htmlFor="resultsbypage" className="col-md-7 col-lg-8 text-md-end col-form-label">Results by page</label>
                        <div className="col-md-5 col-lg-4">
                          <select name="resultsbypage" id="resultsbypage" className="form-select" onChange={e => setResultsByPage (parseInt (e.currentTarget.value))} value={results_by_page}>
                            <option value="24">24</option>
                            <option value="36">36</option>
                            <option value="48">48</option>
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
          (initial_load || loading) && (
            <Loading />
          )
      }
      {
          ! loading && feeds_in_view.length <= 0 && (
            <NoItems />
          )
      }
      {
          (! initial_load && ! loading) && feeds_in_view.length > 0 && (
            <div className='container-fluid'>
              <div className="row mt-3">
                  {
                      feeds_in_view.map ( (item) => {
                          if (show_only_bookmarks && ! item.bookmark) return '';

                          return (
                              <div className="col-sm-6 col-lg-3 col-xl-2 pb-3" key={item.link}>
                                <div className='card og'>
                                    <div onClick={() => toggleBookmark (item.id)} className={"bookmark" + (item.bookmark === true ? ' selected' : '')}>
                                      <i className={"fa-solid fa-star"} ></i>
                                    </div>
                                    <small className='float-end mt-2 date'>{item.date}</small>
                                    <img src={item.img.url ? item.img.url : 'http://via.placeholder.com/400x400'} className="card-img-top" alt={item.img.alt} />                                  
                                  <div className="card-body">
                                    <h6 className="card-title">{item.title}</h6>
                                    <div className='card-bottom mt-3'>
                                      <a href={item.link} className="btn btn-primary btn-sm float-end" target="_blank" rel="noreferrer">Go to web <i className="fa-solid fa-arrow-up-right-from-square"></i></a>
                                      <small className="card-text site">{item.site.name}</small>
                                    </div>
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
        (! initial_load && ! loading) && (total_pages > 0)  && (
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
