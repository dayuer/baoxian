import React, { useState, useEffect, useRef } from 'react'
import { motion, useScroll, AnimatePresence } from 'framer-motion'
import DialogueFlow from './dialogue/DialogueFlow'
import { decodeProfile } from './report/persistence'

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
        <div className="flex items-center font-light text-black text-xl tracking-[0.3em]">
           <span>保</span>
           <span>险</span>
        </div>
        <span className="text-[9px] text-black tracking-[0.4em] -mt-1">二〇二六创立 / 于不确定中建构确定</span>
      </div>
    </div>
  )
}

const MegaMenu = ({ isOpen, onClose, onStart }: { isOpen: boolean, onClose: () => void, onStart: () => void }) => {
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
                 src="./data_sphere.png" 
                 alt="Art" 
                 className="absolute inset-0 w-full h-full object-cover" 
               />
               <div className="relative z-10 p-24 text-center">
                  <h3 className="text-3xl font-serif italic mb-6 text-black/80">"这一生，什么是你不愿失去的？"</h3>
                  <p className="text-black/40 text-sm tracking-widest max-w-sm mx-auto uppercase">
                     不急着回答。让这个问题陪你坐一会儿。
                  </p>
               </div>
            </div>

            {/* Right: Identity Links */}
            <div className="flex flex-col justify-center px-12 lg:px-24 bg-white">
               <div className="flex justify-between items-center mb-20">
                  <span className="text-gold text-[10px] tracking-[0.6em]">你的篇章</span>
                  <button onClick={onClose} className="text-black/40 hover:text-black transition-colors text-[10px] tracking-widest">关闭</button>
               </div>
                              <div className="flex flex-col gap-4 lg:gap-6">
                   {[
                     { id: "Founder", zh: "创业", desc: "守住事业背后的那个人" },
                     { id: "Guardian", zh: "守护", desc: "让爱不只是一句承诺" },
                     { id: "Explorer", zh: "探索", desc: "走得再远，也有人接住你" }
                   ].map((item, i) => (
                     <motion.button
                       key={i}
                       type="button"
                       initial={{ x: 50, opacity: 0 }}
                       animate={{ x: 0, opacity: 1 }}
                       transition={{ delay: 0.4 + i * 0.1 }}
                       className="group relative flex items-center py-6 lg:py-10 border-b border-black/5 last:border-none overflow-hidden w-full text-left"
                       onClick={() => { onClose(); onStart() }}
                     >
                        <div className="flex flex-1 items-center justify-between z-10">
                           <div className="flex items-baseline gap-12 lg:gap-20">
                              <span className="text-gold text-lg lg:text-xl font-mono tracking-tighter w-12">/ 0{i+1}</span>
                              <div className="flex flex-col relative whitespace-nowrap">
                                 <span className="text-4xl lg:text-[7rem] font-serif font-extralight text-black tracking-tight group-hover:italic transition-all duration-700">
                                    {item.zh}者
                                 </span>
                                 {/* Layered Chinese Text */}
                                 <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl lg:text-[12rem] font-serif font-extralight text-black/[0.03] pointer-events-none select-none transition-all duration-[2s] group-hover:scale-110 group-hover:text-gold/5">
                                    {item.zh}
                                 </span>
                              </div>
                           </div>
                           <span className="hidden md:block text-[11px] lg:text-[13px] text-black/40 uppercase tracking-[0.4em] font-extralight group-hover:text-gold transition-colors whitespace-nowrap">
                              {item.desc}
                           </span>
                        </div>
                     </motion.button>
                   ))}
                </div>

               <div className="mt-20 flex gap-8">
                  <a href="#" className="text-[10px] text-black/20 hover:text-black tracking-widest transition-colors">同行</a>
                  <a href="#" className="text-[10px] text-black/20 hover:text-black tracking-widest transition-colors">记录</a>
                  <a href="#" className="text-[10px] text-black/20 hover:text-black tracking-widest transition-colors">我们相信的</a>
               </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const Header = ({ onStart }: { onStart: () => void }) => {
  const { scrollY } = useScroll()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  useEffect(() => {
    return scrollY.on("change", (latest) => setIsScrolled(latest > 50))
  }, [scrollY])

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-[100] pointer-events-none flex justify-center py-4 lg:py-6">
        <div className="container relative h-[64px] flex items-center justify-center">
          
          {/* State A (Hero) - Corner Pinned in transparent state */}
          <div className={`absolute inset-x-0 lg:inset-x-24 flex items-center justify-between transition-all duration-1000 ${isScrolled ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100'}`}>
            <div className="pointer-events-auto">
               <Magnetic><VariableLogo /></Magnetic>
            </div>
            
            <div className="pointer-events-auto flex items-center gap-6 lg:gap-12">
               {/* 主入口：开始对话 */}
               <button
                  onClick={onStart}
                  className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-black/15 hover:bg-black hover:text-white transition-colors text-[11px] tracking-[0.2em] uppercase"
               >
                   开始对话
                  <span className="text-trust-blue group-hover:text-white">→</span>
               </button>

               <div className="flex items-center gap-3">
                  <div className="sos-button" />
                  <span className="text-[9px] text-black tracking-[0.4em] hidden md:inline">紧急响应</span>
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
                   <div className="flex items-center gap-4 lg:gap-6">
                      <VariableLogo />
                      <div className="h-4 lg:h-6 w-px bg-black/10" />
                      <div className="hidden md:flex items-center gap-8 text-[12px] tracking-[0.2em] text-black">
                         <a href="#pulse" className="hover:text-trust-blue transition-colors">实时分析</a>
                         <a href="#product" className="hover:text-trust-blue transition-colors">系统架构</a>
                         <a href="#ecosystem" className="hover:text-trust-blue transition-colors">守护网络</a>
                         <button onClick={onStart} className="text-trust-blue hover:underline tracking-[0.2em]">开始 →</button>
                      </div>
                   </div>

                  {/* Central Spotlight Search */}
                  <div className="hidden lg:flex flex-1 justify-center px-10">
                     <span className="text-[10px] text-black/20 font-mono tracking-widest">LISTENING // 随时待命</span>
                  </div>

                  <div className="flex items-center gap-4 lg:gap-6">
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

      <MegaMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} onStart={onStart} />
    </>
  )
}

