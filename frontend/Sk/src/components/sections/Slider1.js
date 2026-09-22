import { Link } from 'react-router-dom';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useState, useEffect } from 'react';

const swiperOptions = {
    modules: [Autoplay, Pagination, Navigation, EffectFade],
    effect: 'fade',
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true,
    },
}

const defaultFixedSlides = [
    {
        id: 'default-1',
        subtitle: "SALE UP TO 50% OFF!",
        title: "EMPOWERING YOUR\nFITNESS JOURNEY",
        description: "The platform that turns aspirations into accomplishments. Join now and unleash your potential in the world of fitness and wellness.",
        ctaLabel: "JOIN OUR CLUB",
        ctaLink: "/contact",
        image: "images/slides/bannerv1.jpg",
        eventTag: ''
    },
    {
        id: 'default-2',
        subtitle: "PREMIUM BADMINTON TRAINING",
        title: "MASTER YOUR\nSKILLS WITH US",
        description: "Professional coaching, state-of-the-art facilities, and a community dedicated to helping you achieve your ultimate best.",
        ctaLabel: "DISCOVER MORE",
        ctaLink: "/contact",
        image: "images/slides/bannerv2.jpg",
        eventTag: ''
    }
];

const formatDate = (val) => {
    if (!val) return '';
    const d = new Date(val);
    if (isNaN(d.getTime())) return val;
    const monthShort = d.toLocaleString('default', { month: 'short' }).toUpperCase();
    return `${monthShort} ${d.getDate()}, ${d.getFullYear()}`;
};

function resolveImgUrl(val) {
    if (!val) return '';
    if (val.startsWith('http') || val.startsWith('images/') || val.startsWith('data:') || val.startsWith('/')) return val;
    return '/' + val;
}

