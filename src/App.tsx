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
                      <div className="flex items-center gap-8 text-[11px] uppercase tracking-[0.2em] font-mono text-black">
                         <a href="#hero" className="hover:text-trust-blue transition-colors">Curated</a>
                         <a href="#pulse" className="hover:text-trust-blue transition-colors">Analysis</a>
                         <a href="#product" className="hover:text-trust-blue transition-colors">Integrity</a>
                      </div>
                   </div>

                  {/* Central Spotlight Search */}
                  <div className="hidden md:flex flex-1 justify-center px-10">
                     <span className="text-[10px] text-black/20 font-mono tracking-widest">QUERY_ENGINE_v4.2 // RUNNING</span>
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
  const [activePlaceholder, setActivePlaceholder] = useState("唤醒 AI 风险规划师...")
  const [inputValue, setInputValue] = useState("")

  useEffect(() => {
    const placeholders = [
      "唤醒 AI 风险规划师...",
      "输入您的年龄或关心的风险...",
      "比如：给刚买的特斯拉买保险",
      "或者：全家人的健康保障方案"
    ]
    let i = 0
    const timer = setInterval(() => {
      i = (i + 1) % placeholders.length
      setActivePlaceholder(placeholders[i])
    }, 3000)
    return () => clearInterval(timer)
  }, [])


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
                <span className="italic text-black/20 font-extralight tracking-tight">建构生命的厚度。</span>
              </h1>

              {/* Agent Card: Redesigned to be less obtrusive and more integrated */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5, duration: 1.5 }}
                className="glass-card rounded-xl p-8 max-w-[340px] border-l-4 border-l-trust-blue shadow-2xl"
              >
                 <div className="flex items-start gap-6">
                    <div className="w-14 h-14 rounded-full p-[2px] border border-black/5 flex-shrink-0">
                       <img src="/agent_profile.png" className="w-full h-full rounded-full object-cover grayscale opacity-60 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div>
                       <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] text-trust-blue tracking-widest uppercase font-bold bg-blue-50 px-3 py-1 rounded-full">Active</span>
                          <span className="text-[9px] text-black/20 font-mono">NODE_AX_88</span>
                       </div>
                       <h3 className="text-xl font-serif text-black mb-1">陈先生</h3>
                       <p className="text-[10px] text-black/40 tracking-[0.3em] uppercase font-mono">Senior Risk Architect</p>
                    </div>
                 </div>
              </motion.div>
            </div>

            {/* Right Column: Interaction Console - Expanded & Fused */}
            <div className="col-span-12 lg:col-span-7 h-full flex items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 1.5 }}
                className="w-full bg-white/60 backdrop-blur-3xl p-16 rounded-[3rem] border border-white/80 shadow-[0_60px_120px_rgba(0,84,166,0.05)] relative overflow-hidden"
              >
                 <div className="relative z-10 flex flex-col gap-12">
                   {/* Life-Stage Navigator */}
                   <div className="flex gap-20 border-b border-black/5 pb-10">
                      {[
                        { id: 'Founders', label: '创业者', sub: 'Enterprise' }, 
                        { id: 'Guardians', label: '守护者', sub: 'Heritage' }, 
                        { id: 'Explorers', label: '探索者', sub: 'Horizon' }
                      ].map(item => (
                        <div 
                          key={item.id}
                          className={`group cursor-pointer transition-all duration-700 flex flex-col items-start gap-4 ${activeStage === item.id ? 'opacity-100 scale-105' : 'opacity-20 hover:opacity-40'}`}
                          onClick={() => setActiveStage(item.id)}
                        >
                           <span className="text-4xl font-serif font-extralight text-black">{item.label}</span>
                           <span className="text-[11px] tracking-[0.4em] uppercase font-mono text-black/60 relative">
                              {item.sub}
                              {activeStage === item.id && <motion.div layoutId="underline" className="absolute -bottom-10 left-0 w-full h-[3px] bg-trust-blue" />}
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

                   <div className="flex flex-col gap-6">
                      <div className="flex items-center gap-0 group/input relative mt-2 bg-white rounded-2xl p-2 shadow-sm border border-black/5 transition-all hover:shadow-md hover:border-black/10">
                         <div className="flex-1 px-6 py-4 flex items-center gap-4">
                            <span className="text-trust-blue text-xl font-light">/</span>
                            <input 
                              type="text" 
                              value={inputValue}
                              onChange={(e) => setInputValue(e.target.value)}
                              placeholder={activePlaceholder}
                              className="w-full bg-transparent border-none outline-none text-xl font-light placeholder:text-black/20 text-black"
                            />
                         </div>
                         
                         <button className="flex items-center gap-3 px-10 py-5 rounded-xl bg-gradient-to-r from-[#E63E31] to-[#C92A1D] text-white shadow-lg shadow-red-500/20 hover:shadow-red-500/30 transition-all duration-500 whitespace-nowrap group/btn hover:-translate-y-0.5">
                            <span className="text-sm tracking-[0.2em] font-medium uppercase">Activate // 启动</span>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="opacity-80 group-hover/btn:translate-x-1 transition-transform duration-300"><path d="M1 6H11M11 6L6 1M11 6L6 11" stroke="white" strokeWidth="1.5"/></svg>
                         </button>
                      </div>

                      {/* Suggestion Chips */}
                      <div className="flex gap-4 flex-wrap px-4">
                        {[
                          "刚买了一辆特斯拉 Model 3",
                          "给 60 岁的父母配置保险",
                          "我的创业公司需要资产保护"
                        ].map((suggestion, i) => (
                          <div 
                            key={i} 
                            onClick={() => setInputValue(suggestion)}
                            className="px-4 py-1.5 rounded-full border border-black/5 bg-black/[0.02] text-[10px] text-black/40 hover:text-trust-blue hover:border-trust-blue/30 cursor-pointer transition-all uppercase tracking-widest"
                          >
                            {suggestion}
                          </div>
                        ))}
                      </div>
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
  return (
    <section id="pulse" className="pulse-section min-h-screen relative overflow-hidden">
       {/* Background decorative elements */}
       <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-trust-blue/5 to-transparent pointer-events-none" />
       
        <div className="container mx-auto px-12 md:px-24">
           {/* Intelligence Header */}
           <div className="flex flex-col md:flex-row justify-between items-end mb-40 border-b border-black/5 pb-12">
              <div className="max-w-3xl">
                 <span className="pulse-label">Real-time Trust Protocol / 实时信任协议</span>
                 <h2 className="section-title text-black">
                    智性<span className="italic text-black/20 ml-6">检索系统</span>
                 </h2>
              </div>
              <div className="flex gap-4 mt-8 md:mt-0 pb-4">
                 {['全球承保', '极速理赔', 'AI风控'].map(tag => (
                   <div key={tag} className="filter-chip">{tag}</div>
                 ))}
                 <div className="filter-chip active">ACTIVE</div>
               </div>
            </div>

            <div className="asymmetric-layout">
               {/* Left: Swiss Style Pillars */}
               <div className="col-span-12 lg:col-span-5 space-y-24 z-20">
                  {[
                     { id: 'capital', label: 'NETWORK', val: '98', unit: '%', desc: '覆盖全球顶级金融保障，调取高达 50 亿美金承保容量。' },
                     { id: 'speed', label: 'EXECUTION', val: '0.8', unit: 'sec', desc: '基于“朱砂核保协议”，实现资产赔付的秒级智能拨付。' },
                     { id: 'risk', label: 'MONITOR', val: '24.5', unit: 'G+', desc: '实时监控全球风险波形，在威胁发生前部署自动化方案。' }
                  ].map((stat, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.2, duration: 1 }}
                      className="flex flex-col group cursor-pointer border-l-2 border-transparent hover:border-trust-blue pl-10 transition-all duration-700"
                    >
                       <span className="pulse-label">PROTOCOL_0{i+1} // {stat.label}</span>
                       <div className="flex items-baseline mb-4">
                          <span className="pulse-number text-black">{stat.val}</span>
                          <span className="pulse-unit">{stat.unit}</span>
                       </div>
                       <p className="text-black/50 text-xl font-extralight leading-relaxed max-w-sm">{stat.desc}</p>
                    </motion.div>
                  ))}
               </div>

               {/* Right: The Data Installation - Static Swiss Grid */}
               <div className="col-span-12 lg:col-span-7 relative mt-20 lg:mt-0 flex items-center justify-center">
                 <div className="w-full aspect-[4/3] relative bg-white rounded-[2.5rem] p-12 overflow-hidden border border-black/5 shadow-2xl">
                    {/* Background Grid */}
                    <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
                    
                    {/* Data Visualization - Static Cards */}
                    <div className="relative z-10 grid grid-cols-2 gap-8 h-full">
                       <div className="glass-card p-10 rounded-3xl flex flex-col justify-between">
                          <div className="flex justify-between items-start">
                             <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-trust-blue shadow-inner">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                             </div>
                             <span className="text-[10px] font-mono text-black/20 tracking-tighter uppercase">LATEST_CLAIM</span>
                          </div>
                          <div>
                             <h3 className="text-5xl font-din text-black mb-2">¥500k</h3>
                             <p className="text-xs text-black/40 leading-relaxed">Critical Illness Claim<br/>Approved by AI Node SH-01</p>
                          </div>
                       </div>

                       <div className="bg-trust-blue p-10 rounded-3xl flex flex-col justify-between text-white shadow-xl shadow-blue-900/10 hover:scale-[1.02] transition-transform duration-700">
                          <div className="flex justify-between items-start">
                             <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                             </div>
                             <span className="text-[10px] font-mono text-white/40 tracking-tighter uppercase">AVG_TIME</span>
                          </div>
                          <div>
                             <h3 className="text-5xl font-din text-white mb-2">0.8s</h3>
                             <p className="text-xs text-white/40 leading-relaxed">Global Payout Velocity<br/>Real-time Settlement Hub</p>
                          </div>
                       </div>

                       <div className="col-span-2 bg-black/[0.02] p-10 rounded-3xl border border-black/5 flex items-center justify-between group overflow-hidden relative">
                          <div className="scan-line" />
                          <div className="relative z-10">
                             <h4 className="text-lg font-medium text-black mb-2">Global Risk Map</h4>
                             <p className="text-xs text-black/40">Real-time monitoring of 240+ global nodes</p>
                          </div>
                          <div className="flex gap-3 relative z-10">
                             {[1,2,3,4,5,6,7,8].map(i => (
                                <div key={i} className="w-1.5 h-12 bg-trust-blue/10 rounded-full flex flex-col justify-end">
                                   <div className="bg-trust-blue rounded-full" style={{ height: `${20 + (i * 15) % 80}%` }} />
                                </div>
                             ))}
                          </div>
                       </div>
                    </div>
                 </div>
               </div>
            </div>

            {/* Round 7: Micro-Verification Logs */}
            <div className="mt-40 border-t border-black/5 pt-16">
               <div className="max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                  {[
                    { id: '0XFE4', status: 'VERIFIED', node: 'TOKYO_01', type: 'MEDICAL' },
                    { id: '0XA12', status: 'EXECUTING', node: 'LONDON_HUD', type: 'LIFE' },
                    { id: '0X5B9', status: 'VERIFIED', node: 'SHANGHAI_A1', type: 'WEALTH' },
                    { id: '0X9D0', status: 'VERIFIED', node: 'NYC_CENTRAL', type: 'TRAVEL' }
                  ].map((log, i) => (
                    <div key={i} className="flex flex-col gap-3 group border-r border-black/5 last:border-none pr-8">
                       <span className="text-[10px] font-mono text-black/20">LOG_REF_{log.id}</span>
                       <span className="text-sm text-black tracking-widest font-medium group-hover:text-trust-blue transition-colors">{log.node}</span>
                       <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${log.status === 'VERIFIED' ? 'bg-jade shadow-[0_0_12px_rgba(0,166,126,0.3)]' : 'bg-trust-blue animate-pulse'}`} />
                          <span className={`text-[10px] font-mono font-bold ${log.status === 'VERIFIED' ? 'text-black/40' : 'text-trust-blue'}`}>{log.status}</span>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
        </div>
     </section>
  )
}

const Product = () => {
  return (
    <section id="product" className="relative min-h-screen bg-white flex items-center justify-center py-[spacing-section] overflow-hidden">
       {/* Background decorative elements */}
       <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_10%_10%,rgba(0,84,166,0.03)_0%,transparent_50%)]" />

       <div className="container mx-auto px-12 md:px-24 z-10 w-full">
          <div className="asymmetric-layout mb-40">
             <div className="col-span-12 lg:col-span-10 lg:col-start-2 text-center">
                <span className="pulse-label">System Architecture / 04</span>
                <h2 className="section-title text-black">
                   生命建筑系统<br />
                   <span className="text-black/10 italic text-5xl md:text-[6rem]">Architecture HUD</span>
                </h2>
             </div>
          </div>
          
          {/* Static Blueprint Card - Replacing 3D Canvas */}
          <div className="relative w-full max-w-6xl mx-auto aspect-[16/9] border border-black/5 bg-[#F9FAFB] rounded-[3rem] overflow-hidden hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-1000 group">
             {/* Blueprint HUD Lines */}
             <div className="absolute top-1/4 left-0 w-full h-[1px] bg-trust-blue/5 z-20" />
             <div className="absolute top-3/4 left-0 w-full h-[1px] bg-trust-blue/5 z-20" />
             <div className="absolute left-1/4 top-0 w-[1px] h-full bg-trust-blue/5 z-20" />
             <div className="absolute left-3/4 top-0 w-[1px] h-full bg-trust-blue/5 z-20" />
             
             {/* Scanning Line */}
             <div className="scan-line" />

             {/* Blueprint Grid Background */}
             <div className="absolute inset-0 z-0 opacity-[0.05]" 
                  style={{ backgroundImage: 'linear-gradient(#0054A6 1px, transparent 1px), linear-gradient(90deg, #0054A6 1px, transparent 1px)', backgroundSize: '60px 60px' }} 
             />
             
             {/* Realistic Blueprint Image */}
             <div className="absolute inset-0 z-10 flex items-center justify-center p-24">
                 <img 
                   src="/blueprint_house.png" 
                   alt="Architectural Blueprint" 
                   className="w-full h-full object-contain opacity-80 mix-blend-multiply filter contrast-[1.1] brightness-[0.98] transition-transform duration-[2s] group-hover:scale-105"
                 />
             </div>

             {/* Content Overlay */}
             <div className="relative z-30 h-full flex flex-col justify-between p-16 pointer-events-none">
                <div className="flex justify-between items-start">
                   <div className="flex gap-6 items-center">
                      <div className="w-3 h-3 rounded-full bg-trust-blue animate-pulse" />
                      <div className="flex flex-col">
                        <span className="text-[12px] font-mono text-trust-blue uppercase tracking-[0.4em] font-bold">Blueprint_View_4.0</span>
                        <span className="text-[9px] font-mono text-black/20 uppercase tracking-widest mt-1">Ref_System_Integrity_Verified</span>
                      </div>
                   </div>
                   <div className="text-right pointer-events-auto">
                      <h3 className="text-4xl font-serif text-black mb-2">稳固架构</h3>
                      <p className="text-[12px] text-black/40 uppercase tracking-[0.6em] font-mono">Solid Structure Protocol</p>
                   </div>
                </div>

                <div className="grid grid-cols-3 gap-16 pointer-events-auto max-w-4xl">
                   {[
                      { title: 'Foundation', cn: '生命地基', desc: '覆盖全球 240+ 顶级医疗资源网络，确保资产底层稳健。' },
                      { title: 'Pillars', cn: '保障支柱', desc: '千万级保额提供强力金融支撑，抵御无法预见的风险波动。' },
                      { title: 'Roof', cn: '财富屋顶', desc: '通过跨代财富传承协议与税务筹划，构建永久资产掩体。' }
                   ].map((item, i) => (
                      <div key={i} className="group/item cursor-pointer">
                         <div className="w-12 h-[2px] bg-trust-blue mb-6 group-hover/item:w-20 transition-all duration-700" />
                         <h4 className="text-2xl font-serif text-black mb-2">{item.cn}</h4>
                         <p className="text-[11px] text-trust-blue/40 uppercase tracking-[0.4em] mb-4 font-mono">{item.title}</p>
                         <p className="text-sm text-black/40 leading-relaxed font-extralight">{item.desc}</p>
                      </div>
                   ))}
                </div>

                <div className="flex justify-between items-end border-t border-black/5 pt-12 pointer-events-auto">
                   <div className="flex gap-16">
                      <div className="flex flex-col">
                         <span className="text-4xl font-din text-black leading-none mb-2">99.9%</span>
                         <span className="text-[10px] text-black/30 tracking-[0.4em] uppercase font-mono">Safety Rating</span>
                      </div>
                      <div className="flex flex-col">
                         <span className="text-4xl font-din text-black leading-none mb-2">AAA</span>
                         <span className="text-[10px] text-black/30 tracking-[0.4em] uppercase font-mono">Credit Level</span>
                      </div>
                   </div>
                   <button className="cta-vermilion">
                      Download Blueprint Kit
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
    <section id="ecosystem" className="relative bg-[#FBFBFD] py-48 overflow-hidden">
       {/* Background structural lines */}
       <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
          <div className="blueprint-hud-line w-full top-1/2" />
          <div className="blueprint-hud-line h-full left-1/2 w-[1px]" />
       </div>

       <div className="container mx-auto px-12 md:px-24 relative z-10">
          <div className="asymmetric-layout mb-32">
             <div className="col-span-12 lg:col-span-6">
                <span className="pulse-label">Service Infrastructure / 05</span>
                <h2 className="section-title text-black">
                   全域<span className="italic text-black/20 ml-6">守护矩阵</span>
                </h2>
             </div>
             <div className="col-span-12 lg:col-span-5 lg:col-start-8 flex items-end pb-8">
                <p className="text-xl text-black/40 font-extralight leading-loose">
                   从 AI 实时预警到 24/7 全球医疗资源，我们构建的不仅是保险，而是全生命周期的风险对冲矩阵。
                </p>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
             {[
                { 
                  title: 'AI 风险雷达', 
                  en: 'AI Risk Radar', 
                  desc: '集成 140 个风险维度的实时监测，在危害发生的前置 24 小时发出避险指令。',
                  icon: <div className="radar-scanner"><div className="radar-line" /></div>
                },
                { 
                  title: '全球医疗节点', 
                  en: 'Global Medical Node', 
                  desc: '直连梅奥、约翰霍普金斯等全球顶尖医疗机构，确保在黄金时间内获取救治方案。',
                  icon: <div className="w-24 h-24 rounded-full bg-trust-blue/5 border border-trust-blue/10 flex items-center justify-center text-trust-blue">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                  </div>
                },
                { 
                  title: '智能理赔中枢', 
                  en: 'Claims Execution Hub', 
                  desc: '基于自研“朱砂”加密协议，实现全自动化的证据链闭环，确保理赔即刻到账。',
                  icon: <div className="w-24 h-24 rounded-full bg-black flex items-center justify-center text-white shadow-2xl">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  </div>
                }
             ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2, duration: 1 }}
                  className="group flex flex-col p-12 glass-card rounded-[2rem]"
                >
                   <div className="mb-10 transition-transform duration-700 group-hover:scale-110">
                      {item.icon}
                   </div>
                   <h3 className="text-3xl font-serif text-black mb-3">{item.title}</h3>
                   <span className="text-[10px] text-trust-blue uppercase tracking-[0.4em] mb-8 block font-mono font-bold opacity-40">{item.en}</span>
                   <p className="text-black/40 text-lg font-extralight leading-relaxed">{item.desc}</p>
                </motion.div>
             ))}
          </div>
       </div>
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
