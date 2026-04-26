import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { landingPageData, stepsData } from "../data/content";
import { ArrowRight, Globe, FileText, TrendingUp, ExternalLink, HelpCircle, Target, Rocket, CheckCircle2, MapPin } from "lucide-react";
import MapDashboard from "./MapDashboard";

interface LandingPageProps {
  onStart: () => void;
  onIntro: () => void;
}

export default function LandingPage({ onStart, onIntro }: LandingPageProps) {
  const icons = [Globe, FileText, TrendingUp];
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselSlides = [
    {
      label: "COP 31 Context",
      icon: Globe,
      title: "Global Momentum Toward COP 31",
      description: "The Toolkit supports CHAMP by enabling countries to deliver national climate commitments at the city level—where emissions and risks are concentrated—by mobilizing finance to drive emissions reductions, strengthen resilience, and close the urban climate finance gap.",
      buttonText: "Learn more about COP 31",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80"
    },
    {
      label: "Key Publication",
      icon: FileText,
      title: "UN-Habitat NDC Report Launch",
      description: "A comprehensive guide on integrating urban climate action into Nationally Determined Contributions (NDCs). This vital report provides national governments with the framework needed to ensure municipal financing pipelines are formally recognized and supported.",
      buttonText: "Read the Report",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80"
    },
    {
      label: "Country Spotlight",
      icon: MapPin, 
      title: "Spotlight: Sweden & CHAMP",
      description: "Sweden has actively engaged with the CHAMP initiative by fostering deep collaborations between national agencies and local municipalities, serving as a global blueprint for institutionalizing Multilevel Governance and systematically testing urban climate solutions.",
      buttonText: "Explore Case Study",
      image: "https://images.unsplash.com/photo-1509356843151-3e7d96241e11?auto=format&fit=crop&w=800&q=80"
    }
  ];

  /* Auto-slide effect */
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [carouselSlides.length]);

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-24 md:pt-32 pb-12 md:pb-16 flex flex-col items-center text-center border-b border-line mb-4"
      >
        <div className="inline-flex items-center gap-3 px-4 py-2 border border-line bg-surface mb-12 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]">
          <div className="w-1.5 h-1.5 bg-accent"></div>
          <span className="text-[11px] font-bold text-ink uppercase tracking-[0.2em]">A toolkit for national governments, cities and friends of CHAMP</span>
        </div>
        
        <h1 className="font-heading text-5xl md:text-[5.5rem] font-medium tracking-tight text-ink mb-8 leading-[1.05] max-w-5xl mx-auto">
          The <span className="text-accent">CHAMP</span> Toolkit.
          <span className="block text-ink-muted mt-2 font-light">Financing Climate Action.</span>
        </h1>
        
        <div className="max-w-3xl mx-auto text-center mb-10 space-y-8">
          <p className="text-xl md:text-[22px] text-ink leading-relaxed font-light">
            Empowering CHAMP countries to deliver national climate commitments and financing at the city level through <strong className="font-medium text-accent">Multi-Level Governance</strong>.
          </p>
          <div className="relative inline-block group">
            <button
              onClick={onIntro}
              className="text-sm font-bold uppercase tracking-widest text-ink group-hover:text-accent transition-colors pb-1 border-b-2 border-ink group-hover:border-accent"
            >
              Read the introduction
            </button>
          </div>
          <p className="text-[17px] text-ink-muted leading-[1.7] font-light max-w-2xl mx-auto">
            Explore a <strong className="text-ink font-medium">5-step journey to Multilevel Governance</strong>. This sequenced path covers the spectrum of actions needed to operationalize MLG, while remaining flexible to national contexts.
          </p>
        </div>
        
        <div className="flex flex-col items-center gap-6 mb-24 mt-8">
          <motion.button
            onClick={onStart}
            className="group relative inline-flex items-center gap-4 bg-ink text-surface px-10 py-5 text-[14px] font-bold uppercase tracking-wider hover:bg-accent hover:shadow-[0_4px_16px_rgba(60,71,153,0.3)] transition-all overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 -translate-x-[120%] group-hover:translate-x-[120%] skew-x-[-20deg] transition-transform duration-700 pointer-events-none" />
            Explore the 5-step journey
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>

        {/* Flowing MLG Journey Graphic */}
        <div className="flex flex-col md:flex-row items-stretch justify-center w-full max-w-5xl mx-auto bg-surface border border-line divide-y md:divide-y-0 md:divide-x divide-line relative z-20">
          {[
            { num: "01", label: "Assess Environments", goal: stepsData[0].goal },
            { num: "02", label: "Institutionalize MLG", goal: stepsData[1].goal },
            { num: "03", label: "Build Pipelines", goal: stepsData[2].goal },
            { num: "04", label: "Mobilize Finance", goal: stepsData[3].goal },
            { num: "05", label: "Scale & Enhance", goal: stepsData[4].goal }
          ].map((step, i) => (
            <div key={i} className={`flex flex-col flex-1 p-6 md:p-8 relative group hover:bg-paper transition-colors cursor-pointer`}>
              <span className="font-heading text-accent text-xl font-medium mb-4 opacity-80 group-hover:opacity-100 transition-opacity">{step.num}</span>
              <span className="text-[15px] font-semibold text-ink leading-snug group-hover:text-accent transition-colors">{step.label}</span>

              {/* Tooltip positioned below to prevent overlap */}
              <div className="absolute top-full pt-4 left-1/2 -translate-x-1/2 w-64 md:w-72 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-30 pointer-events-none">
                <div className="bg-ink text-surface text-[13px] p-5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] text-left leading-[1.6] font-light relative border border-white/10">
                  <div className="absolute -top-[5px] left-1/2 -translate-x-1/2 rotate-45 w-2.5 h-2.5 bg-ink border-l border-t border-white/10"></div>
                  {step.goal}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Partnership Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-24"
      >
        <div className="flex flex-col md:flex-row md:items-stretch items-center gap-12 md:gap-16">
          <div className="md:w-5/12 space-y-6 flex flex-col justify-center">
            <h2 className="font-heading font-bold text-4xl md:text-5xl text-ink leading-tight tracking-tight">
              A Joint Contribution to CHAMP
            </h2>
            <p className="text-xl md:text-2xl text-ink-muted font-light leading-relaxed">
              This toolkit is a strategic partnership between <strong className="text-ink font-semibold">CCFLA</strong> and <strong className="text-ink font-semibold">Viable Cities</strong>. A key goal of this toolkit is to showcase impactful multilevel governance initiatives championed in <strong className="text-ink font-semibold">Sweden</strong>.
            </p>
          </div>
          <div className="md:w-7/12 w-full flex flex-col items-center justify-between gap-6 py-4">
            {/* Top row: CCFLA and Viable Cities logos placed horizontally */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 md:gap-12 w-full">
              <div className="flex-1 flex justify-end items-center">
                <img 
                  src="https://www.climatepolicyinitiative.org/wp-content/uploads/2020/09/CCFLA-hero.png" 
                  alt="CCFLA" 
                  className="h-44 md:h-56 object-contain hover:-translate-y-1 transition-all mix-blend-multiply md:translate-x-6" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="hidden sm:block w-px h-32 bg-line shrink-0"></div>
              <div className="flex-1 flex justify-start items-center">
                <img 
                  src="https://images.squarespace-cdn.com/content/v1/59e86b55aeb625e2140eec1a/1634044375194-3G0ZG1T5HGMGNB2QSEYU/1.+VC_Logotyp_PRIM%C3%84R_RGB.png" 
                  alt="Viable Cities" 
                  className="h-20 md:h-28 object-contain hover:-translate-y-1 transition-all mix-blend-multiply opacity-90" 
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            
            {/* Bottom row: Sweden flag */}
            <div className="flex flex-col items-center justify-center pt-6 border-t border-line w-4/5 md:w-3/4">
              <span className="text-ink-muted text-sm uppercase tracking-widest font-semibold mb-6">Supported by</span>
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Flag_of_Sweden.svg/3840px-Flag_of_Sweden.svg.png" 
                alt="Sweden" 
                className="w-40 object-contain shadow-sm rounded-sm hover:-translate-y-1 transition-transform" 
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Interactive Data Dashboard */}
      <MapDashboard stats={landingPageData.dashboard} />

      {/* Toolkit Context Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-24"
      >
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between border-b border-line pb-6 gap-6">
          <h2 className="font-heading text-3xl font-semibold text-ink tracking-tight max-w-lg">The Strategic Context</h2>
          <p className="text-ink-muted font-light max-w-md md:text-right leading-relaxed">Understanding the rationale, outcomes, and impact of the CHAMP Multilevel Governance Toolkit.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-line border border-line">
          {landingPageData.toolkitContext.map((ctx, idx) => (
            <div key={idx} className="bg-surface p-10 flex flex-col hover:bg-paper transition-colors">
              <div className="mb-8">
                <h3 className="font-heading text-xl font-medium text-ink leading-snug">{ctx.question}</h3>
              </div>
              <ul className="space-y-5">
                {ctx.points.map((point, pIdx) => (
                  <li key={pIdx} className="flex gap-4 text-ink font-light leading-relaxed">
                    <div className="w-1.5 h-1.5 bg-accent mt-2 shrink-0 rotate-45" />
                    <span className="text-[14px] leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Carousel Context Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-ink p-10 md:p-14 mb-24 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-16"
      >
        <div className="relative z-10 md:w-1/2 min-h-[300px] flex flex-col justify-center">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-3 border border-surface/20 px-4 py-1.5 mb-10 text-xs font-medium text-surface tracking-wider uppercase">
              {(() => {
                const CurrentIcon = carouselSlides[currentSlide].icon;
                return <CurrentIcon size={14} className="stroke-[2]" />;
              })()}
              {carouselSlides[currentSlide].label}
            </div>
            
            <h2 className="font-heading text-4xl md:text-5xl text-surface font-semibold mb-6 leading-[1.15] tracking-tight">
              {carouselSlides[currentSlide].title.split(/(Toward COP 31|Report Launch|Sweden & CHAMP)/).map((part, i) => 
                part.match(/(Toward COP 31|Report Launch|Sweden & CHAMP)/) ? 
                <span key={i} className="text-surface/50 font-normal italic block mt-1">{part}</span> : part
              )}
            </h2>
            
            <p className="text-base md:text-lg text-surface/70 leading-relaxed mb-10 max-w-lg font-light">
              {carouselSlides[currentSlide].description}
            </p>
            
            <button className="bg-surface text-ink px-6 py-3 font-semibold hover:bg-surface/90 hover:scale-[1.02] transition-all inline-flex items-center gap-3 text-[13px] uppercase tracking-wider">
              {carouselSlides[currentSlide].buttonText} <ArrowRight size={16} />
            </button>
          </motion.div>

          {/* Dots Navigation */}
          <div className="flex gap-2 mt-12">
            {carouselSlides.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`transition-all ${currentSlide === idx ? 'w-8 h-1 bg-surface' : 'w-2 h-1 bg-surface/30 hover:bg-surface/50'}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 md:w-1/2 flex justify-center md:justify-end">
          <motion.div 
            initial={{ rotate: -1, y: 10 }}
            whileInView={{ rotate: 0, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="w-72 h-72 md:w-[420px] md:h-[420px] bg-[#0A0A0A] border border-surface/20 overflow-hidden relative shadow-2xl"
          >
            <motion.img 
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 0.8, scale: 1 }}
              transition={{ duration: 0.8 }}
              src={carouselSlides[currentSlide].image} 
              alt={carouselSlides[currentSlide].title} 
              className="w-full h-full object-cover hover:opacity-100 hover:scale-105 transition-all duration-700 mix-blend-luminosity hover:mix-blend-normal"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>
      </motion.div>


    </div>
  );
}
