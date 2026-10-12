import { supabase } from './supabase';
import { useEffect, useState } from 'react'
import {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Camera, Check, ChevronDown,
  CircleCheck, ClipboardList, House, LandPlot, Leaf, LockKeyhole,
  LogOut, Mail, MapPin, Menu, MessageCircle, Pencil, Phone, Plus, ShieldCheck,
  SlidersHorizontal, Sparkles, Trash2, X,
} from 'lucide-react'
import HeroScene from './HeroSceneLazy.jsx'
import './Experience.css'

const LISTINGS_KEY = 'murugan-real-estate-listings'
const ADMIN_SESSION_KEY = 'murugan-admin-session'
const WHATSAPP_NUMBER = '918778903754'
const PHONE_NUMBER = '+918778903754'
const EMAIL = 'muruganrealestate21@gmail.com'
const INSTAGRAM = 'https://instagram.com/murugan_real.estate_cbe'
const COPYRIGHT_YEAR = new Date().getFullYear()
const CATEGORIES = ['Residential Plot', 'Commercial Land', 'Villa', 'Farm Land']



function displayPrice(value) {
  const price = String(value || '').trim()
  return price.startsWith('₹') ? price : `₹${price}`
}

function whatsappLink(message = '') {
  return `https://wa.me/${WHATSAPP_NUMBER}${message ? `?text=${encodeURIComponent(message)}` : ''}`
}

function Brand() {
  return <a className="brand" href="/" aria-label="Murugan Real Estate CBE home"><span className="brand-mark"><LandPlot size={20} /></span><span className="brand-copy"><strong>Murugan</strong><small>REAL ESTATE <i>CBE</i></small></span></a>
}

function ImageFallback() {
  return <div className="image-fallback"><House size={27} strokeWidth={1.2} /><span>Property photo</span></div>
}

function PropertyCard({ property, onEnquire }) {
  const [imageIndex, setImageIndex] = useState(0)
  const photos = property.photos || []
  return <article className={`property-card${property.status === 'sold' ? ' property-card--sold' : ''}`}>
    <div className="property-photo-wrap"><ImageFallback />{photos[imageIndex] && <img className="property-photo" src={photos[imageIndex]} alt={property.title} onError={(event) => { event.currentTarget.style.display = 'none' }} />}<span className={`status-badge ${property.status === 'sold' ? 'status-badge--sold' : ''}`}><span />{property.status === 'sold' ? 'Sold out' : 'Available'}</span>
      {photos.length > 1 && <div className="photo-controls"><button type="button" aria-label="Previous photo" onClick={() => setImageIndex((imageIndex + photos.length - 1) % photos.length)}><ArrowLeft size={15} /></button><span>{imageIndex + 1} / {photos.length}</span><button type="button" aria-label="Next photo" onClick={() => setImageIndex((imageIndex + 1) % photos.length)}><ArrowRight size={15} /></button></div>}
    </div>
    <div className="property-body"><div className="property-heading-row"><span className="eyebrow property-category">{property.category}</span><ArrowUpRight size={17} className="property-arrow" /></div><h3>{property.title}</h3><p className="property-location"><MapPin size={14} />{property.location}</p><div className="property-specs"><span><LandPlot size={15} />{property.extent}</span></div>{property.description && <p className="property-description">{property.description}</p>}{property.highlights?.length > 0 && <div className="highlight-list">{property.highlights.slice(0, 3).map((item) => <span key={item}><Check size={12} />{item}</span>)}</div>}<div className="property-card-bottom"><strong className="property-price">{displayPrice(property.price)}</strong><button className="button button--small button--outline" type="button" onClick={() => onEnquire(property)}>Enquire <ArrowUpRight size={15} /></button></div></div>
  </article>
}

