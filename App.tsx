
import React, { useState } from 'react';
import { 
  LayoutGrid, 
  Database, 
  Library, 
  ClipboardCheck, 
  BarChart3, 
  ShieldCheck, 
  BookOpen, 
  Menu,
  ChevronDown,
  User,
  Settings
} from 'lucide-react';
import AgentList from './pages/AgentList';
import PermissionRequest from './pages/PermissionRequest';
import AgentEditPage from './src/components/agent-edit/AgentEditPage';
import { PageType } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>(PageType.NO_PERMISSION);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [editingAgent, setEditingAgent] = useState<{ id: string; name: string } | null>(null);

  const NavItem = ({ icon: Icon, label, active = false, sub = false, onClick }: any) => (
    <div 
      onClick={onClick}
      className={`flex items-center px-4 py-3 cursor-pointer transition-colors ${
        active ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-100'
      } ${sub ? 'pl-10 text-sm' : 'font-medium'}`}
    >
      <Icon size={18} className="mr-3" />
      <span className={`${sidebarCollapsed ? 'hidden' : 'block'}`}>{label}</span>
      {!sub && !sidebarCollapsed && label === 'AGENT中心' && <ChevronDown size={14} className="ml-auto" />}
    </div>
  );

  // 根据需求：创建页面和编辑页面不需要显示左边导航栏
  const showSidebar = currentPage === PageType.LIST || currentPage === PageType.NO_PERMISSION;
  const isNoPermission = currentPage === PageType.NO_PERMISSION;

  return (
    <div className="flex h-screen bg-[#f0f2f5]">
      {/* Sidebar */}
      {showSidebar && (
        <aside className={`bg-white border-r border-gray-200 transition-all duration-300 flex flex-col ${sidebarCollapsed ? 'w-16' : 'w-56'}`}>
          <div className="p-4 flex items-center border-b border-gray-100 h-14">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold mr-2">RM</div>
            <span className={`font-bold text-gray-800 ${sidebarCollapsed ? 'hidden' : 'block'}`}>RM小助</span>
            <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="ml-auto text-gray-400 hover:text-gray-600">
              <Menu size={18} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto pt-4">
            {!isNoPermission && (
              <>
                <NavItem icon={LayoutGrid} label="AGENT中心" active={currentPage === PageType.LIST} />
                <NavItem icon={Settings} label="智能体" sub active={currentPage === PageType.LIST} onClick={() => setCurrentPage(PageType.LIST)} />
                <NavItem icon={User} label="AI专家" sub />
                
                <div className="mt-4">
                  <NavItem icon={Database} label="数据中心" />
                  <NavItem icon={Library} label="案例库" />
                  <NavItem icon={ClipboardCheck} label="评测台" />
                  <NavItem icon={BarChart3} label="运营看板" />
                  <NavItem icon={ShieldCheck} label="审批中心" />
                </div>
              </>
            )}
          </nav>

          <div className="mt-auto border-t border-gray-100 p-2">
            {!isNoPermission && <NavItem icon={BookOpen} label="操作指南" />}
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header - 仅在非创建/编辑页显示 */}
        {currentPage !== PageType.CREATE && currentPage !== PageType.AGENT_EDIT && (
          <header className="bg-white h-14 border-b border-gray-200 px-6 flex items-center justify-between z-10">
            <div className="flex items-center text-sm">
               <span className="text-gray-500">智能体</span>
               {currentPage === PageType.NO_PERMISSION && (
                 <>
                  <span className="mx-2 text-gray-300">/</span>
                  <span className="text-gray-800 font-medium">权限申请</span>
                 </>
               )}
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-gray-100 px-3 py-1 rounded text-xs text-gray-500 border border-gray-200">110</div>
              <div className="flex items-center space-x-2 border-l border-gray-200 pl-4">
                 <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                   <User size={16} className="text-blue-600" />
                 </div>
                 <div className="text-sm">
                   <span className="font-medium">张三</span>
                   <span className="mx-1 text-gray-300">|</span>
                   <span className="text-blue-500 bg-blue-50 px-1 rounded text-[10px]">
                     {isNoPermission ? '暂无权限' : '普通用户'}
                   </span>
                 </div>
              </div>
              <div className="text-xs text-red-500 font-bold border border-red-500 px-2 py-0.5 rounded italic">IT回音壁</div>
            </div>
          </header>
        )}

        {/* Page Container */}
        <div className="flex-1 overflow-hidden relative">
          {currentPage === PageType.LIST ? (
            <AgentList 
              onNewAgent={() => setCurrentPage(PageType.CREATE)} 
              onEditAgent={(agent) => {
                setEditingAgent({ id: agent.id, name: agent.name });
                setCurrentPage(PageType.AGENT_EDIT);
              }}
            />
          ) : currentPage === PageType.CREATE ? (
            <AgentEditPage 
              agentId="new-agent" 
              agentName="新增智能体" 
              isCreate
              onBack={() => setCurrentPage(PageType.LIST)} 
            />
          ) : currentPage === PageType.AGENT_EDIT ? (
            <AgentEditPage 
              agentId={editingAgent?.id || 'new'} 
              agentName={editingAgent?.name || '未命名智能体'} 
              onBack={() => setCurrentPage(PageType.LIST)} 
            />
          ) : (
            <PermissionRequest onBackToHome={() => setCurrentPage(PageType.LIST)} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
