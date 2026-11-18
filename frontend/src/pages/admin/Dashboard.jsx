import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  ShieldAlert, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Search,
  Eye,
  Settings,
  MapPin,
  FolderTree,
  UserCog
} from 'lucide-react';
import usePageTitle from '../../hooks/usePageTitle';

// --- DUMMY DATA FOR ADMIN ---
const SYSTEM_STATS = [
  { label: 'Total Citizens', value: '1,248', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
  { label: 'Active Officers', value: '42', icon: ShieldAlert, color: 'text-indigo-600', bg: 'bg-indigo-100' },
  { label: 'Pending Complaints', value: '156', icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-100' },
  { label: 'Resolved Complaints', value: '892', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' },
];

const QUICK_ACTIONS = [
  { label: 'Manage Users', icon: Users, path: '/admin/users', color: 'text-blue-600' },
  { label: 'Manage Officers', icon: UserCog, path: '/admin/officers', color: 'text-indigo-600' },
  { label: 'Complaint Categories', icon: FolderTree, path: '/admin/categories', color: 'text-amber-600' },
  { label: 'Police Stations', icon: MapPin, path: '/admin/stations', color: 'text-green-600' },
  { label: 'System Reports', icon: FileText, path: '/admin/reports', color: 'text-purple-600' },
  { label: 'Settings', icon: Settings, path: '/admin/settings', color: 'text-slate-600' },
];

const RECENT_SYSTEM_COMPLAINTS = [
  { id: 'CMP-8492', citizen: 'Rahul Sharma', category: 'Theft', date: '2024-11-17', status: 'Pending', station: 'Central PS' },
  { id: 'CMP-8491', citizen: 'Priya Patel', category: 'Cyber Crime', date: '2024-11-17', status: 'Under Investigation', station: 'Cyber Cell' },
  { id: 'CMP-8490', citizen: 'Amit Kumar', category: 'Traffic', date: '2024-11-16', status: 'Resolved', station: 'Traffic HQ' },
  { id: 'CMP-8489', citizen: 'Sneha Gupta', category: 'Public Nuisance', date: '2024-11-16', status: 'Pending', station: 'North PS' },
  { id: 'CMP-8488', citizen: 'Vikram Singh', category: 'Lost & Found', date: '2024-11-15', status: 'Resolved', station: 'South PS' },
];

export default function AdminDashboard() {
  usePageTitle('Admin Dashboard');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredComplaints = RECENT_SYSTEM_COMPLAINTS.filter(
    (c) => 
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.citizen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">System Administration</h1>
        <p className="text-sm text-slate-500 mt-1">Platform-wide overview and management hub.</p>
      </div>

      {/* System Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {SYSTEM_STATS.map((stat, index) => (
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

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Recent Complaints Table (Takes up 2/3 of space) */}
        <div className="lg:col-span-2 rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-slate-800">Recent System Complaints</h2>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search ID, citizen, or category..."
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
                  <th className="px-6 py-3 font-semibold">Citizen</th>
                  <th className="px-6 py-3 font-semibold">Category</th>
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
                        <p className="font-medium text-slate-800">{complaint.citizen}</p>
                        <p className="text-xs text-slate-500">{complaint.date}</p>
                      </td>
                      <td className="px-6 py-4">{complaint.category}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          complaint.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                          complaint.status === 'Under Investigation' ? 'bg-indigo-100 text-indigo-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {complaint.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link 
                          to={`/admin/complaints`}
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
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                      No complaints found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Quick Actions Menu (Takes up 1/3 of space) */}
        <div className="rounded-lg border border-slate-200 bg-white shadow-sm p-5">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            {QUICK_ACTIONS.map((action, index) => (
              <Link 
                key={index} 
                to={action.path}
                className="flex flex-col items-center justify-center rounded-lg border border-slate-100 bg-slate-50 p-4 transition-all hover:bg-slate-100 hover:shadow-sm group"
              >
                <action.icon className={`h-8 w-8 mb-2 ${action.color} group-hover:scale-110 transition-transform`} />
                <span className="text-xs font-medium text-slate-700 text-center">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}