import React, { useState, useEffect, useRef } from 'react';

interface CompressionModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMinimized: boolean;
  setIsMinimized: (v: boolean) => void;
  hasExternalNewKnowledge?: boolean;
  setHasExternalNewKnowledge?: (v: boolean) => void;
  originalFramework: string;
  onApplyTuned: (newFramework: string) => void;
}

const CompressionModal: React.FC<CompressionModalProps> = ({ 
  isOpen, 
  onClose, 
  isMinimized,
  setIsMinimized,
  hasExternalNewKnowledge,
  setHasExternalNewKnowledge,
  originalFramework,
  onApplyTuned 
}) => {
  const [activeTab, setActiveTab] = useState<'prompt-diff' | 'output-diff'>('prompt-diff');
  const [testQuestion, setTestQuestion] = useState('王总有一笔 100 万大额存单即将到期，我该怎么切入？');
  const [hasRunTest, setHasRunTest] = useState(false);
  const [isGeneratingTest, setIsGeneratingTest] = useState(false);

  // Chat State
  const [chatMessages, setChatMessages] = useState<{role: 'system' | 'ai' | 'user', content: string}[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTuning, setIsTuning] = useState(false);

  // Tuned Framework State
  const [tunedFramework, setTunedFramework] = useState(originalFramework);
  const [hasNewKnowledge, setHasNewKnowledge] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize Chat
  useEffect(() => {
    if (isOpen) {
      setTunedFramework(originalFramework);
      setHasRunTest(false);
      
      // Handle external trigger or random simulation if no external trigger is provided
      if (hasExternalNewKnowledge) {
        setHasNewKnowledge(true);
      } else if (Math.random() > 0.8) { // Reduced random probability
        setHasNewKnowledge(true);
      }

      setChatMessages([
        {
          role: 'system',
          content: '正在评估挂载知识库总容量...共计约 6.1 万字。触发超大文本处理规则。'
        },
        {
          role: 'ai',
          content: '您好！我已经阅读了您配置的《分行吸金话术大全》等 3 份文档，并将其精华压缩成“知识插件”无缝融合到了您的框架中。👉 请查看右侧的【对比视图】。\n\n如果您对提取的颗粒度、语气或者保留的内容有其他要求（例如：“请保留更多绝对禁忌”、“话术再口语化一点”），请随时向我下发指令。'
        }
      ]);
      // Simulate initial tuning
      setTunedFramework(
`${originalFramework}

---
### 智能外挂知识库集 (AI Injected)
【破冰引流策略】
- 客群猎手：关注大额存单到期、资金异动（净流入）的活跃主力客群。
- 标准沟通脚本：“针对您近期账户内的结余类资金，是否有考虑做进一步的归集规划呢？”
- 特色专案预备：提供专属行外吸金组合（约 0.5% 相对溢价增强）。

【高净值防流失核心思维】
- 绝对禁忌：严禁陷入单一产品年化收益维度的“价格战”。
- 引导方向：从客户底层需求（资产大盘隔离、多目标长远规划）进行宏观切入。`
      );
    }
  }, [isOpen, originalFramework]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  const handleSendMessage = () => {
    if (!inputValue.trim() || isTuning) return;
    
    const userMessage = inputValue;
    setInputValue('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTuning(true);

    // Simulate LLM processing tuning request
    setTimeout(() => {
       setChatMessages(prev => [...prev, { role: 'system', content: `[指令下发] 正在结合反馈: "${userMessage}" 进行二次蒸馏迭代...` }]);
       
       setTimeout(() => {
         setChatMessages(prev => [...prev, { role: 'ai', content: '✅ 调优完成！我已经补齐了合规纪律强制维度的刚性约束，并剔除了一些冗长的铺垫。右侧是最新的调优框架。您可以继续测试效果或直接应用。' }]);
         
         setTunedFramework(prev => 
`${prev}

【合规展业执行纪律】
- 系统留痕：业务沟通结束后，强制要求在 CRM 回访系统中记录实质详情。
- 单据凭证：现场签约必须拍照留存清晰的 JPG/PDF 格式双录确认或确认单据。`
         );
         setIsTuning(false);
         // Reset test if switched
         if (hasRunTest) {
           setHasRunTest(false);
         }
       }, 1500);
    }, 500);
  };

  const handleRunTest = () => {
    if (isGeneratingTest) return;
    setIsGeneratingTest(true);
    setHasRunTest(false);
    
    setTimeout(() => {
      setHasRunTest(true);
      setIsGeneratingTest(false);
    }, 1200);
  };

  if (!isOpen) return null;

  // Minimized View (Floating Tray)
  if (isMinimized) {
    return (
      <div 
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 z-[200] flex items-center gap-3 bg-white border-2 border-indigo-500 rounded-2xl p-3 shadow-2xl cursor-pointer hover:scale-105 transition-all animate-bounce-subtle"
      >
        <div className="relative">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <svg className={`w-6 h-6 ${isTuning || isGeneratingTest ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          {(isTuning || isGeneratingTest) && (
             <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full animate-ping" />
          )}
        </div>
        <div className="pr-2">
           <p className="text-[11px] font-bold text-slate-800">AI 调优正在后台运行</p>
           <p className="text-[10px] text-slate-500">点击恢复对比视图</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsMinimized(true)}>
      <div 
        className="bg-white rounded-2xl shadow-2xl w-[1200px] h-[85vh] flex flex-col overflow-hidden border border-slate-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-800 leading-tight">框架调优</h2>
              <p className="text-[11px] font-medium text-slate-500 mt-0.5 whitespace-nowrap overflow-hidden">
                {isTuning ? (
                  <span className="text-indigo-600 flex items-center gap-1.5">
                    <svg className="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    正在接力滚动提炼知识并融合框架...
                  </span>
                ) : isGeneratingTest ? (
                  <span className="text-emerald-600 flex items-center gap-1.5">
                    <svg className="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    正在并发运行 A/B 测试对比...
                  </span>
                ) : (
                  "多轮对话打磨长文本提炼，一键注入强化指令"
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button
               onClick={() => {
                  onApplyTuned(tunedFramework);
                  onClose();
               }}
               disabled={isTuning || isGeneratingTest}
               className={`px-4 py-2 text-sm font-bold rounded-lg transition-all shadow-sm flex items-center gap-2 ${
                 isTuning || isGeneratingTest 
                   ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                   : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md'
               }`}
             >
               {(isTuning || isGeneratingTest) ? (
                 <><svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg> 处理中...</>
               ) : (
                 <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> 接受并应用调优</>
               )}
             </button>
             <button onClick={() => setIsMinimized(true)} className="text-slate-400 hover:text-slate-600 transition-colors bg-white p-2 rounded-full shadow-sm border border-slate-200 mr-1" title="最小化到后台">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" /></svg>
             </button>
             <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors bg-white p-2 rounded-full shadow-sm border border-slate-200">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
          </div>
        </div>

        {/* Body Split */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-100/50 relative">
          
          {/* New Knowledge Alert Banner */}
          {hasNewKnowledge && (
            <div className="bg-amber-50 border-b border-amber-100 px-6 py-2 flex items-center justify-between animate-in slide-in-from-top duration-300">
               <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                  <span className="text-[12px] font-bold text-amber-800">
                    检测到知识库更新：您上传了新文档《2026 Q3 竞品对比研究》，是否将其增量同步至当前框架？
                  </span>
               </div>
               <button 
                 onClick={() => {
                   setHasNewKnowledge(false);
                   if (setHasExternalNewKnowledge) {
                     setHasExternalNewKnowledge(false);
                   }
                   setChatMessages(prev => [...prev, { role: 'system', content: '[增量同步] 正在读取新文档《2026 Q3 竞品对比研究》...' }]);
                   setTimeout(() => {
                     setChatMessages(prev => [...prev, { role: 'ai', content: '✅ 增量同步完成！我已将竞品对比中的 3 条核心优势策略注入到了“配置建议”模块。' }]);
                     setTunedFramework(prev => `${prev}\n\n【竞品防御策略】\n- 优势对垒：面对竞行高收益理财，强调我行的“当日到账”流动性优势。`);
                   }, 1500);
                 }}
                 className="text-[11px] bg-amber-500 text-white px-3 py-1 rounded-md font-bold hover:bg-amber-600 transition-all shadow-sm"
               >
                 立即同步增量知识
               </button>
            </div>
          )}

          <div className="flex-1 flex overflow-hidden">
            {/* Left panel: Chat & Control */}
            <div className="flex flex-col w-[380px] border-r border-slate-200 bg-white shrink-0">
             
             {/* Chat History */}
             <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map((msg, idx) => {
                   if (msg.role === 'system') {
                      return (
                         <div key={idx} className="flex justify-center">
                            <div className="bg-slate-100 text-slate-500 text-[10px] px-3 py-1 rounded-full font-mono border border-slate-200">
                               {msg.content}
                            </div>
                         </div>
                      );
                   }
                   if (msg.role === 'user') {
                      return (
                        <div key={idx} className="flex justify-end pr-2">
                           <div className="bg-indigo-600 text-white text-[13px] px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[85%] shadow-sm leading-relaxed">
                              {msg.content}
                           </div>
                        </div>
                      );
                   }
                   return (
                     <div key={idx} className="flex items-start gap-2 pl-2">
                        <div className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 mt-1">
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 text-slate-700 text-[13px] px-4 py-3 rounded-2xl rounded-tl-sm max-w-[85%] shadow-sm leading-relaxed whitespace-pre-wrap">
                           {msg.content}
                        </div>
                     </div>
                   );
                })}
                {isTuning && (
                   <div className="flex items-start gap-2 pl-2 animate-pulse">
                      <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center shrink-0 mt-1">
                         <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                      </div>
                   </div>
                )}
                <div ref={chatEndRef} />
             </div>

             {/* Chat Input */}
             <div className="p-4 bg-white border-t border-slate-100 shrink-0">
                <div className="relative">
                   <textarea
                     className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-12 text-[13px] text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all resize-none shadow-inner"
                     rows={3}
                     placeholder="例如：'请补充原文中的所有数字标准', '语气再严厉一些'"
                     value={inputValue}
                     onChange={(e) => setInputValue(e.target.value)}
                     onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                           e.preventDefault();
                           handleSendMessage();
                        }
                     }}
                     disabled={isTuning}
                   />
                   <button 
                     onClick={handleSendMessage}
                     disabled={!inputValue.trim() || isTuning}
                     className={`absolute bottom-3 right-3 w-8 h-8 rounded-lg flex items-center justify-center transition-all \${
                        !inputValue.trim() || isTuning ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
                     }`}
                   >
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                   </button>
                </div>
                <div className="flex gap-2 mt-2">
                   <button onClick={() => setInputValue("多补充一些销售破冰的话术")} className="text-[10px] bg-slate-50 border border-slate-200 px-2 py-1 rounded text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors truncate max-w-[150px]">多补充破冰话术</button>
                   <button onClick={() => setInputValue("把内容精简到 500 字以内")} className="text-[10px] bg-slate-50 border border-slate-200 px-2 py-1 rounded text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors truncate max-w-[150px]">过度冗长，更精简些</button>
                </div>
             </div>
          </div>

          {/* Right panel: Diff Viewer */}
          <div className="flex flex-col flex-1 bg-slate-50">
            {/* Tabs */}
            <div className="flex items-center px-6 pt-3 bg-white border-b border-slate-200 gap-6 shrink-0">
               <button 
                 onClick={() => setActiveTab('prompt-diff')}
                 className={`pb-3 text-[13px] font-bold transition-colors relative \${activeTab === 'prompt-diff' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
               >
                 提示词对比 (Prompt Diff)
                 {activeTab === 'prompt-diff' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></div>}
               </button>
               <button 
                 onClick={() => setActiveTab('output-diff')}
                 className={`pb-3 text-[13px] font-bold transition-colors relative flex items-center gap-1.5 \${activeTab === 'output-diff' ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
               >
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                 输出效果 A/B 评估
                 {activeTab === 'output-diff' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 rounded-t-full"></div>}
               </button>
            </div>

            {/* Prompt Diff Content */}
            {activeTab === 'prompt-diff' && (
              <div className="flex-1 flex overflow-hidden p-4 gap-4 animate-in fade-in">
                 {/* Original */}
                 <div className="flex-1 flex flex-col bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden opacity-90">
                    <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                       <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
                         <div className="w-2 h-2 bg-slate-300 rounded-full" /> 原始提取前框架
                       </span>
                    </div>
                    <textarea 
                       readOnly
                       className="flex-1 w-full bg-transparent p-4 text-[12px] font-mono text-slate-500 resize-none outline-none focus:outline-none cursor-not-allowed selection:bg-slate-200"
                       value={originalFramework}
                    />
                 </div>

                 <div className="flex items-center text-slate-300 px-1 shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                 </div>

                 {/* Tuned */}
                 <div className="flex-1 flex flex-col bg-indigo-50/10 border-2 border-indigo-200 rounded-xl shadow-sm overflow-hidden relative">
                    <div className="bg-indigo-50/50 px-4 py-2.5 border-b border-indigo-100 flex items-center justify-between">
                       <span className="text-[11px] font-bold text-indigo-700 flex items-center gap-1.5">
                         <div className={`w-2 h-2 rounded-full ${isTuning ? 'bg-indigo-500 animate-pulse' : 'bg-green-500'}`} /> 
                         {isTuning ? '正在调优框架中...' : '当前调优后框架 (可二次微调)'}
                       </span>
                       <button 
                         onClick={() => setShowInventory(!showInventory)}
                         className={`text-[10px] flex items-center gap-1 px-2 py-1 rounded transition-all ${showInventory ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50'}`}
                         title="查看被压缩/移除的知识原件"
                       >
                         <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                         知识回溯
                       </button>
                    </div>
                    <div className="flex-1 relative group">
                       <textarea 
                         className="absolute inset-0 w-full h-full bg-white p-4 text-[12px] font-mono text-slate-800 resize-none outline-none focus:outline-none focus:ring-0 leading-relaxed border-0"
                         value={tunedFramework}
                         onChange={(e) => setTunedFramework(e.target.value)}
                       />
                       
                       {/* Knowledge Inventory Popover */}
                       {showInventory && (
                         <div className="absolute top-2 right-2 w-64 bg-white border border-slate-200 shadow-xl rounded-xl z-50 animate-in zoom-in-95 duration-200 flex flex-col max-h-[300px]">
                            <div className="p-3 border-b border-slate-100 bg-slate-50 rounded-t-xl">
                               <p className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">已移除/压缩的背景知识</p>
                               <p className="text-[10px] text-slate-500">点击下方片段尝试捞回</p>
                            </div>
                            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                               {[
                                 "由于分行在节假期的特殊排班建议...",
                                 "关于理财经理办公室着装的标准规范...",
                                 "历史参考：2024年部分失败案例分析片段...",
                                 "复杂的内部风控流转审批节点表格..."
                               ].map((item, i) => (
                                 <div 
                                   key={i} 
                                   onClick={() => {
                                      setTunedFramework(prev => `${prev}\n\n【补录知识】\n- ${item}`);
                                      setShowInventory(false);
                                      setChatMessages(prev => [...prev, { role: 'system', content: `[调优回溯] 已成功将“${item.substring(0, 10)}...”重新注入框架。` }]);
                                   }}
                                   className="p-2 border border-dashed border-slate-200 rounded-lg text-[10px] text-slate-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 cursor-pointer transition-all"
                                 >
                                   {item}
                                 </div>
                               ))}
                            </div>
                         </div>
                       )}
                    </div>
                 </div>
              </div>
            )}

            {/* Output Diff Content */}
            {activeTab === 'output-diff' && (
              <div className="flex-1 flex flex-col overflow-hidden p-4 gap-4 animate-in fade-in">
                 {/* Input Simulator */}
                 <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm flex items-center gap-4 shrink-0">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center shrink-0">
                       <span className="text-lg">👤</span>
                    </div>
                    <input 
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-800 outline-none focus:border-emerald-400 focus:bg-white transition-colors"
                      placeholder="输入测试问题..."
                      value={testQuestion}
                      onChange={(e) => setTestQuestion(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRunTest();
                      }}
                    />
                    <button 
                      onClick={handleRunTest}
                      disabled={isGeneratingTest || !testQuestion.trim()}
                      className="px-6 py-2 bg-emerald-500 text-white font-bold text-sm rounded-lg hover:bg-emerald-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isGeneratingTest ? (
                        <><svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg> 生成比对中...</>
                      ) : (
                         "并发测试运行"
                      )}
                    </button>
                 </div>

                 {/* Results Split */}
                 <div className="flex-1 flex gap-4 overflow-hidden">
                    {/* Before */}
                    <div className="flex-1 flex flex-col bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden opacity-90">
                       <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 flex items-center justify-between shrink-0">
                          <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
                            【A】基于原始框架回答 (无增强)
                          </span>
                       </div>
                       <div className="flex-1 p-5 overflow-y-auto text-[13px] text-slate-600 leading-relaxed font-sans max-w-none">
                          {!hasRunTest ? (
                             <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50">
                                <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                                <p>等待模拟下发...</p>
                             </div>
                          ) : (
                             <div className="animate-in fade-in space-y-3">
                               <p>您好！面对这类客户产生大额资金到期，这是一个很好的机会。可以按照以下三个模块开展：</p>
                               <h4 className="font-bold text-slate-800">1. 客户洞察</h4>
                               <p>他有100万存单，说明他是优质的高净值客户，风险承受能力可能偏稳健或中等。</p>
                               <h4 className="font-bold text-slate-800">2. 破冰切入</h4>
                               <p>可以尝试给他打个电话，问候一下近况。顺便告诉他有一笔钱到期了。</p>
                               <h4 className="font-bold text-slate-800">3. 配置建议</h4>
                               <p>结合当前环境，推荐我们的主打理财或者大额存单续作。这样不仅安全，也能基本抵御通胀。</p>
                               <div className="mt-4 p-3 bg-red-50 text-red-600 rounded text-xs border border-red-100 flex gap-2">
                                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                  <span>专家评估：回答过于泛泛，缺乏专属话术抓手，未能有效利用吸金资料库中的“防流失”思想。</span>
                               </div>
                             </div>
                          )}
                       </div>
                    </div>

                    {/* After */}
                    <div className="flex-1 flex flex-col bg-emerald-50/10 border-2 border-emerald-200 rounded-xl shadow-sm overflow-hidden relative">
                       <div className="bg-emerald-50 px-4 py-2 border-b border-emerald-100 flex items-center justify-between shrink-0">
                          <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1.5">
                            【B】调优后框架回答 (含内化的高浓缩知识)
                          </span>
                       </div>
                       <div className="flex-1 p-5 overflow-y-auto text-[13px] text-slate-800 leading-relaxed font-sans max-w-none">
                          {!hasRunTest ? (
                             <div className="h-full flex flex-col items-center justify-center text-emerald-400 opacity-50">
                                <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <p>等待模拟下发...</p>
                             </div>
                          ) : (
                             <div className="animate-in fade-in space-y-3">
                               <p>您好！面对这类活跃的主力客群，这笔百万级资金不仅是留存机会，更是深耕客户价值的绝佳切入点。建议执行以下标准动作：</p>
                               <h4 className="font-bold text-slate-800">1. 客户洞察</h4>
                               <p>该客户属于目标客群中的「大额存单即将到期」高潜力价值户。客户的核心痛点绝不仅仅是收益比拼，而在于大波段下的资产隔离安全与综合规划需要。</p>
                               <h4 className="font-bold text-slate-800">2. 破冰切入</h4>
                               <p>请<strong className="text-emerald-600">务必避免</strong>直接生硬推销理财产品或死磕收益率。建议采用以下标准脚本展开：<br/><br/>
                               <em>“王总您好，这边是某某银行，留意到您近期账户内资金流转情况，针对这笔即将到期的结余资金，是否有意考虑做更优的长期资产大盘归集和隔离规划呢？”</em></p>
                               <h4 className="font-bold text-slate-800">3. 配置建议</h4>
                               <p>在引发客户对长期规划的共鸣后，适时抛出我行现有的<strong>约 0.5% 相对溢价的专属行外吸金迎新组合</strong>。强调这是针对高端客层开放的限额定制。<br/><br/>
                               <span className="text-red-500 font-bold">🚨 合规刚性约束：</span>确认客户意向并完成面签后，务必双录留档，并即时在 CRM 大系统内提交一张清晰的确认单 JPG/PDF，否则绩效不予确认。</p>
                               
                               <div className="mt-4 p-3 bg-emerald-50 text-emerald-700 rounded text-xs border border-emerald-200 flex gap-2">
                                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" /></svg>
                                  <span>专家评估：知识融合度极高，精准命中破冰话术、忌讳（价格战）及红线（CRM纪律），实操价值满分 🚀。</span>
                               </div>
                             </div>
                          )}
                       </div>
                    </div>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default CompressionModal;

