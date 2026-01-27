import React, { useState, useEffect, useRef } from 'react'
import { motion, useScroll, AnimatePresence } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial, OrbitControls, Html } from '@react-three/drei'
import * as THREE from 'three'

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

const generatePoints = (count: number) => {
  const p = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const r = 2
    const theta = 2 * Math.PI * Math.random()
    const phi = Math.acos(2 * Math.random() - 1)
    p[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    p[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    p[i * 3 + 2] = r * Math.cos(phi)
  }
  return p
}

const GLOBAL_POINTS = generatePoints(12000)

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
            <div className="hidden lg:flex relative bg-black items-center justify-center overflow-hidden">
               <motion.img 
                 initial={{ scale: 1.2, opacity: 0 }}
                 animate={{ scale: 1, opacity: 0.4 }}
                 src="/data_sphere.png" 
                 alt="Art" 
                 className="absolute inset-0 w-full h-full object-cover grayscale" 
               />
               <div className="relative z-10 p-24 text-center">
                  <h3 className="text-3xl font-serif italic mb-6">“您现在最担心什么？”</h3>
                  <p className="text-white/40 text-sm tracking-widest max-w-sm mx-auto uppercase">
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
               <div className="hidden lg:flex items-center gap-3 px-5 py-2.5 bg-black/[0.03] rounded-full border border-black/5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                  <span className="text-[9px] text-black font-mono tracking-[0.2em] uppercase">GSN_NODE // 95511_ACTIVE</span>
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
  const [placeholder, setPlaceholder] = useState("您最想守护的是？")
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
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-screen"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-rain-drops-on-a-window-pane-1418-large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(212,175,55,0.08),transparent_50%)] z-10" />
      </div>

      <div className="relative z-20 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-10 mb-20 opacity-60">
            <div className="w-24 h-[1px] bg-gold" />
            <span className="text-xs tracking-[1em] uppercase font-bold">Standard of Protection</span>
          </div>
          
          <h1 className="hero-headline mb-12">
            于不确定中，<br />
            <span className="italic text-black/40 font-extralight tracking-tight">建构生命的厚度。</span>
          </h1>
          
          <p className="hero-subline mb-24 max-w-2xl leading-relaxed text-black/70 text-lg font-light">
             {activeStage === 'Founders' && "保护财富与梦想。在全球波动中，为您的事业提供稳健的底层保障。"}
             {activeStage === 'Guardians' && "全家人的护盾。将爱转化为实实在在的保障，守护每个幸福瞬间。"}
             {activeStage === 'Explorers' && "探索世界的安全冗余。在未知的旅途中，为您提供 24 小时贴身响应。"}
          </p>
          
          <div className="max-w-2xl flex flex-col gap-12">
            {/* Round 2: Life-Stage Navigator */}
             <div className="flex gap-10 border-b border-black/5 pb-6">
                {['Founders', 'Guardians', 'Explorers'].map(stage => (
                  <div 
                    key={stage}
                    className={`text-[12px] uppercase tracking-[0.5em] pb-3 cursor-pointer transition-all font-bold ${activeStage === stage ? 'text-black border-b-2 border-black' : 'text-black/50 hover:text-black/80'}`}
                    onClick={() => setActiveStage(stage)}
                  >
                     {stage}
                  </div>
                ))}
             </div>

            <div className="flex items-center gap-8 group relative">
              {/* Round 3: Commitment Stamp */}
              <div className="commitment-stamp">
                 <span className="scale-75 uppercase text-center block leading-tight">Pro<br/>Value</span>
              </div>
              
              <div className="relative flex-1">
                <Magnetic strength={0.05}>
                  <input 
                    type="text" 
                    placeholder={placeholder}
                    className="w-full bg-transparent border-none outline-none text-2xl font-light py-8 search-input placeholder:text-black/60 text-black"
                  />
                  <div className="search-line bg-black" />
                </Magnetic>
              </div>
              <Magnetic strength={0.2}>
                 <button className="cta-vermilion">立即调取方案</button>
              </Magnetic>
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

      {/* Agent Card: Relocated for better balance */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2, duration: 1.5 }}
        className="absolute bottom-16 right-16 z-30 flex items-center gap-6 glass-card rounded-2xl border-gold/10 group cursor-default"
      >
        <div className="relative">
          <div className="w-14 h-14 rounded-full overflow-hidden border border-gold/20 p-1">
            <img src="/agent_profile.png" alt="Consultant" className="w-full h-full rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
          </div>
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-black animate-pulse" />
        </div>
        <div className="flex flex-col pr-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[8px] text-gold tracking-widest uppercase font-bold">Secure Node</span>
            <div className="w-1 h-1 bg-gold/50 rounded-full" />
            <span className="text-[8px] text-black/20">AGENT_02</span>
          </div>
          <span className="text-md font-serif text-black">高级风险官 · 陈先生</span>
        </div>
      </motion.div>
    </section>
  )
}

