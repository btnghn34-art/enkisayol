import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flag, MapPin, Navigation } from 'lucide-react';
import clsx from 'clsx';

const CELL_SIZE = 80; // px
const GAP = 12; // px

const Grid = ({ config, pathSteps, isPlaying, onComplete, startOverride }) => {
  const [position, setPosition] = useState(startOverride || config.start);
  const [visited, setVisited] = useState(new Set());
  const [history, setHistory] = useState([startOverride || config.start]);
  const [status, setStatus] = useState('idle'); // idle, running, completed, error
  const [distance, setDistance] = useState(0);
  const [isOutOfBounds, setIsOutOfBounds] = useState(false);

  const containerRef = useRef(null);

  // Directions mapping
  const DIRS = {
    'N': { dx: 0, dy: -1 },
    'S': { dx: 0, dy: 1 },
    'E': { dx: 1, dy: 0 },
    'W': { dx: -1, dy: 0 },
  };

  useEffect(() => {
    // Reset state on new play
    const initialPos = startOverride || config.start;
    setPosition(initialPos);
    setVisited(new Set([`${initialPos.x},${initialPos.y}`]));
    setHistory([initialPos]);
    setStatus('idle');
    setDistance(0);
    setIsOutOfBounds(false);
    
    // Reset stats in UI (hacky but quick for now, better to lift state up)
    document.getElementById('distance-stat').innerText = '0 br';
    document.getElementById('visited-stat').innerText = '-';
    document.getElementById('status-stat').innerText = 'Hazır';

    if (isPlaying && pathSteps.length > 0) {
      runPath(initialPos);
    }
  }, [isPlaying, pathSteps, startOverride, config]);

  const runPath = async (startPos) => {
    setStatus('running');
    document.getElementById('status-stat').innerText = 'Hesaplanıyor...';
    
    let currentPos = { ...startPos };
    let currentHistory = [startPos];
    let currentVisited = new Set([`${startPos.x},${startPos.y}`]);
    let totalDist = 0;
    
    // Flatten steps into unit moves for smoother animation
    let unitMoves = [];
    for (let step of pathSteps) {
      const { dx, dy } = DIRS[step.dir];
      for (let i = 0; i < step.len; i++) {
        unitMoves.push({ dx, dy });
      }
    }

    // Execute moves
    for (let move of unitMoves) {
       await new Promise(r => setTimeout(r, 400)); // Animation delay

       const nextPos = {
         x: currentPos.x + move.dx,
         y: currentPos.y + move.dy
       };

       // Check bounds
       if (nextPos.x < 0 || nextPos.x >= config.width || nextPos.y < 0 || nextPos.y >= config.height) {
         setIsOutOfBounds(true);
         setStatus('error');
         document.getElementById('status-stat').innerText = 'Hata: Sınır Dışı!';
         document.getElementById('status-stat').className = "text-xl font-bold text-red-600 mt-1";
         return; 
       }

       currentPos = nextPos;
       currentHistory = [...currentHistory, nextPos];
       currentVisited.add(`${nextPos.x},${nextPos.y}`);
       totalDist++;

       setPosition(currentPos);
       setHistory(currentHistory);
       setVisited(new Set(currentVisited));
       setDistance(totalDist);

       document.getElementById('distance-stat').innerText = `${totalDist} br`;
       
       // Update visited UI
       const visitedSpecial = config.specialNodes.filter(n => 
         currentVisited.has(`${n.x},${n.y}`)
       );
       const visitedText = visitedSpecial.length > 0 
          ? visitedSpecial.map(n => n.type === 'red' ? '🔴' : n.type === 'blue' ? '🔵' : '🟢').join(' ')
          : '-';
       document.getElementById('visited-stat').innerText = visitedText;
    }

    setStatus('completed');
    
    // Check if reached destination
    const target = config.end; // Assuming standard end for now, TODO: support Variable End if needed (Question 3 reverses A and B)
    // Actually Question 3 says "B'den A'ya" (From B to A).
    // In code we passed startOverride.
    // We should check if currentPos matches the INTENDED destination.
    // If startOverride is used (B), then target should be A.
    
    const finalTarget = startOverride ? config.start : config.end;
    
    if (currentPos.x === finalTarget.x && currentPos.y === finalTarget.y) {
       document.getElementById('status-stat').innerText = 'Hedefe Ulaşıldı ✅';
       document.getElementById('status-stat').className = "text-xl font-bold text-green-600 mt-1";
    } else {
       document.getElementById('status-stat').innerText = 'Hedefe Ulaşamadı ❌';
       document.getElementById('status-stat').className = "text-xl font-bold text-orange-600 mt-1";
    }
  };

  const renderCells = () => {
    const cells = [];
    for (let y = 0; y < config.height; y++) {
      for (let x = 0; x < config.width; x++) {
        const isStart = (x === config.start.x && y === config.start.y);
        const isEnd = (x === config.end.x && y === config.end.y);
        const special = config.specialNodes.find(n => n.x === x && n.y === y);
        
        cells.push(
          <div 
            key={`${x}-${y}`} 
            className="relative bg-white border-2 border-slate-200 rounded-xl flex items-center justify-center transform transition-all"
            style={{ width: CELL_SIZE, height: CELL_SIZE }}
          >
             {/* Coordinate Label (Optional debug) */}
             {/* <span className="absolute top-1 left-1 text-[8px] text-slate-300 font-mono">{x},{y}</span> */}

             {/* Content */}
             {isStart && <div className="z-10 bg-slate-900 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-lg text-lg">A</div>}
             {isEnd && <div className="z-10 bg-slate-900 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-lg text-lg">B</div>}
             
             {special && (
               <div 
                 className={clsx(
                   "w-6 h-6 rounded-full shadow-md z-0",
                   special.type === 'red' && "bg-red-500",
                   special.type === 'green' && "bg-green-500",
                   special.type === 'blue' && "bg-blue-500",
                 )}
               />
             )}
          </div>
        );
      }
    }
    return cells;
  };

  return (
    <div className="relative p-8">
       {/* Background Grid Lines logic can be implicit in the flex/grid layout */}
       <div 
         className="grid gap-3 p-3 bg-slate-100/50 rounded-2xl border border-slate-200"
         style={{ 
           gridTemplateColumns: `repeat(${config.width}, ${CELL_SIZE}px)`,
           gridTemplateRows: `repeat(${config.height}, ${CELL_SIZE}px)`
         }}
       >
          {renderCells()}
       </div>

       {/* Player Marker */}
       <motion.div
         className={clsx(
           "absolute z-20 w-8 h-8 rounded-full border-4 border-white shadow-xl flex items-center justify-center transition-colors",
           isOutOfBounds ? "bg-red-600" : "bg-indigo-600"
         )}
         initial={false}
         animate={{
           left: 32 + 12 + (position.x * (CELL_SIZE + GAP)) + (CELL_SIZE/2) - 16, // Padding + Gap + Offset + Center - HalfSize
           top: 32 + 12 + (position.y * (CELL_SIZE + GAP)) + (CELL_SIZE/2) - 16,
           scale: isOutOfBounds ? [1, 1.2, 1] : 1
         }}
         transition={{ 
           type: "spring", 
           stiffness: 300, 
           damping: 30 
         }}
       >
         <Navigation size={14} className="text-white fill-white" />
       </motion.div>
       
       {/* Path Trace Line (SVG Overlay) */}
       <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 p-8 pl-[44px] pt-[44px]">
          <path
             d={history.map((pos, i) => {
               const x = (pos.x * (CELL_SIZE + GAP)) + (CELL_SIZE/2);
               const y = (pos.y * (CELL_SIZE + GAP)) + (CELL_SIZE/2);
               return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
             }).join(' ')}
             fill="none"
             stroke="#6366f1"
             strokeWidth="4"
             strokeLinecap="round"
             strokeLinejoin="round"
             className="opacity-50"
          />
       </svg>
    </div>
  );
};

export default Grid;
