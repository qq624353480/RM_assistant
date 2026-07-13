
import React, { useState } from 'react';
import { 
  Search, 
  RotateCcw, 
  ChevronDown, 
  MoreHorizontal, 
  Clock, 
  User as UserIcon, 
  Copy, 
  Calendar, 
  Plus,
  ShieldCheck
} from 'lucide-react';
import { Agent } from '../types';

interface AgentListProps {
  onNewAgent: () => void;
  onEditAgent: (agent: Agent) => void;
}

const MOCK_AGENTS: Agent[] = [
  { id: '312034a10b...', name: '代发常规多波次绑定测试', description: '#角色要求 你是角色设定，如：银行零售客户经理，你的任务是希望模型执行什么任务，达成什么目标...', creator: '总行-衷加豪', time: '2026-02-12 14:52:49', status: '正式版', org: '总行-衷加豪', isExcellenceCase: true },
  { id: '312032760b...', name: 'YZ021209', description: 'YZ021209', creator: '总行-杜一阳', time: '2026-02-12 14:42:18', status: '正式版', org: '总行-杜一阳' },
  { id: '31202c6ec0...', name: 'YZ021206', description: 'YZ021206', creator: '总行-杜一阳', time: '2026-02-12 14:24:20', status: '正式版', org: '总行-杜一阳', isExcellenceCase: true },
  { id: '31202cc4c0...', name: 'YZ021207', description: 'YZ021207', creator: '总行-杜一阳', time: '2026-02-12 14:17:42', status: '正式版', org: '总行-杜一阳' },
  { id: '31200a13c0...', name: 'YZ021205', description: 'YZ021205', creator: '总行-杜一阳', time: '2026-02-12 11:49:42', status: '正式版', org: '总行-杜一阳' },
  { id: '311ff5cba2...', name: 'YZ021204专案类', description: 'YZ021204专案类', creator: '总行-杜一阳', time: '2026-02-12 11:33:09', status: '正式版', org: '总行-杜一阳', isExcellenceCase: true },
  { id: '311ff9e55d...', name: 'ss智能体验证关联多个专案', description: '将环保局', creator: '总行-衷加豪', time: '2026-02-12 11:23:46', status: '正式版', org: '总行-衷加豪' },
  { id: '31186beb06...', name: '111啊啊大', description: 'asaa1111', creator: '总行-文良栋', time: '2026-02-12 11:16:55', status: '正式版', org: '总行-文良栋' },
  { id: '311ff750a2...', name: 'ss智能体场景经营多波次', description: '将环保局', creator: '总行-衷加豪', time: '2026-02-12 10:34:05', status: '正式版', org: '总行-衷加豪' },
  { id: '311fec8ebe...', name: 'YZ021202智能专案类_北京分行', description: 'YZ021202智能专案类', creator: '北京分行-张三', time: '2026-02-12 09:52:18', status: '草稿箱', org: '北京分行-张三', isExcellenceCase: true },
  { id: '311fe8bc39...', name: '专案智能体样例', description: '专案智能体样例', creator: '北京分行-张三', time: '2026-02-12 09:26:20', status: '草稿箱', org: '北京分行-张三' },
  { id: '311fe7a733...', name: '智能体样例', description: '智能体样例', creator: '北京分行-张三', time: '2026-02-12 09:21:43', status: '草稿箱', org: '北京分行-张三' },
  { id: '311fe55a22...', name: '优秀营销智能体_上海分行', description: '上海分行分享的高转化率营销智能体', creator: '上海分行-李四', time: '2026-02-11 16:20:10', status: '正式版', org: '上海分行-李四', isExcellenceCase: true },
  { id: '311fe33b11...', name: '跨境业务助手_深圳分行', description: '专门针对深圳地区跨境贸易企业的智能助手', creator: '深圳分行-王五', time: '2026-02-10 11:15:45', status: '正式版', org: '深圳分行-王五', isExcellenceCase: true },
];

const categories = [
  { label: '全部', count: 231 },
  { label: '产品类', count: 94 },
  { label: '客户类', count: 31 },
  { label: '市场类', count: 4 },
  { label: '陪伴类', count: 5 },
  { label: '业绩类', count: 5 },
  { label: '智能专案类', count: 60 },
  { label: '其他类', count: 32 },
];

