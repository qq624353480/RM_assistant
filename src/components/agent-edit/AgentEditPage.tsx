import React, { useState, useEffect } from 'react';
import AgentConfigPanel from './AgentConfigPanel';
import KnowledgePanel from './KnowledgePanel';
import PreviewChat from './PreviewChat';
import VersionSelector from './VersionSelector';
import CompressionModal from './CompressionModal';
import AgentReadinessIndicator from './AgentReadinessIndicator';
import EvaluationReportModal from './EvaluationReportModal';
import DataSelectorModal from './DataSelectorModal';
import AITuningFloatingBox from './AITuningFloatingBox';
import OmniAITuningModal from './OmniAITuningModal';
import { 
  AgentConfig, FileItem, DataField, Skill, 
  EnvConfig, Version, ChatMessage, EvaluationResult,
  MockCustomer, AppState
} from '../../../types';
import { LoaderIcon, ArrowLeftIcon } from './Icons';
import { 
  INITIAL_CONFIG, MOCK_FILES, INITIAL_DATA_FIELDS, 
  INITIAL_SKILLS, INITIAL_ENV_CONFIG, MOCK_CUSTOMERS 
} from './constants';
import { calculateStaticScore } from './services/evaluationService';

interface AgentEditPageProps {
  agentId: string;
  agentName: string;
  onBack: () => void;
  isCreate?: boolean;
}

