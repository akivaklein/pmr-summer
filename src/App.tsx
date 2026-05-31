import { useMemo, useState, useEffect, useRef } from "react";

// Using images.weserv.nl proxy for PMR website photos (bypasses hotlink block)
const P = (path: string) => `https://images.weserv.nl/?url=presidentialmountainresort.com/wp-content/uploads/${path}`;

// TripAdvisor CDN photos (no hotlink block)
const TA = (id: string) => `https://dynamic-media-cdn.tripadvisor.com/media/photo-o/${id}/caption.jpg?w=900&h=600&s=1`;

const FALLBACK = TA("1a/86/80/3c");

const cabins = [
  {
    name: "Rosewood Premier Cabins",
    category: "Cabins",
    filter: "Large groups",
    sleeps: "Families or small groups",
    layout: "4 bedrooms · 4 king beds · 2 bathrooms · loft",
    features: ["Full Kitchen", "Private porch", "Loft", "Lake nearby"],
    description: "Four-bedroom log cabins with warm wood interiors, large windows, and a loft — perfect for large families and Shabbos gatherings in the White Mountains.",
    cta: "https://rosewoodpremier.presidentialmountainresort.com",
    image: P("2025/02/PMR-RosewoodVilla17-1400x934.jpg"),
    gallery: [
      P("2025/02/PMR-RosewoodVilla17-1400x934.jpg"),
      P("2025/01/RosewoodVilla-1400x875.jpg"),
      P("2025/02/rosewood-cab-PMRWinter202500030.jpg"),
      P("2025/02/Rosewood-cab-PMRWinter202500022.jpg"),
      P("2025/02/rosewood-cab-PMRWinter202500023.jpg"),
      P("2025/02/rosewood-cab-PMRWinter202500024.jpg"),
    ],
  },
  {
    name: "Rosewood Villa Cabins",
    category: "Cabins",
    filter: "Families",
    sleeps: "Families or small groups",
    layout: "2 bedrooms · 2 king beds · upstairs loft",
    features: ["Full Kitchen", "Private porch", "Loft", "Wood interiors"],
    description: "Two-bedroom log cabins with a loft — a cozy mishpacha retreat with rustic wood interiors, large windows, and a private porch.",
    cta: "https://rosewood.presidentialmountainresort.com",
    image: P("2025/01/RosewoodVilla-1400x875.jpg"),
    gallery: [
      P("2025/01/RosewoodVilla-1400x875.jpg"),
      P("2025/02/rosewood-cab-PMRWinter202500025.jpg"),
      P("2025/02/rosewood-cab-PMRWinter202500026.jpg"),
      P("2025/02/rosewood-cab-PMRWinter202500027.jpg"),
      P("2025/02/rosewood-cab-PMRWinter202500029.jpg"),
    ],
  },
  {
    name: "Rosewood Cottage",
    category: "Cabins",
    filter: "Lakeside",
    sleeps: "Families or groups",
    layout: "2 ground-floor bedrooms · upstairs twin loft",
    features: ["Full Kitchen", "Lake views", "Private porch", "Queen & king beds"],
    description: "A spacious lakeside retreat with a full kitchen, porch views over the lake — perfect for the whole family to unwind together.",
    cta: "https://book.presidentialmountainresort.com",
    image: P("2025/02/RosewoodCottage-4.jpg"),
    gallery: [
      P("2025/02/RosewoodCottage-4.jpg"),
      P("2025/02/RosewoodCottage-1.jpg"),
      P("2025/02/RosewoodCottage-2.jpg"),
      P("2025/02/RosewoodCottage-3.jpg"),
      P("2025/02/Rosewood-Cottage-PMRWinter202500075.jpg"),
      P("2025/02/Rosewood-Cottage-PMRWinter202500073.jpg"),
    ],
  },
  {
    name: "Chestnut Premier Cabin",
    category: "Cabins",
    filter: "Couples",
    sleeps: "2 adults",
    layout: "King bed · lakeside cabin",
    features: ["Kitchenette", "Lake views", "Private porch", "Historic charm"],
    description: "A peaceful lakeside cabin for two — lake views from your king bed, private porch, and all the essentials for a quiet White Mountains stay.",
    cta: "https://book.presidentialmountainresort.com",
    image: P("2025/10/GH-PMR-21.jpg"),
    gallery: [
      P("2025/10/GH-PMR-21.jpg"),
      P("2025/02/chest-prem-PMRWinter202500005.jpg"),
      P("2025/02/chest-prem-PMRWinter202500003.jpg"),
      P("2025/02/chest-prem-PMRWinter202500002.jpg"),
      P("2025/02/chest-prem-PMRWinter202500004.jpg"),
    ],
  },
  {
    name: "Chestnut Studio Cabins",
    category: "Cabins",
    filter: "Couples",
    sleeps: "2 adults",
    layout: "King bed · studio cabin",
    features: ["Kitchenette", "Lake views", "Private porch", "Cozy studio"],
    description: "Cozy studio cabins for two with a king bed, lake views, and all the essentials for a relaxed summer getaway.",
    cta: "https://chestnutstudio.presidentialmountainresort.com",
    image: P("2025/01/GH-PMR-25-1-1400x934.jpg"),
    gallery: [
      P("2025/01/GH-PMR-25-1-1400x934.jpg"),
      P("2025/01/GH-PMR-28.jpg"),
      P("2025/01/ChestnutStudio.jpg"),
      P("2025/01/chest-cab-PMRWinter202500009.jpg"),
      P("2025/01/chest-cab-PMRWinter202500010.jpg"),
    ],
  },
  {
    name: "Pine Cabins",
    category: "Cabins",
    filter: "Couples",
    sleeps: "1–2 guests",
    layout: "King bed · living area · loft nook",
    features: ["Kitchenette", "Forest views", "Private porch", "Large windows"],
    description: "Surrounded by pines, these peaceful cabins offer forest views, a king bed, loft nook, and a porch made for summer evenings.",
    cta: "https://pinecabin.presidentialmountainresort.com",
    image: P("2025/02/GH-PMR-33-1-1120x1400.jpg"),
    gallery: [
      P("2025/02/GH-PMR-33-1-1120x1400.jpg"),
      P("2025/02/Pine-cab-PMRWinter202500014.jpg"),
      P("2025/02/PMRWinter202500015.jpg"),
      P("2025/02/PMRWinter202500016.jpg"),
      P("2025/02/PMRWinter202500018.jpg"),
      P("2025/01/PineCabins-1400x875.jpg"),
    ],
  },
  {
    name: "Oak Premier Cabin",
    category: "Cabins",
    filter: "Large groups",
    sleeps: "Up to 12 guests",
    layout: "6 bedrooms · loft with futons · rustic living area",
    features: ["Full Kitchen", "Sleeps 12", "Loft with futons", "Mountain views"],
    description: "The largest cabin at PMR — 6 bedrooms, loft with futons, full kitchen. Ideal for an extended family summer vacation or group Shabbaton.",
    cta: "https://book.presidentialmountainresort.com",
    image: P("2025/02/PMR-OakPremiereCabin.jpg"),
    gallery: [
      P("2025/02/PMR-OakPremiereCabin.jpg"),
      P("2025/02/Oak-Prem-PMRWinter202500032.jpg"),
      P("2025/02/Oak-Prem-PMRWinter202500031.jpg"),
      P("2025/02/Oak-Prem-PMRWinter202500033.jpg"),
      P("2025/02/Oak-Prem-PMRWinter202500034.jpg"),
      P("2025/02/Oak-Prem-PMRWinter202500035.jpg"),
    ],
  },
  {
    name: "Cedar Select Townhomes",
    category: "Townhomes",
    filter: "Families",
    sleeps: "1- and 2-bedroom options",
    layout: "Townhome-style · 1 or 2 bedrooms",
    features: ["Full Kitchen", "Flexible layouts", "Longer stays", "Comfortable"],
    description: "Townhome-style cabins with full kitchen — great for families who want easy meal prep after days of White Mountains adventure.",
    cta: "https://cedarselect.presidentialmountainresort.com",
    image: P("2025/02/CedarSelects.jpg"),
    gallery: [
      P("2025/02/CedarSelects.jpg"),
      P("2025/02/cedar-select-PMRWinter202500057.jpg"),
      P("2025/02/cedar-select-PMRWinter202500058.jpg"),
      P("2025/02/cedar-select-PMRWinter202500059.jpg"),
      P("2025/02/cedar-select-PMRWinter202500060.jpg"),
    ],
  },
  {
    name: "Cedar Suite Cabins",
    category: "Townhomes",
    filter: "Couples",
    sleeps: "1 bedroom",
    layout: "One-bedroom suite",
    features: ["Full Kitchen", "Cozy basecamp", "Extended-stay friendly", "Summer views"],
    description: "One-bedroom Cedar Suites with full kitchen — a comfortable, private base for exploring the White Mountains all summer.",
    cta: "https://cedarsuite.presidentialmountainresort.com",
    image: P("2025/02/cedarSuites.jpg"),
    gallery: [
      P("2025/02/cedarSuites.jpg"),
      P("2025/02/cedar-cab-PMRWinter202500065.jpg"),
      P("2025/02/cedar-cab-PMRWinter202500066.jpg"),
      P("2025/02/cedar-cab-PMRWinter202500067.jpg"),
      P("2025/02/cedar-cab-PMRWinter202500068.jpg"),
    ],
  },
  {
    name: "Cherry Lodge Rooms",
    category: "Lodge rooms",
    filter: "Lodge rooms",
    sleeps: "Weekend or extended stays",
    layout: "Lodge-style rooms",
    features: ["Kitchenette", "Mini fridge", "Deck", "Mountain basecamp"],
    description: "Lodge-style rooms with a deck and kitchenette — a simple, clean summer basecamp with easy access to all resort amenities.",
    cta: "https://cherrylodge.holidayfuture.com",
    image: P("2025/01/PMR-CherryLodge2-1400x934.jpg"),
    gallery: [
      P("2025/01/PMR-CherryLodge2-1400x934.jpg"),
      P("2025/01/PMR-CherryLodge-1400x934.jpg"),
      P("2025/01/PMR-CherryBathroom-1400x934.jpg"),
    ],
  },
];

