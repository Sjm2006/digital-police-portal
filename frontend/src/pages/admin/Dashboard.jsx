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
  UserCog,
} from 'lucide-react';
import usePageTitle from '../../hooks/usePageTitle';

const SYSTEM_STATS = [
  { label: 'Total Citizens', value: '1,248', icon: Users, tone: 'text-blue-600 bg-blue-50' },
  { label: 'Active Officers', value: '42', icon: ShieldAlert, tone: 'text-indigo-600 bg-indigo-50' },
  { label: 'Pending Complaints', value: '156', icon: AlertCircle, tone: 'text-amber-600 bg-amber-50' },
  { label: 'Resolved Complaints', value: '892', icon: CheckCircle2, tone: 'text-emerald-600 bg-emerald-50' },
];

const QUICK_ACTIONS = [
  { label: 'Manage Users', icon: Users, path: '/admin/users', tone: 'text-blue-600 bg-blue-50' },
  { label: 'Manage Officers', icon: UserCog, path: '/admin/officers', tone: 'text-indigo-600 bg-indigo-50' },
  { label: 'Complaint Categories', icon: FolderTree, path: '/admin/categories', tone: 'text-amber-600 bg-amber-50' },
  { label: 'Police Stations', icon: MapPin, path: '/admin/stations', tone: 'text-emerald-600 bg-emerald-50' },
  { label: 'System Reports', icon: FileText, path: '/admin/reports', tone: 'text-violet-600 bg-violet-50' },
  { label: 'Settings', icon: Settings, path: '/admin/settings', tone: 'text-slate-600 bg-slate-100' },
];

const RECENT_SYSTEM_COMPLAINTS = [
  { id: 'CMP-8492', citizen: 'Rahul Sharma', category: 'Theft', date: '2024-11-17', status: 'Pending', station: 'Central PS' },
  { id: 'CMP-8491', citizen: 'Priya Patel', category: 'Cyber Crime', date: '2024-11-17', status: 'Under Investigation', station: 'Cyber Cell' },
  { id: 'CMP-8490', citizen: 'Amit Kumar', category: 'Traffic', date: '2024-11-16', status: 'Resolved', station: 'Traffic HQ' },
  { id: 'CMP-8489', citizen: 'Sneha Gupta', category: 'Public Nuisance', date: '2024-11-16', status: 'Pending', station: 'North PS' },
  { id: 'CMP-8488', citizen: 'Vikram Singh', category: 'Lost & Found', date: '2024-11-15', status: 'Resolved', station: 'South PS' },
];

const STATUS_STYLES = {
  Resolved: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  'Under Investigation': 'bg-indigo-50 text-indigo-700 ring-indigo-200',
  Pending: 'bg-amber-50 text-amber-700 ring-amber-200',
};

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
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
          System Administration
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Platform-wide overview and management hub.
        </p>
      </div>

      {/* System Stats Cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {SYSTEM_STATS.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">
                  {stat.label}
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  {stat.value}
                </p>
              </div>
              <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.tone}`}>
                <stat.icon className="h-4 w-4" />
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Recent complaints */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs lg:col-span-2">
          <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center">
            <h2 className="text-sm font-semibold text-slate-900">
              Recent System Complaints
            </h2>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search ID, citizen, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 sm:w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/60 text-[11px] uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-2.5 font-semibold">ID</th>
                  <th className="px-4 py-2.5 font-semibold">Citizen</th>
                  <th className="px-4 py-2.5 font-semibold">Category</th>
                  <th className="px-4 py-2.5 font-semibold">Status</th>
                  <th className="px-4 py-2.5 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredComplaints.length > 0 ? (
                  filteredComplaints.map((complaint) => (
                    <tr
                      key={complaint.id}
                      className="transition-colors hover:bg-slate-50/60"
                    >
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {complaint.id}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-slate-800">{complaint.citizen}</p>
                        <p className="text-xs text-slate-500">
                          {complaint.date}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {complaint.category}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${
                            STATUS_STYLES[complaint.status] ||
                            'bg-slate-100 text-slate-600 ring-slate-200'
                          }`}
                        >
                          {complaint.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          to={`/admin/complaints`}
                          className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-4 py-8 text-center text-sm text-slate-500"
                    >
                      No complaints found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <h2 className="mb-3 text-sm font-semibold text-slate-900">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {QUICK_ACTIONS.map((action) => (
              <Link
                key={action.label}
                to={action.path}
                className="group flex flex-col items-center justify-center rounded-lg border border-slate-200 bg-white p-3 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <span
                  className={`mb-2 flex h-8 w-8 items-center justify-center rounded-lg ${action.tone} transition group-hover:scale-105`}
                >
                  <action.icon className="h-4 w-4" />
                </span>
                <span className="text-center text-[11px] font-medium text-slate-700">
                  {action.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}