import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../../stylesheets/new-event.css';

export default function Event1() {
    const [events, setEvents] = useState([]);
    const apiUrl = process.env.REACT_APP_API_URL || '/api';

    useEffect(() => {
        fetch(`${apiUrl}/events`)
            .then(r => r.json())
            .then(data => {
                if (data.success && data.data) {
                    // Only display events on the homepage if "Feature on homepage" is enabled in Admin
                    const featuredOnly = data.data.filter(e => e.featured === 1 || e.featured === true || e.featured === '1');
                    setEvents(featuredOnly.slice(0, 3));
                }
            })
            .catch(console.error);
    }, [apiUrl]);

    const getMonth = (dateString) => new Date(dateString).toLocaleString('default', { month: 'short' }).toUpperCase();
    const getDay = (dateString) => new Date(dateString).getDate();

    if (events.length === 0) {
        return null;
    }

    return (
        <>
            <div className="tf-widget-event main-content-medium">
                <div className="themeflat-container">
                    <div className="tf-title-wrap title-medium">
                        <div className="title-box-v2">
                            <span className="sub-title wow fadeInUp animated" style={{ color: '#C3E92D' }}>upcoming events</span>
                            <h2 className="title-section wow fadeInUp animated text-white">Tournaments Coming Up</h2>
                        </div>
                        <Link to="/event" className="view-more text-white wow fadeInUp animated">View all
                            <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_6559_2625)">
                                    <path d="M5.25 4.5L12.75 12L5.25 19.5" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M12.75 4.5L20.25 12L12.75 19.5" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                </g>
                            </svg>
                        </Link>
                    </div>

                    <div className="events-premium-container" style={{ background: 'transparent', padding: '10px 0 0 0' }}>
                        {events.map((e, index) => (
                            <div className="event-row wow fadeInUp animated" data-wow-delay={`${0.15 * (index + 1)}s`} key={index}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    {e.status && (
                                        <div style={{
                                            fontSize: '11px',
                                            fontWeight: '600',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px',
                                            backgroundColor: e.status === 'upcoming' ? '#faad14' : e.status === 'ongoing' ? '#52c41a' : '#8c8c8c',
                                            color: '#fff',
                                            padding: '2px 6px',
                                            borderRadius: '4px',
                                            marginBottom: '8px'
                                        }}>
                                            {e.status}
                                        </div>
                                    )}
                                    <div className="bib"><span className="day">{getDay(e.event_date)}</span><span className="month">{getMonth(e.event_date)}</span></div>
                                </div>
                                <div className="details">
                                    <h3>{e.title}</h3>
                                    <div className="meta">
                                        <span>{e.event_time}</span>
                                        <span>{e.location}</span>
                                    </div>
                                </div>
                                <div className="action">
                                    <div className="price">₹{e.price}<small>/ entry</small></div>
                                    <Link to="/event-details" state={{ eventTitle: e.title, eventDate: e.event_date, price: '₹' + e.price, time: e.event_time, loc: e.location, image: e.image }} className="btn">Learn more</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