const filters = ["All","Couples","Families","Large groups","Lakeside","Townhomes","Lodge rooms"];
const categoryFilters = ["All","Cabins","Townhomes","Lodge rooms"];
const filterIcons = { All:"🏕️", Couples:"💑", Families:"👨‍👩‍👧‍👦", "Large groups":"👥", Lakeside:"🏞️", Townhomes:"🏘️", "Lodge rooms":"🏨" };

const kosherInfo = [
  { icon:"🛝", title:"Beautiful Playgrounds", body:"Multiple large playgrounds on site — kids can run, climb and play all day long. Free!" },
  { icon:"⛵", title:"Boating on the Lake", body:"Private lake with kayaks, paddle boats and small boats available right on property." },
  { icon:"🚲", title:"Biking Trails & Rentals", body:"Bike rentals available on site with scenic trails through the White Mountains." },
  { icon:"🐑", title:"Petting Zoo — Free!", body:"Free petting zoo with sheep, goats and chickens — kids love feeding the animals." },
  { icon:"🎪", title:"Moonwalk", body:"Bounce house moonwalk for kids — hours vary, check at the front desk." },
  { icon:"🕍", title:"Shul & Mikvah On-Site", body:"On-site shul with daily minyanim. Mikvah on premises. Details at check-in." },
];

// Map hotspots — cabins + playground
const mapHotspots = [
  { label:"Rosewood Cottage",  shortLabel:"RC", type:"cabin",      cabinName:"Rosewood Cottage",            x:91, y:57, zoomOrigin:"91% 57%" },
  { label:"Rosewood Villas",   shortLabel:"RV", type:"cabin",      cabinName:"Rosewood Villa Cabins",       x:84, y:42, zoomOrigin:"84% 42%" },
  { label:"Rosewood Villa 16", shortLabel:"RV", type:"cabin",      cabinName:"Rosewood Villa Cabins",       x:91, y:42, zoomOrigin:"91% 42%" },
  { label:"Rosewood Premier",  shortLabel:"RP", type:"cabin",      cabinName:"Rosewood Premier Cabins",     x:76, y:28, zoomOrigin:"76% 28%" },
  { label:"Chestnut Cabins",   shortLabel:"CH", type:"cabin",      cabinName:"Chestnut Studio Cabins",      x:63, y:52, zoomOrigin:"63% 52%" },
  { label:"Pine Cabins",       shortLabel:"PN", type:"cabin",      cabinName:"Pine Cabins",                 x:31, y:62, zoomOrigin:"31% 62%" },
  { label:"Oak Premier",       shortLabel:"OK", type:"cabin",      cabinName:"Oak Premier Cabin",           x:24, y:46, zoomOrigin:"24% 46%" },
  { label:"Cedar Lodge",       shortLabel:"CD", type:"cabin",      cabinName:"Cedar Select Townhomes",      x:72, y:40, zoomOrigin:"72% 40%" },
  { label:"Cherry Lodge",      shortLabel:"CL", type:"cabin",      cabinName:"Cherry Lodge Rooms",          x:57, y:27, zoomOrigin:"57% 27%" },
  { label:"North Playground",  shortLabel:"🛝", type:"amenity",    icon:"🛝", desc:"Large playground with slides and climbing structures.", image:"/playground.jpg", x:44, y:48, zoomOrigin:"44% 48%" },
  { label:"South Playground",  shortLabel:"🛝", type:"amenity",    icon:"🛝", desc:"Big playground with slides, climbing and spinning toys.", image:"/playground.jpg", x:75, y:68, zoomOrigin:"75% 68%" },
  { label:"Boat Dock",         shortLabel:"⛵", type:"amenity",    icon:"⛵", desc:"Private lake with wooden bridges, boat dock, kayaks and paddle boats.", image:"/bridge.jpg", x:38, y:78, zoomOrigin:"38% 78%" },
  { label:"Swimming Pool",     shortLabel:"D",  type:"amenity",    icon:"D",  desc:"Pool with separate men's and women's swim hours.", x:54, y:30, zoomOrigin:"54% 30%" },
  { label:"Viewing Zoo",       shortLabel:"🐑", type:"amenity",    icon:"🐑", desc:"Free petting zoo with sheep, goats, chickens and more — kids love feeding the animals!", image:"/zoo.jpg", x:95, y:55, zoomOrigin:"95% 55%" },
  { label:"Shul",              shortLabel:"🕍", type:"amenity",    icon:"🕍", desc:"On-site shul with daily minyanim throughout the summer.", image:"/shul.jpg", x:65, y:38, zoomOrigin:"65% 38%" },
];

