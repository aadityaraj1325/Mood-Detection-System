import { useRef, useState, useEffect } from 'react';
import { ArrowLeft, Eraser, Trash2, Palette, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import PostGameModal from '../components/PostGameModal';

const COLORS = ['#ffffff', '#22d3ee', '#f472b6', '#a78bfa', '#fbbf24', '#34d399'];

function SandboxGame() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState(COLORS[1]);
  const [brushSize, setBrushSize] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      // Set actual size in memory (scaled to account for extra pixel density)
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * 2;
      canvas.height = rect.height * 2;
      const ctx = canvas.getContext('2d');
      ctx.scale(2, 2);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  }, []);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { offsetX, offsetY } = getCoordinates(e, canvas);
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { offsetX, offsetY } = getCoordinates(e, canvas);
    
    ctx.lineTo(offsetX, offsetY);
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.stroke();
  };

  const stopDrawing = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.closePath();
    setIsDrawing(false);
  };

  const getCoordinates = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    if (e.touches && e.touches.length > 0) {
      return {
        offsetX: e.touches[0].clientX - rect.left,
        offsetY: e.touches[0].clientY - rect.top,
      };
    }
    return {
      offsetX: e.nativeEvent.offsetX,
      offsetY: e.nativeEvent.offsetY,
    };
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    // Clear entire canvas considering scale
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="flex h-full flex-col">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/games" className="btn-icon">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="font-display text-2xl text-slate-100">Creative Sandbox</h1>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <CheckCircle size={16} /> Finish
        </button>
      </header>

      <div className="flex flex-1 flex-col md:flex-row gap-4">
        {/* Tools panel */}
        <div className="glass neo-border rounded-3xl p-4 flex md:flex-col gap-4 items-center md:w-20 md:h-full justify-start overflow-x-auto">
          <div className="flex md:flex-col gap-3 items-center">
            <Palette size={20} className="text-slate-400 mb-1" />
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`h-8 w-8 rounded-full transition-transform ${color === c ? 'scale-125 ring-2 ring-white' : ''}`}
                style={{ backgroundColor: c }}
                aria-label={`Color ${c}`}
              />
            ))}
          </div>
          
          <div className="w-[1px] h-8 md:w-8 md:h-[1px] bg-white/10 my-1 shrink-0" />
          
          <div className="flex md:flex-col gap-3 items-center shrink-0">
            <button
              onClick={() => setColor('transparent')} // Actually we can't stroke transparent easily for erasing over existing strokes on a transparent canvas. Wait, we can use globalCompositeOperation.
              // For simplicity, just use dark color matching background
              onPointerDown={() => {
                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');
                ctx.globalCompositeOperation = 'destination-out';
                setColor('rgba(0,0,0,1)'); // color doesn't matter for destination-out
              }}
              onPointerUp={() => {
                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');
                ctx.globalCompositeOperation = 'source-over';
                setColor(COLORS[1]); // revert to default
              }}
              className="btn-icon text-slate-300"
              title="Eraser (Hold to erase)"
            >
              <Eraser size={20} />
            </button>
            <button onClick={clearCanvas} className="btn-icon text-rose-400" title="Clear Canvas">
              <Trash2 size={20} />
            </button>
          </div>
          
          <div className="w-[1px] h-8 md:w-8 md:h-[1px] bg-white/10 my-1 shrink-0" />
          
          <div className="flex md:flex-col gap-2 shrink-0 items-center justify-center">
            <span className="text-xs text-slate-400">Size</span>
            <input 
              type="range" 
              min="2" 
              max="20" 
              value={brushSize} 
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="w-20 md:w-24 md:-rotate-90 md:my-10 accent-cyan-400"
            />
          </div>
        </div>

        {/* Canvas Area */}
        <div className="glass neo-border flex-1 rounded-3xl relative overflow-hidden bg-slate-900/50 min-h-[400px]">
          <canvas
            ref={canvasRef}
            onPointerDown={startDrawing}
            onPointerMove={draw}
            onPointerUp={stopDrawing}
            onPointerOut={stopDrawing}
            className="absolute inset-0 h-full w-full touch-none cursor-crosshair"
          />
        </div>
      </div>
      <p className="mt-4 text-sm text-slate-400 max-w-sm mx-auto text-center">
        Doodling is a proven way to relieve stress and increase focus. Express yourself freely.
      </p>
      <PostGameModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        gameId="sandbox" 
        onComplete={() => navigate('/games')} 
      />
    </div>
  );
}

export default SandboxGame;