function ParticleSphere({ mode = 'default' }: { mode?: string }) {
  const ref = useRef<THREE.Points>(null!)
  const { scrollYProgress } = useScroll()
  const [converged, setConverged] = useState(0)
  
  // Scrollytelling convergence logic
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      // Converge between scroll 0.2 and 0.4
      const progress = Math.min(Math.max((latest - 0.2) * 5, 0), 1)
      setConverged(progress)
    })
    return () => unsubscribe()
  }, [scrollYProgress])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    const rotationSpeed = mode === 'speed' ? 0.4 : 0.05
    ref.current.rotation.y = t * rotationSpeed
    ref.current.rotation.x = t * (rotationSpeed/2)
    
    // Convergence math: blend between random dispersed and sphere
    const positions = ref.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < GLOBAL_POINTS.length; i++) {
       const spherePos = GLOBAL_POINTS[i]
       const dispersedPos = (i % 3 === 0 ? Math.sin(i) : Math.cos(i)) * 5
       positions[i] = THREE.MathUtils.lerp(dispersedPos, spherePos, converged)
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  const getColor = () => {
    if (mode === 'capital') return '#D4AF37' // Gold (inverted from deep blue)
    if (mode === 'speed') return '#404040' // Darker Silver (inverted from light silver)
    if (mode === 'risk') return '#1A3A5F' // Deep Blue (inverted from gold)
    return '#D4AF37' // Default gold
  }

  return (
    <Points ref={ref} positions={GLOBAL_POINTS.slice()} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={getColor()}
        size={mode === 'risk' ? 0.008 : 0.005}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={converged * 0.6}
      />
    </Points>
  )
}

const Pulse = () => {
  const [activeMode, setActiveMode] = useState('default')
  
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
                     onMouseEnter={() => setActiveMode(stat.id)}
                     onMouseLeave={() => setActiveMode('default')}
                     className="flex flex-col group cursor-pointer border-l-2 border-transparent hover:border-gold pl-8 transition-all duration-700"
                   >
                      <div className="flex items-center gap-3">
                         <span className="pulse-label opacity-60">PROTOCOL_0{i+1} // {stat.label}</span>
                         {(stat as any).jade && <span className="jade-accent">● LIVE_GROWTH</span>}
                      </div>
                      <div className="flex items-baseline mt-4 mb-2">
                         <span className="pulse-number font-din text-black">{stat.val}</span>
                         <span className="pulse-unit font-din text-black">{stat.unit}</span>
                      </div>
                      <p className="pulse-desc text-black/60 text-lg font-light leading-relaxed">{stat.desc}</p>
                   </motion.div>
                 ))}
              </div>

              {/* Right: The Data Installation */}
              <div className="col-span-12 lg:col-span-7 h-[1000px] relative mt-20 lg:mt-0">
                <Canvas camera={{ position: [0, 0, 5], fov: 35 }}>
                  <color attach="background" args={['#F7F8FA']} />
                  <ambientLight intensity={0.5} />
                  <ParticleSphere mode={activeMode} />
                  <OrbitControls enableZoom={false} autoRotate={activeMode === 'default'} autoRotateSpeed={0.5} />
                </Canvas>
                
                {/* Claims Feed Overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  <AnimatePresence>
                    {[
                      { t: '10:42:03 AM', loc: '广东·深圳', type: '重疾理赔', amt: '¥500,000', pos: { top: '30%', left: '60%' } },
                      { t: '11:15:20 AM', loc: '上海·浦东', type: '医疗报销', amt: '¥12,400', pos: { top: '55%', left: '75%' } },
                      { t: '01:05:44 PM', loc: '北京·朝阳', type: '意外补偿', amt: '¥200,000', pos: { top: '20%', left: '45%' } }
                    ].map((feed, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 0.9] }}
                        transition={{ duration: 6, repeat: Infinity, delay: i * 2 }}
                        className="claim-feed"
                        style={feed.pos}
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-[1px] h-12 bg-black/20" />
                          <div>
                            <p className="text-[9px] text-black/60 font-mono mb-1">{feed.t} | {feed.loc}</p>
                            <p className="text-xs text-black font-medium">{feed.type} <span className="text-gold ml-2">{feed.amt}</span></p>
                            <p className="text-[8px] text-green-600 uppercase tracking-tighter mt-1">Status: Execution Confirmed</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
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
                          <div className={`w-1.5 h-1.5 rounded-full ${log.status === 'VERIFIED' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-gold animate-pulse'}`} />
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

function WireframeHouse() {
  const [hovered, setHovered] = useState<string | null>(null)
  
  return (
    <group rotation={[0.4, -0.4, 0]}>
      {/* Foundation - The Body is a Temple */}
      <mesh onPointerOver={() => setHovered('foundation')} onPointerOut={() => setHovered(null)}>
        <boxGeometry args={[4.2, 0.4, 4.2]} />
        <meshBasicMaterial 
          wireframe 
          transparent 
          opacity={hovered === 'foundation' ? 0.9 : 0.2} 
          color={hovered === 'foundation' ? '#D4AF37' : '#FFFFFF'} 
        />
      </mesh>
      
      {/* Pillars - Love is Weight */}
      <group onPointerOver={() => setHovered('pillars')} onPointerOut={() => setHovered(null)}>
        {[-1.8, 1.8].map((x, i) => 
          [-1.8, 1.8].map((z, j) => (
            <mesh key={`${i}-${j}`} position={[x, 1.6, z]}>
              <boxGeometry args={[0.15, 3.2, 0.15]} />
              <meshBasicMaterial 
                transparent 
                opacity={hovered === 'pillars' ? 0.9 : 0.3} 
                color={hovered === 'pillars' ? '#D4AF37' : '#FFFFFF'} 
              />
            </mesh>
          ))
        )}
        <mesh position={[0, 3.2, 0]}>
          <boxGeometry args={[4, 0.1, 4]} />
          <meshBasicMaterial transparent opacity={0.2} color="white" />
        </mesh>
      </group>

      {/* Roof/Glass - Friend of Time */}
      <mesh position={[0, 4.2, 0]} onPointerOver={() => setHovered('expansion')} onPointerOut={() => setHovered(null)}>
        <boxGeometry args={[4.5, 1, 4.5]} />
        <meshBasicMaterial 
          wireframe 
          transparent 
          opacity={hovered === 'expansion' ? 0.8 : 0.1} 
          color={hovered === 'expansion' ? '#D4AF37' : '#FFFFFF'} 
        />
      </mesh>

      {hovered && (
        <Html position={[0, 6, 0]} center>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 10 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            className="blueprint-card min-w-[340px]"
          >
            <div className="flex justify-between items-start mb-6">
              <span className="text-gold text-[8px] tracking-[0.5em] uppercase">Structural Analysis</span>
              <span className="text-black/30 font-mono text-[8px]">REF_SYS_4.0</span>
            </div>
            
             <div className="space-y-4">
               <div>
                  <h4 className="text-black text-3xl font-serif mb-2 font-extralight">
                    {hovered === 'foundation' && "肉身是圣殿"}
                    {hovered === 'pillars' && "爱是责任的重量"}
                    {hovered === 'expansion' && "时间的朋友"}
                  </h4>
                  <p className="text-gold/60 text-[10px] tracking-[0.4em] uppercase">
                    {hovered === 'foundation' && "The Body is a Temple | 全球医疗系列"}
                    {hovered === 'pillars' && "Love is Weight | 寿险与责任保障"}
                    {hovered === 'expansion' && "Friend of Time | 财富传承架构"}
                  </p>
               </div>
               
               <p className="text-[11px] text-black/60 leading-relaxed italic">
                 {hovered === 'foundation' && "“在财富积累之前，先确保地基不会因病塌陷。”"}
                 {hovered === 'pillars' && "“当支柱不在场时，确保屋顶依然为家人遮风挡雨。”"}
                 {hovered === 'expansion' && "“让现在的盈余，流向未来的匮乏。”"}
               </p>
            </div>

            <div className="mt-8 pt-6 border-t border-black/10 flex flex-col gap-4">
               <button className="ghost-button w-full">查看结构图纸 / View Blueprint</button>
               <div className="flex justify-between items-center px-1">
                  <span className="text-[8px] text-black/30 uppercase">Safety Rating: 99.9%</span>
                  <div className="flex gap-1">
                    {[1,2,3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-gold/40" />)}
                  </div>
               </div>
            </div>
          </motion.div>
        </Html>
      )}
    </group>
  )
}