const AgentList: React.FC<AgentListProps> = ({ onNewAgent, onEditAgent }) => {
  const [activeTab, setActiveTab] = useState('全部');
  const [showExcellenceOnly, setShowExcellenceOnly] = useState(false);

  const filteredAgents = MOCK_AGENTS.filter(agent => {
    if (showExcellenceOnly && !agent.isExcellenceCase) return false;
    // Add category filtering here if needed, keeping it simple for now
    return true;
  });

  return (
    <div className="p-6 h-full overflow-y-auto bg-slate-50/30">
      {/* Categories Tabs */}
      <div className="flex border-b border-gray-200 mb-6 bg-white px-4 rounded-t-xl shadow-sm">
        {categories.map((cat) => (
          <button
            key={cat.label}
            onClick={() => setActiveTab(cat.label)}
            className={`px-4 py-4 text-sm font-medium relative transition-colors ${
              activeTab === cat.label ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {cat.label}({cat.count})
            {activeTab === cat.label && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <span className="text-gray-500 whitespace-nowrap">智能体名称/ID:</span>
          <input type="text" placeholder="请输入智能体名称/ID" className="border border-gray-200 rounded px-3 py-1.5 w-48 outline-none focus:border-blue-500" />
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-500">创建人:</span>
          <div className="border border-gray-200 rounded px-3 py-1.5 w-40 flex items-center justify-between cursor-pointer text-gray-400">
            <span>全部</span>
            <ChevronDown size={14} />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-500">归属机构:</span>
          <div className="border border-gray-200 rounded px-3 py-1.5 w-40 flex items-center justify-between cursor-pointer">
            <span></span>
            <ChevronDown size={14} />
          </div>
        </div>
        <div className="flex items-center space-x-2 ml-auto">
          <button className="bg-blue-600 text-white px-4 py-1.5 rounded flex items-center hover:bg-blue-700">
            <Search size={16} className="mr-1" /> 查询
          </button>
          <button className="border border-gray-200 text-gray-600 px-4 py-1.5 rounded flex items-center hover:bg-gray-50">
            <RotateCcw size={16} className="mr-1" /> 重置
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="mb-6 flex items-center gap-3">
        <button 
          onClick={onNewAgent}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium shadow-md shadow-blue-200 hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus size={18} className="mr-2" /> 新建智能体
        </button>

        <button 
          onClick={() => setShowExcellenceOnly(!showExcellenceOnly)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm border ${
            showExcellenceOnly 
              ? 'bg-orange-500 text-white border-orange-400 shadow-orange-100' 
              : 'bg-white text-slate-600 border-slate-200 hover:border-orange-300 hover:text-orange-600'
          }`}
        >
          <ShieldCheck size={16} />
          分行优秀案例专区
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAgents.map((agent) => (
          <div 
            key={agent.id} 
            onClick={() => onEditAgent(agent)} // 点击卡片进入编辑模式
            className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-lg transition-all cursor-pointer relative overflow-hidden group border-l-4 border-l-gray-200 hover:border-l-blue-500"
          >
            {/* Status Badge */}
            <div className={`absolute top-0 right-0 px-2 py-0.5 text-[10px] font-bold rounded-bl-lg z-10 ${
              agent.status === '正式版' ? 'bg-green-50 text-green-600 border-l border-b border-green-200' : 'bg-gray-100 text-gray-500 border-l border-b border-gray-200'
            }`}>
              {agent.status}
            </div>

            <div className="p-5">
              <h3 className="font-bold text-gray-800 mb-2 pr-12 line-clamp-1 group-hover:text-blue-600 transition-colors mt-4">
                {agent.name}
              </h3>
              <div className="flex items-center text-[10px] text-gray-400 mb-3 font-mono">
                <span className="truncate max-w-[120px]">{agent.id}</span>
                <Copy size={10} className="ml-1 cursor-pointer hover:text-blue-500" />
                <div className="ml-auto flex items-center space-x-2">
                   <div className="flex items-center"><Calendar size={10} className="mr-0.5" /> 0</div>
                   <div className="flex items-center"><Clock size={10} className="mr-0.5" /> 0</div>
                </div>
              </div>
              <p className="text-xs text-gray-500 line-clamp-3 min-h-[48px] mb-6 leading-relaxed bg-gray-50/50 p-2 rounded">
                {agent.description}
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <div className="flex items-center text-[11px] text-gray-500">
                  <UserIcon size={12} className="mr-1 opacity-60 text-blue-500" />
                  <span className="max-w-[80px] truncate">{agent.org}</span>
                </div>
                <div className="flex items-center text-[11px] text-gray-500">
                  <Clock size={12} className="mr-1 opacity-60" />
                  <span>{agent.time.split(' ')[0]}</span>
                </div>
                <button className="text-gray-400 hover:text-blue-600 p-1 rounded-full hover:bg-blue-50">
                  <MoreHorizontal size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentList;
