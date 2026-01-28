import React, { useState, useEffect, useRef } from 'react'
import { motion, useScroll, AnimatePresence } from 'framer-motion'

// --- Utilities ---

const Magnetic = ({ children, strength = 0.3 }: { children: React.ReactNode, strength?: number }) => {
  const ref = useRef<HTMLDivElement>(null)
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const { clientX, clientY } = e
    const { width, height, left, top } = ref.current.getBoundingClientRect()
    const x = (clientX - (left + width / 2)) * strength
    const y = (clientY - (top + height / 2)) * strength
    ref.current.style.transform = `translate(${x}px, ${y}px)`
  }
  const handleMouseLeave = () => {
    if (!ref.current) return
    ref.current.style.transform = `translate(0px, 0px)`
  }
  return (
    <div ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className="transition-transform duration-300 ease-out">
      {children}
    </div>
  )
}



// --- Highly Custom Components ---

const VariableLogo = () => {
  return (
    <div className="flex items-center gap-6 group cursor-pointer pointer-events-auto">
      <div className="relative w-10 h-10 flex items-center justify-center">
        <svg width="40" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <motion.path 
            d="M5 20 C 15 5, 25 35, 35 20" 
            stroke="black" 
            strokeWidth="2.5" 
            strokeLinecap="round"
            animate={{ d: ["M5 20 C 15 5, 25 35, 35 20", "M5 20 C 15 35, 25 5, 35 20"] }}
            transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
          />
          <motion.path 
            d="M2 20 L38 20" 
            stroke="black" 
            strokeWidth="0.5" 
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2 }}
          />
        </svg>
      </div>
      <div className="flex flex-col logo-text">
        <div className="flex items-center font-light text-black">
           <span>B</span>
           <span className="inline-block -mt-1 scale-y-90">ʌ</span>
           <span>O X I</span>
           <span className="inline-block -mt-1 scale-y-90">ʌ</span>
           <span>N</span>
        </div>
        <span className="text-[9px] text-black tracking-[0.4em] -mt-1">EST. 2026 / GLOBAL PROTECTION</span>
      </div>
    </div>
  )
}

