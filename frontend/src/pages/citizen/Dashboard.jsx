import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Search, 
  PlusCircle, 
  Eye 
} from 'lucide-react';
import usePageTitle from '../../hooks/usePageTitle';

// --- DUMMY DATA FOR CITIZEN ---
const STATS = [
  { label: 'Total Complaints', value: 5, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100' },
  { label: 'In Progress', value: 2, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
  { label: 'Resolved', value: 2, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' },
  { label: 'Rejected', value: 1, icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
];

const MY_COMPLAINTS = [
  {
    id: 'CMP-2024-001',
    title: 'Stolen Motorcycle',
    date: '2024-11-16',
    category: 'Theft',
    status: 'Under Investigation',
    officer: 'Officer Sharma',
  },
  {
    id: 'CMP-2024-002',
    title: 'Neighborhood Noise',
    date: '2024-11-10',
    category: 'Public Nuisance',
    status: 'Resolved',
    officer: 'Officer Patel',
  },
  {
    id: 'CMP-2024-003',
    title: 'Lost Mobile Phone',
    date: '2024-10-28',
    category: 'Lost & Found',
    status: 'Resolved',
    officer: 'Officer Kumar',
  },
  {
    id: 'CMP-2024-004',
    title: 'Suspicious Activity',
    date: '2024-10-15',
    category: 'Security',
    status: 'Rejected',
    officer: 'N/A',
  },
  {
    id: 'CMP-2024-005',
    title: 'Traffic Signal Failure',
    date: '2024-11-17',
    category: 'Traffic',
    status: 'Pending Review',
    officer: 'Unassigned',
  },
];

export default function CitizenDashboard() {
  usePageTitle('Citizen Dashboard');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter complaints based on search
  const filteredComplaints = MY_COMPLAINTS.filter(
    (c) => 
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Citizen Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Welcome back. Track your submitted complaints here.</p>
        </div>
        <Link 
          to="/citizen/complaints" 
          className="inline-flex items-center justify-center gap-2 rounded bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
        >
          <PlusCircle className="h-4 w-4" />
          Register New Complaint
        </Link>
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

      {/* Complaints Table Section */}
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-800">My Recent Complaints</h2>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 w-full sm:w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-3 font-semibold">ID</th>
                <th className="px-6 py-3 font-semibold">Complaint Title</th>
                <th className="px-6 py-3 font-semibold">Date Submitted</th>
                <th className="px-6 py-3 font-semibold">Assigned Officer</th>
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
                    <td className="px-6 py-4">{complaint.date}</td>
                    <td className="px-6 py-4">{complaint.officer}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        complaint.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                        complaint.status === 'Under Investigation' ? 'bg-indigo-100 text-indigo-800' :
                        complaint.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {complaint.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        to={`/citizen/complaints`}
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
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
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