function EnquiryModal({ property, onClose, onSent }) {
  const [form, setForm] = useState({ name: '', phone: '', message: '' })
  useEffect(() => {
    const onKeyDown = (event) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])
  function submit(event) {
    event.preventDefault()
    const message = ['Hello Murugan Real Estate, I am interested in this property.', `Name: ${form.name}`, `Mobile: ${form.phone}`, `Property: ${property.title}`, `Location: ${property.location}`, `Extent: ${property.extent}`, `Price: ${displayPrice(property.price)}`, form.message ? `Message / preferred time: ${form.message}` : ''].filter(Boolean).join('\n')
    window.open(whatsappLink(message), '_blank', 'noopener,noreferrer')
    onSent()
  }
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}><section className="enquiry-modal" role="dialog" aria-modal="true" aria-labelledby="enquiry-title"><button className="icon-button modal-close" type="button" onClick={onClose} aria-label="Close enquiry"><X size={19} /></button><span className="eyebrow">A GOOD PLACE TO BEGIN</span><h2 id="enquiry-title">Tell us what<br />you&apos;re looking for.</h2><div className="enquiry-property"><span>{property.category}</span><strong>{property.title}</strong><small><MapPin size={13} />{property.location}<i />{displayPrice(property.price)}</small></div><form onSubmit={submit} className="form-stack"><label>Full name<input autoFocus required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Your name" /></label><label>Phone number<input required type="tel" inputMode="tel" pattern="[0-9+]{8,16}" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="Your mobile number" /></label><label>Message or a good time to call <span className="optional-label">Optional</span><textarea rows="3" value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} placeholder="Anything you'd like us to know?" /></label><button className="button button--green button--wide" type="submit">Send via WhatsApp <MessageCircle size={16} /></button><p className="form-note"><ShieldCheck size={14} />Your details open directly in WhatsApp.</p></form></section></div>
}

function imageToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const source = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => {
      const scale = Math.min(1, 1500 / Math.max(image.width, image.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.max(1, Math.round(image.width * scale))
      canvas.height = Math.max(1, Math.round(image.height * scale))
      canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(source)
      resolve(canvas.toDataURL('image/jpeg', 0.78))
    }
    image.onerror = () => { URL.revokeObjectURL(source); reject(new Error('One of the selected images could not be read.')) }
    image.src = source
  })
}

function PropertyForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(() => initial ? { title: initial.title, category: initial.category, location: initial.location, extent: initial.extent, price: initial.price, description: initial.description || '', highlights: (initial.highlights || []).join(', ') } : { title: '', category: CATEGORIES[0], location: '', extent: '', price: '', description: '', highlights: '' })
  const [photos, setPhotos] = useState(initial?.photos || [])
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  async function addPhotos(event) {
    const files = Array.from(event.target.files || []).slice(0, Math.max(0, 6 - photos.length))
    if (!files.length) return
    setIsProcessing(true)
    setError('')
    try {
      const encodedPhotos = await Promise.all(files.map(imageToDataUrl))
      setPhotos((current) => [...current, ...encodedPhotos].slice(0, 6))
    }
    catch (uploadError) { setError(uploadError.message) }
    finally { setIsProcessing(false); event.target.value = '' }
  }
  function submit(event) {
    event.preventDefault()
    onSave({ ...form, highlights: form.highlights.split(',').map((item) => item.trim()).filter(Boolean), photos, status: initial?.status || 'available', id: initial?.id || crypto.randomUUID(), createdAt: initial?.createdAt || new Date().toISOString() }, setError)
  }
  return <form className="property-form" onSubmit={submit}><div className="form-heading"><div><span className="eyebrow">{initial ? 'UPDATE THE DETAILS' : 'A NEW OPPORTUNITY'}</span><h2>{initial ? 'Edit property' : 'Add a property'}</h2></div><button type="button" className="icon-button" onClick={onCancel} aria-label="Close property form"><X size={18} /></button></div><div className="property-form-grid">
    <label className="field-span">Property title<input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="e.g. Corner plot near Avinashi Road" /></label>
    <label>Category<select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>{CATEGORIES.map((item) => <option key={item}>{item}</option>)}</select></label>
    <label>Area / location<input required value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} placeholder="e.g. Saravanampatti, Coimbatore" /></label>
    <label>Extent / size<input required value={form.extent} onChange={(event) => setForm({ ...form, extent: event.target.value })} placeholder="e.g. 2,400 sq.ft. / 5 cents" /></label>
    <label>Price / rate<input required value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} placeholder="e.g. 42 Lakhs or ₹38,00,000" /></label>
    <label className="field-span">Description<textarea rows="3" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="A few useful details about the property" /></label>
    <label className="field-span">Key highlights <span className="optional-label">Separate with commas</span><input value={form.highlights} onChange={(event) => setForm({ ...form, highlights: event.target.value })} placeholder="DTCP approved, 30 ft road, water connection" /></label>
  </div><div className="upload-row"><label className="upload-trigger"><Plus size={16} /> Add property photos<input type="file" accept="image/*" multiple onChange={addPhotos} disabled={photos.length >= 6 || isProcessing} /></label><span>{isProcessing ? 'Preparing photos…' : `${photos.length} of 6 photos`}</span></div>{photos.length > 0 && <div className="upload-previews">{photos.map((photo, index) => <div className="upload-preview" key={`${photo.slice(-18)}-${index}`}><img src={photo} alt={`Property preview ${index + 1}`} /><button type="button" aria-label={`Remove photo ${index + 1}`} onClick={() => setPhotos(photos.filter((_, photoIndex) => photoIndex !== index))}><X size={13} /></button></div>)}</div>}{error && <p className="inline-error">{error}</p>}<div className="form-actions"><button type="button" className="button button--text" onClick={onCancel}>Cancel</button><button type="submit" className="button button--green" disabled={isProcessing}>{initial ? 'Save changes' : 'Publish property'} <ArrowUpRight size={16} /></button></div></form>
}

