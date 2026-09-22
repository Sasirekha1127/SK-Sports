import CountUp from 'react-countup';
import { useState, useEffect } from 'react';

export default function Counter() {
    const [counters, setCounters] = useState([]);
    const apiUrl = process.env.REACT_APP_API_URL || '/api';

    useEffect(() => {
        fetch(`${apiUrl}/settings`)
            .then(r => r.json())
            .then(data => {
                if(data.homepage_data) {
                    const hp = JSON.parse(data.homepage_data);
                    if(hp.counters) setCounters(hp.counters);
                }
            })
            .catch(console.error);
    }, [apiUrl]);

return (
<>
<div className="tf-widget-counter background-black main-content">
<div className="themeflat-container">
<div className="row wrap-counter align-items-center">
                        {counters.map((c, i) => (
<div className="col-12 col-sm-6 col-md-6 col-lg-3 counter-item" key={i}>
<div className="counter-box wow fadeInUp animated text-center">
<div className="number-content">
<CountUp end={c.value} className="number" />
</div>
<div className="title-content">{c.label}</div>
</div>
</div>
                        ))}
</div>
</div>
</div>
</>
)
}