const Hero = ({ activeStage, setActiveStage, onStart }: { activeStage: string, setActiveStage: (s: string) => void, onStart: () => void }) => {
  const [isSoundOn, setIsSoundOn] = useState(false)
  const [activePlaceholder, setActivePlaceholder] = useState("说说你在想什么...")
  const [inputValue, setInputValue] = useState("")

  useEffect(() => {
    const placeholders = [
      "说说你在想什么...",
      "比如：刚有了孩子，想给家里多一层保障",
      "或者：创业三年了，还没认真考虑过保险",
      "最近总觉得，应该做点什么准备"
    ]
    let i = 0
    const timer = setInterval(() => {
      i = (i + 1) % placeholders.length
      setActivePlaceholder(placeholders[i])
    }, 3000)
    return () => clearInterval(timer)
  }, [])


  return (
    <section id="hero" className="hero-section relative min-h-screen w-full flex items-center justify-start py-20 lg:py-0 overflow-hidden bg-[#F7F8FA]">
      {/* Visual Canvas: Cinematic Realism */}
      <div className="absolute inset-0 z-0">
        <div className="hero-canvas-blur absolute inset-0 z-10 bg-gradient-to-b lg:bg-gradient-to-r from-white/95 via-white/70 to-transparent" />
        <img 
          src="./hero_lifestyle.png" 
          alt="" 
          className="w-full h-full object-cover opacity-80" 
        />
      </div>

      <div className="container relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:items-center min-h-[80vh]">
            {/* Left Column: Headline & Brand Identity */}
            <div className="col-span-12 lg:col-span-5 flex flex-col justify-center relative z-10">
              <div className="flex items-center gap-8 mb-8 lg:mb-12 opacity-60">
                <div className="w-12 lg:w-16 h-[1px] bg-gradient-to-r from-gold to-transparent" />
                <span className="text-[10px] tracking-[0.4em] lg:tracking-[0.8em] font-bold text-black/60">A Quiet Certainty</span>
              </div>
              
              <h1 className="hero-headline mb-12 lg:mb-16 text-4xl sm:text-5xl lg:text-7xl">
                于不确定中，<br />
                <span className="italic text-black/20 font-extralight tracking-tight block sm:inline">建构生命的厚度。</span>
              </h1>

              {/* Agent Card */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5, duration: 1.5 }}
                className="hidden md:block glass-card rounded-xl p-8 max-w-[340px] border-l-4 border-l-trust-blue shadow-2xl"
              >
                 <div className="flex items-start gap-6">
                    <div className="w-14 h-14 rounded-full p-[2px] border border-black/5 flex-shrink-0">
                       <img src="./agent_profile.png" className="w-full h-full rounded-full object-cover grayscale opacity-60 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div>
                       <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] text-trust-blue tracking-widest font-bold bg-blue-50 px-3 py-1 rounded-full">在线</span>
                          <span className="text-[9px] text-black/20 font-mono"></span>
                       </div>
                       <h3 className="text-xl font-serif text-black mb-1">你的顾问</h3>
                       <p className="text-[10px] text-black/40 tracking-[0.3em]">聆听 · 理解 · 陪伴</p>
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
                 className="w-full max-w-full bg-white/60 backdrop-blur-3xl p-5 sm:p-8 lg:p-16 rounded-[2rem] lg:rounded-[3rem] border border-white/80 shadow-[0_60px_120px_rgba(0,84,166,0.05)] relative overflow-hidden"
              >
                  <div className="relative z-10 flex flex-col gap-8 lg:gap-12">
                   {/* Life-Stage Navigator */}
                   <div className="flex flex-wrap lg:flex-nowrap gap-6 lg:gap-20 border-b border-black/5 pb-8 lg:pb-10">
                      {[
                        { id: 'Founders', label: '创业者', sub: '事业' },
                        { id: 'Guardians', label: '守护者', sub: '家庭' },
                        { id: 'Explorers', label: '探索者', sub: '远方' }
                      ].map(item => (
                        <div 
                          key={item.id}
                          className={`group cursor-pointer transition-all duration-700 flex flex-col items-start gap-2 lg:gap-4 whitespace-nowrap ${activeStage === item.id ? 'opacity-100 scale-105' : 'opacity-20 hover:opacity-40'}`}
                          onClick={() => setActiveStage(item.id)}
                        >
                           <span className="text-xl lg:text-4xl font-serif font-extralight text-black">{item.label}</span>
                           <span className="text-[8px] lg:text-[11px] tracking-[0.2em] lg:tracking-[0.4em] uppercase font-mono text-black/60 relative">
                              {item.sub}
                              {activeStage === item.id && <motion.div layoutId="underline" className="absolute -bottom-4 lg:-bottom-10 left-0 w-full h-[2px] lg:h-[3px] bg-trust-blue" />}
                           </span>
                        </div>
                      ))}
                   </div>

                   <div className="min-h-[4rem] lg:min-h-[5rem] flex items-center">
                      <p key={activeStage} className="text-black/60 text-base lg:text-lg font-light leading-relaxed animate-fade-in max-w-lg">
                        {[
                          activeStage === 'Founders' && "万一有一天你不在了，公司和家人怎么办？这个问题值得提前想。",
                          activeStage === 'Guardians' && "你撑起的那片天，需要一个备份。不是因为悲观，而是因为在乎。",
                          activeStage === 'Explorers' && "世界那么大，出发之前，给自己留一条确定的退路。"
                        ].filter(Boolean)}
                      </p>
                   </div>

                   <div className="flex flex-col gap-6">
                      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-0 group/input relative mt-2 bg-white rounded-2xl p-2 shadow-sm border border-black/5 transition-all hover:shadow-md hover:border-black/10">
                         <div className="flex-1 px-4 lg:px-6 py-4 flex items-center gap-4">
                            <span className="text-trust-blue text-xl font-light">/</span>
                            <input
                              type="text"
                              value={inputValue}
                              onChange={(e) => setInputValue(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && onStart()}
                              placeholder={activePlaceholder}
                              className="w-full bg-transparent border-none outline-none text-lg lg:text-xl font-light placeholder:text-black/20 text-black"
                            />
                         </div>
                         
                         <button onClick={onStart} className="flex items-center justify-center gap-3 px-6 lg:px-10 py-4 lg:py-5 rounded-xl bg-gradient-to-r from-[#E63E31] to-[#C92A1D] text-white shadow-lg shadow-red-500/20 hover:shadow-red-500/30 transition-all duration-500 group/btn hover:-translate-y-0.5 mt-4 md:mt-0">
                            <span className="text-xs lg:text-sm tracking-[0.2em] font-medium whitespace-nowrap">开始 // Let's Talk</span>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="flex-shrink-0 opacity-80 group-hover/btn:translate-x-1 transition-transform duration-300"><path d="M1 6H11M11 6L6 1M11 6L6 11" stroke="white" strokeWidth="1.5"/></svg>
                         </button>
                      </div>

                      {/* Suggestion Chips */}
                      <div className="flex gap-2 lg:gap-4 flex-wrap px-4">
                        {[
                          "刚有了第一个孩子",
                          "父母年纪大了，有点担心",
                          "创业三年，还没买过保险"
                        ].map((suggestion, i) => (
                          <div 
                            key={i} 
                            onClick={() => setInputValue(suggestion)}
                            className="px-3 lg:px-4 py-1.5 rounded-full border border-black/5 bg-black/[0.02] text-[9px] lg:text-[10px] text-black/40 hover:text-trust-blue hover:border-trust-blue/30 cursor-pointer transition-all uppercase tracking-widest"
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
        className="absolute bottom-12 left-6 lg:left-12 z-30 flex items-center gap-4 cursor-pointer pointer-events-auto"
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
        <span className="text-[9px] tracking-[0.4em] text-black/30">
          {isSoundOn ? '声景开启' : '静谧自然'}
        </span>
      </div>

      {/* Scroll Hint */}
      <div className="scroll-hint-line hidden lg:block" />


    </section>
  )
}

// 3D Components removed for static design


const Pulse = () => {
  return (
    <section id="pulse" className="relative min-h-screen bg-[#F7F8FA] flex items-center justify-center py-24 lg:py-0 overflow-hidden">
       {/* Background Noise & Grid */}
       <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.1) 1px, transparent 0)', backgroundSize: '40px 40px' }} />

       <div className="container relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
             {/* Left Column: Data Installation */}
             <div className="col-span-12 lg:col-span-5 flex flex-col justify-center">
                <span className="pulse-label whitespace-nowrap">如何运转 / 02</span>
                <h2 className="section-title text-black">
                   一份保障背后的<span className="italic text-black/20 ml-2 lg:ml-6">真实运转</span>
                </h2>
                <p className="text-xl text-black/40 font-extralight leading-loose mb-16 max-w-lg">
                   每一份方案的背后，是无数次安静的校验与核实。不追求速度的噔头，只确保你需要时，一切就位。
                </p>

                <div className="space-y-10">
                   {[
                      { label: '可用性', val: '99.98%', desc: '系统全年在线率', color: 'text-green-600' },
                      { label: '响应', val: '0.8秒', desc: '理赔平均响应时间', color: 'text-blue-600' },
                      { label: '守护中', val: '24.5 亿', desc: '累计保障资产规模', color: 'text-black' }
                   ].map((item, i) => (
                      <div key={i} className="flex items-end gap-10 group cursor-pointer whitespace-nowrap">
                         <div className="flex flex-col">
                            <span className="text-[10px] tracking-[0.4em] text-black/20 font-mono mb-2">{item.label}</span>
                            <span className={`text-4xl lg:text-6xl font-din ${item.color} leading-none transition-transform group-hover:scale-110 duration-700`}>{item.val}</span>
                         </div>
                         <div className="pb-1">
                            <p className="text-sm text-black/40 font-extralight italic whitespace-nowrap">{item.desc}</p>
                            <div className="w-12 h-px bg-black/10 mt-2 group-hover:w-24 transition-all duration-700" />
                         </div>
                      </div>
                   ))}
                </div>
             </div>

             {/* Right Column: Visualization Card */}
             <div className="col-span-12 lg:col-span-7 relative lg:mt-0 flex items-center justify-center">
                <div className="w-full relative bg-white rounded-[2rem] lg:rounded-[2.5rem] p-6 lg:p-12 overflow-hidden border border-black/5 shadow-2xl">
                   {/* Background technical grid */}
                   <div className="absolute inset-0 opacity-[0.02]" 
                        style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                   
                   <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 h-full">
                      <div className="glass-card p-8 lg:p-10 rounded-3xl flex flex-col justify-between min-h-[160px]">
                         <div className="flex justify-between items-start mb-10">
                            <div className="w-10 h-10 rounded-full bg-trust-blue shadow-[0_0_20px_rgba(0,84,166,0.3)] flex items-center justify-center text-white">
                               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                            </div>
                            <span className="text-[10px] text-black/20 font-mono">保障实例</span>
                         </div>
                         <div>
                            <span className="text-4xl lg:text-5xl font-din text-black leading-none">¥50万</span>
                            <p className="text-[11px] text-black/40 mt-4 tracking-widest whitespace-nowrap">重疾理赔到账</p>
                         </div>
                      </div>

                      <div className="glass-card p-8 lg:p-10 rounded-3xl flex flex-col justify-between min-h-[160px] bg-trust-blue text-white ring-1 ring-white/10">
                         <div className="flex justify-between items-start mb-10">
                            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            </div>
                            <span className="text-[10px] text-white/40 font-mono">平均时效</span>
                         </div>
                         <div>
                            <span className="text-4xl lg:text-5xl font-din leading-none">0.8秒</span>
                            <p className="text-[11px] text-white/40 mt-4 tracking-widest whitespace-nowrap">全球理赔速度</p>
                         </div>
                      </div>

                      {/* Full Width Info Card */}
                      <div className="col-span-1 md:col-span-2 glass-card p-6 lg:p-12 rounded-3xl border-t-2 border-trust-blue/10">
                         <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-8 mb-10">
                            <div className="flex items-center gap-4 lg:gap-6">
                               <div className="h-10 w-[2px] bg-trust-blue" />
                               <div>
                                  <h4 className="text-lg lg:text-xl font-serif text-black">你的理赔，正在被认真对待</h4>
                                  <p className="text-[10px] lg:text-[11px] text-black/30 font-mono tracking-widest mt-1">从提交到到账，全程透明</p>
                               </div>
                            </div>
                            <div className="flex -space-x-3">
                               {[1,2,3].map(i => (
                                 <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 overflow-hidden shadow-lg ring-1 ring-black/5">
                                    <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-400" />
                                 </div>
                               ))}
                               <div className="w-10 h-10 rounded-full border-2 border-white bg-black flex items-center justify-center text-[10px] text-white font-mono shadow-lg">
                                 +124
                               </div>
                            </div>
                         </div>
                         
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-black/5">
                            {[
                               { label: '核验中', city: '香港' },
                               { label: '清算中', city: '伦敦' },
                               { label: '结算中', city: '新加坡' },
                               { label: '已完成', city: '东京' }
                            ].map((log, idx) => (
                               <div key={idx} className="flex flex-col gap-1 whitespace-nowrap">
                                  <span className="text-[9px] text-black/20 font-mono uppercase tracking-[0.2em]">{log.label}</span>
                                  <div className="flex items-center gap-2">
                                     <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                     <span className="text-[11px] text-black/60 font-medium">{log.city}</span>
                                  </div>
                               </div>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </section>
  )
}

const Product = ({ onStart }: { onStart: () => void }) => {
  return (
    <section id="product" className="relative min-h-screen bg-white flex items-center justify-center py-24 lg:py-32 overflow-hidden">
       {/* Background decorative elements */}
       <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_10%_10%,rgba(0,84,166,0.03)_0%,transparent_50%)]" />

       <div className="container z-10 w-full">
          <div className="mb-20 lg:mb-40">
             <div className="flex flex-col items-center text-center">
                <span className="pulse-label">生命架构 / 04</span>
                <h2 className="section-title text-black">
                   你的人生，也需要一个结构<br />
                   <span className="text-black/10 italic text-4xl md:text-[6rem]">Life Architecture</span>
                </h2>
             </div>
          </div>
          
          {/* Static Blueprint Card - Replacing 3D Canvas */}
          <div className="relative w-full max-w-7xl mx-auto min-h-[1000px] lg:min-h-[1100px] border border-black/10 bg-[#F9FAFB] rounded-[3rem] lg:rounded-[4rem] overflow-hidden shadow-2xl transition-all duration-1000 group flex flex-col">
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
             
             {/* Realistic Blueprint Image - Full Edge-to-Edge Cover */}
             <div className="absolute inset-0 z-10 pointer-events-none">
                  <img 
                    src="./blueprint_house.png" 
                    alt="Architectural Blueprint" 
                    className="w-full h-full object-cover opacity-30 lg:opacity-50 mix-blend-multiply filter contrast-[1.1] brightness-[0.98] transition-transform duration-[2s] group-hover:scale-110"
                  />
             </div>

             {/* Content Overlay */}
             <div className="relative z-30 flex-1 flex flex-col justify-between p-8 lg:p-16">
                <div className="absolute top-8 left-8 lg:top-16 lg:left-16 pointer-events-none">
                   <div className="flex gap-4 lg:gap-6 items-center">
                      <div className="w-2 h-2 lg:w-3 lg:h-3 rounded-full bg-trust-blue animate-pulse" />
                      <div className="flex flex-col">
                        <span className="text-[10px] lg:text-[12px] font-mono text-trust-blue tracking-[0.4em] font-bold">结构总览</span>
                        <span className="text-[8px] lg:text-[9px] font-mono text-black/20 tracking-widest mt-1">每一层都有它的意义</span>
                      </div>
                   </div>
                </div>
                <div className="absolute top-8 right-8 lg:top-16 lg:right-16 text-right hidden md:block">
                   <h3 className="text-3xl lg:text-4xl font-serif text-black mb-2">稳稳的，一层一层</h3>
                   <p className="text-[10px] lg:text-[12px] text-black/40 tracking-[0.6em]">从地基到屋顶</p>
                </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 pointer-events-auto w-full mt-auto relative z-40 mb-6 lg:mb-12">
                   {[
                      { title: '地基', cn: '地基', desc: '先把最基本的医疗保障做扎实。240+ 家全球医疗机构，确保关键时刻有地方可去。' },
                      { title: '支柱', cn: '支柱', desc: '如果有一天你不在了，家人的生活不会塩。足够的保额，是沉默的承诺。' },
                      { title: '屋顶', cn: '屋顶', desc: '财富传给下一代，少绕弯路。合理的规划，让时间成为朋友而非敌人。' }
                   ].map((item, i) => (
                      <div key={i} className="group/item cursor-pointer bg-white/95 backdrop-blur-2xl p-8 lg:p-10 rounded-[2.5rem] border border-black/5 shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] hover:-translate-y-3 transition-all duration-700">
                         <div className="w-10 h-[3px] bg-trust-blue mb-6 lg:mb-8 group-hover/item:w-16 transition-all duration-700" />
                         <h4 className="text-2xl lg:text-3xl font-serif text-black mb-2">{item.cn}</h4>
                         <p className="text-[10px] lg:text-[11px] text-trust-blue/40 uppercase tracking-[0.4em] mb-6 font-mono">{item.title}</p>
                         <p className="text-sm lg:text-base text-black/40 leading-relaxed font-extralight">{item.desc}</p>
                      </div>
                   ))}
                </div>

                 <div className="flex flex-col md:flex-row justify-between items-center border-t border-black/5 pt-12 lg:pt-16 pointer-events-auto gap-8 lg:gap-0 mt-8">
                   <div className="flex gap-16 lg:gap-24 w-full lg:w-auto justify-between lg:justify-start">
                      <div className="flex flex-col">
                         <span className="text-4xl lg:text-5xl font-din text-black leading-none mb-3">99.9%</span>
                         <span className="text-[10px] lg:text-[12px] text-black/30 tracking-[0.4em]">安全评级</span>
                      </div>
                      <div className="flex flex-col">
                         <span className="text-4xl lg:text-5xl font-din text-black leading-none mb-3">AAA</span>
                         <span className="text-[10px] lg:text-[12px] text-black/30 tracking-[0.4em]">信用等级</span>
                      </div>
                   </div>
                   <button onClick={onStart} className="cta-vermilion w-full md:w-auto text-center py-7 px-16">
                      了解完整方案
                   </button>
                </div>
             </div>
          </div>

          <div className="mt-20 text-center flex flex-col items-center gap-6">
             <div className="w-1 h-20 bg-gradient-to-b from-blue-600/20 to-transparent" />
             <span className="text-[10px] lg:text-[12px] text-black/40 tracking-[0.6em] mb-4">
                每一层都经得起检验
             </span>
          </div>
       </div>
    </section>
  )
}

const Ecosystem = () => {
  return (
    <section id="ecosystem" className="relative bg-[#FBFBFD] py-24 lg:py-48 overflow-hidden">
       {/* Background structural lines */}
       <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
          <div className="blueprint-hud-line w-full top-1/2" />
          <div className="blueprint-hud-line h-full left-1/2 w-[1px]" />
       </div>

       <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-20 mb-20 lg:mb-32">
             <div className="col-span-12 lg:col-span-6">
                <span className="pulse-label">持续在守护的事 / 05</span>
                <h2 className="section-title text-black mb-0">
                   持续在<span className="italic text-black/20 ml-6">守护的事</span>
                </h2>
             </div>
             <div className="col-span-12 lg:col-span-5 lg:col-start-8 flex items-end">
                <p className="text-lg lg:text-xl text-black/40 font-extralight leading-loose">
                   保险不应该只在出事时才被想起。我们一直在做的，是让你在需要之前，就已经被照顾到。
                </p>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-16">
             {[
                { 
                  title: '风险预警',
                  en: 'Early Warning',
                  desc: '在风险到来之前收到提醒。不是制造恐惧，而是给你多一点准备的时间。',
                  icon: <div className="radar-scanner"><div className="radar-line" /></div>
                },
                { 
                  title: '全球医疗',
                  en: 'Global Care',
                  desc: '需要帮助时，不论你在哪里，都能找到最好的医生。我们已经和全球顶尖医疗机构连好了线。',
                  icon: <div className="w-24 h-24 rounded-full bg-trust-blue/5 border border-trust-blue/10 flex items-center justify-center text-trust-blue">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                  </div>
                },
                { 
                  title: '理赔到账',
                  en: 'Claims Done Right',
                  desc: '理赔不应该是一场战斗。从提交到到账，简单、透明、不拖延。',
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
    <section id="manifesto" className="min-h-screen bg-white flex flex-col items-center justify-center relative overflow-hidden py-24 lg:py-40">
       <div className="container text-center z-10">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="space-y-8 lg:space-y-12"
          >
              <p className="text-gold text-[10px] lg:text-sm tracking-[0.8em] lg:tracking-[1.2em] font-bold mb-8">我们相信的</p>
              <h2 className="text-3xl md:text-5xl lg:text-7xl font-serif max-w-6xl mx-auto leading-tight italic text-black font-medium">
                “于不确定中，建构<b>确定</b>。<br />
                保险不是恐惧的产物，是清醒的<b>选择</b>。”
              </h2>
              <p className="text-black/60 text-base lg:text-lg tracking-[0.1em] max-w-3xl mx-auto font-light leading-loose mt-8 lg:mt-16">
                 你不知道未来会发生什么，但你可以决定，<br />
                 当那一天来临时，你在乎的人不会手足无措。
              </p>
          </motion.div>
       </div>
       <div className="absolute bottom-0 w-full select-none pointer-events-none opacity-[0.05]">
          <h2 className="outline-text text-center tracking-tighter text-black text-[clamp(4rem,15vw,20rem)]">确定性</h2>
       </div>
    </section>
  )
}

const Footer = () => {
  return (
    <footer className="bg-white py-24 lg:py-48 border-t border-black/5 relative overflow-hidden">
       {/* Background Noise & Grid */}
       <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.1) 1px, transparent 0)', backgroundSize: '40px 40px' }} />

       <div className="container relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-20 mb-24 lg:mb-40">
             <div className="col-span-1 lg:col-span-4 space-y-8 lg:space-y-12 text-center lg:text-left flex flex-col items-center lg:items-start">
                <VariableLogo />
                <p className="text-[14px] text-black/60 leading-loose max-w-[340px] font-light italic">
                   “于不确定中，建构生命的厚度。”<br />
                   我们不卖恐惧，也不贩卖焦虑。我们只是帮你把在乎的东西，安放在一个更确定的地方。
                </p>
                <div className="pt-4 lg:pt-8 flex gap-4 lg:gap-6 grayscale opacity-20 hover:opacity-100 transition-opacity">
                   {/* Abstract partner logo symbols */}
                   {[1,2,3,4].map(i => (
                     <div key={i} className="w-10 h-10 lg:w-12 lg:h-12 border border-black/10 rounded flex items-center justify-center font-mono text-[8px] text-black">节点_{i}</div>
                   ))}
                </div>
             </div>

             <div className="grid grid-cols-2 gap-8 col-span-1 lg:col-span-4 lg:col-start-6">
               <div className="space-y-8 lg:space-y-10">
                  <span className="text-gold text-[10px] tracking-[0.4em] opacity-40">保障类目</span>
                  <div className="flex flex-col gap-4 lg:gap-5 text-[14px]">
                     {['健康', '人寿', '财富', '出行'].map(link => (
                       <a key={link} href="#" className="text-black/40 hover:text-black transition-colors tracking-widest">{link}</a>
                     ))}
                  </div>
               </div>

               <div className="space-y-8 lg:space-y-10">
                  <span className="text-gold text-[10px] tracking-[0.4em] opacity-40">智识中枢</span>
                  <div className="flex flex-col gap-4 lg:gap-5 text-[14px]">
                     {['风险预警', '理赔标准', '全球网络', '了解更多'].map(link => (
                       <a key={link} href="#" className="text-black/40 hover:text-black transition-colors tracking-widest">{link}</a>
                     ))}
                  </div>
               </div>
             </div>

             <div className="col-span-1 md:col-span-2 lg:col-span-4 space-y-8 lg:space-y-10">
                <span className="text-gold text-[10px] tracking-[0.4em] opacity-40">运行状态</span>
                <div className="p-6 lg:p-8 rounded-xl bg-black/[0.02] border border-black/5 space-y-6">
                   <div className="flex justify-between items-center text-[10px] lg:text-[11px] font-mono">
                      <span className="text-black/40">系统可用性</span>
                      <span className="text-green-600">99.98% 可用</span>
                   </div>
                   <div className="w-full h-1 bg-black/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '99.98%' }}
                        transition={{ duration: 2 }}
                        className="h-full bg-green-500 shadow-[0_0_10px_#22c55e]"
                      />
                   </div>
                   <p className="text-[9px] lg:text-[10px] text-black/20 italic leading-relaxed">
                      * 当前已接入 124 个全球承保节点，系统时延 1.2s，全年无间断运行。
                   </p>
                </div>
             </div>
          </div>

          <div className="pt-12 lg:pt-24 border-t border-black/5 flex flex-col lg:flex-row justify-between items-center gap-8 lg:gap-12 text-center lg:text-left">
             <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-10">
                <span className="text-[9px] text-black/20 tracking-[0.4em] lg:tracking-[0.8em]">为确定而建 / 2026</span>
                <div className="hidden lg:block w-12 h-px bg-black/10" />
                <span className="text-[9px] text-black/20 tracking-[0.4em] lg:tracking-[0.8em] italic font-serif">静谧版</span>
             </div>
             
             <p className="text-[9px] lg:text-[10px] text-black/20 tracking-[0.1em] lg:tracking-[0.2em] font-light">
                © 2026 保险. 于不确定中，建构确定。
             </p>

             <div className="flex gap-8 lg:gap-10">
                {['微信', 'LinkedIn', '联系我们'].map(social => (
                  <span key={social} className="text-[9px] lg:text-[10px] text-black/20 hover:text-gold cursor-pointer transition-colors tracking-widest">{social}</span>
                ))}
             </div>
          </div>
       </div>
    </footer>
  )
}

export default function App() {
  const [activeStage, setActiveStage] = useState('Founders')
  const [view, setView] = useState<'brand' | 'dialogue'>(() => {
    const p = new URLSearchParams(location.search).get('p')
    return p && decodeProfile(p) ? 'dialogue' : 'brand'
  })

  const initialProfile = (() => {
    const p = new URLSearchParams(location.search).get('p')
    return p ? decodeProfile(p) ?? undefined : undefined
  })()

  return (
    <AnimatePresence mode="wait">
      {view === 'dialogue' ? (
        <motion.div
          key="dialogue"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <DialogueFlow initialProfile={initialProfile} onExit={() => setView('brand')} />
        </motion.div>
      ) : (
        <motion.div
          key="brand"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#F7F8FA] selection:bg-gold selection:text-black"
        >
          <Header onStart={() => setView('dialogue')} />

          <Hero activeStage={activeStage} setActiveStage={setActiveStage} onStart={() => setView('dialogue')} />
          <Pulse />
          <Product onStart={() => setView('dialogue')} />
          <Ecosystem />
          <Manifesto />
          <Footer />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