function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  function submit(event) {
    event.preventDefault()
    if (username === 'Nishanth' && password === 'Nishanth@2006') { sessionStorage.setItem(ADMIN_SESSION_KEY, 'true'); onLogin() }
    else setError('Those details do not match. Please try again.')
  }
  return <main className="admin-login-page"><div className="login-art"><div className="login-art-content"><span className="eyebrow">MURUGAN REAL ESTATE CBE</span><p>Good land.<br /><em>Good decisions.</em></p><span className="login-art-note"><MapPin size={14} />Rooted in Coimbatore</span></div><HeroScene /></div><div className="login-panel"><Brand /><a className="back-link" href="/"><ArrowLeft size={15} /> Back to the website</a><div className="login-form-wrap"><span className="eyebrow">PRIVATE ACCESS</span><h1>Welcome<br />back.</h1><p className="login-intro">Sign in to manage your property listings.</p><form className="form-stack" onSubmit={submit}><label>Username<input autoComplete="username" required value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Admin username" /></label><label>Password<input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Your password" /></label>{error && <p className="inline-error">{error}</p>}<button className="button button--green button--wide" type="submit">Sign in <ArrowRight size={16} /></button></form><p className="login-security"><LockKeyhole size={13} />Protected admin area</p></div><span className="login-copyright">© {COPYRIGHT_YEAR} Murugan Real Estate CBE</span></div></main>
}

