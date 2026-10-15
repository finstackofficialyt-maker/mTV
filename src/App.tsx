import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ArrowUpRight,
  ChevronDown,
  CircleCheck,
  Clock3,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Send,
  X,
} from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const phoneNumber = '+447743076630';
const whatsappBaseUrl = `https://wa.me/${phoneNumber.replace('+', '')}`;
const whatsappUrl = `${whatsappBaseUrl}?text=Hi%20MJT%20Private%20Hire%2C%20I%27m%20interested%20in%20booking%20a%20taxi.%20Could%20you%20please%20help%20me%20arrange%20my%20journey%3F`;
const emailAddress = 'mjtprivatehire@gmail.com';
const vehicleImage =
  'https://images.pexels.com/photos/29380883/pexels-photo-29380883.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1800';
const ownerImage = '/image.png';
const carImages = [
  { src: '/images/468595648_559594606781414_8554266109322597724_n.jpg', alt: 'MJT taxi viewed from the rear at sunset' },
  { src: '/images/468731190_559063850167823_2812560131757608398_n.jpg', alt: 'MJT taxi waiting at the airport terminal' },
  { src: '/images/479522991_619982867451192_8886070544871555543_n.jpg', alt: 'MJT taxi parked on a country road' },
  { src: '/images/479688921_619982834117862_7419147149070691539_n.jpg', alt: 'MJT taxi ready for a private journey' },
] as const;

const services = [
  { id: 'airport_transfer', number: '01', title: 'Airport transfers', description: 'Professional airport journeys with a straightforward booking process.', tone: 'violet' },
  { id: 'private_hire', number: '02', title: 'Private hire', description: 'Pre-booked journeys for personal travel and special occasions.', tone: 'warm' },
  { id: 'tour_excursion', number: '03', title: 'Tours & excursions', description: 'Private journeys for exploring destinations at your own pace.', tone: 'dark' },
  { id: 'corporate_contract', number: '04', title: 'Account & corporate contracts', description: 'Transport arrangements for businesses and recurring travel requirements.', tone: 'warm' },
  { id: 'courier_work', number: '05', title: 'Courier work', description: 'A service enquiry for suitable courier and delivery requirements.', tone: 'violet' },
] as const;

const testimonials = [
  { name: 'Steve Oliver', date: '28 January 2024', quote: 'Picked us up in Auchterarder late on a Saturday evening (Sunday morning) after we had dropped the ball with our travel plans, got there 10 minutes quicker and very reasonable price for that time of the morning. Brilliant, thank you.' },
  { name: 'Lisa Fell', date: '28 January 2024', quote: 'Really appreciated getting picked up and taken home! Really genuine guy! Picked up on time and delivered to the door! Reasonable rates and would highly recommend!' },
  { name: 'Jane Hartley-Oliver', date: '28 January 2024', quote: 'Absolutely superb service when no one else would pick us up. Fantastic service, a great bloke, reasonable rates. Thank you so much.' },
  { name: 'Wendy Kidd', date: '28 May 2023', quote: 'Michael was bang on time, very friendly. Will always use his taxi service in the future.' },
  { name: 'Hannah Stevenson', date: '16 July 2022', quote: 'Amazing service, definitely recommend. Last minute and busy but still got us home, thank you.' },
] as const;

type ServiceId = (typeof services)[number]['id'];
type Page = 'home' | 'book';
type BookingData = {
  serviceType: ServiceId;
  pickupAddress: string;
  destinationAddress: string;
  journeyDate: string;
  pickupTime: string;
  returnJourney: boolean;
  returnDate: string;
  returnTime: string;
  passengers: string;
  luggageRequirements: string;
  journeyNotes: string;
  parcelDetails: string;
  fullName: string;
  email: string;
  phone: string;
  preferredContact: 'whatsapp' | 'phone' | 'email';
};

