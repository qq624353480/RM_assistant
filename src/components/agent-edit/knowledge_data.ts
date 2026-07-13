import { RICH_PRODUCT_DATABASE } from './mock_products_data';

// 知识库数据中心
// 存储大篇幅的静态文本内容，如基金清单、长篇沟通SOP等

// --- 动态生成产品池内容 (基于 RICH_PRODUCT_DATABASE) ---
const buildProductPoolText = () => {
    const { tbl_wmp_prod, tbl_ins_prod, tbl_gold_prod, tbl_deposit_prod, tbl_fund_prod, tbl_private_prod } = RICH_PRODUCT_DATABASE;

    // Helper to filter and map
    const getWMPs = (risk: string) => tbl_wmp_prod.filter(p => p.wmp_risk === risk && p.wmp_status === '在售').slice(0, 5);
    const getFunds = (minYield: number, maxYield: number) => tbl_fund_prod.filter(p => {
        const y = parseFloat(p.fund_yield_1y.replace('%', ''));
        return y >= minYield && y <= maxYield;
    }).slice(0, 5);

    // Helper to format with explicit TAG for parsing
    const fmt = (risk: string, text: string) => `   - [风险等级: ${risk}] ${text}`;

    return `【2025年Q3 零售条线重点销售产品池 (白名单)】
*严禁向客户推荐不在本清单内的产品。推荐前必须核对客户风险承受能力。*

一、 稳健低波类 (适合 R1/R2 客户)
1. 存款/理财精选
${tbl_deposit_prod.cd_list.slice(0, 3).map(p => fmt('R1', `${p.prod_name}: ${p.duration}, ${p.rate}, ${p.min_amt}`)).join('\n')}
${getWMPs('R2').map(p => fmt('R2', `${p.wmp_name} (${p.wmp_code}): 业绩基准${p.wmp_yield_est}`)).join('\n')}

2. 保险 (长期锁定)
${tbl_ins_prod.slice(0, 3).map(p => fmt('R2', `${p.ins_prod_name}: ${p.ins_features}`)).join('\n')}

3. 黄金 (避险)
${tbl_gold_prod.slice(0, 1).map(p => fmt('R3', `黄金积存金: 实时买入价约 ${p.gold_price_buy}, 建议定投`)).join('\n')}

二、 均衡配置类 (适合 R3 客户)
1. "固收+"与债基
${getWMPs('R3').slice(0, 3).map(p => fmt('R3', `${p.wmp_name}: ${p.wmp_yield_est}, 投向:${p.wmp_top10_holdings}`)).join('\n')}

2. 稳健基金 (近1年收益 0% ~ 10%)
${getFunds(0, 10).map(p => fmt('R3', `${p.fund_name} (${p.fund_code}): 近1年${p.fund_yield_1y}, 最大回撤${p.fund_max_drawdown_1y}`)).join('\n')}

三、 进取进攻类 (适合 R4/R5 客户)
1. 偏股混合/行业精选 (高弹性)
${getFunds(10, 100).map(p => fmt('R4', `${p.fund_name} (${p.fund_code}): 近1年${p.fund_yield_1y}, 行业:${p.fund_ind_alloc}`)).join('\n')}

2. 私募甄选 (高净值专享)
${tbl_private_prod.slice(0, 3).map(p => fmt('R5', `${p.pe_name}: ${p.pe_strategy}, 门槛${p.pe_min_amt}, 业绩${p.pe_yield_list}`)).join('\n')}
`;
};

const PRODUCT_POOL_CONTENT = buildProductPoolText();

// --- 动态生成风险警示清单 (基于 RICH_PRODUCT_DATABASE) ---
const buildProblemListText = () => {
    // Filter funds with bad performance
    const badFunds = RICH_PRODUCT_DATABASE.tbl_fund_prod.filter(f => parseFloat(f.fund_yield_1y.replace('%', '')) < -10);
    
    const list = badFunds.map((f, i) => {
        let reason = "业绩不及预期";
        if (f.fund_ind_alloc.includes('医疗')) reason = "医药板块集采影响持续，估值重塑中";
        if (f.fund_ind_alloc.includes('白酒')) reason = "消费复苏疲软，库存周期高企";
        if (f.fund_ind_alloc.includes('新能源')) reason = "产能过剩，行业内卷严重";
        if (parseFloat(f.fund_max_drawdown_1y.replace('%', '')) < -25) reason += "，回撤控制能力较差";
        
        return `${i+1}. ${f.fund_name} (${f.fund_code}): ${reason} (近1年跌幅${f.fund_yield_1y})`;
    });

    return `【2025年Q3 重点关注/待调出基金清单 (共${list.length}只)】\n` + list.join('\n');
};