function AdminDashboard({ listings, saveListings, onLogout }) {
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [filter, setFilter] = useState('all')
  const [toast, setToast] = useState('')
  const activeCount = listings.filter((item) => item.status !== 'sold').length
  const soldCount = listings.length - activeCount
  const visible = listings.filter((item) => filter === 'all' || item.status === filter)
  function flash(message) { setToast(message); window.setTimeout(() => setToast(''), 3000) }
  function save(property, reportError) {
    const next = editing ? listings.map((item) => item.id === property.id ? property : item) : [property, ...listings]
    if (!saveListings(next)) { reportError('This listing could not be saved. Remove a photo or use a smaller image.'); return }
    setShowForm(false); setEditing(null); flash(editing ? 'Property details updated.' : 'Property published successfully.')
  }
  function updateStatus(property) {
    saveListings(listings.map((item) => item.id === property.id ? { ...item, status: item.status === 'sold' ? 'available' : 'sold' } : item))
    flash(property.status === 'sold' ? 'Listing marked available.' : 'Listing marked sold.')
  }
  return <main className="admin-shell"><header className="admin-topbar"><Brand /><div className="admin-user"><span className="admin-avatar">N</span><span><strong>Nishanth</strong><small>Administrator</small></span><button className="icon-button logout-button" type="button" onClick={onLogout} title="Log out" aria-label="Log out"><LogOut size={17} /></button></div></header><div className="admin-main"><div className="admin-page-title"><div><span className="eyebrow">WORKSPACE / OVERVIEW</span><h1>Property desk<span>.</span></h1><p>Manage your Coimbatore listings in one place.</p></div><button className="button button--green" type="button" onClick={() => { setEditing(null); setShowForm(true) }}><Plus size={17} /> Add property</button></div>
    <section className="metrics-grid" aria-label="Listing summary"><div className="metric"><span>Total listings</span><strong>{listings.length.toString().padStart(2, '0')}</strong><small><ClipboardList size={13} /> Properties in your desk</small></div><div className="metric"><span>Available</span><strong>{activeCount.toString().padStart(2, '0')}</strong><small><CircleCheck size={13} /> Ready for enquiries</small></div><div className="metric"><span>Sold properties</span><strong>{soldCount.toString().padStart(2, '0')}</strong><small><Check size={13} /> Successfully closed</small></div></section>
    {showForm && <PropertyForm initial={editing} onSave={save} onCancel={() => { setShowForm(false); setEditing(null) }} />}
    <section className="manage-section"><div className="manage-heading"><div><span className="eyebrow">YOUR INVENTORY</span><h2>All properties <span className="count-pill">{listings.length}</span></h2></div><label className="filter-control"><SlidersHorizontal size={14} /><select value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filter properties"><option value="all">All status</option><option value="available">Available</option><option value="sold">Sold out</option></select><ChevronDown size={13} /></label></div>
    {visible.length === 0 ? <div className="admin-empty"><div className="empty-icon"><LandPlot size={23} /></div><h3>{listings.length ? 'Nothing in this view' : 'Your first listing starts here.'}</h3><p>{listings.length ? 'Try another status filter.' : 'Add a property and it will appear on your public website right away.'}</p>{!listings.length && <button type="button" className="button button--outline" onClick={() => setShowForm(true)}><Plus size={16} /> Add your first property</button>}</div> : <div className="admin-listings">{visible.map((property) => <article className="admin-property" key={property.id}><div className="admin-property-thumb"><ImageFallback />{property.photos?.[0] && <img src={property.photos[0]} alt="" onError={(event) => { event.currentTarget.style.display = 'none' }} />}</div><div className="admin-property-info"><span className="eyebrow">{property.category}</span><h3>{property.title}</h3><p><MapPin size={13} />{property.location}<i />{property.extent}</p></div><strong className="admin-property-price">{displayPrice(property.price)}</strong><span className={`status-badge status-badge--table ${property.status === 'sold' ? 'status-badge--sold' : ''}`}><span />{property.status === 'sold' ? 'Sold out' : 'Available'}</span><div className="admin-property-actions"><button className="icon-button" type="button" title="Edit details" aria-label={`Edit ${property.title}`} onClick={() => { setEditing(property); setShowForm(true); window.scrollTo({ top: 250, behavior: 'smooth' }) }}><Pencil size={16} /></button><button className="icon-button" type="button" title="Toggle sold status" aria-label={property.status === 'sold' ? `Mark ${property.title} available` : `Mark ${property.title} sold`} onClick={() => updateStatus(property)}><Check size={16} /></button><button className="icon-button icon-button--danger" type="button" title="Delete listing" aria-label={`Delete ${property.title}`} onClick={() => { if (window.confirm(`Remove "${property.title}" from the website?`)) { saveListings(listings.filter((item) => item.id !== property.id)); flash('Listing removed.') } }}><Trash2 size={16} /></button></div></article>)}</div>}</section>
    <div className="admin-footnote"><ShieldCheck size={14} /><span>Changes are saved in this browser and appear immediately on the public website.</span><a href="/">View website <ArrowUpRight size={13} /></a></div></div>{toast && <div role="status" className="toast"><CircleCheck size={17} />{toast}</div>}</main>
}

function Footer() {
  return <footer className="site-footer" id="contact"><div className="footer-main"><div><Brand /><p className="footer-description">A more thoughtful way to find the right ground for what comes next.</p></div><div className="footer-contact"><span className="eyebrow">LET&apos;S TALK PROPERTY</span><a href={`tel:${PHONE_NUMBER}`}><Phone size={15} />+91 87789 03754</a><a href={`mailto:${EMAIL}`}><Mail size={15} />{EMAIL}</a><a href={INSTAGRAM} target="_blank" rel="noreferrer"><Camera size={15} />@murugan_real.estate_cbe</a></div><a className="footer-whatsapp" href={whatsappLink('Hello, I would like to know more about properties in Coimbatore.')} target="_blank" rel="noreferrer"><span><MessageCircle size={20} /></span><strong>Start a conversation</strong><small>Speak with our local team</small><ArrowUpRight size={17} /></a></div><div className="footer-bottom"><span>© {COPYRIGHT_YEAR} Murugan Real Estate CBE. Coimbatore, Tamil Nadu.</span><a href="/admin"><LockKeyhole size={13} />Admin access</a></div></footer>
}

