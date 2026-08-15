"use client";

import Link from "next/link";
import { 
  Lightbulb, Code2, Rocket, Heart, 
  Github, Linkedin, Twitter,
  ArrowRight, Target, Zap, Brain,
  Terminal, User, Activity, CheckCircle2,
  Briefcase, Globe, ExternalLink, Share2
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 overflow-hidden bg-[#050814] text-slate-300">
      
      {/* 1. Hero Section - With Image & Highlights */}
      <section className="max-w-6xl mx-auto px-6 py-4 text-center relative">
        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-brand-500/15 blur-[150px] rounded-full -z-10 pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-sm font-semibold mb-8 tracking-wide uppercase">
          <Heart className="w-4 h-4 text-brand-400" />
          The Story Behind KeyCoachAI
        </div>
        
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight mb-8 text-white">
          Why I Built <br className="hidden sm:block" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 via-accent-400 to-brand-500">
            KeyCoachAI
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-12">
          A personal project combining <span className="text-slate-200 font-semibold border-b-2 border-brand-500/50">web development</span>, <span className="text-slate-200 font-semibold border-b-2 border-accent-500/50">education</span>, and <span className="text-slate-200 font-semibold border-b-2 border-purple-500/50">artificial intelligence</span> to rethink how we practice typing.
        </p>
      </section>

      {/* 2. Grid Layout: Problem vs. Idea */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* The Problem Card */}
          <div className="bg-slate-900/40 backdrop-blur-md rounded-3xl p-8 md:p-10 border border-slate-800/80 hover:border-red-500/30 transition-colors h-full flex flex-col group">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Lightbulb className="w-7 h-7 text-red-400" />
              </div>
              <h2 className="text-3xl font-bold text-white">The Problem</h2>
            </div>
            
            <div className="space-y-6 text-slate-400 leading-relaxed text-lg flex-grow">
              <p>
                As someone deeply involved in IT training, I noticed a fundamental flaw in traditional typing websites: they are essentially <span className="bg-red-500/20 text-red-300 px-2 py-1 rounded-md font-semibold">scoreboards, not coaches</span>.
              </p>
              
              <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800">
                <p className="italic text-slate-300">
                  &quot;You typed at 45 WPM with 94% accuracy.&quot;
                </p>
              </div>

              <p>
                They measure your performance, but <strong className="text-white">they never explain it</strong>. Why are you stuck at 45 WPM? Which specific keystrokes or patterns are slowing you down? Existing tools never tell you <em>&quot;You struggle with the &apos;r&apos; and &apos;t&apos; keys — here&apos;s an exercise just for that.&quot;</em> They just tell you to try again.
              </p>
            </div>
          </div>

          {/* The Idea Card */}
          <div className="bg-gradient-to-br from-brand-900/20 to-slate-900/40 backdrop-blur-md rounded-3xl p-8 md:p-10 border border-brand-500/20 hover:border-brand-500/50 transition-colors h-full flex flex-col group">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-brand-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Brain className="w-7 h-7 text-brand-400" />
              </div>
              <h2 className="text-3xl font-bold text-white">The Idea</h2>
            </div>

            <div className="space-y-6 text-slate-400 leading-relaxed text-lg flex-grow">
              <p>
                I don&apos;t see AI simply as a chatbot. I wanted to use it to make learning smarter. What if an AI could analyze your typing behavior in <span className="bg-brand-500/20 text-brand-300 px-2 py-1 rounded-md font-semibold">real-time</span>?
              </p>
              
              <ul className="space-y-5">
                <li className="flex items-start gap-4">
                  <Activity className="w-6 h-6 text-brand-400 mt-1 flex-shrink-0" />
                  <span><strong className="text-white block mb-1">Detailed Behavior</strong> Tracking keystroke timing, long pauses, and corrected vs. uncorrected errors.</span>
                </li>
                <li className="flex items-start gap-4">
                  <Target className="w-6 h-6 text-brand-400 mt-1 flex-shrink-0" />
                  <span><strong className="text-white block mb-1">Pattern Recognition</strong> Identifying specific finger movements and letter combinations that slow you down.</span>
                </li>
                <li className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-brand-400 mt-1 flex-shrink-0" />
                  <span><strong className="text-white block mb-1">Dynamic Content</strong> Generating custom passages adapted specifically to your weaknesses.</span>
                </li>
              </ul>
              
              <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-brand-800 pt-6 border-t border-slate-700/50 mt-auto">
                The vision: Not just a typing test. A personal AI typing coach.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Bento Box: Tech & Architecture */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Architecture Visual (2 Columns) */}
          <div className="lg:col-span-2 bg-[#0A0F1C] rounded-3xl p-8 border border-slate-800 relative overflow-hidden group flex flex-col justify-between">
            {/* Abstract Tech Image Background */}
            <div className="absolute inset-0 opacity-10 mix-blend-overlay">
               <img src="coder.jpg" alt="AI Data background" className="w-full h-full object-cover" />
            </div>
            
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Terminal className="w-6 h-6 text-brand-400" />
                Architecture Overview
              </h2>
              <div className="font-mono text-sm sm:text-base text-brand-300/90 bg-slate-950/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 overflow-x-auto border border-brand-500/20 custom-scrollbar shadow-xl">
                <pre className="leading-loose">
{`[ NEXT.JS CLIENT ] ────► [ TYPING ENGINE ]
       │                        │
       ▼                        ▼
[ AI COACH API ] ◄──── [ PERFORMANCE PROFILE ]
       │
       ▼
[ LLM MODEL ] ───────► [ CUSTOM EXERCISES ]
       │
       ▼
[ MONGODB ATLAS ]`}
                </pre>
              </div>
            </div>
          </div>

          {/* The Build (1 Column) */}
          <div className="lg:col-span-1 bg-slate-900/50 backdrop-blur-md rounded-3xl p-8 border border-slate-800 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <Code2 className="w-6 h-6 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">The Build</h2>
            </div>
            <div className="space-y-5 text-slate-400 leading-relaxed text-lg">
              <p>
                Built utilizing modern web technologies that align with my expertise in full-stack development. 
              </p>
              <p>
                The UI is powered by <span className="text-blue-400 font-semibold">Next.js</span> and <span className="text-cyan-400 font-semibold">React</span>, styled seamlessly with <span className="text-teal-400 font-semibold">Tailwind CSS</span>.
              </p>
              <p>
                The backend securely manages user progression with <span className="text-green-500 font-semibold">Node.js</span> and <span className="text-green-400 font-semibold">MongoDB</span>, while an LLM API acts as the intelligent coaching layer.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Split Layout: About Maghfoor */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-brand-900/20 rounded-[2.5rem] p-8 md:p-12 lg:p-16 border border-slate-800 shadow-2xl relative overflow-hidden">
          
          <div className="grid md:grid-cols-[300px_1fr] gap-12 relative z-10 items-center">
            
            {/* Left Rail: Profile Image Card */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              {/* Profile Image Placeholder */}
              <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-4 border-slate-800 shadow-2xl mb-6 relative group">
                <img 
                  src="Maghfoor.png" 
                  alt="Maghfoor Ahmad Profile Placeholder" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-brand-500/10 mix-blend-overlay"></div>
              </div>
              
              <div>
                <h3 className="text-2xl font-black text-white">Maghfoor Ahmad</h3>
                <p className="text-brand-400 font-semibold text-base mt-1">@maghfoormalkana</p>
                <p className="text-slate-400 text-sm mt-2 font-medium bg-slate-800/50 inline-block px-3 py-1 rounded-full">IT Trainer & Web Developer</p>
              </div>

              <div className="flex justify-center md:justify-start gap-3 w-full mt-6">
                <a href="https://github.com/maghfoormalkana" target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-slate-800 hover:bg-brand-600 text-slate-300 hover:text-white transition-all hover:scale-105 shadow-lg">
                  <Github className="w-5 h-5" />
                </a>
                <a href="https://linkedin.com/in/maghfoormalkana" target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-slate-800 hover:bg-brand-600 text-slate-300 hover:text-white transition-all hover:scale-105 shadow-lg">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="https://twitter.com/maghfoormalkana" target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-slate-800 hover:bg-brand-600 text-slate-300 hover:text-white transition-all hover:scale-105 shadow-lg">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Right Rail: Story & Philosophy */}
            <div className="space-y-6 flex flex-col justify-center">
              <div className="flex items-center gap-3 inline-block">
                <span className="bg-brand-500/20 text-brand-400 px-3 py-1 rounded-full text-sm font-bold tracking-wide uppercase flex items-center gap-2">
                  <User className="w-4 h-4" /> The Creator
                </span>
              </div>
              
              <div className="space-y-5 text-slate-300 leading-relaxed text-lg">
                <p>
                  I currently work at <span className="text-white font-semibold">RozgarMap</span>, where I combine technical knowledge with teaching, digital marketing, and practical project development. With a Master of Computer Applications (MCA) from <span className="text-white font-semibold">Guru Nanak Dev University</span>, my journey has moved across several connected roles: from student to lecturer, and now trainer and developer.
                </p>
                
                <div className="bg-gradient-to-r from-brand-900/40 to-transparent border-l-4 border-brand-500 p-6 rounded-r-2xl my-8 shadow-inner">
                  <p className="italic text-white font-medium text-xl leading-relaxed">
                    &quot;Learn technology, build something useful, teach what you know, and keep improving.&quot;
                  </p>
                </div>

                <p>
                  My long-term passion lies in creating products that sit at the intersection of <span className="bg-slate-800 text-white px-2 py-0.5 rounded font-semibold">AI</span>, <span className="bg-slate-800 text-white px-2 py-0.5 rounded font-semibold">Education</span>, and <span className="bg-slate-800 text-white px-2 py-0.5 rounded font-semibold">Web Technology</span>. KeyCoachAI is an independent personal project born out of this exact philosophy—building technology that observes, understands, and provides meaningful assistance.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Beyond KeyCoachAI - Projects & Connect */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-4">Beyond KeyCoachAI</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Explore my other projects, work with my agency, or connect with me on social media.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          
          {/* UXD Marketing Card */}
          <div className="bg-slate-900/40 backdrop-blur-md rounded-3xl p-8 border border-slate-800 hover:border-brand-500/50 transition-all hover:-translate-y-1 flex flex-col group relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-500 to-accent-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center mb-6">
              <Briefcase className="w-6 h-6 text-brand-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">UXD Marketing</h3>
            <p className="text-slate-400 mb-8 flex-grow">
              My digital marketing agency. I specialize in building high-performance, conversion-driven websites, technical SEO, and scaling businesses through Meta Ads.
            </p>
            <a 
              href="https://uxdmarketing.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-brand-400 font-semibold hover:text-brand-300 transition-colors"
            >
              Visit uxdmarketing.com <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* GitHub / Open Source Card */}
          <div className="bg-slate-900/40 backdrop-blur-md rounded-3xl p-8 border border-slate-800 hover:border-slate-600 transition-all hover:-translate-y-1 flex flex-col group relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mb-6">
              <Github className="w-6 h-6 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Code & Projects</h3>
            <p className="text-slate-400 mb-8 flex-grow">
              Check out my repositories, including the MERN stack code behind my projects, educational tools like RozgarMap IQ, and open-source experiments.
            </p>
            <a 
              href="https://github.com/maghfoormalkana" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-slate-300 font-semibold hover:text-white transition-colors"
            >
              Follow on GitHub <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Socials Card */}
          <div className="bg-slate-900/40 backdrop-blur-md rounded-3xl p-8 border border-slate-800 hover:border-blue-500/30 transition-all hover:-translate-y-1 flex flex-col group relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6">
              <Share2 className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Let&apos;s Connect</h3>
            <p className="text-slate-400 mb-8 flex-grow">
              I share daily insights about web development, AI experiments, digital marketing strategies, and what I&apos;m learning along the way. Let&apos;s build a community.
            </p>
            <div className="flex gap-3 mt-auto">
              <a 
                href="https://twitter.com/maghfoormalkana" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 flex justify-center items-center gap-2 py-2.5 rounded-lg bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 text-[#1DA1F2] font-medium transition-colors"
              >
                <Twitter className="w-4 h-4" /> Twitter
              </a>
              <a 
                href="https://linkedin.com/in/maghfoormalkana" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 flex justify-center items-center gap-2 py-2.5 rounded-lg bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 text-[#0A66C2] font-medium transition-colors"
              >
                <Linkedin className="w-4 h-4" /> LinkedIn
              </a>
            </div>
          </div>

        </div>
      </section>


      {/* 6. CTA Section */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center relative">
        <h2 className="text-4xl md:text-5xl font-black mb-6 text-white">Ready to Experience It?</h2>
        <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
          Try KeyCoachAI yourself and see how AI-powered coaching can transform your typing speed and accuracy.
        </p>
        <Link 
          href="/typing-test"
          className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-brand-600 to-accent-500 hover:from-brand-500 hover:to-accent-400 text-white font-bold text-xl transition-all hover:shadow-[0_0_40px_rgba(var(--brand-500),0.4)] hover:-translate-y-1"
        >
          <Zap className="w-6 h-6" />
          Start Typing Test
          <ArrowRight className="w-6 h-6" />
        </Link>
      </section>
    </div>
  );
}