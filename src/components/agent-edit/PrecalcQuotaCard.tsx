import React from 'react';
import { Landmark, Bot, ArrowRight } from 'lucide-react';

interface PrecalcQuotaCardProps {
  showBranch?: boolean;
  showAgent?: boolean;
}

export const PrecalcQuotaCard: React.FC<PrecalcQuotaCardProps> = ({ 
  showBranch = true, 
  showAgent = true 
}) => {
  return (
    <div className="flex items-stretch gap-0 w-full">
      {showBranch && (
        <div className="flex-1 border border-[#E5E6EB] rounded-[11px] p-[13px_16px] bg-[#F7F8FA]">
          <div className="text-[11px] text-[#86909C] flex items-center gap-[6px]">
            <Landmark size={14} className="text-[#3D7EDB]" /> 本月 深圳分行 预计算额度
          </div>
          <div className="flex items-baseline gap-[14px] flex-wrap mt-[3px]">
            <span className="text-[20px] font-extrabold text-[#1F2329] leading-[1.1]">
              48,000<small className="text-[11px] font-semibold text-[#86909C] ml-[3px]"> 条/月</small>
            </span>
            <div className="flex items-center gap-[6px]">
              <span className="text-[10px] font-bold rounded-[6px] px-[8px] py-[3px] bg-white text-[#4E5969] border border-[#DCE0E6]">保底 30k</span>
              <span className="text-[10px] font-bold rounded-[6px] px-[8px] py-[3px] bg-white text-[#1E3A8A] border border-[#BFD3F2]">增量 18k</span>
            </div>
          </div>
          <div className="mt-[8px]">
            <div className="text-[10px] text-[#4E5969] mb-[4px]">已用 <b className="text-[#1F2329] font-bold">32,400</b> · 剩余 <b className="text-[#1F2329] font-bold">15,600</b></div>
            <div className="h-[7px] rounded-[5px] bg-[#D7E3F5] overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#3D7EDB] to-[#1E3A8A]" style={{width: '67.5%'}}></div>
            </div>
          </div>
        </div>
      )}

      {showBranch && showAgent && (
        <div className="shrink-0 w-[80px] flex flex-col items-center justify-center gap-[2px] px-[4px]">
          <span className="text-[9px] font-bold text-[#1E3A8A] text-center leading-[1.2]">按比例<br/>分配</span>
          <ArrowRight size={14} className="text-[#6BA0E6]" />
        </div>
      )}

      {showAgent && (
        <div className={`flex-1 border border-[#CADEF8] rounded-[11px] p-[13px_16px] bg-[#E7F1FC] ${!showBranch ? 'shadow-sm' : ''}`}>
          <div className="text-[11px] text-[#86909C] flex items-center gap-[6px]">
            <Bot size={14} className="text-[#3D7EDB]" /> 本智能体 预计算额度
          </div>
          <div className="flex items-baseline gap-[14px] flex-wrap mt-[3px]">
            <span className="text-[20px] font-extrabold text-[#1E3A8A] leading-[1.1]">
              5,000<small className="text-[11px] font-semibold text-[#86909C] ml-[3px]"> 条/月</small>
            </span>
            <div className="flex items-center gap-[6px]">
              <span className="text-[10px] font-bold rounded-[6px] px-[8px] py-[3px] bg-white text-[#4E5969] border border-[#DCE0E6]">保底 2k</span>
              <span className="text-[10px] font-bold rounded-[6px] px-[8px] py-[3px] bg-white text-[#1E3A8A] border border-[#BFD3F2]">增量 3k</span>
            </div>
          </div>
          <div className="mt-[8px]">
            <div className="text-[10px] text-[#4E5969] mb-[4px]">已用 <b className="text-[#1F2329] font-bold">4,100</b> · 剩余 <b className="text-[#1F2329] font-bold">900</b></div>
            <div className="h-[7px] rounded-[5px] bg-[#D7E3F5] overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#3D7EDB] to-[#1E3A8A]" style={{width: '82%'}}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
