import React, { useState, useEffect } from 'react';
import { 
  Cpu, UserCircle, Gauge, Landmark, Bot, ArrowRight,
  ListCheck, Plus, Lightbulb, ExternalLink, Building, Check, Lock, Save, Trash2, Edit2
} from 'lucide-react';
import { PrecalcQuotaCard } from './PrecalcQuotaCard';

interface PrecalcDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isConfigured?: boolean;
  onTasksChange?: (hasTasks: boolean) => void;
  tasks: any[];
  setTasks: (tasks: any[]) => void;
}

export const PrecalcDrawer: React.FC<PrecalcDrawerProps> = ({ isOpen, onClose, isConfigured = false, onTasksChange, tasks, setTasks }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newScope, setNewScope] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const handleSaveAdd = () => {
    if (!newQuestion || !newScope) return;
    const newTask = {
      id: Date.now().toString(),
      isSelf: true,
      owner: '我',
      agentName: '保险KYC智能体',
      question: newQuestion,
      scopeName: newScope,
      scopeType: '专案' as const,
      scopeId: '#NEW',
      scopeDesc: '',
      count: '计算中',
      statusType: '计算中' as const,
      progress: '0 / 0',
      finishTime: '预计中',
      viewRate: '—',
      adoptRate: '—',
      runEnabled: true,
      selectEnabled: false,
    };
    setTasks([newTask, ...tasks]);
    setIsAdding(false);
    setNewQuestion('');
    setNewScope('');
  };

  const handleSaveEdit = (id: string, updatedQuestion: string, updatedScope: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, question: updatedQuestion, scopeName: updatedScope } : t));
    setEditingTaskId(null);
  };

  const handleDelete = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Drawer Content */}
      <div className="relative w-full max-w-[1320px] bg-[#F2F3F5] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-slate-200">
        
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-slate-200 flex justify-between items-center shadow-sm z-10 shrink-0">
          <div className="flex items-center gap-3">
             <span className="w-[34px] h-[34px] rounded-[9px] bg-gradient-to-br from-[#3D7EDB] to-[#1E3A8A] text-white flex items-center justify-center">
                <Cpu size={19} />
             </span>
             <div>
                <h1 className="text-[17px] font-extrabold text-[#1E3A8A]">保险KYC智能体 ｜ 预计算配置</h1>
                <div className="text-[11.5px] text-[#86909C] mt-[1px]">分行智能体主理人 · 开启并配置本智能体的预跑</div>
             </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[12px] text-[#4E5969] bg-white border border-[#E5E6EB] rounded-lg px-3 py-1.5 flex items-center gap-[7px]">
              <span className="font-bold text-[#1E3A8A] flex items-center gap-[5px]">
                <UserCircle size={15} className="text-[#3D7EDB]" />
                主理人 周小可
              </span>
              <span className="text-[#E5E6EB]">|</span>
              深圳分行
            </span>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 w-9 h-9 rounded-full flex items-center justify-center transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-20 custom-scrollbar text-[#1F2329] font-sans">
          
          {/* Card 1: Reusable Quota Card */}
          <div className="bg-white border border-[#E5E6EB] rounded-[13px] p-[18px_20px] mb-[14px] shadow-[0_1px_4px_rgba(80,90,120,0.04)]">
            <div className="flex items-center gap-2 mb-[15px]">
              <span className="w-[25px] h-[25px] rounded-[7px] bg-[#E7F1FC] text-[#3D7EDB] flex items-center justify-center">
                <Gauge size={15} />
              </span>
              <h2 className="text-[14.5px] font-extrabold text-[#1F2329]">额度总览</h2>
              <span className="text-[11px] text-[#86909C] ml-auto">保底（开了预跑就有）+ 增量（被采纳越多按比例分越多）</span>
            </div>
            
            <PrecalcQuotaCard showBranch={true} />
          </div>

          {/* Card 2: Task List */}
          <div className="bg-white border border-[#E5E6EB] rounded-[13px] p-[18px_20px] mb-[14px] shadow-[0_1px_4px_rgba(80,90,120,0.04)]">
            <div className="flex items-center gap-2 mb-[15px]">
              <span className="w-[25px] h-[25px] rounded-[7px] bg-[#E7F1FC] text-[#3D7EDB] flex items-center justify-center">
                <ListCheck size={15} />
              </span>
              <h2 className="text-[14.5px] font-extrabold text-[#1F2329]">预计算清单</h2>
              <span className="text-[11px] text-[#86909C] ml-auto">展示本分行全部智能体的预跑任务；仅本智能体可编辑，优先级由排名自动决定</span>
            </div>

            <div className="flex items-center gap-[16px] border border-[#CADEF8] bg-gradient-to-b from-[#F4F8FE] to-white rounded-[11px] p-[13px_16px] mb-[14px]">
              <button 
                onClick={() => setIsAdding(true)}
                className="text-[12.5px] font-semibold rounded-[8px] px-[15px] py-[9px] bg-[#3D7EDB] text-white flex items-center gap-[6px] shrink-0 hover:bg-[#1E3A8A] transition-colors shadow-md active:scale-95"
              >
                <Plus size={16} /> 新建预跑
              </button>
              
              {!isConfigured && (
                <div className="flex-1 text-[11.5px] text-[#4E5969] leading-[1.6]">
                  <div className="font-extrabold text-[#1E3A8A] flex items-center gap-[5px] mb-[5px]">
                    <Lightbulb size={14} className="text-[#3D7EDB]" /> 开启预跑后
                  </div>
                  <div className="flex items-start gap-[6px] mb-[3px]">
                    <span className="font-extrabold text-[#3D7EDB] shrink-0">①</span>
                    <span>客户经理打开<b className="text-[#1F2329]">专案客户画像</b>时，<b className="text-[#1F2329]">秒出答案</b>。</span>
                  </div>
                  <div className="flex items-start gap-[6px]">
                    <span className="font-extrabold text-[#3D7EDB] shrink-0">②</span>
                    <span>可开启<b className="text-[#1F2329]">小助精选名单</b>——AI 按本智能体对专案客户的分析，<b className="text-[#1F2329]">智能排序出最该高优接触的目标客户</b>，呈现在<b className="text-[#1F2329]">商机中心首页</b>。</span>
                  </div>
                </div>
              )}
              
              {isConfigured && <div className="flex-1" />}

              <a href="#" className="text-[11.5px] font-semibold text-[#3D7EDB] border border-[#C4D8F4] rounded-[7px] px-[13px] py-[7px] flex items-center gap-[5px] shrink-0 hover:bg-[#F4F8FE] transition-colors">
                <ExternalLink size={14} /> 查看示例
              </a>
            </div>

            <div className="text-[12.5px] font-bold text-[#1F2329] mb-[10px] flex items-center gap-[8px]">
              <Building size={16} className="text-[#3D7EDB]" /> 深圳分行 · 全部预跑任务
              <span className="font-medium text-[#86909C]">（28 个智能体）</span>
            </div>

            <div className="overflow-x-auto border border-[#E5E6EB] rounded-[8px]">
              <table className="w-full min-w-[1240px] border-collapse">
                <thead>
                  <tr className="bg-[#F7F8FA]">
                    <th className="text-[11px] font-bold text-[#4E5969] text-left p-[9px_10px] border-b-[1.5px] border-[#E5E6EB] whitespace-nowrap">智能体</th>
                    <th className="text-[11px] font-bold text-[#4E5969] text-left p-[9px_10px] border-b-[1.5px] border-[#E5E6EB] whitespace-nowrap">示例问</th>
                    <th className="text-[11px] font-bold text-[#4E5969] text-left p-[9px_10px] border-b-[1.5px] border-[#E5E6EB] whitespace-nowrap">名单范围（专案 / 数据库）</th>
                    <th className="text-[11px] font-bold text-[#4E5969] text-left p-[9px_10px] border-b-[1.5px] border-[#E5E6EB] whitespace-nowrap">名单量</th>
                    <th className="text-[11px] font-bold text-[#4E5969] text-left p-[9px_10px] border-b-[1.5px] border-[#E5E6EB] whitespace-nowrap">计算进度</th>
                    <th className="text-[11px] font-bold text-[#4E5969] text-left p-[9px_10px] border-b-[1.5px] border-[#E5E6EB] whitespace-nowrap">完成情况</th>
                    <th className="text-[11px] font-bold text-[#4E5969] text-center p-[9px_10px] border-b-[1.5px] border-[#E5E6EB] whitespace-nowrap">查看率</th>
                    <th className="text-[11px] font-bold text-[#4E5969] text-center p-[9px_10px] border-b-[1.5px] border-[#E5E6EB] whitespace-nowrap">采纳率</th>
                    <th className="text-[11px] font-bold text-[#4E5969] text-center p-[9px_10px] border-b-[1.5px] border-[#E5E6EB] whitespace-nowrap">预跑</th>
                    <th className="text-[11px] font-bold text-[#4E5969] text-center p-[9px_10px] border-b-[1.5px] border-[#E5E6EB] whitespace-nowrap">精选名单</th>
                    <th className="text-[11px] font-bold text-[#4E5969] text-center p-[9px_10px] border-b-[1.5px] border-[#E5E6EB] whitespace-nowrap">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Inline Adding Row */}
                  {isAdding && (
                    <tr className="bg-indigo-50/50 animate-in fade-in slide-in-from-top-1 duration-200">
                      <td className="p-[11px_10px] border-b border-indigo-100">
                        <div className="flex items-center gap-[6px]">
                          <span className="font-bold text-[#1E3A8A] text-[12px]">保险KYC智能体</span>
                          <span className="text-[9px] font-bold text-white bg-indigo-400 rounded-sm px-1.5 py-0.5">新</span>
                        </div>
                      </td>
                      <td className="p-[11px_10px] border-b border-indigo-100">
                        <input 
                          autoFocus
                          type="text" 
                          placeholder="输入触发预跑的问题..."
                          value={newQuestion}
                          onChange={(e) => setNewQuestion(e.target.value)}
                          className="w-full bg-white border border-indigo-200 rounded px-3 py-1.5 text-[12px] outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400"
                        />
                      </td>
                      <td className="p-[11px_10px] border-b border-indigo-100">
                        <select 
                          value={newScope}
                          onChange={(e) => setNewScope(e.target.value)}
                          className="w-full bg-white border border-indigo-200 rounded px-3 py-1.5 text-[12px] outline-none"
                        >
                          <option value="">选择专案或数据库</option>
                          <option>二季度特色年金险数据库</option>
                          <option>开门红特色年金专案</option>
                          <option>高客养老规划数据库</option>
                        </select>
                      </td>
                      <td className="p-[11px_10px] border-b border-indigo-100 text-[12px] text-slate-400 italic">待选定名单</td>
                      <td colSpan={4} className="p-[11px_10px] border-b border-indigo-100">
                        <div className="flex items-center gap-2">
                           <button 
                             onClick={() => setIsAdding(false)}
                             className="px-3 py-1.5 text-[11px] font-bold text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded"
                           >
                             取消
                           </button>
                           <button 
                             onClick={handleSaveAdd}
                             className="px-4 py-1.5 text-[11px] font-bold text-white bg-indigo-500 hover:bg-indigo-600 rounded shadow-sm flex items-center gap-1"
                           >
                             <Save size={12} /> 保存规则
                           </button>
                        </div>
                      </td>
                      <td className="p-[11px_10px] border-b border-indigo-100 text-center">
                        <div className="w-[36px] h-[20px] rounded-[11px] bg-[#3D7EDB] relative opacity-50 cursor-not-allowed">
                          <div className="absolute w-[16px] h-[16px] rounded-full bg-white top-[2px] left-[18px]"></div>
                        </div>
                      </td>
                      <td className="p-[11px_10px] border-b border-indigo-100 text-center">
                        <div className="w-[36px] h-[20px] rounded-[11px] bg-[#C9CDD4] relative opacity-50 cursor-not-allowed">
                          <div className="absolute w-[16px] h-[16px] rounded-full bg-white top-[2px] left-[2px]"></div>
                        </div>
                      </td>
                      <td className="p-[11px_10px] border-b border-indigo-100 text-center">
                      </td>
                    </tr>
                  )}

                  {tasks.map((task) => {
                    const isEditing = editingTaskId === task.id;
                    const isSelf = task.isSelf;

                    return (
                      <tr key={task.id} className={`${isSelf ? 'bg-[#F6FAFF]' : ''} ${!task.runEnabled ? 'opacity-[0.55]' : ''}`}>
                        <td className="text-[12px] p-[11px_10px] border-b border-[#F0F1F3] align-middle">
                          <div className="flex items-center gap-[6px] whitespace-nowrap">
                            <span className="font-semibold text-[#1F2329]">{task.agentName}</span>
                            {isSelf ? (
                              <span className="text-[9.5px] font-extrabold text-white bg-[#3D7EDB] rounded-[4px] px-[5px] py-[1px]">本</span>
                            ) : (
                              <span className="text-[10.5px] text-[#86909C]">· {task.owner}</span>
                            )}
                          </div>
                        </td>
                        <td className="text-[12px] p-[11px_10px] border-b border-[#F0F1F3] align-middle">
                          {isEditing ? (
                            <input 
                              autoFocus
                              type="text" 
                              value={newQuestion}
                              onChange={(e) => setNewQuestion(e.target.value)}
                              className="w-full bg-white border border-indigo-200 rounded px-2 py-1.5 text-[12px] outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400"
                            />
                          ) : (
                            <span className="font-semibold text-[#1F2329] leading-[1.4]">
                              <span className="text-[#3D7EDB]">「</span>{task.question}<span className="text-[#3D7EDB]">」</span>
                            </span>
                          )}
                        </td>
                        <td className="text-[12px] p-[11px_10px] border-b border-[#F0F1F3] align-middle">
                          {isEditing ? (
                            <select 
                              value={newScope}
                              onChange={(e) => setNewScope(e.target.value)}
                              className="w-full bg-white border border-indigo-200 rounded px-2 py-1.5 text-[12px] outline-none"
                            >
                              <option value="二季度特色年金险数据库">二季度特色年金险数据库</option>
                              <option value="开门红特色年金专案">开门红特色年金专案</option>
                              <option value="高客养老规划数据库">高客养老规划数据库</option>
                            </select>
                          ) : (
                            <div className="leading-[1.35]">
                              <div className="font-semibold text-[#1F2329]">{task.scopeName}</div>
                              <div className="text-[10.5px] text-[#86909C] mt-[2px]">
                                <span className="text-[9.5px] font-bold text-[#1E3A8A] bg-[#D8E4FB] rounded-[4px] px-[6px] py-[1px] mr-[5px]">{task.scopeType}</span>
                                {task.scopeId} {task.scopeDesc && <span>· <span className={task.scopeDesc.includes('6/30') ? 'text-[#996100] font-semibold' : 'text-[#86909C]'}>{task.scopeDesc}</span></span>}
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="text-[12px] p-[11px_10px] border-b border-[#F0F1F3] align-middle font-bold text-[#1F2329] whitespace-nowrap">{task.count}</td>
                        <td className="text-[12px] p-[11px_10px] border-b border-[#F0F1F3] align-middle">
                          <div className="flex items-center gap-[8px] whitespace-nowrap">
                            {task.statusType === '已计算' && <span className="text-[10px] font-bold text-[#15803D] bg-[#EAF7EE] rounded-[5px] px-[8px] py-[2px] flex items-center gap-[4px]"><Check size={12} />已计算</span>}
                            {task.statusType === '计算中' && <span className="text-[10px] font-bold text-[#996100] bg-[#FDF5E6] rounded-[5px] px-[8px] py-[2px]">计算中</span>}
                            {task.statusType === '转实时' && <span className="text-[10px] font-bold text-[#C0392B] bg-[#FDF0EF] rounded-[5px] px-[8px] py-[2px]">转实时</span>}
                            <span className="text-[11.5px] text-[#86909C]">{task.progress}</span>
                          </div>
                        </td>
                        <td className="text-[12px] p-[11px_10px] border-b border-[#F0F1F3] align-middle">
                          <span className="text-[11px] text-[#86909C] whitespace-nowrap">{task.finishTime}</span>
                        </td>
                        <td className="text-[12px] p-[11px_10px] border-b border-[#F0F1F3] align-middle font-bold text-[#1F2329] text-center">{task.viewRate}</td>
                        <td className="text-[12px] p-[11px_10px] border-b border-[#F0F1F3] align-middle font-bold text-[#1F2329] text-center">{task.adoptRate}</td>
                        <td className="text-[12px] p-[11px_10px] border-b border-[#F0F1F3] align-middle text-center">
                          {isSelf ? (
                            <div 
                              onClick={() => {
                                const nextTasks = tasks.map(t => t.id === task.id ? { ...t, runEnabled: !t.runEnabled, selectEnabled: !t.runEnabled ? false : t.selectEnabled } : t);
                                setTasks(nextTasks);
                              }}
                              className={`w-[36px] h-[20px] rounded-[11px] relative cursor-pointer inline-block transition-colors ${task.runEnabled ? 'bg-[#3D7EDB]' : 'bg-[#C9CDD4]'}`}
                            >
                              <div className={`absolute w-[16px] h-[16px] rounded-full bg-white top-[2px] transition-all duration-150 ${task.runEnabled ? 'left-[18px]' : 'left-[2px]'}`}></div>
                            </div>
                          ) : (
                            <div title="其他主理人的任务，仅可查看" className="inline-flex"><Lock size={15} className="text-[#86909C] mx-auto" /></div>
                          )}
                        </td>
                        <td className="text-[12px] p-[11px_10px] border-b border-[#F0F1F3] align-middle text-center">
                          {isSelf ? (
                            <div 
                              onClick={() => {
                                if (task.runEnabled) {
                                  setTasks(tasks.map(t => t.id === task.id ? { ...t, selectEnabled: !t.selectEnabled } : t));
                                }
                              }}
                              className={`w-[36px] h-[20px] rounded-[11px] relative cursor-pointer inline-block transition-colors ${task.selectEnabled ? 'bg-[#3D7EDB]' : 'bg-[#C9CDD4]'} ${!task.runEnabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                            >
                              <div className={`absolute w-[16px] h-[16px] rounded-full bg-white top-[2px] transition-all duration-150 ${task.selectEnabled ? 'left-[18px]' : 'left-[2px]'}`}></div>
                            </div>
                          ) : (
                            <span className="text-[#86909C]">—</span>
                          )}
                        </td>
                        <td className="text-[12px] p-[11px_10px] border-b border-[#F0F1F3] align-middle text-center">
                          {isSelf && (
                            <div className="flex items-center justify-center gap-2">
                              {isEditing ? (
                                <>
                                  <button onClick={() => handleSaveEdit(task.id, newQuestion, newScope)} className="text-[#3D7EDB] hover:text-[#1E3A8A] font-medium"><Check size={14} /></button>
                                  <button onClick={() => setEditingTaskId(null)} className="text-[#86909C] hover:text-[#4E5969] font-medium">取消</button>
                                </>
                              ) : (
                                <>
                                  <button 
                                    onClick={() => {
                                      setEditingTaskId(task.id);
                                      setNewQuestion(task.question);
                                      setNewScope(task.scopeName);
                                    }} 
                                    className="text-[#86909C] hover:text-[#3D7EDB] transition-colors"
                                  >
                                    <Edit2 size={14} />
                                  </button>
                                  <button 
                                    onClick={() => handleDelete(task.id)} 
                                    className="text-[#86909C] hover:text-[#E34D59] transition-colors"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
          </div>
          
          <div className="text-[10.5px] text-[#86909C] text-center mt-[6px] leading-[1.6]">
            原型为样机示例数据 · 主理人逐专案开启预跑（可分别决定是否开小助精选名单）；优先级与额度由"使用量占比 + 查看/采纳率排名"的赛马机制自动决定，超额自动转实时。
          </div>
        </div>
      </div>
    </div>
  );
};

