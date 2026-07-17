import React from 'react';
import {
  Leaf,
  ShieldCheck,
  Truck,
  Package,
  CheckCircle,
  MessageCircle,
  ChevronDown
} from 'lucide-react';

export const TrustSections: React.FC = () => {
  return (
    <>
        {/* 1. WHY CHOOSE AGRIIC — premium dark feature strip */}
        <div className="px-3 sm:px-4 md:px-8 lg:px-12 py-4">
          <div
            className="relative overflow-hidden rounded-3xl"
            style={{
              background: 'linear-gradient(135deg, #0f2d1e 0%, #1a4a2e 40%, #0d2818 100%)',
              boxShadow: '0 12px 50px rgba(15,45,30,0.35), 0 4px 16px rgba(0,0,0,0.15)',
            }}
          >
            {/* Decorative dot pattern */}
            <div className="absolute inset-0 pointer-events-none" style={{
              backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)`,
              backgroundSize: '24px 24px',
            }}/>
            {/* Gold shimmer top-right */}
            <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(210,175,110,0.12) 0%, transparent 65%)' }}/>
            {/* Green glow bottom-left */}
            <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(55,115,85,0.25) 0%, transparent 65%)' }}/>
            {/* Leaf SVG accent */}
            <svg className="absolute right-8 bottom-0 opacity-[0.06] pointer-events-none" width="300" height="300" viewBox="0 0 200 200" fill="none">
              <path d="M190 10 C160 120, 40 180, 10 190 C40 80, 160 20, 190 10Z" fill="white"/>
              <path d="M160 10 Q120 90 20 160" stroke="white" strokeWidth="2" strokeDasharray="5 5" fill="none"/>
            </svg>

            <div className="relative z-10 flex flex-col lg:grid lg:grid-cols-5 gap-0">
              {/* Left branding panel */}
              <div className="lg:col-span-2 p-5 sm:p-8 md:p-12 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-white/10">
                <span className="text-[10px] font-black text-[#D4A373] uppercase tracking-[0.3em] mb-3">Our Promise</span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight mb-3 md:mb-4">
                  Why Choose<br/>
                  <span className="text-[#5ecb8e]">Agriic?</span>
                </h2>
                <div className="flex gap-2 mb-6">
                  <div className="w-10 h-[3px] rounded-full bg-[#D4A373]"/>
                  <div className="w-4 h-[3px] rounded-full bg-[#D4A373]/40"/>
                </div>
                <p className="text-white/60 text-xs sm:text-sm font-semibold leading-relaxed mb-5 md:mb-4">
                  We believe in honest nutrition. Every product is crafted from nature, tested in labs, and delivered with care — so you never have to guess what goes into your food.
                </p>
                {/* Key stats */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { num: '5K+', label: 'Customers' },
                    { num: '200+', label: 'Products' },
                    { num: '4.8★', label: 'Rating' },
                  ].map(s => (
                    <div key={s.label} className="text-center">
                      <div className="text-2xl font-black text-[#5ecb8e]">{s.num}</div>
                      <div className="text-[10px] font-bold text-white/50 uppercase tracking-wider mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right feature cards grid */}
              <div className="lg:col-span-3 p-4 sm:p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                {[
                  {
                    icon: <Leaf className="w-6 h-6"/>,
                    color: '#5ecb8e',
                    bg: 'rgba(94,203,142,0.12)',
                    title: '100% Organic',
                    desc: 'Certified ingredients from verified farms with no hidden additives.',
                  },
                  {
                    icon: <ShieldCheck className="w-6 h-6"/>,
                    color: '#60a5fa',
                    bg: 'rgba(96,165,250,0.12)',
                    title: 'Lab Tested',
                    desc: 'Every batch tested for purity, potency and safety before dispatch.',
                  },
                  {
                    icon: <Truck className="w-6 h-6"/>,
                    color: '#f59e0b',
                    bg: 'rgba(245,158,11,0.12)',
                    title: 'Fast Delivery',
                    desc: '2-day pan-India shipping with live tracking on every order.',
                  },
                  {
                    icon: <Package className="w-6 h-6"/>,
                    color: '#34d399',
                    bg: 'rgba(52,211,153,0.12)',
                    title: 'Eco Packaging',
                    desc: 'Biodegradable, plastic-free packaging that is kind to the planet.',
                  },
                  {
                    icon: <CheckCircle className="w-6 h-6"/>,
                    color: '#a78bfa',
                    bg: 'rgba(167,139,250,0.12)',
                    title: 'Quality Assured',
                    desc: 'FSSAI certified with global organic standards compliance.',
                  },
                  {
                    icon: <MessageCircle className="w-6 h-6"/>,
                    color: '#fb923c',
                    bg: 'rgba(251,146,60,0.12)',
                    title: '24/7 Support',
                    desc: 'Expert agri-nutritionists available to guide your every purchase.',
                  },
                ].map((feat, i) => (
                  <div
                    key={i}
                    className="group rounded-2xl p-3 sm:p-4 cursor-default transition-all duration-300 hover:-translate-y-1 flex sm:block items-center sm:items-start gap-3 sm:gap-0"
                    style={{ background: feat.bg, border: `1px solid ${feat.color}22` }}
                    onMouseEnter={e => (e.currentTarget.style.background = feat.bg.replace('0.12', '0.20'))}
                    onMouseLeave={e => (e.currentTarget.style.background = feat.bg)}
                  >
                    <div
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center mb-0 sm:mb-3 shrink-0 transition-transform duration-300 group-hover:scale-110"
                      style={{ background: feat.bg, color: feat.color, border: `1.5px solid ${feat.color}40` }}
                    >
                      {feat.icon}
                    </div>
                    <h4 className="font-extrabold text-white text-[13px] mb-1">{feat.title}</h4>
                    <p className="text-white/50 text-[10px] font-semibold leading-relaxed">{feat.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 2. AGRIIC VS THE REST */}
        <div className="bg-[#F4F7F5] px-4 md:px-8 lg:px-12 py-4 md:py-10 overflow-hidden">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-6">
              <span className="text-xs font-black text-[#D4A373] uppercase tracking-[0.3em] block mb-2">Why Choose Us</span>
              <h2 className="text-3xl font-black text-[#1a2a1e] mb-2">Agriic <span className="text-[#2D5A3F]">vs</span> the Rest</h2>
              <p className="text-sm text-slate-500 font-semibold">See how we compare against local nurseries and other online sellers.</p>
            </div>
            <div className="rounded-3xl overflow-x-auto border border-gray-100 shadow-lg bg-white">
              <table className="w-full text-sm border-collapse table-fixed">
                <thead>
                  <tr>
                    <th className="text-left px-1 md:px-6 py-2 md:py-4 bg-[#f8f8f6] font-black text-slate-500 uppercase tracking-wider text-[9px] md:text-xs w-[28%] border-b border-gray-100">Feature</th>
                    <th className="px-0.5 md:px-4 py-2 md:py-4 bg-[#f8f8f6] font-black text-slate-500 uppercase tracking-wider text-[9px] md:text-xs border-b border-gray-100 text-center w-[22%]">
                      <div className="text-slate-400 break-words">Local Nurseries</div>
                      <div className="hidden md:block text-[9px] text-slate-300 font-semibold mt-0.5">No quality checks</div>
                    </th>
                    <th className="px-0.5 md:px-4 py-2 md:py-4 bg-[#0f2d1e] text-center border-b border-[#1a4a2e] w-[28%]">
                      <div className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2">
                        <span className="font-black text-white text-[10px] md:text-sm">Agriic</span>
                      </div>
                      <div className="hidden md:block text-[9px] text-[#5ecb8e] font-bold mt-1 uppercase tracking-wider">Our Standard</div>
                    </th>
                    <th className="px-0.5 md:px-4 py-2 md:py-4 bg-[#f8f8f6] font-black text-slate-500 uppercase tracking-wider text-[9px] md:text-xs border-b border-gray-100 text-center w-[22%]">
                      <div className="text-slate-400 break-words">Others</div>
                      <div className="hidden md:block text-[9px] text-slate-300 font-semibold mt-0.5">Online sellers</div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {[
                    { feature: 'Plant / Product Quality', sub: 'What you receive', local: { val: '✕', note: 'Poor health' }, agriic: { note: 'Green, healthy & lab-tested' }, others: { val: '~', note: 'Inconsistent' } },
                    { feature: 'Pest / Contaminant Control', sub: 'Before dispatch', local: { val: '✕', note: 'Common issue' }, agriic: { note: 'Fully pest-controlled' }, others: { val: '✕', note: 'Possible risk' } },
                    { feature: 'Organic Certified', sub: 'Global standards', local: { val: '✕', note: 'Not certified' }, agriic: { note: 'Certified organic' }, others: { val: '✕', note: 'Usually not' } },
                    { feature: 'Soil Quality', sub: 'Potting & substrate', local: { val: '~', note: 'Standard soil' }, agriic: { note: 'Pre-mixed, 60-day fertiliser' }, others: { val: '~', note: 'Standard soil' } },
                    { feature: 'Growing Conditions', sub: 'How it was grown', local: { val: '✕', note: 'Outsourced' }, agriic: { note: 'Grown on expert Agriic farms' }, others: { val: '✕', note: 'Outsourced' } },
                    { feature: 'After-sale Support', sub: 'Help after purchase', local: { val: '✕', note: 'None' }, agriic: { note: '24/7 expert support' }, others: { val: '✕', note: 'None' } },
                    { feature: 'Satisfaction Guarantee', sub: 'Buyer protection', local: { val: '✕', note: 'No guarantee' }, agriic: { note: 'Assured quality, 14-day return' }, others: { val: '~', note: 'Conditional' } },
                  ].map((row, i) => (
                    <tr key={i} className={`border-b border-gray-50 transition-colors hover:bg-gray-50/60 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                      <td className="px-1 md:px-6 py-3 md:py-4 align-top">
                        <div className="font-extrabold text-[#1a2a1e] text-[9px] md:text-xs leading-tight break-words">{row.feature}</div>
                        <div className="hidden md:block text-[9px] md:text-[10px] text-slate-400 font-medium mt-0.5">{row.sub}</div>
                      </td>
                      <td className="px-0.5 md:px-4 py-3 md:py-4 text-center align-top">
                        <div className="text-sm md:text-lg font-black text-red-400 leading-none">{row.local.val}</div>
                        <div className="text-[8px] md:text-[10px] text-slate-400 font-medium mt-1 leading-tight break-words">{row.local.note}</div>
                      </td>
                      <td className="px-0.5 md:px-4 py-3 md:py-4 text-center bg-[#f0faf4] border-x border-emerald-100 align-top">
                        <div className="w-4 h-4 md:w-6 md:h-6 bg-[#2D5A3F] rounded-full flex items-center justify-center mx-auto mb-1">
                          <svg className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
                        </div>
                        <div className="text-[8.5px] md:text-[10px] font-black text-[#2D5A3F] leading-tight break-words">{row.agriic.note}</div>
                      </td>
                      <td className="px-0.5 md:px-4 py-3 md:py-4 text-center align-top">
                        <div className="text-sm md:text-lg font-black text-slate-400 leading-none">{row.others.val}</div>
                        <div className="text-[8px] md:text-[10px] text-slate-400 font-medium mt-1 leading-tight break-words">{row.others.note}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 3. STUCK WITH PLANT CARE */}
        <div className="px-4 md:px-8 lg:px-12 pb-8 bg-[#F4F7F5]">
          <div
            className="relative rounded-3xl overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 px-6 md:px-14 py-8 md:py-12"
            style={{ background: 'linear-gradient(135deg, #1a4a2e 0%, #2D5A3F 55%, #3a7050 100%)' }}
          >
            <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(212,163,115,0.15) 0%, transparent 65%)' }} />
            <div className="relative z-10 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-3 md:mb-4">
                <img src="/logo2-white.svg" alt="Agriic" className="h-10 w-auto object-contain filter drop-shadow-md" />
              </div>
              <h2 className="text-xl md:text-3xl font-black text-white leading-snug mb-2">Stuck with plant care?</h2>
              <p className="text-white/70 text-xs md:text-sm font-semibold">We're here to help — reach our expert agri-nutritionists anytime.</p>
            </div>
            <div className="relative z-10 flex flex-col items-center gap-2 md:gap-3">
              <a
                href="https://wa.me/918047863601"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 bg-[#1a2a1e] hover:bg-black text-white font-black text-xs md:text-sm px-6 md:px-8 py-3 md:py-3.5 rounded-2xl transition-all shadow-xl"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5 fill-[#25D366] shrink-0" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Chat With Us
              </a>
              <p className="text-white/50 text-[9px] md:text-[10px] font-semibold">Available 9AM – 9PM, 7 days a week</p>
            </div>
          </div>
        </div>

        {/* 4. CONSCIOUS GARDENING FAQs */}
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-4 md:py-10 bg-[#F4F7F5]">
          <div className="text-center mb-4 md:mb-6">
            <p className="text-[10px] font-black text-[#D4A373] uppercase tracking-[0.25em] mb-1">💬 Common Queries</p>
            <h3 className="text-lg md:text-2xl font-black text-slate-800">Conscious Gardening FAQs</h3>
            <p className="text-xs text-slate-500 font-semibold mt-1">Key answers to safety, dilution, and packing standards.</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-[24px] md:rounded-[28px] p-4 md:p-8 shadow-sm space-y-2">
            {[
              { q: "Are these fertilizers safe for pets and children?", a: "Yes! Because all Agriic ingredients are 100% plant-based organic concentrates (seaweed kelp, neem oils, and humic soil nutrients) with zero toxic pesticide or chemical residue, they are completely safe for pets, children, and beneficial garden insects." },
              { q: "How frequently should I apply these organic solutions?", a: "For general houseplant care, once every 10–14 days is ideal. For active crop cycles or high-yield vegetables, weekly application during vegetative growth periods delivers the best results." },
              { q: "Is the packaging really biodegradable?", a: "Yes, our zip-lock packages are crafted using certified zero-plastic bio-composites. They degrade naturally inside organic compost piles within 180 days, leaving absolutely zero microplastic or chemical footprint." }
            ].map((faq, i) => (
              <details key={i} className="group border-b border-gray-100 last:border-none py-4 cursor-pointer">
                <summary className="flex items-center justify-between text-[11px] md:text-sm font-extrabold text-slate-800 uppercase tracking-wide list-none focus:outline-none select-none">
                  <span>{faq.q}</span>
                  <ChevronDown className="w-4 h-4 text-slate-400 transition-transform group-open:rotate-180 shrink-0 ml-3" />
                </summary>
                <p className="text-xs text-slate-500 font-medium leading-relaxed mt-3 pr-4 pl-1">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>

    </>
  );
};