const MegaMenu = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mega-menu"
        >
          <div className="mega-menu-content">
            {/* Left: Editorial/Art */}
            <div className="hidden lg:flex relative bg-gradient-to-br from-[#F7F8FA] via-white to-[#FEFEFE] items-center justify-center overflow-hidden">
               <motion.img 
                 initial={{ scale: 1.2, opacity: 0 }}
                 animate={{ scale: 1, opacity: 0.08 }}
                 src="/data_sphere.png" 
                 alt="Art" 
                 className="absolute inset-0 w-full h-full object-cover" 
               />
               <div className="relative z-10 p-24 text-center">
                  <h3 className="text-3xl font-serif italic mb-6 text-black/80">"您现在最担心什么？"</h3>
                  <p className="text-black/40 text-sm tracking-widest max-w-sm mx-auto uppercase">
                     我们的架构师正在实时分析全球风险节点，为您构建专属的避风港。
                  </p>
               </div>
            </div>

            {/* Right: Identity Links */}
            <div className="flex flex-col justify-center px-12 lg:px-24 bg-white">
               <div className="flex justify-between items-center mb-20">
                  <span className="text-gold text-[10px] tracking-[0.6em] uppercase">Identity Selection / 身份识别</span>
                  <button onClick={onClose} className="text-black/40 hover:text-black transition-colors uppercase text-[10px] tracking-widest">Close / 关闭</button>
               </div>
               
               <div className="flex flex-col">
                  {[
                    { id: "Founder", zh: "创业者", desc: "企业团险与风险避让协议" },
                    { id: "Guardian", zh: "守护者", desc: "家庭资产配置与跨代承袭" },
                    { id: "Explorer", zh: "探索者", desc: "极端环境下的人身安全架构" }
                  ].map((item, i) => (
                    <motion.a 
                      key={i}
                      href={`#${item.id}`}
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className="menu-identity-link group border-black/5"
                      onClick={onClose}
                    >
                       <div className="flex items-baseline justify-between text-black">
                          <div className="flex flex-col">
                             <span className="text-[clamp(12px,1.5vw,16px)] text-gold font-mono mb-2">/ 0{i+1}</span>
                             <span className="group-hover:translate-x-4 transition-transform duration-700">{item.id} <span className="text-black/20 italic ml-4">{item.zh}</span></span>
                          </div>
                          <span className="text-xs text-black/30 uppercase tracking-widest group-hover:text-gold transition-colors">{item.desc}</span>
                       </div>
                    </motion.a>
                  ))}
               </div>

               <div className="mt-20 flex gap-8">
                  <a href="#" className="text-[10px] text-black/20 hover:text-black tracking-widest uppercase transition-colors">Career / 事业</a>
                  <a href="#" className="text-[10px] text-black/20 hover:text-black tracking-widest uppercase transition-colors">Press / 媒体</a>
                  <a href="#" className="text-[10px] text-black/20 hover:text-black tracking-widest uppercase transition-colors">Ethics / 伦理</a>
               </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const Header = () => {
  const { scrollY } = useScroll()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  useEffect(() => {
    return scrollY.on("change", (latest) => setIsScrolled(latest > 50))
  }, [scrollY])

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-[100] pointer-events-none flex justify-center py-6">
        <div className="container mx-auto px-12 md:px-24 w-full relative h-[64px] flex items-center justify-center">
          
          {/* State A (Hero) - Corner Pinned in transparent state */}
          <div className={`absolute inset-x-12 md:inset-x-24 flex items-center justify-between transition-all duration-1000 ${isScrolled ? 'opacity-0 scale-95' : 'opacity-100'}`}>
            <div className="pointer-events-auto">
               <Magnetic><VariableLogo /></Magnetic>
            </div>
            
            <div className="pointer-events-auto flex items-center gap-12">
               {/* Round 1: Global Support Service Node */}
               <div className="hidden lg:flex items-center gap-3 px-5 py-2.5 bg-white/60 backdrop-blur-sm rounded-full border border-black/5 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse shadow-[0_0_8px_rgba(37,99,235,0.6)]" />
                    <span className="text-[9px] text-blue-800 tracking-[0.2em] font-mono uppercase">Node_Active</span>
                  </div>
               </div>
               
               <div className="flex items-center gap-3">
                  <div className="sos-button" />
                  <span className="text-[9px] text-black tracking-[0.4em] uppercase">Emergency SOS</span>
               </div>
               <Magnetic strength={0.4}>
                  <div 
                     onClick={() => setIsMenuOpen(true)}
                     className="flex flex-col gap-1.5 cursor-pointer p-0 group"
                  >
                     <div className="w-1.5 h-1.5 rounded-full bg-black group-hover:translate-x-1 transition-transform" />
                     <div className="w-1.5 h-1.5 rounded-full bg-black group-hover:-translate-x-1 transition-transform opacity-40 ml-1.5" />
                  </div>
               </Magnetic>
            </div>
          </div>

          {/* State B (Floating Capsule) - Centered and width-contained */}
          <AnimatePresence>
             {isScrolled && (
               <motion.div 
                 initial={{ y: -100, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 exit={{ y: -100, opacity: 0 }}
                 transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                 className="cockpit-capsule pointer-events-auto"
               >
                   <div className="flex items-center gap-6">
                      <VariableLogo />
                      <div className="h-6 w-px bg-black/10" />
                      <div className="flex items-center gap-8 text-[11px] uppercase tracking-widest text-black">
                         <a href="#hero" className="hover:text-gold transition-colors">精选</a>
                         <a href="#pulse" className="hover:text-gold transition-colors">定制</a>
                         <a href="#product" className="hover:text-gold transition-colors">理赔</a>
                      </div>
                   </div>

                  {/* Central Spotlight Search */}
                  <div className="hidden md:flex flex-1 justify-center px-10">
                     <input 
                       type="text" 
                       placeholder="Type 'Tesla' or 'Diabetes'..." 
                       className="spotlight-input placeholder:text-black/40"
                     />
                  </div>

                  <div className="flex items-center gap-6">
                     <div className="sos-button" />
                     <div 
                       onClick={() => setIsMenuOpen(true)}
                       className="flex flex-col gap-1 cursor-pointer group"
                     >
                       <div className="w-1 h-1 rounded-full bg-black group-hover:translate-x-1 transition-transform" />
                       <div className="w-1 h-1 rounded-full bg-black group-hover:-translate-x-1 transition-transform opacity-40 ml-1" />
                     </div>
                  </div>
               </motion.div>
             )}
          </AnimatePresence>
        </div>
      </header>

      <MegaMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  )
}

const Hero = ({ activeStage, setActiveStage }: { activeStage: string, setActiveStage: (s: string) => void }) => {
  const [isSoundOn, setIsSoundOn] = useState(false)


  return (
    <section id="hero" className="hero-section relative h-screen w-full flex items-center justify-start px-12 md:px-24 overflow-hidden bg-[#F7F8FA]">
      {/* Visual Canvas: Cinematic Realism (Round 4) */}
      <div className="absolute inset-0 z-0">
        <div className="hero-canvas-blur absolute inset-0 z-10 bg-gradient-to-r from-white/95 via-white/70 to-transparent" />
        <img 
          src="/hero_lifestyle.png" 
          alt="" 
          className="w-full h-full object-cover opacity-80" 
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(212,175,55,0.05),transparent_60%)] z-10" />
      </div>

      <div className="relative z-20 w-[90%] max-w-[1400px]">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full h-[80vh]">
            {/* Left Column: Headline & Brand Identity */}
            <div className="col-span-12 lg:col-span-5 flex flex-col justify-center h-full relative z-10">
              <div className="flex items-center gap-8 mb-12 opacity-60">
                <div className="w-16 h-[1px] bg-gradient-to-r from-gold to-transparent" />
                <span className="text-[10px] tracking-[0.8em] uppercase font-bold text-black/60">Standard of Protection</span>
              </div>
              
              <h1 className="hero-headline mb-16">
                于不确定中，<br />
                <span className="italic text-black/30 font-extralight tracking-tight">建构生命的厚度。</span>
              </h1>

              {/* Agent Card: Redesigned to be less obtrusive and more integrated */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5, duration: 1.5 }}
                className="glass-card rounded-xl p-6 max-w-[320px] cursor:pointer hover:bg-white/90 transition-all duration-500 border-l-2 border-l-gold/20"
              >
                 <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-full p-[2px] border border-black/5 flex-shrink-0">
                       <img src="/agent_profile.png" className="w-full h-full rounded-full object-cover grayscale opacity-80" />
                    </div>
                    <div>
                       <div className="flex items-center gap-2 mb-1">
                          <span className="text-[9px] text-green-600 tracking-widest uppercase font-bold bg-green-50 px-2 py-0.5 rounded-full">Active</span>
                          <span className="text-[9px] text-black/30 font-mono">ID: 8829_AX</span>
                       </div>
                       <h3 className="text-lg font-serif text-black mb-0.5">陈先生</h3>
                       <p className="text-[9px] text-black/40 tracking-[0.2em] uppercase">Senior Risk Officer</p>
                    </div>
                 </div>
              </motion.div>
            </div>

            {/* Right Column: Interaction Console - Expanded & Fused */}
            <div className="col-span-12 lg:col-span-7 h-full flex items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 1.2 }}
                className="w-full bg-white/40 backdrop-blur-xl p-12 pr-16 rounded-[2rem] border border-white/60 shadow-[0_40px_100px_rgba(0,0,0,0.02)] hover:shadow-[0_40px_100px_rgba(0,0,0,0.04)] transition-all duration-700 relative overflow-hidden group"
              >
                 {/* Subtle background gradient for fusion */}
                 <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-white/80 to-transparent pointer-events-none opacity-50" />
                 
                 <div className="relative z-10 flex flex-col gap-12">
                   {/* Life-Stage Navigator */}
                   <div className="flex gap-16 border-b border-black/5 pb-10">
                      {[
                        { id: 'Founders', label: '创业者', sub: 'Business' }, 
                        { id: 'Guardians', label: '守护者', sub: 'Family' }, 
                        { id: 'Explorers', label: '探索者', sub: 'Life' }
                      ].map(item => (
                        <div 
                          key={item.id}
                          className={`group cursor-pointer transition-all duration-500 flex flex-col items-start gap-3 ${activeStage === item.id ? 'opacity-100' : 'opacity-30 hover:opacity-60'}`}
                          onClick={() => setActiveStage(item.id)}
                        >
                           <span className={`text-3xl font-serif font-extralight ${activeStage === item.id ? 'text-black' : 'text-black'}`}>{item.label}</span>
                           <span className="text-[10px] tracking-[0.3em] uppercase font-mono text-black/40 relative pl-1">
                              {item.sub}
                              {activeStage === item.id && <motion.div layoutId="underline" className="absolute -bottom-10 left-0 w-full h-[2px] bg-gradient-to-r from-gold to-transparent" />}
                           </span>
                        </div>
                      ))}
                   </div>

                   <div className="min-h-[5rem] flex items-center">
                      <p key={activeStage} className="text-black/60 text-lg font-light leading-relaxed animate-fade-in max-w-lg">
                        {[
                          activeStage === 'Founders' && "保护财富与梦想。为您的事业提供稳健的底层保障。",
                          activeStage === 'Guardians' && "全家人的护盾。将爱转化为保障，守护每个幸福瞬间。",
                          activeStage === 'Explorers' && "探索世界的安全冗余。提供 24 小时贴身响应。"
                        ].filter(Boolean)}
                      </p>
                   </div>

                   <div className="flex items-center gap-0 group/input relative mt-2 bg-white rounded-2xl p-2 shadow-sm border border-black/5 transition-all hover:shadow-md hover:border-black/10">
                      <div className="flex-1 px-6 py-4 flex items-center gap-4">
                         <span className="text-black/10 text-xl font-light">/</span>
                         <input 
                           type="text" 
                           placeholder="唤醒 AI 风险规划师..."
                           className="w-full bg-transparent border-none outline-none text-xl font-light placeholder:text-black/20 text-black"
                         />
                      </div>
                      
                      <button className="flex items-center gap-3 px-10 py-5 rounded-xl bg-gradient-to-r from-[#E63E31] to-[#C92A1D] text-white shadow-lg shadow-red-500/20 hover:shadow-red-500/30 transition-all duration-500 whitespace-nowrap group/btn hover:-translate-y-0.5">
                         <span className="text-sm tracking-[0.2em] font-medium">启动</span>
                         <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="opacity-80 group-hover/btn:translate-x-1 transition-transform duration-300"><path d="M1 6H11M11 6L6 1M11 6L6 11" stroke="white" strokeWidth="1.5"/></svg>
                      </button>
                   </div>
                 </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Atmospheric Audio Toggle */}
      <div 
        className="absolute bottom-12 left-12 z-30 flex items-center gap-4 cursor-pointer pointer-events-auto"
        onClick={() => setIsSoundOn(!isSoundOn)}
      >
        <div className="flex gap-[2px] h-4 items-center">
          {[0.4, 0.8, 0.6, 1, 0.5].map((h, i) => (
            <motion.div 
              key={i}
              animate={{ height: isSoundOn ? [`${h*100}%`, `${(1-h)*100}%`, `${h*100}%`] : '2px' }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
              className="soundwave-bar"
            />
          ))}
        </div>
        <span className="text-[9px] tracking-[0.4em] text-black/30 uppercase">
          {isSoundOn ? 'Soundscape On' : 'Nature Silence'}
        </span>
      </div>

      {/* Scroll Hint */}
      <div className="scroll-hint-line" />


    </section>
  )
}

