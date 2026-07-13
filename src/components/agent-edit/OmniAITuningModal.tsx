import React, { useState, useEffect, useRef } from "react";
import {
  AgentConfig,
  FileItem,
  Skill,
  EnvConfig,
  DataField,
  ChatMessage,
  EvaluationResult,
  MockCustomer,
} from "../../../types";
import {
  calculateStaticScore,
  evaluateAgentDynamic,
} from "./services/evaluationService";
import { MOCK_CUSTOMERS } from "./constants";
import { ChevronDown, ChevronRight, CheckCircle2, XCircle, Beaker, Check, X, RefreshCw } from "lucide-react";

interface OmniAITuningModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AgentConfig;
  chatHistory: ChatMessage[];
  files: FileItem[];
  skills: Skill[];
  envConfig: EnvConfig;
  dataFields: DataField[];
  onApplyTuned: (newInstructions: string) => void;
}

interface DiagData {
  score: number;
  dynScore: number;
  tips: string[];
  dimensions: {
    framework: string;
    knowledge: string;
    data: string;
    skills: string;
  }
}

interface TuningMessage {
  id: string;
  role: "system" | "user" | "assistant";
  content: string;
  type?: "text" | "diag_report" | "tuning_result";
  diagData?: DiagData;
  proposedText?: string;
}

