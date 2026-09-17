import React, { useState } from 'react';
import { useBot } from '../../context/BotContext';
import { CapturedLead } from '../../types';
import { 
  Users, 
  BarChart3, 
  Download, 
  Search, 
  Star, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  Mail, 
  Phone, 
  Building, 
  Flame, 
  Smile, 
  Meh, 
  Clock,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';

export const LeadsAnalytics: React.FC = () => {
  const { leads, analytics, updateLeadStatus } = useBot();
  const [activeTab, setActiveTab] = useState<'leads' | 'analytics'>('leads');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'qualified' | 'converted'>('all');

  const filteredLeads = leads.filter(l => {
    const matchesSearch = 
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase()) ||
      (l.company && l.company.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;
    if (statusFilter !== 'all' && l.status !== statusFilter) return false;
    return true;
  });

  const exportLeadsCsv = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Company', 'Lead Score', 'Status', 'Bot Name', 'Created At'];
    const rows = filteredLeads.map(l => [
      l.id,
      `"${l.name}"`,
      `"${l.email}"`,
      `"${l.phone || ''}"`,
      `"${l.company || ''}"`,
      l.leadScore,
      l.status,
      `"${l.botName}"`,
      l.createdAt
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `omnidesk_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 p-6 md:p-8 bg-[#F8FAFC] overflow-y-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-blue-600" />
            Leads & Analytics Intelligence
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track qualified leads automatically identified by Gemini AI and measure CSAT resolution performance.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="bg-white p-1 rounded-xl border border-slate-200 flex items-center gap-1 shadow-sm">
          <button
            onClick={() => setActiveTab('leads')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
              activeTab === 'leads' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Captured Leads ({leads.length})
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
              activeTab === 'analytics' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Performance & CSAT
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">AI Resolution Rate</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{analytics.aiHandledPercentage}%</span>
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +4.2%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Autonomous without human agent</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Leads Captured</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{analytics.totalLeads}</span>
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +18.5%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">High intent prospects</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Avg. Response Time</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">&lt; 2s</span>
            <span className="text-xs font-bold text-emerald-500">Gemini 2.5 Flash</span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Industry benchmark: 3.2 minutes</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Customer CSAT</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 flex items-center gap-1">
              <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
              {analytics.avgCsat}
            </span>
            <span className="text-xs font-bold text-slate-400">/ 5.0</span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">From 1,248 verified ratings</p>
        </div>
      </div>

      {/* 1. LEADS TAB */}
      {activeTab === 'leads' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-5">
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search lead name, email, company..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs md:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="qualified">Qualified</option>
                <option value="converted">Converted</option>
              </select>
            </div>

            <button
              onClick={exportLeadsCsv}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-y border-slate-100">
                <tr>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">Captured By</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeads.map(lead => (
                  <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <span className="font-bold text-slate-900 block">{lead.name}</span>
                        <a href={`mailto:${lead.email}`} className="text-blue-600 hover:underline text-[11px]">
                          {lead.email}
                        </a>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {lead.company || '—'}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">
                      {lead.botName}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        lead.leadScore > 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {lead.leadScore}/100
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={lead.status}
                        onChange={e => updateLeadStatus(lead.id, e.target.value as any)}
                        className={`text-xs font-semibold px-2 py-1 rounded-lg border focus:outline-none ${
                          lead.status === 'converted'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : lead.status === 'qualified'
                            ? 'bg-blue-50 border-blue-200 text-blue-700'
                            : 'bg-slate-100 border-slate-200 text-slate-700'
                        }`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="converted">Converted</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <a
                        href={`mailto:${lead.email}?subject=Following%20up%20on%20your%20inquiry`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold"
                      >
                        <Mail className="w-3 h-3" /> Email
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. ANALYTICS TAB */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Daily Trend Chart Simulation */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">7-Day Conversation &amp; Lead Velocity</h3>
                <p className="text-xs text-slate-500">Autonomous resolution percentage over the past week.</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Avg 89% AI Resolution
              </span>
            </div>

            <div className="grid grid-cols-7 gap-2 pt-4 items-end h-48 border-b border-slate-100 pb-2">
              {analytics.dailyTrend.map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    {d.conversations} chats
                  </div>
                  <div
                    className="w-full bg-blue-600 rounded-t-lg transition-all group-hover:bg-blue-700"
                    style={{ height: `${(d.conversations / 300) * 100}%` }}
                  />
                  <span className="text-[10px] font-medium text-slate-500">{d.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Frequent Topics & Sentiments */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-base">Top Customer Inquiries</h3>
              <div className="space-y-3">
                {analytics.topTopics.map((top, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div className="truncate mr-3">
                      <p className="text-xs font-semibold text-slate-800 truncate">{top.topic}</p>
                      <span className="text-[10px] text-slate-400 capitalize">{top.sentiment} Sentiment</span>
                    </div>
                    <span className="text-xs font-bold text-slate-700 px-2 py-0.5 rounded bg-white border border-slate-200 shrink-0">
                      {top.count} inquiries
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-base">Support Automation Breakdown</h3>
              <div className="space-y-4 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Autonomous AI Resolved (87%)</span>
                    <span>1,545 chats</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '87%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Human Escalated / Live Agent (13%)</span>
                    <span>223 chats</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: '13%' }} />
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    SOC-2 &amp; GDPR AI Compliance Verified
                  </div>
                  <p className="text-[11px] text-emerald-700 leading-relaxed">
                    Zero customer chat data is used to train public foundational models. All transcripts are encrypted at rest with AES-256.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
