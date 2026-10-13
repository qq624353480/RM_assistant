import React, { useState } from 'react';
import { X, ArrowRight, ChevronUp, Bot, Sparkles, Layers } from 'lucide-react';
import { AgentConfig } from '../../../types';

interface PlacementPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AgentConfig;
}

export const PlacementPreviewModal: React.FC<PlacementPreviewModalProps> = ({
  isOpen,
  onClose,
  config,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-lg rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold text-slate-800">投放卡片（简介卡片）样式预览</h3>
          </div>
          <button 
            onClick={onClose}
            className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content: Just the placement card in client insight view */}
        <div className="p-5 bg-slate-100/60 space-y-3">
          <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
            <span>终端呈现位置：客户洞察页 @claw</span>
            <span className="text-indigo-600 font-medium">卡片模式</span>
          </div>

          {/* The Placement Card (投放卡片) */}
          <div className="bg-white border border-indigo-100 rounded-xl p-4 shadow-sm space-y-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100">
                    智能体投放
                  </span>
                  <h4 className="text-[13px] font-bold text-slate-800">
                    {config.name || '全能财富顾问助手'}
                  </h4>
                </div>
                {/* 智能体简介 */}
                <p className="text-[11px] text-slate-600 leading-relaxed pt-0.5">
                  {config.description || '该智能体采用“SOP逻辑前置”架构，结合客户持仓与客户经理画像，提供专业对客理财建议。'}
                </p>
              </div>
            </div>

            {/* 推荐理由（投放条件描述） */}
            <div className="p-2.5 bg-amber-50/70 border border-amber-200/60 rounded-lg flex items-start gap-2">
              <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded shrink-0">
                推荐理由
              </span>
              <span className="text-[11px] text-amber-800 leading-normal">
                客户总资产 &gt; 50万元，活期留存比例较高，命中【重点客群激活投放】规则。
              </span>
            </div>

            {/* Action button: 查看完整回复 */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">点击按钮流式输出完整回复</span>
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1 active:scale-95"
              >
                {isExpanded ? (
                  <>收起完整回复 <ChevronUp className="w-3.5 h-3.5" /></>
                ) : (
                  <>查看完整回复 <ArrowRight className="w-3.5 h-3.5" /></>
                )}
              </button>
            </div>

            {/* Expandable Stream Content */}
            {isExpanded && (
              <div className="pt-3 border-t border-indigo-100 animate-in fade-in duration-150 space-y-1.5 text-xs text-slate-700 bg-indigo-50/30 p-3 rounded-lg">
                <div className="font-bold text-indigo-900 text-xs flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5 text-indigo-600" />
                  【{config.name || '全能财富顾问助手'}】流式回复内容：
                </div>
                <p className="leading-relaxed text-[11px] text-slate-600">
                  根据该客户的持仓深度诊断，建议将闲置资金配置本期主打的招银稳健理财季季开，提升综合收益率。
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 border-t border-slate-100 bg-white flex items-center justify-between text-[11px] text-slate-400">
          <span>单策略命中开启时按此卡片投放；多策略命中时系统自动聚合展示卡片</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};
