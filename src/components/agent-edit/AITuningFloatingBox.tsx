import React, { useState, useRef, useEffect } from 'react';
import { AgentConfig, FileItem, Skill, EnvConfig, DataField } from '../../../types';

interface AITuningFloatingBoxProps {
  onOpenOmniTuning: () => void;
  hasUntunedKnowledge: boolean;
}

const AITuningFloatingBox: React.FC<AITuningFloatingBoxProps> = ({
  onOpenOmniTuning,
  hasUntunedKnowledge,
}) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: -24, y: -180 }); // right-6, bottom-180px (above input area)
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart]);

  return (
    <div 
      ref={boxRef}
      className={`fixed z-[100] ${isDragging ? 'cursor-grabbing' : 'cursor-pointer'} transition-transform ${hasUntunedKnowledge ? 'animate-bounce' : ''}`}
      style={{ left: position.x < 0 ? 'auto' : position.x, right: position.x < 0 ? Math.abs(position.x) : 'auto', top: position.y < 0 ? 'auto' : position.y, bottom: position.y < 0 ? Math.abs(position.y) : 'auto' }}
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        // Prevent click if we were dragging
        if (Math.abs(e.clientX - dragStart.x - position.x) > 5 || Math.abs(e.clientY - dragStart.y - position.y) > 5) {
          return;
        }
        onOpenOmniTuning();
      }}
    >
      <button
        className="flex items-center gap-2 bg-slate-800 text-white px-5 py-2.5 rounded shadow-lg hover:bg-slate-700 transition-colors pointer-events-none"
      >
        {hasUntunedKnowledge && (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        )}
        <span className="font-medium text-xs tracking-wide">AI 调优诊断</span>
      </button>
    </div>
  );
};

export default AITuningFloatingBox;
