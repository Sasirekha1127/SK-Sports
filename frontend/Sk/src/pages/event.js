import { Link } from "react-router-dom"
import Layout from "../components/layout/Layout"
import "../stylesheets/new-event.css"
import { useState, useEffect } from "react"

export default function Event() {
	const [events, setEvents] = useState([]);

	const apiUrl = process.env.REACT_APP_API_URL || '/api';

	useEffect(() => {
		fetch(`${apiUrl}/events`)
			.then(r => r.json())
			.then(data => {
				if (data.success) {
					// Map db fields to frontend structure
					const mappedEvents = data.data.map(item => {
						const dateObj = new Date(item.event_date);
						const monthShort = dateObj.toLocaleString('default', { month: 'short' }).toUpperCase();
						const day = dateObj.getDate();
						const fullDateStr = `${monthShort} ${day}, ${dateObj.getFullYear()}`;

						return {
							id: item.id,
							title: item.title,
							dateObj: dateObj,
							day: day,
							month: monthShort,
							fullDateFormat: fullDateStr,
							time: item.event_time,
							location: item.location.split(' | ')[0] || item.location,
							locationCity: item.location.split(' | ')[1] || 'Pondicherry',
							price: `₹${parseInt(item.price)}`,
							image: item.image || '',
							status: item.status
						};
					});
					setEvents(mappedEvents);
				}
			})
			.catch(console.error);
	}, []);

	return (
		<>
			<Layout headerStyle={1} footerStyle={1} breadcrumbTitle="title">
				<div>
					<div className="page-title">
						<div className="themeflat-container">
							<div className="row">
								<div className="col-md-12">
									<div className="page-title-heading">
										<h1 className="title">Our Events</h1>
									</div>
									<div className="breadcrumbs">
										<ul>
											<li><Link to="/">Homepage</Link></li>
											<li><i className="icon-Arrow---Right-2" /></li>
											<li><a>Our Events</a></li>
										</ul>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="events-premium-container">
						<div className="wrap wow fadeInUp animated">
							<div className="eyebrow"><span className="rule"></span>Upcoming Competitions</div>
							<h1>Matches worth preparing for</h1>
							<p className="sub">A curated line-up of state and local badminton tournaments, from beginner to advanced categories.</p>

							<div className="season">
								<span>2024 Season</span>
								<span>{events.length} events</span>
							</div>

							{events.map((evt, idx) => (
								<div className="event-row wow fadeInUp animated" data-wow-delay={`${0.12 * (idx + 1)}s`} key={idx}>
									<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
										{evt.status && (
											<div style={{
												fontSize: '11px',
												fontWeight: '600',
												textTransform: 'uppercase',
												letterSpacing: '0.5px',
												backgroundColor: evt.status === 'upcoming' ? '#faad14' : evt.status === 'ongoing' ? '#52c41a' : '#8c8c8c',
												color: '#fff',
												padding: '2px 6px',
												borderRadius: '4px',
												marginBottom: '8px'
											}}>
												{evt.status}
											</div>
										)}
										<div className="bib"><span className="day">{evt.day}</span><span className="month">{evt.month}</span></div>
									</div>
									<div className="details">
										<h3>{evt.title}</h3>
										<div className="meta">
											<span>{evt.time}</span>
											<span>{evt.location}</span>
											<span>{evt.locationCity}</span>
										</div>
									</div>
									<div className="action">
										<div className="price">{evt.price}<small>/ entry</small></div>
										<Link to="/event-details" state={{ eventTitle: evt.title, eventDate: evt.fullDateFormat, price: evt.price, time: evt.time, loc: `${evt.location} | ${evt.locationCity}`, image: evt.image }} className="btn">Learn more</Link>
									</div>
								</div>
							))}

						</div>
					</div>
				</div>
			</Layout>
		</>
	)
}