const AgentEditPage: React.FC<AgentEditPageProps> = ({ agentId, agentName, onBack, isCreate }) => {
  const STORAGE_KEY = `agent_edit_state_${agentId}`;

  const promptContent = `#角色要求

你是 角色设定，如：银行零售客户经理 ，你的任务是 希望模型执行什么任务，达成什么目标

#思考规范

1.当用户需要 了解持仓信息时，如查询某类资产的占比 ，你应该优先调用 客户持仓数据 ，并基于返回的数据回答客户问题，不要发散
2.当用户需要 持仓分析时 ，你应该优先调用 客户持仓数据和基本信息，从风险维度、大类资产配置合理性、流动性、收益性等维度总结客户持仓特点，并诊断持仓中可能存在的问题
3.当用户需要 调仓建议时 ，你应该综合 客户基本信息、持仓信息、市场展望观点，针对客户持仓问题 ，给出方向性的调整建议，请注意，你的建议应该是策略级的，请不要推荐具体的产品

#回复要求

1.回复将直接发给客户，你需要以 清晰易懂 的语言回复用户
2.避免冗长，控制在 500-1000 中文字，除非问题需长篇解释`;

  // State
  const [agentConfig, setAgentConfig] = useState<AgentConfig>(isCreate ? { 
    id: 'new', 
    name: '', 
    description: '', 
    instructions: promptContent, 
    summaryPrompt: `请在回复的最开头，先输出一段100字以内的摘要内容，并务必使用 <summary> 标签将其包裹。摘要需要精准概括本次分析的核心结论和建议，方便客户经理快速预览。例如：\n<summary>\n本回复主要分析了客户XX的资产配置情况，建议通过XX产品进行优化...\n</summary>`,
    associatedItems: [] 
  } as AgentConfig : INITIAL_CONFIG);
  const [files, setFiles] = useState<FileItem[]>(isCreate ? [] : MOCK_FILES);
  const [dataFields, setDataFields] = useState<DataField[]>(isCreate ? [] : INITIAL_DATA_FIELDS);
  const [skills, setSkills] = useState<Skill[]>(isCreate ? [] : INITIAL_SKILLS);
  const [envConfig, setEnvConfig] = useState<EnvConfig>(isCreate ? { triggerPage: '', displaySlot: '' } : INITIAL_ENV_CONFIG);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [versions, setVersions] = useState<Version[]>([]);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | undefined>(undefined);
  
  const [currentVersionId, setCurrentVersionId] = useState<string | null>(null);
  const [isVersionSelectorOpen, setIsVersionSelectorOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isDataSelectorOpen, setIsDataSelectorOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(MOCK_CUSTOMERS[0].id);
  
  // Tuning Modal States
  const [isOmniTuningModalOpen, setIsOmniTuningModalOpen] = useState(false);
  const [hasUntunedKnowledge, setHasUntunedKnowledge] = useState(false);
  const [showUntunedWarning, setShowUntunedWarning] = useState(false);
  
  // KnowledgePanel Tab States
  const [activeKnowledgeTab, setActiveKnowledgeTab] = useState<'knowledge' | 'data' | 'skills' | 'env'>('knowledge');
  const [envSubTab, setEnvSubTab] = useState<'example' | 'guess' | 'transaction' | 'precalc'>('transaction');

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as AppState;
        setAgentConfig(parsed.agentConfig);
        setFiles(parsed.files);
        setDataFields(parsed.dataFields);
        setSkills(parsed.skills);
        setEnvConfig(parsed.envConfig);
        setVersions(parsed.versions);
      } catch (e) {
        console.error("Failed to parse saved state", e);
      }
    }
  }, [STORAGE_KEY]);

  // Save to local storage
  useEffect(() => {
    const stateToSave: AppState = {
      agentConfig,
      files,
      dataFields,
      skills,
      envConfig,
      versions,
      chatHistory: [] // Don't save chat history
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [agentConfig, files, dataFields, skills, envConfig, versions, STORAGE_KEY]);

  const handleSendMessage = async (content: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content
    };
    setMessages(prev => [...prev, userMsg]);
    setIsProcessing(true);

    // Simulate AI response
    setTimeout(() => {
      let responseContent = `这是针对 "${content}" 的模拟回复。在实际应用中，这里将调用 Gemini API 并结合您的 SOP 逻辑和知识库进行回答。`;
      
      if (content === '触发超长截断') {
        responseContent = `根据您的要求，当前正在生成一份高度详尽的综合画像与业务推断分析报告，系统正在尝试拉取客户长达 10 年的底层结构化数据以及宏观经济走势研究报告... ${'（这里是一段极其冗长的数据解析过程，包含大量的财报与账户流水记录）'.repeat(15)}\n\n由于底层引入了 ${dataFields.length} 张基础表以及大量的标签与明细记录，外部大模型 Token 上限极速告警...`;
      }

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        thinking: '正在分析用户意图并检索相关知识...',
        marketingInfo: content === '产品推荐' || content === '持仓分析' || content === '行外吸金' ? {
          hitSegment: content === '行外吸金' ? '行外大额闲置资金潜力客群' : '中高净值财富管理客群',
          recommendedAgent: content === '行外吸金' ? '行外吸金专案助手' : '资配分析专家'
        } : undefined,
        trace: [
          {
            title: '意图路由',
            type: 'router',
            status: 'success',
            items: [`输入: "${content}"`, '匹配技能: 持仓分析'],
            cost: '12ms'
          },
          {
            title: '逻辑执行',
            type: 'code',
            status: 'success',
            items: ['执行 SOP 脚本...', '获取客户持仓数据', '比对风险清单'],
            cost: '45ms'
          }
        ]
      };
      setMessages(prev => [...prev, assistantMsg]);
      setIsProcessing(false);
    }, 1500);
  };

  const executeSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      const newVersion: Version = {
        id: Date.now().toString(),
        label: `v${versions.length + 1}.0`,
        timestamp: Date.now(),
        data: {
          agentConfig,
          files,
          dataFields,
          skills,
          envConfig,
          chatHistory: []
        }
      };
      setVersions(prev => [newVersion, ...prev]);
      setCurrentVersionId(newVersion.id);
      setIsSaving(false);
      setHasUntunedKnowledge(false);
    }, 1000);
  };

  const handleSaveVersion = () => {
    if (hasUntunedKnowledge) {
      setShowUntunedWarning(true);
      return;
    }
    executeSave();
  };

  const handleRestoreVersion = (version: Version) => {
    setAgentConfig(version.data.agentConfig);
    setFiles(version.data.files);
    setDataFields(version.data.dataFields);
    setSkills(version.data.skills);
    setEnvConfig(version.data.envConfig);
    setCurrentVersionId(version.id);
    setMessages([]);
    setEvaluationResult(undefined);
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Header */}
      <header className="h-14 border-b border-gray-200 flex items-center justify-between px-6 shrink-0 bg-white z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors pr-3 border-r border-gray-200"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span className="text-sm font-medium">返回</span>
          </button>

          <div className="flex items-center gap-3">
            <h1 className="font-bold text-gray-800">{isCreate ? '新增智能体' : agentConfig.name}</h1>
            <div className="relative">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider ${currentVersionId ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                  {currentVersionId ? '已保存' : '草稿'}
                </span>
                <button 
                  onClick={() => setIsVersionSelectorOpen(!isVersionSelectorOpen)}
                  className="text-xs text-blue-600 hover:underline flex items-center gap-0.5"
                >
                  版本历史
                  <svg className={`w-3 h-3 transition-transform ${isVersionSelectorOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
              </div>
              <VersionSelector 
                isOpen={isVersionSelectorOpen}
                onClose={() => setIsVersionSelectorOpen(false)}
                versions={versions}
                currentVersionId={currentVersionId}
                onSelectVersion={handleRestoreVersion}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden">
            <AgentReadinessIndicator 
              config={agentConfig}
              files={files}
              skills={skills}
              envConfig={envConfig}
              dataFields={dataFields}
              chatHistory={messages}
              evaluationResult={evaluationResult}
              onEvaluationComplete={setEvaluationResult}
              onShowReport={() => setIsReportModalOpen(true)}
            />
          </div>
          <button 
            onClick={handleSaveVersion}
            disabled={isSaving}
            className="px-4 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            {isSaving ? <LoaderIcon className="w-4 h-4 animate-spin" /> : '保存'}
          </button>
          <button className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm shadow-blue-200 transition-colors">
            发布
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Config */}
        <div className="flex-1 min-w-[350px]">
          <AgentConfigPanel 
            config={agentConfig}
            onChange={(newConfig) => {
              setAgentConfig(newConfig);
              setCurrentVersionId(null);
            }}
            onItemAdded={() => {
              setActiveKnowledgeTab('env');
              setEnvSubTab('transaction');
            }}
            isTuningModalOpen={isOmniTuningModalOpen}
            setIsTuningModalOpen={setIsOmniTuningModalOpen}
            isTuningMinimized={false}
            setIsTuningMinimized={() => {}}
            hasNewKnowledgeTrigger={hasUntunedKnowledge}
            setHasNewKnowledgeTrigger={setHasUntunedKnowledge}
          />
        </div>

        {/* Middle: Knowledge & Data */}
        <div className="flex-1 min-w-[350px] border-x border-gray-200">
          <KnowledgePanel 
            files={files}
            dataFields={dataFields}
            skills={skills}
            envConfig={envConfig}
            config={agentConfig}
            activeTab={activeKnowledgeTab}
            envSubTab={envSubTab}
            onActiveTabChange={setActiveKnowledgeTab}
            onEnvSubTabChange={setEnvSubTab}
            onFilesChange={(newFiles) => {
              if (newFiles.length > files.length) {
                setHasUntunedKnowledge(true);
              }
              setFiles(newFiles);
              setCurrentVersionId(null);
            }}
            onDataFieldsChange={(newFields) => {
              setDataFields(newFields);
              setCurrentVersionId(null);
            }}
            onSkillsChange={(newSkills) => {
              setSkills(newSkills);
              setCurrentVersionId(null);
            }}
            onEnvConfigChange={(newEnv) => {
              setEnvConfig(newEnv);
              setCurrentVersionId(null);
            }}
            onUpdateConfig={(newConfig) => {
              setAgentConfig(newConfig);
              setCurrentVersionId(null);
            }}
            onOpenDataSelector={() => setIsDataSelectorOpen(true)}
            onTriggerTuning={() => {
               setIsOmniTuningModalOpen(true);
            }}
          />
        </div>

        {/* Right: Preview */}
        <div className="flex-1 min-w-[350px]">
          <PreviewChat 
            messages={messages}
            onSendMessage={handleSendMessage}
            customers={MOCK_CUSTOMERS}
            selectedCustomerId={selectedCustomerId}
            onCustomerChange={setSelectedCustomerId}
            isProcessing={isProcessing}
            onShowReport={() => setIsReportModalOpen(true)}
          />
        </div>
      </div>

      {/* Omni AI Tuning Chat Modal */}
      <OmniAITuningModal 
        isOpen={isOmniTuningModalOpen}
        onClose={() => setIsOmniTuningModalOpen(false)}
        config={agentConfig}
        chatHistory={messages}
        files={files}
        skills={skills}
        envConfig={envConfig}
        dataFields={dataFields}
        onApplyTuned={(newInstructions) => {
          setAgentConfig({ ...agentConfig, instructions: newInstructions });
          setCurrentVersionId(null);
          setHasUntunedKnowledge(false);
        }}
      />

      {/* Untuned Warning Modal */}
      {showUntunedWarning && (
        <div className="fixed inset-0 z-[60] bg-gray-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">未进行知识增量调优</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                系统检测到您刚上传了新的文档，但还没触发 AI 优化。
                强烈建议您先去提炼新知识，这样大模型回答才不会出现幻觉和遗漏。
              </p>
              
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => {
                    setShowUntunedWarning(false);
                    executeSave();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  继续保存
                </button>
                <button 
                  onClick={() => {
                    setShowUntunedWarning(false);
                    setIsOmniTuningModalOpen(true);
                  }}
                  className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
                >
                  去调优
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <EvaluationReportModal 
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        result={evaluationResult || null}
        staticScore={calculateStaticScore(agentConfig, files, skills, envConfig, dataFields).score}
        staticTips={calculateStaticScore(agentConfig, files, skills, envConfig, dataFields).tips}
      />

      <DataSelectorModal 
        isOpen={isDataSelectorOpen}
        onClose={() => setIsDataSelectorOpen(false)}
        onAdd={(field) => {
          setDataFields(prev => [...prev, field]);
          setCurrentVersionId(null);
        }}
      />

      {/* Floating AI tuning box combining health rating and framework optimization */}
      <AITuningFloatingBox 
        onOpenOmniTuning={() => setIsOmniTuningModalOpen(true)}
        hasUntunedKnowledge={hasUntunedKnowledge}
      />

    </div>
  );
};

export default AgentEditPage;
