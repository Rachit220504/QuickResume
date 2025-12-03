import React, { useState, useEffect, useRef } from 'react';
import { 
  Download, Sparkles, Layout, Briefcase, User, Code, Palette, 
  FileDown, Loader2, Plus, Trash2, ChevronRight, Globe, Mail, Phone, MapPin, Linkedin, Github, Share2
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


// --- Constants & Mock Data ---

const THEMES = {
  MINIMALIST: 'minimalist',
  PROFESSIONAL: 'professional',
  CREATIVE: 'creative',
  MODERN: 'modern',
  ELEGANT: 'elegant',
  BOLD: 'bold',
  COMPACT: 'compact',
  NATURE: 'nature',
  CYBER: 'cyber',
  NEWSPAPER: 'newspaper',
  TERMINAL: 'terminal',
  SWISS: 'swiss',
  WARM: 'warm',
  COLD: 'cold',
  OUTLINE: 'outline',
};

const MOCK_PERSONA = {
  fullName: "Alex Rivera",
  title: "Senior Product Designer",
  bio: "Passionate about creating intuitive and engaging user experiences. With over 8 years of experience in digital product design, I specialize in bridging the gap between user needs and business goals. I believe in data-driven design and the power of empathy to build products that people love.",
  email: "alex.rivera@example.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  linkedin: "linkedin.com/in/arivera",
  github: "github.com/arivera",
  skills: ["Figma", "React", "TypeScript", "UI/UX Design", "Prototyping", "User Research", "Design Systems", "Tailwind CSS"],
  experience: [
    {
      id: 1,
      role: "Lead Product Designer",
      company: "TechFlow Solutions",
      duration: "2021 - Present",
      description: "Leading a team of 5 designers. Spearheaded the redesign of the core SaaS platform, resulting in a 25% increase in user engagement. implemented a comprehensive design system used across 4 products."
    },
    {
      id: 2,
      role: "Senior UI Designer",
      company: "Creative Pulse Agency",
      duration: "2018 - 2021",
      description: "Collaborated with major fintech clients to deliver award-winning mobile banking apps. Mentored junior designers and established best practices for accessibility compliance."
    }
  ],
  projects: [
    {
      id: 1,
      name: "E-Commerce Dashboard",
      description: "A comprehensive analytics dashboard for online retailers, featuring real-time data visualization and inventory management.",
      tags: ["UX Research", "Figma", "React"]
    },
    {
      id: 2,
      name: "HealthTrack App",
      description: "Mobile application for tracking daily fitness and nutrition, integrated with wearable devices.",
      tags: ["Mobile Design", "Prototyping", "iOS"]
    }
  ],
  theme: THEMES.PROFESSIONAL
};

const ENHANCED_BIOS = [
  "A visionary Senior Product Designer dedicated to crafting seamless digital experiences. I leverage a deep understanding of human-computer interaction to solve complex problems and deliver elegant, user-centric solutions that drive business growth.",
  "Results-oriented Product Designer with a proven track record of transforming abstract concepts into polished, market-ready products. Expert in design systems and agile methodologies, I thrive in fast-paced environments where innovation is key.",
  "Creative and analytical Senior Designer specializing in building scalable design systems and intuitive interfaces. I combine aesthetic excellence with functional precision to create products that not only look great but work perfectly."
];



// --- Components ---

const Button = ({ children, onClick, variant = 'primary', className = '', icon: Icon, disabled = false, loading = false }) => {
  const baseStyle = "flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm",
    secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-500 shadow-sm",
    ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
    danger: "text-red-600 hover:bg-red-50 hover:text-red-700",
    magic: "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
  };

  return (
    <button 
      onClick={onClick} 
      className={`${baseStyle} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
    >
      {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : Icon && <Icon className="w-4 h-4 mr-2" />}
      {children}
    </button>
  );
};

const InputGroup = ({ label, children, className = "" }) => (
  <div className={`mb-4 ${className}`}>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    {children}
  </div>
);

const SectionHeader = ({ title, icon: Icon }) => (
  <div className="flex items-center mb-6 pb-2 border-b border-gray-200">
    <Icon className="w-5 h-5 text-blue-600 mr-2" />
    <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
  </div>
);

// --- Main Application ---

function App() {
  // State
  const [activeTab, setActiveTab] = useState('profile');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('portfolio_data');
    return saved ? JSON.parse(saved) : {
      fullName: "",
      title: "",
      bio: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      skills: [],
      experience: [],
      projects: [],
      theme: THEMES.MINIMALIST
    };
  });

  const previewRef = useRef(null);

  // Persistence
  useEffect(() => {
    localStorage.setItem('portfolio_data', JSON.stringify(data));
  }, [data]);

  // Actions
  const handleAIEnhance = () => {
    setIsEnhancing(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      setData(prev => {
        const newData = { ...prev };
        
        // Enhance Bio
        if (newData.bio && !newData.bio.includes("innovative technology solutions")) {
          newData.bio = newData.bio.trim() + " Passionate about driving business growth through innovative technology solutions and user-centric design.";
        } else if (!newData.bio) {
          newData.bio = "A dedicated professional with a focus on delivering high-quality results and continuous improvement.";
        }

        // Enhance Experience
        newData.experience = newData.experience.map(exp => ({
          ...exp,
          description: exp.description 
            ? (exp.description.includes("efficiency") ? exp.description : exp.description.trim() + " Successfully optimized workflows to improve team efficiency by 20%.")
            : "Led key initiatives and collaborated with cross-functional teams to deliver project goals on time."
        }));

        // Enhance Projects
        newData.projects = newData.projects.map(proj => ({
          ...proj,
          description: proj.description
            ? (proj.description.includes("scalable") ? proj.description : proj.description.trim() + " Built using modern best practices and scalable architecture to ensure long-term maintainability.")
            : "Designed and developed a comprehensive solution addressing core user needs."
        }));

        return newData;
      });
      setIsEnhancing(false);
      alert("Content enhanced with professional phrasing!");
    }, 1500);
  };

  const handleEnhanceBio = () => {
    setIsEnhancing(true);
    setTimeout(() => {
      const randomBio = ENHANCED_BIOS[Math.floor(Math.random() * ENHANCED_BIOS.length)];
      setData(prev => ({ ...prev, bio: randomBio }));
      setIsEnhancing(false);
    }, 1500);
  };



  const handleDownloadPDF = async () => {
    if (!previewRef.current) return;
    
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2, // Higher quality
        useCORS: true,
        logging: false,
        windowWidth: 1200 // Force desktop width for consistency
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`${data.fullName.replace(/\s+/g, '_')}_Portfolio.pdf`);
    } catch (err) {
      console.error("PDF generation failed", err);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  const handleExportHTML = () => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.fullName} - Portfolio</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>body { font-family: 'Inter', sans-serif; }</style>
</head>
<body>
    <div id="root">
        ${previewRef.current.innerHTML}
    </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const updateField = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const addArrayItem = (field, initialItem) => {
    setData(prev => ({
      ...prev,
      [field]: [...prev[field], { ...initialItem, id: Date.now() }]
    }));
  };

  const removeArrayItem = (field, id) => {
    setData(prev => ({
      ...prev,
      [field]: prev[field].filter(item => item.id !== id)
    }));
  };

  const updateArrayItem = (field, id, key, value) => {
    setData(prev => ({
      ...prev,
      [field]: prev[field].map(item => item.id === id ? { ...item, [key]: value } : item)
    }));
  };

  // --- Theme Renderers ---

  const renderTheme = () => {
    switch (data.theme) {
      case THEMES.CREATIVE:
        return (
          <div className="bg-gray-900 text-white min-h-full p-8 font-sans">
            <header className="mb-12 border-b border-gray-800 pb-8">
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">{data.fullName}</h1>
              <p className="text-xl text-gray-400 mb-6">{data.title}</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                {data.email && <span className="flex items-center"><Mail className="w-4 h-4 mr-2" />{data.email}</span>}
                {data.location && <span className="flex items-center"><MapPin className="w-4 h-4 mr-2" />{data.location}</span>}
                {data.linkedin && <span className="flex items-center"><Linkedin className="w-4 h-4 mr-2" />{data.linkedin}</span>}
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="md:col-span-2 space-y-12">
                <section>
                  <h3 className="text-2xl font-bold mb-4 text-purple-400">About Me</h3>
                  <p className="text-gray-300 leading-relaxed">{data.bio}</p>
                </section>

                <section>
                  <h3 className="text-2xl font-bold mb-6 text-purple-400">Experience</h3>
                  <div className="space-y-8">
                    {data.experience.map(exp => (
                      <div key={exp.id} className="relative pl-6 border-l-2 border-gray-800">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-purple-500"></div>
                        <h4 className="text-xl font-semibold">{exp.role}</h4>
                        <p className="text-purple-300 mb-2">{exp.company} | {exp.duration}</p>
                        <p className="text-gray-400 text-sm">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="text-2xl font-bold mb-6 text-purple-400">Projects</h3>
                  <div className="grid grid-cols-1 gap-6">
                    {data.projects.map(proj => (
                      <div key={proj.id} className="bg-gray-800 p-6 rounded-xl hover:bg-gray-750 transition-colors">
                        <h4 className="text-lg font-bold mb-2">{proj.name}</h4>
                        <p className="text-gray-400 text-sm mb-4">{proj.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {proj.tags && proj.tags.map((tag, i) => (
                            <span key={i} className="px-2 py-1 bg-gray-700 text-xs rounded text-gray-300">#{tag}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <div className="space-y-12">
                <section>
                  <h3 className="text-xl font-bold mb-4 text-purple-400">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {data.skills.map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-purple-900/30 border border-purple-500/30 text-purple-300 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>
        );

      case THEMES.PROFESSIONAL:
        return (
          <div className="bg-slate-50 text-slate-800 min-h-full p-8 font-sans">
            <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-none overflow-hidden">
              <div className="bg-slate-800 text-white p-8">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-4xl font-bold mb-2">{data.fullName}</h1>
                    <p className="text-xl text-slate-300">{data.title}</p>
                  </div>
                  <div className="text-right text-sm text-slate-300 space-y-1">
                    {data.email && <div className="flex items-center justify-end gap-2"><Mail className="w-4 h-4" />{data.email}</div>}
                    {data.phone && <div className="flex items-center justify-end gap-2"><Phone className="w-4 h-4" />{data.phone}</div>}
                    {data.location && <div className="flex items-center justify-end gap-2"><MapPin className="w-4 h-4" />{data.location}</div>}
                  </div>
                </div>
              </div>

              <div className="p-8 grid grid-cols-3 gap-8">
                <div className="col-span-2 space-y-8">
                  <section>
                    <h3 className="text-lg font-bold uppercase tracking-wider text-slate-500 mb-4 border-b pb-2">Profile</h3>
                    <p className="text-slate-600 leading-relaxed">{data.bio}</p>
                  </section>

                  <section>
                    <h3 className="text-lg font-bold uppercase tracking-wider text-slate-500 mb-4 border-b pb-2">Experience</h3>
                    <div className="space-y-6">
                      {data.experience.map(exp => (
                        <div key={exp.id}>
                          <div className="flex justify-between items-baseline mb-1">
                            <h4 className="text-lg font-bold text-slate-800">{exp.role}</h4>
                            <span className="text-sm text-slate-500 font-medium">{exp.duration}</span>
                          </div>
                          <p className="text-slate-600 font-medium mb-2">{exp.company}</p>
                          <p className="text-slate-600 text-sm">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-bold uppercase tracking-wider text-slate-500 mb-4 border-b pb-2">Projects</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {data.projects.map(proj => (
                        <div key={proj.id} className="bg-slate-50 p-4 rounded border border-slate-100">
                          <h4 className="font-bold text-slate-800">{proj.name}</h4>
                          <p className="text-sm text-slate-600 mt-1 mb-2">{proj.description}</p>
                          <div className="flex gap-2">
                            {proj.tags && proj.tags.map((tag, i) => (
                              <span key={i} className="text-xs font-medium text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">{tag}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                <div className="space-y-8">
                  <section>
                    <h3 className="text-lg font-bold uppercase tracking-wider text-slate-500 mb-4 border-b pb-2">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {data.skills.map((skill, i) => (
                        <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 rounded text-sm font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-bold uppercase tracking-wider text-slate-500 mb-4 border-b pb-2">Connect</h3>
                    <div className="space-y-2 text-sm text-slate-600">
                      {data.linkedin && <div className="flex items-center gap-2"><Linkedin className="w-4 h-4" /> {data.linkedin}</div>}
                      {data.github && <div className="flex items-center gap-2"><Github className="w-4 h-4" /> {data.github}</div>}
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        );

      case THEMES.MODERN:
        return (
          <div className="bg-slate-900 text-slate-300 min-h-full p-8 font-mono">
            <div className="max-w-5xl mx-auto border border-slate-700 bg-slate-800/50 rounded-lg overflow-hidden shadow-2xl">
              {/* Header */}
              <header className="p-8 border-b border-slate-700 bg-slate-800">
                <h1 className="text-4xl md:text-5xl font-bold text-teal-400 mb-2 tracking-tighter">
                  {`<${data.fullName} />`}
                </h1>
                <p className="text-xl text-slate-400 mb-6 font-light">{data.title}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                  {data.email && <div className="flex items-center hover:text-teal-300 transition-colors"><Mail className="w-4 h-4 mr-2" />{data.email}</div>}
                  {data.location && <div className="flex items-center hover:text-teal-300 transition-colors"><MapPin className="w-4 h-4 mr-2" />{data.location}</div>}
                  {data.linkedin && <div className="flex items-center hover:text-teal-300 transition-colors"><Linkedin className="w-4 h-4 mr-2" />{data.linkedin}</div>}
                  {data.github && <div className="flex items-center hover:text-teal-300 transition-colors"><Github className="w-4 h-4 mr-2" />{data.github}</div>}
                </div>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-3">
                {/* Sidebar (Skills & Bio) */}
                <aside className="p-8 border-r border-slate-700 space-y-8 bg-slate-800/30">
                  <section>
                    <h3 className="text-teal-400 font-bold uppercase tracking-widest mb-4 text-sm">About</h3>
                    <p className="text-slate-400 leading-relaxed text-sm">{data.bio}</p>
                  </section>

                  <section>
                    <h3 className="text-teal-400 font-bold uppercase tracking-widest mb-4 text-sm">Tech Stack</h3>
                    <div className="flex flex-wrap gap-2">
                      {data.skills.map((skill, i) => (
                        <span key={i} className="px-2 py-1 bg-slate-700 text-teal-300 text-xs rounded border border-slate-600">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </section>
                </aside>

                {/* Main Content */}
                <main className="lg:col-span-2 p-8 space-y-10">
                  <section>
                    <div className="flex items-center mb-6">
                      <h3 className="text-2xl font-bold text-slate-100 mr-4">Experience</h3>
                      <div className="h-px bg-slate-700 flex-grow"></div>
                    </div>
                    <div className="space-y-8 border-l border-slate-700 ml-3 pl-8 relative">
                      {data.experience.map(exp => (
                        <div key={exp.id} className="relative">
                          <div className="absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-slate-900 border-2 border-teal-500"></div>
                          <h4 className="text-xl font-bold text-slate-200">{exp.role}</h4>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-teal-400 font-medium">{exp.company}</span>
                            <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">{exp.duration}</span>
                          </div>
                          <p className="text-slate-400 text-sm leading-relaxed">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <div className="flex items-center mb-6">
                      <h3 className="text-2xl font-bold text-slate-100 mr-4">Projects</h3>
                      <div className="h-px bg-slate-700 flex-grow"></div>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                      {data.projects.map(proj => (
                        <div key={proj.id} className="bg-slate-800 p-5 rounded border border-slate-700 hover:border-teal-500/50 transition-colors group">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-lg font-bold text-slate-200 group-hover:text-teal-400 transition-colors">{proj.name}</h4>
                          </div>
                          <p className="text-slate-400 text-sm mb-4">{proj.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {proj.tags && proj.tags.map((tag, i) => (
                              <span key={i} className="text-xs text-slate-500">#{tag}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </main>
              </div>
            </div>
          </div>
        );

      case THEMES.ELEGANT:
        return (
          <div className="bg-stone-100 min-h-full p-8 font-sans text-stone-800">
            <div className="max-w-5xl mx-auto bg-white shadow-xl min-h-[1000px] flex flex-col md:flex-row">
              {/* Sidebar */}
              <aside className="w-full md:w-1/3 bg-stone-800 text-stone-300 p-8 flex flex-col">
                <div className="mb-12 text-center md:text-left">
                  <div className="w-32 h-32 mx-auto md:mx-0 bg-stone-700 rounded-full mb-6 flex items-center justify-center text-4xl font-serif text-stone-400 border-4 border-stone-600">
                    {data.fullName.charAt(0)}
                  </div>
                  <h1 className="text-3xl font-serif text-white mb-2 leading-tight">{data.fullName}</h1>
                  <p className="text-stone-400 uppercase tracking-widest text-sm">{data.title}</p>
                </div>

                <div className="space-y-8 flex-grow">
                  <section>
                    <h3 className="text-white font-serif text-lg border-b border-stone-600 pb-2 mb-4">Contact</h3>
                    <div className="space-y-3 text-sm">
                      {data.email && <div className="flex items-center"><Mail className="w-4 h-4 mr-3 opacity-70" />{data.email}</div>}
                      {data.phone && <div className="flex items-center"><Phone className="w-4 h-4 mr-3 opacity-70" />{data.phone}</div>}
                      {data.location && <div className="flex items-center"><MapPin className="w-4 h-4 mr-3 opacity-70" />{data.location}</div>}
                      {data.linkedin && <div className="flex items-center"><Linkedin className="w-4 h-4 mr-3 opacity-70" />{data.linkedin}</div>}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-white font-serif text-lg border-b border-stone-600 pb-2 mb-4">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {data.skills.map((skill, i) => (
                        <span key={i} className="px-2 py-1 bg-stone-700 text-xs rounded text-stone-300">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </section>
                </div>
              </aside>

              {/* Main Content */}
              <main className="w-full md:w-2/3 p-12">
                <section className="mb-12">
                  <h2 className="text-2xl font-serif text-stone-800 mb-6 pb-2 border-b-2 border-stone-200">Profile</h2>
                  <p className="text-stone-600 leading-relaxed text-lg font-light">{data.bio}</p>
                </section>

                <section className="mb-12">
                  <h2 className="text-2xl font-serif text-stone-800 mb-6 pb-2 border-b-2 border-stone-200">Experience</h2>
                  <div className="space-y-8">
                    {data.experience.map(exp => (
                      <div key={exp.id}>
                        <div className="flex justify-between items-baseline mb-1">
                          <h3 className="text-xl font-bold text-stone-700">{exp.role}</h3>
                          <span className="text-sm text-stone-500 italic">{exp.duration}</span>
                        </div>
                        <div className="text-stone-600 font-medium mb-3">{exp.company}</div>
                        <p className="text-stone-600 leading-relaxed">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-serif text-stone-800 mb-6 pb-2 border-b-2 border-stone-200">Projects</h2>
                  <div className="grid grid-cols-1 gap-8">
                    {data.projects.map(proj => (
                      <div key={proj.id}>
                        <h3 className="text-lg font-bold text-stone-700 mb-2">{proj.name}</h3>
                        <p className="text-stone-600 mb-3">{proj.description}</p>
                        <div className="flex gap-2">
                          {proj.tags && proj.tags.map((tag, i) => (
                            <span key={i} className="text-xs font-bold text-stone-500 uppercase tracking-wider">{tag}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </main>
            </div>
          </div>
        );



      case THEMES.BOLD:
        return (
          <div className="bg-black text-white min-h-full p-8 font-sans uppercase tracking-tighter">
            <header className="mb-12 border-b-8 border-white pb-8">
              <h1 className="text-7xl md:text-9xl font-black mb-4 leading-none">{data.fullName}</h1>
              <p className="text-2xl md:text-4xl font-bold text-gray-400">{data.title}</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div>
                <h3 className="text-4xl font-black mb-8 underline decoration-4 underline-offset-8">About</h3>
                <p className="text-xl font-medium leading-relaxed">{data.bio}</p>
              </div>
              <div>
                <h3 className="text-4xl font-black mb-8 underline decoration-4 underline-offset-8">Contact</h3>
                <div className="text-xl font-medium space-y-2">
                  <p>{data.email}</p>
                  <p>{data.phone}</p>
                  <p>{data.location}</p>
                </div>
              </div>
            </div>
            <div className="mt-16">
              <h3 className="text-4xl font-black mb-8 underline decoration-4 underline-offset-8">Experience</h3>
              <div className="space-y-12">
                {data.experience.map(exp => (
                  <div key={exp.id}>
                    <h4 className="text-3xl font-black">{exp.role}</h4>
                    <p className="text-xl text-gray-400 mb-2">{exp.company} // {exp.duration}</p>
                    <p className="text-lg font-medium">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case THEMES.COMPACT:
        return (
          <div className="bg-gray-50 text-gray-900 min-h-full p-8 font-sans text-sm">
            <div className="max-w-3xl mx-auto bg-white shadow-sm border border-gray-200 p-6">
              <header className="border-b border-gray-200 pb-4 mb-4 flex justify-between items-end">
                <div>
                  <h1 className="text-2xl font-bold">{data.fullName}</h1>
                  <p className="text-gray-600">{data.title}</p>
                </div>
                <div className="text-right text-xs text-gray-500">
                  <p>{data.email} | {data.phone}</p>
                  <p>{data.location}</p>
                </div>
              </header>
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 space-y-4">
                  <section>
                    <h3 className="font-bold border-b border-gray-200 mb-2">Experience</h3>
                    <div className="space-y-3">
                      {data.experience.map(exp => (
                        <div key={exp.id}>
                          <div className="flex justify-between font-medium">
                            <span>{exp.role}, {exp.company}</span>
                            <span className="text-gray-500 text-xs">{exp.duration}</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                  <section>
                    <h3 className="font-bold border-b border-gray-200 mb-2">Projects</h3>
                    <div className="space-y-2">
                      {data.projects.map(proj => (
                        <div key={proj.id}>
                          <span className="font-medium">{proj.name}</span>
                          <span className="text-xs text-gray-600 ml-2">- {proj.description}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
                <div className="space-y-4">
                  <section>
                    <h3 className="font-bold border-b border-gray-200 mb-2">Summary</h3>
                    <p className="text-xs text-gray-600">{data.bio}</p>
                  </section>
                  <section>
                    <h3 className="font-bold border-b border-gray-200 mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-1">
                      {data.skills.map((skill, i) => (
                        <span key={i} className="bg-gray-100 px-1.5 py-0.5 rounded text-xs border border-gray-200">{skill}</span>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        );

      case THEMES.NATURE:
        return (
          <div className="bg-[#fdfbf7] text-[#4a4a4a] min-h-full p-8 font-sans">
            <div className="max-w-4xl mx-auto">
              <header className="text-center mb-12">
                <div className="inline-block p-2 border-2 border-[#8c9e8c] rounded-full mb-4">
                  <div className="w-24 h-24 bg-[#e6ebe6] rounded-full flex items-center justify-center text-3xl font-serif text-[#5c7a5c]">
                    {data.fullName.charAt(0)}
                  </div>
                </div>
                <h1 className="text-4xl font-serif text-[#2c3e2c] mb-2">{data.fullName}</h1>
                <p className="text-[#8c9e8c] tracking-wide">{data.title}</p>
              </header>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="md:col-span-1 space-y-8">
                  <div className="bg-[#e6ebe6] p-6 rounded-2xl">
                    <h3 className="text-[#5c7a5c] font-bold mb-4 font-serif">Contact</h3>
                    <div className="space-y-2 text-sm">
                      <p>{data.email}</p>
                      <p>{data.phone}</p>
                      <p>{data.location}</p>
                    </div>
                  </div>
                  <div className="bg-[#f4f1ea] p-6 rounded-2xl">
                    <h3 className="text-[#8c7e6c] font-bold mb-4 font-serif">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {data.skills.map((skill, i) => (
                        <span key={i} className="px-3 py-1 bg-white rounded-full text-xs text-[#5c5c5c] shadow-sm">{skill}</span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-2 space-y-10">
                  <section>
                    <h3 className="text-2xl font-serif text-[#2c3e2c] mb-6 border-b border-[#e6ebe6] pb-2">About Me</h3>
                    <p className="leading-relaxed">{data.bio}</p>
                  </section>
                  <section>
                    <h3 className="text-2xl font-serif text-[#2c3e2c] mb-6 border-b border-[#e6ebe6] pb-2">Experience</h3>
                    <div className="space-y-8">
                      {data.experience.map(exp => (
                        <div key={exp.id} className="relative pl-6 border-l-2 border-[#e6ebe6]">
                          <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#8c9e8c]"></div>
                          <h4 className="text-xl font-bold text-[#4a4a4a]">{exp.role}</h4>
                          <p className="text-[#8c9e8c] text-sm mb-2">{exp.company} • {exp.duration}</p>
                          <p className="text-sm leading-relaxed">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        );

      case THEMES.CYBER:
        return (
          <div className="bg-black text-[#0ff] min-h-full p-8 font-mono relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#f0f] to-[#0ff]"></div>
            <div className="max-w-5xl mx-auto relative z-10">
              <header className="mb-16 border border-[#0ff] p-8 bg-black/50 backdrop-blur-sm shadow-[0_0_20px_rgba(0,255,255,0.3)]">
                <h1 className="text-5xl md:text-7xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#f0f] to-[#0ff] animate-pulse">
                  {data.fullName.toUpperCase()}
                </h1>
                <p className="text-xl text-[#f0f]">&gt; {data.title}</p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="border border-[#333] p-6 bg-[#111]">
                  <h3 className="text-2xl text-[#f0f] mb-4 border-b border-[#f0f] inline-block">SYSTEM.BIO</h3>
                  <p className="text-gray-300 leading-relaxed">{data.bio}</p>
                </div>
                <div className="border border-[#333] p-6 bg-[#111]">
                  <h3 className="text-2xl text-[#f0f] mb-4 border-b border-[#f0f] inline-block">SYSTEM.SKILLS</h3>
                  <div className="flex flex-wrap gap-2">
                    {data.skills.map((skill, i) => (
                      <span key={i} className="px-2 py-1 border border-[#0ff] text-[#0ff] text-xs hover:bg-[#0ff] hover:text-black transition-colors cursor-default">
                        [{skill}]
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 border border-[#333] p-6 bg-[#111]">
                <h3 className="text-2xl text-[#f0f] mb-6 border-b border-[#f0f] inline-block">EXEC.EXPERIENCE</h3>
                <div className="space-y-6">
                  {data.experience.map(exp => (
                    <div key={exp.id} className="group">
                      <div className="flex justify-between items-baseline text-[#0ff]">
                        <h4 className="text-xl font-bold group-hover:text-[#f0f] transition-colors">_ {exp.role}</h4>
                        <span className="text-xs opacity-70">[{exp.duration}]</span>
                      </div>
                      <p className="text-gray-400 text-sm mb-1">@ {exp.company}</p>
                      <p className="text-gray-300 text-sm pl-4 border-l border-[#333]">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case THEMES.NEWSPAPER:
        return (
          <div className="bg-[#f0f0f0] text-black min-h-full p-8 font-serif">
            <div className="max-w-4xl mx-auto bg-white p-12 shadow-lg">
              <header className="text-center border-b-4 border-black pb-4 mb-4">
                <h1 className="text-6xl font-black uppercase tracking-tight mb-2">{data.fullName}</h1>
                <div className="flex justify-between items-center border-t border-b border-black py-2 text-sm font-bold uppercase">
                  <span>{data.location}</span>
                  <span>{data.title}</span>
                  <span>{data.phone}</span>
                </div>
              </header>
              
              <div className="columns-1 md:columns-2 gap-8 space-y-8 text-justify">
                <section className="break-inside-avoid">
                  <h3 className="font-bold text-xl uppercase border-b-2 border-black mb-2">Editorial</h3>
                  <p className="leading-snug first-letter:text-4xl first-letter:font-bold first-letter:float-left first-letter:mr-2">
                    {data.bio}
                  </p>
                </section>

                <section className="break-inside-avoid">
                  <h3 className="font-bold text-xl uppercase border-b-2 border-black mb-2">Work History</h3>
                  {data.experience.map(exp => (
                    <div key={exp.id} className="mb-4">
                      <h4 className="font-bold text-lg leading-none">{exp.role}</h4>
                      <p className="italic text-sm mb-1">{exp.company}, {exp.duration}</p>
                      <p className="text-sm leading-snug">{exp.description}</p>
                    </div>
                  ))}
                </section>

                <section className="break-inside-avoid">
                  <h3 className="font-bold text-xl uppercase border-b-2 border-black mb-2">Projects</h3>
                  {data.projects.map(proj => (
                    <div key={proj.id} className="mb-4">
                      <h4 className="font-bold">{proj.name}</h4>
                      <p className="text-sm">{proj.description}</p>
                    </div>
                  ))}
                </section>
                
                <section className="break-inside-avoid bg-gray-100 p-4 border border-black">
                  <h3 className="font-bold text-lg uppercase mb-2 text-center">Skills & Tech</h3>
                  <p className="text-center text-sm leading-relaxed">
                    {data.skills.join(' • ')}
                  </p>
                </section>
              </div>
            </div>
          </div>
        );

      case THEMES.TERMINAL:
        return (
          <div className="bg-[#1a1b26] text-[#a9b1d6] min-h-full p-8 font-mono text-sm leading-relaxed">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <span className="text-[#7aa2f7]">user@portfolio</span>
                <span className="text-[#9ece6a]"> ~ </span>
                <span className="text-[#bb9af7]">$</span> cat profile.json
              </div>
              
              <div className="pl-4 border-l-2 border-[#2f334d] space-y-1">
                <p><span className="text-[#e0af68]">"name"</span>: <span className="text-[#9ece6a]">"{data.fullName}"</span>,</p>
                <p><span className="text-[#e0af68]">"title"</span>: <span className="text-[#9ece6a]">"{data.title}"</span>,</p>
                <p><span className="text-[#e0af68]">"contact"</span>: {"{"}</p>
                <p className="pl-4"><span className="text-[#e0af68]">"email"</span>: <span className="text-[#9ece6a]">"{data.email}"</span>,</p>
                <p className="pl-4"><span className="text-[#e0af68]">"phone"</span>: <span className="text-[#9ece6a]">"{data.phone}"</span></p>
                <p>{"},"}</p>
                <p><span className="text-[#e0af68]">"bio"</span>: <span className="text-[#9ece6a]">"{data.bio}"</span>,</p>
                <p><span className="text-[#e0af68]">"skills"</span>: [</p>
                <p className="pl-4 text-[#9ece6a]">{data.skills.map(s => `"${s}"`).join(', ')}</p>
                <p>],</p>
                <p><span className="text-[#e0af68]">"experience"</span>: [</p>
                {data.experience.map(exp => (
                  <div key={exp.id} className="pl-4">
                    <p>{"{"}</p>
                    <p className="pl-4"><span className="text-[#e0af68]">"role"</span>: <span className="text-[#9ece6a]">"{exp.role}"</span>,</p>
                    <p className="pl-4"><span className="text-[#e0af68]">"company"</span>: <span className="text-[#9ece6a]">"{exp.company}"</span>,</p>
                    <p className="pl-4"><span className="text-[#e0af68]">"desc"</span>: <span className="text-[#9ece6a]">"{exp.description}"</span></p>
                    <p>{"},"}</p>
                  </div>
                ))}
                <p>]</p>
              </div>
              
              <div className="mt-8 animate-pulse">
                <span className="text-[#7aa2f7]">user@portfolio</span>
                <span className="text-[#9ece6a]"> ~ </span>
                <span className="text-[#bb9af7]">$</span> <span className="w-2 h-4 bg-[#a9b1d6] inline-block align-middle"></span>
              </div>
            </div>
          </div>
        );

      case THEMES.SWISS:
        return (
          <div className="bg-white text-black min-h-full p-12 font-sans">
            <div className="max-w-5xl mx-auto grid grid-cols-12 gap-8">
              <header className="col-span-12 mb-16">
                <h1 className="text-8xl font-bold tracking-tighter leading-none mb-4">{data.fullName}</h1>
                <div className="w-24 h-24 bg-[#ff0000] rounded-full flex items-center justify-center text-white font-bold text-xl mb-8">
                  CV
                </div>
                <p className="text-3xl font-bold text-gray-400">{data.title}</p>
              </header>

              <div className="col-span-4 space-y-12">
                <section>
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-4 text-[#ff0000]">Contact</h3>
                  <p className="font-bold text-lg">{data.email}</p>
                  <p className="font-bold text-lg">{data.phone}</p>
                  <p className="font-bold text-lg">{data.location}</p>
                </section>
                <section>
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-4 text-[#ff0000]">Skills</h3>
                  <ul className="font-bold text-lg space-y-1">
                    {data.skills.map((skill, i) => <li key={i}>{skill}</li>)}
                  </ul>
                </section>
              </div>

              <div className="col-span-8 space-y-16">
                <section>
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-[#ff0000]">Profile</h3>
                  <p className="text-2xl font-medium leading-tight">{data.bio}</p>
                </section>
                <section>
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-[#ff0000]">Experience</h3>
                  <div className="space-y-10">
                    {data.experience.map(exp => (
                      <div key={exp.id} className="grid grid-cols-3 gap-4">
                        <div className="col-span-1 font-bold text-gray-400">{exp.duration}</div>
                        <div className="col-span-2">
                          <h4 className="text-xl font-bold mb-1">{exp.role}</h4>
                          <p className="text-lg font-medium mb-2">{exp.company}</p>
                          <p className="text-gray-600 leading-snug">{exp.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>
        );

      case THEMES.WARM:
        return (
          <div className="bg-[#fff8e1] text-[#5d4037] min-h-full p-8 font-sans">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="bg-[#ffecb3] p-12 text-center">
                <h1 className="text-4xl font-bold text-[#4e342e] mb-2">{data.fullName}</h1>
                <p className="text-[#795548] font-medium">{data.title}</p>
              </div>
              <div className="p-12 space-y-10">
                <section className="text-center max-w-2xl mx-auto">
                  <p className="text-lg italic text-[#6d4c41]">{data.bio}</p>
                </section>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <section>
                    <h3 className="text-xl font-bold text-[#ff6f00] mb-6 flex items-center">
                      <span className="w-8 h-1 bg-[#ff6f00] mr-3 rounded-full"></span> Experience
                    </h3>
                    <div className="space-y-6">
                      {data.experience.map(exp => (
                        <div key={exp.id} className="bg-[#fff3e0] p-4 rounded-xl">
                          <h4 className="font-bold text-[#4e342e]">{exp.role}</h4>
                          <p className="text-sm text-[#8d6e63] mb-2">{exp.company} | {exp.duration}</p>
                          <p className="text-sm">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                  
                  <div className="space-y-10">
                    <section>
                      <h3 className="text-xl font-bold text-[#ff6f00] mb-6 flex items-center">
                        <span className="w-8 h-1 bg-[#ff6f00] mr-3 rounded-full"></span> Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {data.skills.map((skill, i) => (
                          <span key={i} className="px-3 py-1 bg-[#ffcc80] text-[#4e342e] rounded-lg text-sm font-medium">{skill}</span>
                        ))}
                      </div>
                    </section>
                    <section>
                      <h3 className="text-xl font-bold text-[#ff6f00] mb-6 flex items-center">
                        <span className="w-8 h-1 bg-[#ff6f00] mr-3 rounded-full"></span> Projects
                      </h3>
                      <div className="space-y-4">
                        {data.projects.map(proj => (
                          <div key={proj.id}>
                            <h4 className="font-bold text-[#4e342e]">{proj.name}</h4>
                            <p className="text-sm text-[#6d4c41]">{proj.description}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case THEMES.COLD:
        return (
          <div className="bg-[#e0f7fa] text-[#006064] min-h-full p-8 font-sans">
            <div className="max-w-5xl mx-auto bg-white shadow-2xl border-t-8 border-[#00bcd4]">
              <div className="grid grid-cols-1 md:grid-cols-12">
                <aside className="md:col-span-4 bg-[#f0ffff] p-8 border-r border-[#b2ebf2]">
                  <h1 className="text-3xl font-bold text-[#00838f] mb-2">{data.fullName}</h1>
                  <p className="text-[#0097a7] mb-8 font-medium">{data.title}</p>
                  
                  <div className="space-y-8">
                    <section>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-[#00bcd4] mb-3">Contact</h3>
                      <div className="space-y-2 text-sm">
                        <p>{data.email}</p>
                        <p>{data.phone}</p>
                        <p>{data.location}</p>
                      </div>
                    </section>
                    <section>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-[#00bcd4] mb-3">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {data.skills.map((skill, i) => (
                          <span key={i} className="px-2 py-1 bg-[#e0f7fa] text-[#006064] text-xs rounded border border-[#b2ebf2]">{skill}</span>
                        ))}
                      </div>
                    </section>
                  </div>
                </aside>
                
                <main className="md:col-span-8 p-8">
                  <section className="mb-10">
                    <h3 className="text-2xl font-light text-[#00838f] mb-4 border-b border-[#b2ebf2] pb-2">Profile</h3>
                    <p className="text-[#455a64] leading-relaxed">{data.bio}</p>
                  </section>
                  
                  <section className="mb-10">
                    <h3 className="text-2xl font-light text-[#00838f] mb-6 border-b border-[#b2ebf2] pb-2">Experience</h3>
                    <div className="space-y-6">
                      {data.experience.map(exp => (
                        <div key={exp.id}>
                          <div className="flex justify-between items-center mb-1">
                            <h4 className="text-lg font-bold text-[#006064]">{exp.role}</h4>
                            <span className="text-xs bg-[#e0f7fa] px-2 py-1 rounded text-[#00838f]">{exp.duration}</span>
                          </div>
                          <p className="text-sm text-[#0097a7] mb-2 font-medium">{exp.company}</p>
                          <p className="text-[#455a64] text-sm">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-2xl font-light text-[#00838f] mb-6 border-b border-[#b2ebf2] pb-2">Projects</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {data.projects.map(proj => (
                        <div key={proj.id} className="bg-[#e0f7fa] p-4 rounded">
                          <h4 className="font-bold text-[#00838f] mb-1">{proj.name}</h4>
                          <p className="text-xs text-[#455a64]">{proj.description}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                </main>
              </div>
            </div>
          </div>
        );

      case THEMES.OUTLINE:
        return (
          <div className="bg-white text-black min-h-full p-8 font-mono">
            <div className="max-w-4xl mx-auto border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <header className="text-center mb-12 border-b-4 border-black pb-8">
                <h1 className="text-5xl font-bold mb-4 uppercase">{data.fullName}</h1>
                <div className="inline-block border-2 border-black px-4 py-1 font-bold text-xl uppercase bg-black text-white">
                  {data.title}
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-12">
                  <section>
                    <h3 className="text-2xl font-bold uppercase mb-4 decoration-4 underline decoration-black">About</h3>
                    <p className="text-lg leading-relaxed">{data.bio}</p>
                  </section>
                  <section>
                    <h3 className="text-2xl font-bold uppercase mb-4 decoration-4 underline decoration-black">Skills</h3>
                    <div className="flex flex-wrap gap-3">
                      {data.skills.map((skill, i) => (
                        <span key={i} className="border-2 border-black px-3 py-1 font-bold text-sm hover:bg-black hover:text-white transition-colors">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </section>
                </div>

                <div className="space-y-12">
                  <section>
                    <h3 className="text-2xl font-bold uppercase mb-4 decoration-4 underline decoration-black">Experience</h3>
                    <div className="space-y-8">
                      {data.experience.map(exp => (
                        <div key={exp.id} className="border-2 border-black p-4 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow">
                          <h4 className="text-xl font-bold uppercase">{exp.role}</h4>
                          <p className="font-bold mb-2">{exp.company} <span className="font-normal text-sm">({exp.duration})</span></p>
                          <p className="text-sm">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        );

      case THEMES.MINIMALIST:
      default:
        return (
          <div className="bg-white text-black min-h-full p-[1.2cm] font-serif max-w-[210mm] mx-auto leading-tight text-sm">
            {/* Header */}
            <div className="text-center mb-2">
              <h1 className="text-3xl font-bold mb-1 uppercase tracking-wide">{data.fullName}</h1>
              <div className="flex justify-center items-center gap-2 text-sm mb-1">
                {data.location && <span>{data.location}</span>}
                {data.location && data.phone && <span>|</span>}
                {data.phone && <span>{data.phone}</span>}
                {data.phone && data.email && <span>|</span>}
                {data.email && <a href={`mailto:${data.email}`} className="hover:underline">{data.email}</a>}
              </div>
              <div className="flex justify-center items-center gap-2 text-sm">
                {data.linkedin && (
                  <>
                    <a href={`https://${data.linkedin}`} target="_blank" rel="noreferrer" className="hover:underline">LinkedIn</a>
                    {(data.github || data.website) && <span>|</span>}
                  </>
                )}
                {data.github && (
                  <>
                    <a href={`https://${data.github}`} target="_blank" rel="noreferrer" className="hover:underline">GitHub</a>
                    {data.website && <span>|</span>}
                  </>
                )}
                {data.website && (
                  <a href={`https://${data.website}`} target="_blank" rel="noreferrer" className="hover:underline">Portfolio</a>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="w-full border-b-[0.5px] border-black my-2"></div>

            {/* Technical Summary (Bio) */}
            {data.bio && (
              <section className="mb-2">
                <h3 className="font-bold text-base mb-1">Technical Summary</h3>
                <p className="text-justify leading-snug">{data.bio}</p>
                <div className="w-full border-b-[0.5px] border-black my-2"></div>
              </section>
            )}

            {/* Skills */}
            {data.skills.length > 0 && (
              <section className="mb-2">
                <h3 className="font-bold text-base mb-1">Skills</h3>
                <div className="text-justify leading-snug">
                  <span className="font-bold">Technologies: </span>
                  {data.skills.join(', ')}
                </div>
                <div className="w-full border-b-[0.5px] border-black my-2"></div>
              </section>
            )}

            {/* Experience */}
            {data.experience.length > 0 && (
              <section className="mb-2">
                <h3 className="font-bold text-base mb-1">Experience</h3>
                <div className="space-y-3">
                  {data.experience.map(exp => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-base">{exp.role}</span>
                        <span className="italic text-sm">{exp.company} | {exp.duration}</span>
                      </div>
                      <ul className="list-disc list-outside ml-5 mt-1 space-y-0.5">
                        {/* Split description by sentences or newlines to simulate bullet points */}
                        {exp.description.split(/[.\n]/).filter(s => s.trim().length > 0).map((sentence, i) => (
                          <li key={i} className="pl-1">{sentence.trim()}.</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <div className="w-full border-b-[0.5px] border-black my-2"></div>
              </section>
            )}

            {/* Projects */}
            {data.projects.length > 0 && (
              <section className="mb-2">
                <h3 className="font-bold text-base mb-1">Selected Projects</h3>
                <div className="space-y-3">
                  {data.projects.map(proj => (
                    <div key={proj.id}>
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-base">{proj.name}</span>
                        <span className="italic text-sm">
                          {proj.tags && proj.tags.join(', ')}
                        </span>
                      </div>
                      <ul className="list-disc list-outside ml-5 mt-1 space-y-0.5">
                        {proj.description.split(/[.\n]/).filter(s => s.trim().length > 0).map((sentence, i) => (
                          <li key={i} className="pl-1">{sentence.trim()}.</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                {/* No divider after last section usually, but keeping consistent if more sections added */}
              </section>
            )}
          </div>
        );
    }
  };

  // --- Editor Panels ---

  const renderEditor = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
            <SectionHeader title="Personal Details" icon={User} />
            <div className="grid grid-cols-2 gap-4">
              <InputGroup label="Full Name">
                <input type="text" className="w-full p-2 border rounded-md" value={data.fullName} onChange={e => updateField('fullName', e.target.value)} placeholder="Jane Doe" />
              </InputGroup>
              <InputGroup label="Job Title">
                <input type="text" className="w-full p-2 border rounded-md" value={data.title} onChange={e => updateField('title', e.target.value)} placeholder="Product Designer" />
              </InputGroup>
            </div>
            <InputGroup label="Professional Bio">
              <div className="relative">
                <textarea className="w-full p-2 border rounded-md h-32" value={data.bio} onChange={e => updateField('bio', e.target.value)} placeholder="Tell your story..." />
                <button 
                  onClick={handleEnhanceBio}
                  disabled={isEnhancing}
                  className="absolute bottom-2 right-2 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-md flex items-center hover:bg-purple-200 transition-colors"
                >
                  {isEnhancing ? <Loader2 className="w-3 h-3 animate-spin mr-1"/> : <Sparkles className="w-3 h-3 mr-1"/>}
                  Enhance Bio
                </button>
              </div>
            </InputGroup>
            <div className="grid grid-cols-2 gap-4">
              <InputGroup label="Email">
                <input type="email" className="w-full p-2 border rounded-md" value={data.email} onChange={e => updateField('email', e.target.value)} />
              </InputGroup>
              <InputGroup label="Phone">
                <input type="tel" className="w-full p-2 border rounded-md" value={data.phone} onChange={e => updateField('phone', e.target.value)} />
              </InputGroup>
              <InputGroup label="Location">
                <input type="text" className="w-full p-2 border rounded-md" value={data.location} onChange={e => updateField('location', e.target.value)} />
              </InputGroup>
            </div>
            <SectionHeader title="Social Links" icon={Share2} />
            <div className="grid grid-cols-2 gap-4">
              <InputGroup label="LinkedIn">
                <input type="text" className="w-full p-2 border rounded-md" value={data.linkedin} onChange={e => updateField('linkedin', e.target.value)} />
              </InputGroup>
              <InputGroup label="GitHub">
                <input type="text" className="w-full p-2 border rounded-md" value={data.github} onChange={e => updateField('github', e.target.value)} />
              </InputGroup>
            </div>
          </div>
        );
      case 'experience':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
            <SectionHeader title="Work Experience" icon={Briefcase} />
            {data.experience.map((exp, idx) => (
              <div key={exp.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative group">
                <button onClick={() => removeArrayItem('experience', exp.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <input type="text" className="w-full p-2 border rounded bg-white" value={exp.role} onChange={e => updateArrayItem('experience', exp.id, 'role', e.target.value)} placeholder="Role" />
                  <input type="text" className="w-full p-2 border rounded bg-white" value={exp.company} onChange={e => updateArrayItem('experience', exp.id, 'company', e.target.value)} placeholder="Company" />
                </div>
                <input type="text" className="w-full p-2 border rounded bg-white mb-3" value={exp.duration} onChange={e => updateArrayItem('experience', exp.id, 'duration', e.target.value)} placeholder="Duration (e.g. 2020 - Present)" />
                <textarea className="w-full p-2 border rounded bg-white h-20" value={exp.description} onChange={e => updateArrayItem('experience', exp.id, 'description', e.target.value)} placeholder="Description of responsibilities..." />
              </div>
            ))}
            <Button variant="secondary" className="w-full" onClick={() => addArrayItem('experience', { role: '', company: '', duration: '', description: '' })} icon={Plus}>
              Add Position
            </Button>
          </div>
        );
      case 'projects':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
            <SectionHeader title="Projects" icon={Code} />
            {data.projects.map((proj, idx) => (
              <div key={proj.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative group">
                <button onClick={() => removeArrayItem('projects', proj.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-4 h-4" />
                </button>
                <input type="text" className="w-full p-2 border rounded bg-white mb-3" value={proj.name} onChange={e => updateArrayItem('projects', proj.id, 'name', e.target.value)} placeholder="Project Name" />
                <textarea className="w-full p-2 border rounded bg-white h-20 mb-3" value={proj.description} onChange={e => updateArrayItem('projects', proj.id, 'description', e.target.value)} placeholder="Project Description..." />
                <input 
                  type="text" 
                  className="w-full p-2 border rounded bg-white" 
                  value={proj.tags ? proj.tags.join(', ') : ''} 
                  onChange={e => updateArrayItem('projects', proj.id, 'tags', e.target.value.split(',').map(t => t.trim()))} 
                  placeholder="Tags (comma separated)" 
                />
              </div>
            ))}
            <Button variant="secondary" className="w-full" onClick={() => addArrayItem('projects', { name: '', description: '', tags: [] })} icon={Plus}>
              Add Project
            </Button>
          </div>
        );
      case 'skills':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
            <SectionHeader title="Skills & Expertise" icon={Sparkles} />
            <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 mb-4">
              Enter your skills separated by commas. They will be automatically formatted.
            </div>
            <textarea 
              className="w-full p-4 border rounded-lg h-40 font-mono text-sm" 
              value={data.skills.join(', ')} 
              onChange={e => updateField('skills', e.target.value.split(',').map(s => s.trim()))}
              placeholder="React, Design Systems, User Research, Prototyping..." 
            />
          </div>
        );
      case 'theme':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
            <SectionHeader title="Visual Style" icon={Palette} />
            <div className="grid grid-cols-1 gap-4">
              {[
                { id: THEMES.MINIMALIST, name: 'Minimalist', desc: 'Clean, typography-focused, high contrast.', color: 'bg-white border-gray-200' },
                { id: THEMES.PROFESSIONAL, name: 'Professional', desc: 'Structured, corporate, card-based layout.', color: 'bg-slate-100 border-slate-300' },
                { id: THEMES.CREATIVE, name: 'Creative', desc: 'Dark mode, bold accents, modern feel.', color: 'bg-gray-900 text-white border-gray-700' },
                { id: THEMES.MODERN, name: 'Modern Tech', desc: 'Dark, developer-focused, monospace.', color: 'bg-slate-800 text-teal-400 border-slate-600' },
                { id: THEMES.ELEGANT, name: 'Elegant', desc: 'Serif fonts, sidebar layout, sophisticated.', color: 'bg-stone-100 border-stone-300' },
                { id: THEMES.BOLD, name: 'Bold', desc: 'High contrast, massive typography, impactful.', color: 'bg-black text-white border-gray-800' },
                { id: THEMES.COMPACT, name: 'Compact', desc: 'Dense layout, efficient, grid-based.', color: 'bg-gray-50 border-gray-300' },
                { id: THEMES.NATURE, name: 'Nature', desc: 'Organic, earth tones, rounded soft feel.', color: 'bg-[#fdfbf7] border-[#8c9e8c]' },
                { id: THEMES.CYBER, name: 'Cyber', desc: 'Neon, futuristic, hacker aesthetic.', color: 'bg-black text-[#0ff] border-[#0ff]' },
                { id: THEMES.NEWSPAPER, name: 'Newspaper', desc: 'Classic print style, multi-column, serif.', color: 'bg-[#f0f0f0] border-black' },
                { id: THEMES.TERMINAL, name: 'Terminal', desc: 'Command line interface, green on black.', color: 'bg-[#1a1b26] text-[#9ece6a] border-[#7aa2f7]' },
                { id: THEMES.SWISS, name: 'Swiss', desc: 'Clean, modernist, red accents, grid.', color: 'bg-white border-red-500' },
                { id: THEMES.WARM, name: 'Warm', desc: 'Cozy, yellow/orange tones, inviting.', color: 'bg-[#fff8e1] border-[#ff6f00]' },
                { id: THEMES.COLD, name: 'Cold', desc: 'Crisp, blue/cyan tones, professional.', color: 'bg-[#e0f7fa] border-[#00bcd4]' },
                { id: THEMES.OUTLINE, name: 'Outline', desc: 'Brutalist, wireframe, high contrast borders.', color: 'bg-white border-black border-2' },
              ].map(theme => (
                <button
                  key={theme.id}
                  onClick={() => updateField('theme', theme.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${data.theme === theme.id ? 'border-blue-600 ring-2 ring-blue-100' : 'border-transparent hover:border-gray-300'} ${theme.color}`}
                >
                  <div className="font-bold text-lg mb-1">{theme.name}</div>
                  <div className={`text-sm ${theme.id === THEMES.CREATIVE ? 'text-gray-400' : 'text-gray-500'}`}>{theme.desc}</div>
                </button>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 overflow-hidden font-sans">
      {/* Left Panel - Editor */}
      <div className="w-full md:w-1/3 md:min-w-[400px] h-1/2 md:h-full bg-white border-r border-gray-200 flex flex-col shadow-xl z-10">
        <div className="p-4 md:p-6 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">Q</div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">QuickResume</h1>
            </div>
            <Button variant="magic" onClick={handleAIEnhance} loading={isEnhancing} icon={Sparkles} className="text-xs px-3 py-1.5">
              AI Enhance
            </Button>
          </div>
          
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg overflow-x-auto no-scrollbar">
            {[
              { id: 'profile', icon: User, label: 'Profile' },
              { id: 'experience', icon: Briefcase, label: 'Work' },
              { id: 'projects', icon: Code, label: 'Projects' },
              { id: 'skills', icon: Sparkles, label: 'Skills' },
              { id: 'theme', icon: Palette, label: 'Theme' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'}`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {renderEditor()}
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50 flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={handleExportHTML} icon={FileDown}>
            Export HTML
          </Button>
          <Button variant="primary" className="flex-1" onClick={handleDownloadPDF} icon={Download}>
            Download PDF
          </Button>
        </div>
      </div>

      {/* Right Panel - Preview */}
      <div className="w-full md:flex-1 h-1/2 md:h-full bg-gray-200 overflow-auto p-4 md:p-8 flex items-start justify-center">
        <div 
          ref={previewRef}
          className="bg-white shadow-2xl min-h-[297mm] w-[210mm] origin-top-left md:origin-top transform scale-[0.45] sm:scale-[0.6] md:scale-90 lg:scale-100 transition-transform duration-300 ease-in-out mb-[200px] md:mb-0"
          style={{ 
            // A4 Dimensions: 210mm x 297mm
            // We use a fixed width for consistency in PDF generation
          }}
        >
          {renderTheme()}
        </div>
      </div>
    </div>
  );
}

export default App;
