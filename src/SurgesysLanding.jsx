import { useState, useEffect, useRef } from "react";
import {
  Wifi, CloudOff, Clock, Network, Headphones, Monitor,
  Users, Bot, CheckCircle, Handshake, ArrowRight, Menu, X,
  Shield, MapPin,
} from "lucide-react";

/* ─── Scroll reveal hook ─────────────────────────── */
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.12 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

/* ─── Animated counter ──────────────────────────── */
function AnimatedCount({ end, suffix = "", prefix = "" }) {
  const [count, setCount] = useState(0);
  const [ref, visible] = useReveal();
  useEffect(() => {
    if (!visible) return;
    let current = 0;
    const steps = 60;
    const increment = end / steps;
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, 1200 / steps);
    return () => clearInterval(timer);
  }, [visible, end]);
  return <span ref={ref}>{prefix}{count}{suffix}</span>;
}

/* ─── Fade-up reveal wrapper ───────────────────── */
function Reveal({ children, delay = 0, className = "" }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(28px)",
      transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      height: className === "h-full" ? "100%" : undefined,
    }}>
      {children}
    </div>
  );
}

/* ════════════════════════════════════════════════ */
export default function SurgesysLanding() {
  const [scrolled, setScrolled]     = useState(false);
  const [menuOpen, setMenuOpen]     = useState(false);
  const [form, setForm]             = useState({ name:"", email:"", company:"", employees:"" });
  const [submitted, setSubmitted]   = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });
    setMenuOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    fd.append("_subject", "NUEVA SOLICITUD AUDITORÍA - SURGESYS");
    try {
      const res = await fetch("https://formspree.io/f/xbdandbl", {
        method:"POST", body:fd, headers:{ Accept:"application/json" },
      });
      if (res.ok) setSubmitted(true);
      else alert("Hubo un error. Por favor, inténtelo de nuevo.");
    } catch { alert("Error de conexión."); }
    setSubmitting(false);
  };

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
    .sora { font-family:'Sora',sans-serif; }
    html  { scroll-behavior:smooth; }
    @keyframes fadeUp {
      from { opacity:0; transform:translateY(32px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes glowPulse {
      0%,100% { box-shadow:0 0 24px rgba(59,130,246,.35); }
      50%      { box-shadow:0 0 48px rgba(59,130,246,.65); }
    }
    .hero-fade-1 { animation: fadeUp .8s ease .1s both; }
    .hero-fade-2 { animation: fadeUp .8s ease .3s both; }
    .hero-fade-3 { animation: fadeUp .8s ease .5s both; }
    .srv-card { transition: all .3s ease; cursor:default; }
    .srv-card:hover {
      transform: translateY(-5px);
      border-color: rgba(59,130,246,.5) !important;
      background: rgba(30,58,138,.18) !important;
    }
    .hero-btn { transition: all .3s ease; }
    .hero-btn:hover { transform: translateY(-3px); box-shadow:0 20px 44px rgba(59,130,246,.4); }
    .cta-pulse:hover { animation: glowPulse 1.6s ease infinite; transform:translateY(-2px); }
    .form-input:focus, .form-select:focus { border-color:#3B82F6 !important; outline:none; }
  `;

  const stats = [
    { end:20, suffix:"+",    prefix:"",  label:"Años de experiencia" },
    { end:90, suffix:"%",    prefix:"",  label:"Resueltos de forma remota" },
    { end:75, suffix:" emp", prefix:"≤", label:"Equipo que servimos" },
    { end:15, suffix:" min", prefix:"<", label:"Tiempo de respuesta" },
  ];

  const pains = [
    { icon:<Wifi size={22}/>,     color:"#F87171", title:"Internet Inestable",   desc:"Videollamadas que se cortan frente a clientes importantes en el momento crítico." },
    { icon:<CloudOff size={22}/>, color:"#FB923C", title:"Caos en la Nube",      desc:"Archivos inaccesibles o duplicados en Microsoft 365 o Google Workspace." },
    { icon:<Clock size={22}/>,    color:"#FBBF24", title:"Soporte que no llega", desc:"Esperar horas por un ticket mientras su equipo pierde productividad real." },
  ];

  const services = [
    { icon:<Bot size={26}/>,        title:"AI & Automation",              desc:"Automatizamos sus procesos con IA para que su empresa opere 10 veces más eficiente con menos recursos." },
    { icon:<Network size={26}/>,    title:"Networking & Infrastructure",  desc:"Redes Wi-Fi empresariales de alta densidad y cableado estructurado que no fallan." },
    { icon:<Monitor size={26}/>,    title:"Website Design & Development", desc:"Diseño web completo — desde landing pages hasta portales empresariales modernos listos para convertir." },
    { icon:<Headphones size={26}/>, title:"Remote Support",               desc:"Resolvemos el 90% de los incidentes de forma remota en minutos, sin esperas." },
    { icon:<Users size={26}/>,      title:"Virtual Assistants",           desc:"Personal administrativo calificado para tareas operativas que liberan su tiempo." },
    { icon:<Shield size={26}/>,     title:"Cybersecurity",                desc:"Protección proactiva de sus datos y sistemas frente a las amenazas más recientes." },
  ];

  const benefits = [
    { title:"Paz Mental",    desc:"Duerma tranquilo sabiendo que su oficina es segura." },
    { title:"Cero Fricción", desc:"Su equipo deja de luchar con el Wi-Fi y empieza a trabajar." },
    { title:"Escalabilidad", desc:"Tecnología que crece a la par de su facturación." },
  ];

  const testimonials = [
    { quote:"Desde que Surgesys tomó el control de nuestra red en Coral Gables, olvidamos lo que era una 'caída de sistema'. Son parte fundamental de nuestra operación diaria.", author:"Elena R.",  role:"Operations Director" },
    { quote:"El soporte remoto es increíblemente rápido. Antes perdíamos días con proveedores locales; ahora resolvemos todo en minutos.", author:"Marcus T.", role:"Partner, Firma Legal" },
  ];

  const team = [
    { name:"Felipe Rojas", role:"Gerente General", desc:"Más de 20 años liderando el sector IT, transformando infraestructuras complejas en sistemas rentables y estables.", img:"https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300" },
    { name:"Omar Garzon",  role:"Project Manager", desc:"Estratega con 10 años de experiencia ejecutando proyectos críticos con precisión técnica y cumplimiento riguroso.",   img:"https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300" },
  ];

  const inputStyle = {
    width:"100%", border:"2px solid #E2E8F0", padding:"14px 16px",
    borderRadius:12, fontSize:15, color:"#1E293B", boxSizing:"border-box",
    transition:"border-color .2s", background:"#fff",
  };

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", background:"#070D1A", color:"#F8FAFC" }}>
      <style>{css}</style>

      {/* NAVBAR */}
      <nav style={{
        position:"fixed", top:0, left:0, right:0, zIndex:50,
        background: scrolled ? "rgba(7,13,26,.96)" : "transparent",
        backdropFilter: scrolled ? "blur(18px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,.06)" : "none",
        padding: scrolled ? "14px 0" : "24px 0",
        transition:"all .35s ease",
      }}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="sora font-bold text-xl tracking-tight">
            <span style={{color:"#fff"}}>Surge</span>
            <span style={{color:"#60A5FA"}}>sys</span>
            <span style={{color:"#475569",fontSize:13,fontWeight:400,marginLeft:8}}>LLC</span>
          </div>
          <div className="hidden md:flex items-center gap-8" style={{fontSize:14,fontWeight:500}}>
            {["servicios","contacto"].map(id => (
              <button key={id} onClick={() => scrollTo(id)}
                style={{textTransform:"capitalize",background:"none",border:"none",cursor:"pointer",color:"#94A3B8",transition:"color .2s"}}
                onMouseEnter={e=>e.target.style.color="#fff"}
                onMouseLeave={e=>e.target.style.color="#94A3B8"}>
                {id}
              </button>
            ))}
            <button onClick={() => scrollTo("contacto")} className="sora"
              style={{background:"#2563EB",color:"#fff",padding:"9px 22px",borderRadius:999,fontSize:14,fontWeight:700,border:"none",cursor:"pointer"}}
              onMouseEnter={e=>e.target.style.background="#3B82F6"}
              onMouseLeave={e=>e.target.style.background="#2563EB"}>
              Diagnóstico Gratuito
            </button>
          </div>
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}
            style={{color:"#94A3B8",background:"none",border:"none",cursor:"pointer"}}>
            {menuOpen ? <X size={24}/> : <Menu size={24}/>}
          </button>
        </div>
        {menuOpen && (
          <div style={{background:"rgba(7,13,26,.98)",borderTop:"1px solid rgba(255,255,255,.07)",padding:"1rem 1.5rem",display:"flex",flexDirection:"column",gap:16}}>
            <button onClick={() => scrollTo("servicios")} style={{color:"#CBD5E1",background:"none",border:"none",textAlign:"left",cursor:"pointer",fontSize:16}}>Servicios</button>
            <button onClick={() => scrollTo("contacto")}  style={{color:"#CBD5E1",background:"none",border:"none",textAlign:"left",cursor:"pointer",fontSize:16}}>Contacto</button>
            <button onClick={() => scrollTo("contacto")} style={{background:"#2563EB",color:"#fff",padding:"10px 20px",borderRadius:999,fontWeight:700,border:"none",cursor:"pointer",fontSize:14}}>
              Diagnóstico Gratuito
            </button>
          </div>
        )}
      </nav>

      {/* HERO */}
      <header style={{position:"relative",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,zIndex:0}}>
          <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1920" alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
          <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,rgba(4,8,20,.93) 0%,rgba(10,20,50,.87) 60%,rgba(4,8,20,.93) 100%)"}}/>
        </div>
        <div style={{position:"absolute",top:"18%",left:"-8%",width:480,height:480,borderRadius:"50%",background:"radial-gradient(circle,rgba(37,99,235,.14) 0%,transparent 70%)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:"12%",right:"-4%",width:360,height:360,borderRadius:"50%",background:"radial-gradient(circle,rgba(6,182,212,.09) 0%,transparent 70%)",pointerEvents:"none"}}/>
        <div style={{position:"relative",zIndex:10,maxWidth:860,padding:"0 1.5rem",textAlign:"center"}}>
          <div className="hero-fade-1" style={{display:"inline-flex",alignItems:"center",gap:8,fontSize:13,fontWeight:600,padding:"8px 20px",borderRadius:999,marginBottom:28,background:"rgba(37,99,235,.14)",border:"1px solid rgba(59,130,246,.3)",color:"#60A5FA"}}>
            <span style={{width:8,height:8,borderRadius:"50%",background:"#34D399",display:"inline-block",flexShrink:0}}/>
            Soporte activo 24/7 · Miami, Florida
          </div>
          <h1 className="sora hero-fade-2" style={{fontSize:"clamp(2.8rem,7vw,5rem)",fontWeight:900,lineHeight:1.05,letterSpacing:"-.035em",marginBottom:"1.25rem"}}>
            Que la tecnología en su<br/>oficina sea invisible.{" "}
            <span style={{background:"linear-gradient(135deg,#3B82F6,#06B6D4)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
              Que simplemente funcione.
            </span>
          </h1>
          <p className="hero-fade-3" style={{fontSize:"clamp(1rem,2.5vw,1.3rem)",color:"#CBD5E1",fontWeight:300,lineHeight:1.7,maxWidth:680,margin:"0 auto 2.5rem"}}>
            Soporte IT gestionado, redes ultra-estables y nube segura para PYMES en Miami. Liberamos a su equipo de las fallas técnicas.
          </p>
          <div className="hero-fade-3" style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap"}}>
            <button onClick={() => scrollTo("contacto")} className="hero-btn sora"
              style={{background:"#2563EB",color:"#fff",fontWeight:800,padding:"16px 36px",borderRadius:999,fontSize:16,border:"none",cursor:"pointer",letterSpacing:".06em",textTransform:"uppercase"}}>
              Diagnóstico Gratuito de Red
            </button>
            <button onClick={() => scrollTo("servicios")} className="hero-btn"
              style={{display:"flex",alignItems:"center",gap:8,color:"#CBD5E1",border:"1px solid rgba(148,163,184,.35)",padding:"16px 28px",borderRadius:999,fontSize:16,background:"transparent",cursor:"pointer"}}
              onMouseEnter={e=>e.currentTarget.style.borderColor="#94A3B8"}
              onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(148,163,184,.35)"}>
              Ver Servicios <ArrowRight size={17}/>
            </button>
          </div>
        </div>
      </header>

      {/* STATS */}
      <section style={{background:"rgba(10,16,32,.9)",borderTop:"1px solid rgba(255,255,255,.06)",borderBottom:"1px solid rgba(255,255,255,.06)",padding:"4rem 0"}}>
        <div className="max-w-4xl mx-auto px-6" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:"2rem",textAlign:"center"}}>
          {stats.map((s,i) => (
            <Reveal key={i} delay={i*90}>
              <div className="sora" style={{fontSize:"2.4rem",fontWeight:800,color:"#60A5FA",marginBottom:6}}>
                <AnimatedCount end={s.end} suffix={s.suffix} prefix={s.prefix}/>
              </div>
              <div style={{color:"#64748B",fontSize:13}}>{s.label}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CONTEXT */}
      <section style={{background:"#070D1A",padding:"6rem 0"}}>
        <div style={{maxWidth:720,margin:"0 auto",padding:"0 1.5rem",textAlign:"center"}}>
          <Reveal>
            <p className="sora" style={{color:"#60A5FA",fontSize:12,fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",marginBottom:16}}>Para quién es Surgesys</p>
            <h2 className="sora" style={{fontSize:"clamp(1.8rem,4vw,2.6rem)",fontWeight:800,color:"#fff",marginBottom:24,lineHeight:1.15}}>Diseñado para el ritmo de Miami</h2>
            <p style={{fontSize:"1.1rem",lineHeight:1.8,color:"#94A3B8"}}>
              Usted dirige una firma de servicios profesionales con entre{" "}
              <strong style={{color:"#F8FAFC"}}>10 y 75 empleados</strong>. Ya no son una startup; son un equipo consolidado que no puede permitirse un minuto de inactividad. Si usted es el{" "}
              <strong style={{color:"#F8FAFC"}}>Operations Manager</strong>{" "}
              que carga con el estrés de que el internet no caiga, Surgesys es su aliado estratégico.
            </p>
          </Reveal>
        </div>
      </section>

      {/* PAIN POINTS */}
      <section style={{background:"#0A1020",padding:"6rem 0"}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"0 1.5rem"}}>
          <Reveal>
            <h2 className="sora" style={{fontSize:"clamp(1.8rem,4vw,2.6rem)",fontWeight:800,textAlign:"center",marginBottom:"4rem",color:"#fff"}}>
              El costo oculto del{" "}<span style={{color:"#F87171"}}>"Casi Funciona"</span>
            </h2>
          </Reveal>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:"1.5rem",alignItems:"start"}}>
            <Reveal delay={100}>
              <div style={{borderRadius:24,overflow:"hidden",aspectRatio:"4/3",position:"relative"}}>
                <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=800" alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(7,13,26,.8),transparent)"}}/>
              </div>
            </Reveal>
            <div style={{display:"flex",flexDirection:"column",gap:16}}>
              {pains.map((p,i) => (
                <Reveal key={i} delay={100+i*130}>
                  <div style={{display:"flex",alignItems:"flex-start",gap:18,padding:"1.25rem 1.5rem",borderRadius:16,background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)"}}>
                    <div style={{padding:10,borderRadius:12,flexShrink:0,background:`${p.color}18`,color:p.color}}>{p.icon}</div>
                    <div>
                      <h4 className="sora" style={{fontWeight:700,fontSize:"1rem",color:"#F8FAFC",marginBottom:4}}>{p.title}</h4>
                      <p style={{color:"#64748B",fontSize:"0.9rem",lineHeight:1.6}}>{p.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="servicios" style={{background:"#070D1A",padding:"6rem 0"}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"0 1.5rem"}}>
          <Reveal>
            <p className="sora" style={{color:"#60A5FA",fontSize:12,fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",textAlign:"center",marginBottom:16}}>Lo que hacemos</p>
            <h2 className="sora" style={{fontSize:"clamp(1.8rem,4vw,2.6rem)",fontWeight:800,textAlign:"center",marginBottom:"4rem",color:"#fff"}}>Su ecosistema digital bajo control total</h2>
          </Reveal>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:"1.25rem",alignItems:"stretch"}}>
            {services.map((s,i) => (
              <Reveal key={i} delay={i*70} className="h-full">
                <div className="srv-card" style={{padding:"2rem",borderRadius:20,background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",height:"100%",display:"flex",flexDirection:"column"}}>
                  <div style={{width:52,height:52,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(59,130,246,.12)",color:"#60A5FA",marginBottom:20,flexShrink:0}}>
                    {s.icon}
                  </div>
                  <h3 className="sora" style={{fontSize:"1rem",fontWeight:700,color:"#F8FAFC",marginBottom:10}}>{s.title}</h3>
                  <p style={{color:"#64748B",fontSize:"0.875rem",lineHeight:1.65,flex:1}}>{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section style={{background:"#0A1020",padding:"6rem 0"}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"0 1.5rem",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:"3rem",alignItems:"center"}}>
          <Reveal>
            <p className="sora" style={{color:"#60A5FA",fontSize:12,fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",marginBottom:16}}>El resultado</p>
            <h2 className="sora" style={{fontSize:"clamp(1.8rem,4vw,2.4rem)",fontWeight:800,color:"#fff",lineHeight:1.15,marginBottom:"2rem"}}>
              De Bombero Tecnológico a Gerente de Estrategia
            </h2>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {benefits.map((b,i) => (
                <div key={i} style={{display:"flex",alignItems:"flex-start",gap:14,padding:"1rem 1.25rem",borderRadius:14,background:"rgba(59,130,246,.06)",border:"1px solid rgba(59,130,246,.15)"}}>
                  <CheckCircle size={22} style={{color:"#60A5FA",flexShrink:0,marginTop:2}}/>
                  <div>
                    <span className="sora" style={{fontWeight:700,color:"#F8FAFC"}}>{b.title}: </span>
                    <span style={{color:"#94A3B8"}}>{b.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={180}>
            <div style={{borderRadius:24,overflow:"hidden",aspectRatio:"4/3"}}>
              <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800" alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section id="contacto" style={{background:"linear-gradient(135deg,#1D4ED8 0%,#1e40af 100%)",padding:"6rem 0"}}>
        <div style={{maxWidth:640,margin:"0 auto",padding:"0 1.5rem",textAlign:"center"}}>
          <Reveal>
            <h2 className="sora" style={{fontSize:"clamp(1.8rem,4vw,2.4rem)",fontWeight:800,color:"#fff",marginBottom:12}}>
              Auditoría de Salud Tecnológica Zero-Risk
            </h2>
            <p style={{color:"#BFDBFE",fontSize:"1.05rem",marginBottom:"2.5rem"}}>
              Sin costo para PYMES en Miami. Descubra sus puntos débiles antes de que se conviertan en paradas críticas.
            </p>
          </Reveal>
          <Reveal delay={120}>
            {submitted ? (
              <div style={{background:"rgba(255,255,255,.97)",borderRadius:28,padding:"3rem 2rem",textAlign:"center"}}>
                <CheckCircle size={52} style={{color:"#10B981",margin:"0 auto 1rem"}}/>
                <h3 className="sora" style={{fontSize:"1.5rem",fontWeight:800,color:"#1E293B",marginBottom:8}}>¡Solicitud recibida!</h3>
                <p style={{color:"#64748B"}}>Felipe u Omar se pondrán en contacto con usted en las próximas 24 horas.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{background:"rgba(255,255,255,.97)",borderRadius:28,padding:"2.5rem",textAlign:"left"}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
                  <div>
                    <label style={{display:"block",fontSize:11,fontWeight:700,color:"#64748B",letterSpacing:".1em",textTransform:"uppercase",marginBottom:8}}>Nombre y Apellido</label>
                    <input type="text" required placeholder="John Smith" value={form.name}
                      onChange={e=>setForm({...form,name:e.target.value})}
                      className="form-input" style={inputStyle}/>
                  </div>
                  <div>
                    <label style={{display:"block",fontSize:11,fontWeight:700,color:"#64748B",letterSpacing:".1em",textTransform:"uppercase",marginBottom:8}}>Email Corporativo</label>
                    <input type="email" required placeholder="nombre@empresa.com" value={form.email}
                      onChange={e=>setForm({...form,email:e.target.value})}
                      className="form-input" style={inputStyle}/>
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:28}}>
                  <div>
                    <label style={{display:"block",fontSize:11,fontWeight:700,color:"#64748B",letterSpacing:".1em",textTransform:"uppercase",marginBottom:8}}>Nombre de la Empresa</label>
                    <input type="text" required placeholder="Legal Firm Miami" value={form.company}
                      onChange={e=>setForm({...form,company:e.target.value})}
                      className="form-input" style={inputStyle}/>
                  </div>
                  <div>
                    <label style={{display:"block",fontSize:11,fontWeight:700,color:"#64748B",letterSpacing:".1em",textTransform:"uppercase",marginBottom:8}}>Número de Empleados</label>
                    <select required value={form.employees}
                      onChange={e=>setForm({...form,employees:e.target.value})}
                      className="form-select"
                      style={{...inputStyle, appearance:"none", backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2364748B' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat:"no-repeat", backgroundPosition:"right 14px center"}}>
                      <option value="">Seleccione...</option>
                      <option value="1-10">1 – 10 empleados</option>
                      <option value="11-30">11 – 30 empleados</option>
                      <option value="31-75">31 – 75 empleados</option>
                      <option value="75+">Más de 75 empleados</option>
                    </select>
                  </div>
                </div>
                <button type="submit" disabled={submitting} className="sora"
                  style={{width:"100%",background:submitting?"#93C5FD":"#2563EB",color:"#fff",fontWeight:800,padding:"18px",borderRadius:14,fontSize:16,border:"none",cursor:submitting?"not-allowed":"pointer",letterSpacing:".06em",textTransform:"uppercase",transition:"all .3s"}}
                  onMouseEnter={e=>{ if(!submitting) e.target.style.background="#1D4ED8"; }}
                  onMouseLeave={e=>{ if(!submitting) e.target.style.background="#2563EB"; }}>
                  {submitting ? "Enviando…" : "Solicitar Auditoría Gratuita"}
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{background:"#070D1A",padding:"6rem 0"}}>
        <div style={{maxWidth:1000,margin:"0 auto",padding:"0 1.5rem"}}>
          <Reveal>
            <h2 className="sora" style={{fontSize:"clamp(1.8rem,4vw,2.4rem)",fontWeight:800,textAlign:"center",marginBottom:"4rem",color:"#fff"}}>Casos de Éxito en Florida</h2>
          </Reveal>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:"1.5rem"}}>
            {testimonials.map((t,i) => (
              <Reveal key={i} delay={i*140}>
                <div style={{padding:"2rem",borderRadius:20,position:"relative",background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)"}}>
                  <div style={{fontSize:72,color:"rgba(30,64,175,.5)",position:"absolute",top:12,left:20,lineHeight:1,fontFamily:"Georgia,serif",userSelect:"none"}}>"</div>
                  <p style={{color:"#CBD5E1",lineHeight:1.75,marginBottom:24,position:"relative",zIndex:1,paddingTop:12}}>{t.quote}</p>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <div style={{width:38,height:38,borderRadius:"50%",background:"rgba(59,130,246,.18)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"#60A5FA"}}>{t.author[0]}</div>
                    <div>
                      <div className="sora" style={{fontWeight:700,color:"#F8FAFC",fontSize:"0.9rem"}}>{t.author}</div>
                      <div style={{color:"#64748B",fontSize:"0.8rem"}}>{t.role}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section style={{background:"#0A1020",padding:"6rem 0"}}>
        <div style={{maxWidth:700,margin:"0 auto",padding:"0 1.5rem"}}>
          <Reveal>
            <h2 className="sora" style={{fontSize:"clamp(1.8rem,4vw,2.4rem)",fontWeight:800,textAlign:"center",marginBottom:"4rem",color:"#fff"}}>Liderazgo con Experiencia</h2>
          </Reveal>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:"2.5rem"}}>
            {team.map((p,i) => (
              <Reveal key={i} delay={i*140}>
                <div style={{textAlign:"center"}}>
                  <div style={{width:140,height:140,borderRadius:"50%",margin:"0 auto 1.25rem",overflow:"hidden",border:"3px solid rgba(59,130,246,.35)"}}>
                    <img src={p.img} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                  </div>
                  <h3 className="sora" style={{fontSize:"1.2rem",fontWeight:800,color:"#F8FAFC",marginBottom:4}}>{p.name}</h3>
                  <p className="sora" style={{color:"#60A5FA",fontSize:11,fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",marginBottom:12}}>{p.role}</p>
                  <p style={{color:"#64748B",fontSize:"0.875rem",lineHeight:1.65}}>{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* GUARANTEE */}
      <section style={{background:"#070D1A",borderTop:"1px solid rgba(255,255,255,.06)",borderBottom:"1px solid rgba(255,255,255,.06)",padding:"5rem 0"}}>
        <div style={{maxWidth:680,margin:"0 auto",padding:"0 1.5rem",textAlign:"center"}}>
          <Reveal>
            <Handshake size={56} style={{color:"#60A5FA",margin:"0 auto 1.5rem"}}/>
            <h2 className="sora" style={{fontSize:"clamp(1.6rem,3.5vw,2rem)",fontWeight:800,color:"#fff",marginBottom:"1.5rem"}}>Nuestra Garantía de Hierro</h2>
            <p style={{fontSize:"1.15rem",color:"#CBD5E1",fontStyle:"italic",fontWeight:300,lineHeight:1.75,padding:"1.5rem 2rem",borderRadius:16,background:"rgba(59,130,246,.06)",border:"1px solid rgba(59,130,246,.15)"}}>
              "Si durante los primeros 30 días no experimenta una mejora notable en la velocidad y estabilidad de sus sistemas, le devolvemos su inversión. Sin preguntas."
            </p>
          </Reveal>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section style={{background:"#040810",padding:"6rem 0"}}>
        <div style={{maxWidth:800,margin:"0 auto",padding:"0 1.5rem",textAlign:"center"}}>
          <Reveal>
            <h2 className="sora" style={{fontSize:"clamp(2rem,5vw,3.2rem)",fontWeight:900,color:"#fff",letterSpacing:"-.03em",marginBottom:"2rem",lineHeight:1.1}}>
              ¿Listo para que su tecnología finalmente coopere?
            </h2>
            <button onClick={() => scrollTo("contacto")} className="sora cta-pulse"
              style={{background:"#2563EB",color:"#fff",fontWeight:800,padding:"18px 48px",borderRadius:999,fontSize:"1.1rem",border:"none",cursor:"pointer",letterSpacing:".06em",textTransform:"uppercase",transition:"all .3s"}}>
              Hablar con un Experto Ahora
            </button>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{background:"#020407",borderTop:"1px solid rgba(255,255,255,.05)",padding:"3rem 0"}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"0 1.5rem",display:"flex",flexWrap:"wrap",justifyContent:"space-between",alignItems:"center",gap:16}}>
          <div className="sora" style={{fontWeight:700,fontSize:"1.05rem"}}>
            <span style={{color:"#fff"}}>Surge</span>
            <span style={{color:"#60A5FA"}}>sys</span>
            <span style={{color:"#334155",fontWeight:400,fontSize:13,marginLeft:8}}>LLC © 2026</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6,color:"#475569",fontSize:13}}>
            <MapPin size={13}/> Miami, Florida
          </div>
          <p style={{color:"#334155",fontSize:13}}>Managed IT Services Experts</p>
        </div>
      </footer>
    </div>
  );
}