// 3D Components removed for static design


const Pulse = () => {
    // activeMode removed
  
  return (
    <section id="pulse" className="pulse-section min-h-screen">
       <div className="section-mask-top" />
       
        <div className="container mx-auto px-12 md:px-24">
           {/* Intelligence Header */}
           <div className="flex flex-col md:flex-row justify-between items-end mb-32 border-b border-black/10 pb-10">
              <div className="max-w-2xl">
                 <span className="pulse-label">Real-time Trust Protocol / 实时信任协议</span>
                 <h2 className="text-7xl md:text-8xl text-black font-extralight leading-[0.9] tracking-tighter">
                    智性<br /><span className="italic text-black/20">检索系统</span>
                 </h2>
              </div>
              <div className="flex gap-4 mt-8 md:mt-0">
                 {['全球承保', '极速理赔', 'AI风控'].map(tag => (
                   <div key={tag} className="filter-chip">{tag}</div>
                 ))}
                 <div className="filter-chip active">ACTIVE</div>
              </div>
           </div>

           <div className="asymmetric-layout">
              {/* Left: Swiss Style Pillars */}
              <div className="col-span-12 lg:col-span-5 space-y-32 z-20">
                 {[
                    { id: 'capital', label: 'NETWORK', val: '98', unit: '%', desc: '覆盖全球顶级金融保障，调取高达 50 亿美金承保容量。', jade: true },
                    { id: 'speed', label: 'EXECUTION', val: '0.8', unit: 'sec', desc: '基于“朱砂核保协议”，实现资产赔付的秒级智能拨付。', jade: false },
                    { id: 'risk', label: 'MONITOR', val: '24.5', unit: 'G+', desc: '实时监控全球风险波形，在威胁发生前部署自动化方案。', jade: true }
                 ].map((stat, i) => (
                   <motion.div 
                     key={i}
                     className="flex flex-col group cursor-pointer border-l-2 border-transparent hover:border-gold pl-8 transition-all duration-700"
                   >
                      <div className="flex items-center gap-3">
                         <span className="pulse-label opacity-60">PROTOCOL_0{i+1} // {stat.label}</span>
                         {stat.jade && <span className="jade-accent">● LIVE_GROWTH</span>}
                      </div>
                      <div className="flex items-baseline mt-4 mb-2">
                         <span className="pulse-number font-din text-black">{stat.val}</span>
                         <span className="pulse-unit font-din text-black">{stat.unit}</span>
                       </div>
                      <p className="pulse-desc text-black/60 text-lg font-light leading-relaxed">{stat.desc}</p>
                   </motion.div>
                 ))}
              </div>

               {/* Right: The Data Installation - Static Swiss Grid */}
               <div className="col-span-12 lg:col-span-7 h-[600px] relative mt-20 lg:mt-0 flex items-center justify-center">
                 <div className="w-full h-full relative border border-black/5 bg-white/50 backdrop-blur-sm rounded-3xl p-8 overflow-hidden">
                    {/* Background Grid */}
                    <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
                    
                    {/* Data Visualization - Static Cards */}
                    <div className="relative z-10 grid grid-cols-2 gap-4 h-full">
                       <div className="bg-white/80 p-6 rounded-2xl border border-black/5 flex flex-col justify-between group hover:border-gold/30 transition-colors">
                          <div className="flex justify-between items-start">
                             <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                             </div>
                             <span className="text-[9px] font-mono text-black/30">LATEST_CLAIM</span>
                          </div>
                          <div>
                             <h3 className="text-3xl font-din text-black mb-1">¥500,000</h3>
                             <p className="text-xs text-black/50">Critical Illness Claim<br/>Approved in 2.4s</p>
                          </div>
                       </div>

                       <div className="bg-blue-600/5 p-6 rounded-2xl border border-blue-100 flex flex-col justify-between group hover:border-blue-300 transition-colors">
                          <div className="flex justify-between items-start">
                             <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                             </div>
                             <span className="text-[9px] font-mono text-blue-800/50">AVG_TIME</span>
                          </div>
                          <div>
                             <h3 className="text-3xl font-din text-blue-900 mb-1">0.8s</h3>
                             <p className="text-xs text-blue-800/60">Global Payout Velocity<br/>AI Automated</p>
                          </div>
                       </div>

                       <div className="col-span-2 bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-black/5 flex items-center justify-between">
                          <div>
                             <h4 className="text-sm font-medium text-black mb-1">Global Risk Map</h4>
                             <p className="text-xs text-black/40">Real-time monitoring of 240+ regions</p>
                          </div>
                          <div className="flex gap-2">
                             {[1,2,3,4,5].map(i => (
                                <div key={i} className="w-1 h-8 bg-black/5 rounded-full" style={{ height: 16 + (i * 4) % 24 }} />
                             ))}
                          </div>
                       </div>
                    </div>
                 </div>
               </div>
            </div>

           {/* Round 7: Micro-Verification Logs */}
            <div className="mt-40 border-t border-black/5 pt-12">
               <div className="max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-6">
                  {[
                    { id: '0XFE4', status: 'VERIFIED', node: 'TOKYO_01', type: 'MEDICAL' },
                    { id: '0XA12', status: 'EXECUTING', node: 'LONDON_HUD', type: 'LIFE' },
                    { id: '0X5B9', status: 'VERIFIED', node: 'SHANGHAI_A1', type: 'WEALTH' },
                    { id: '0X9D0', status: 'VERIFIED', node: 'NYC_CENTRAL', type: 'TRAVEL' }
                  ].map((log, i) => (
                    <div key={i} className="verification-log group">
                       <span className="text-[9px] font-mono text-black/40">[{log.id}]</span>
                       <span className="text-[11px] text-black flex-1 tracking-[0.2em] font-medium">{log.node}</span>
                       <div className="flex items-center gap-3">
                          <div className={`w-1.5 h-1.5 rounded-full ${log.status === 'VERIFIED' ? 'bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]' : 'bg-gold animate-pulse'}`} />
                          <span className={`${log.status === 'VERIFIED' ? 'text-black/60' : 'text-gold'} text-[9px] font-mono font-bold tracking-tighter`}>{log.status}</span>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="mt-20 text-center md:text-left">
               <p className="text-[12px] text-black/30 tracking-[1em] uppercase italic font-extralight py-10 opacity-60">
                 “数据是理性的，但它守护的生活是感性的。”
               </p>
            </div>
        </div>
     </section>
  )
}

const Product = () => {
  return (
    <section id="product" className="relative min-h-screen bg-white flex flex-col items-center justify-center py-[spacing-section]">
       <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
          <div className="w-full h-full bg-[radial-gradient(circle_at_center,rgba(0,84,166,0.05)_0%,transparent_70%)]" />
       </div>

       <div className="container mx-auto px-12 md:px-24 z-10">
          <div className="asymmetric-layout mb-32">
             <div className="col-span-12 lg:col-span-8 lg:col-start-3 text-center">
                <span className="text-blue-600 text-xs tracking-[1.5em] uppercase block mb-10 opacity-60">System Architecture / 04</span>
                <h2 className="text-7xl md:text-8xl font-extralight tracking-tighter leading-none text-black">
                   生命建筑系统<br />
                   <span className="text-black/20 italic text-5xl md:text-7xl">Architecture HUD</span>
                </h2>
             </div>
          </div>
          
          {/* Static Blueprint Card - Replacing 3D Canvas */}
          <div className="relative w-full max-w-4xl mx-auto h-[600px] border border-black/5 bg-[#F9FAFB] rounded-[2rem] overflow-hidden hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-700 group">
             {/* Blueprint Grid Background */}
             <div className="absolute inset-0 z-0 opacity-10" 
                  style={{ backgroundImage: 'linear-gradient(#0054A6 1px, transparent 1px), linear-gradient(90deg, #0054A6 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
             />
             
             {/* Realistic Blueprint Image */}
             <div className="absolute inset-0 z-10 flex items-center justify-center p-20">
                 <img 
                   src="/blueprint_house.png" 
                   alt="Architectural Blueprint" 
                   className="w-full h-full object-contain opacity-90 mix-blend-multiply filter contrast-125 transition-transform duration-1000 group-hover:scale-105"
                 />
             </div>

             {/* Content Overlay */}
             <div className="relative z-20 h-full flex flex-col justify-between p-12 pointer-events-none">
                <div className="flex justify-between items-start">
                   <div className="flex gap-4 items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                      <span className="text-[10px] font-mono text-blue-900/40 uppercase tracking-widest">Blueprint_View_2.0</span>
                   </div>
                   <div className="text-right pointer-events-auto">
                      <h3 className="text-2xl font-serif text-black mb-1">稳固架构</h3>
                      <p className="text-[10px] text-black/40 uppercase tracking-widest">Solid Structure</p>
                   </div>
                </div>

                <div className="grid grid-cols-3 gap-8 pointer-events-auto">
                   {[
                      { title: 'Foundation', cn: '地基', desc: '全球顶尖医疗资源网络覆盖' },
                      { title: 'Pillars', cn: '支柱', desc: '千万级保额提供强力支撑' },
                      { title: 'Roof', cn: '屋顶', desc: '家族财富传承与税务筹划' }
                   ].map((item, i) => (
                      <div key={i} className="group/item cursor-pointer">
                         <div className="w-8 h-[1px] bg-blue-600 mb-4 group-hover/item:w-16 transition-all duration-500" />
                         <h4 className="text-lg font-serif text-black mb-1">{item.cn}</h4>
                         <p className="text-[10px] text-blue-900/50 uppercase tracking-widest mb-3">{item.title}</p>
                         <p className="text-xs text-black/40 leading-relaxed max-w-[180px]">{item.desc}</p>
                      </div>
                   ))}
                </div>

                <div className="flex justify-between items-end border-t border-blue-900/10 pt-8 pointer-events-auto">
                   <div className="flex gap-8">
                      <div>
                         <span className="block text-[32px] font-din text-black leading-none">99.9%</span>
                         <span className="text-[9px] text-black/30 tracking-widest uppercase">Safety Rating</span>
                      </div>
                      <div>
                         <span className="block text-[32px] font-din text-black leading-none">AAA</span>
                         <span className="text-[9px] text-black/30 tracking-widest uppercase">Credit Level</span>
                      </div>
                   </div>
                   <button className="px-8 py-3 bg-black text-white text-xs tracking-widest uppercase hover:bg-blue-900 transition-colors">
                      Download Kit
                   </button>
                </div>
             </div>
          </div>

          <div className="mt-20 text-center flex flex-col items-center gap-6">
             <div className="w-1 h-20 bg-gradient-to-b from-blue-600/20 to-transparent" />
             <span className="text-[12px] text-black/40 tracking-[0.6em] uppercase font-mono mb-4">
                STRUCTURAL_INTEGRITY_VERIFIED
             </span>
          </div>
       </div>
    </section>
  )
}

const Ecosystem = () => {
  return (
    <section className="ecosystem-section bg-[#F0F2F5]">
       <div className="container mx-auto px-12 md:px-24 relative z-20">
          <div className="asymmetric-layout">
              <div className="col-span-12 lg:col-span-7 mb-40">
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-8 h-[2px] bg-vermilion" />
                   <span className="text-gold text-xs tracking-[1em] uppercase opacity-60">Service Protocol 0x4F</span>
                </div>
                <h2 className="text-7xl md:text-8xl font-extralight mb-16 leading-[1.0] tracking-tighter text-black">生命<br /><span className="text-black/30 italic">的防御协奏</span></h2>
                <p className="text-black/60 text-lg leading-relaxed font-extralight tracking-wide max-w-2xl">
                   正如 `baoxian.com` 定义了效率，我们定义了 **“尊严”**。保险不仅是支付手段，更是生命系统的防御协奏。从投保到理赔，这是一场跨越时间的信任兑付。
                </p>
             </div>
          </div>

          <div className="gold-thread" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-24 relative">
             {/* Node 1: Pre-check */}
             <motion.div 
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ duration: 1 }}
               className="timeline-node"
             >
                <div className="node-pulse" />
                <div className="radar-scanner mb-10 border-black/10">
                   <div className="radar-line bg-black/40" />
                </div>
                <h4 className="text-xl font-serif mb-4 text-black">智能核保雷达</h4>
                <p className="text-[12px] text-black/30 leading-relaxed text-center font-light uppercase tracking-widest">
                   AI 辅助排查 2000+ 种疾病隐患，<br />
                   大董挑食材，我们挑条款。
                </p>
             </motion.div>

             {/* Node 2: In-force */}
             <motion.div 
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ duration: 1, delay: 0.2 }}
               className="timeline-node"
             >
                <div className="node-pulse" />
                <div className="flex items-center mb-10 h-24">
                   <div className="doctor-light animate-pulse" />
                   <span className="text-gold font-mono text-xs uppercase tracking-[0.3em]">Doctor Live</span>
                </div>
                <h4 className="text-xl font-serif mb-4 text-black">24/7 视频医生</h4>
                <p className="text-[12px] text-black/30 leading-relaxed text-center font-light uppercase tracking-widest">
                   小病不排队，大病有绿通。<br />
                   连接全国 Top 30 三甲医院资源。
                </p>
             </motion.div>

             {/* Node 3: Claim */}
             <motion.div 
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ duration: 1, delay: 0.4 }}
               className="timeline-node"
             >
                <div className="node-pulse" />
                <div className="h-24 flex items-center mb-10 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
                   <img src="/agent_profile.png" alt="Claim Agent" className="w-16 h-16 rounded-full border border-black/10 p-1" />
                </div>
                <h4 className="text-xl font-serif mb-4 text-black">理赔协奏曲</h4>
                <p className="text-[12px] text-black/30 leading-relaxed text-center font-light uppercase tracking-widest">
                   从资料收集到法律博弈，<br />
                   我们不仅陪伴，更能为您而战。
                </p>
             </motion.div>
          </div>
       </div>

       {/* Floating Background Glows */}
       <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
       <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] pointer-events-none" />
    </section>
  )
}

