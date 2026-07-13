const fs = require('fs');
let code = fs.readFileSync('src/components/agent-edit/KnowledgePanel.tsx', 'utf-8');

const startStr = '{/* Customer Group Configuration Drawer */}';
const endStr = '<PrecalcDrawer ';

const startIndex = code.indexOf(startStr);
const endIndex = code.indexOf(endStr, startIndex);

if (startIndex === -1 || endIndex === -1) {
  console.log("NOT FOUND");
  process.exit(1);
}

const newModal = `
      {/* Customer Group Configuration Drawer */}
      {customerGroupConfigOpen !== null && (
        <div className="fixed inset-0 z-[300] bg-[#f5f6f8] flex flex-col font-sans">
          {/* Top Navbar */}
          <div className="flex justify-between items-center px-5 py-2.5 bg-[#eef2f6] border-b border-[#e2e8f0] text-[13px] text-slate-500 shadow-sm">
            <div className="flex items-center gap-5 text-indigo-500">
              <Activity size={16} className="cursor-pointer hover:text-indigo-600 transition-colors" />
              <Send size={16} className="cursor-pointer hover:text-indigo-600 transition-colors" />
              <Mail size={16} className="cursor-pointer hover:text-indigo-600 transition-colors" />
              <CheckSquare size={16} className="cursor-pointer hover:text-indigo-600 transition-colors" />
              <Share size={16} className="cursor-pointer hover:text-indigo-600 transition-colors" />
              <Trash2 size={16} className="cursor-pointer hover:text-indigo-600 transition-colors" />
              <Star size={16} className="cursor-pointer hover:text-indigo-600 transition-colors" />
              <CircleUser size={16} className="cursor-pointer hover:text-indigo-600 transition-colors" />
            </div>
            <div className="flex items-center gap-6">
              <span className="font-medium text-slate-700">标签客群 (版本12)</span>
              <span className="flex items-center gap-1.5"><Pencil size={14} className="text-slate-400" /> 编辑中</span>
              <span>未生效</span>
              <span className="flex items-center gap-1.5 ml-4">
                数据范围: 招商银行全行 <Settings size={14} className="text-slate-400 cursor-pointer hover:text-slate-600 transition-colors" />
              </span>
            </div>
          </div>

          {/* Page Header */}
          <div className="px-5 py-3 bg-white border-b border-[#e2e8f0] flex items-center justify-between">
            <div className="flex items-center gap-1.5 cursor-pointer group">
              <ChevronDown size={20} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
              <span className="font-bold text-slate-800 text-[16px]">客群配置</span>
            </div>
            {/* Action to close and save */}
            <button 
              onClick={() => {
                const ruleName = \`本年月最高代发金额_组合\`;
                if (customerGroupConfigOpen === 'new') {
                   setNewRuleDraft({...newRuleDraft, customerGroups: [...((newRuleDraft as any)?.customerGroups || []), ruleName]} as any);
                } else if (typeof customerGroupConfigOpen === 'number') {
                   const skill = skills.find(s => s.id === "plugin_customer_filter");
                   const rules = [...(skill?.config?.filterRules || [])];
                   const rule = rules[customerGroupConfigOpen];
                   rules[customerGroupConfigOpen] = {
                     ...rule,
                     customerGroups: [...(rule.customerGroups || []), ruleName]
                   };
                   updateSkillConfig("plugin_customer_filter", { filterRules: rules });
                }
                setCustomerGroupConfigOpen(null);
              }}
              className="text-[13px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-1.5 rounded-md flex items-center gap-2 transition-all shadow-sm"
            >
              <Save size={14} /> 保存并关闭
            </button>
          </div>

          {/* Main Area */}
          <div className="flex flex-1 overflow-hidden">
            {/* Left Sidebar */}
            <div className="w-[450px] flex flex-col border-r border-[#e2e8f0] bg-white">
              {/* Search */}
              <div className="p-3">
                <div className="relative flex items-center bg-[#f5f6f8] rounded-md px-3 py-2 border border-transparent focus-within:border-indigo-400 transition-colors">
                  <input type="text" placeholder="请输入标签关键字/客群名/客群ID搜索" className="bg-transparent flex-1 outline-none text-[13px] text-slate-700 placeholder:text-slate-400" />
                  <div className="flex items-center gap-3 text-slate-400 ml-2">
                    <Search size={15} className="cursor-pointer hover:text-slate-600 transition-colors" />
                    <div className="relative cursor-pointer group">
                      <Bot size={15} className="text-indigo-600" />
                      <span className="absolute -top-1 -right-1 text-[8px] bg-red-500 text-white leading-none px-0.5 rounded font-bold">AI</span>
                    </div>
                    <ChevronsLeft size={16} className="cursor-pointer hover:text-slate-600 transition-colors" />
                  </div>
                </div>
              </div>
              
              {/* Tabs */}
              <div className="flex border-b border-[#e2e8f0] text-[13px] text-center">
                <div className="flex-1 py-2 text-indigo-600 font-bold border-b-2 border-indigo-600 cursor-pointer">标签</div>
                <div className="flex-1 py-2 text-slate-600 font-medium cursor-pointer hover:bg-slate-50 transition-colors">客群</div>
              </div>
              
              {/* Left Content */}
              <div className="flex flex-1 overflow-hidden">
                {/* Vertical Menu */}
                <div className="w-32 bg-[#f8fafc] border-r border-[#e2e8f0] overflow-y-auto">
                  <div className="px-3 py-3 text-[13px] text-indigo-600 bg-white border-l-2 border-indigo-600 font-medium cursor-pointer">推荐</div>
                  <div className="px-3 py-3 text-[13px] text-slate-600 hover:bg-slate-50 cursor-pointer">最近使用</div>
                  <div className="px-3 py-3 text-[13px] text-slate-600 hover:bg-slate-50 cursor-pointer flex items-center gap-1.5">上新 <span className="text-[10px] bg-green-100 text-green-600 px-1 rounded-sm leading-none py-0.5 font-medium">新</span></div>
                  <div className="px-3 py-3 text-[13px] text-slate-600 hover:bg-slate-50 cursor-pointer">我的收藏</div>
                  <div className="px-3 py-3 text-[13px] text-slate-600 hover:bg-slate-50 cursor-pointer flex items-center justify-between group">
                    我的创建 <ChevronUp size={14} className="text-slate-400 group-hover:text-slate-600" />
                  </div>
                  <div className="px-3 py-3 text-[13px] text-slate-600 hover:bg-slate-50 cursor-pointer flex items-center justify-between group">
                    自定义标签 <Plus size={14} className="text-slate-400 group-hover:text-slate-600" />
                  </div>
                  <div className="px-3 py-3 text-[13px] text-slate-600 hover:bg-slate-50 cursor-pointer">动态名单</div>
                  <div className="px-3 py-3 text-[13px] text-slate-600 hover:bg-slate-50 cursor-pointer flex items-center justify-between group">
                    潜力资产分析... <ChevronUp size={14} className="text-slate-400 group-hover:text-slate-600" />
                  </div>
                  <div className="px-3 py-3 text-[13px] text-slate-600 hover:bg-slate-50 cursor-pointer">信贷资质</div>
                  <div className="px-3 py-3 text-[13px] text-slate-600 hover:bg-slate-50 cursor-pointer">收入支出</div>
                  <div className="px-3 py-3 text-[13px] text-slate-600 hover:bg-slate-50 cursor-pointer">资产状况</div>
                  <div className="px-3 py-3 text-[13px] text-slate-600 hover:bg-slate-50 cursor-pointer">身份圈层</div>
                  <div className="px-3 py-3 text-[13px] text-slate-600 hover:bg-slate-50 cursor-pointer">潜力模型标签</div>
                  <div className="px-3 py-3 text-[13px] text-slate-600 hover:bg-slate-50 cursor-pointer">代发情况</div>
                </div>
                
                {/* Grid List */}
                <div className="flex-1 overflow-y-auto bg-white p-2 content-start">
                  <div className="grid grid-cols-2 gap-x-2 gap-y-3">
                    {[
                      { name: '网点到访多维标签', count: 47 },
                      { name: 'MAC行为多维标签', count: 586 },
                      { name: '本年月最高代发金额', count: 54 },
                      { name: '当前财富产品持仓金额', count: '1,734', badge: '效', newBadge: true },
                      { name: '当年动账新户日期', count: 66 },
                      { name: '当月他行高端卡等级代码', count: 31 },
                      { name: '快捷支付用户历史已绑卡机构', count: '2,520' },
                      { name: '持仓定开理财未来最近赎回...', count: 16 },
                      { name: '企业微信客户经理岗位', count: 84 },
                      { name: '年龄', count: '4万+', hot: true },
                      { name: '本行员工标识', count: '4万+' },
                      { name: '招乎客户黑名单标识', count: '2万+' },
                      { name: '招乎open_id客户标识', count: '1万+' },
                      { name: '营销灰名单客户标识(全行)', count: '7,190' },
                      { name: '零售客户营销单独授权黑名单', count: '3,394' },
                      { name: '客户理财风险承受能力...', count: '2,957', badge: '效' },
                      { name: '网点通客户黑名单标识', count: '2,482' }
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center text-[12px] group cursor-pointer hover:bg-slate-50 rounded px-1.5 py-1.5 transition-colors">
                        <span className="truncate text-slate-700 flex items-center gap-1">
                          {item.name}
                          {item.hot && <span className="bg-red-100 text-red-500 text-[10px] px-1 rounded-sm leading-none py-0.5">热</span>}
                          {item.badge && <span className="bg-orange-100 text-orange-500 text-[10px] px-1 rounded-sm leading-none py-0.5">{item.badge}</span>}
                          {item.newBadge && <span className="bg-green-100 text-green-600 text-[10px] px-1 rounded-sm leading-none py-0.5">新</span>}
                        </span>
                        <span className="text-slate-400 shrink-0 ml-1">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Editor Area */}
            <div className="flex-1 flex flex-col relative">
              {/* Header */}
              <div className="flex justify-between items-center px-5 py-3 bg-white border-b border-[#e2e8f0] shadow-sm z-10">
                <div className="text-[13px] font-bold text-slate-800 flex items-center">
                  标签&客群组合 <span className="text-slate-400 font-normal ml-3 tracking-wide">(按住Ctrl，点击多个标签，可进行批量拖动)</span>
                </div>
                <div className="flex items-center gap-4 text-indigo-600">
                  <FileText size={16} className="cursor-pointer hover:text-indigo-700 transition-colors" />
                  <Save size={16} className="cursor-pointer hover:text-indigo-700 transition-colors" />
                  <Trash2 size={16} className="cursor-pointer hover:text-indigo-700 transition-colors" />
                  <ChevronUp size={16} className="cursor-pointer hover:text-indigo-700 transition-colors" />
                </div>
              </div>
              
              {/* Canvas Area */}
              <div className="flex-1 p-5 overflow-auto relative bg-[#f5f6f8]">
                {/* Active Tag Block */}
                <div className="bg-white border-[1.5px] border-indigo-500 rounded-md shadow-sm w-[460px] flex items-stretch overflow-hidden group">
                  <div className="px-2 py-2.5 text-slate-300 cursor-move border-r border-slate-100 bg-slate-50 flex items-center justify-center hover:text-indigo-400 transition-colors">
                    <GripVertical size={14} />
                  </div>
                  <div className="px-4 py-2.5 text-[13px] text-slate-800 border-r border-slate-100 bg-slate-50 flex items-center font-medium">
                    本年月最高代发金额
                  </div>
                  <div className="flex-1 flex items-stretch">
                    <div className="px-3 flex items-center gap-1.5 text-[13px] text-slate-600 border-r border-slate-100 bg-white cursor-pointer hover:bg-slate-50 transition-colors">
                      a ≤ x ≤ b <ChevronDown size={14} className="text-slate-400" />
                    </div>
                    <div className="flex-1 bg-white relative">
                      <input type="text" className="absolute inset-0 w-full h-full outline-none px-3 text-[13px] text-slate-700" />
                    </div>
                  </div>
                  <div className="px-3 flex items-center justify-center text-slate-300 cursor-pointer hover:text-red-500 hover:bg-red-50 transition-colors border-l border-slate-100">
                    <X size={14} />
                  </div>
                </div>
              </div>
              
              {/* Footer Floating Info */}
              <div className="absolute bottom-5 right-5 flex items-stretch bg-white border border-[#e2e8f0] rounded-md shadow-md overflow-hidden">
                <div className="px-4 py-2 text-[13px] font-medium text-slate-700 flex items-center">
                  预估名单量: <span className="ml-1 text-slate-400">--</span>
                </div>
                <button className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center justify-center">
                  <RefreshCcw size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
`;

code = code.substring(0, startIndex) + newModal + code.substring(endIndex);

fs.writeFileSync('src/components/agent-edit/KnowledgePanel.tsx', code);
console.log('Done');
