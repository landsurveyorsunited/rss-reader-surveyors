import React, { useEffect, useState } from 'react'
import moment from 'moment';
import { Loading } from './Loading';
import { NoItems } from './NoItems';

export const PhotosFeed = () => {

  const CORS_PROXY          = "https://cors-anywhere.herokuapp.com/";
  const feed_url_photos_WTA = 'https://www.wtatennis.com/rss-photos.xml';

  const [loading, setLoading]                       = useState (true);
  const [initialLoad, setInitialLoad]               = useState (true);
  const [all_photos, setAllPhotos]                  = useState ([]);
  const [photos_filtered, setPhotosFiltered]        = useState ([]);
  const [photos_in_view, setPhotosInView]           = useState ([]);
  const [results_by_page, setResultsByPage]         = useState (12);
  const [page, setPage]                             = useState (1);
  const [total_pages, setTotalPages]                = useState (0);
  const [show_only_bookmarks, setShowOnlyBookmarks] = useState (false);
  
  useEffect (() => {
    
    const getAllPhotos = async () => {
    
      /* WTA Photo */
      const wta_text   = await fetch(CORS_PROXY + feed_url_photos_WTA).then(r => r.text());
      const wta_xmlDoc = new DOMParser().parseFromString (wta_text, "text/xml");
      
      const all_photos_wta = Array.from (wta_xmlDoc.querySelectorAll ("item")).map ( (item, index) => {
        
        let id = 'wta-' + index;

        let title             = item.querySelector ("title").textContent;
        
        let description_html  = item.querySelector ("description").textContent;
        let description_match = description_html.match (/<p>(.+)<\/p>/);
        let description       = description_match ? description_match[1] : title;
        
        let img_obj       = item.getElementsByTagName ("media:thumbnail")[0];
        let img_url       = img_obj.getAttribute ('url');
        let img_alt_match = description_html.match (/alt="(.+)"/);
        let img_alt       = img_alt_match ? img_alt_match[1] : title;

        let link = item.querySelector ("link").textContent;

        let date          = item.querySelector ("pubDate").textContent;
        let date_modified = moment (date).utc ().format ('MM/DD/YYYY HH:mm') + ' UTC';

        
        return {id, title, description, img: {url: img_url, alt: img_alt}, link, date: date_modified, bookmark: false};
      });


      setAllPhotos (all_photos_wta);
      setInitialLoad (false);

    };
    
    getAllPhotos ();
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
    if (show_only_bookmarks) setPhotosFiltered (all_photos.filter (item => item.bookmark));
    else setPhotosFiltered (all_photos);
  }, [show_only_bookmarks, all_photos])
  

  useEffect ( () => {
    setLoading (false);
  }, [photos_filtered]);

  const toggleBookmark = (id) => {
    
    setAllPhotos (prev => prev.map (oldItem => {
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