const emptyBooking: BookingData = {
  serviceType: 'private_hire', pickupAddress: '', destinationAddress: '', journeyDate: '', pickupTime: '',
  returnJourney: false, returnDate: '', returnTime: '', passengers: '1', luggageRequirements: '', journeyNotes: '',
  parcelDetails: '', fullName: '', email: '', phone: '', preferredContact: 'whatsapp',
};

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`brand-lockup ${compact ? 'brand-lockup--compact' : ''}`} aria-label="MJT Private Hire">
      <svg className="brand-mark" viewBox="0 0 96 72" role="img" aria-label="MJT Highland road mark">
        <path className="mark-hills" d="M8 44 34 15l18 18 16-18 20 29-20-14-16 14-18-14-22 20Z" />
        <path className="mark-road" d="M8 57c22-15 48-20 75-17" />
        <circle className="mark-dot" cx="86" cy="40" r="6" />
      </svg>
      <span className="brand-divider" aria-hidden="true" />
      <span className="wordmark"><strong>MJT</strong><span>Private Hire</span></span>
    </div>
  );
}

function usePage() {
  const [page, setPage] = useState<Page>(window.location.pathname === '/book' ? 'book' : 'home');
  useEffect(() => {
    const handlePopState = () => setPage(window.location.pathname === '/book' ? 'book' : 'home');
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  const navigate = (nextPage: Page) => {
    const nextPath = nextPage === 'book' ? '/book' : '/';
    window.history.pushState({}, '', nextPath);
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return { page, navigate };
}

function Header({ navigate }: { navigate: (page: Page) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const goHome = () => { navigate('home'); setMenuOpen(false); };
  const goTo = (id: string) => { navigate('home'); setMenuOpen(false); window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 50); };
  return (
    <header className="site-header">
      <button className="header-brand" type="button" onClick={goHome}><BrandMark compact /></button>
      <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="site-navigation" onClick={() => setMenuOpen((open) => !open)}>
        {menuOpen ? <X size={20} /> : <Menu size={20} />}<span>{menuOpen ? 'Close' : 'Menu'}</span>
      </button>
      <nav id="site-navigation" className={`site-nav ${menuOpen ? 'site-nav--open' : ''}`} aria-label="Main navigation">
        <button type="button" onClick={goHome}>Home</button>
        <button type="button" onClick={() => goTo('services')}>Our services</button>
        <button type="button" onClick={() => goTo('about')}>About</button>
        <button type="button" onClick={() => goTo('testimonials')}>Testimonials</button>
        <button type="button" onClick={() => goTo('contact')}>Contact</button>
      </nav>
      <button className="header-cta" type="button" onClick={() => navigate('book')}>Request a booking <ArrowUpRight size={16} /></button>
    </header>
  );
}

function Hero({ navigate }: { navigate: (page: Page) => void }) {
  return (
    <section className="hero-section">
      <div className="hero-backdrop"><img src={vehicleImage} alt="Dark grey vehicle on a Scottish road" /><span className="hero-shade" /></div>
      <div className="hero-copy page-width">
        <p className="eyebrow"><span /> Auchterarder · Perthshire · Scotland</p>
        <h1>Your journey,<br /><em>our priority.</em></h1>
        <p className="hero-intro">Professional private hire, airport transfers and bespoke journeys, delivered with comfort, reliability and personal service.</p>
        <div className="hero-actions">
          <button className="button button--accent" type="button" onClick={() => navigate('book')}>Request a booking <ArrowUpRight size={17} /></button>
          <a className="button button--outline" href={whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle size={17} /> WhatsApp us</a>
        </div>
      </div>
      <div className="hero-bottom page-width"><span>01 / 05</span><span>Private journeys · airport transfers · tours</span><span className="hero-scroll">Explore <ChevronDown size={16} /></span></div>
    </section>
  );
}

function Services({ navigate }: { navigate: (page: Page) => void }) {
  const chooseService = (serviceType: ServiceId) => { window.sessionStorage.setItem('mjt-service', serviceType); navigate('book'); };
  return (
    <section className="services-section" id="services">
      <div className="page-width section-heading section-heading--split"><div><p className="eyebrow"><span /> Travel your way</p><h2>A service for<br /><em>every journey.</em></h2></div><p>From airport transfers to private journeys and business travel, MJT Private Hire offers a personal approach to getting you where you need to be.</p></div>
      <div className="service-list page-width">
        {services.map((service) => <article className={`service-row service-row--${service.tone}`} key={service.id}><span className="service-number">{service.number}</span><h3>{service.title}</h3><p>{service.description}</p><button className="service-link" type="button" onClick={() => chooseService(service.id)}>Enquire about this service <ArrowUpRight size={16} /></button></article>)}
      </div>
    </section>
  );
}

function About({ navigate }: { navigate: (page: Page) => void }) {
  return <section className="about-section" id="about"><div className="about-image"><img src={ownerImage} alt="MJT Private Hire driver beside the taxi" loading="lazy" /><span>02 / 05</span></div><div className="about-copy"><p className="eyebrow"><span /> A personal approach to private hire</p><h2>More than just<br /><em>getting you there.</em></h2><p>MJT Private Hire provides pre-booked transport from Auchterarder and the surrounding Perthshire area. Whether you need an airport transfer, a private journey, a tour or a business transport arrangement, the focus is on making the booking process straightforward and the journey comfortable.</p><p>Every journey starts with understanding what you need. Get in touch to discuss your destination, timing and requirements.</p><button className="text-link" type="button" onClick={() => navigate('book')}>Discuss your journey <ArrowUpRight size={16} /></button></div></section>;
}

function CarGallery() {
  return <section className="gallery-section" id="vehicle"><div className="page-width section-heading section-heading--split"><div><p className="eyebrow"><span /> Your MJT vehicle</p><h2>Comfort for<br /><em>the road ahead.</em></h2></div><p>Travel in a clean, comfortable Mazda6 estate, ready for airport runs, private hire and longer journeys across Perthshire.</p></div><div className="car-gallery page-width">{carImages.map((image, index) => <figure className={`car-gallery-item car-gallery-item--${index + 1}`} key={image.src}><img src={image.src} alt={image.alt} loading={index === 0 ? 'eager' : 'lazy'} /><figcaption>0{index + 1} / 04</figcaption></figure>)}</div></section>;
}

function Testimonials() {
  return <section className="testimonials-section" id="testimonials"><div className="page-width section-heading section-heading--split"><div><p className="eyebrow"><span /> From the people we’ve helped</p><h2>Journeys worth<br /><em>coming back for.</em></h2></div><p>A little reassurance from customers who have travelled with MJT Private Hire.</p></div><div className="review-summary page-width"><div><strong>4.4</strong><span>★★★★★</span></div><div><strong>Google</strong><span>Customer rating</span></div><div><strong>100%</strong><span>Recommend on Facebook</span></div><div><strong>7</strong><span>Facebook reviews</span></div></div><div className="testimonial-grid page-width">{testimonials.map((testimonial, index) => <article className={`testimonial-card ${index === 0 ? 'testimonial-card--featured' : ''}`} key={testimonial.name}><div className="testimonial-card-top"><MessageCircle size={18} /><span>{testimonial.date}</span></div><blockquote>“{testimonial.quote}”</blockquote><footer><strong>{testimonial.name}</strong><span>recommends MJT Private Hire</span></footer></article>)}</div></section>;
}

function BookingPage({ navigate }: { navigate: (page: Page) => void }) {
  const [step, setStep] = useState(1);
  const [booking, setBooking] = useState<BookingData>(() => ({ ...emptyBooking, serviceType: (window.sessionStorage.getItem('mjt-service') as ServiceId) || 'private_hire' }));
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<{ reference: string; whatsapp: string; email: string } | null>(null);
  const selectedService = services.find((service) => service.id === booking.serviceType) ?? services[1];
  const update = <K extends keyof BookingData>(key: K, value: BookingData[K]) => setBooking((current) => ({ ...current, [key]: value }));
  const validateStep = () => {
    if (step === 1 && (!booking.pickupAddress || !booking.destinationAddress || !booking.journeyDate || !booking.pickupTime)) return 'Please add your pickup, destination, date and time.';
    if (step === 1 && booking.returnJourney && (!booking.returnDate || !booking.returnTime)) return 'Please add the return date and time.';
    if (step === 1 && booking.serviceType === 'courier_work' && !booking.parcelDetails) return 'Please tell us what needs to be delivered.';
    if (step === 2 && (!booking.fullName || !booking.email || !booking.phone)) return 'Please add your name, email address and phone number.';
    if (step === 2 && !/^\S+@\S+\.\S+$/.test(booking.email)) return 'Please enter a valid email address.';
    return '';
  };
  const next = () => { const message = validateStep(); if (message) { setError(message); return; } setError(''); setStep((current) => current + 1); };
  const buildDetailsLines = (reference: string) => [`MJT booking enquiry ${reference}`, `Service: ${selectedService.title}`, `Name: ${booking.fullName}`, `Email: ${booking.email}`, `Phone: ${booking.phone}`, `Pickup: ${booking.pickupAddress}`, `Destination: ${booking.destinationAddress}`, `Date: ${booking.journeyDate}`, `Time: ${booking.pickupTime}`, booking.returnJourney ? `Return: ${booking.returnDate} at ${booking.returnTime}` : '', booking.passengers ? `Passengers: ${booking.passengers}` : '', booking.parcelDetails ? `Parcel details: ${booking.parcelDetails}` : '', booking.journeyNotes ? `Notes: ${booking.journeyNotes}` : ''].filter(Boolean);
  const buildWhatsApp = (reference: string) => `${whatsappBaseUrl}?text=${encodeURIComponent(buildDetailsLines(reference).join('\n'))}`;
  const buildEmail = (reference: string) => `mailto:${emailAddress}?subject=${encodeURIComponent(`Booking enquiry ${reference}`)}&body=${encodeURIComponent(buildDetailsLines(reference).join('\n'))}`;
  const submit = async (event: FormEvent) => { event.preventDefault(); const message = validateStep(); if (message) { setError(message); return; } setSubmitting(true); setError(''); const reference = `MJT-${Date.now().toString(36).toUpperCase()}`; const { error: insertError } = await supabase.from('booking_enquiries').insert({ reference, service_type: booking.serviceType, pickup_address: booking.pickupAddress, destination_address: booking.destinationAddress, journey_date: booking.journeyDate || null, pickup_time: booking.pickupTime || null, return_journey: booking.returnJourney, return_date: booking.returnDate || null, return_time: booking.returnTime || null, passengers: booking.passengers ? Number(booking.passengers) : null, luggage_requirements: booking.luggageRequirements || null, journey_notes: booking.journeyNotes || null, parcel_details: booking.parcelDetails || null, full_name: booking.fullName, email: booking.email, phone: booking.phone, preferred_contact: booking.preferredContact }); setSubmitting(false); if (insertError) { setError('We could not save your enquiry. Please try WhatsApp or call MJT directly.'); return; } const whatsappLink = buildWhatsApp(reference); const emailLink = buildEmail(reference); window.open(whatsappLink, '_blank', 'noopener,noreferrer'); const emailAnchor = document.createElement('a'); emailAnchor.href = emailLink; emailAnchor.style.display = 'none'; document.body.appendChild(emailAnchor); emailAnchor.click(); document.body.removeChild(emailAnchor); setSubmitted({ reference, whatsapp: whatsappLink, email: emailLink }); };
  if (submitted) return <main className="booking-page page-width"><button className="back-link" type="button" onClick={() => navigate('home')}><ArrowLeft size={16} /> Back to MJT Private Hire</button><section className="success-panel"><div className="success-icon"><CircleCheck size={30} /></div><p className="eyebrow"><span /> Enquiry received</p><h1>Thank you,<br /><em>{booking.fullName.split(' ')[0]}.</em></h1><p>Your request has been securely recorded with reference <strong>{submitted.reference}</strong>. We've opened WhatsApp and your email app with all your journey details ready to send to MJT Private Hire. Please press send in both so we receive your enquiry.</p><p className="review-notice" style={{ marginTop: '18px' }}>If nothing opened, use the buttons below to send manually.</p><div className="success-actions"><a className="button button--accent" href={submitted.whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={17} /> Send via WhatsApp</a><a className="button button--light" href={submitted.email}><Mail size={17} /> Email MJT</a></div></section></main>;
  return <main className="booking-page page-width"><button className="back-link" type="button" onClick={() => navigate('home')}><ArrowLeft size={16} /> Back to MJT Private Hire</button><div className="booking-layout"><div className="booking-intro"><p className="eyebrow"><span /> Enquire with MJT</p><h1>Plan your<br /><em>journey.</em></h1><p>Share a few details and MJT Private Hire will respond to your enquiry directly.</p><div className="booking-trust"><span><Clock3 size={16} /> Personal response</span><span><MapPin size={16} /> Auchterarder, Perthshire</span></div></div><form className="booking-form" onSubmit={submit} noValidate><div className="form-progress"><span className={step >= 1 ? 'active' : ''}>01 <small>Journey</small></span><i /><span className={step >= 2 ? 'active' : ''}>02 <small>Your details</small></span><i /><span className={step >= 3 ? 'active' : ''}>03 <small>Review</small></span></div>{step === 1 && <div className="form-step"><h2>Journey details</h2><p className="form-lead">Tell us what you have in mind.</p><label>Service type<select value={booking.serviceType} onChange={(event) => update('serviceType', event.target.value as ServiceId)}>{services.map((service) => <option key={service.id} value={service.id}>{service.title}</option>)}</select></label><div className="field-grid"><label>Pickup address<input value={booking.pickupAddress} onChange={(event) => update('pickupAddress', event.target.value)} placeholder="Where should we collect you?" /></label><label>Destination address<input value={booking.destinationAddress} onChange={(event) => update('destinationAddress', event.target.value)} placeholder="Where are you heading?" /></label><label>Date<input type="date" value={booking.journeyDate} onChange={(event) => update('journeyDate', event.target.value)} /></label><label>Pickup time<input type="time" value={booking.pickupTime} onChange={(event) => update('pickupTime', event.target.value)} /></label></div><label className="check-row"><input type="checkbox" checked={booking.returnJourney} onChange={(event) => update('returnJourney', event.target.checked)} /><span>I'm looking for a return journey</span></label>{booking.returnJourney && <div className="field-grid"><label>Return date<input type="date" value={booking.returnDate} onChange={(event) => update('returnDate', event.target.value)} /></label><label>Return time<input type="time" value={booking.returnTime} onChange={(event) => update('returnTime', event.target.value)} /></label></div>}{booking.serviceType !== 'courier_work' ? <div className="field-grid"><label>Passengers<select value={booking.passengers} onChange={(event) => update('passengers', event.target.value)}>{Array.from({ length: 16 }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1}</option>)}</select></label><label>Luggage or special requirements<input value={booking.luggageRequirements} onChange={(event) => update('luggageRequirements', event.target.value)} placeholder="Optional" /></label></div> : <label>Parcel or delivery details<textarea value={booking.parcelDetails} onChange={(event) => update('parcelDetails', event.target.value)} placeholder="What needs to be delivered?" rows={3} /></label>}<label>Additional notes<textarea value={booking.journeyNotes} onChange={(event) => update('journeyNotes', event.target.value)} placeholder="Anything else MJT should know?" rows={3} /></label></div>}{step === 2 && <div className="form-step"><h2>Your details</h2><p className="form-lead">So MJT knows how to reach you.</p><label>Full name<input value={booking.fullName} onChange={(event) => update('fullName', event.target.value)} autoComplete="name" /></label><div className="field-grid"><label>Email address<input type="email" value={booking.email} onChange={(event) => update('email', event.target.value)} autoComplete="email" /></label><label>Contact phone number<input type="tel" value={booking.phone} onChange={(event) => update('phone', event.target.value)} autoComplete="tel" /></label></div><fieldset><legend>Preferred contact method</legend><div className="contact-options">{(['whatsapp', 'phone', 'email'] as const).map((method) => <label key={method} className={booking.preferredContact === method ? 'selected' : ''}><input type="radio" name="preferredContact" value={method} checked={booking.preferredContact === method} onChange={() => update('preferredContact', method)} />{method}</label>)}</div></fieldset><p className="privacy-note">Only the information needed to respond to this enquiry is collected. No payment or passport details are requested.</p></div>}{step === 3 && <div className="form-step"><h2>Review your enquiry</h2><p className="form-lead">Check the details before sending.</p><div className="review-list"><div><span>Service</span><strong>{selectedService.title}</strong></div><div><span>Journey</span><strong>{booking.pickupAddress} → {booking.destinationAddress}</strong></div><div><span>When</span><strong>{booking.journeyDate} at {booking.pickupTime}{booking.returnJourney ? ` · Return ${booking.returnDate} at ${booking.returnTime}` : ''}</strong></div><div><span>Contact</span><strong>{booking.fullName} · {booking.email} · {booking.phone}</strong></div><div><span>Preferred contact</span><strong>{booking.preferredContact}</strong></div></div><p className="review-notice">Your request is an enquiry and is not confirmed until MJT Private Hire responds.</p></div>}{error && <p className="form-error" role="alert">{error}</p>}<div className="form-actions">{step > 1 && <button className="button button--ghost" type="button" onClick={() => { setError(''); setStep((current) => current - 1); }}><ArrowLeft size={16} /> Back</button>}{step < 3 ? <button className="button button--accent" type="button" onClick={next}>Continue <ArrowRight size={16} /></button> : <button className="button button--accent" type="submit" disabled={submitting}>{submitting ? 'Sending...' : 'Submit booking request'} <Send size={16} /></button>}</div></form></div></main>;
}

function Contact({ navigate }: { navigate: (page: Page) => void }) {
  return <><section className="conversion-section"><div className="page-width conversion-inner"><div><p className="eyebrow"><span /> The next step</p><h2>Where would you<br /><em>like to go?</em></h2></div><div><p>Tell us about your journey and we’ll help you arrange your private hire booking.</p><div className="conversion-actions"><button className="button button--dark" type="button" onClick={() => navigate('book')}>Request a booking <ArrowUpRight size={17} /></button><a className="button button--violet-outline" href={whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle size={17} /> WhatsApp MJT</a></div></div></div></section><section className="contact-section page-width" id="contact"><div><p className="eyebrow"><span /> Contact MJT</p><h2>Let’s make the<br /><em>journey simple.</em></h2></div><div className="contact-details"><p>For private hire, airport transfers, tours, corporate contracts and courier enquiries.</p><a href={`tel:${phoneNumber}`}><Phone size={17} /> +44 7743 076630</a><a href={`mailto:${emailAddress}`}><Mail size={17} /> {emailAddress}</a><a href={whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle size={17} /> WhatsApp MJT</a><span><MapPin size={17} /> Auchterarder, Perthshire, Scotland</span></div></section></>;
}

function WhatsAppGlyph() {
  return <svg className="whatsapp-glyph" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.52 3.48A11.84 11.84 0 0 0 12.08 0C5.53 0 .2 5.33.2 11.88c0 2.1.55 4.14 1.6 5.94L.1 24l6.32-1.66a11.86 11.86 0 0 0 5.66 1.44h.01c6.55 0 11.88-5.33 11.88-11.88 0-3.18-1.24-6.17-3.45-8.42Zm-8.43 18.28h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.75.98 1-3.65-.23-.38a9.86 9.86 0 0 1-1.5-5.24C2.21 6.45 6.64 2.02 12.09 2.02c2.64 0 5.12 1.03 6.99 2.9a9.84 9.84 0 0 1 2.89 7c0 5.45-4.43 9.84-9.88 9.84Zm5.41-7.37c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.76-1.67-2.06-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.21 5.09 4.5.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" /></svg>;
}

function FloatingActions({ navigate }: { navigate: (page: Page) => void }) {
  return <aside className="floating-actions" aria-label="Quick contact actions"><button className="floating-book" type="button" onClick={() => navigate('book')}><CalendarDays size={18} aria-hidden="true" /><span>Book a Ride</span></button><a className="floating-whatsapp" href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="Book via WhatsApp" title="Book via WhatsApp"><WhatsAppGlyph /></a></aside>;
}

function Home({ navigate }: { navigate: (page: Page) => void }) { return <><Hero navigate={navigate} /><Services navigate={navigate} /><About navigate={navigate} /><CarGallery /><Testimonials /><Contact navigate={navigate} /></>; }

function App() {
  const { page, navigate } = usePage();
  useEffect(() => { document.title = page === 'book' ? 'Request a Booking | MJT Private Hire' : 'MJT Private Hire | Auchterarder, Perthshire'; }, [page]);
  return <div className="site-shell"><Header navigate={navigate} />{page === 'book' ? <BookingPage navigate={navigate} /> : <Home navigate={navigate} />}<FloatingActions navigate={navigate} /><footer className="site-footer"><BrandMark compact /><span>Private hire in Auchterarder, Perthshire.</span><span><a href="#contact">Contact</a> · <a href="#privacy">Privacy</a> · © {new Date().getFullYear()} MJT Private Hire</span></footer><details className="privacy-disclosure" id="privacy"><summary>Privacy information</summary><p>MJT Private Hire uses the details submitted through the booking enquiry form only to respond to the requested journey. The form does not request payment card, password or passport information, and no non-essential analytics cookies are used on this preview.</p></details></div>;
}

export default App;