const Manifesto = () => {
  return (
    <section className="h-screen bg-white flex flex-col items-center justify-center relative overflow-hidden py-40">
       <div className="container mx-auto px-24 text-center z-10">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="space-y-12"
          >
              <p className="text-gold text-sm tracking-[1.2em] uppercase font-bold mb-8">The Philosophy of Defense</p>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif max-w-6xl mx-auto leading-tight italic text-black font-medium">
                “我们定义<b>尊严</b>。<br />
                保险不仅是支付手段，更是生命系统的<b>防御协奏</b>。”
              </h2>
              <p className="text-black/60 text-lg tracking-[0.1em] max-w-3xl mx-auto font-light leading-loose mt-16">
                 从投保到理赔，这是一场跨越时间的信任兑付。<br />
                 在万物互联的喧嚣中，我们致力于建构一种沉默而恒定的力量。
              </p>
          </motion.div>
       </div>
       <div className="absolute bottom-0 w-full select-none pointer-events-none opacity-[0.05]">
          <h2 className="outline-text text-center tracking-tighter text-black">UNCOMPROMISED</h2>
       </div>
    </section>
  )
}

const Footer = () => {
  return (
    <footer className="bg-white py-48 border-t border-black/5 relative overflow-hidden">
       {/* Background Noise & Grid */}
       <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.1) 1px, transparent 0)', backgroundSize: '40px 40px' }} />

       <div className="container mx-auto px-12 md:px-24 relative z-10">
          <div className="grid grid-cols-12 gap-20 mb-40">
             <div className="col-span-12 lg:col-span-4 space-y-12">
                <VariableLogo />
                <p className="text-[14px] text-black/60 leading-loose max-w-[340px] font-light italic">
                   “于不确定中，建构恒常。”<br />
                   我们不仅仅是在提供保障，更是在为复杂的生命系统 **设计韧性**。基于全球化理赔节点与 AI 信任协议，锚定未来的每一个确定性。
                </p>
                <div className="pt-8 flex gap-6 grayscale opacity-20 hover:opacity-100 transition-opacity">
                   {/* Abstract partner logo symbols */}
                   {[1,2,3,4].map(i => (
                     <div key={i} className="w-12 h-12 border border-black/10 rounded flex items-center justify-center font-mono text-[8px] text-black">NODE_{i}</div>
                   ))}
                </div>
             </div>

             <div className="col-span-6 lg:col-span-2 space-y-10">
                <span className="text-gold text-[10px] tracking-[0.4em] uppercase opacity-40">Categories</span>
                <div className="flex flex-col gap-5 text-[14px]">
                   {['Health_架构', 'Life_责任', 'Wealth_传承', 'Travel_流动'].map(link => (
                     <a key={link} href="#" className="text-black/40 hover:text-black transition-colors lowercase tracking-widest">{link}</a>
                   ))}
                </div>
             </div>

             <div className="col-span-6 lg:col-span-2 space-y-10">
                <span className="text-gold text-[10px] tracking-[0.4em] uppercase opacity-40">Intelligence</span>
                <div className="flex flex-col gap-5 text-[14px]">
                   {['AI风控协议', '朱砂理赔标准', '全球共保网', '技术白皮书'].map(link => (
                     <a key={link} href="#" className="text-black/40 hover:text-black transition-colors lowercase tracking-widest">{link}</a>
                   ))}
                </div>
             </div>

             <div className="col-span-12 lg:col-span-4 space-y-10">
                <span className="text-gold text-[10px] tracking-[0.4em] uppercase opacity-40">System_Status</span>
                <div className="p-8 rounded-xl bg-black/[0.02] border border-black/5 space-y-6">
                   <div className="flex justify-between items-center text-[11px] font-mono">
                      <span className="text-black/40 uppercase">Global Node Connectivity</span>
                      <span className="text-green-600">99.98% AVAILABLE</span>
                   </div>
                   <div className="w-full h-1 bg-black/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '99.98%' }}
                        transition={{ duration: 2 }}
                        className="h-full bg-green-500 shadow-[0_0_10px_#22c55e]"
                      />
                   </div>
                   <p className="text-[10px] text-black/20 italic leading-relaxed">
                      * 当前已接入 124 个全球承保节点，系统时延 1.2s，朱砂协议已在所有主干网完成部署。
                   </p>
                </div>
             </div>
          </div>

          <div className="pt-24 border-t border-black/5 flex flex-col lg:flex-row justify-between items-center gap-12">
             <div className="flex items-center gap-10">
                <span className="text-[9px] text-black/20 tracking-[0.8em] uppercase">Built for Serenity / 2026</span>
                <div className="w-12 h-px bg-black/10" />
                <span className="text-[9px] text-black/20 tracking-[0.8em] uppercase italic font-serif">Deep Slate Edition</span>
             </div>
             
             <p className="text-[10px] text-black/20 tracking-[0.2em] font-light">
                © 2026 BAOXIAN GLOBAL. 所有权归属于数字生命建筑研究所.
             </p>

             <div className="flex gap-10">
                {['WeChat', 'LinkedIn', 'Terminal'].map(social => (
                  <span key={social} className="text-[10px] text-black/20 hover:text-gold cursor-pointer transition-colors tracking-widest uppercase">{social}</span>
                ))}
             </div>
          </div>
       </div>
    </footer>
  )
}

export default function App() {
  const [activeStage, setActiveStage] = useState('Founders')

  return (
    <div className="bg-[#F7F8FA] selection:bg-gold selection:text-black">
      <Header />
      
      {/* Round 5: HUD Floating Sidebar */}
      <div className="hud-sidebar hidden lg:flex">
         {[
           { icon: '◉', label: 'Dashboard' },
           { icon: '✦', label: 'AI Guide' },
           { icon: '⇄', label: 'Nodes' },
           { icon: '⚓', label: 'Support' }
         ].map((item, i) => (
           <div key={i} className="hud-item group relative">
              <span className="text-xl">{item.icon}</span>
              <span className="absolute right-full mr-4 px-3 py-1 bg-black text-white text-[9px] uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all rounded transition-all pointer-events-none">{item.label}</span>
           </div>
         ))}
      </div>

      <Hero activeStage={activeStage} setActiveStage={setActiveStage} />
      <Pulse />
      <Product />
      <Ecosystem />
      <Manifesto />
      <Footer />
    </div>
  )
}