function CustomerHome({ listings }) {
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [category, setCategory] = useState('All properties')
  const [menuOpen, setMenuOpen] = useState(false)
  const [toast, setToast] = useState('')
  const categories = ['All properties', ...new Set(listings.map((item) => item.category))]
  const visible = listings.filter((item) => category === 'All properties' || item.category === category)
  return <div className="website"><div className="topline"><span><MapPin size={13} />Coimbatore, Tamil Nadu</span><span className="topline-note">A local perspective on a lasting investment</span><a href={`tel:${PHONE_NUMBER}`}><Phone size={13} />+91 87789 03754</a></div><header className="site-header"><div className="header-inner"><Brand /><button className="mobile-menu-toggle icon-button" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button><nav className={menuOpen ? 'main-nav main-nav--open' : 'main-nav'}><a href="#home" onClick={() => setMenuOpen(false)}>Home</a><a href="#properties" onClick={() => setMenuOpen(false)}>Properties</a><a href="#about" onClick={() => setMenuOpen(false)}>Our approach</a><a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a><a className="nav-admin" href="/admin"><LockKeyhole size={13} />Admin</a></nav><div className="header-actions"><a className="header-call" href={`tel:${PHONE_NUMBER}`} aria-label="Call Murugan Real Estate"><Phone size={15} /></a><a className="button button--green button--header" href={whatsappLink('Hello, I would like to know more about properties in Coimbatore.')} target="_blank" rel="noreferrer"><MessageCircle size={15} />WhatsApp us</a></div></div></header>
    <main><section className="hero-section" id="home"><div className="hero-main"><div className="hero-image" role="img" aria-label="Green land near Coimbatore"><div className="hero-image-shade" /><HeroScene /><div className="hero-photo-caption"><span className="caption-dot" />COIMBATORE & SURROUNDING AREAS</div><div className="hero-image-stamp"><Leaf size={20} /><span>Land for<br />what&apos;s next.</span></div></div><div className="hero-copy"><div className="hero-overline"><span className="overline-line" />LOCAL KNOWLEDGE. LASTING VALUE.</div><h1>Find your<br /><em>place</em> in<br />what&apos;s next.</h1><p className="hero-description">Thoughtful plots, land and homes across Coimbatore. The right ground makes all the difference.</p><div className="hero-cta-row"><a className="button button--gold" href="#properties">Explore properties <ArrowDown size={16} /></a><a className="text-link" href={whatsappLink('Hello, I would like to speak with Murugan Real Estate.')} target="_blank" rel="noreferrer">Talk to our team <ArrowUpRight size={16} /></a></div><div className="hero-trust"><span className="trust-icon"><ShieldCheck size={17} /></span><span><strong>Rooted here. Here for you.</strong><small>Personal guidance, from first look to final papers.</small></span></div></div></div><div className="hero-bottomline"><span>01 <i /> PROPERTY, WITH PERSPECTIVE</span><span>SCROLL TO EXPLORE <ArrowDown size={13} /></span></div></section>
      <section className="intro-band" id="about"><span className="eyebrow">A LOCAL POINT OF VIEW</span><p>Some decisions deserve<br />a <em>closer look.</em></p><div className="intro-aside"><span className="intro-rule" /><p>We help you see more than a pin on a map: the neighbourhood, the details, and the possibility in between.</p><a href={`tel:${PHONE_NUMBER}`}>Get to know us <ArrowUpRight size={15} /></a></div></section>
      <section className="properties-section" id="properties"><div className="section-topline"><span className="eyebrow">THE PROPERTY JOURNAL <span className="section-index">/ 01</span></span><span className="listing-count">{listings.length.toString().padStart(2, '0')} LISTINGS</span></div><div className="section-heading-row"><div><h2>Grounded in<br /><em>possibility.</em></h2><p>Spaces and land worth looking closer at.</p></div>{listings.length > 0 && <div className="category-filters" aria-label="Filter by property category">{categories.map((item) => <button className={category === item ? 'filter-chip filter-chip--active' : 'filter-chip'} type="button" key={item} onClick={() => setCategory(item)}>{item}</button>)}</div>}</div>{visible.length ? <div className="property-grid">{visible.map((property) => <PropertyCard key={property.id} property={property} onEnquire={setSelectedProperty} />)}</div> : <div className="public-empty"><div className="empty-orbit"><div className="empty-orbit-inner"><LandPlot size={27} /></div><span className="orbit orbit--one" /><span className="orbit orbit--two" /></div><div className="empty-copy"><span className="eyebrow">THE NEXT CHAPTER STARTS HERE</span><h3>{listings.length ? 'Nothing in this category.' : 'No listings just yet.'}</h3><p>{listings.length ? 'Choose another category to see current properties.' : 'No listings currently available. Check back soon or contact us directly!'}</p><a className="button button--outline" href={whatsappLink('Hello, are there any new property listings in Coimbatore?')} target="_blank" rel="noreferrer"><MessageCircle size={16} />Ask us directly <ArrowUpRight size={15} /></a></div><span className="empty-index">IN GOOD TIME <i /> CBE</span></div>}</section>
      <section className="approach-section"><div className="approach-number">02 <span>/ THE APPROACH</span></div><div className="approach-copy"><span className="eyebrow">PERSONAL, NOT PRESSURED</span><h2>Local roots.<br /><em>Clear decisions.</em></h2><p>Property is personal. We take time to understand what matters to you, share the details that count, and help you move forward at your own pace.</p><a className="button button--dark-outline" href={whatsappLink('Hello, I would like to talk about finding property in Coimbatore.')} target="_blank" rel="noreferrer">Let&apos;s talk <ArrowUpRight size={16} /></a></div><div className="approach-visual"><div className="approach-visual-image" /><div className="approach-visual-note"><Sparkles size={17} /><span>Make room<br />for possibility.</span></div><span className="approach-coordinate">11°01&apos; N — 76°57&apos; E</span></div></section></main><Footer />{selectedProperty && <EnquiryModal property={selectedProperty} onClose={() => setSelectedProperty(null)} onSent={() => { setSelectedProperty(null); setToast('Your enquiry is ready in WhatsApp.') }} />}{toast && <div className="toast" role="status"><CircleCheck size={17} />{toast}</div>}</div>
}

