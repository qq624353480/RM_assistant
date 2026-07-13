import React, { useState } from 'react';
import { ShieldAlert, Info, CheckCircle2, ArrowLeft, Send, Clock } from 'lucide-react';

interface PermissionRequestProps {
  onBackToHome: () => void;
}

const PermissionRequest: React.FC<PermissionRequestProps> = ({ onBackToHome }) => {
  const [role, setRole] = useState('普通用户');
  const [reason, setReason] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roles = [
    { id: 'user', name: '普通用户', desc: '支持查看分行智能体，创建、编辑本人智能体' },
    { id: 'admin', name: '管理员', desc: '支持查看、创建、编辑本人与分行智能体' }
  ];

  const handleSubmit = () => {
    if (!reason.trim()) return;
    
    setIsSubmitting(true);
    // 模拟接口提交延迟
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 800);
  };

  // 提交成功后的状态展示
  if (isSubmitted) {
    return (
      <div className="h-full bg-[#f0f2f5] p-4 md:p-8 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center py-10">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock size={32} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">申请已提交</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              您的 <strong>{role}</strong> 权限申请已提交至孺牛服务系统，请耐心等待审批。审批通过后即可访问平台。
            </p>
            <button 
              onClick={onBackToHome}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              返回首页
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-[#f0f2f5] p-4 md:p-8 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center py-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 max-w-3xl w-full overflow-hidden">
          {/* Header Section */}
        <div className="bg-gray-50 border-b border-gray-100 px-8 py-6 flex items-center">
          <div className="bg-amber-100 p-2.5 rounded-xl mr-4">
            <ShieldAlert size={28} className="text-amber-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">暂无平台访问权限</h1>
            <p className="text-gray-500 text-sm mt-1">RM小助运营平台 · 银行智能体管理系统</p>
          </div>
        </div>

        <div className="p-8">
          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8 flex items-start text-blue-800 text-sm leading-relaxed">
            <Info className="shrink-0 mr-3 mt-0.5 text-blue-600" size={18} />
            <div>
              当前账号无访问权限。请提交下方申请，系统将通过<strong>孺牛服务系统</strong>发起审批。审批通过后，刷新页面或重新登录即可正常使用。
              <div className="mt-3 pt-3 border-t border-blue-200/60 text-blue-700 flex items-center">
                <span className="font-medium mr-2">批量开通权限请联系：</span>
                杜一阳 (01163499) <span className="mx-2 text-blue-300">|</span> 文良栋 (80245604)
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="space-y-8">
            {/* Role Selection (Visual Cards instead of Select) */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                选择申请角色 <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roles.map(r => (
                  <div
                    key={r.id}
                    onClick={() => setRole(r.name)}
                    className={`relative border rounded-xl p-5 cursor-pointer transition-all duration-200 ${
                      role === r.name
                        ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500 shadow-sm'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-semibold ${role === r.name ? 'text-blue-700' : 'text-gray-900'}`}>
                        {r.name}
                      </span>
                      {role === r.name && <CheckCircle2 size={20} className="text-blue-600" />}
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">{r.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Reason Input */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                申请原因 <span className="text-red-500">*</span>
              </label>
              <textarea 
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="请简要描述您需要使用该平台的工作场景或原因..."
                className="w-full border border-gray-300 rounded-xl p-4 h-32 resize-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-100">
              <button 
                onClick={onBackToHome}
                className="flex items-center px-6 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 font-medium transition-colors text-sm"
              >
                <ArrowLeft size={16} className="mr-2" />
                返回首页
              </button>
              <button 
                onClick={handleSubmit}
                disabled={!reason.trim() || isSubmitting}
                className={`flex items-center px-8 py-2.5 rounded-lg font-medium transition-all text-sm ${
                  !reason.trim() || isSubmitting
                    ? 'bg-blue-400 text-white cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    提交中...
                  </span>
                ) : (
                  <>
                    <Send size={16} className="mr-2" />
                    立即申请
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default PermissionRequest;