const mapLegend = [
  "Office","Check-in & Gift Shop","Coin-Op Laundry","Swimming Pool (separate hours)",
  "Cherry Lodge Rooms","Presidential Hall / Shul","North Playground","South Playground",
  "East Playground","Boat Dock","North Fire Pit","South Fire Pit",
  "Gazebo on the Lake","Toddler Playhouse","Viewing Zoo","Rosewood Villa Cabins (16 & 17)",
];

function useInView(threshold: number = 0.08) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function Img({ src, alt, style, onMouseEnter, onMouseLeave }: { src:string; alt:string; style?:any; onMouseEnter?:any; onMouseLeave?:any }) {
  const [imgSrc, setImgSrc] = useState(src);
  useEffect(() => setImgSrc(src), [src]);
  return <img src={imgSrc} alt={alt} onError={() => setImgSrc(FALLBACK)} style={style} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} />;
}

// Lightbox gallery modal - arrows only, no thumbnails
function Gallery({ cabin, onClose }: { cabin:any; onClose:()=>void }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") onClose(); if (e.key === "ArrowRight") setIdx(i => (i+1) % cabin.gallery.length); if (e.key === "ArrowLeft") setIdx(i => (i-1+cabin.gallery.length) % cabin.gallery.length); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [cabin, onClose]);

  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.88)", zIndex:1000, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div onClick={e => e.stopPropagation()} style={{ width:"100%", maxWidth:860, position:"relative" }}>
        <button onClick={onClose} style={{ position:"absolute", top:-44, right:0, background:"none", border:"none", color:"#fff", fontSize:28, cursor:"pointer", lineHeight:1 }}>✕</button>
        <div style={{ borderRadius:"1.5rem", overflow:"hidden", aspectRatio:"3/2", background:"#1a2a1a", position:"relative" }}>
          <Img src={cabin.gallery[idx]} alt={`${cabin.name} photo ${idx+1}`} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
          {cabin.gallery.length > 1 && <>
            <button onClick={() => setIdx(i => (i-1+cabin.gallery.length)%cabin.gallery.length)} style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", background:"rgba(0,0,0,0.55)", border:"none", color:"#fff", width:44, height:44, borderRadius:"50%", fontSize:24, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>‹</button>
            <button onClick={() => setIdx(i => (i+1)%cabin.gallery.length)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"rgba(0,0,0,0.55)", border:"none", color:"#fff", width:44, height:44, borderRadius:"50%", fontSize:24, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>›</button>
            <div style={{ position:"absolute", bottom:12, left:"50%", transform:"translateX(-50%)", background:"rgba(0,0,0,0.5)", color:"#fff", fontSize:12, fontWeight:600, padding:"4px 12px", borderRadius:20 }}>{idx+1} / {cabin.gallery.length}</div>
          </>}
        </div>
        <div style={{ marginTop:16, textAlign:"center" }}>
          <h3 style={{ margin:"0 0 8px", color:"#fff", fontSize:20, fontWeight:900, fontFamily:"Georgia,serif" }}>{cabin.name}</h3>
          <p style={{ margin:"0 0 14px", color:"rgba(255,255,255,0.7)", fontSize:13 }}>{cabin.layout}</p>
          <a href={cabin.cta} target="_blank" rel="noreferrer" style={{ background:"#1b4d2e", color:"#d4e8a0", borderRadius:24, padding:"10px 28px", fontSize:14, fontWeight:700, textDecoration:"none" }}>Check Availability ›</a>
        </div>
      </div>
    </div>
  );
}

function CabinCard({ cabin, index, onOpenGallery }: { cabin:any; index:number; onOpenGallery:(c:any)=>void }) {
  const [ref, inView] = useInView();
  const [hovered, setHovered] = useState(false);
  return (
    <article ref={ref} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{
      opacity: inView?1:0, transform: inView?"translateY(0)":"translateY(28px)",
      transition: `opacity 0.55s ease ${index*0.06}s, transform 0.55s ease ${index*0.06}s`,
      borderRadius:"1.75rem", overflow:"hidden", background:"#fff", border:"1px solid #ddeedd",
      boxShadow: hovered?"0 20px 60px rgba(0,60,20,0.14)":"0 2px 12px rgba(0,0,0,0.05)",
      display:"flex", flexDirection:"column", cursor:"pointer",
    }}>
      {/* Image — click opens gallery */}
      <div onClick={() => onOpenGallery(cabin)} style={{ position:"relative", height:230, overflow:"hidden", background:"#b8ccb0", flexShrink:0 }}>
        <Img src={cabin.image} alt={cabin.name} style={{ width:"100%", height:"100%", objectFit:"cover", transform:hovered?"scale(1.06)":"scale(1.01)", transition:"transform 0.65s ease" }} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg,rgba(0,0,0,0.0) 40%,rgba(0,30,10,0.65) 100%)" }} />
        {/* Photo count badge */}
        <div style={{ position:"absolute", top:12, right:12, background:"rgba(0,0,0,0.55)", backdropFilter:"blur(4px)", color:"#fff", fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:20, display:"flex", alignItems:"center", gap:5 }}>
          📷 {cabin.gallery.length} photos
        </div>
        <div style={{ position:"absolute", top:12, left:12, display:"flex", gap:6, flexWrap:"wrap" }}>
          <span style={{ background:"rgba(255,255,255,0.93)", color:"#1a3a22", fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:20 }}>{cabin.category}</span>
          <span style={{ background:"rgba(0,0,0,0.42)", color:"#fff", fontSize:11, fontWeight:600, padding:"3px 10px", borderRadius:20 }}>{cabin.filter}</span>
        </div>
        <div style={{ position:"absolute", bottom:12, left:14, right:14 }}>
          <h3 style={{ margin:0, fontSize:18, fontWeight:900, color:"#fff", letterSpacing:"-0.02em", textShadow:"0 2px 10px rgba(0,0,0,0.5)", fontFamily:"Georgia,serif" }}>{cabin.name}</h3>
        </div>
        {/* Hover overlay - arrow hint */}
        {hovered && <div style={{ position:"absolute", inset:0, background:"rgba(0,60,20,0.18)", display:"flex", alignItems:"center", justifyContent:"center", gap:24 }}>
          <span style={{ color:"rgba(255,255,255,0.9)", fontSize:32 }}>‹</span>
          <span style={{ background:"rgba(255,255,255,0.95)", color:"#1b4d2e", fontSize:13, fontWeight:800, padding:"8px 18px", borderRadius:24 }}>Browse Photos</span>
          <span style={{ color:"rgba(255,255,255,0.9)", fontSize:32 }}>›</span>
        </div>}
      </div>

      <div style={{ padding:"16px 18px 18px", display:"flex", flexDirection:"column", flex:1 }}>
        <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:11 }}>
          {cabin.features.map(f => (
            <span key={f} style={{ background:f.toLowerCase().includes("kitchen")?"#e8f5e9":"#f0faf2", color:f.toLowerCase().includes("kitchen")?"#1b5e20":"#2a5c34", fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:20, border:f.toLowerCase().includes("kitchen")?"1px solid rgba(27,94,32,0.22)":"1px solid rgba(42,92,52,0.1)" }}>{f}</span>
          ))}
        </div>
        <div style={{ fontSize:12, color:"#4a5a48", marginBottom:4 }}><span style={{ fontWeight:700, color:"#1c2a1a" }}>Best for:</span> {cabin.sleeps}</div>
        <div style={{ fontSize:12, color:"#4a5a48", marginBottom:11 }}><span style={{ fontWeight:700, color:"#1c2a1a" }}>Layout:</span> {cabin.layout}</div>
        <p style={{ fontSize:13, color:"#5a6a58", lineHeight:1.75, flex:1, margin:"0 0 16px", fontFamily:"Georgia,serif" }}>{cabin.description}</p>
        <a href={cabin.cta} target="_blank" rel="noreferrer" style={{ display:"flex", alignItems:"center", justifyContent:"center", background:"#1b4d2e", color:"#fff", borderRadius:28, padding:"11px 18px", fontSize:13, fontWeight:700, textDecoration:"none" }}
          onMouseEnter={e => e.currentTarget.style.background="#2a6b42"}
          onMouseLeave={e => e.currentTarget.style.background="#1b4d2e"}
        >Check Availability ›</a>
      </div>
    </article>
  );
}

