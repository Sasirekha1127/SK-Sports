import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

export default function Partner() {
    const [partners, setPartners] = useState([]);
    const apiUrl = process.env.REACT_APP_API_URL || '/api';

    useEffect(() => {
        fetch(`${apiUrl}/partners`)
            .then(r => r.json())
            .then(data => {
                if(data && Array.isArray(data)) setPartners(data);
            })
            .catch(console.error);
    }, [apiUrl]);

return (
<>
<div className="tf-widget-partner">
<div className="themeflat-container">
<div className="wrap-partner line-bottom">
<Swiper
modules={[Autoplay]}
spaceBetween={30}
slidesPerView={2}
autoplay={{ delay: 3000 }}
breakpoints={{
576: { slidesPerView: 3 },
768: { slidesPerView: 4 },
992: { slidesPerView: 5 },
1200: { slidesPerView: 6 },
}}
>
                            {partners.length > 0 ? partners.map((p, index) => (
                                <SwiperSlide key={index}>
                                    <div className="partner-item">
                                        <img src={p.logo || "images/retinal/1.png"} alt={p.name} />
                                    </div>
                                </SwiperSlide>
                            )) : null}
</Swiper>
</div>
</div>
</div>
</>
)
}

