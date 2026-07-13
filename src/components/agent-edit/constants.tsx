import { AgentConfig, FileItem, ChatMessage, DataField, Skill, EnvConfig, MockCustomer, AgentSummary, AssociatedItem } from '../../../types';
import { RICH_MOCK_CUSTOMERS } from './mock_customers_data'; 

export const INITIAL_CONFIG: AgentConfig = {
  name: '全能财富顾问助手',
  description: '该智能体采用“SOP逻辑前置”架构。通过代码层预先执行客户分层、风控名单比对和产品合规过滤，仅将经过清洗的精准上下文传递给大模型，彻底解决上下文冗余和数值幻觉问题。',
  instructions: `# Role 
你是一名资深银行财富顾问（Relationship Manager），具备敏锐的资产配置视角和极强的共情能力。你的目标是根据客户的实际持仓和潜在需求，为客户经理提供专业、有温度，能对客的理财建议。（客户经理是你的用户）

# Response Frameworks

## 场景一：用户问“持仓分析” (Holdings Analysis) 
风格要求：专业、客观、数据驱动 
1. **风险扫描**：首先核对客户 持仓是否命中行内预警清单。 
2. **策略建议**： 
   - 若亏损且命中风险：建议调出，转投稳健的固收+或宽基指数。 
   - 若亏损但产品优质：安抚情绪，建议定投摊薄成本。 
   - 若存款占比过高：建议配置增额终身寿或稳健理财锁定收益。

## 场景二：用户问“产品推荐” (Product Recommendation) 
风格要求：个性化、千人千面 
1. **检索星座画像**： 
   - 获取客户的【星座标签】。 
   - 检索知识库中对应的《XX座客户沟通秘籍》，提取该星座的偏好关键词（如：摩羯座喜欢"稳健/数据/权威"，双子座喜欢"新奇/灵活/多变"）。 
   - 在推荐语中应用这些沟通技巧。 
2. **KYC匹配**： 
   - 保守型(A1/A2)：推荐结构性存款、大额存单、黄金积存。 
   - 平衡型(A3)：推荐“固收+”理财、低波红利ETF。 
   - 进取型(A4/A5)：推荐偏股混合基金、私募权益。 
3. **转化话术**：“[客户姓]总，这款产品特别符合您[星座特点]的投资品味...” 。你推荐的产品必须来自于知识中的重点销售产品池。请注意，推荐前，请先根据客户的风险等级，过滤掉超过客户风险等级的产品。千万不能超风险推荐

# Format 
请以Markdown格式输出。若涉及产品对比，请使用表格列出。`,
  summaryPrompt: `请在回复的最开头，先输出一段100字以内的摘要内容，并务必使用 <summary> 标签将其包裹。摘要需要精准概括本次分析的核心结论和建议，方便客户经理快速预览。例如：\n<summary>\n本回复主要分析了客户XX的资产配置情况，建议通过XX产品进行优化...\n</summary>`,
  routerSystemPrompt: `Classify user intent into: HOLDINGS_ANALYSIS, PRODUCT_RECOMMENDATION, EXTERNAL_FUNDS, or GENERAL_CHAT.`,
  associatedItems: [
    { 
      id: 'BIRTHDAY', 
      name: '生日', 
      type: 'tag',
      valueType: 'date',
      dateType: 'MM-DD',
      operator: 'between',
      threshold: '03-01',
      thresholdEnd: '03-31',
      isConfiguredInInsight: true
    },
    { 
      id: 'OPEN_DATE', 
      name: '首次开户时间', 
      type: 'tag',
      valueType: 'date',
      dateType: 'YYYY-MM-DD',
      operator: '>',
      threshold: '2020-01-01',
      isConfiguredInInsight: true
    },
    {
      id: 'NON_INSIGHT_1',
      name: '他行大额存款偏好',
      type: 'tag',
      valueType: 'category',
      values: ['强', '中', '弱'],
      isConfiguredInInsight: false,
      selectedValues: ['强']
    }
  ]
};