function MapSection(): JSX.Element {
  const [selectedSpot, setSelectedSpot] = useState(mapHotspots[0]);
  const [fading, setFading] = useState(false);

  const handleSelect = (spot) => {
    if (spot.label === selectedSpot.label) return;
    setFading(true);
    setTimeout(() => { setSelectedSpot(spot); setFading(false); }, 200);
  };

  const selectedCabin = selectedSpot.type === "cabin"
    ? cabins.find(c => c.name === selectedSpot.cabinName)
    : null;

  return (
    <div style={{ background:"#0d2b18", overflow:"hidden", color:"#fff" }}>
      <div style={{ padding:"1.5rem 1.5rem 0" }}>
        <p style={{ margin:"0 0 6px", fontSize:11, fontWeight:700, letterSpacing:"0.2em", color:"#7dcfa0", textTransform:"uppercase" }}>Interactive resort map</p>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:12 }}>
          <h2 style={{ margin:0, fontSize:"clamp(1.5rem,3vw,2.2rem)", fontWeight:900, letterSpacing:"-0.03em", fontFamily:"Georgia,serif" }}>
            Pick a cabin or spot. See where it is.
          </h2>
          <button onClick={() => handleSelect(mapHotspots[0])} style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.15)", color:"#fff", borderRadius:20, padding:"7px 16px", fontSize:12, fontWeight:600, cursor:"pointer" }}>Reset</button>
        </div>
      </div>

      {/* FULL WIDTH MAP */}
      <div style={{ padding:"1.2rem 1.5rem 0" }}>
        <div style={{ borderRadius:"1.6rem", overflow:"hidden", aspectRatio:"16/7", background:"#0d2b18", border:"1px solid rgba(255,255,255,0.1)", position:"relative" }}>
          <div style={{ position:"relative", width:"100%", height:"100%", overflow:"hidden" }}>
            <div style={{
              position:"absolute", inset:0,
              transform:`scale(${selectedSpot === mapHotspots[0] ? 1 : 1.72})`,
              transformOrigin:selectedSpot.zoomOrigin,
              transition:"transform 0.7s cubic-bezier(0.4,0,0.2,1), transform-origin 0.7s cubic-bezier(0.4,0,0.2,1)",
            }}>
              <img src="https://images.weserv.nl/?url=presidentialmountainresort.com/wp-content/uploads/2025/10/PMR-Map-1920.jpg" alt="PMR Resort Map"
                style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
              />
              {mapHotspots.map((spot: any) => {
                const isSel = spot.label === selectedSpot.label;
                const isAmenity = spot.type === "amenity";
                const isPool = spot.label === "Swimming Pool";
                const size = isSel ? 24 : isAmenity ? (isPool ? 17 : 20) : 17;
                return (
                  <button key={spot.label} onClick={() => handleSelect(spot)} title={spot.label} aria-label={`Show ${spot.label}`} style={{
                    position:"absolute", left:`${spot.x}%`, top:`${spot.y}%`, transform:"translate(-50%,-50%)",
                    width:size, height:size, borderRadius:"50%",
                    border:isSel?"2px solid #fff":"1px solid rgba(255,255,255,0.7)",
                    background:isSel?"#c8a020":isAmenity?"rgba(30,80,50,0.95)":"rgba(13,43,24,0.9)",
                    color:isSel?"#1c1400":"#fff", fontSize:isPool?6:isAmenity?9:6, fontWeight:900,
                    cursor:"pointer", boxShadow:isSel?"0 0 0 4px rgba(200,160,32,0.4)":"0 1px 4px rgba(0,0,0,0.6)",
                    transition:"all 0.25s ease", zIndex:isSel?10:5, display:"flex", alignItems:"center", justifyContent:"center",
                    lineHeight:1,
                  }}>{isAmenity ? spot.icon : spot.shortLabel}</button>
                );
              })}
            </div>
            <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(0,0,0,0.1),transparent 60%)", pointerEvents:"none" }} />
          </div>
        </div>
      </div>

      {/* SIDEBAR + DETAIL below the map */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:16, padding:"1rem 1.5rem 1.5rem" }}>

        {/* Cabin + amenity list */}
        <div style={{ display:"flex", flexWrap:"wrap", gap:8, alignContent:"flex-start" }}>
          <p style={{ width:"100%", fontSize:10, fontWeight:700, color:"#7dcfa0", letterSpacing:"0.15em", textTransform:"uppercase", margin:"0 0 4px" }}>Cabins</p>
          {mapHotspots.filter((s:any)=>s.type==="cabin").map((spot: any) => {
            const isSel = spot.label === selectedSpot.label;
            const cabin = cabins.find(c => c.name === spot.cabinName);
            return (
              <button key={spot.label} onClick={() => handleSelect(spot)} style={{
                textAlign:"left", borderRadius:"1rem", padding:"8px 12px",
                background:isSel?"#fff":"rgba(255,255,255,0.07)",
                border: isSel?"none":"1px solid rgba(255,255,255,0.1)",
                cursor:"pointer", transition:"background 0.2s", display:"flex", alignItems:"center", gap:8,
              }}
                onMouseEnter={e=>{if(!isSel)e.currentTarget.style.background="rgba(255,255,255,0.12)";}}
                onMouseLeave={e=>{if(!isSel)e.currentTarget.style.background="rgba(255,255,255,0.07)";}}
              >
                <span style={{ width:26, height:26, borderRadius:"50%", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", background:isSel?"#c8a020":"#1f6b3a", color:isSel?"#1c1400":"#fff", fontSize:9, fontWeight:900 }}>{spot.shortLabel}</span>
                <span>
                  <span style={{ display:"block", fontSize:12, fontWeight:800, color:isSel?"#0d2b18":"#fff", lineHeight:1.2, whiteSpace:"nowrap" }}>{spot.label}</span>
                  <span style={{ display:"block", fontSize:10, color:isSel?"#5a6a48":"rgba(255,255,255,0.45)" }}>{cabin?.layout?.split("·")[0]?.trim()}</span>
                </span>
              </button>
            );
          })}
          <p style={{ width:"100%", fontSize:10, fontWeight:700, color:"#7dcfa0", letterSpacing:"0.15em", textTransform:"uppercase", margin:"12px 0 4px" }}>Amenities</p>
          {mapHotspots.filter((s:any)=>s.type==="amenity").map((spot: any) => {
            const isSel = spot.label === selectedSpot.label;
            return (
              <button key={spot.label} onClick={() => handleSelect(spot)} style={{
                textAlign:"left", borderRadius:"1rem", padding:"8px 12px",
                background:isSel?"#fff":"rgba(255,255,255,0.07)",
                border: isSel?"none":"1px solid rgba(255,255,255,0.1)",
                cursor:"pointer", transition:"background 0.2s", display:"flex", alignItems:"center", gap:8,
              }}
                onMouseEnter={e=>{if(!isSel)e.currentTarget.style.background="rgba(255,255,255,0.12)";}}
                onMouseLeave={e=>{if(!isSel)e.currentTarget.style.background="rgba(255,255,255,0.07)";}}
              >
                <span style={{ fontSize:16 }}>{spot.icon}</span>
                <span style={{ fontSize:12, fontWeight:800, color:isSel?"#0d2b18":"#fff", whiteSpace:"nowrap" }}>{spot.label}</span>
              </button>
            );
          })}
        </div>

        {/* Detail panel */}
        <aside style={{ background:"#fff", borderRadius:"1.6rem", overflow:"hidden", color:"#1c2a1a", opacity:fading?0:1, transform:fading?"scale(0.97)":"scale(1)", transition:"opacity 0.2s,transform 0.2s", alignSelf:"start" }}>
          {selectedSpot.type === "cabin" && selectedCabin ? (<>
            <div style={{ height:160, overflow:"hidden", background:"#b8ccb0" }}>
              <Img src={selectedCabin.image} alt={selectedCabin.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
            </div>
            <div style={{ padding:"12px 14px 14px" }}>
              <span style={{ display:"inline-block", background:"#e8f5e9", color:"#1b5e20", fontSize:10, fontWeight:700, padding:"2px 9px", borderRadius:20, border:"1px solid rgba(27,94,32,0.2)", marginBottom:7 }}>
                {selectedSpot.shortLabel} · {selectedSpot.label}
              </span>
              <h3 style={{ margin:"0 0 5px", fontSize:16, fontWeight:900, letterSpacing:"-0.02em", fontFamily:"Georgia,serif" }}>{selectedCabin.name}</h3>
              <p style={{ margin:"0 0 10px", fontSize:11, color:"#6a7a68", lineHeight:1.6 }}>{selectedCabin.description.slice(0,90)}…</p>
              <div style={{ fontSize:11, color:"#4a5a48", marginBottom:10, display:"flex", flexDirection:"column", gap:4 }}>
                <div><span style={{ fontWeight:700, color:"#1c2a1a" }}>Best for:</span> {selectedCabin.sleeps}</div>
                <div><span style={{ fontWeight:700, color:"#1c2a1a" }}>Layout:</span> {selectedCabin.layout}</div>
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginBottom:12 }}>
                {selectedCabin.features.map(f => <span key={f} style={{ background:"#f0faf2", color:"#2a5c34", fontSize:10, fontWeight:600, padding:"2px 8px", borderRadius:20 }}>{f}</span>)}
              </div>
              <a href={selectedCabin.cta} target="_blank" rel="noreferrer" style={{ display:"flex", alignItems:"center", justifyContent:"center", background:"#1b4d2e", color:"#fff", borderRadius:22, padding:"9px 14px", fontSize:12, fontWeight:700, textDecoration:"none" }}
                onMouseEnter={e=>e.currentTarget.style.background="#2a6b42"}
                onMouseLeave={e=>e.currentTarget.style.background="#1b4d2e"}
              >See Availability ›</a>
            </div>
          </>) : (
            <div>
              {selectedSpot.image && (
                <div style={{ height:160, overflow:"hidden", background:"#b8ccb0" }}>
                  <Img src={selectedSpot.image} alt={selectedSpot.label} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                </div>
              )}
              <div style={{ padding: selectedSpot.image ? "14px 18px 18px" : "24px 18px", textAlign:"center" }}>
                {!selectedSpot.image && <div style={{ fontSize:48, marginBottom:12 }}>{selectedSpot.icon}</div>}
                <h3 style={{ margin:"0 0 8px", fontSize:18, fontWeight:900, fontFamily:"Georgia,serif" }}>{selectedSpot.label}</h3>
                <p style={{ margin:0, fontSize:13, color:"#6a7a68", lineHeight:1.65 }}>{selectedSpot.desc}</p>
                {selectedSpot.label === "Shul" && <a href="#shul" style={{ display:"inline-block", marginTop:14, background:"#1b4d2e", color:"#d4e8a0", borderRadius:22, padding:"8px 18px", fontSize:12, fontWeight:700, textDecoration:"none" }}>More Shul Info</a>}
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Legend */}
      <div style={{ borderTop:"1px solid rgba(255,255,255,0.07)", padding:"1.25rem 1.5rem 1.75rem" }}>
        <p style={{ margin:"0 0 12px", fontSize:10, fontWeight:700, letterSpacing:"0.2em", color:"#7dcfa0", textTransform:"uppercase" }}>Resort legend</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(155px,1fr))", gap:7 }}>
          {mapLegend.map(item => <div key={item} style={{ background:"rgba(255,255,255,0.06)", borderRadius:10, padding:"8px 12px", border:"1px solid rgba(255,255,255,0.07)", fontSize:11, fontWeight:600, color:"rgba(255,255,255,0.8)" }}>{item}</div>)}
        </div>
      </div>
    </div>
  );
}

