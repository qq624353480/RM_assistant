import React from 'react';
import { AgentConfig, AssociatedItem } from '../../../types';
import { ChevronDownIcon, ChevronUpIcon, PlusIcon, TrashIcon } from './Icons';
import { MOCK_ASSOCIATED_ITEMS } from './constants';

interface AgentConfigPanelProps {
  config: AgentConfig;
  onChange: (config: AgentConfig) => void;
  onItemAdded?: () => void;
  isTuningModalOpen: boolean;
  setIsTuningModalOpen: (v: boolean) => void;
  isTuningMinimized: boolean;
  setIsTuningMinimized: (v: boolean) => void;
  hasNewKnowledgeTrigger: boolean;
  setHasNewKnowledgeTrigger: (v: boolean) => void;
}

const AgentConfigPanel: React.FC<AgentConfigPanelProps> = ({ 
  config, onChange, onItemAdded,
  isTuningModalOpen, setIsTuningModalOpen,
  isTuningMinimized, setIsTuningMinimized,
  hasNewKnowledgeTrigger, setHasNewKnowledgeTrigger
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isSearching, setIsSearching] = React.useState(false);

  const handleChange = (field: keyof AgentConfig, value: any) => {
    onChange({ ...config, [field]: value });
  };

  const handleAddItem = (item: AssociatedItem) => {
    const currentItems = config.associatedItems || [];
    if (currentItems.find(i => i.id === item.id)) return;
    handleChange('associatedItems', [...currentItems, item]);
    setSearchQuery('');
    setIsSearching(false);
    if (onItemAdded) onItemAdded();
  };

  const handleRemoveItem = (id: string) => {
    const currentItems = config.associatedItems || [];
    handleChange('associatedItems', currentItems.filter(i => i.id !== id));
  };

  const filteredSearchItems = searchQuery.trim() === '' 
    ? [] 
    : MOCK_ASSOCIATED_ITEMS.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.id.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="font-semibold text-gray-800">智能体信息</h2>
        <span className="text-xs text-gray-400">ID: agent_001</span>
      </div>

      <div className="p-4 space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">名称</label>
            <input
              type="text"
              value={config.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="为智能体起个名字"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
            <textarea
              value={config.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all h-20 resize-none"
              placeholder="简要说明智能体的用途"
            />
          </div>


        </div>

        {/* Instructions */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">核心提示词 (Instructions)</label>
          </div>
          <textarea
            value={config.instructions}
            onChange={(e) => handleChange('instructions', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all h-96 font-mono text-sm leading-relaxed"
            placeholder="定义智能体的角色、任务和回复风格..."
          />
          <p className="mt-2 text-xs text-gray-400">
            支持 Markdown 格式。建议包含 # Role, # Task, # Constraints 等模块。
          </p>
        </div>

        {/* Summary Generation Config - Plan A: Always enabled but customizable */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">摘要生成配置 (Summary Logic)</label>
            <button
              type="button"
              onClick={() => {
                const defaultPrompt = `请在回复的最开头，先输出一段100字以内的摘要内容，并务必使用 <summary> 标签将其包裹。摘要需要精准概括本次分析的核心结论和建议，方便客户经理快速预览。例如：\n<summary>\n本回复主要分析了客户XX的资产配置情况，建议通过XX产品进行优化...\n</summary>`;
                handleChange('summaryPrompt', defaultPrompt);
              }}
              className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              ✨ 恢复默认模版
            </button>
          </div>
          <div className="space-y-3">
            <textarea
              value={config.summaryPrompt || ''}
              onChange={(e) => handleChange('summaryPrompt', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all h-32 font-mono text-xs leading-relaxed bg-gray-50"
              placeholder="请输入摘要生成提示词，建议要求模型使用 <summary> 标签包裹内容..."
            />
            <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100">
              <p className="text-[11px] text-blue-700 leading-relaxed">
                <strong>💡 运行原理：</strong> 系统会在调用智能体时自动追加此段指令。通过 <code className="bg-blue-100 px-1 rounded">&lt;summary&gt;</code> 标签隔离，摘要将自动展示在回复正文上方，不会破坏原有回复的排版结构。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentConfigPanel;
