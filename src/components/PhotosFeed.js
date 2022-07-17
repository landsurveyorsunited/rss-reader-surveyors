import React, { useEffect, useState } from 'react'

export const PhotosFeed = () => {

  const CORS_PROXY          = "https://cors-anywhere.herokuapp.com/";
  const feed_url_photos_WTA = 'https://www.wtatennis.com/rss-photos.xml';

  const [loading, setLoading]             = useState (true);
  const [all_photos, setAllPhotos]        = useState ([]);
  const [photosInView, setPhotosInView]   = useState ([]);
  const [photos_by_page, setPhotosByPage] = useState (12);
  const [page, setPage]                   = useState (0);
  const [total_pages, setTotalPages]      = useState (0);
  const [show_only_bookmarks, setShowOnlyBookmarks] = useState (false);
  

  useEffect (() => {
    
    const getAllPhotos = async () => {
    
      /* WTA Photo */
      const wta_text   = await fetch(CORS_PROXY + feed_url_photos_WTA).then(r => r.text());
      const wta_xmlDoc = new DOMParser().parseFromString (wta_text, "text/xml");
      
      const allPhotosWTA = Array.from (wta_xmlDoc.querySelectorAll ("item")).map ( (item, index) => {
        
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

        let date = item.querySelector ("pubDate").textContent;

        return {id, title, description, img: {url: img_url, alt: img_alt}, link, date, bookmark: false};
      });

      setAllPhotos (allPhotosWTA);
    };
    
    getAllPhotos ();
  }, [])
  
  
  useEffect ( () => {
    
    setTotalPages (Math.ceil (all_photos.length / photos_by_page));
    setPage (1);
  }, [all_photos, photos_by_page]);
  
  
  useEffect ( () => {
    
    setPhotosInView (all_photos.slice ((page - 1) * photos_by_page, page * photos_by_page ));
    setLoading (false);
  }, [all_photos, page, photos_by_page]);


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

  }

  const toggleShowOnlyBookmarks = () => {

    setLoading (true);
    setShowOnlyBookmarks (! show_only_bookmarks);
    if (show_only_bookmarks) setPhotosInView (all_photos);
    else setPhotosInView (all_photos.filter (item => item.bookmark));
    setLoading (false);
  }


  const printPages = () => {

    let list = [];
    for (let num_page = 1; num_page <= total_pages; num_page++) {
        list.push (
          <li className="page-item" key={num_page}>
              <button className={"page-link" + ((num_page === page) ? ' active' : '')} onClick={() => setPage (num_page)}>{num_page}</button>
          </li>
        );
    }
    
    return list;
  };

  const updatePhotosByPage = (e) => {

    setLoading (true); 
    setPhotosByPage (e.currentTarget.value); 
    setPage (1);
  };

  return (
    <div className='rss-feed rss-photo-feed'>
      {
          loading && (
            <div className="loading">
              <h3>Loading RSS Feeds...</h3>
            </div>
          )
      }
      {
          ! loading && photosInView.length <= 0 && (
            <div className="loading">
              <h3>RSS Not found.</h3>
            </div>
          )
      }
      {
          ! loading && photosInView.length > 0 && (
            <div className='container-lg'>
              <div className="row mt-3 justify-content-between">
                <div className='col-md-4'>
                  <div class="d-grid gap-2">
                    <button className="btn btn-block btn-outline-primary" onClick={() => toggleShowOnlyBookmarks () }>{show_only_bookmarks ? "Show All Items" : "Show Only Bookmarks"}</button>
                  </div>
                </div>
                <div className='col-md-3'>
                  <select className="form-select" aria-label="" onChange={updatePhotosByPage}>
                    <option value="12" default>Results by page</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="0">50</option>
                  </select>
                </div>
              </div>
              <div className="row mt-3">
                  {
                      photosInView.map ( (item) => {
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
                                    <a href={item.link} className="btn btn-primary float-end mt-2" target="_blank" rel="noreferrer">Go to WTA Gallery</a>
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
        ! loading && (total_pages > 0)  && (
          <div className='container-md'>
            <div className="row">
                <div className="col-12">
                    <nav aria-label="Page navigation">
                        <ul className="pagination justify-content-center">
                            <li className={"page-item " + ((page <= 1) ? 'disabled' : '') }>
                                <button className="page-link" onClick={() => { setLoading(true); setPage (page - 1) }}>Previous</button>
                            </li>
                            {
                                printPages (total_pages)
                            }
                            <li className={"page-item " + ((page > 1) ? 'disabled' : '')}>
                                <button className="page-link" onClick={() => { setLoading (true); setPage (page + 1) }}>Next</button>
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