export default function AppExperience() {
  const [isAdminPath] = useState(() => window.location.pathname.replace(/\/$/, '') === '/admin')
  const [authenticated, setAuthenticated] = useState(() => sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true')
 const [listings, setListings] = useState([])
 useEffect(() => {
    async function fetchListings() {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .order('id', { ascending: false })

      if (error) {
        console.error('Error fetching listings:', error.message)
      } else if (data) {
        setListings(data)
      }
    }

    fetchListings()
  }, [])

 async function saveListings(updated) {
    try {
      const items = Array.isArray(updated) ? updated : [updated];

      const cleanItems = items.map((item) => {
        // Map frontend fields directly to table columns
        const payload = {
          title: item.title || '',
          location: item.location || '',
          area: item.area || '',
          price: item.price || '',
          pricelabel: item.pricelabel || item.priceLabel || '',
          extent: item.extent || '',
          type: item.type || '',
          status: item.status || 'Available',
          facing: item.facing || '',
          road: item.road || '',
          approval: item.approval || '',
          description: item.description || '',
          image: item.image || (Array.isArray(item.photos) ? item.photos[0] : '') || '',
          photos: Array.isArray(item.photos) ? item.photos : [],
          images: Array.isArray(item.images) ? item.images : (Array.isArray(item.photos) ? item.photos : []),
          highlights: Array.isArray(item.highlights) ? item.highlights : [],
          features: Array.isArray(item.features) ? item.features : [],
          featured: Boolean(item.featured),
          beds: item.beds ? String(item.beds) : '',
          baths: item.baths ? String(item.baths) : '',
          landmark: item.landmark || '',
          contact: item.contact || ''
        };

        // Only attach valid numeric ID if updating an existing record
        if (item.id && typeof item.id === 'number') {
          payload.id = item.id;
        }

        return payload;
      });

      const hasId = cleanItems.some((i) => Boolean(i.id));
      let response;
      if (hasId) {
        response = await supabase.from('listings').upsert(cleanItems).select();
      } else {
        response = await supabase.from('listings').insert(cleanItems).select();
      }

      const { data, error } = response;

      if (error) {
        console.error('Supabase error:', error);
        alert('Supabase Error: ' + (error.message || JSON.stringify(error)));
        throw error;
      }

      if (data) {
        if (typeof fetchListings === 'function') {
          await fetchListings();
        } else {
          setListings((prev) => [...prev, ...data]);
        }
        return true;
      }
    } catch (err) {
      console.error('Error saving listing:', err.message || err);
      return false;
    }
  }