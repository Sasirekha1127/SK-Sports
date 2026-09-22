import React, { useState, useEffect } from "react";

export default function ModalMembership({ isMembership, handleMembership }) {
	const apiUrl = process.env.REACT_APP_API_URL || '/api';

	const initialFormData = {
		name: '',
		phone: '',
		email: '',
		dob: '',
		gender: 'Male',
		sport: 'Badminton',
		skill_level: 'Beginner',
		training_time: 'Morning',
		message: ''
	};

	const [formData, setFormData] = useState(initialFormData);
	const [errors, setErrors] = useState({});
	const [touched, setTouched] = useState({});
	const [submitting, setSubmitting] = useState(false);
	const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: string }

	// Lock body scroll when modal is open to prevent background scrolling on mobile
	useEffect(() => {
		if (isMembership) {
			const originalOverflow = document.body.style.overflow;
			document.body.style.overflow = 'hidden';
			return () => {
				document.body.style.overflow = originalOverflow;
			};
		}
	}, [isMembership]);

	// Auto-dismiss success notification and close popup after 2.5 seconds
	useEffect(() => {
		if (status?.type === 'success') {
			const timer = setTimeout(() => {
				setStatus(null);
				setFormData(initialFormData);
				setTouched({});
				setErrors({});
				if (handleMembership) {
					handleMembership();
				}
			}, 2500);
			return () => clearTimeout(timer);
		}
	}, [status, handleMembership]);

	// Listen for Escape key to close modal
	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === 'Escape' && isMembership) {
				handleMembership();
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [isMembership, handleMembership]);

	const validateField = (name, value) => {
		const val = (value || '').trim();
		switch (name) {
			case 'name':
				if (!val) return 'Full Name is required';
				if (val.length < 2) return 'Full Name must be at least 2 characters';
				if (!/^[a-zA-Z\s.'-]+$/.test(val)) return 'Name can only contain letters and spaces';
				return '';
			case 'phone': {
				if (!val) return 'Mobile Number is required';
				const digits = val.replace(/\D/g, '');
				if (digits.length !== 10) return 'Enter a valid 10-digit mobile number';
				return '';
			}
			case 'email':
				if (val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
					return 'Please enter a valid email address';
				}
				return '';
			case 'sport':
				if (!val) return 'Please select a sport';
				return '';
			default:
				return '';
		}
	};

	const handleChange = (e) => {
		let { name, value } = e.target;
		// Strict numeric filter for mobile number (only digits, max 10 chars)
		if (name === 'phone') {
			value = value.replace(/\D/g, '').slice(0, 10);
		}
		setFormData(prev => ({ ...prev, [name]: value }));

		if (touched[name]) {
			const err = validateField(name, value);
			setErrors(prev => ({ ...prev, [name]: err }));
		}
	};

	const handleBlur = (e) => {
		const { name, value } = e.target;
		setTouched(prev => ({ ...prev, [name]: true }));
		const err = validateField(name, value);
		setErrors(prev => ({ ...prev, [name]: err }));
	};

	const handlePillSelect = (fieldName, optionValue) => {
		setFormData(prev => ({ ...prev, [fieldName]: optionValue }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const checkFields = ['name', 'phone', 'email', 'sport'];
		const newTouched = {};
		const newErrors = {};

		checkFields.forEach(f => {
			newTouched[f] = true;
			const err = validateField(f, formData[f]);
			if (err) newErrors[f] = err;
		});

		setTouched(prev => ({ ...prev, ...newTouched }));
		setErrors(newErrors);

		if (Object.keys(newErrors).length > 0) {
			setStatus({ type: 'error', message: 'Please fix the highlighted errors before submitting.' });
			return;
		}

		setSubmitting(true);
		setStatus(null);

		try {
			const payload = {
				name: formData.name.trim(),
				phone: formData.phone.trim(),
				email: formData.email.trim(),
				dob: formData.dob || '',
				gender: formData.gender,
				sport: formData.sport,
				skill_level: formData.skill_level,
				training_time: formData.training_time,
				message: formData.message.trim()
			};

			const res = await fetch(`${apiUrl}/register`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});

			const data = await res.json();
			if (res.ok && data.success) {
				setStatus({
					type: 'success',
					message: 'Thank you for submitting! Welcome to SK Sports Academy. Returning in 2 seconds...'
				});
			} else {
				setStatus({
					type: 'error',
					message: data.message || 'Failed to submit membership request. Please try again.'
				});
			}
		} catch (err) {
			console.error('Membership form submit error:', err);
			setStatus({
				type: 'error',
				message: 'Network error. Please check your connection and try again.'
			});
		} finally {
			setSubmitting(false);
		}
	};

	if (!isMembership) return null;

	return (
		<>
			{/* Backdrop Overlay */}
			<div 
				className="sk-membership-backdrop" 
				onClick={handleMembership}
				aria-hidden="true"
			/>

			{/* Modal Container */}
			<div 
				className="sk-membership-container"
				role="dialog"
				aria-modal="true"
				aria-labelledby="sk-membership-title"
			>
				{/* Header Section */}
				<div className="sk-membership-header">
					{/* Close Button */}
					<button 
						type="button" 
						className="sk-membership-close-btn"
						onClick={handleMembership}
						aria-label="Close membership modal"
					>
						✕
					</button>

					<div className="sk-membership-title-row">
						<span className="sk-membership-icon" role="img" aria-label="Badminton racket">🏸</span>
						<h2 id="sk-membership-title" className="sk-membership-title">
							JOIN <span className="sk-membership-badge">SK SPORTS</span>
						</h2>
					</div>
					<p className="sk-membership-subtitle">
						Start your journey with SK Sports today.
					</p>
				</div>

				{/* Status Alert */}
				{status && (
					<div 
						className={`sk-membership-status ${status.type === 'success' ? 'status-success' : 'status-error'}`}
						role="alert"
					>
						<span style={{ fontSize: '16px' }}>{status.type === 'success' ? '🎉' : '⚠️'}</span>
						<span>{status.message}</span>
					</div>
				)}

				{/* Form Body */}
				<form onSubmit={handleSubmit} className="sk-membership-form" noValidate>
					<div className="sk-membership-grid">
						{/* Full Name * */}
						<div className="sk-membership-field">
							<label htmlFor="membership-name" className="sk-membership-label">
								Full Name <span className="sk-membership-required">*</span>
							</label>
							<input
								id="membership-name"
								type="text"
								name="name"
								placeholder="e.g. Anand Kumar"
								value={formData.name}
								onChange={handleChange}
								onBlur={handleBlur}
								className={`sk-membership-input ${errors.name ? 'has-error' : ''}`}
							/>
							{errors.name && (
								<span className="sk-membership-error-msg">{errors.name}</span>
							)}
						</div>

						{/* Mobile Number * (strict numbers only, max 10) */}
						<div className="sk-membership-field">
							<label htmlFor="membership-phone" className="sk-membership-label">
								Mobile Number <span className="sk-membership-required">*</span>
							</label>
							<input
								id="membership-phone"
								type="tel"
								name="phone"
								inputMode="numeric"
								placeholder="10-digit mobile number"
								value={formData.phone}
								onChange={handleChange}
								onBlur={handleBlur}
								maxLength={10}
								className={`sk-membership-input ${errors.phone ? 'has-error' : ''}`}
							/>
							{errors.phone && (
								<span className="sk-membership-error-msg">{errors.phone}</span>
							)}
						</div>

						{/* Email Address */}
						<div className="sk-membership-field">
							<label htmlFor="membership-email" className="sk-membership-label">
								Email Address
							</label>
							<input
								id="membership-email"
								type="email"
								name="email"
								placeholder="e.g. anand@gmail.com"
								value={formData.email}
								onChange={handleChange}
								onBlur={handleBlur}
								className={`sk-membership-input ${errors.email ? 'has-error' : ''}`}
							/>
							{errors.email && (
								<span className="sk-membership-error-msg">{errors.email}</span>
							)}
						</div>

						{/* Date of Birth */}
						<div className="sk-membership-field">
							<label htmlFor="membership-dob" className="sk-membership-label">
								Date of Birth
							</label>
							<input
								id="membership-dob"
								type="date"
								name="dob"
								value={formData.dob}
								onChange={handleChange}
								className="sk-membership-input"
							/>
						</div>

						{/* Sport Interested In * */}
						<div className="sk-membership-field">
							<label htmlFor="membership-sport" className="sk-membership-label">
								Sport Interested In <span className="sk-membership-required">*</span>
							</label>
							<select
								id="membership-sport"
								name="sport"
								value={formData.sport}
								onChange={handleChange}
								className={`sk-membership-select ${errors.sport ? 'has-error' : ''}`}
							>
								<option value="Badminton">Badminton</option>
								<option value="Cricket">Cricket</option>
								<option value="Tennis">Tennis</option>
								<option value="Other">Other</option>
							</select>
							{errors.sport && (
								<span className="sk-membership-error-msg">{errors.sport}</span>
							)}
						</div>

						{/* Skill Level */}
						<div className="sk-membership-field">
							<label htmlFor="membership-skill" className="sk-membership-label">
								Skill Level
							</label>
							<select
								id="membership-skill"
								name="skill_level"
								value={formData.skill_level}
								onChange={handleChange}
								className="sk-membership-select"
							>
								<option value="Beginner">Beginner</option>
								<option value="Intermediate">Intermediate</option>
								<option value="Advanced">Advanced</option>
							</select>
						</div>

						{/* Gender */}
						<div className="sk-membership-field">
							<label className="sk-membership-label">
								Gender
							</label>
							<div className="sk-membership-pill-group" role="group" aria-label="Select Gender">
								{['Male', 'Female', 'Other'].map((g) => {
									const isSelected = formData.gender === g;
									return (
										<button
											type="button"
											key={g}
											onClick={() => handlePillSelect('gender', g)}
											className={`sk-membership-pill ${isSelected ? 'active' : ''}`}
											aria-pressed={isSelected}
										>
											{g}
										</button>
									);
								})}
							</div>
						</div>

						{/* Preferred Training Time */}
						<div className="sk-membership-field">
							<label className="sk-membership-label">
								Preferred Training Time
							</label>
							<div className="sk-membership-pill-group" role="group" aria-label="Select Preferred Training Time">
								{['Morning', 'Evening', 'Flexible'].map((t) => {
									const isSelected = formData.training_time === t;
									return (
										<button
											type="button"
											key={t}
											onClick={() => handlePillSelect('training_time', t)}
											className={`sk-membership-pill ${isSelected ? 'active' : ''}`}
											aria-pressed={isSelected}
										>
											{t}
										</button>
									);
								})}
							</div>
						</div>
					</div>

					{/* Message / Additional Requirements (full width) */}
					<div className="sk-membership-field" style={{ marginTop: '16px' }}>
						<label htmlFor="membership-message" className="sk-membership-label">
							Message / Additional Requirements <span style={{ color: '#94a3b8', fontWeight: 400 }}>(optional)</span>
						</label>
						<textarea
							id="membership-message"
							name="message"
							rows={3}
							placeholder="Mention any specific goals, coaching preferences, or prior sports experience..."
							value={formData.message}
							onChange={handleChange}
							className="sk-membership-textarea"
						/>
					</div>

					{/* Submit Button */}
					<div className="sk-membership-actions">
						<button
							type="submit"
							disabled={submitting}
							className="sk-membership-submit-btn"
						>
							{submitting ? (
								<>
									<span className="sk-membership-spinner" />
									<span>SUBMITTING...</span>
								</>
							) : (
								<>
									<span>JOIN NOW</span>
									<span style={{ fontSize: '15px' }}>🟢</span>
								</>
							)}
						</button>
					</div>
				</form>
			</div>

			{/* Responsive Styles & Animations */}
			<style>{`
				.sk-membership-backdrop {
					position: fixed;
					top: 0;
					left: 0;
					width: 100vw;
					height: 100vh;
					background-color: rgba(15, 23, 42, 0.65);
					backdrop-filter: blur(8px);
					-webkit-backdrop-filter: blur(8px);
					z-index: 99998;
					animation: skFadeIn 0.25s ease-out forwards;
				}

				.sk-membership-container {
					position: fixed;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
					width: calc(100% - 24px);
					max-width: 680px;
					max-height: calc(100dvh - 32px);
					background-color: #ffffff;
					color: #0f172a;
					border-radius: 16px;
					border: 1px solid #e2e8f0;
					box-shadow: 0 25px 60px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.04);
					z-index: 99999;
					overflow-y: auto;
					-webkit-overflow-scrolling: touch;
					overscroll-behavior: contain;
					font-family: "Outfit", "Inter", "Barlow", sans-serif;
					animation: skPopIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
					box-sizing: border-box;
				}

				@media (min-width: 641px) {
					.sk-membership-container {
						width: 92%;
						border-radius: 20px;
						max-height: min(90vh, 880px);
					}
				}

				.sk-membership-header {
					padding: 16px 52px 14px 18px;
					border-bottom: 1px solid #edf2f7;
					position: relative;
					display: flex;
					flex-direction: column;
					align-items: center;
					text-align: center;
					background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
					box-sizing: border-box;
				}

				@media (min-width: 641px) {
					.sk-membership-header {
						padding: 24px 30px 18px;
					}
				}

				.sk-membership-close-btn {
					position: absolute;
					top: 14px;
					right: 14px;
					background: #f1f5f9;
					border: 1px solid #e2e8f0;
					color: #475569;
					border-radius: 50%;
					width: 34px;
					height: 34px;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 15px;
					cursor: pointer;
					transition: all 0.2s ease;
					line-height: 1;
					z-index: 3;
				}

				@media (min-width: 641px) {
					.sk-membership-close-btn {
						top: 20px;
						right: 22px;
						width: 36px;
						height: 36px;
						font-size: 17px;
					}
				}

				.sk-membership-close-btn:hover {
					background: #C7F000;
					color: #000000;
					border-color: #a3e635;
				}

				.sk-membership-title-row {
					display: inline-flex;
					align-items: center;
					justify-content: center;
					gap: 8px;
					margin-bottom: 4px;
					flex-wrap: wrap;
				}

				.sk-membership-icon {
					font-size: 20px;
					line-height: 1;
				}

				@media (min-width: 641px) {
					.sk-membership-icon {
						font-size: 24px;
					}
				}

				.sk-membership-title {
					margin: 0;
					font-size: clamp(17px, 4.5vw, 24px);
					font-weight: 800;
					letter-spacing: 0.6px;
					color: #0f172a;
					text-transform: uppercase;
					display: inline-flex;
					align-items: center;
					gap: 6px;
					line-height: 1.25;
				}

				.sk-membership-badge {
					background-color: #C7F000;
					color: #0a0e14;
					padding: 2px 8px;
					border-radius: 6px;
					box-shadow: 0 2px 8px rgba(199, 240, 0, 0.45);
					white-space: nowrap;
					display: inline-block;
				}

				.sk-membership-subtitle {
					margin: 2px 0 0;
					font-size: 13px;
					color: #64748b;
					font-weight: 500;
					line-height: 1.4;
				}

				@media (min-width: 641px) {
					.sk-membership-subtitle {
						font-size: 14px;
					}
				}

				.sk-membership-status {
					margin: 14px 16px 0;
					padding: 11px 14px;
					border-radius: 10px;
					font-size: 13px;
					display: flex;
					align-items: center;
					gap: 8px;
					font-weight: 600;
					line-height: 1.4;
				}

				@media (min-width: 641px) {
					.sk-membership-status {
						margin: 18px 30px 0;
						padding: 12px 18px;
						font-size: 14px;
						gap: 10px;
					}
				}

				.sk-membership-status.status-success {
					background-color: #f0fdf4;
					color: #15803d;
					border: 1px solid #bbf7d0;
				}

				.sk-membership-status.status-error {
					background-color: #fef2f2;
					color: #b91c1c;
					border: 1px solid #fecaca;
				}

				.sk-membership-form {
					padding: 16px 16px 20px;
					box-sizing: border-box;
				}

				@media (min-width: 641px) {
					.sk-membership-form {
						padding: 22px 30px 28px;
					}
				}

				.sk-membership-grid {
					display: grid;
					grid-template-columns: 1fr;
					gap: 14px;
				}

				@media (min-width: 641px) {
					.sk-membership-grid {
						grid-template-columns: repeat(2, 1fr);
						gap: 18px 22px;
					}
				}

				.sk-membership-field {
					display: flex;
					flex-direction: column;
					min-width: 0;
				}

				.sk-membership-label {
					display: block;
					font-size: 13px;
					font-weight: 700;
					color: #334155;
					margin-bottom: 6px;
					line-height: 1.3;
				}

				.sk-membership-required {
					color: #e11d48;
				}

				.sk-membership-input,
				.sk-membership-select,
				.sk-membership-textarea {
					width: 100%;
					padding: 10px 13px;
					background-color: #f8fafc;
					color: #0f172a;
					border: 1px solid #cbd5e1;
					border-radius: 10px;
					font-size: 16px; /* 16px on mobile prevents iOS Safari auto-zoom */
					font-family: inherit;
					outline: none;
					box-sizing: border-box;
					min-height: 44px;
					transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
				}

				@media (min-width: 641px) {
					.sk-membership-input,
					.sk-membership-select,
					.sk-membership-textarea {
						font-size: 14px;
						min-height: 42px;
						padding: 11px 14px;
					}
				}

				.sk-membership-input:focus,
				.sk-membership-select:focus,
				.sk-membership-textarea:focus {
					border-color: #84cc16;
					background-color: #ffffff;
					box-shadow: 0 0 0 3px rgba(199, 240, 0, 0.35);
				}

				.sk-membership-input.has-error,
				.sk-membership-select.has-error {
					border-color: #ef4444 !important;
				}

				.sk-membership-input.has-error:focus,
				.sk-membership-select.has-error:focus {
					box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.25) !important;
				}

				.sk-membership-select {
					cursor: pointer;
					appearance: none;
					-webkit-appearance: none;
					background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23475569'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
					background-repeat: no-repeat;
					background-position: right 14px center;
					background-size: 16px 16px;
					padding-right: 38px;
				}

				.sk-membership-input[type="date"] {
					color-scheme: light;
				}

				.sk-membership-textarea {
					resize: vertical;
					min-height: 80px;
				}

				.sk-membership-error-msg {
					font-size: 12px;
					color: #dc2626;
					margin-top: 4px;
					display: block;
					font-weight: 500;
				}

				.sk-membership-pill-group {
					display: flex;
					gap: 6px;
					width: 100%;
					box-sizing: border-box;
				}

				@media (min-width: 641px) {
					.sk-membership-pill-group {
						gap: 8px;
					}
				}

				.sk-membership-pill {
					flex: 1 1 0;
					min-width: 0;
					min-height: 42px;
					padding: 8px 4px;
					border-radius: 8px;
					border: 1px solid #e2e8f0;
					background-color: #f1f5f9;
					color: #475569;
					font-weight: 600;
					font-size: clamp(11.5px, 2.7vw, 13px);
					cursor: pointer;
					transition: all 0.2s ease;
					text-align: center;
					display: flex;
					align-items: center;
					justify-content: center;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					user-select: none;
					-webkit-tap-highlight-color: transparent;
				}

				@media (min-width: 641px) {
					.sk-membership-pill {
						padding: 9px 12px;
						font-size: 13px;
					}
				}

				.sk-membership-pill.active {
					border-color: #a3e635;
					background-color: #C7F000;
					color: #0a0e14;
					font-weight: 800;
					box-shadow: 0 2px 8px rgba(199, 240, 0, 0.45);
				}

				.sk-membership-pill:active {
					transform: scale(0.97);
				}

				.sk-membership-actions {
					margin-top: 20px;
					text-align: center;
				}

				@media (min-width: 641px) {
					.sk-membership-actions {
						margin-top: 24px;
					}
				}

				.sk-membership-submit-btn {
					width: 100%;
					max-width: 100%;
					min-height: 48px;
					padding: 13px 20px;
					background-color: #C7F000;
					color: #0a0e14;
					border: none;
					border-radius: 12px;
					font-size: 15px;
					font-weight: 800;
					text-transform: uppercase;
					letter-spacing: 0.8px;
					cursor: pointer;
					box-shadow: 0 4px 20px rgba(199, 240, 0, 0.45);
					transition: all 0.25s ease;
					display: inline-flex;
					align-items: center;
					justify-content: center;
					gap: 8px;
					-webkit-tap-highlight-color: transparent;
				}

				@media (min-width: 641px) {
					.sk-membership-submit-btn {
						max-width: 380px;
						padding: 14px 28px;
						font-size: 16px;
						gap: 10px;
					}
				}

				.sk-membership-submit-btn:not(:disabled):hover {
					background-color: #bfe800;
					transform: translateY(-2px);
					box-shadow: 0 6px 24px rgba(199, 240, 0, 0.6);
				}

				.sk-membership-submit-btn:not(:disabled):active {
					transform: translateY(0);
					box-shadow: 0 2px 10px rgba(199, 240, 0, 0.4);
				}

				.sk-membership-submit-btn:disabled {
					cursor: not-allowed;
					opacity: 0.75;
				}

				.sk-membership-spinner {
					width: 18px;
					height: 18px;
					border: 2px solid #000;
					border-top-color: transparent;
					border-radius: 50%;
					display: inline-block;
					animation: skSpin 0.7s linear infinite;
				}

				@keyframes skFadeIn {
					from { opacity: 0; }
					to { opacity: 1; }
				}

				@keyframes skPopIn {
					from {
						opacity: 0;
						transform: translate(-50%, -46%) scale(0.96);
					}
					to {
						opacity: 1;
						transform: translate(-50%, -50%) scale(1);
					}
				}

				@keyframes skSpin {
					to { transform: rotate(360deg); }
				}

				.sk-membership-container::-webkit-scrollbar {
					width: 6px;
				}

				.sk-membership-container::-webkit-scrollbar-track {
					background: #f8fafc;
				}

				.sk-membership-container::-webkit-scrollbar-thumb {
					background: #cbd5e1;
					border-radius: 4px;
				}

				.sk-membership-container::-webkit-scrollbar-thumb:hover {
					background: #94a3b8;
				}
			`}</style>
		</>
	);
}