export const MOCK_FILES: FileItem[] = [
  { id: 'product_pool_q3', name: '2025年Q3重点销售产品池.docx', type: 'word', status: 'completed' },
  { id: 'global_problem_list', name: '2025年Q3重点调出基金清单(全行版).xlsx', type: 'excel', status: 'completed' },
  { id: 'z_aries', name: '白羊座客户沟通秘籍.docx', type: 'word', status: 'completed' },
  { id: 'z_taurus', name: '金牛座客户沟通秘籍.docx', type: 'word', status: 'completed' },
  { id: 'z_gemini', name: '双子座客户沟通秘籍.docx', type: 'word', status: 'completed' },
  { id: 'z_cancer', name: '巨蟹座客户沟通秘籍.docx', type: 'word', status: 'completed' },
  { id: 'z_leo', name: '狮子座客户沟通秘籍.docx', type: 'word', status: 'completed' },
  { id: 'z_virgo', name: '处女座客户沟通秘籍.docx', type: 'word', status: 'completed' },
  { id: 'z_libra', name: '天秤座客户沟通秘籍.docx', type: 'word', status: 'completed' },
  { id: 'z_scorpio', name: '天蝎座客户沟通秘籍.docx', type: 'word', status: 'completed' },
  { id: 'z_sagittarius', name: '射手座客户沟通秘籍.docx', type: 'word', status: 'completed' },
  { id: 'z_capricorn', name: '摩羯座客户沟通秘籍.docx', type: 'word', status: 'completed' },
  { id: 'z_aquarius', name: '水瓶座客户沟通秘籍.docx', type: 'word', status: 'completed' },
  { id: 'z_pisces', name: '双鱼座客户沟通秘籍.docx', type: 'word', status: 'completed' },
];

export const INITIAL_DATA_FIELDS: DataField[] = [
  { id: 'd1', category: '客户信息数据', sourceName: '基本信息', name: '客户姓名', key: 'cust_name_masked', dataType: 'value', sampleValue: '张*明' },
  { id: 'd2', category: '客户信息数据', sourceName: '基本信息', name: '风险等级', key: 'risk_grade', dataType: 'value', sampleValue: 'A1 (保守型)' },
  { id: 'd5', category: '客户信息数据', sourceName: '基本信息', name: '客户星座', key: 'zodiac_sign', dataType: 'value', sampleValue: '摩羯座' },
  { id: 'd6', category: '客户信息数据', sourceName: '基本信息', name: '星座ID', key: 'zodiac_id', dataType: 'value', sampleValue: 'z_capricorn', description: '用于关联知识库文档' },
  { id: 'd3', category: '客户信息数据', sourceName: '产品持仓明细', name: '持仓列表', key: 'holdings_list_full', dataType: 'list', sampleValue: '[{...}]', description: '包含客户持有的产品明细' },
];

export const INITIAL_SKILLS: Skill[] = [
  { 
    id: 'plugin_card', 
    name: '定制卡片配置', 
    description: '在特定回复中展示定制化业务卡片，如图片展示或代发数据趋势图。', 
    iconType: 'card', 
    selected: false,
    triggerKeywords: ['卡片', '展示', '代发', '图片'],
    config: {
      cardType: 'image',
      showChart: false
    }
  },
  { 
    id: 'plugin_activity', 
    name: '分行重点活动', 
    description: '关联分行热办活动，AI可按卡片形式展示活动信息并作为应答引用数据。', 
    iconType: 'gift', 
    selected: false,
    triggerKeywords: ['活动', '沙龙', '讲座', '优惠'],
    config: {
      associatedIds: ['理财沙龙活动', '养老社区巡演']
    }
  },
  { 
    id: 'plugin_product', 
    name: '分行重点产品', 
    description: '关联分行本月主推产品，提升大模型对重点产品的识别与精准推荐能力。', 
    iconType: 'package', 
    selected: false,
    triggerKeywords: ['产品', '理财', '基金', '存单'],
    config: {
      associatedIds: ['招商添利系列', '中概互联ETF']
    }
  },
  { 
    id: 'plugin_news', 
    name: '资讯素材引用', 
    description: '开启后AI可引用库内最新金融资讯、市场研报素材辅助应答。',
    iconType: 'news',
    selected: false,
    triggerKeywords: ['资讯', '研报', '行情', '新闻'],
    config: {
      type: 'market_report'
    }
  },
  {
    id: 'plugin_customer_filter',
    name: '客户筛选',
    description: '根据客群意图自动联动数据源输出名单。分行配置特定提问场景下的盘户规则。',
    iconType: 'filter',
    selected: false,
    triggerKeywords: ['筛选', '客群', '名单', '符合条件'],
    config: {
      filterRules: []
    }
  }
];