const GLOBAL_PROBLEM_LIST_CONTENT = buildProblemListText();

// --- 星座沟通秘籍模板生成器 ---
const createZodiacGuide = (sign: string, keywords: string, traits: string, strategy: string, script: string) => {
  return `# ${sign}深度客户画像与沟通全案 (2025版)

## 1. 核心心理画像 (Psychological Profile)
${sign}客户在财富管理领域通常表现出鲜明的性格特征。${traits}
他们在做决策时，往往不是单纯看数据，而是看感觉、看关系、看未来。深入理解其心理动机，是建立长期信任的关键。
- **决策模式**：${sign.includes('火象') ? '直觉驱动，快速决策' : sign.includes('土象') ? '逻辑驱动，深思熟虑' : sign.includes('风象') ? '信息驱动，摇摆不定' : '情感驱动，依赖信任'}。
- **信任建立**：需要${sign.includes('土') ? '长时间的专业服务证明' : '瞬间的情感共鸣或权威背书'}。

## 2. 财富观与投资偏好 (Wealth & Investment)
### 2.1 风险偏好
${keywords}是他们的代名词。在投资上，他们倾向于：
- **核心诉求**：${strategy}
- **资产配置**：${sign.includes('金牛') || sign.includes('摩羯') ? '偏好固收、房产、黄金等有形资产' : '偏好股票、基金、股权等高弹性资产'}。

## 3. 沟通雷区 (Red Flags - 千万别说)
1. **切忌啰嗦**：${sign}最讨厌无效信息，不要铺垫太久。
2. **切忌逼单**：不要给他们太大的压迫感，尤其是月末冲量时。

## 4. 黄金沟通法则 (Golden Rules)
- **法则一：尊重与倾听**。让他们先表达，捕捉其当下的情绪点。
- **法则二：数据与逻辑**。准备好详尽的图表（Chart），胜过千言万语。

## 5. 场景化话术脚本 (Scenarios)
### 5.1 产品切入 (Product Pitch)
> "${script}"

---
*内部机密资料，请勿外传。更新时间：2025-02-15*
`;
};

const ARIES = createZodiacGuide("白羊座 (Aries)", "直接、高效、高收益、尝鲜", "...", "...", "...");
const TAURUS = createZodiacGuide("金牛座 (Taurus)", "稳健、性价比、实物、复利", "...", "...", "...");
const GEMINI = createZodiacGuide("双子座 (Gemini)", "新奇、灵活、多策略、信息灵通", "...", "...", "...");
const CANCER = createZodiacGuide("巨蟹座 (Cancer)", "家庭、保障、安全感、子女教育", "...", "...", "...");
const LEO = createZodiacGuide("狮子座 (Leo)", "尊贵、独家、面子、高端", "...", "...", "...");
const VIRGO = createZodiacGuide("处女座 (Virgo)", "细节、逻辑、风控、专业", "...", "...", "...");
const LIBRA = createZodiacGuide("天秤座 (Libra)", "平衡、优雅、口碑、从众", "...", "...", "...");
const SCORPIO = createZodiacGuide("天蝎座 (Scorpio)", "隐私、深度、直觉、绝对收益", "...", "...", "...");
const SAGITTARIUS = createZodiacGuide("射手座 (Sagittarius)", "宏观、未来、自由、海外配置", "...", "...", "...");
const CAPRICORN = createZodiacGuide("摩羯座 (Capricorn)", "权威、长期、规划、养老", "...", "...", "...");
const AQUARIUS = createZodiacGuide("水瓶座 (Aquarius)", "创新、科技、量化、另类", "...", "...", "...");
const PISCES = createZodiacGuide("双鱼座 (Pisces)", "梦想、直觉、慈善、艺术", "...", "...", "...");

export const ZODIAC_KNOWLEDGE_BASE: Record<string, string> = {
  'product_pool_q3': PRODUCT_POOL_CONTENT,
  'global_problem_list': GLOBAL_PROBLEM_LIST_CONTENT,
  'z_aries': ARIES,
  'z_taurus': TAURUS,
  'z_gemini': GEMINI,
  'z_cancer': CANCER,
  'z_leo': LEO,
  'z_virgo': VIRGO,
  'z_libra': LIBRA,
  'z_scorpio': SCORPIO,
  'z_sagittarius': SAGITTARIUS,
  'z_capricorn': CAPRICORN,
  'z_aquarius': AQUARIUS,
  'z_pisces': PISCES,
};
