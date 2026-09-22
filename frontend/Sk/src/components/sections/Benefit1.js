import { useState, useEffect } from 'react'

function getImageUrl(val) {
	if (!val) return ''
	if (val.startsWith('http') || val.startsWith('images/') || val.startsWith('data:')) return val
	const baseUrl = (process.env.REACT_APP_API_URL || '/api').replace('/api', '')
	return baseUrl + val
}

export default function Benefit1() {
	const [data, setData] = useState({ benefitsMeta: {}, benefits: [] })
	const apiUrl = process.env.REACT_APP_API_URL || '/api'

	useEffect(() => {
		fetch(`${apiUrl}/settings`)
			.then(r => r.json())
			.then(res => {
				if (res.homepage_data) {
					const hp = JSON.parse(res.homepage_data);
					setData({
						benefitsMeta: hp.benefitsMeta || { subtitle: 'academy benefits', title: 'Benefits of badminton', media: 'images/about/video.mp4' },
						benefits: hp.benefits || [
							{ number: '01', title: 'Be Healthy', description: 'Improve your physical fitness and well-being through regular play.' },
							{ number: '02', title: 'Feel Free', description: 'Experience the freedom and challenging yourself.' },
							{ number: '03', title: 'Be One Of Us', description: 'Join a supportive community of like-minded players.' },
							{ number: '04', title: 'Be Strong', description: 'Build resilience and mental toughness as you push your limits.' }
						]
					});
				}
			})
			.catch(console.error);
	}, [apiUrl]);

	const { benefitsMeta, benefits } = data;
	const leftBenefits = benefits.slice(0, 2);
	const rightBenefits = benefits.slice(2, 4);

	const isVideo = benefitsMeta.media?.toLowerCase()?.endsWith('.mp4') || benefitsMeta.media?.includes('video/');
	const mediaUrl = getImageUrl(benefitsMeta.media);

	return (
		<>
			<div className="tf-widget-benefit background-black">
				<div className="themeflat-container">
					<div className="tf-benefit">
						<div className="title-box-v2 center-title-box title-large">
							<span className="sub-title wow fadeInUp animated">{benefitsMeta.subtitle || 'academy benefits'}</span>
							<h2 className="title-section wow fadeInUp animated">{benefitsMeta.title || 'Benefits of badminton'}</h2>
						</div>

						<div className="benefit-wrap-content">
							<div className="row">
								<div className="col-md-4 benefit-on-left">
									{leftBenefits.map((b, i) => (
										<div className="benefit-item" key={i}>
											<div className="benefit-content">
												<h6 className="title-benefit wow fadeInLeft animated">{b.title}</h6>
												<p className="description-benefit wow fadeInLeft animated">{b.description}</p>
											</div>
											<div className="benefit-number">
												<span className="number wow zoomIn animated">{b.number}</span>
											</div>
										</div>
									))}
								</div>

								<div className="col-md-4 benefit-center ">
									<div className="benefit-video" style={{ position: 'relative', zIndex: 2 }}>
										<img className="d-none d-md-block" src="images/shape2.png" alt="shape" style={{ position: 'absolute', top: '14%', left: '-38%', width: '38%', zIndex: 1, transform: 'scaleY(-1)' }} />
										<img className="d-none d-md-block" src="images/shape2.png" alt="shape" style={{ position: 'absolute', bottom: '14%', left: '-38%', width: '38%', zIndex: 1 }} />
										<img className="d-none d-md-block" src="images/shape1.png" alt="shape" style={{ position: 'absolute', top: '14%', right: '-38%', width: '38%', zIndex: 1, transform: 'scaleY(-1)' }} />
										<img className="d-none d-md-block" src="images/shape1.png" alt="shape" style={{ position: 'absolute', bottom: '14%', right: '-38%', width: '38%', zIndex: 1 }} />

										{isVideo ? (
											<video className="video" src={mediaUrl} autoPlay loop muted playsInline style={{ objectFit: "cover", width: "100%", aspectRatio: "1/1", borderRadius: "50%" }} />
										) : (
											<img className="video" src={mediaUrl} alt="benefit-media" style={{ objectFit: "cover", width: "100%", aspectRatio: "1/1", borderRadius: "50%" }} />
										)}
									</div>
								</div>

								<div className="col-md-4 benefit-on-right">
									{rightBenefits.map((b, i) => (
										<div className="benefit-item" key={i}>
											<div className="benefit-number">
												<span className="number wow zoomIn animated">{b.number}</span>
											</div>
											<div className="benefit-content">
												<h6 className="title-benefit wow fadeInRight animated">{b.title}</h6>
												<p className="description-benefit wow fadeInRight animated">{b.description}</p>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
