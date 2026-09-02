
export enum PageType {
  LIST = 'LIST',
  CREATE = 'CREATE',
  NO_PERMISSION = 'NO_PERMISSION',
  AGENT_EDIT = 'AGENT_EDIT'
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  creator: string;
  time: string;
  status: '正式版' | '草稿箱';
  org: string;
  isExcellenceCase?: boolean;
}

export type Category = '全部' | '产品类' | '客户类' | '市场类' | '陪伴类' | '业绩类' | '智能专案类' | '其他类';

export interface FileItem {
  id: string;
  name: string;
  type: 'word' | 'pdf' | 'excel' | 'txt';
  status: 'learning' | 'completed';
}

export interface TraceStep {
  title: string;
  type: 'router' | 'data' | 'rag' | 'prompt' | 'skill' | 'code';
  status: 'success' | 'processing' | 'pending';
  items: string[];
  cost?: string;
}

export interface MarketingHitInfo {
  hitSegment: string;
  recommendedAgent: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  thinking?: string;
  trace?: TraceStep[];
  marketingInfo?: MarketingHitInfo;
  tableData?: {
    category: string;
    percentage: string;
    feature: string;
    analysis: string;
  }[];
}

export interface AssociatedItem {
  id: string;
  name: string;
  type: 'project' | 'opportunity' | 'tag' | 'activity' | 'database' | 'achievement';
  valueType?: 'category' | 'numeric' | 'date';
  dateType?: 'MM-DD' | 'YYYY-MM-DD';
  values?: string[];
  selectedValues?: string[];
  operator?: '>' | '<' | '>=' | '<=' | '=' | 'between';
  threshold?: number | string;
  thresholdEnd?: number | string;
  isConfiguredInInsight?: boolean;
  category?: string;
}

export interface AgentConfig {
  name: string;
  description: string;
  instructions: string;
  routerSystemPrompt?: string;
  summaryPrompt?: string;
  globalCacheEnabled?: boolean;
  associatedItems?: AssociatedItem[];
  placementLogic?: 'AND' | 'OR';
  model?: string;
  temperature?: number;
  maxTokens?: number;
  searchGrounding?: boolean;
  isExcellenceCase?: boolean;
}

export interface DataField {
  id: string;
  category: string;
  sourceName: string;
  name: string;
  key: string;
  dataType: 'value' | 'list' | 'object';
  sampleValue: string;
  description?: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  iconType: 'calc' | 'chart' | 'card' | 'search' | 'money' | 'gift' | 'package' | 'news' | 'brain' | 'filter';
  selected: boolean;
  triggerKeywords: string[];
  sopLogic?: string;
  instruction?: string;
  config?: {
    cardType?: 'image' | 'payroll';
    imageUrl?: string;
    showChart?: boolean;
    associatedIds?: string[];
    type?: string;
    filterRules?: { 
      intent: string; 
      tags?: { name: string; condition: string }[];
      projects?: string[];
      databases?: string[];
      opportunities?: string[];
      sources?: string[];
      customerGroups?: string[];
    }[];
  };
}

export interface EnvConfig {
  triggerPage: string;
  displaySlot: string;
  exampleQuestions?: string[];
  guessQuestions?: string[];
  transactions?: { title: string; prompt: string }[];
  tags?: any[];
}

export interface AppState {
  agentConfig: AgentConfig;
  files: FileItem[];
  dataFields: DataField[];
  skills: Skill[];
  envConfig: EnvConfig;
  chatHistory: ChatMessage[];
  versions: Version[];
  evaluationResult?: EvaluationResult;
}

export interface Version {
  id: string;
  label: string;
  timestamp: number;
  data: Omit<AppState, 'versions'>;
}

export interface MockCustomer {
  id: string;
  name: string;
  label: string;
  avatarColor: string;
  data: Record<string, string>;
}

export interface AgentSummary {
  id: string;
  name: string;
  description: string;
  updatedAt: number;
  status: 'published' | 'draft';
  tags: string[];
  avatarColor: string;
  ownerId: string;
}

export interface EvaluationDimension {
  name: string;
  score: number;
  analysis: string;
}

export interface EvaluationResult {
  totalScore: number;
  staticScore: number;
  dynamicScore: number;
  dimensions: EvaluationDimension[];
  suggestions: string[];
  lastEvaluatedAt: number;
}
