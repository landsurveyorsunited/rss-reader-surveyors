import React, { useContext } from 'react'
import { FeedRSSContext } from './context/FeedRSSContext';

export const Configuration = () => {

    const {vars, setVars} = useContext (FeedRSSContext);

    const toggleFeed = (id) => {

        setVars ((prev) => prev.map (oldFeed => {
            if (oldFeed.id === id) {
                return {
                    ...oldFeed,
                    active: !oldFeed.active
                }
            }
            
            return oldFeed;
        }));
    }
        
    return (
        <div className='configuration'>
            <div className='container'>
                <div className="row mt-3">
                    <div className='col-md-6 offset-md-3'>
                        <h3 className='text-center'>Fuentes de datos RSS</h3>
                        <div className='rss-sources'>
                            {
                                vars.feeds.map (feed => (
                                    <div key={feed.id} className='item p-3 d-flex justify-content-between align-items-center'>

                                        { feed.active ? (
                                            <>
                                                <a href={feed.url} className='text text-primary mr-3 fw-bold' target="_blank" rel="noreferrer" title="See XML Feed">{feed.name}</a>
                                                <button className='btn btn-outline-danger btn-sm' onClick={toggleFeed (feed.id)}>Desactivar</button> 
                                            </>
                                        ) : (
                                            <>
                                                <a href={feed.url} className='text text-primary mr-3' target="_blank" rel="noreferrer" title="See XML Feed">{feed.name}</a>
                                                <button className='btn btn-outline-success btn-sm' onClick={toggleFeed (feed.id)} >Activar</button>
                                            </>
                                        )}
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className='col-md-12'>
                        <div className="form-check form-switch">
                            <label className="form-check-label" htmlFor="modo-oscuro">Modo Oscuro</label>
                            <input className="form-check-input" type="checkbox" id="modo-claro" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
