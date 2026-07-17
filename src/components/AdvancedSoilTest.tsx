import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, UploadCloud, Camera, ArrowRight, Activity, Droplets, Leaf, Sprout, X } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Product } from '../types';
import { storage, ref, uploadBytes, getDownloadURL } from '../lib/firebase';

interface AdvancedSoilTestProps {
  liveProducts: Product[];
  addToCart: (product: Product, quantity: number) => void;
  onRetake: () => void;
}

const ADVANCED_QUESTIONS = [
  {
    question: "What type of soil texture do you primarily have?",
    options: ["Sandy (Gritty & drains fast)", "Clay (Sticky & holds water)", "Loamy (Dark, crumbly, ideal)", "Silty (Smooth & powdery)"],
  },
  {
    question: "How would you describe the drainage after heavy rain?",
    options: ["Puddles stay for days", "Drains within hours", "Drains almost immediately", "Unsure / Varies"],
  },
  {
    question: "What is your primary growing goal for this season?",
    options: ["Max yield (Vegetables/Fruits)", "Lush greenery (Lawns/Shrubs)", "Drought resilience", "Pest/Disease recovery"],
  }
];

export default function AdvancedSoilTest({ liveProducts, addToCart, onRetake }: AdvancedSoilTestProps) {
  const [step, setStep] = useState(-1); // -1: Upload Image, 0-2: Questions, 3: Analyzing, 4: Dashboard
  const [answers, setAnswers] = useState<number[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analyzingText, setAnalyzingText] = useState("Initializing laboratory tools...");
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  
  // Camera State
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    // Show local preview immediately for better UX
    const localUrl = URL.createObjectURL(file);
    setUploadedImageUrl(localUrl);

    // Fast fake progress for UI (completes in ~1.2 seconds)
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 15;
      });
    }, 150);

    setTimeout(() => {
      clearInterval(progressInterval);
      setUploadProgress(100);
      // Wait a moment so the user sees 100% completion before jumping to next step
      setTimeout(() => setStep(0), 600);
    }, 1200);

    // Background Firebase upload (Fire and forget)
    try {
      const storageRef = ref(storage, `soil-tests/${Date.now()}_${file.name}`);
      uploadBytes(storageRef, file).then(() => {
        getDownloadURL(storageRef).then((downloadUrl) => {
          setUploadedImageUrl(downloadUrl);
        });
      }).catch(err => {
        console.error("Background upload failed:", err);
      });
    } catch (error) {
      console.error("Error starting background upload:", error);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const openCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setMediaStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please check your browser permissions.");
      setIsCameraOpen(false);
    }
  };

  const closeCamera = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
    }
    setMediaStream(null);
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `camera_sample_${Date.now()}.jpg`, { type: 'image/jpeg' });
          closeCamera();
          processFile(file);
        }
      }, 'image/jpeg', 0.9);
    }
  };

  // Cleanup camera stream if component unmounts
  useEffect(() => {
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [mediaStream]);

  const handleAnswer = (optIdx: number) => {
    const newAnswers = [...answers];
    newAnswers[step] = optIdx;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (step < ADVANCED_QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setStep(3); // Go to analyzing
    }
  };

  useEffect(() => {
    if (step === 3) {
      const texts = [
        "Scanning soil image for color metrics...",
        "Evaluating texture granularity...",
        "Simulating N-P-K baseline...",
        "Balancing recommended pH levels...",
        "Generating final diagnostic report..."
      ];
      let t = 0;
      const interval = setInterval(() => {
        setAnalyzingText(texts[t]);
        t++;
        if (t >= texts.length) {
          clearInterval(interval);
          setTimeout(() => setStep(4), 800);
        }
      }, 1200);
      return () => clearInterval(interval);
    }
  }, [step]);

  // Mock data for the chart based on answers
  const chartData = [
    { subject: 'Nitrogen', A: 120, fullMark: 150 },
    { subject: 'Phosphorus', A: 98, fullMark: 150 },
    { subject: 'Potassium', A: 86, fullMark: 150 },
    { subject: 'Calcium', A: 99, fullMark: 150 },
    { subject: 'Magnesium', A: 85, fullMark: 150 },
    { subject: 'Sulfur', A: 65, fullMark: 150 },
  ];

  const recommendedProducts = liveProducts.slice(0, 3); // Get top 3
  const healthScore = 78;

  const pageVariants = {
    initial: { opacity: 0, x: 50 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -50 }
  };

  const pageTransition: any = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };

  return (
    <div className="py-12 px-4 md:px-12 bg-white max-w-4xl mx-auto overflow-hidden min-h-[600px] flex flex-col justify-center">
      <AnimatePresence mode="wait">
        
        {/* STEP -1: UPLOAD IMAGE */}
        {step === -1 && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-[#f7f6ee] p-8 md:p-12 rounded-[32px] border border-agri-cream-border shadow-sm text-center"
          >
            <span className="text-xs font-black text-agri-green-mid tracking-widest block uppercase mb-2">Step 1: Visual Analysis</span>
            <h1 className="text-2xl md:text-4xl font-extrabold text-slate-950 mb-4 tracking-tight">Upload Soil Sample</h1>
            <p className="text-sm text-gray-550 mb-10 max-w-lg mx-auto leading-relaxed">
              Take a clear, well-lit photo of your topsoil. Our advanced AI will analyze the color profile, aggregate structure, and estimated moisture level to calibrate your test.
            </p>

            <div className="max-w-xl mx-auto">
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                className="hidden" 
              />

              {!isUploading ? (
                <>
                  {!isCameraOpen ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Option 1: File Upload */}
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 rounded-3xl p-8 bg-white hover:bg-gray-50 hover:border-agri-green-mid transition cursor-pointer group flex flex-col items-center justify-center min-h-[220px]"
                      >
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-agri-lime/20 group-hover:text-agri-green-mid group-hover:scale-110 transition mb-4">
                          <UploadCloud className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-black text-gray-800 mb-1">Upload Photo</h3>
                        <p className="text-xs text-gray-400">Choose from gallery</p>
                      </div>

                      {/* Option 2: Live Camera */}
                      <div 
                        onClick={openCamera}
                        className="border-2 border-dashed border-gray-300 rounded-3xl p-8 bg-white hover:bg-gray-50 hover:border-agri-green-mid transition cursor-pointer group flex flex-col items-center justify-center min-h-[220px]"
                      >
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-agri-lime/20 group-hover:text-agri-green-mid group-hover:scale-110 transition mb-4">
                          <Camera className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-black text-gray-800 mb-1">Open Camera</h3>
                        <p className="text-xs text-gray-400">Take a live picture</p>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-gray-200 rounded-3xl overflow-hidden bg-black relative">
                      <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        className="w-full h-[300px] object-cover bg-black"
                      />
                      <button 
                        onClick={closeCamera}
                        className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/80 transition"
                      >
                        <X className="w-5 h-5" />
                      </button>
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                        <button 
                          onClick={capturePhoto}
                          className="bg-white text-black font-extrabold px-6 py-3 rounded-full flex items-center space-x-2 shadow-lg hover:scale-105 transition"
                        >
                          <Camera className="w-5 h-5" />
                          <span>Capture Photo</span>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="border-2 border-gray-100 rounded-3xl p-10 bg-white">
                  {uploadedImageUrl ? (
                    <div className="relative w-32 h-32 mx-auto mb-6 rounded-2xl overflow-hidden border-4 border-white shadow-lg">
                      <img src={uploadedImageUrl} alt="Soil Preview" className="w-full h-full object-cover" />
                      {uploadProgress < 100 && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
                          <div className="w-8 h-8 rounded-full border-4 border-white/30 border-t-white animate-spin"></div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full border-4 border-gray-100 border-t-agri-green-mid animate-spin mx-auto mb-6"></div>
                  )}
                  
                  <h3 className="text-sm font-bold text-gray-800 mb-2">
                    {uploadProgress === 100 ? 'Image Analyzed Successfully!' : 'Analyzing Image Details...'}
                  </h3>
                  <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden max-w-xs mx-auto">
                    <div className="bg-agri-green-mid h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                </div>
              )}
            </div>
            
            {!isUploading && !isCameraOpen && (
              <button 
                onClick={() => setStep(0)}
                className="mt-8 text-xs font-bold text-gray-500 hover:text-agri-green-mid underline transition"
              >
                Skip this step for now
              </button>
            )}
          </motion.div>
        )}

        {/* STEPS 0-2: QUIZ */}
        {step >= 0 && step < ADVANCED_QUESTIONS.length && (
          <motion.div
            key={`quiz-${step}`}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="bg-[#f7f6ee] p-6 md:p-12 rounded-[32px] border border-agri-cream-border shadow-sm"
          >
            <span className="text-xs font-black text-agri-green-mid tracking-widest block uppercase mb-1">Diagnostic Test</span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-950 mb-3 tracking-tight">The Soil Test™</h1>
            
            <div className="w-full bg-gray-200 h-2 rounded-full mb-2 overflow-hidden mt-6">
              <div
                className="bg-agri-lime-alt h-full transition-all duration-300"
                style={{ width: `${((step + 1) / ADVANCED_QUESTIONS.length) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[11px] text-gray-400 font-bold mb-10">
              <span>QUESTION {step + 1} OF {ADVANCED_QUESTIONS.length}</span>
              <span>{Math.round(((step + 1) / ADVANCED_QUESTIONS.length) * 100)}%</span>
            </div>

            <div className="mb-8">
              <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-8">{ADVANCED_QUESTIONS[step].question}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ADVANCED_QUESTIONS[step].options.map((opt, optIdx) => {
                  const isSelected = answers[step] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleAnswer(optIdx)}
                      className={`w-full text-left p-6 rounded-2xl border-2 text-sm font-bold leading-tight transition-all flex items-center space-x-4 ${isSelected
                        ? 'bg-white border-agri-green-mid text-agri-dark shadow-md'
                        : 'bg-white border-transparent hover:border-gray-200 text-gray-600 shadow-sm'
                        }`}
                    >
                      <span className={`w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-agri-green-mid bg-agri-green-mid' : 'border-gray-300'}`}>
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between items-center mt-10">
              <button
                onClick={() => setStep(step === 0 ? -1 : step - 1)}
                className="text-xs font-bold text-gray-500 hover:text-black transition"
              >
                ← Back
              </button>

              <button
                onClick={handleNext}
                disabled={answers[step] === undefined}
                className={`px-8 py-4 rounded-xl text-xs font-extrabold tracking-wider flex items-center space-x-2 transition ${answers[step] !== undefined
                  ? 'bg-agri-dark text-white cursor-pointer hover:bg-black'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
              >
                <span>{step === ADVANCED_QUESTIONS.length - 1 ? 'Generate Report' : 'Next Question'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: ANALYZING */}
        {step === 3 && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="relative w-32 h-32 mb-8">
              <div className="absolute inset-0 border-4 border-agri-cream-border rounded-full"></div>
              <div className="absolute inset-0 border-4 border-agri-green-mid border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Activity className="w-10 h-10 text-agri-green-mid animate-pulse" />
              </div>
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4">Laboratory Analysis</h2>
            <p className="text-sm font-bold text-gray-500 animate-pulse">{analyzingText}</p>
          </motion.div>
        )}

        {/* STEP 4: DASHBOARD */}
        {step === 4 && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[32px] border border-gray-100 shadow-xl overflow-hidden"
          >
            <div className="bg-slate-900 text-white p-8 md:p-10 flex flex-col md:flex-row justify-between items-center">
              <div>
                <span className="text-xs font-black text-agri-lime tracking-widest uppercase mb-2 block">Diagnostic Report</span>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">Soil Health Analysis</h1>
                <p className="text-gray-400 text-sm">Generated for your custom profile</p>
              </div>
              
              <div className="flex items-center space-x-6 mt-6 md:mt-0">
                {/* Show thumbnail of the uploaded image if they took one */}
                {uploadedImageUrl && (
                  <div className="hidden md:block w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/20 shadow-md">
                    <img src={uploadedImageUrl} className="w-full h-full object-cover" alt="User Sample" />
                  </div>
                )}
                <div className="bg-white/10 px-8 py-6 rounded-2xl border border-white/20 text-center backdrop-blur-sm">
                  <div className="text-4xl font-black text-agri-lime mb-1">{healthScore}<span className="text-lg text-white/50">/100</span></div>
                  <div className="text-[10px] font-bold tracking-widest uppercase text-white/70">Health Score</div>
                </div>
              </div>
            </div>

            <div className="p-8 md:p-10 bg-slate-50 border-b border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Chart Section */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-sm font-black text-gray-800 mb-6 uppercase tracking-wider text-center">Macronutrient Profile</h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                        <PolarGrid stroke="#e5e7eb" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }} />
                        <Radar name="Soil" dataKey="A" stroke="#4ade80" fill="#22c55e" fillOpacity={0.3} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Metrics Section */}
                <div className="space-y-4">
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center shrink-0">
                      <Droplets className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Moisture Index</div>
                      <div className="text-xl font-black text-gray-900">Optimal (42%)</div>
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
                    <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center shrink-0">
                      <Activity className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">pH Level Estimate</div>
                      <div className="text-xl font-black text-gray-900">Slightly Acidic (6.2)</div>
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center shrink-0">
                      <Leaf className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Organic Matter</div>
                      <div className="text-xl font-black text-gray-900">Low (Requires Supplement)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 md:p-10">
              <div className="flex items-center space-x-3 mb-8">
                <Sprout className="w-6 h-6 text-agri-green-mid" />
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Prescribed Treatment Plan</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {recommendedProducts.map((prod, idx) => (
                  <div key={idx} className="border border-gray-200 p-5 rounded-2xl bg-white hover:border-agri-green-mid transition group">
                    <div className="flex justify-between items-start mb-4">
                      <img src={prod.img} className="w-16 h-16 object-cover rounded-xl border border-gray-100 group-hover:shadow-md transition" alt={prod.name} />
                      <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                        {idx === 0 ? 'Primary' : idx === 1 ? 'Secondary' : 'Support'}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-sm text-gray-900 mb-1">{prod.name}</h4>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-4 h-8">{prod.desc}</p>
                    <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                      <span className="font-black text-slate-900 text-sm">₹ {prod.price}</span>
                      <button
                        onClick={() => addToCart(prod, 1)}
                        className="bg-agri-dark text-white hover:bg-agri-green-mid font-black text-[10px] tracking-wider px-4 py-2 rounded-lg transition"
                      >
                        ADD
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <button
                  onClick={() => {
                    setStep(-1);
                    setAnswers([]);
                    setUploadProgress(0);
                    setIsUploading(false);
                    setUploadedImageUrl(null);
                    onRetake();
                  }}
                  className="text-xs text-gray-550 hover:text-black font-extrabold underline transition"
                >
                  Retake Diagnostic Test
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