function FaqCard({ category, icon, items }: { category:string; icon:string; items:{q:string;a:string}[] }) {
  const [openIdx, setOpenIdx] = useState(null);
  return (
    <div style={{ background:"#fff", borderRadius:"1.5rem", border:"1px solid #ddeedd", overflow:"hidden" }}>
      <div style={{ padding:"18px 22px 14px", borderBottom:"1px solid #eef5ee", display:"flex", alignItems:"center", gap:10 }}>
        <span style={{ fontSize:20 }}>{icon}</span>
        <h3 style={{ margin:0, fontSize:16, fontWeight:900, color:"#1c2a1a" }}>{category}</h3>
      </div>
      <div style={{ padding:"8px 0" }}>
        {items.map((item, i) => (
          <div key={i} style={{ borderBottom: i < items.length-1 ? "1px solid #f0f7f0" : "none" }}>
            <button onClick={() => setOpenIdx(openIdx === i ? null : i)} style={{
              width:"100%", textAlign:"left", background:"none", border:"none",
              padding:"12px 22px", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center", gap:12,
            }}
              onMouseEnter={e => e.currentTarget.style.background="#f7fdf7"}
              onMouseLeave={e => e.currentTarget.style.background="none"}
            >
              <span style={{ fontSize:13, fontWeight:700, color:"#1c2a1a", lineHeight:1.4 }}>{item.q}</span>
              <span style={{ fontSize:16, color:"#1b4d2e", flexShrink:0, transform: openIdx===i ? "rotate(45deg)" : "none", transition:"transform 0.2s" }}>+</span>
            </button>
            {openIdx === i && (
              <div style={{ padding:"0 22px 14px", fontSize:13, color:"#5a6a58", lineHeight:1.7 }}>{item.a}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PMRCabinsRedesign() {
  const [query, setQuery] = useState("");
  const [tripFilter, setTripFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [heroVisible, setHeroVisible] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(null);

  useEffect(() => { setTimeout(() => setHeroVisible(true), 80); }, []);

  const filteredCabins = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cabins.filter(c => {
      const matchTrip = tripFilter==="All" || c.filter===tripFilter;
      const matchCat = categoryFilter==="All" || c.category===categoryFilter;
      const hay = `${c.name} ${c.category} ${c.filter} ${c.sleeps} ${c.layout} ${c.description} ${c.features.join(" ")}`.toLowerCase();
      return matchTrip && matchCat && (!q || hay.includes(q));
    });
  }, [query, tripFilter, categoryFilter]);

  return (
    <div style={{ minHeight:"100vh", background:"#f2f7ef", fontFamily:"Georgia,serif", color:"#1c2a1a" }}>
      {galleryOpen && <Gallery cabin={galleryOpen} onClose={() => setGalleryOpen(null)} />}

      {/* Header */}
      <header style={{ position:"sticky", top:0, zIndex:50, background:"rgba(242,247,239,0.92)", backdropFilter:"blur(16px)", borderBottom:"1px solid rgba(60,100,60,0.12)" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"13px 24px", gap:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:44, height:44, borderRadius:14, background:"#1b4d2e", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:900, color:"#c8d88a", letterSpacing:"0.04em" }}>PMR</div>
            <div>
              <p style={{ margin:0, fontSize:14, fontWeight:700, color:"#1c2a1a", lineHeight:1.2 }}>PMR Summer Guide</p>
              <p style={{ margin:0, fontSize:11, color:"#6a8060" }}>Bethlehem, New Hampshire · Family-Friendly</p>
            </div>
          </div>
          <nav style={{ display:"flex", alignItems:"center", gap:22, flexWrap:"wrap" }}>
            {[["#cabins","Cabins"],["#map","Map"],["#shul","Shul & Mikvah"],["#faq","FAQ"]].map(([href,label]) => (
              <a key={href} href={href} style={{ fontSize:13, fontWeight:600, color:"#4a6a4a", textDecoration:"none" }}
                onMouseEnter={e=>e.currentTarget.style.color="#1b4d2e"}
                onMouseLeave={e=>e.currentTarget.style.color="#4a6a4a"}
              >{label}</a>
            ))}
            <a href="tel:6032532222" style={{ background:"#1b4d2e", color:"#d4e8a0", borderRadius:24, padding:"9px 20px", fontSize:13, fontWeight:700, textDecoration:"none" }}>Call to Book</a>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section style={{ position:"relative", overflow:"hidden", minHeight:580, display:"flex", alignItems:"center" }}>
          <div style={{ position:"absolute", inset:0 }}>
            <Img src={P("2025/04/GH-PMR-39-2-1400x933.jpg")} alt="Presidential Mountain Resort summer" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
            <div style={{ position:"absolute", inset:0, background:"linear-gradient(105deg,rgba(8,35,15,0.82) 0%,rgba(8,35,15,0.4) 55%,rgba(8,35,15,0.15) 100%)" }} />
          </div>
          <div style={{ position:"relative", maxWidth:1200, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 420px", gap:48, alignItems:"center", padding:"80px 24px 72px", width:"100%" }}>
            <div style={{ opacity:heroVisible?1:0, transform:heroVisible?"none":"translateY(20px)", transition:"all 0.7s ease" }}>
              <div style={{ display:"flex", gap:10, marginBottom:22, flexWrap:"wrap" }}>
                <span style={{ background:"rgba(255,255,255,0.15)", backdropFilter:"blur(8px)", color:"#fff", fontSize:12, fontWeight:700, padding:"5px 14px", borderRadius:20, border:"1px solid rgba(255,255,255,0.2)" }}>🌿 Summer Family Cabin Guide</span>
                <span style={{ background:"rgba(200,168,32,0.25)", backdropFilter:"blur(8px)", color:"#f5e090", fontSize:12, fontWeight:700, padding:"5px 14px", borderRadius:20, border:"1px solid rgba(200,168,32,0.3)" }}>🕍 Shul · Mikvah · Heimish Food</span>
              </div>
              <h1 style={{ margin:"0 0 18px", color:"#fff", fontSize:"clamp(2.2rem,4.5vw,3.6rem)", fontWeight:900, letterSpacing:"-0.03em", lineHeight:1.05 }}>
                Plan your PMR<br />summer stay with<br /><span style={{ color:"#a8e890" }}>confidence.</span>
              </h1>
              <p style={{ margin:"0 0 28px", fontSize:16, lineHeight:1.8, color:"rgba(255,255,255,0.88)", maxWidth:480 }}>
                Explore cabins by family size, see the resort map, view Shul and Mikvah info, check what's included, and call PMR to reserve the cabin that fits your family.
              </p>
              <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                <a href="#cabins" style={{ background:"#1b4d2e", color:"#d4e8a0", borderRadius:30, padding:"13px 28px", fontSize:15, fontWeight:700, textDecoration:"none", boxShadow:"0 4px 20px rgba(0,0,0,0.25)" }}>Find a Cabin</a>
                <a href="#map" style={{ background:"rgba(255,255,255,0.15)", backdropFilter:"blur(8px)", color:"#fff", borderRadius:30, padding:"13px 28px", fontSize:15, fontWeight:700, textDecoration:"none", border:"1px solid rgba(255,255,255,0.28)" }}>Explore Map</a>
                <a href="#shul" style={{ background:"rgba(255,255,255,0.15)", backdropFilter:"blur(8px)", color:"#fff", borderRadius:30, padding:"13px 28px", fontSize:15, fontWeight:700, textDecoration:"none", border:"1px solid rgba(255,255,255,0.28)" }}>Shul & Mikvah</a>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginTop:32, maxWidth:400 }}>
                {[["37","log cabins"],["Heimish","food available"],["Shul","on premises"]].map(([n,l])=>(
                  <div key={l} style={{ background:"rgba(255,255,255,0.12)", backdropFilter:"blur(8px)", borderRadius:14, padding:"13px 14px", border:"1px solid rgba(255,255,255,0.17)" }}>
                    <p style={{ margin:"0 0 2px", fontSize:19, fontWeight:900, color:"#fff" }}>{n}</p>
                    <p style={{ margin:0, fontSize:11, color:"rgba(255,255,255,0.7)" }}>{l}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Hero card */}
            <div style={{ opacity:heroVisible?1:0, transform:heroVisible?"none":"translateY(24px) scale(0.97)", transition:"all 0.85s ease 0.2s" }}>
              <div style={{ borderRadius:"2rem", overflow:"hidden", boxShadow:"0 24px 64px rgba(0,0,0,0.38)" }}>
                <div style={{ position:"relative", height:320, background:"#b8ccb0" }}>
                  <Img src={P("2025/02/PMR-RosewoodVilla17-1400x934.jpg")} alt="PMR Cabin" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
                </div>
                <div style={{ background:"rgba(255,255,255,0.97)", padding:"18px 20px" }}>
                  <p style={{ margin:"0 0 4px", fontSize:10, fontWeight:700, color:"#1b4d2e", letterSpacing:"0.14em", textTransform:"uppercase" }}>On-site summer essentials</p>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:7, marginTop:8 }}>
                    {["Shul on premises","Mikvah","Heimish food","Lake activities"].map(tag => (
                      <span key={tag} style={{ background:"#e8f5e9", color:"#1b5e20", fontSize:12, fontWeight:700, padding:"4px 12px", borderRadius:20, border:"1px solid rgba(27,94,32,0.18)" }}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cabin finder */}
        <section style={{ maxWidth:1200, margin:"0 auto", padding:"40px 24px 0" }}>
          <div style={{ background:"#fff", borderRadius:"1.75rem", padding:"28px 32px", border:"1px solid #ddeedd", boxShadow:"0 2px 16px rgba(0,60,20,0.07)" }}>
            <p style={{ margin:"0 0 4px", fontSize:11, fontWeight:700, letterSpacing:"0.18em", color:"#1b4d2e", textTransform:"uppercase" }}>Cabin Finder</p>
            <h2 style={{ margin:"0 0 6px", fontSize:22, fontWeight:900, letterSpacing:"-0.02em" }}>Who is coming?</h2>
            <p style={{ margin:"0 0 20px", fontSize:13, color:"#6a8060" }}>Filter cabins by adults and children instead of guessing from a brochure.</p>
            <div style={{ display:"flex", gap:12, flexWrap:"wrap", alignItems:"flex-end" }}>
              <div style={{ flex:"1 1 180px" }}>
                <label style={{ display:"block", fontSize:12, fontWeight:700, color:"#4a6a4a", marginBottom:6 }}>Adults</label>
                <select onChange={e => { const v=parseInt(e.target.value); setTripFilter(v>=8?"Large groups":v>=3?"Families":"Couples"); }}
                  style={{ width:"100%", height:44, borderRadius:24, border:"1.5px solid #b8d8b8", background:"#fff", padding:"0 16px", fontSize:14, fontWeight:600, color:"#1c2a1a", outline:"none", cursor:"pointer" }}>
                  {[1,2,3,4,5,6,7,8,9,10].map(n=><option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div style={{ flex:"1 1 180px" }}>
                <label style={{ display:"block", fontSize:12, fontWeight:700, color:"#4a6a4a", marginBottom:6 }}>Children</label>
                <select style={{ width:"100%", height:44, borderRadius:24, border:"1.5px solid #b8d8b8", background:"#fff", padding:"0 16px", fontSize:14, fontWeight:600, color:"#1c2a1a", outline:"none", cursor:"pointer" }}>
                  {[0,1,2,3,4,5,6,7,8,9,10].map(n=><option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <a href="#cabins" style={{ background:"#1b4d2e", color:"#d4e8a0", borderRadius:24, padding:"0 28px", height:44, fontSize:14, fontWeight:700, textDecoration:"none", display:"flex", alignItems:"center", gap:8, whiteSpace:"nowrap", flexShrink:0 }}>🔎 Search</a>
            </div>
          </div>
        </section>

        {/* Shul section */}
        <section id="shul" style={{ maxWidth:1200, margin:"0 auto", padding:"52px 24px 0" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24, alignItems:"stretch" }}>
            <div style={{ borderRadius:"2rem", overflow:"hidden", boxShadow:"0 4px 24px rgba(0,0,0,0.1)", minHeight:300, background:"#0d2b18" }}>
              <img
                src="https://images.weserv.nl/?url=presidentialmountainresort.com/wp-content/uploads/2025/10/PMR-Map-1920.jpg"
                alt="PMR Resort Map"
                style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
              />
            </div>
            <div style={{ background:"#fff", borderRadius:"2rem", padding:"32px 30px", border:"1px solid #ddeedd" }}>
              <p style={{ margin:"0 0 8px", fontSize:11, fontWeight:700, letterSpacing:"0.2em", color:"#1b4d2e", textTransform:"uppercase" }}>Everything you need</p>
              <h2 style={{ margin:"0 0 20px", fontSize:"clamp(1.6rem,2.5vw,2.1rem)", fontWeight:900, letterSpacing:"-0.03em", lineHeight:1.1 }}>Everything your family needs for a great vacation</h2>
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                {kosherInfo.map(({ icon, title, body }: { icon:string; title:string; body:string }) => (
                  <div key={title} style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                    <div style={{ width:38, height:38, borderRadius:11, background:"#1b4d2e", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{icon}</div>
                    <div>
                      <p style={{ margin:"0 0 2px", fontSize:13, fontWeight:700, color:"#1c2a1a" }}>{title}</p>
                      <p style={{ margin:0, fontSize:12, color:"#6a7a68", lineHeight:1.55 }}>{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Cabin grid */}
        <section id="cabins" style={{ maxWidth:1200, margin:"0 auto", padding:"48px 24px 72px" }}>
          <div style={{ marginBottom:24 }}>
            <p style={{ margin:"0 0 6px", fontSize:11, fontWeight:700, letterSpacing:"0.2em", color:"#1b4d2e", textTransform:"uppercase" }}>Matching cabins</p>
            <h2 style={{ margin:"0 0 4px", fontSize:"clamp(1.6rem,3vw,2.4rem)", fontWeight:900, letterSpacing:"-0.03em" }}>Cabins that may fit your family</h2>
            <p style={{ margin:0, fontSize:13, color:"#7a9a7a" }}>Click any cabin photo to see all photos inside</p>
          </div>

          <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:16 }}>
            {filters.map(f => (
              <button key={f} onClick={() => setTripFilter(f)} style={{ border:tripFilter===f?"1.5px solid #1b4d2e":"1.5px solid #b8d8b8", background:tripFilter===f?"#1b4d2e":"#fff", color:tripFilter===f?"#d4e8a0":"#4a6a4a", borderRadius:24, padding:"7px 15px", fontSize:13, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:5, transition:"all 0.15s" }}>{filterIcons[f]} {f}</button>
            ))}
          </div>

          <div style={{ display:"flex", gap:10, marginBottom:28, flexWrap:"wrap", alignItems:"center" }}>
            <div style={{ position:"relative", flex:"1 1 240px" }}>
              <span style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)" }}>🔎</span>
              <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search kitchen, lake, 6 bedroom…"
                style={{ width:"100%", height:44, borderRadius:24, border:"1.5px solid #b8d8b8", background:"#fff", paddingLeft:38, paddingRight:16, fontSize:13, outline:"none", boxSizing:"border-box", color:"#1c2a1a", fontFamily:"Georgia,serif" }}
                onFocus={e=>e.target.style.borderColor="#1b4d2e"}
                onBlur={e=>e.target.style.borderColor="#b8d8b8"}
              />
            </div>
            <select value={categoryFilter} onChange={e=>setCategoryFilter(e.target.value)} style={{ height:44, borderRadius:24, border:"1.5px solid #b8d8b8", background:"#fff", padding:"0 16px", fontSize:13, fontWeight:600, color:"#1c2a1a", outline:"none", cursor:"pointer" }}>
              {categoryFilters.map(c=><option key={c}>{c}</option>)}
            </select>
            {(query||tripFilter!=="All"||categoryFilter!=="All") && (
              <button onClick={()=>{setQuery("");setTripFilter("All");setCategoryFilter("All");}} style={{ height:44, borderRadius:24, border:"1.5px solid #b8d8b8", background:"transparent", padding:"0 18px", fontSize:13, fontWeight:600, color:"#4a6a4a", cursor:"pointer" }}>Clear ×</button>
            )}
            <span style={{ fontSize:13, color:"#7a9a7a" }}>{filteredCabins.length} of {cabins.length} shown</span>
          </div>

          {filteredCabins.length > 0 ? (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:22 }}>
              {filteredCabins.map((cabin,i) => <CabinCard key={cabin.name} cabin={cabin} index={i} onOpenGallery={setGalleryOpen} />)}
            </div>
          ) : (
            <div style={{ borderRadius:"2rem", border:"2px dashed #b8d8b8", background:"rgba(255,255,255,0.6)", padding:"50px 24px", textAlign:"center" }}>
              <p style={{ fontSize:22, fontWeight:900, margin:"0 0 8px" }}>No cabins found</p>
              <button onClick={()=>{setQuery("");setTripFilter("All");setCategoryFilter("All");}} style={{ background:"#1b4d2e", color:"#d4e8a0", borderRadius:24, padding:"12px 28px", fontSize:14, fontWeight:700, border:"none", cursor:"pointer" }}>Reset filters</button>
            </div>
          )}
        </section>

        {/* Map */}
        <section id="map" style={{ padding:"0 0 80px" }}>
          <MapSection />
        </section>

        {/* FAQ */}
        <section id="faq" style={{ maxWidth:1200, margin:"0 auto", padding:"0 24px 80px" }}>
          <div style={{ textAlign:"center", marginBottom:40 }}>
            <p style={{ margin:"0 0 8px", fontSize:11, fontWeight:700, letterSpacing:"0.2em", color:"#1b4d2e", textTransform:"uppercase" }}>Guest FAQ</p>
            <h2 style={{ margin:0, fontSize:"clamp(1.8rem,3vw,2.6rem)", fontWeight:900, letterSpacing:"-0.03em" }}>Good things to know before you book</h2>
            <p style={{ margin:"8px 0 0", fontSize:14, color:"#6a8060" }}>Quick answers about cabin basics, appliances, on-site amenities, and activity pricing.</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(520px,1fr))", gap:16 }}>
            {[
              {
                category:"Cabins",
                icon:"🏠",
                items:[
                  { q:"When is check-in and check-out?", a:"Check-in is 4:30pm on weekdays and 6:30pm on Sunday. Check-out is 10:30am. (Check-in times are general and subject to change.)" },
                  { q:"What type of linens are provided in the bedrooms?", a:"The beds have regular duvets and we provide linen." },
                  { q:"What linens are provided for children's cots in the loft?", a:"Children's mattresses with a cotton sheet and a cozy blanket." },
                  { q:"Do you provide towels?", a:"Yes, we provide fresh towels daily according to guest count." },
                  { q:"Do you provide Negel Vasser sets?", a:"Yes." },
                ]
              },
              {
                category:"Appliances",
                icon:"🍳",
                items:[
                  { q:"What appliances do you provide?", a:"Every cabin includes a microwave, hot plate, plug-in electric burner, a percolater, as well as an iron and ironing board." },
                  { q:"Are the appliances kosher?", a:"Yes, except the ones that are built-in and clearly marked non-kosher (e.g. built-in microwave, stove, dishwasher). The counters are not kosher." },
                  { q:"Do you provide tissues and garbage bags?", a:"Yes." },
                  { q:"Do you provide extra tables and chairs?", a:"Yes, we provide extra folding tables and folding chairs to accommodate the family size." },
                ]
              },
              {
                category:"On-Site Amenities",
                icon:"🌿",
                items:[
                  { q:"Do you provide paper goods and basic Shabbos necessities like tablecloths and Havdalah?", a:"No, however they are available in the store for sale." },
                  { q:"Does the cabin have a washing machine?", a:"No, however we have an on-site coin laundromat with a coin change and detergent machine." },
                  { q:"Does the shul have seforim?", a:"Yes, the shul is fully stocked with all seforim." },
                  { q:"Is there a fee for the Mikvah?", a:"Yes, we have a beautiful newly built Mikvah with showers by the shul. Weekday $5, Erev Shabbos $10." },
                  { q:"Do you provide a cleaning service?", a:"No, however it can be provided subject to availability with a service fee, and must be scheduled at the Gift Shop." },
                ]
              },
              {
                category:"Activity Pricing",
                icon:"⛵",
                items:[
                  { q:"Boat rentals", a:"45-minute sessions, hours 10:00–6:00. Kayak: $15 · Row Boats: $20 · Paddle Boats: $25 · Duck Paddle Boats: $40 · Bumper Boats: $25 for 15 min." },
                  { q:"Bike rentals", a:"For adults and children. Hours 10:00–6:00. $25 for 2 hours." },
                  { q:"Segway rentals", a:"For adults and children. $30 for 30 minutes, $55 for 1 hour." },
                  { q:"Grill rental", a:"$35/night. All activities subject to availability." },
                ]
              },
            ].map(({ category, icon, items }: { category:string; icon:string; items:{q:string;a:string}[] }) => (
              <FaqCard key={category} category={category} icon={icon} items={items} />
            ))}
          </div>
        </section>
      </main>

      <footer id="kosher" style={{ borderTop:"1px solid #ddeedd", padding:"32px 24px", textAlign:"center", color:"#6a8060", fontSize:13, background:"#eaf2e4" }}>
        <p style={{ margin:"0 0 6px", fontWeight:700, color:"#1c2a1a", fontSize:15 }}>Presidential Mountain Resort</p>
        <p style={{ margin:"0 0 4px" }}>1108 Main Street · Bethlehem, NH 03574 · <a href="tel:6032532222" style={{ color:"#1b4d2e", textDecoration:"none" }}>(603) 253-2222</a></p>
        <p style={{ margin:0 }}><a href="https://presidentialmountainresort.com" target="_blank" rel="noreferrer" style={{ color:"#1b4d2e" }}>presidentialmountainresort.com</a> · Family-friendly · Summer 2025</p>
      </footer>
    </div>
  );
}
