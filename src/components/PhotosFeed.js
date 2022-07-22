import React, { useEffect, useState } from 'react'
import { Loading } from './static/Loading';
import { NoItems } from './static/NoItems';
import ImageGallery from 'react-image-gallery'

export const PhotosFeed = () => {

  const feed_url_photos_WTA = 'https://www.wtatennis.com/rss-photos.xml';

  const [loading, setLoading]      = useState (true);
  const [all_photos, setAllPhotos] = useState ([]);
  
  useEffect (() => {
    
    const getAllPhotos = async () => {
    
      let cors_prefix = '';
      if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") cors_prefix = "http://localhost:8080/";

      const text   = await fetch(cors_prefix + feed_url_photos_WTA).then(r => r.text());
      const xmlDoc = new DOMParser().parseFromString (text, "text/xml");
      
      const all_photos_new = Array.from (xmlDoc.querySelectorAll ("item")).map ( (item, index) => {
        
        let id            = 'wta-' + index;
        let img_obj       = item.getElementsByTagName ("media:thumbnail")[0];
        let url           = img_obj.getAttribute ('url');
        let alt           = item.querySelector ('title').text;

        let link = item.querySelector ("link").textContent;
        
        return {id, originalAlt: alt, original: url, thumbnail: url};
      });

      setAllPhotos (all_photos_new);

    };
    
    getAllPhotos ();
  }, [])
  

  useEffect ( () => {

    console.log (all_photos);
    setLoading (false);
  }, [all_photos]);


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
          ! loading && all_photos.length > 0 && (<ImageGallery items={all_photos} showIndex={true} showThumbnails={false} showPlayButton={false}/>)
      }
    </div>
  )
}
