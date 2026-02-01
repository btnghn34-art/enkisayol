import React, { useState } from 'react';
import { GRID_CONFIG, CHALLENGES } from './data/challenges';
import Grid from './components/Grid';
import { Play, RotateCcw, FastForward } from 'lucide-react';

function App() {
  const [selectedChallengeId, setSelectedChallengeId] = useState(1);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const currentChallenge = CHALLENGES.find(c => c.id === selectedChallengeId);
  const currentOption = currentChallenge?.options.find(o => o.id === selectedOptionId);

  const handlePlay = () => {
    if (selectedOptionId) {
      setResetKey(prev => prev + 1); // Reset animations
      setTimeout(() => setIsPlaying(true), 10);
    }
  };

  const handleStop = () => {
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">En Kısa Yol</h1>
        <p className="text-slate-500 mt-2">Algoritma Takip ve Analiz Simülasyonu</p>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm">1</span>
              Görev Seçimi
            </h2>
            <div className="space-y-2">
              {CHALLENGES.map(challenge => (
                <button
                  key={challenge.id}
                  onClick={() => {
                    setSelectedChallengeId(challenge.id);
                    setSelectedOptionId(null);
                    setIsPlaying(false);
                  }}
                  className={`w-full text-left p-3 rounded-xl transition-all ${
                    selectedChallengeId === challenge.id
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="font-semibold text-sm">Görev {challenge.id}</div>
                  <div className={`text-xs mt-1 ${selectedChallengeId === challenge.id ? 'text-indigo-100' : 'text-slate-500'}`}>
                   {challenge.title}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-sm">2</span>
              Algoritma (Yol) Seçimi
            </h2>
            {currentChallenge ? (
              <div className="space-y-3">
                {currentChallenge.options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setSelectedOptionId(option.id);
                      setIsPlaying(false);
                      setResetKey(prev => prev + 1);
                    }}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all group ${
                      selectedOptionId === option.id
                        ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600/20'
                        : 'border-transparent bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        selectedOptionId === option.id ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {option.label.replace(')', '')}
                      </span>
                      <span className="text-sm font-medium text-slate-700">Algoritma</span>
                    </div>
                    <p className="mt-2 text-xs text-slate-500 leading-relaxed font-mono pl-9">
                      {option.text}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-sm">Lütfen önce bir görev seçiniz.</p>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 p-8 overflow-hidden relative">
            <div className="flex justify-between items-center mb-6">
               <div>
                  <h3 className="text-xl font-bold text-slate-900">Simülasyon Alanı</h3>
                  <p className="text-sm text-slate-500">
                    {currentOption 
                      ? `Görev ${selectedChallengeId} - Algoritma ${currentOption.label}` 
                      : 'Bir algoritma seçerek analize başlayın'}
                  </p>
               </div>
               
               <div className="flex gap-2">
                 <button 
                    onClick={handlePlay}
                    disabled={!selectedOptionId}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all text-white rounded-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
                 >
                   <Play size={18} fill="currentColor" />
                   {isPlaying ? 'Yeniden Oynat' : 'Çalıştır'}
                 </button>
               </div>
            </div>

            <div className="flex justify-center items-center min-h-[400px] bg-slate-50 rounded-2xl border border-slate-100 inner-shadow">
               <Grid 
                  key={resetKey}
                  config={GRID_CONFIG} 
                  pathSteps={currentOption?.steps || []} 
                  isPlaying={isPlaying}
                  onComplete={(stats) => console.log(stats)}
                  startOverride={currentChallenge?.startOverride}
               />
            </div>
            
            <div className="mt-6 grid grid-cols-3 gap-4">
               {/* Stats placeholders */}
               <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Toplam Mesafe</div>
                  <div className="text-xl font-bold text-slate-800 mt-1" id="distance-stat">--</div>
               </div>
               <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Ziyaret Edilen</div>
                  <div className="text-xl font-bold text-slate-800 mt-1" id="visited-stat">--</div>
               </div>
               <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Durum</div>
                  <div className="text-xl font-bold text-slate-800 mt-1" id="status-stat">Bekliyor</div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
