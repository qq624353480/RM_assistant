import React from 'react';
import { ChatMessage, MockCustomer, TraceStep, AgentConfig } from '../../../types';
import { 
  SendIcon, BotAvatar, CheckCircleIcon, 
  LoaderIcon, ChevronDownIcon, ChevronUpIcon,
  DatabaseIcon, CodeIcon, LayersIcon, CpuIcon
} from './Icons';

interface PreviewChatProps {
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  customers: MockCustomer[];
  selectedCustomerId: string;
  onCustomerChange: (id: string) => void;
  isProcessing: boolean;
  onShowReport?: () => void;
  config?: AgentConfig;
}

const PreviewChat: React.FC<PreviewChatProps> = ({
  messages,
  onSendMessage,
  customers,
  selectedCustomerId,
  onCustomerChange,
  isProcessing,
  onShowReport,
  config
}) => {
  const [input, setInput] = React.useState('');
  const [expandedTrace, setExpandedTrace] = React.useState<Record<string, boolean>>({});
  const [expandedPlacementCards, setExpandedPlacementCards] = React.useState<Record<string, boolean>>({});
  const [selectedModel, setSelectedModel] = React.useState('qwen3-32b');
  const [isDeepThink, setIsDeepThink] = React.useState(false);
  const [showDataWarning, setShowDataWarning] = React.useState(true);
  const chatEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || isProcessing) return;
    onSendMessage(input);
    setInput('');
  };

  const toggleTrace = (msgId: string) => {
    setExpandedTrace(prev => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  const renderTrace = (trace: TraceStep[]) => (
    <div className="mt-3 space-y-2 border-l-2 border-blue-100 ml-4 pl-4 py-1">
      {trace.map((step, idx) => (
        <div key={idx} className="relative">
          <div className="flex items-center gap-2 mb-1">
            {step.type === 'router' && <LayersIcon className="w-3 h-3 text-blue-500" />}
            {step.type === 'code' && <CodeIcon className="w-3 h-3 text-purple-500" />}
            {step.type === 'prompt' && <CpuIcon className="w-3 h-3 text-indigo-500" />}
            <span className="text-[11px] font-bold text-gray-600 uppercase tracking-tight">{step.title}</span>
            {step.status === 'success' ? <CheckCircleIcon /> : <LoaderIcon />}
            {step.cost && <span className="text-[10px] text-gray-400 ml-auto">{step.cost}</span>}
          </div>
          <div className="space-y-1">
            {step.items.map((item, i) => (
              <div key={i} className="text-[10px] text-gray-500 font-mono bg-gray-50 p-1 rounded border border-gray-100 truncate">
                {item}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-white shadow-sm z-10 relative">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-sm text-gray-800">调试</h2>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Model Selector */}
          <div className="relative group">
            <select 
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-md pl-2 pr-6 py-1.5 outline-none focus:border-blue-500 appearance-none hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <option value="qwen3-32b">千问3-32B</option>
              <option value="qwen2.5">千问2.5</option>
              <option value="deepseek-r1">DeepSeek R1</option>
              <option value="cmb-model">招行自研CMB模型</option>
            </select>
            <ChevronDownIcon className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          <button className="text-xs font-medium text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-0.5">
            模型对比 <span className="text-[10px]">&gt;</span>
          </button>

          <div className="w-px h-3 bg-gray-300 mx-1" />

          {/* Deep Think Toggle */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-600 font-medium">深度思考</span>
            <button 
              onClick={() => setIsDeepThink(!isDeepThink)}
              className={`w-7 h-4 rounded-full p-0.5 transition-colors ${isDeepThink ? 'bg-blue-500' : 'bg-gray-300'}`}
            >
              <div className={`w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform ${isDeepThink ? 'translate-x-3' : 'translate-x-0'}`} />
            </button>
          </div>

          <button className="text-gray-400 hover:text-gray-600 ml-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-40 grayscale">
            <BotAvatar />
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">开始与您的智能体对话</p>
              <p className="text-xs text-gray-400">您可以测试它的知识储备和逻辑引擎</p>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            {msg.role === 'assistant' ? <BotAvatar /> : (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-bold">
                ME
              </div>
            )}
            
            <div className={`max-w-[85%] space-y-2 ${msg.role === 'user' ? 'items-end' : ''}`}>
              {/* Thinking Section */}
              {msg.thinking && (
                <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-3 text-xs text-amber-800 italic leading-relaxed">
                  <div className="flex items-center gap-1 mb-1 not-italic font-bold text-[10px] text-amber-600 uppercase tracking-wider">
                    <CpuIcon className="w-3 h-3" /> Deep Thinking
                  </div>
                  "{msg.thinking}"
                </div>
              )}

              {/* Marketing Hit Info (Placement Awareness - Simplified) */}
              {msg.role === 'assistant' && msg.marketingInfo && (
                <div className="flex items-center gap-2 mb-1.5 px-1">
                  <div className="flex items-center gap-1.5 py-0.5 px-2 bg-slate-50 border border-slate-100 rounded-full text-slate-400">
                    <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span className="text-[10px] font-medium whitespace-nowrap">
                      命中客群：{msg.marketingInfo.hitSegment} <span className="mx-1 opacity-30">|</span> 建议触发：{msg.marketingInfo.recommendedAgent}
                    </span>
                  </div>
                  {config?.singleHitDisplayMode === 'summary' && (
                    <span className="text-[9px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.2 rounded font-medium">
                      简介卡片折叠输出
                    </span>
                  )}
                </div>
              )}

              {/* Placement Card (When singleHitDisplayMode === 'summary' and marketingInfo exists) */}
              {msg.role === 'assistant' && msg.marketingInfo && config?.singleHitDisplayMode === 'summary' ? (
                <div className="bg-white border border-indigo-200/80 rounded-2xl rounded-tl-none p-3.5 shadow-sm space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 px-1.5 py-0.5 rounded">
                        智能体投放卡片
                      </span>
                      <span className="text-xs font-bold text-slate-800">
                        {config?.name || '全能财富顾问助手'}
                      </span>
                    </div>
                    <span className="text-[10px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full font-medium">
                      单命中·卡片模式
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    <span className="font-semibold text-slate-700">简介：</span>
                    {config?.description || '基于SOP预检逻辑，智能识别客户分层与持仓合规，提供对客建议。'}
                  </p>

                  <div className="p-2 bg-amber-50/70 border border-amber-200/60 rounded-lg text-[11px] text-amber-800 flex items-start gap-1.5">
                    <span className="font-bold shrink-0">推荐理由：</span>
                    <span>命中客群「{msg.marketingInfo.hitSegment}」，系统建议触发「{msg.marketingInfo.recommendedAgent}」</span>
                  </div>

                  <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">调用智能体流式输出完整回复</span>
                    <button
                      type="button"
                      onClick={() => setExpandedPlacementCards(prev => ({ ...prev, [msg.id]: !prev[msg.id] }))}
                      className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1"
                    >
                      {expandedPlacementCards[msg.id] ? (
                        <>收起完整回复 <ChevronUpIcon className="w-3.5 h-3.5" /></>
                      ) : (
                        <>查看完整回复 <ChevronDownIcon className="w-3.5 h-3.5" /></>
                      )}
                    </button>
                  </div>

                  {expandedPlacementCards[msg.id] && (
                    <div className="pt-2 border-t border-slate-100 animate-in fade-in duration-200 text-sm leading-relaxed text-slate-800 bg-slate-50/70 p-3 rounded-xl border border-slate-200/60">
                      {msg.content}
                    </div>
                  )}
                </div>
              ) : (
                /* Main Content */
                <div className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm relative ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-gray-100 text-gray-800 rounded-tl-none border border-gray-200'
                }`}>
                  {msg.content}
                </div>
              )}

              {/* Combined AI Data Efficiency & Truncation Diagnosis */}
              {msg.role === 'assistant' && (showDataWarning || selectedModel !== 'cmb-model') && msg.content.includes('告警') && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mt-2 shadow-sm animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 animate-pulse text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1.5">
                        <h4 className="text-[11px] font-bold text-slate-700">AI 数据效能诊断</h4>
                        {selectedModel !== 'cmb-model' && (
                          <span className="text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Token 溢出告警</span>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        {selectedModel !== 'cmb-model' && (
                          <div className="text-[11px] text-slate-600 leading-relaxed bg-white/40 p-2 rounded-lg border border-slate-100">
                            <p className="font-bold text-amber-700 mb-0.5 flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                              系统超长截断提示
                            </p>
                            引用的客户数据超过 8000 Token 字数限制，系统已自动截断超出的数据。
                            <p className="mt-1 text-[10px] text-slate-500 italic">
                              建议：若想获取完整上下文，请切换至 <strong className="text-blue-600">招行自研 CMB 模型</strong> (支持更大数据上限)。
                            </p>
                          </div>
                        )}

                        <p className="text-[11px] text-slate-600 leading-relaxed px-1">
                          检测到加载的 <strong className="font-semibold text-slate-900">「RM数据-平台使用情况」</strong> 与 <strong className="font-semibold text-slate-900">「市场数据-机构观点」</strong> 在当前任务 Prompt 中未被明确使用，占用较多空闲 Token。
                        </p>
                      </div>

                      <div className="mt-3 flex items-center gap-2">
                        <button 
                          onClick={() => setShowDataWarning(false)}
                          className="text-[10px] bg-slate-700 text-white px-3 py-1.5 rounded shadow-sm hover:bg-slate-800 transition-all font-medium active:scale-95"
                        >
                          一键移除冗余引用
                        </button>
                        <button 
                          onClick={() => setShowDataWarning(false)}
                          className="text-[10px] text-slate-400 hover:text-slate-600 font-medium px-1"
                        >
                          忽略建议
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Execution Trace */}
              {msg.trace && (
                <div className="space-y-1">
                  <button 
                    onClick={() => toggleTrace(msg.id)}
                    className="flex items-center gap-1 text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:text-blue-700 transition-colors"
                  >
                    {expandedTrace[msg.id] ? <ChevronUpIcon className="w-3 h-3" /> : <ChevronDownIcon className="w-3 h-3" />}
                    Execution Trace (FKDS)
                  </button>
                  {expandedTrace[msg.id] && renderTrace(msg.trace)}
                </div>
              )}
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="flex gap-3 animate-pulse">
            <BotAvatar />
            <div className="bg-gray-100 h-10 w-24 rounded-2xl rounded-tl-none" />
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-100 bg-white">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1.5 h-3 bg-blue-500 rounded-full" />
          <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wide">测试与指令</span>
        </div>
        <div className="flex gap-2 relative">
          <div className="shrink-0 flex items-center relative w-[80px]">
            <select 
              value={selectedCustomerId}
              onChange={(e) => onCustomerChange(e.target.value)}
              className="w-full text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg pl-2 pr-6 py-2.5 outline-none focus:border-blue-500 focus:bg-white hover:bg-gray-100 transition-colors appearance-none cursor-pointer h-full"
            >
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <ChevronDownIcon className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative flex-1 flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="输入指令或问题..."
              className="w-full pl-4 pr-12 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm h-full"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isProcessing}
              className={`absolute right-1.5 p-1.5 rounded-md transition-all ${
                input.trim() && !isProcessing ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-700' : 'text-gray-300'
              }`}
            >
              <SendIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewChat;