const OmniAITuningModal: React.FC<OmniAITuningModalProps> = ({
  isOpen,
  onClose,
  config,
  chatHistory,
  files,
  skills,
  envConfig,
  dataFields,
  onApplyTuned,
}) => {
  const [messages, setMessages] = useState<TuningMessage[]>([]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeReport, setActiveReport] = useState<DiagData | null>(null);
  const [activeFullFramework, setActiveFullFramework] = useState<string | null>(
    null,
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      startEvaluation();
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isProcessing]);

  const startEvaluation = async () => {
    const evalStartId = Date.now().toString();

    // Loading stages
    setMessages([{ id: evalStartId, role: "system", content: "诊断中：正在扫描挂载知识库与结构化数据资产..." }]);
    await new Promise((resolve) => setTimeout(resolve, 800));

    setMessages([{ id: evalStartId, role: "system", content: "诊断中：正在分析应答框架与历史对话日志的匹配度..." }]);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const { score, tips } = calculateStaticScore(config, files, skills, envConfig, dataFields);
    let dynScore = 0;
    let dynSuggestions: string[] = [];
    
    if (chatHistory.length > 0) {
      try {
        const dynEval = await evaluateAgentDynamic(config, chatHistory);
        dynScore = dynEval.dynamicScore;
        dynSuggestions = dynEval.suggestions;
      } catch (e) {
        dynSuggestions = ["诊断过程中检测到对话日志过于简略，建议补充多轮复杂测试用例。"];
      }
    }

    const diagData: DiagData = {
      score,
      dynScore,
      tips: [...tips, ...dynSuggestions],
      dimensions: {
        framework: config.instructions.length > 100 ? "详尽" : "需要补充细节",
        knowledge: files.length > 0 ? "已挂载" : "缺失文档上下文",
        data: dataFields.length > 0 ? "已挂载结构化数据" : "缺失",
        skills: skills.filter((s) => s.selected).length > 0 ? "已配置插件" : "未挂载",
      }
    };

    setMessages((prev) => {
      const filtered = prev.filter((m) => m.id !== evalStartId);
      return [
        ...filtered,
        { 
          id: (Date.now() + 1).toString(), 
          role: "assistant", 
          content: "为您生成了最新的智能体体检报告：",
          type: "diag_report",
          diagData 
        },
      ];
    });
  };

  const submitTuningReq = async (userPrompt: string, isAuto: boolean = false) => {
    if (!userPrompt.trim()) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: "user", content: userPrompt },
    ]);
    setInput("");
    setIsProcessing(true);
    setActiveReport(null); // Close report view when tuning starts
    setActiveFullFramework(null); // Close framework preview when tuning starts

    setTimeout(() => {
      const addedPrompt = isAuto
        ? `\n\n### 补充优化记录\n根据诊断建议系统进行了以下优化:\n1. 增加了兜底话术。\n2. 强化了数据指标说明。`
        : `\n\n### 补充优化指南\n${userPrompt}`;

      const newFramework = config.instructions + addedPrompt;

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "已生成新的框架版本，您可以查看对比测试或决定是否采纳：",
          type: "tuning_result",
          proposedText: newFramework,
        },
      ]);
      setIsProcessing(false);
    }, 1500);
  };

  const DiagnosticReportCard = ({ diagData }: { diagData: DiagData }) => {
    return (
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm mt-2 overflow-hidden max-w-[95%]">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
              <span className="text-sm font-bold text-slate-700">{diagData.score}</span>
            </div>
            <div>
              <h4 className="text-[13px] font-bold text-slate-800">深度诊断报告</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">静态配置评分 {diagData.score} 分</p>
            </div>
          </div>
          <button 
            onClick={() => setActiveReport(diagData)}
            className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded transition-colors"
          >
            查看完整报告
          </button>
        </div>
      </div>
    );
  };

  const FullReportView = ({ diagData }: { diagData: DiagData }) => (
    <div className="flex-1 flex flex-col bg-white border-l border-slate-100 animate-in slide-in-from-right duration-300">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <h4 className="font-bold text-[14px] text-slate-800">智能体体检报告详情</h4>
        <button onClick={() => setActiveReport(null)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Score Header */}
        <div className="flex items-center gap-6">
           <div className="w-20 h-20 rounded-full border-4 border-indigo-500 flex flex-col items-center justify-center shadow-lg shadow-indigo-100">
             <span className="text-2xl font-black text-slate-800">{diagData.score}</span>
             <span className="text-[10px] text-slate-400 font-bold uppercase">Points</span>
           </div>
           <div className="flex-1">
             <div className="flex items-center gap-2 mb-1">
               <CheckCircle2 className="w-4 h-4 text-emerald-500" />
               <span className="text-[12px] font-bold text-slate-700">整体运行状态良好</span>
             </div>
             <p className="text-[11px] text-slate-500 leading-relaxed">
               该智能体在知识挂载与插件配置维度表现优异，但应答框架的精细化程度仍有提升空间，建议针对边缘场景补充兜底逻辑。
             </p>
           </div>
        </div>

        {/* Dimensions */}
        <div>
          <h5 className="text-[12px] font-bold text-slate-800 mb-3 flex items-center gap-2">
            <div className="w-1 h-3 bg-indigo-500 rounded-full"></div>
            FKDS 核心维度分析
          </h5>
          <div className="grid grid-cols-2 gap-3">
             {[
               { label: 'Framework 应答框架', val: diagData.dimensions.framework, score: 75 },
               { label: 'Knowledge 知识库', val: diagData.dimensions.knowledge, score: 90 },
               { label: 'Data 结构化数据', val: diagData.dimensions.data, score: 85 },
               { label: 'Skills 功能插件', val: diagData.dimensions.skills, score: 60 }
             ].map((d, i) => (
               <div key={i} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                 <div className="flex justify-between items-center mb-2">
                   <span className="text-[11px] font-bold text-slate-600">{d.label}</span>
                   <span className="text-[10px] font-mono text-indigo-500">{d.score}%</span>
                 </div>
                 <div className="text-[11px] text-slate-800 font-medium mb-2">{d.val}</div>
                 <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                   <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${d.score}%` }}></div>
                 </div>
               </div>
             ))}
          </div>
        </div>

        {/* Detailed Suggestions */}
        <div>
          <h5 className="text-[12px] font-bold text-slate-800 mb-3 flex items-center gap-2">
            <div className="w-1 h-3 bg-indigo-500 rounded-full"></div>
            深度优化路径建议
          </h5>
          <div className="space-y-3">
            {diagData.tips.map((tip, idx) => (
              <div key={idx} className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                 <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                       <span className="text-[10px] font-bold text-orange-600">{idx + 1}</span>
                    </div>
                    <div className="flex-1">
                       <p className="text-[12px] text-slate-700 leading-relaxed font-medium">{tip}</p>
                       <p className="text-[10px] text-slate-400 mt-1">建议：在框架末尾增加相关角色的约束指令。</p>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 flex gap-3">
           <button 
             onClick={() => submitTuningReq("请根据全面诊断报告的全部建议，直接为我进行底层框架深度调优完善", true)}
             className="flex-1 py-3 bg-indigo-600 text-white text-[12px] font-bold rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-100 active:scale-[0.98]"
           >
             采纳并自动调优
           </button>
           <button 
             onClick={() => setActiveReport(null)}
             className="px-6 py-3 border border-slate-200 text-slate-600 text-[12px] font-bold rounded-xl hover:bg-slate-50 transition-colors"
           >
             暂不处理
           </button>
        </div>
      </div>
    </div>
  );

  const FullFrameworkView = ({ text }: { text: string }) => (
    <div className="flex-1 flex flex-col bg-slate-900 border-l border-slate-700 animate-in slide-in-from-right duration-300">
      <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-slate-800">
        <h4 className="font-bold text-[14px] text-white flex items-center gap-2">
          <Beaker className="w-4 h-4 text-emerald-400" />
          查看调优后框架
        </h4>
        <button
          onClick={() => setActiveFullFramework(null)}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-0 flex flex-col">
        <div className="p-6 bg-slate-800/50 border-b border-white/5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              PROPOSED INSTRUCTIONS
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onApplyTuned(text);
                  onClose();
                }}
                className="px-4 py-1.5 bg-emerald-600 text-white text-[11px] font-bold rounded-lg hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-900/20"
              >
                采纳此版本
              </button>
            </div>
          </div>
          <div className="font-mono text-[12px] text-emerald-400/90 whitespace-pre-wrap leading-relaxed">
            {text}
          </div>
        </div>
        <div className="flex-1 p-6 space-y-6">
          <h5 className="text-[12px] font-bold text-slate-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            调优内容摘要
          </h5>
          <div className="grid grid-cols-1 gap-4">
            {[
              {
                title: "知识统一性",
                desc: "已将挂载的《银行零售业务规定》中的 12 条核心规则注入回复逻辑。",
              },
              {
                title: "幻觉控制",
                desc: "增加了“仅依据知识回答”的强约束指令，降低了模型在缺失数据时的发散性。",
              },
              {
                title: "格式规范",
                desc: "优化了回复的排版结构，强制使用标准化的分点说明格式。",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 p-4 rounded-xl"
              >
                <div className="text-[13px] font-bold text-white mb-1">
                  {item.title}
                </div>
                <div className="text-[11px] text-slate-400">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const TuningResultCard = ({ msg }: { msg: TuningMessage }) => {
    const [expanded, setExpanded] = useState(false);
    const [compTest, setCompTest] = useState("");
    const [isComparing, setIsComparing] = useState(false);
    const [oldRes, setOldRes] = useState("");
    const [newRes, setNewRes] = useState("");
    
    const [selectedCustId, setSelectedCustId] = useState(MOCK_CUSTOMERS[0].id);
    
    const doCompare = () => {
       if (!compTest.trim()) return;
       setIsComparing(true);
       const customer = MOCK_CUSTOMERS.find(c => c.id === selectedCustId);
       setTimeout(() => {
         setOldRes(`[旧版] 针对客户【${customer?.name}】，回答“${compTest}”建议：对不起，我暂时无法直接回答该复杂业务问题。`);
         setNewRes(`[新版] 收到！针对客户【${customer?.name}】（${customer?.label}），我已经根据最新查阅的规程为您补充了应答逻辑：\n1. 结合客户特征进行动态推荐\n2. 增加专业术语解释。`);
         setIsComparing(false);
       }, 1000);
    };

    return (
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm mt-2 overflow-hidden max-w-[98%] text-left">
        {/* Header Action */}
        <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
           <span className="text-[12px] font-bold text-slate-700 flex items-center gap-2">
             <RefreshCw className="w-4 h-4 text-indigo-500" /> 新框架生成完毕
           </span>
           <div className="flex items-center gap-2">
             <button 
               onClick={() => { onApplyTuned(msg.proposedText!); onClose(); }}
               className="text-[11px] font-bold bg-emerald-600 text-white px-3 py-1.5 rounded hover:bg-emerald-500 transition-colors flex items-center gap-1"
             >
               <Check className="w-3 h-3" /> 使用新框架
             </button>
           </div>
        </div>

        {/* Framework Diff Preview */}
        <div className="p-3 border-b border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setExpanded(!expanded)}
            >
              <span className="text-[11px] font-bold text-slate-600">
                查看调优后框架
              </span>
              {expanded ? (
                <ChevronDown className="w-3 h-3 text-slate-400" />
              ) : (
                <ChevronRight className="w-3 h-3 text-slate-400" />
              )}
            </div>
            <button
              onClick={() => {
                setActiveReport(null);
                setActiveFullFramework(msg.proposedText!);
              }}
              className="text-[10px] font-bold text-indigo-600 hover:indigo-700 bg-indigo-50 px-2 py-1 rounded transition-colors"
            >
              查看调优后框架
            </button>
          </div>
          {expanded && (
            <div className="bg-slate-800 text-emerald-400 p-3 rounded font-mono text-[10px] whitespace-pre-wrap max-h-[150px] overflow-y-auto">
              {msg.proposedText}
            </div>
          )}
        </div>

        {/* Interactive Comparison */}
        <div className="p-3 bg-slate-50/50">
           <div className="text-[11px] font-bold text-slate-600 mb-2">对比测试验证</div>
           <div className="flex gap-2 mb-3">
             <div className="relative shrink-0 w-[80px]">
               <select 
                 value={selectedCustId}
                 onChange={(e) => setSelectedCustId(e.target.value)}
                 className="w-full text-[11px] font-medium text-slate-600 bg-white border border-slate-200 rounded px-2 py-1.5 outline-none focus:border-indigo-300 appearance-none cursor-pointer"
               >
                 {MOCK_CUSTOMERS.map(c => (
                   <option key={c.id} value={c.id}>{c.name}</option>
                 ))}
               </select>
               <ChevronDown className="w-3 h-3 absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
             </div>
             <input type="text" value={compTest} onChange={e=>setCompTest(e.target.value)} onKeyDown={(e) => e.key === "Enter" && doCompare()} placeholder="输入测试问题验证新旧框架差异" className="flex-1 text-[11px] px-3 py-1.5 border border-slate-200 rounded outline-none focus:border-indigo-300" />
             <button onClick={doCompare} disabled={isComparing || !compTest.trim()} className="text-[11px] bg-slate-700 text-white px-3 py-1.5 rounded hover:bg-slate-600 disabled:opacity-50 min-w-[70px]">生成对比</button>
           </div>
           {(isComparing || oldRes) && (
             <div className="grid grid-cols-2 gap-3 mt-3">
                <div className="bg-white border border-slate-200 p-2 rounded">
                  <div className="text-[10px] font-bold text-slate-500 mb-1 border-b border-slate-100 pb-1">原框架回复</div>
                  <div className="text-[11px] text-slate-600 whitespace-pre-wrap">{isComparing ? "思考中..." : oldRes}</div>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 p-2 rounded">
                  <div className="text-[10px] font-bold text-emerald-700 mb-1 border-b border-emerald-100 pb-1">新框架回复</div>
                  <div className="text-[11px] text-slate-800 font-medium whitespace-pre-wrap">{isComparing ? "思考中..." : newRes}</div>
                </div>
             </div>
           )}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] bg-slate-900/60 flex items-center justify-center p-4 xl:p-8">
      <div
        className={`bg-white rounded-xl w-full h-[85vh] flex overflow-hidden shadow-2xl relative transition-all duration-300 ${activeReport || activeFullFramework ? "max-w-6xl" : "max-w-3xl"}`}
      >
        {/* Main Interface */}
        <div className="flex-1 flex flex-col min-w-0 bg-white">
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <Beaker className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-bold text-[14px] text-slate-800">AI调优与诊断</h3>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-6 bg-slate-50/30">
            {messages.map((msg) => (
               <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] ${msg.role === "user" ? "items-end flex flex-col" : "items-start flex flex-col w-full"}`}>
                     {msg.role === "system" && <div className="text-[10px] text-slate-400 self-center bg-white border border-slate-100 px-3 py-1.5 rounded-full shadow-xs mb-2 animate-pulse">{msg.content}</div>}
                     {msg.role === "user" && <div className="bg-slate-800 text-white text-[12px] px-4 py-2.5 rounded-xl rounded-tr-sm shadow-sm">{msg.content}</div>}
                     {msg.role === "assistant" && (
                       <div className="w-full">
                         <div className="text-[12px] text-slate-700 bg-white border border-slate-200 px-4 py-2.5 rounded-xl rounded-tl-sm shadow-sm self-start inline-block">
                           {msg.content}
                         </div>
                         {msg.type === "diag_report" && msg.diagData && <DiagnosticReportCard diagData={msg.diagData} />}
                         {msg.type === "tuning_result" && <TuningResultCard msg={msg} />}
                       </div>
                     )}
                  </div>
               </div>
            ))}
            {isProcessing && (
               <div className="flex justify-start">
                 <div className="group flex items-center gap-2 text-[12px] text-slate-500 bg-white border border-slate-200 px-4 py-2 rounded-xl rounded-tl-sm shadow-sm w-fit max-w-[85%]">
                   <span className="flex gap-1">
                     <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                     <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                     <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                   </span>
                   分析推理中...
                 </div>
               </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-100 shrink-0">
            <div className="max-w-4xl mx-auto space-y-3">
              {/* Quick Actions Shortcuts */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: "生成深度诊断报告", prompt: "请为我生成最新的智能体深度诊断报告，分析各项得分与不足" },
                  { label: "基于知识对框架进行调优", prompt: "请基于当前挂载的知识库内容，对智能体的底层应答框架进行针对性优化，确保应答逻辑与知识规则高度统一" },
                ].map((shortcut, i) => (
                  <button
                    key={i}
                    disabled={isProcessing}
                    onClick={() => submitTuningReq(shortcut.prompt)}
                    className="px-2 py-1 bg-slate-50/50 border border-slate-100 rounded text-[10px] text-slate-500 hover:bg-indigo-50 hover:border-indigo-100 hover:text-indigo-600 transition-all disabled:opacity-50"
                  >
                    {shortcut.label}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submitTuningReq(input)}
                  placeholder="发送指令（例如：让回答更加简短专业、补充理财推荐的合规提示...）"
                  className="flex-1 text-[12px] border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 bg-slate-50 focus:bg-white transition-all"
                  disabled={isProcessing}
                />
                <button
                  onClick={() => submitTuningReq(input)}
                  disabled={!input.trim() || isProcessing}
                  className="bg-indigo-600 text-white text-[12px] font-bold px-6 py-3 rounded-lg hover:bg-indigo-500 disabled:opacity-50 transition-colors"
                >
                  发送
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Panel: Diagnostics or Framework Preview */}
        {activeReport && <FullReportView diagData={activeReport} />}
        {activeFullFramework && (
          <FullFrameworkView text={activeFullFramework} />
        )}
      </div>
    </div>
  );
};

export default OmniAITuningModal;
