import React, { useState, useEffect } from 'react';
import { VideoMetadata, GeminiAnalysis, Platform } from './types';
import { generateContentMetadata } from './services/geminiService';
import { fetchVideoMetadata } from './services/videoService';
import Button from './components/Button';
import ResultCard from './components/ResultCard';
import PlatformIcon from './components/PlatformIcon';
import { AboutPage, ContactPage, BlogPage, TermsPage, PrivacyPage } from './components/Pages';
import { Link2, ShieldCheck, Zap, Layers, Smartphone, Globe, AlertCircle, Menu, X, ArrowUp, Heart, Star, Check } from 'lucide-react';

type PageView = 'home' | 'about' | 'contact' | 'blog' | 'terms' | 'privacy';

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [result, setResult] = useState<{ metadata: VideoMetadata; gemini: GeminiAnalysis | null } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Platform>(Platform.TikTok);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Scroll to top listener
  useEffect(() => {
    const checkScroll = () => {
      if (window.scrollY > 300) setShowScrollTop(true);
      else setShowScrollTop(false);
    };
    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  // Reset scroll on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
  }, [currentPage]);

  const platforms = [
    { id: Platform.TikTok, name: 'TikTok' },
    { id: Platform.Instagram, name: 'Instagram' },
    { id: Platform.Facebook, name: 'Facebook' },
    { id: Platform.YouTube, name: 'YouTube' },
  ];

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const metadata = await fetchVideoMetadata(url);
      setActiveTab(metadata.platform);

      let geminiData: GeminiAnalysis | null = null;
      try {
          geminiData = await generateContentMetadata(metadata.platform, url);
      } catch (err) {
          console.warn("Gemini analysis failed, skipping...", err);
      }

      setResult({ metadata, gemini: geminiData });

    } catch (err: any) {
      setError(err.message || "Failed to process the link. Please check the URL and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateAI = async () => {
    if (!result) return;
    setIsRegenerating(true);
    try {
        const newGeminiData = await generateContentMetadata(result.metadata.platform, url || result.metadata.originalUrl);
        setResult(prev => prev ? { ...prev, gemini: newGeminiData } : null);
    } catch (err) {
        console.error("Failed to regenerate AI content", err);
    } finally {
        setIsRegenerating(false);
    }
  };

  const NavLink = ({ page, label }: { page: PageView, label: string }) => (
    <button 
      onClick={() => setCurrentPage(page)}
      className={`text-sm font-bold transition-all duration-300 px-4 py-2 rounded-lg relative overflow-hidden group ${
        currentPage === page 
          ? 'text-white bg-[#222]' 
          : 'text-zinc-400 hover:text-white hover:bg-[#111]'
      }`}
    >
      <span className="relative z-10">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col font-sans bg-black">
      
      {/* Navbar */}
      <nav className="border-b border-[#222] bg-black sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <button onClick={() => setCurrentPage('home')} className="flex items-center gap-2 group">
              <div className="bg-white text-black p-2 rounded-lg transform group-hover:rotate-12 transition-transform duration-300">
                <Link2 className="w-5 h-5" />
              </div>
              <div className="flex flex-col items-start">
                  <span className="text-xl font-black tracking-tighter text-white leading-none">
                    CLIPFORGE
                  </span>
              </div>
            </button>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-1">
              <NavLink page="home" label="Tools" />
              <NavLink page="about" label="About" />
              <NavLink page="blog" label="Blog" />
              <NavLink page="contact" label="Contact" />
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white p-2 border border-[#333] rounded-lg">
                {mobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#222] bg-black px-4 py-6 space-y-4 absolute w-full z-50 border-b shadow-2xl">
             <NavLink page="home" label="Tools" />
             <div className="h-px bg-[#222]"></div>
             <NavLink page="about" label="About Us" />
             <NavLink page="blog" label="Blog" />
             <NavLink page="contact" label="Contact" />
          </div>
        )}
      </nav>

      <main className="flex-grow relative">
        {currentPage === 'home' && (
          <>
            {/* Hero Section */}
            <section className="relative pt-24 pb-32 overflow-hidden">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up relative z-10">
                
                {/* Version Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111] border border-[#222] text-zinc-300 text-xs font-bold mb-10 hover:border-white/20 transition-colors cursor-default">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span>System Operational</span>
                </div>
                
                {/* 3D Animated Spectrum Title */}
                <div className="relative mb-12 perspective-1000">
                  {/* Background Blob */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 blur-[90px] opacity-30 animate-spectrum -z-10 rounded-full mix-blend-screen pointer-events-none"></div>
                  
                  {/* 3D Floating Text */}
                  <div className="animate-float-3d transform-style-3d">
                    <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-white drop-shadow-[0_15px_15px_rgba(0,0,0,0.5)] leading-[0.85] select-none">
                      UNIVERSAL
                    </h1>
                    <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 animate-spectrum drop-shadow-[0_15px_15px_rgba(120,40,200,0.3)] leading-[0.85] select-none relative">
                      DOWNLOADER
                    </h1>
                  </div>
                </div>

                <p className="text-lg md:text-xl text-zinc-500 mb-12 max-w-2xl mx-auto font-medium">
                  The ultimate tool to save TikTok, Instagram, Facebook, and YouTube content. 
                  <span className="text-white"> Clean, fast, and watermark-free.</span>
                </p>

                {/* Social Proof Section */}
                <div className="flex flex-col items-center justify-center mb-12 animate-fade-in-up">
                    <div className="flex -space-x-4 mb-3">
                        <img className="w-10 h-10 rounded-full border-2 border-black" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="User" />
                        <img className="w-10 h-10 rounded-full border-2 border-black" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80" alt="User" />
                        <img className="w-10 h-10 rounded-full border-2 border-black" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="User" />
                        <img className="w-10 h-10 rounded-full border-2 border-black" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="User" />
                        <div className="w-10 h-10 rounded-full border-2 border-black bg-[#222] text-white flex items-center justify-center text-xs font-bold">
                            +250k
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-400 text-sm font-medium">
                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        <span className="text-white ml-1">Trusted by 250,000+ Creators</span>
                    </div>
                </div>

                {/* Solid Toggle Switch */}
                <div className="flex justify-center mb-8">
                   <div className="bg-[#0f0f0f] p-1 rounded-xl border border-[#222] inline-flex relative">
                      {platforms.map((p) => {
                         const isActive = activeTab === p.id;
                         return (
                          <button
                            key={p.id}
                            onClick={() => setActiveTab(p.id)}
                            className={`relative px-4 py-2 rounded-lg transition-all duration-300 font-bold flex items-center gap-2 overflow-hidden outline-none ${isActive ? 'bg-[#222] text-white shadow-sm ring-1 ring-white/10' : 'text-zinc-500 hover:text-zinc-300 hover:bg-[#191919]'}`}
                          >
                             <div className="relative z-10 flex items-center gap-2">
                                <PlatformIcon platform={p.id} className={`w-4 h-4 transition-transform duration-300`} />
                                <span className="text-sm">{p.name}</span>
                             </div>
                          </button>
                         )
                      })}
                   </div>
                </div>

                {/* Input Area */}
                <div className="max-w-3xl mx-auto relative group z-10">
                  <form onSubmit={handleDownload} className="relative flex items-center bg-[#09090b] rounded-xl p-2 shadow-2xl border border-[#27272a] focus-within:border-white/20 transition-colors">
                    <div className="pl-4 text-zinc-500">
                      <Link2 className="w-5 h-5" />
                    </div>
                    <input 
                      type="text" 
                      placeholder={`Paste ${activeTab} link here...`}
                      className="w-full bg-transparent border-none text-white px-4 py-4 focus:outline-none focus:ring-0 placeholder:text-zinc-600 text-lg font-bold"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                    />
                    <Button 
                      size="lg" 
                      className="rounded-lg px-8 shadow-none"
                      isLoading={isLoading}
                      variant="primary"
                    >
                      {isLoading ? 'Processing' : 'Download'}
                    </Button>
                  </form>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mt-8 flex items-center justify-center gap-3 text-red-400 bg-red-950/20 py-3 px-6 rounded-lg inline-block border border-red-900/50 animate-fade-in-up">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-bold text-sm">{error}</span>
                  </div>
                )}

                {/* Result Section */}
                {result && (
                  <div className="mt-24">
                     <ResultCard 
                        metadata={result.metadata} 
                        geminiData={result.gemini}
                        onClose={() => { setResult(null); setUrl(''); }}
                        onRegenerate={handleRegenerateAI}
                        isRegenerating={isRegenerating}
                     />
                  </div>
                )}
              </div>
            </section>

            {/* Features Section */}
            <section className="py-32 relative bg-black">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                  <h2 className="text-4xl md:text-5xl font-black mb-6 text-white tracking-tight">ENGINEERED FOR SPEED</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <FeatureCard 
                    icon={<Layers className="w-6 h-6 text-white" />}
                    title="Watermark Free"
                    description="Clean output without logos."
                  />
                  <FeatureCard 
                    icon={<Zap className="w-6 h-6 text-white" />}
                    title="Lightning Fast"
                    description="Processed in milliseconds."
                  />
                  <FeatureCard 
                    icon={<ShieldCheck className="w-6 h-6 text-white" />}
                    title="Safe & Secure"
                    description="No logs. No logins. 100% private."
                  />
                  <FeatureCard 
                    icon={<Smartphone className="w-6 h-6 text-white" />}
                    title="All Devices"
                    description="Works on Mobile, PC, Mac."
                  />
                  <FeatureCard 
                    icon={<VideoMetadataIcon className="w-6 h-6 text-white" />}
                    title="HD Quality"
                    description="Up to 4K resolution support."
                  />
                   <FeatureCard 
                    icon={<Globe className="w-6 h-6 text-white" />}
                    title="Universal"
                    description="Supports all major platforms."
                  />
                </div>
              </div>
            </section>
          </>
        )}

        {/* Page Routing */}
        <div className="py-20 px-4">
           {currentPage === 'about' && <AboutPage />}
           {currentPage === 'contact' && <ContactPage />}
           {currentPage === 'blog' && <BlogPage />}
           {currentPage === 'terms' && <TermsPage />}
           {currentPage === 'privacy' && <PrivacyPage />}
        </div>

      </main>

      {/* Floating Action Buttons - Scroll Top Only */}
      {showScrollTop && (
        <div className="fixed bottom-8 right-8 flex flex-col gap-5 z-40 items-center">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-12 h-12 bg-white text-black rounded-lg shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center font-bold"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
        </div>
      )}

      {/* New Bold Footer */}
      <footer className="bg-black pt-20 pb-10 border-t border-[#111] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           
           <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
              <div className="col-span-1 md:col-span-1">
                 <div className="bg-white w-10 h-10 flex items-center justify-center rounded-lg mb-6">
                    <Link2 className="text-black w-6 h-6" />
                 </div>
                 <p className="text-zinc-500 font-medium leading-relaxed max-w-xs">
                    ClipForge is the industry standard for high-performance media retrieval.
                 </p>
              </div>
              
              <div>
                 <h4 className="text-white font-bold mb-6">PRODUCT</h4>
                 <ul className="space-y-3 text-zinc-500 text-sm font-medium">
                    <li><button onClick={() => setCurrentPage('home')} className="hover:text-white transition-colors">Downloader</button></li>
                    <li><button onClick={() => setCurrentPage('home')} className="hover:text-white transition-colors">API Access (Soon)</button></li>
                    <li><button onClick={() => setCurrentPage('blog')} className="hover:text-white transition-colors">Changelog</button></li>
                 </ul>
              </div>

              <div>
                 <h4 className="text-white font-bold mb-6">COMPANY</h4>
                 <ul className="space-y-3 text-zinc-500 text-sm font-medium">
                    <li><button onClick={() => setCurrentPage('about')} className="hover:text-white transition-colors">About</button></li>
                    <li><button onClick={() => setCurrentPage('contact')} className="hover:text-white transition-colors">Contact</button></li>
                    <li><button onClick={() => setCurrentPage('terms')} className="hover:text-white transition-colors">Legal</button></li>
                 </ul>
              </div>

              <div>
                 <h4 className="text-white font-bold mb-6">CONNECT</h4>
                 <div className="flex gap-4">
                     <div className="w-10 h-10 bg-[#111] rounded-full flex items-center justify-center text-zinc-400 hover:bg-white hover:text-black transition-colors cursor-pointer">
                        <PlatformIcon platform={Platform.Facebook} className="w-5 h-5" />
                     </div>
                     <div className="w-10 h-10 bg-[#111] rounded-full flex items-center justify-center text-zinc-400 hover:bg-white hover:text-black transition-colors cursor-pointer">
                        <PlatformIcon platform={Platform.Instagram} className="w-5 h-5" />
                     </div>
                     <div className="w-10 h-10 bg-[#111] rounded-full flex items-center justify-center text-zinc-400 hover:bg-white hover:text-black transition-colors cursor-pointer">
                        <PlatformIcon platform={Platform.YouTube} className="w-5 h-5" />
                     </div>
                 </div>
              </div>
           </div>

           {/* Giant Text Effect */}
           <div className="border-t border-[#111] pt-10 relative">
               <h1 className="text-[12vw] font-black text-[#0a0a0a] leading-none text-center select-none pointer-events-none tracking-tighter">
                  CLIPFORGE
               </h1>
               <div className="absolute top-1/2 left-0 right-0 flex justify-between items-center text-xs font-mono text-zinc-600 px-4">
                  <span>© 2025 CLIPFORGE INC.</span>
                  <span className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full"></div> ALL SYSTEMS NORMAL</span>
               </div>
           </div>

        </div>
      </footer>
    </div>
  );
};

// Simplified Feature Card for Dark Theme
const FeatureCard: React.FC<{icon: React.ReactNode, title: string, description: string}> = ({ icon, title, description }) => (
  <div className="bg-[#09090b] p-8 rounded-xl border border-[#222] hover:border-white/20 transition-all duration-300 group">
    <div className="w-12 h-12 bg-[#1a1a1a] rounded-lg flex items-center justify-center mb-6 group-hover:bg-white group-hover:text-black transition-colors duration-300 text-white">
      {icon}
    </div>
    <h3 className="text-lg font-bold mb-2 text-white">{title}</h3>
    <p className="text-zinc-500 text-sm leading-relaxed">{description}</p>
  </div>
);

const VideoMetadataIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
  </svg>
)

export default App;