export default function Slider1() {
    const [slides, setSlides] = useState(defaultFixedSlides);
    const apiUrl = process.env.REACT_APP_API_URL || '/api';

    useEffect(() => {
        Promise.all([
            fetch(`${apiUrl}/banner`).then(r => r.json()).catch(() => []),
            fetch(`${apiUrl}/events`).then(r => r.json()).catch(() => ({ data: [] }))
        ])
            .then(([bannerData, eventsRes]) => {
                const rawEvents = Array.isArray(eventsRes?.data) ? eventsRes.data : (Array.isArray(eventsRes) ? eventsRes : []);
                // Only pick an event if it is marked as featured (featured === 1 or true)
                const latestEvent = rawEvents.find(e => (e.featured === 1 || e.featured === true || e.featured === '1') && e.status !== 'ended')
                    || rawEvents.find(e => (e.featured === 1 || e.featured === true || e.featured === '1'))
                    || null;
                const formattedDate = latestEvent ? formatDate(latestEvent.event_date) : '';
                const eventState = latestEvent ? {
                    eventTitle: latestEvent.title || '',
                    eventDate: formattedDate,
                    price: latestEvent.price ? '₹' + latestEvent.price : '',
                    time: latestEvent.event_time || '',
                    loc: latestEvent.location || '',
                    image: latestEvent.image || ''
                } : null;

                const defaultSlidesWithEvent = defaultFixedSlides.map(s => ({
                    ...s,
                    eventTag: latestEvent?.title || '',
                    eventDate: formattedDate,
                    eventTime: latestEvent?.event_time || '',
                    eventLocation: latestEvent?.location || '',
                    eventImage: latestEvent?.image || '',
                    eventId: latestEvent?.id || null,
                    eventStateData: eventState
                }));

                if (Array.isArray(bannerData) && bannerData.length > 0) {
                    const activeSlides = bannerData.filter(s => s.enabled !== false && s.enabled !== 0);
                    if (activeSlides.length > 0) {
                        const formatted = activeSlides.map((s, idx) => {
                            return {
                                id: s.id || idx,
                                subtitle: s.subtitle || '',
                                title: s.title || '',
                                description: s.description || '',
                                ctaLabel: s.ctaLabel || 'JOIN OUR CLUB',
                                ctaLink: s.ctaLink || '/contact',
                                image: s.image || (idx % 2 === 0 ? 'images/slides/bannerv1.jpg' : 'images/slides/bannerv2.jpg'),
                                eventImage: (latestEvent && latestEvent.image) ? latestEvent.image : '',
                                eventTag: latestEvent ? latestEvent.title : '',
                                eventDate: formattedDate,
                                eventTime: latestEvent ? latestEvent.event_time : '',
                                eventLocation: latestEvent ? latestEvent.location : '',
                                eventId: latestEvent ? latestEvent.id : null,
                                eventStateData: eventState
                            };
                        });
                        setSlides(formatted);
                        return;
                    }
                }
                setSlides(defaultSlidesWithEvent);
            })
            .catch(err => {
                console.error('Error fetching banners or events:', err);
                setSlides(defaultFixedSlides);
            });
    }, [apiUrl]);

    const displaySlides = slides;

    return (
        <>
            <style>
                {`
                .swiper-slide .flat-sub-slider,
                .swiper-slide .flat-title-slider,
                .swiper-slide .button,
                .swiper-slide .box-events-slide {
                    opacity: 0;
                    transform: translateY(30px);
                    transition: all 0.8s ease-out;
                }
                .swiper-slide-active .flat-sub-slider {
                    opacity: 1;
                    transform: translateY(0);
                    transition-delay: 0.2s;
                }
                .swiper-slide-active .flat-title-slider {
                    opacity: 1;
                    transform: translateY(0);
                    transition-delay: 0.4s;
                }
                .swiper-slide-active .button {
                    opacity: 1;
                    transform: translateY(0);
                    transition-delay: 0.6s;
                }
                .swiper-slide-active .box-events-slide {
                    opacity: 1;
                    transform: translateX(0);
                    transition-delay: 0.8s;
                }
                .swiper-slide:not(.swiper-slide-active) .box-events-slide {
                    transform: translateX(40px);
                }
                @media (max-width: 991px) {
                    .swiper-slide-active .box-events-slide {
                        transform: translateY(0) !important;
                    }
                    .swiper-slide:not(.swiper-slide-active) .box-events-slide {
                        transform: translateY(25px) !important;
                    }
                }
                `}
            </style>
            <Swiper {...swiperOptions} className="tf-slider-widget swiper mySwiper">
                <div className="tf-slider swiper-wrapper">
                    {displaySlides.map((s, idx) => (
                        <SwiperSlide key={idx} className="tf-banner swiper-slide">
                            <div className="image-slider">
                                <img src={resolveImgUrl(s.image)} alt="image" />
                                <div className="overlay" />
                            </div>
                            <div className="themeflat-container">
                                <div className={`slide-item ${(s.eventId || s.eventTag) ? 'has-upcoming-event' : 'no-upcoming-event'}`}>
                                    <div className="silde-content">
                                        <span className="flat-sub-slider">{s.subtitle}</span>
                                        <h1 className="flat-title-slider" style={{ whiteSpace: 'pre-line' }}>{s.title}</h1>
                                        {s.description && <p className="flat-sub-slider" style={{ color: 'white', textTransform: 'none', fontWeight: 400, marginTop: '20px', marginBottom: '30px', maxWidth: '550px', fontSize: '16px', lineHeight: '1.6' }}>{s.description}</p>}
                                        <div className="button">
                                            {s.ctaLabel?.toUpperCase().includes('JOIN') ? (
                                                <a 
                                                    href="#membership" 
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        window.dispatchEvent(new CustomEvent('open-membership-modal'));
                                                    }} 
                                                    className="flat-button"
                                                    style={{ cursor: 'pointer', textDecoration: 'none' }}
                                                >
                                                    {s.ctaLabel}
                                                </a>
                                            ) : (
                                                <Link to={s.ctaLink || "/contact"} className="flat-button">{s.ctaLabel}</Link>
                                            )}
                                        </div>
                                    </div>
                                    {(s.eventId || s.eventTag) && (
                                        <div className="box-events-slide">
                                            <span className="new-event">NEW EVENT </span>
                                            <img src={resolveImgUrl(s.eventImage || s.image)} alt="" className="new-event" style={{ objectFit: 'cover' }} />
                                            <div className="content-event">
                                                <h2 className="title-event"><Link to={s.eventId ? "/event-details" : "/events"} state={s.eventId ? s.eventStateData : null}>{s.eventTag}</Link></h2>
                                                <ul>
                                                    <li><Link to={s.eventId ? "/event-details" : "/events"} state={s.eventId ? s.eventStateData : null}>{s.eventDate}</Link></li>
                                                    <li><Link to={s.eventId ? "/event-details" : "/events"} state={s.eventId ? s.eventStateData : null}>{s.eventTime}</Link></li>
                                                    <li><Link to={s.eventId ? "/event-details" : "/events"} state={s.eventId ? s.eventStateData : null}>{s.eventLocation}</Link></li>
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </div>
                <div className="swiper-pagination" />
            </Swiper>
        </>
    )
}


