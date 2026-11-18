import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Filter, 
  Eye 
} from 'lucide-react';
import usePageTitle from '../../hooks/usePageTitle';

// --- DUMMY DATA ---
const STATS = [
  { label: 'Total Assigned', value: 24, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100' },
  { label: 'Pending Investigations', value: 8, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
  { label: 'Resolved Cases', value: 14, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' },
  { label: 'High Priority', value: 2, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100' },
];

const RECENT_COMPLAINTS = [
  {
    id: 'CMP-2024-001',
    title: 'Stolen Motorcycle',
    citizen: 'Rahul Sharma',
    date: '2024-11-16',
    category: 'Theft',
    status: 'Under Investigation',
    priority: 'High',
  },
  {
    id: 'CMP-2024-002',
    title: 'Noise Complaint',
    citizen: 'Priya Patel',
    date: '2024-11-15',
    category: 'Public Nuisance',
    status: 'Pending Review',
    priority: 'Low',
  },
  {
    id: 'CMP-2024-003',
    title: 'Cyber Fraud',
    citizen: 'Amit Kumar',
    date: '2024-11-14',
    category: 'Cyber Crime',
    status: 'Resolved',
    priority: 'Medium',
  },
  {
    id: 'CMP-2024-004',
    title: 'Lost Wallet',
    citizen: 'Sneha Gupta',
    date: '2024-11-12',
    category: 'Lost & Found',
    status: 'Pending Review',
    priority: 'Low',
  },
];

export default function OfficerDashboard() {
  usePageTitle('Officer Dashboard');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter complaints based on search
  const filteredComplaints = RECENT_COMPLAINTS.filter(
    (c) => 
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.citizen.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Officer Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Welcome back, Officer. Here is your current overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat, index) => (
          <div key={index} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{stat.value}</p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-full ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Complaints Table Section */}
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Table Header & Search */}
        <div className="border-b border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-800">Recently Assigned Complaints</h2>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search ID, title, or citizen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 w-full sm:w-64"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 border border-slate-300 rounded text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
              <Filter className="h-4 w-4" />
              Filter
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-3 font-semibold">ID</th>
                <th className="px-6 py-3 font-semibold">Title</th>
                <th className="px-6 py-3 font-semibold">Citizen</th>
                <th className="px-6 py-3 font-semibold">Date</th>
                <th className="px-6 py-3 font-semibold">Priority</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredComplaints.length > 0 ? (
                filteredComplaints.map((complaint) => (
                  <tr key={complaint.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{complaint.id}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-800">{complaint.title}</p>
                      <p className="text-xs text-slate-500">{complaint.category}</p>
                    </td>
                    <td className="px-6 py-4">{complaint.citizen}</td>
                    <td className="px-6 py-4">{complaint.date}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        complaint.priority === 'High' ? 'bg-red-100 text-red-800' :
                        complaint.priority === 'Medium' ? 'bg-amber-100 text-amber-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {complaint.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        complaint.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                        complaint.status === 'Under Investigation' ? 'bg-indigo-100 text-indigo-800' :
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {complaint.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        to={`/officer/complaints`} // In a real app, this would link to the specific ID
                        className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-800 font-medium"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-slate-500">
                    No complaints found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}