import React, { useState } from 'react'

export const Configuration = () => {

    const [modo_oscuro, setModoOscuro] = useState(false);
    const [feeds_url, setFeedsUrl] = useState ([
        {id: 'usa', url: 'https://ftw.usatoday.com/category/tennis/feed', name: 'USA Today - Tennis', 'active': true},
        {id: 'espn', url: 'https://www.espn.com/espn/rss/tennis/news/', name: 'ESPN - Tennis', 'active': true},
        {id: 'univ', url: 'https://blog.universaltennis.com/feed/', name: 'Universal Tennis', 'active': true},
        {id: 'aus', url: 'https://feeds.feedburner.com/tennis-australia', name: 'Tennis Australia', 'active': true}
    ]);
    
    return (
        <div className='configuration'>
            <div className='container'>
                <div className="row mt-3">
                    <div className='col-md-12'>
                        <div className="form-check form-switch">
                            <label className="form-check-label" for="modo-claro">Modo Claro</label>
                            <input className="form-check-input" type="checkbox" id="modo-claro" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
