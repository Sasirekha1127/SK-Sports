import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function About1() {
    const [aboutData, setAboutData] = useState({});
    const apiUrl = process.env.REACT_APP_API_URL || '/api';

    useEffect(() => {
        fetch(`${apiUrl}/about`)
            .then(r => r.json())
            .then(data => {
                if (data && Object.keys(data).length > 0) {
                    setAboutData(data);
                }
            })
            .catch(console.error);
    }, [apiUrl]);

    return (
        <>
            <div className="tf-widget-about-us main-content">
                <div className="themeflat-container">
                    <div className="tf-about-us">
                        <div className="row">
                            <div className="col-lg-6 col-12 image-wraper">
                                <div className="media">
                                    <div className="media-v1 wow fadeInLeft animated">
                                        <img className="mask-media about-main-img" src={aboutData.image || "images/about/badminton-court.png"} alt="SK Sports Academy" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 col-12">
                                <div className="about-box">
                                    <div className="title-box title-small-v2">
                                        <span className="sub-title wow fadeInUp animated">{aboutData.subtitle || 'Welcome to SK Sports!'}</span>
                                        <h2 className="title-section wow fadeInUp animated">{aboutData.title || 'SK Sports - Your Ultimate Badminton Academy'}</h2>
                                    </div>
                                    <div className="about-body-text wow fadeInUp animated">
                                        {aboutData.body ? aboutData.body.split(/\n\n+/).filter(Boolean).map((para, idx) => (
                                            <p key={idx} className="post" style={{ marginBottom: '14px' }}>
                                                {para.trim()}
                                            </p>
                                        )) : (
                                            <p className="post">Join our passionate badminton community...</p>
                                        )}
                                    </div>
                                    <div className="line" />
                                    <div className="about-button-group">
                                        <Link to={aboutData.buttonLink || "/about"} className="flat-button wow fadeInUp animated">{aboutData.buttonLabel || 'Find out more'}</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