export const MOCK_ASSOCIATED_ITEMS: AssociatedItem[] = [
  // 专案数据库 (Projects & Databases)
  { id: 'PROJ_001', name: '接触专区多波次活动0403', type: 'project' },
  { id: 'DB_001', name: '测试活动数据库', type: 'database' },
  { id: 'DB_002', name: '无锡代发经营', type: 'database' },
  { id: 'DB_003', name: '2026年1月招商银行总行其他0130_1', type: 'database' },
  { id: 'DB_004', name: '批量非实时常规20260324110006', type: 'database' },
  { id: 'PROJ_001_1', name: '实时企微多波次20260427173946', type: 'project' },
  
  // 重要商机MOT (Opportunities)
  { id: 'OPP_001', name: '理财到期', type: 'opportunity' },
  { id: 'OPP_002', name: '基金到期', type: 'opportunity' },
  { id: 'OPP_003', name: '生日', type: 'opportunity' },
  { id: 'OPP_004', name: '他行同名', type: 'opportunity' },
  { id: 'OPP_005', name: '他行异名', type: 'opportunity' },
  { id: 'OPP_006', name: '基金亏损', type: 'opportunity' },

  // 客户标签 (Tags)
  { id: 'B_014Z', name: '丰润人生标识', type: 'tag', valueType: 'category', isConfiguredInInsight: true },
  { id: 'B_A0WY', name: '代发客户类型', type: 'tag', valueType: 'category', isConfiguredInInsight: true },
  { id: '082R', name: '当月时点AUM(考核)', type: 'tag', valueType: 'numeric', isConfiguredInInsight: true },
  { id: '037L', name: '小微贷授信额度', type: 'tag', valueType: 'numeric', isConfiguredInInsight: true },
  { id: '0D03', name: '风评等级', type: 'tag', valueType: 'category', isConfiguredInInsight: true },
  { id: 'A0W4', name: '管户客户标识_全行级', type: 'tag', valueType: 'category', isConfiguredInInsight: true },

  // 保险拓客平台 (Activities - mapped to insurance)
  { id: 'A23W01', name: '保险成熟度-当前持保护户', type: 'activity', category: 'insurance' },
  { id: 'A23W02', name: '保险成熟度-曾经/行外持保护户', type: 'activity', category: 'insurance' },
  { id: 'A23W03', name: '保险成熟度-未持保护户', type: 'activity', category: 'insurance' },
  { id: 'A23W04', name: '保险成熟度-其他客户', type: 'activity', category: 'insurance' },
  { id: 'A3MB01', name: '年金险目标客户', type: 'activity', category: 'insurance' },
  { id: 'BXTK4', name: '保险出单目标', type: 'activity', category: 'insurance' },

  // 业绩中心 (Achievement)
  { id: 'B34001', name: '新进', type: 'achievement' },
  { id: 'B34003', name: '时点/月均提升', type: 'achievement' },
  { id: 'DED_TMZZ', name: '查同名转账', type: 'achievement' },
  { id: 'DED_SHDZ', name: '赎回到账', type: 'achievement' },
  { id: 'TJ4574DD', name: '新开双金', type: 'achievement' },
  { id: 'TJ4574DD_2', name: 'AUM月日均增量', type: 'achievement' },
];

export const INITIAL_ENV_CONFIG: EnvConfig = {
  triggerPage: '财富管理首页',
  displaySlot: '右侧边栏',
  exampleQuestions: [
    '帮我分析一下王总的持仓风险',
    '有什么适合新客户的理财推荐吗？'
  ],
  guessQuestions: [
    '为何张三命中了大额存单赎回预警？',
    '如何安抚亏损严重的客户？'
  ],
  transactions: [
    { title: '持仓分析', prompt: '帮我分析该客户的资产配置情况。' },
    { title: '产品匹配', prompt: '基于知识库中的产品池，为该客户推荐合适的产品。' }
  ],
  tags: []
};

export const MOCK_CUSTOMERS: MockCustomer[] = RICH_MOCK_CUSTOMERS;

export const INITIAL_AGENT_LIST: AgentSummary[] = [
    {
        id: 'agent_001',
        name: '持仓分析智能体',
        description: '专为财富顾问设计的持仓诊断助手，集成了行内特色的风险清单和产品池。',
        updatedAt: Date.now() - 1000 * 60 * 30, // 30 mins ago
        status: 'published',
        tags: ['财富管理', '持仓诊断', '分行专用'],
        avatarColor: 'bg-blue-600',
        ownerId: 'system'
    },
    {
        id: 'agent_002',
        name: '个贷审批流助手 (Beta)',
        description: '辅助个贷经理快速预审客户资质，基于征信数据自动生成面签建议。',
        updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 days ago
        status: 'draft',
        tags: ['个贷业务', '流程辅助', '合规检查'],
        avatarColor: 'bg-purple-600',
        ownerId: 'system'
    },
    {
        id: 'agent_003',
        name: '私人银行税务筹划顾问',
        description: '针对超高净值客户的税务合规 with 家族信托架构搭建建议。',
        updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 5, // 5 days ago
        status: 'published',
        tags: ['私行', '税务', '家族信托'],
        avatarColor: 'bg-amber-600',
        ownerId: 'system'
    }
];
