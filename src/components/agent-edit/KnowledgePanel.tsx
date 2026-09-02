import React from "react";
import { BarChart3, Library, Search, Calendar, Plus, Trash2, Download, Activity, Send, Mail, CheckSquare, Share, Star, CircleUser, Settings, ChevronDown, ChevronUp, Bot, ChevronsLeft, GripVertical, X, RefreshCcw, Save, FileText, Pencil, HelpCircle } from "lucide-react";
import { PrecalcDrawer } from "./PrecalcDrawer";
import { PrecalcQuotaCard } from "./PrecalcQuotaCard";
import {
  FileItem,
  DataField,
  Skill,
  EnvConfig,
  AgentConfig,
  AssociatedItem,
} from "../../../types";
import {
  WordIcon,
  ExcelIcon,
  PdfIcon,
  TxtIcon,
  TrashIcon,
  PlusIcon,
  DatabaseIcon,
  TableIcon,
  CodeIcon,
  LayersIcon,
  SettingsIcon,
  CpuIcon,
  LayoutIcon,
  EditIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  EyeIcon,
} from "./Icons";
import { MOCK_ASSOCIATED_ITEMS } from "./constants";

const PathFlow: React.FC<{
  entry: string;
  action: string;
  target: string;
  colorClass: string;
}> = ({ entry, action, target, colorClass }) => (
  <div className="flex items-center gap-2 py-2">
    <div className="flex flex-col items-center min-w-[80px]">
      <div className="px-2 py-1 bg-white border border-gray-200 rounded text-[10px] font-medium text-slate-600 shadow-sm">
        {entry}
      </div>
    </div>
    <div className="flex-1 flex items-center gap-1">
      <div
        className={`h-[1px] flex-1 bg-gradient-to-r from-gray-200 via-${colorClass.split("-")[1]}-400 to-gray-200 relative`}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-[9px] text-gray-400 whitespace-nowrap border border-gray-100 rounded-full">
          {action}
        </div>
      </div>
      <svg
        className={`w-3 h-3 text-${colorClass.split("-")[1]}-500`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={3}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </div>
    <div className="flex flex-col items-center min-w-[80px]">
      <div
        className={`px-2 py-1 bg-${colorClass.split("-")[1]}-600 text-white rounded text-[10px] font-bold shadow-sm`}
      >
        {target}
      </div>
    </div>
  </div>
);

const PathPreviewPlaceholder: React.FC<{
  title: string;
  label?: string;
  className?: string;
  contentClassName?: string;
}> = ({ title, label, className = "mt-2", contentClassName = "mt-2" }) => {
  const [show, setShow] = React.useState(false);
  return (
    <div className={className}>
      <button
        onClick={() => setShow(!show)}
        className="flex items-center gap-1.5 text-[10px] text-blue-600 hover:text-blue-700 font-medium transition-colors"
      >
        <EyeIcon className="w-3 h-3" />
        {show
          ? label
            ? `收起${label}`
            : "收起路径示例"
          : label || "查看路径示例"}
      </button>

      {show && (
        <div className={contentClassName}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">
              路径预览：{title}
            </span>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            </div>
          </div>
          <div className="aspect-video bg-gray-50 rounded border border-gray-200 flex flex-col items-center justify-center relative group">
            <div className="w-full h-4 bg-white border-b border-gray-100 flex items-center px-2 gap-2">
              <div className="w-12 h-1.5 bg-gray-100 rounded" />
              <div className="w-8 h-1.5 bg-gray-100 rounded" />
            </div>
            <div className="flex-1 w-full flex">
              <div className="w-12 border-r border-gray-100 bg-white/50 p-1 space-y-1">
                <div className="w-full h-1 bg-gray-100 rounded" />
                <div className="w-full h-1 bg-blue-300 rounded" />
                <div className="w-full h-1 bg-gray-100 rounded" />
              </div>
              <div className="flex-1 p-2 relative bg-white">
                <div className="w-2/3 h-2 bg-gray-50 rounded mb-2" />
                <div className="w-full h-12 border border-blue-100 rounded bg-blue-50/30 flex items-center justify-center text-[8px] text-blue-300">
                  系统界面示意
                </div>
                <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                  <div className="w-3 h-3 text-white">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MonthDayPicker: React.FC<{
  value: string;
  onChange: (val: string) => void;
}> = ({ value, onChange }) => {
  const [m, d] = (value || "01-01").split("-");
  const months = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, "0"),
  );
  const days = Array.from({ length: 31 }, (_, i) =>
    (i + 1).toString().padStart(2, "0"),
  );

  return (
    <div className="flex items-center gap-1">
      <select
        value={m}
        onChange={(e) => onChange(`${e.target.value}-${d}`)}
        className="p-1 text-[10px] border border-gray-200 rounded bg-white outline-none focus:border-blue-500"
      >
        {months.map((mon) => (
          <option key={mon} value={mon}>
            {mon}月
          </option>
        ))}
      </select>
      <select
        value={d}
        onChange={(e) => onChange(`${m}-${e.target.value}`)}
        className="p-1 text-[10px] border border-gray-200 rounded bg-white outline-none focus:border-blue-500"
      >
        {days.map((day) => (
          <option key={day} value={day}>
            {day}日
          </option>
        ))}
      </select>
    </div>
  );
};

interface KnowledgePanelProps {
  files: FileItem[];
  dataFields: DataField[];
  skills: Skill[];
  envConfig: EnvConfig;
  config: AgentConfig;
  onFilesChange: (files: FileItem[]) => void;
  onDataFieldsChange: (fields: DataField[]) => void;
  onSkillsChange: (skills: Skill[]) => void;
  onEnvConfigChange: (config: EnvConfig) => void;
  onUpdateConfig: (config: AgentConfig) => void;
  onOpenDataSelector: () => void;
  onTriggerTuning?: () => void;
  activeTab?: TabType;
  envSubTab?: EnvSubTab;
  onActiveTabChange?: (tab: TabType) => void;
  onEnvSubTabChange?: (tab: EnvSubTab) => void;
}

type TabType = "knowledge" | "data" | "skills" | "env";
type EnvSubTab = "example" | "guess" | "transaction" | "precalc";

const KnowledgePanel: React.FC<KnowledgePanelProps> = ({
  files,
  dataFields,
  skills,
  envConfig,
  config,
  onFilesChange,
  onDataFieldsChange,
  onSkillsChange,
  onEnvConfigChange,
  onUpdateConfig,
  onOpenDataSelector,
  onTriggerTuning,
  activeTab: externalActiveTab,
  envSubTab: externalEnvSubTab,
  onActiveTabChange,
  onEnvSubTabChange,
}) => {
  const [isUploading, setIsUploading] = React.useState(false);
  const [internalActiveTab, setInternalActiveTab] =
    React.useState<TabType>("knowledge");
  const [internalEnvSubTab, setInternalEnvSubTab] =
    React.useState<EnvSubTab>("transaction");
  const [activePluginModal, setActivePluginModal] = React.useState<
    string | null
  >(null);
  const [filterSourceCategories, setFilterSourceCategories] = React.useState<Record<number, string>>({});
  const [customerGroupConfigOpen, setCustomerGroupConfigOpen] = React.useState<{ ruleIdx: number; editGroupIdx?: number } | null>(null);
  const [precalcDrawerOpen, setPrecalcDrawerOpen] = React.useState(false);
  const [isPrecalcConfigured, setIsPrecalcConfigured] = React.useState(false);
  const [tasks, setTasks] = React.useState([
    {
      id: '1',
      isSelf: false,
      owner: '张伟',
      agentName: '房产估值智能体',
      question: '这位客户适合配置哪类年金险？',
      scopeName: '二季度特色年金险数据库',
      scopeType: '数据库',
      scopeId: '#120320582',
      scopeDesc: '有效期至 6/30',
      count: '2,000 户',
      statusType: '已计算',
      progress: '2,000 / 2,000',
      finishTime: '6/01 完成',
      viewRate: '78%',
      adoptRate: '61%',
      runEnabled: true,
      selectEnabled: true,
      cacheEnabled: true,
    },
    {
      id: '2',
      isSelf: false,
      owner: '刘强',
      agentName: '理财营销智能体',
      question: '客户当前的保障缺口在哪、缺多少？',
      scopeName: '开门红特色年金专案',
      scopeType: '专案',
      scopeId: '#120318841',
      count: '3,000 户',
      statusType: '计算中',
      progress: '1,200 / 3,000',
      finishTime: '预计 6/18',
      viewRate: '—',
      adoptRate: '—',
      runEnabled: true,
      selectEnabled: false,
      cacheEnabled: true,
    },
    {
      id: '3',
      isSelf: false,
      owner: '陈燕',
      agentName: '存款流失预警智能体',
      question: '客户行外保单快到期，如何承接？',
      scopeName: '高客养老规划数据库',
      scopeType: '数据库',
      scopeId: '#120319507',
      scopeDesc: '有效期至 7/31',
      count: '1,500 户',
      statusType: '转实时',
      progress: '0 / 1,500',
      finishTime: '—',
      viewRate: '65%',
      adoptRate: '52%',
      runEnabled: true,
      selectEnabled: false,
      cacheEnabled: false,
    },
    {
      id: '4',
      isSelf: false,
      agentName: '资产诊断智能体',
      owner: '李明',
      question: '客户的资产配置缺口在哪？',
      scopeName: '稳健资产配置专案',
      scopeType: '专案',
      scopeId: '#120317220',
      count: '1,800 户',
      statusType: '已计算',
      progress: '1,800 / 1,800',
      finishTime: '5/28 完成',
      viewRate: '72%',
      adoptRate: '58%',
      runEnabled: false,
      selectEnabled: false,
      cacheEnabled: true,
    },
    {
      id: '5',
      isSelf: false,
      agentName: '财富体检智能体',
      owner: '王芳',
      question: '客户近一年的收益表现如何？',
      scopeName: '高净值客户数据库',
      scopeType: '数据库',
      scopeId: '#120319880',
      scopeDesc: '有效期至 7/15',
      count: '900 户',
      statusType: '计算中',
      progress: '540 / 900',
      finishTime: '预计 6/19',
      viewRate: '—',
      adoptRate: '—',
      runEnabled: false,
      selectEnabled: false,
      cacheEnabled: true,
    }
  ]);

  React.useEffect(() => {
    const hasSelfTasks = tasks.some(t => t.isSelf);
    setIsPrecalcConfigured(hasSelfTasks);
  }, [tasks]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [searchQuery, setSearchQuery] = React.useState("");
  const [isSearching, setIsSearching] = React.useState(false);
  const [searchTab, setSearchTab] = React.useState<
    "专案数据库" | "重要商机MOT" | "客户标签" | "保险拓客平台" | "业绩中心"
  >("专案数据库");

  const filteredSearchItems = MOCK_ASSOCIATED_ITEMS.filter((item) => {
    // Tab filtering
    if (
      searchTab === "专案数据库" &&
      !(item.type === "project" || item.type === "database")
    )
      return false;
    if (searchTab === "重要商机MOT" && item.type !== "opportunity")
      return false;
    if (searchTab === "客户标签" && item.type !== "tag") return false;
    if (
      searchTab === "保险拓客平台" &&
      !(item.type === "activity" && (item as any).category === "insurance")
    )
      return false;
    if (searchTab === "业绩中心" && item.type !== "achievement") return false;

    // Query filtering
    if (searchQuery.trim() === "") return true;
    return (
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const [expandedDrawers, setExpandedDrawers] = React.useState<
    Record<TabType, boolean>
  >({
    knowledge: false,
    data: false,
    skills: false,
    env: false,
  });

  const toggleDrawer = (tab: TabType) => {
    setExpandedDrawers((prev) => ({ ...prev, [tab]: !prev[tab] }));
  };

  const handleAddItem = (item: AssociatedItem) => {
    const currentItems = config.associatedItems || [];
    if (currentItems.find((i) => i.id === item.id)) return;
    onUpdateConfig({ ...config, associatedItems: [...currentItems, item] });
    setSearchQuery("");
    setIsSearching(false);
  };

  const handleRemoveItem = (id: string) => {
    const currentItems = config.associatedItems || [];
    onUpdateConfig({
      ...config,
      associatedItems: currentItems.filter((i) => i.id !== id),
    });
  };

  const activeTab = externalActiveTab || internalActiveTab;
  const envSubTab = externalEnvSubTab || internalEnvSubTab;

  const setActiveTab = (tab: TabType) => {
    if (onActiveTabChange) onActiveTabChange(tab);
    else setInternalActiveTab(tab);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    const newFileItems: FileItem[] = Array.from(selectedFiles).map(
      (file, idx) => {
        const type = file.name.endsWith(".pdf")
          ? "pdf"
          : file.name.endsWith(".xlsx") || file.name.endsWith(".xls")
            ? "excel"
            : file.name.endsWith(".doc") || file.name.endsWith(".docx")
              ? "word"
              : "txt";

        return {
          id: `uploaded-${Date.now()}-${idx}`,
          name: file.name,
          type: type as any,
          size: "1.2 MB",
          status: "completed",
        };
      },
    );

    setIsUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      setIsUploading(false);
      onFilesChange([...files, ...newFileItems]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }, 1500);
  };

  const setEnvSubTab = (tab: EnvSubTab) => {
    if (onEnvSubTabChange) onEnvSubTabChange(tab);
    else setInternalEnvSubTab(tab);
  };

  const [expandedGroups, setExpandedGroups] = React.useState<
    Record<string, boolean>
  >({});
  const [transactionAnswers, setTransactionAnswers] = React.useState<
    Record<string, string>
  >({});
  const [transactionActiveTabs, setTransactionActiveTabs] = React.useState<
    Record<string, string>
  >({});

  const toggleGroup = (id: string) => {
    setExpandedGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const updateTagValue = (itemId: string, updates: Partial<AssociatedItem>) => {
    const currentItems = config.associatedItems || [];
    const updatedItems = currentItems.map((item) => {
      if (item.id === itemId) {
        return { ...item, ...updates };
      }
      return item;
    });
    onUpdateConfig({ ...config, associatedItems: updatedItems });
  };

  const removeFile = (id: string) => {
    onFilesChange(files.filter((f) => f.id !== id));
  };

  const removeDataField = (id: string) => {
    onDataFieldsChange(dataFields.filter((f) => f.id !== id));
  };

  const toggleSkill = (id: string) => {
    onSkillsChange(
      skills.map((s) => (s.id === id ? { ...s, selected: !s.selected } : s)),
    );
  };

  const renderKnowledgeTab = () => (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">
          已上传知识 ({files.length})
        </h3>
        <input
          type="file"
          multiple
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileUpload}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className={`flex items-center gap-1 text-xs font-medium ${isUploading ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:text-blue-700"}`}
        >
          {isUploading ? (
            <>
              <svg
                className="animate-spin w-3 h-3 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              正在上传...
            </>
          ) : (
            <>
              <PlusIcon className="w-3 h-3" />
              上传文档
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {files.map((file) => (
          <div
            key={file.id}
            className="group flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                {file.type === "word" && <WordIcon />}
                {file.type === "excel" && <ExcelIcon />}
                {file.type === "pdf" && <PdfIcon />}
                {file.type === "txt" && <TxtIcon />}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 truncate max-w-[200px]">
                  {file.name}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded-md font-medium">
                    已解析
                  </span>
                  <span className="text-[10px] text-gray-400">
                    有效期至: 2026-12-31
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                className="p-1.5 hover:bg-white rounded-md transition-colors text-gray-400 hover:text-blue-500"
                title="编辑"
              >
                <EditIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => removeFile(file.id)}
                className="p-1.5 hover:bg-white rounded-md transition-colors text-gray-400 hover:text-red-500"
                title="删除"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {files.length > 0 && (
        <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl relative overflow-hidden group">
          <div className="flex items-start gap-3 relative z-10">
            <div className="w-8 h-8 rounded-full bg-slate-200/50 text-slate-600 flex items-center justify-center shrink-0">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-[13px] font-bold text-slate-800 flex items-center gap-2">
                  长文档智能提炼
                  <span className="text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold uppercase">
                    已精简
                  </span>
                </h4>
                <button
                  onClick={onTriggerTuning}
                  className="text-[10px] flex items-center gap-1 text-slate-500 hover:text-blue-600 bg-white px-2 py-1 rounded border border-slate-200 hover:border-blue-200 transition-colors"
                  title="配置大模型提炼与框架调优规则"
                >
                  <SettingsIcon className="w-3 h-3" />
                  提炼规则与引擎设置
                </button>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed max-w-[90%] mb-3">
                上传的文档内容较长。为了让智能体回答更精准、不跑题，AI
                已根据您的
                <strong className="text-slate-800">「设定与要求」</strong>
                自动去除了无关废话，提炼出了对当前业务最有用的核心干货。
              </p>
              <button
                onClick={onTriggerTuning}
                className="text-[11px] font-medium bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 px-3 py-1.5 rounded-lg shadow-sm transition-all"
              >
                查看提炼出的核心知识
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderDataTab = () => {
    const categories = ["客户数据", "产品数据", "市场数据", "RM 数据"];

    return (
      <div className="space-y-4 animate-in fade-in duration-300">
        {categories.map((cat) => {
          const filteredFields = dataFields.filter(
            (f) =>
              f.category === cat ||
              (cat === "RM 数据" && f.category === "RM数据") ||
              (cat === "客户数据" && f.category === "客户信息数据") ||
              (cat === "产品数据" && f.category === "财富产品数据"),
          );

          if (filteredFields.length === 0) return null;

          return (
            <div key={cat} className="space-y-1.5 mb-3 last:mb-0">
              <div className="px-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                  {cat}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {filteredFields.map((field) => (
                  <div
                    key={field.id}
                    className="flex items-center gap-1.5 pl-2 pr-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded-md hover:bg-indigo-50 hover:border-indigo-100 hover:shadow-sm transition-all text-slate-700"
                  >
                    <span className="text-[11px] font-medium">
                      {field.name}
                    </span>
                    <button
                      onClick={() => removeDataField(field.id)}
                      className="p-0.5 text-slate-300 hover:text-red-500 transition-colors"
                      title="移除"
                    >
                      <svg
                        className="w-2.5 h-2.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <button
          onClick={onOpenDataSelector}
          className="w-full py-2 border border-dashed border-gray-200 rounded-lg text-[10px] text-blue-500 font-bold hover:bg-blue-50 hover:border-blue-200 transition-colors mt-1"
        >
          + 绑定更多数据字段
        </button>
      </div>
    );
  };

  const updateSkillConfig = (
    id: string,
    updates: Partial<NonNullable<Skill["config"]>>,
  ) => {
    onSkillsChange(
      skills.map((s) =>
        s.id === id
          ? {
              ...s,
              config: { ...(s.config || {}), ...updates },
            }
          : s,
      ),
    );
  };

  const renderSkillsTab = () => (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="w-1 h-3 bg-indigo-500 rounded-full"></div>
          <h3 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
            扩展插件与技能
          </h3>
        </div>
        <span className="text-[10px] text-slate-400">
          开启插件以增强回复能力
        </span>
      </div>

      <div className="space-y-3 pb-6">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className={`p-4 rounded-xl border transition-all ${
              skill.selected
                ? "border-indigo-200 bg-indigo-50/20"
                : "border-slate-200 bg-white opacity-80"
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3 min-w-0">
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-slate-800 truncate">
                    {skill.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                    {skill.description}
                  </p>
                </div>
              </div>
              <button
                onClick={() => toggleSkill(skill.id)}
                className={`w-8 h-4 rounded-full p-0.5 transition-colors shrink-0 ${skill.selected ? "bg-indigo-600" : "bg-slate-200"}`}
              >
                <div
                  className={`w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform ${skill.selected ? "translate-x-4" : "translate-x-0"}`}
                />
              </button>
            </div>

            {skill.selected && (
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
                {/* Specific UI for Custom Card / Branch Activities / Products */}
                {skill.id === "plugin_customer_filter" ? (
                  <div className="space-y-4">
                    <button
                      onClick={() => setActivePluginModal(skill.id)}
                      className="w-full py-2 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-[11px] font-bold text-slate-700 hover:border-indigo-300 hover:text-indigo-600 shadow-sm transition-all"
                    >
                      配置客群盘户规则
                    </button>
                    {skill.config?.filterRules &&
                      skill.config.filterRules.length > 0 && (
                        <div className="space-y-2">
                          {skill.config.filterRules.map((rule, idx) => (
                            <div
                              key={idx}
                              className="p-2 border border-slate-200 rounded text-[10px] bg-slate-50"
                            >
                              <div className="font-bold text-slate-700 mb-1">
                                触发问题: {rule.intent}
                              </div>
                              <div className="flex flex-col gap-1 mt-1">
                                {rule.tags && rule.tags.length > 0 && (
                                  <div className="text-[9px] text-slate-500">
                                    <span className="font-semibold">标签:</span>{" "}
                                    {rule.tags
                                      .map((t) => `${t.name} (${t.condition})`)
                                      .join(", ")}
                                  </div>
                                )}
                                {rule.projects && rule.projects.length > 0 && (
                                  <div className="text-[9px] text-slate-500">
                                    <span className="font-semibold">专案:</span>{" "}
                                    {rule.projects.join(", ")}
                                  </div>
                                )}
                                {rule.databases &&
                                  rule.databases.length > 0 && (
                                    <div className="text-[9px] text-slate-500">
                                      <span className="font-semibold">
                                        数据库:
                                      </span>{" "}
                                      {rule.databases.join(", ")}
                                    </div>
                                  )}
                                {rule.opportunities &&
                                  rule.opportunities.length > 0 && (
                                    <div className="text-[9px] text-slate-500">
                                      <span className="font-semibold">
                                        商机:
                                      </span>{" "}
                                      {rule.opportunities.join(", ")}
                                    </div>
                                  )}
                                {rule.sources && rule.sources.length > 0 && (
                                  <div className="text-[9px] text-slate-500">
                                    <span className="font-semibold">其它:</span>{" "}
                                    {rule.sources.join(", ")}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                ) : skill.id === "plugin_card" ||
                  skill.id === "plugin_activity" ||
                  skill.id === "plugin_product" ? (
                  <div className="space-y-2">
                    <button
                      onClick={() => setActivePluginModal(skill.id)}
                      className="w-full py-2 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-[11px] font-bold text-slate-700 hover:border-indigo-300 hover:text-indigo-600 shadow-sm transition-all"
                    >
                      {skill.id === "plugin_card"
                        ? "编辑卡片内容"
                        : skill.id === "plugin_activity"
                          ? "关联分行活动"
                          : "关联分行产品"}
                    </button>
                    {skill.config?.associatedIds &&
                      skill.config.associatedIds.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 px-1">
                          {skill.config.associatedIds.map((id) => (
                            <span
                              key={id}
                              className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[9px] rounded-full border border-slate-200"
                            >
                              {id}
                            </span>
                          ))}
                        </div>
                      )}
                    {skill.id === "plugin_card" && skill.config?.cardType && (
                      <div className="px-1">
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[9px] rounded-full border border-indigo-100">
                          已配置:{" "}
                          {skill.config.cardType === "image"
                            ? "图片展示卡片"
                            : "代发数据卡片"}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Tags only for basic plugins */
                  <div className="flex flex-wrap gap-1">
                    <span className="text-[9px] text-slate-400 mr-1 mt-0.5">
                      生效关键词:
                    </span>
                    {skill.triggerKeywords.map((kw) => (
                      <span
                        key={kw}
                        className="px-1.5 py-0.5 bg-white border border-slate-100 text-slate-500 text-[10px] rounded-md"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center">
          <p className="text-[10px] text-slate-400 font-medium">
            更多插件持续迭代中...
          </p>
        </div>
      </div>
    </div>
  );

  const renderTransactions = () => {
    const associatedItems = config.associatedItems || [];
    if (associatedItems.length === 0) {
      return (
        <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 p-6">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-slate-100">
            <PlusIcon className="w-6 h-6 text-slate-300" />
          </div>
          <p className="text-[12px] font-bold text-slate-600 mb-1">
            🔍 暂未关联客户场景
          </p>
          <p className="text-[10px] text-slate-400 leading-relaxed max-w-[200px] mx-auto">
            请使用上方的面板搜索并关联客户。系统将自动生成智能化规则！
          </p>
        </div>
      );
    }

    const renderItem = (item: AssociatedItem) => {
      const isExpanded = expandedGroups[item.id];
      const typeLabel =
        item.type === "project"
          ? "专案"
          : item.type === "opportunity"
            ? "商机"
            : item.type === "tag"
              ? "标签"
              : item.type === "activity"
                ? "经营场景"
                : item.type === "achievement"
                  ? "业绩中心"
                  : "数据库";

      const activeTab = transactionActiveTabs[item.id] || "w_plus_list";

      const categories = [
        { id: "w_plus_list", label: "W+客户列表" },
        { id: "w_plus_biz", label: "W+商商中心" },
        { id: "rm_list", label: "RM列表页" },
        { id: "rm_mid", label: "RM中间页" },
        { id: "insight", label: "客户洞察页" },
      ];

      const allRules = [
        { id: "r1", loc: "W+专案客户列表", act: "点击姓名/进入洞察页", cat: "w_plus_list" },
        { id: "r2", loc: "W+专案客户列表", act: "点击处理/进入电访面板", cat: "w_plus_list" },
        { id: "r3", loc: "W+商机中心", act: "点击姓名/进入洞察页", cat: "w_plus_biz" },
        { id: "r4", loc: "W+商机中心", act: "点击处理/进入电访面板", cat: "w_plus_biz" },
        { id: "r5", loc: "RM小助列表页", act: "点击姓名/进入洞察页", cat: "rm_list" },
        { id: "r6", loc: "RM小助列表页", act: "点击电访/进入电访面板", cat: "rm_list" },
        { id: "r7", loc: "RM小助管户中间页", act: "点击姓名/进入洞察页", cat: "rm_mid" },
        { id: "r8", loc: "RM小助管户中间页", act: "点击电访/进入电访面板", cat: "rm_mid" },
        { id: "r9", loc: "客户洞察页", act: "命中客群/自动唤起", cat: "insight" },
      ];

      const filteredRules = allRules.filter((r) => r.cat === activeTab);

      return (
        <div
          key={item.id}
          className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm transition-all mb-4 group hover:border-indigo-200"
        >
          <div
            onClick={() => toggleGroup(item.id)}
            className={`px-4 py-3 flex justify-between items-center cursor-pointer transition-colors ${isExpanded ? "bg-slate-50/80 border-b border-slate-100" : "hover:bg-slate-50"}`}
          >
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-bold text-slate-800 truncate">
                  {item.name}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  #{item.id.split("-").pop()}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[9px] text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                  9 个自动规则
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveItem(item.id);
                }}
                className="p-1.5 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded-lg transition-all"
              >
                <TrashIcon className="w-3.5 h-3.5" />
              </button>
              <div
                className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
              >
                <ChevronDownIcon className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>

          {isExpanded && (
            <div className="p-0 bg-white animate-in fade-in slide-in-from-top-1 duration-200">
              <div className="flex border-b border-slate-100 bg-slate-50/30 overflow-x-auto no-scrollbar">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() =>
                      setTransactionActiveTabs((prev) => ({
                        ...prev,
                        [item.id]: cat.id,
                      }))
                    }
                    className={`flex-1 min-w-[80px] py-2.5 text-[10px] font-bold transition-all border-b-2 flex items-center justify-center ${
                      activeTab === cat.id
                        ? "border-indigo-600 text-indigo-600 bg-white"
                        : "border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50/50"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="p-3 space-y-2">
                {filteredRules.map((scen, sIdx) => {
                  const ruleKey = `${item.id}-${scen.id}`;
                  return (
                    <div
                      key={scen.id}
                      className="p-2.5 bg-slate-50/50 border border-slate-100 rounded-xl hover:bg-white hover:border-emerald-200 transition-all group"
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-[10px] text-slate-600">
                            <span className="font-bold text-slate-700">
                              {scen.loc}
                            </span>
                            <span className="text-slate-300">·</span>
                            <span>{scen.act}</span>
                          </div>
                          <div className="w-1 h-1 rounded-full bg-emerald-400" />
                        </div>
                        <div className="relative group/input">
                          <div className="absolute left-2 top-1.2 text-[8px] font-bold text-emerald-500/60 uppercase pointer-events-none">
                            自动回答
                          </div>
                          <input
                            type="text"
                            value={
                              transactionAnswers[ruleKey] ||
                              "请结合客户情况，提供分析"
                            }
                            onChange={(e) =>
                              setTransactionAnswers((prev) => ({
                                ...prev,
                                [ruleKey]: e.target.value,
                              }))
                            }
                            className="w-full text-[11px] pt-4 pb-1.5 px-2 border-b border-transparent group-hover/input:border-emerald-100 bg-transparent outline-none focus:border-emerald-400 transition-all text-slate-600"
                          />
                          <div className="absolute right-2 bottom-1.5 opacity-0 group-hover/input:opacity-100 transition-opacity">
                            <svg
                              className="w-3 h-3 text-emerald-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      );
    };

    return (
      <div className="space-y-4">
        {associatedItems.map((item) => renderItem(item))}
      </div>
    );
  };

  const renderSearchAndAssociate = () => {
    const searchTabs = [
      "专案数据库",
      "重要商机MOT",
      "客户标签",
      "保险拓客平台",
      "业绩中心",
    ] as const;

    return (
      <div className="bg-white border border-gray-200 rounded-xl mb-6 shadow-sm overflow-visible relative">
        <div className="p-4 bg-gray-50/50 border-b border-gray-100">
          <label className="block text-xs font-bold text-slate-700 mb-2.5 tracking-tight">
            关联适合使用本智能体的客户
          </label>
          <div className="relative group">
            <input
              type="text"
              placeholder="输入专案/商机/数据库/标签搜索"
              value={searchQuery}
              onFocus={() => setIsSearching(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearching(true);
              }}
              className="w-full pl-4 pr-10 py-2 text-[12px] border border-gray-200 rounded-full focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50/30 outline-none transition-all placeholder:text-gray-300 bg-white"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 group-focus-within:text-indigo-500 text-gray-300 transition-colors pointer-events-none">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {isSearching && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex border-b border-slate-100 px-2 pt-1 gap-1 overflow-x-auto scrollbar-none bg-slate-50/50">
              {searchTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSearchTab(tab)}
                  className={`px-3 py-2 text-[11px] font-medium whitespace-nowrap border-b-2 transition-all ${
                    searchTab === tab
                      ? "border-indigo-600 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="max-h-[280px] overflow-y-auto p-1.5 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
              {filteredSearchItems.length > 0 ? (
                <div className="space-y-0.5">
                  {filteredSearchItems.map((item) => {
                    const isAdded = config.associatedItems?.some(
                      (i) => i.id === item.id,
                    );

                    let typeBadge = "";
                    if (item.type === "project") typeBadge = "专案";
                    else if (item.type === "database") typeBadge = "数据库";
                    else if (item.type === "opportunity") typeBadge = "商机";
                    else if (item.type === "tag") {
                      if (item.name.includes("洞察")) typeBadge = "W+洞察";
                      else typeBadge = "标签";
                    } else if (item.type === "activity") typeBadge = "经营场景";
                    else if (item.type === "achievement")
                      typeBadge = "业绩中心";

                    return (
                      <div
                        key={item.id}
                        className={`flex items-center justify-between px-3 py-1.5 rounded-lg border border-transparent transition-all group ${
                          isAdded
                            ? "bg-slate-50/50 opacity-60 cursor-default"
                            : "hover:bg-slate-50 active:bg-slate-100 cursor-pointer hover:border-slate-100"
                        }`}
                        onClick={() => !isAdded && handleAddItem(item)}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`px-1.5 py-0.5 rounded text-[8px] font-bold shrink-0 min-w-[50px] text-center border ${
                              isAdded
                                ? "bg-gray-100 text-gray-400 border-gray-200"
                                : "bg-indigo-50 text-indigo-500 border-indigo-100"
                            }`}
                          >
                            {typeBadge}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span
                              className={`text-[11px] font-medium truncate ${isAdded ? "text-gray-400" : "text-slate-800"}`}
                            >
                              {item.name}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-[10px] text-slate-300 font-mono tracking-tight italic">
                            #{item.id.slice(-4)}
                          </span>
                          {isAdded ? (
                            <svg
                              className="w-4 h-4 text-green-500"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <div className="w-6 h-6 rounded-full border border-slate-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-indigo-600 hover:border-indigo-600 hover:text-white text-slate-400 scale-90">
                              <PlusIcon className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center bg-slate-50/30 rounded-lg">
                  <p className="text-[10px] text-slate-400">未找到相关匹配项</p>
                </div>
              )}
            </div>

            <div className="p-2 border-t border-slate-100 bg-slate-50/80 flex justify-between items-center text-[9px] text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
                搜索并选择要关联的项目
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSearching(false);
                }}
                className="text-indigo-600 font-bold hover:underline"
              >
                收起面板
              </button>
            </div>
          </div>
        )}

        {isSearching && (
          <div
            className="fixed inset-0 z-40 bg-transparent"
            onClick={() => setIsSearching(false)}
          />
        )}
      </div>
    );
  };

  const renderEnvTab = () => {
    const exampleQuestions = [
      "请分析一下该客户的财富画像",
      "帮我解析一下该客户的投资偏好",
      "针对这类客户，有什么沟通话术 and 建议？",
      "针对当前市场，有什么推荐的理财产品？",
      "帮我推荐几款适合该客户风险等级的产品",
      "如何制定下周的客户经营计划？",
    ];

    const guessQuestions = [
      "如何配置专案自动唤起？",
      "什么是环境感知功能？",
      "标签不命中时该如何排查？",
      "如何提高智能体的回复质量？",
      "这种类型的客户通常对什么产品感兴趣？",
      "如何利用知识库提升营销成功率？",
    ];

    return (
      <div className="space-y-5 animate-in fade-in duration-300">
        <div className="flex p-1 bg-slate-100/50 rounded-lg shrink-0">
          {[
            { id: "transaction", label: "自动触发" },
            { id: "example", label: "示例问" },
            { id: "guess", label: "猜你想问" },
            { id: "precalc", label: "预计算" },
          ].map((subTab) => (
            <button
              key={subTab.id}
              onClick={() => setEnvSubTab(subTab.id as EnvSubTab)}
              className={`flex-1 py-1.5 text-[11px] font-bold rounded-md transition-all ${envSubTab === subTab.id ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
            >
              {subTab.label}
            </button>
          ))}
        </div>

        {envSubTab === "transaction" ? (
          <div className="space-y-4">
            {renderSearchAndAssociate()}
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1 h-3 bg-indigo-500 rounded-full"></div>
              <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                联动唤起规则
              </h4>
            </div>
            {renderTransactions()}
          </div>
        ) : envSubTab === "example" ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {exampleQuestions.map((q, i) => (
                <div
                  key={i}
                  className="group relative px-3 py-2 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-700 hover:border-indigo-300 hover:shadow-sm transition-all cursor-default"
                >
                  {q}
                  <button className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-white border border-red-100 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-sm text-red-400 hover:bg-red-50 transition-all">
                    <svg
                      className="w-2.5 h-2.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
              <button className="px-3 py-2 border border-dashed border-slate-200 rounded-lg text-[11px] text-slate-400 hover:border-indigo-400 hover:text-indigo-600 transition-all flex items-center gap-1.5 bg-slate-50/30">
                <PlusIcon className="w-3.5 h-3.5" /> 添加示例问
              </button>
            </div>
          </div>
        ) : envSubTab === "guess" ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {guessQuestions.map((q, i) => (
                <div
                  key={i}
                  className="group relative px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-[11px] text-slate-600 hover:border-indigo-300 hover:bg-white hover:shadow-sm transition-all cursor-default"
                >
                  {q}
                  <button className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-white border border-red-100 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-sm text-red-400 hover:bg-red-50 transition-all">
                    <svg
                      className="w-2.5 h-2.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
              <button className="px-3 py-2 border border-dashed border-slate-200 rounded-lg text-[11px] text-slate-400 hover:border-indigo-400 hover:text-indigo-600 transition-all flex items-center gap-1.5 bg-slate-50/30">
                <PlusIcon className="w-3.5 h-3.5" /> 添加问题
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 pt-1">
             {isPrecalcConfigured ? (
               <>
                 <PrecalcQuotaCard showBranch={false} />
                 <div className="bg-white border border-indigo-100 rounded-xl p-4 flex flex-col gap-3 shadow-sm">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                         </svg>
                       </div>
                       <div>
                         <h4 className="text-[13px] font-bold text-slate-800">预计算任务已开启</h4>
                         <p className="text-[11px] text-slate-500">本智能体已配置预计算规则</p>
                       </div>
                     </div>
                     <button 
                       onClick={() => setPrecalcDrawerOpen(true)}
                       className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[12px] font-bold rounded-lg transition-all shadow-md shadow-indigo-100 active:scale-95 flex items-center gap-1.5"
                     >
                       <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                       </svg>
                       配置
                     </button>
                   </div>
                   
                   <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                     <div className="flex items-center gap-1.5">
                       <span className="text-[11px] font-medium text-slate-600">优先展示预计算缓存结果</span>
                       <div className="group relative">
                         <HelpCircle className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                         <div className="absolute bottom-full left-0 mb-2 w-[240px] p-2 bg-slate-800 text-white text-[10px] rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 pointer-events-none leading-relaxed">
                           开启后，若命中 30 天内的历史预计算数据将直接展示（响应速度快）。若您修改了智能体提示词，建议关闭此项以强制模型实时生成最新内容。
                         </div>
                       </div>
                     </div>
                     <div 
                       onClick={() => onUpdateConfig({ ...config, globalCacheEnabled: config.globalCacheEnabled === false ? true : false })}
                       className={`w-[34px] h-[18px] rounded-[9px] relative cursor-pointer transition-colors ${config.globalCacheEnabled !== false ? 'bg-indigo-600' : 'bg-slate-300'}`}
                     >
                       <div className={`absolute w-[14px] h-[14px] rounded-full bg-white top-[2px] shadow-sm transition-all duration-200 ${config.globalCacheEnabled !== false ? 'left-[18px]' : 'left-[2px]'}`}></div>
                     </div>
                   </div>
                 </div>
               </>
             ) : (
               <div className="bg-gradient-to-br from-indigo-50/50 to-white border border-indigo-100 rounded-xl p-8 flex flex-col items-center text-center shadow-sm">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 mb-4 shadow-inner">
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h4 className="text-[14px] font-bold text-slate-800 mb-2">分行预计算任务管理</h4>
                  <p className="text-[12px] text-slate-500 mb-6 px-6 leading-relaxed">设置该智能体的预计算运行策略，查看任务执行清单。</p>
                  <button 
                    onClick={() => setPrecalcDrawerOpen(true)}
                    className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-bold rounded-lg transition-all shadow-lg shadow-indigo-100 active:scale-95"
                  >
                    配置任务清单
                  </button>
               </div>
             )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 overflow-hidden">
      {/* Tab Header (Minimized) */}
      <div className="sticky top-0 z-10 bg-white px-5 py-3.5 border-b border-gray-100">
        <h3 className="font-bold text-slate-800 text-[13px] tracking-tight">
          智能体配置
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto">
        {[
          {
            id: "knowledge",
            label: "上传知识",
            badge: `(${files.length})`,
            render: renderKnowledgeTab,
          },
          {
            id: "data",
            label: "引用数据",
            badge: `(${dataFields.length})`,
            render: renderDataTab,
          },
          {
            id: "skills",
            label: "嵌入插件",
            badge: `(${skills.filter((s) => s.selected).length})`,
            render: renderSkillsTab,
          },
          {
            id: "env",
            label: "触发机制",
            badge: `(${config.associatedItems?.length || 0})`,
            render: renderEnvTab,
          },
        ].map((drawer) => {
          const isExpanded = expandedDrawers[drawer.id as TabType];

          return (
            <div key={drawer.id} className="border-b border-gray-100 bg-white">
              {/* Minimalist Drawer Header (Screenshot Style) */}
              <button
                onClick={() => toggleDrawer(drawer.id as TabType)}
                type="button"
                className="w-full text-left px-5 py-3 flex items-center hover:bg-slate-50 transition-colors bg-white outline-none group"
              >
                <div className="flex items-center gap-2.5">
                  <svg
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isExpanded ? "rotate-90 text-indigo-500" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  <div className="flex items-center gap-1.5">
                    <h4
                      className={`text-[12px] font-medium transition-colors ${isExpanded ? "text-indigo-600 font-bold" : "text-slate-700"}`}
                    >
                      {drawer.label}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-normal">
                      {drawer.badge}
                    </span>
                  </div>
                </div>
              </button>

              {/* Expansible Content Container */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-1 animate-in fade-in slide-in-from-top-1 duration-200 bg-white">
                  {drawer.render()}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Plugin Configuration Modal */}
      {activePluginModal && (
        <div className="fixed inset-0 z-[200] bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center p-4">
          <div className={`bg-white rounded-2xl ${activePluginModal === "plugin_customer_filter" ? "max-w-4xl" : "max-w-lg"} w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-200 flex flex-col max-h-[90vh]`}>
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
              <h3 className="text-[16px] font-bold text-slate-800 tracking-tight flex items-center gap-2">
                <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
                {activePluginModal === "plugin_card"
                  ? "编辑卡片内容"
                  : activePluginModal === "plugin_activity"
                    ? "关联分行活动"
                    : activePluginModal === "plugin_customer_filter"
                      ? "客户筛选配置"
                      : "关联分行产品"}
              </h3>
              <button
                onClick={() => setActivePluginModal(null)}
                className="text-slate-400 hover:text-slate-600 outline-none"
              >
                关闭
              </button>
            </div>

            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
              {activePluginModal === "plugin_customer_filter" && (
                <>
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="space-y-4">
                      {/* Existing Rules List */}
                      {(skills.find(s => s.id === "plugin_customer_filter")?.config?.filterRules || []).map((rule: any, idx: number) => (
                        <div key={idx} className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm hover:border-blue-200 transition-all group">
                          {/* Rule Header: Scene + Question */}
                          <div className="px-5 py-3.5 border-b border-slate-50 flex items-center justify-between bg-white">
                            <div className="flex items-center gap-3 flex-1">
                              <span className="bg-blue-100 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded leading-none shrink-0 uppercase tracking-wider">规则 {idx + 1}</span>
                              <span className="text-[13px] font-bold text-slate-800 shrink-0">示例问</span>
                              <input 
                                type="text"
                                value={rule.intent}
                                onChange={(e) => {
                                  const skill = skills.find(s => s.id === "plugin_customer_filter");
                                  const rules = [...(skill?.config?.filterRules || [])];
                                  rules[idx] = { ...rules[idx], intent: e.target.value };
                                  updateSkillConfig("plugin_customer_filter", { filterRules: rules });
                                }}
                                className="bg-transparent border-none outline-none text-[13px] font-medium text-slate-700 flex-1 placeholder:text-slate-300"
                                placeholder="请输入筛选示例问，例如：查询新达标金葵花客户"
                              />
                            </div>
                            <button 
                              onClick={() => {
                                const skill = skills.find(s => s.id === "plugin_customer_filter");
                                const rules = [...(skill?.config?.filterRules || [])];
                                updateSkillConfig("plugin_customer_filter", {
                                  filterRules: rules.filter((_, i) => i !== idx),
                                });
                              }}
                              className="text-slate-300 hover:text-red-500 transition-colors p-1"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>

                          {/* Rule Body: Groups */}
                          <div className="p-5 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-[12px] font-bold text-slate-400">关联客群规则 ({rule.customerGroups?.length || 0})</span>
                              <button 
                                onClick={() => setCustomerGroupConfigOpen({ ruleIdx: idx })}
                                className="flex items-center gap-1 text-[12px] font-bold text-blue-600 hover:text-blue-700 transition-colors"
                              >
                                <Plus size={14} /> 配置客群
                              </button>
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                              {(rule.customerGroups || []).map((group: string, gIdx: number) => (
                                <div 
                                  key={gIdx}
                                  onClick={() => setCustomerGroupConfigOpen({ ruleIdx: idx, editGroupIdx: gIdx })}
                                  className="flex items-center gap-2 py-1.5 pl-3 pr-2 bg-slate-50 border border-slate-200 rounded-lg text-[12px] text-slate-600 group/tag hover:border-blue-400 hover:bg-blue-50/50 hover:shadow-sm transition-all cursor-pointer relative"
                                >
                                  <span className="font-medium group-hover/tag:text-blue-700 transition-colors">{group}</span>
                                  <div className="flex items-center gap-1.5 ml-1">
                                    <Pencil size={12} className="text-slate-300 opacity-0 group-hover/tag:opacity-100 group-hover/tag:text-blue-400 transition-all" />
                                    <div className="w-[1px] h-3 bg-slate-200 group-hover/tag:bg-blue-200" />
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const skill = skills.find(s => s.id === "plugin_customer_filter");
                                        const rules = [...(skill?.config?.filterRules || [])];
                                        const list = rules[idx].customerGroups || [];
                                        rules[idx] = {
                                          ...rules[idx],
                                          customerGroups: list.filter((it: any) => it !== group),
                                        };
                                        updateSkillConfig("plugin_customer_filter", { filterRules: rules });
                                      }}
                                      className="text-slate-300 hover:text-red-500 transition-colors"
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                </div>
                              ))}
                              {(!rule.customerGroups || rule.customerGroups.length === 0) && (
                                <div className="text-[12px] text-slate-300 italic py-1">点击右侧按钮配置关联的客群过滤规则</div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Add New Rule Button */}
                      <button
                        onClick={() => {
                          const skill = skills.find(s => s.id === "plugin_customer_filter");
                          const rules = [...(skill?.config?.filterRules || [])];
                          updateSkillConfig("plugin_customer_filter", {
                            filterRules: [...rules, { intent: "", customerGroups: [] }],
                          });
                        }}
                        className="w-full flex items-center justify-center gap-2 py-4 bg-white border border-dashed border-slate-200 rounded-xl text-indigo-600 font-bold hover:bg-slate-50 hover:border-indigo-200 transition-all shadow-sm group"
                      >
                        <Plus size={18} className="text-indigo-400 group-hover:text-indigo-600" /> 
                        <span className="text-[14px]">添加客户筛选规则</span>
                      </button>
                    </div>
                  </div>

                  {/* Bottom Complete Button */}
                  <div className="px-6 py-4 border-t border-slate-100 flex justify-end bg-slate-50/50 shrink-0">
                    <button 
                      onClick={() => setActivePluginModal(null)}
                      className="bg-[#1e293b] text-white px-8 py-2 rounded-lg text-[14px] font-bold hover:bg-[#0f172a] transition-all shadow-md active:scale-95"
                    >
                      完成
                    </button>
                  </div>
                </>
              )}

              {activePluginModal !== "plugin_customer_filter" && (
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="flex-1 overflow-y-auto p-5">
                    {activePluginModal === "plugin_card" && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-2">
                            卡片类型
                          </label>
                          <select
                            value={
                              skills.find((s) => s.id === "plugin_card")?.config
                                ?.cardType || "image"
                            }
                            onChange={(e) =>
                              updateSkillConfig("plugin_card", {
                                cardType: e.target.value as any,
                              })
                            }
                            className="w-full border border-slate-200 rounded px-3 py-2 text-[12px] text-slate-700 outline-none focus:border-slate-400"
                          >
                            <option value="image">图片展示卡片</option>
                            <option value="payroll">代发数据卡片</option>
                          </select>
                        </div>

                        {skills.find((s) => s.id === "plugin_card")?.config
                          ?.cardType === "image" ? (
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-2">
                              上传图片
                            </label>
                            <div className="border border-dashed border-slate-300 rounded aspect-video flex items-center justify-center bg-slate-50 cursor-pointer hover:bg-slate-100 text-[11px] text-slate-400">
                              点击此处上传内容图片
                            </div>
                          </div>
                        ) : (
                          <div>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={
                                  skills.find((s) => s.id === "plugin_card")?.config
                                    ?.showChart || false
                                }
                                onChange={(e) =>
                                  updateSkillConfig("plugin_card", {
                                    showChart: e.target.checked,
                                  })
                                }
                                className="accent-slate-700"
                              />
                              <span className="text-[12px] font-medium text-slate-700">
                                展示详细代发趋势图表
                              </span>
                            </label>
                          </div>
                        )}
                      </div>
                    )}

                    {(activePluginModal === "plugin_activity" ||
                      activePluginModal === "plugin_product") && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-2">
                            {activePluginModal === "plugin_activity"
                              ? "输入活动名称并按回车关联"
                              : "输入产品名称并按回车关联"}
                          </label>
                          <input
                            type="text"
                            className="w-full border border-slate-200 rounded px-3 py-2 text-[12px] text-slate-700 outline-none focus:border-slate-400"
                            placeholder="例如：招商理财"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                const val = e.currentTarget.value.trim();
                                if (val) {
                                  const skill = skills.find(
                                    (s) => s.id === activePluginModal,
                                  );
                                  const current = skill?.config?.associatedIds || [];
                                  if (!current.includes(val)) {
                                    updateSkillConfig(activePluginModal, {
                                      associatedIds: [...current, val],
                                    });
                                  }
                                  e.currentTarget.value = "";
                                }
                              }
                            }}
                          />
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {skills
                            .find((s) => s.id === activePluginModal)
                            ?.config?.associatedIds?.map((id) => (
                              <span
                                key={id}
                                className="flex items-center gap-1 bg-slate-100 text-slate-600 px-2 py-1 rounded text-[11px]"
                              >
                                {id}
                                <button
                                  onClick={() => {
                                    const skill = skills.find(
                                      (s) => s.id === activePluginModal,
                                    );
                                    const current =
                                      skill?.config?.associatedIds || [];
                                    updateSkillConfig(activePluginModal, {
                                      associatedIds: current.filter((x) => x !== id),
                                    });
                                  }}
                                  className="text-slate-400 hover:text-slate-600 ml-1"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end shrink-0">
                    <button
                      onClick={() => setActivePluginModal(null)}
                      className="bg-slate-800 text-white text-[12px] px-4 py-2 rounded hover:bg-slate-700 font-medium"
                    >
                      完成
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Customer Group Configuration Modal */}
      {customerGroupConfigOpen !== null && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-8">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setCustomerGroupConfigOpen(null)} />
          <div className="relative w-full max-w-7xl h-full max-h-[850px] bg-[#f5f6f8] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 border border-white/20">
            <div className="flex justify-between items-center px-6 py-3 bg-[#eef2f6] border-b border-[#e2e8f0] text-[13px] text-slate-500">
              <div className="flex items-center gap-5 text-indigo-500">
                <Activity size={16} className="cursor-pointer hover:text-indigo-600" />
                <Send size={16} className="cursor-pointer hover:text-indigo-600" />
                <Mail size={16} className="cursor-pointer hover:text-indigo-600" />
                <CheckSquare size={16} className="cursor-pointer hover:text-indigo-600" />
                <Share size={16} className="cursor-pointer hover:text-indigo-600" />
                <Trash2 size={16} className="cursor-pointer hover:text-indigo-600" />
                <Star size={16} className="cursor-pointer hover:text-indigo-600" />
                <CircleUser size={16} className="cursor-pointer hover:text-indigo-600" />
              </div>
              <div className="flex items-center gap-6">
                <span className="font-bold text-slate-700">标签客群 (版本12)</span>
                <span className="flex items-center gap-1.5"><Pencil size={14} className="text-slate-400" /> 编辑中</span>
                <span className="text-[13px]">未生效</span>
                <span className="flex items-center gap-1.5 ml-4">
                  数据范围: 招商银行全行 <Settings size={14} className="text-slate-400 cursor-pointer hover:text-slate-600" />
                </span>
              </div>
            </div>

            <div className="px-6 py-4 bg-white border-b border-[#e2e8f0] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ChevronDown size={20} className="text-slate-400" />
                <span className="font-bold text-slate-800 text-[18px]">客群筛选配置工作台</span>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setCustomerGroupConfigOpen(null)} className="text-[14px] font-bold text-slate-500 hover:text-slate-700 px-4 py-2">关闭</button>
                <button 
                  onClick={() => {
                    const ruleName = `本年月最高代发金额_组合`;
                    if (customerGroupConfigOpen !== null) {
                       const { ruleIdx, editGroupIdx } = customerGroupConfigOpen;
                       const skill = skills.find(s => s.id === "plugin_customer_filter");
                       const rules = [...(skill?.config?.filterRules || [])];
                       const rule = rules[ruleIdx];
                       
                       let newGroups = [...(rule.customerGroups || [])];
                       if (typeof editGroupIdx === 'number') {
                         newGroups[editGroupIdx] = ruleName;
                       } else {
                         newGroups.push(ruleName);
                       }
                       
                       rules[ruleIdx] = {
                         ...rule,
                         customerGroups: newGroups
                       };
                       updateSkillConfig("plugin_customer_filter", { filterRules: rules });
                    }
                    setCustomerGroupConfigOpen(null);
                  }}
                  className="text-[14px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-100"
                >
                  <Save size={16} /> 保存并应用
                </button>
              </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
              <div className="w-[450px] flex flex-col border-r border-[#e2e8f0] bg-white">
                <div className="p-3">
                  <div className="relative flex items-center bg-[#f5f6f8] rounded-md px-3 py-2 border border-transparent focus-within:border-indigo-400">
                    <input type="text" placeholder="请输入标签关键字/客群名/客群ID搜索" className="bg-transparent flex-1 outline-none text-[13px] text-slate-700" />
                    <div className="flex items-center gap-3 text-slate-400 ml-2">
                      <Search size={15} />
                      <div className="relative cursor-pointer group">
                        <Bot size={15} className="text-indigo-600" />
                        <span className="absolute -top-1 -right-1 text-[8px] bg-red-500 text-white px-0.5 rounded font-bold">AI</span>
                      </div>
                      <ChevronsLeft size={16} />
                    </div>
                  </div>
                </div>
                <div className="flex border-b border-[#e2e8f0] text-[13px] text-center">
                  <div className="flex-1 py-2 text-indigo-600 font-bold border-b-2 border-indigo-600">标签</div>
                  <div className="flex-1 py-2 text-slate-600 font-medium">客群</div>
                </div>
                <div className="flex flex-1 overflow-hidden">
                  <div className="w-32 bg-[#f8fafc] border-r border-[#e2e8f0] overflow-y-auto">
                    {['推荐', '最近使用', '上新', '我的收藏', '我的创建', '自定义标签', '动态名单', '潜力资产分析', '信贷资质', '收入支出', '资产状况', '身份圈层', '潜力模型标签', '代发情况'].map(m => (
                      <div key={m} className="px-3 py-3 text-[13px] text-slate-600 hover:bg-slate-50 cursor-pointer">{m}</div>
                    ))}
                  </div>
                  <div className="flex-1 overflow-y-auto bg-white p-2">
                    <div className="grid grid-cols-2 gap-x-2 gap-y-3">
                      {['网点到访多维标签', 'MAC行为多维标签', '本年月最高代发金额', '当前财富产品持仓金额', '当年动账新户日期', '当月他行高端卡等级代码'].map(n => (
                        <div key={n} className="text-[12px] text-slate-700 hover:bg-slate-50 rounded px-1.5 py-1.5 truncate cursor-pointer">{n}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col relative bg-[#f5f6f8]">
                <div className="flex justify-between items-center px-5 py-3 bg-white border-b border-[#e2e8f0]">
                  <div className="text-[13px] font-bold text-slate-800">标签&客群组合</div>
                  <div className="flex items-center gap-4 text-indigo-600">
                    <Save size={16} className="cursor-pointer" />
                    <Trash2 size={16} className="cursor-pointer" />
                  </div>
                </div>
                <div className="flex-1 p-5 overflow-auto relative">
                  <div className="bg-white border-[1.5px] border-indigo-500 rounded-md shadow-sm w-[460px] flex items-stretch overflow-hidden">
                    <div className="px-2 py-2.5 text-slate-300 border-r border-slate-100 bg-slate-50 flex items-center justify-center"><GripVertical size={14} /></div>
                    <div className="px-4 py-2.5 text-[13px] text-slate-800 border-r border-slate-100 bg-slate-50 flex items-center font-medium">本年月最高代发金额</div>
                    <div className="flex-1 flex items-stretch bg-white">
                      <div className="px-3 flex items-center gap-1.5 text-[13px] text-slate-600 border-r border-slate-100">a ≤ x ≤ b <ChevronDown size={14} /></div>
                      <input type="text" className="w-full outline-none px-3 text-[13px]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <PrecalcDrawer 
        isOpen={precalcDrawerOpen} 
        onClose={() => setPrecalcDrawerOpen(false)} 
        isConfigured={isPrecalcConfigured}
        tasks={tasks}
        setTasks={setTasks}
      />
    </div>
  );
};

export default KnowledgePanel;
