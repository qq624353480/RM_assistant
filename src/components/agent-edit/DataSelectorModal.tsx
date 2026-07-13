import React, { useState } from 'react';
import { DatabaseIcon, TableIcon, CodeIcon, ChevronDownIcon, PlusIcon } from './Icons';
import { DataField } from '../../../types';

interface DataSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (field: DataField) => void;
}

// === Mock Database Structure ===
const DATA_SOURCE_TREE = [
  {
    id: 'cat_cust',
    name: '客户数据',
    tables: [
      {
        id: 'tbl_basic',
        name: '基本信息表',
        description: '客户核心身份信息及脱敏标识',
        fields: [
          { key: 'cust_name_masked', name: '姓名', sample: '王*强' },
          { key: 'gender', name: '性别', sample: '男' },
          { key: 'birthday', name: '生日', sample: '1995/1/1' },
          { key: 'ethnicity', name: '民族', sample: '汉族' },
          { key: 'org_name', name: '归属机构', sample: '招商银行深圳分行' },
          { key: 'age', name: '年龄', sample: '31' },
          { key: 'risk_grade', name: '客户风险评级', sample: 'A4 (进取型)' },
          { key: 'card_level', name: '借记卡等级', sample: '金葵花' },
        ]
      },
      {
        id: 'tbl_aum',
        name: 'AUM信息表',
        description: '客户资产负债及AUM走势数据',
        fields: [
          { key: 'curr_aum_point', name: '当前时点AUM', sample: '100,000元' },
          { key: 'curr_aum_avg_30d', name: '30日日均AUM', sample: '105,000.50' },
          { key: 'liquid_amt', name: '活钱管理金额', sample: '20,000元' },
          { key: 'stable_amt', name: '稳健投资金额', sample: '30,000元' },
          { key: 'aggressive_amt', name: '进取投资金额', sample: '40,000元' },
          { key: 'aum_history_json', name: '资产走势详情', sample: '[{month:1, value:100000}, ...]' },
        ]
      },
      {
        id: 'tbl_holdings',
        name: '持仓信息表',
        description: '客户当前所持理财、基金、保险等具体清单',
        isList: true,
        fields: [
          { key: 'holdings_list', name: '持仓产品清单', sample: '[{prodName:"日日盈", balance:50000.5}...]' },
          { key: 'total_yield_ytd', name: '本年累计收益', sample: '+3,500.22' },
          { key: 'near_expiry_count', name: '近期到期产品数量', sample: '2' },
        ]
      },
      {
        id: 'tbl_behavior',
        name: '行为偏好表',
        description: '客户App浏览历史与投资偏好分析',
        fields: [
          { key: 'top_browsed_product', name: '最常浏览产品类型', sample: '混合型基金' },
          { key: 'last_login_time', name: '最近登录App时间', sample: '2025-05-26 14:30:05' },
          { key: 'risk_preference', name: '大模型研判投资偏好', sample: '稳重求进' },
        ]
      }
    ]
  },
  {
    id: 'cat_product',
    name: '产品数据',
    tables: [
      {
        id: 'tbl_deposit_prod',
        name: '存款/理财清单',
        description: '在售精选存款及理财产品信息库',
        isList: true,
        fields: [
          { key: 'smart_deposit_rate', name: '当前智存通利率', sample: '1.85%' },
          { key: 'featured_wealth_list', name: '主推理财产品列表', sample: '[{name:"招睿1号", rate:"3.2%"}]' },
          { key: 'prod_risk_level', name: '理财风险等级', sample: 'R2-稳健' },
        ]
      },
      {
        id: 'tbl_fund_market',
        name: '基金代销清单',
        description: '主流基金经理及基金产品核心表现数据',
        isList: true,
        fields: [
          { key: 'top_performing_funds', name: '全行热销基金排行', sample: 'List<Fund>' },
          { key: 'fund_manager_rating', name: '基金经理星级评定', sample: '4.5星' },
          { key: 'min_investment', name: '起购金额', sample: '10.00' },
        ]
      },
      {
        id: 'tbl_insurance',
        name: '保险产品库',
        description: '终身寿险、年金险、健康险配置详情',
        isList: true,
        fields: [
          { key: 'insurance_types', name: '可选险种', sample: '定期寿险; 重疾险' },
          { key: 'popular_annuity', name: '热门年金险测算参考', sample: '10年期/3.5%复利' },
        ]
      }
    ]
  },
  {
    id: 'cat_market',
    name: '市场数据',
    tables: [
      {
        id: 'tbl_stock_market',
        name: '股市热点行情',
        description: '实时与回测的指数及行业板块行情',
        fields: [
          { key: 'shanghai_index', name: '上证指数当前值', sample: '3150.25' },
          { key: 'hot_sectors', name: '今日热门板块', sample: '半导体、低空经济' },
          { key: 'market_sentiment', name: '市场情绪指数', sample: '65 (乐观)' },
        ]
      },
      {
        id: 'tbl_reports',
        name: '行业研究报告',
        description: '精选研报核心摘要与逻辑支撑',
        isList: true,
        fields: [
          { key: 'industry_news', name: '行业资讯摘要', sample: 'AI算力需求持续爆发' },
          { key: 'weekly_outlook', name: '招行策略周报核心', sample: '看好红利资产表现' },
        ]
      },
      {
        id: 'tbl_macro',
        name: '宏观经济指标',
        description: 'CPI、PPI、利率、汇率等宏观大盘数据',
        fields: [
          { key: 'current_lpr', name: '当前LPR利率', sample: '3.45%' },
          { key: 'usd_cny_rate', name: '美元兑人民币中间价', sample: '7.21' },
          { key: 'gdp_target', name: '季度GDP增速目标', sample: '5.0%' },
        ]
      }
    ]
  },
  {
    id: 'cat_rm',
    name: 'RM 数据',
    tables: [
      {
        id: 'tbl_indicators',
        name: '考核指标汇总',
        description: '客户经理个人KPI达成、AUM净增与排名',
        fields: [
          { key: 'target_aum_inc', name: '本月AUM净增目标', sample: '5,000,000' },
          { key: 'reached_percent', name: '当前进度完成比', sample: '85%' },
          { key: 'ranking_pos', name: '网点排名', sample: '3 / 12' },
        ]
      },
      {
        id: 'tbl_logs',
        name: '客户经营记录',
        description: '过往营销日志、外呼记录及客户反馈',
        isList: true,
        fields: [
          { key: 'visit_logs', name: '面访记录摘要', sample: '2025-05-10 客户对结构性存款感兴趣' },
          { key: 'follow_up_plans', name: '待跟进待办清单', sample: '[{date: "05-28", task: "回顾理财配置"}]' },
        ]
      },
      {
        id: 'tbl_news',
        name: '行内资讯公告',
        description: '全行重点业务指引、活动资讯及产品上新通告',
        isList: true,
        fields: [
          { key: 'internal_announcements', name: '行内重要通知', sample: '关于调整存款挂牌利率的通知' },
          { key: 'marketing_campaigns', name: '最新营销活动咨询', sample: 'M+会员专享升值季' },
        ]
      }
    ]
  }
];

