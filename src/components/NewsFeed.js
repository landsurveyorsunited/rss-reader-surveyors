import React, { useContext, useEffect, useState } from 'react'
import moment from 'moment';
import { Loading } from './static/Loading';
import { NoItems } from './static/NoItems';
import { FeedRSSContext } from './context/FeedRSSContext';

export const NewsFeed = () => {

  const [loading, setLoading]                       = useState (true);
  const [all_items, setAllItems]                    = useState ([]);
  const [items_filtered, setItemsFiltered]          = useState ([]);
  const [items_in_view, setItemsInView]             = useState ([]);
  const [results_by_page, setResultsByPage]         = useState (24);
  const [page, setPage]                             = useState (1);
  const [total_pages, setTotalPages]                = useState (0);
  const [show_only_bookmarks, setShowOnlyBookmarks] = useState (false);
  
  const {vars, setVars} = useContext (FeedRSSContext);

  useEffect ( () => {
    console.log ('entracomponente');
    
  }, []);


  useEffect ( () => {
    console.log ('useeffect1');

    setLoading (true);
    
    const cors_proxy = process.env.REACT_APP_CORS_PROXY  || 'http://localhost';
    const cors_port  = process.env.REACT_APP_CORS_PORT || 8080;
    
    if (vars?.feeds?.filter (feed => (feed.active && ! feed.loaded)).length > 0) {
      
      Promise.all (vars?.feeds?.map (feed => {
        if (! feed.active || feed.loaded) return feed;
        
        return fetch (cors_proxy + ':' + cors_port + '/' + feed.url)
        .then (resp => resp.text ()).then (resp => {
          
          const xml       = new DOMParser ().parseFromString (resp, "text/xml");
          const items_raw = Array.from (xml.querySelectorAll ("item"));
          const items     = getItemsFromRaw (feed, items_raw);    
          
          return {...feed, loaded: true, items}; 
        })
      })).then (feeds => {
          
        const sorted_items = feeds.filter (feed => feed.active).reduce ( (a, b) => {
          if (Array.isArray (a.items)) return a.items.concat (b.items);
          else return a.concat (b.items);
        }, []).sort ( (a, b) => a.date_moment > b.date_moment ? -1 : 1);
        
        setAllItems (sorted_items);
        
        /*
        setVars ({
          ...vars,
          feeds
        });
        */
      });
    } /*else if (vars?.feeds?.length > 0) {
      
      const sorted_items = vars.feeds.filter (feed => feed.active).reduce ( (a, b) => {
        if (Array.isArray (a.items)) return a.items.concat (b.items);
        else return a.concat (b.items);
      }, []).sort ( (a, b) => a.date_moment > b.date_moment ? -1 : 1);
      
      setAllItems (sorted_items);
    }*/
  }, [vars]);
    
  useEffect ( () => {
    
    console.log ('useeffect2');
    setLoading (true);
    setPage (1);
    if (show_only_bookmarks) setItemsFiltered (all_items.filter (item => item.bookmark));
    else setItemsFiltered (all_items);
  }, [show_only_bookmarks, all_items]);
  
  
  useEffect ( () => {
    
    console.log ('useeffect3');
    setLoading (true);
    if (Array.isArray (items_filtered)) {
      
      setTotalPages (Math.ceil (items_filtered.length / results_by_page));
      setItemsInView (items_filtered.slice ( (page -1) * results_by_page, page * results_by_page));
    } else {
      setTotalPages (0);
      setItemsInView ([]);
    }
    setLoading (false);
    
  }, [items_filtered, results_by_page, page]);


  const getItemsFromRaw = (feed, items_raw) => {

    return items_raw.map ( (item, index2) => {
          
      let id = feed.id + '-' + index2;

      let title = item.querySelector ("title").textContent;
      
      let img_url = '', img_alt = '';
      if (feed.id === 'usa') {

        let img_obj = item.getElementsByTagName ("media:content");
        if (img_obj[0]) {
          img_url     = img_obj[0].getAttribute ('url');
          img_alt     = title;
        }
        
      } else if (feed.id === 'espn') {

        let img_obj = item.querySelector ("enclosure");
        img_url     = img_obj.getAttribute ('url');
        img_alt     = item.querySelector ("description").textContent;

      } else if (feed.id === 'univ') {

        let description_html = item.querySelector ("description").textContent;
        let matches          = description_html.match (/<img[^>]* src="([^"]*)\?.*"[^>]* alt="([^"]*)"[^>]*>/);
        img_url     = matches[1];
        img_alt     = matches[2] ? matches[2] : title;

      } else if (feed.id === 'aus') {

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

      return {id, title, link, img: {url: img_url, alt: img_alt}, date_moment, date: date_modified, site_name: feed.name, bookmark: false};
    })
  };

  const reloadAllFeeds = () => {

    const newFeeds = vars.feeds.map ( feed => {
            return {
                ...feed,
                loaded: false
            }
        });

    setVars ({
        ...vars,
        feeds: newFeeds
    });
  };

  const toggleBookmark = (id) => {
    
    setAllItems (prev => prev.map (oldItem => {
      if (oldItem.id === id) {
        return {
          ...oldItem,
          bookmark: !oldItem.bookmark
        }
      }
  
      return oldItem;
    }));

    setItemsFiltered (prev => prev.map (oldItem => {
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
    <>
      {
          loading && (
            <Loading />
          )
      }
      {
        ! loading && (
          <div className='container-fluid'>
            <div className="row mt-3 mb-5">
              <div className='col-md-4 px-5'>
                  <button className={"btn btn-block " + (vars.dark_mode ? 'btn-outline-light' : 'btn-outline-primary')} onClick={() => setShowOnlyBookmarks (current => !current) }>{show_only_bookmarks ? "Show All Items" : "Show Only Bookmarks"} <i className={"fa-solid fa-star"} ></i></button>
              </div>
              <div className='col-md-4 px-5 text-center'>
                  <button className={"btn btn-block " + (vars.dark_mode ? 'btn-outline-light' : 'btn-outline-primary')} onClick={() => reloadAllFeeds () }>Reload All Feeds <i className={"fa-solid fa-rotate"} ></i></button>
              </div>
              { 
                items_in_view.length > 0 && (
                  <div className='col-md-4 mt-3 mt-md-0 px-5'>
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
          ! loading && items_in_view.length <= 0 && (
            <NoItems />
          )
      }
      {
          ! loading && items_in_view.length > 0 && (
            <>
              <div className='rss-news-feed mt-5'>
                <div className='container-fluid'>
                  <div className="row mt-3">
                      {
                        items_in_view.map ( (item) => {
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
                                          <a href={item.link} className={"btn btn-sm float-end " + (vars.dark_mode ? 'btn-light' : 'btn-primary')} target="_blank" rel="noreferrer">Go to web <i className="fa-solid fa-arrow-up-right-from-square"></i></a>
                                          <small className="card-text site">{item.site_name}</small>
                                        </div>
                                      </div>
                                    </div>
                                  </div>                        
                              )
                          })
                      }
                  </div>
                </div>
              </div>
            </>
          )
      }
      {
        ! loading && (total_pages > 1)  && (
          <div className='container-md mt-5'>
            <div className="row">
                <div className="col-12">
                    <nav aria-label="Page navigation">
                        <ul className="pagination justify-content-center mb-0">
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
    </>
  )
}