const Product = () => {
  return (
    <section id="product" className="relative min-h-screen bg-white flex flex-col items-center justify-center py-[spacing-section]">
       <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
          <div className="w-full h-full bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0%,transparent_70%)]" />
       </div>

       <div className="container mx-auto px-12 md:px-24 z-10">
          <div className="asymmetric-layout mb-32">
             <div className="col-span-12 lg:col-span-8 lg:col-start-3 text-center">
                <span className="text-gold text-xs tracking-[1.5em] uppercase block mb-10 opacity-60">System Architecture / 04</span>
                <h2 className="text-7xl md:text-8xl font-extralight tracking-tighter leading-none text-black">
                   生命建筑系统<br />
                   <span className="text-black/20 italic text-5xl md:text-7xl">Architecture HUD</span>
                </h2>
             </div>
          </div>
          
          <div className="relative w-full h-[800px] blueprint-card p-0 overflow-hidden group">
             <div className="absolute top-10 left-10 z-20 flex gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[9px] font-mono text-black/30 uppercase tracking-widest">REAL-TIME_MODELING</span>
             </div>
             <Canvas camera={{ position: [0, 5, 14], fov: 35 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={2} />
                <WireframeHouse />
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.3} />
             </Canvas>
             <div className="absolute bottom-10 right-10 z-20">
                <span className="text-[10px] font-mono text-black/30 uppercase tracking-widest">[ DRAG_TO_INSPECT_STRUCTURE ]</span>
             </div>
          </div>

          <div className="mt-20 text-center flex flex-col items-center gap-6">
             <div className="w-1 h-20 bg-gradient-to-b from-gold/40 to-transparent" />
             <span className="text-[12px] text-black/40 tracking-[0.6em] uppercase font-mono mb-4 text-glow">
                STRUCTURAL_INTEGRITY_VERIFIED_99.9%
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
