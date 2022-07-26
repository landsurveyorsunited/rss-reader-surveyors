import React, { useEffect, useState } from 'react'
import { Loading } from './static/Loading';
import { NoItems } from './static/NoItems';
import ImageGallery from 'react-image-gallery'

export const PhotosFeed = () => {

  const feed_url_photos_WTA = 'https://www.wtatennis.com/rss-photos.xml';

  const [loading, setLoading]      = useState (true);
  const [all_photos, setAllPhotos] = useState ([]);
  
  useEffect (() => {

    const cors_proxy = process.env.REACT_APP_CORS_PROXY  || 'http://localhost';
    const cors_port = process.env.REACT_APP_CORS_PORT || 8080;
    
    const getAllPhotos = async () => {
    
      const text   = await fetch(cors_proxy + ':' + cors_port + '/' + feed_url_photos_WTA).then(r => r.text()).catch ( err => { console.error (err); setAllPhotos ([]); setLoading (false); });
      const xmlDoc = new DOMParser().parseFromString (text, "text/xml");
      
      const all_photos_new = Array.from (xmlDoc.querySelectorAll ("item")).map ( (item, index) => {
        
        let id            = 'wta-' + index;
        let img_obj       = item.getElementsByTagName ("media:thumbnail")[0];
        let url           = img_obj.getAttribute ('url');
        let title         = item.querySelector ('title').text;
        
        return {id, originalTitle: title, originalAlt: title, original: url, thumbnail: url};
      });

      setAllPhotos (all_photos_new);
      setLoading (false);
    };
    
    getAllPhotos ();
  }, [])
  

  return (
    <div className='rss-photos-feed mt-5'>
      {
          (loading) && (
            <Loading />
          )
      }
      {
          ! loading && all_photos.length <= 0 && (
            <NoItems />
          )
      }
      {
          ! loading && all_photos.length > 0 && (<ImageGallery items={all_photos} showIndex={true} showThumbnails={false} showPlayButton={false} disableThumbnailScroll={true} disableThumbnailSwipe={true}/>)
      }
    </div>
  )
}