const DataSelectorModal: React.FC<DataSelectorModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [selectedCategory, setSelectedCategory] = useState(DATA_SOURCE_TREE[0]);
  const [selectedTable, setSelectedTable] = useState(DATA_SOURCE_TREE[0].tables[0]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl w-[900px] h-[600px] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="h-14 border-b border-gray-200 flex items-center justify-between px-6 bg-gray-50">
           <div className="flex items-center gap-2">
               <DatabaseIcon />
               <span className="font-bold text-slate-700">添加数据源引用</span>
           </div>
           <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
           </button>
        </div>

        {/* 3-Column Layout */}
        <div className="flex-1 flex overflow-hidden">
            
            {/* 1. Category Column */}
            <div className="w-1/4 border-r border-gray-200 bg-gray-50/50 flex flex-col">
                <div className="p-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">数据分类</div>
                <div className="flex-1 overflow-y-auto">
                    {DATA_SOURCE_TREE.map(cat => (
                        <div 
                            key={cat.id}
                            onClick={() => {
                                setSelectedCategory(cat);
                                setSelectedTable(cat.tables[0]);
                            }}
                            className={`flex items-center justify-between px-4 py-3 cursor-pointer text-sm ${selectedCategory.id === cat.id ? 'bg-white border-l-4 border-blue-600 text-blue-700 font-medium shadow-sm' : 'text-slate-600 hover:bg-gray-100'}`}
                        >
                            {cat.name}
                            <ChevronDownIcon className={`w-3 h-3 text-gray-400 -rotate-90`} />
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. Table Column */}
            <div className="w-1/3 border-r border-gray-200 bg-white flex flex-col">
                 <div className="p-3 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                     {selectedCategory.name} - 数据表
                 </div>
                 <div className="flex-1 overflow-y-auto">
                     {selectedCategory.tables.map(tbl => (
                         <div 
                             key={tbl.id}
                             onClick={() => setSelectedTable(tbl)}
                             className={`px-4 py-3 cursor-pointer border-b border-gray-50 transition-colors ${selectedTable.id === tbl.id ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}
                         >
                             <div className="flex items-center gap-2 mb-1">
                                 <TableIcon />
                                 <span className={`text-sm ${selectedTable.id === tbl.id ? 'text-blue-700 font-medium' : 'text-slate-700'}`}>
                                     {tbl.name}
                                 </span>
                             </div>
                             {(tbl as any).description && (
                                 <p className="text-xs text-gray-400 truncate pl-6">{(tbl as any).description}</p>
                             )}
                         </div>
                     ))}
                 </div>
            </div>

            {/* 3. Field/Action Column */}
            <div className="flex-1 bg-white flex flex-col">
                 <div className="p-3 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100 flex justify-between items-center">
                     <span>字段选择</span>
                     <span className="text-xs normal-case text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                         Table: {selectedTable.name}
                     </span>
                 </div>
                 <div className="flex-1 overflow-y-auto p-4 space-y-4">
                     
                     {/* Option A: Whole Interface Reference */}
                     <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 hover:shadow-md transition-shadow">
                         <div className="flex justify-between items-start mb-2">
                             <div className="flex items-center gap-2 text-purple-700 font-bold text-sm">
                                 <CodeIcon />
                                 引用完整接口数据 (JSON)
                             </div>
                             <button 
                                onClick={() => {
                                    onAdd({
                                        id: Date.now().toString(),
                                        category: selectedCategory.name,
                                        sourceName: selectedTable.name,
                                        name: `${selectedTable.name} (完整)`,
                                        key: `${selectedTable.id}_full`,
                                        dataType: (selectedTable as any).isList ? 'list' : 'object',
                                        sampleValue: (selectedTable as any).isList ? '[{...}, {...}]' : '{...}',
                                        description: (selectedTable as any).description || '完整表数据'
                                    });
                                    onClose();
                                }}
                                className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded transition-colors flex items-center gap-1"
                             >
                                <PlusIcon /> 添加整表
                             </button>
                         </div>
                         <p className="text-xs text-purple-600/80 leading-relaxed">
                             将 {selectedTable.name} 的所有记录和字段作为结构化数据（{(selectedTable as any).isList ? 'List列表' : 'Object对象'}）传递给模型。
                         </p>
                     </div>

                     <div className="border-t border-gray-100 my-4"></div>
                     <p className="text-xs text-gray-400 mb-2">或选择单一字段：</p>

                     {/* Option B: Single Fields */}
                     <div className="grid grid-cols-1 gap-2">
                         {selectedTable.fields.map(field => (
                             <div key={field.key} className="flex items-center justify-between p-3 rounded border border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 group transition-all">
                                 <div>
                                     <div className="text-sm font-medium text-slate-700">{field.name}</div>
                                     <div className="flex items-center gap-2 mt-0.5">
                                         <span className="text-xs font-mono text-gray-400 bg-gray-50 px-1 rounded">{field.key}</span>
                                         <span className="text-[10px] text-gray-400">示例: {field.sample}</span>
                                     </div>
                                 </div>
                                 <button 
                                    onClick={() => {
                                        onAdd({
                                            id: Date.now().toString(),
                                            category: selectedCategory.name,
                                            sourceName: selectedTable.name,
                                            name: field.name,
                                            key: field.key,
                                            dataType: 'value',
                                            sampleValue: field.sample
                                        });
                                        onClose();
                                    }}
                                    className="opacity-0 group-hover:opacity-100 px-2 py-1 border border-blue-600 text-blue-600 rounded text-xs hover:bg-blue-600 hover:text-white transition-all"
                                 >
                                     添加
                                 </button>
                             </div>
                         ))}
                     </div>

                 </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default DataSelectorModal;
