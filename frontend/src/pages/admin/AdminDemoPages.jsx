
import { useMemo, useState } from 'react';
import {
  Plus, Trash2, Search, MapPin, Building2, Users,
  FileText, CheckCircle, Clock, AlertTriangle,
  TrendingUp, Shield, Bell, Lock, Globe, Save
} from 'lucide-react';

const initialCategories = [
  { id: 1, name: 'Theft', description: 'Cases involving stolen property.', complaints: 128, status: 'Active' },
  { id: 2, name: 'Cyber Crime', description: 'Online fraud and digital offences.', complaints: 96, status: 'Active' },
  { id: 3, name: 'Missing Person', description: 'Missing or untraceable persons.', complaints: 42, status: 'Active' },
  { id: 4, name: 'Harassment', description: 'Harassment and intimidation cases.', complaints: 74, status: 'Active' },
  { id: 5, name: 'Traffic Violation', description: 'Traffic-related complaints.', complaints: 53, status: 'Active' },
  { id: 6, name: 'Other', description: 'Other miscellaneous complaints.', complaints: 21, status: 'Inactive' },
];

const demoStations = [
  { id: 1, code: 'PS-KOL-001', name: 'Park Street Police Station', district: 'Kolkata', state: 'West Bengal', phone: '033-2227-1001', officers: 18, status: 'Active' },
  { id: 2, code: 'PS-KOL-002', name: 'Bhowanipore Police Station', district: 'Kolkata', state: 'West Bengal', phone: '033-2475-1002', officers: 14, status: 'Active' },
  { id: 3, code: 'PS-KOL-003', name: 'Shakespeare Sarani Police Station', district: 'Kolkata', state: 'West Bengal', phone: '033-2281-1003', officers: 16, status: 'Active' },
  { id: 4, code: 'PS-KOL-004', name: 'Jadavpur Police Station', district: 'Kolkata', state: 'West Bengal', phone: '033-2414-1004', officers: 12, status: 'Active' },
  { id: 5, code: 'PS-HWH-001', name: 'Howrah Police Station', district: 'Howrah', state: 'West Bengal', phone: '033-2641-1005', officers: 11, status: 'Inactive' },
];

function PageHeader({ title, description, children }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
        <span className="mt-2 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
          DEMO DATA
        </span>
      </div>
      {children}
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color = 'blue', note }) {
  const colors = {
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    amber: 'bg-amber-100 text-amber-700',
    red: 'bg-red-100 text-red-700',
    purple: 'bg-purple-100 text-purple-700',
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{title}</p>
        <div className={`rounded-lg p-2 ${colors[color]}`}>
          <Icon size={20} />
        </div>
      </div>
      <p className="mt-3 text-2xl font-bold text-gray-900">{value}</p>
      {note && <p className="mt-1 text-xs text-gray-500">{note}</p>}
    </div>
  );
}

function StatusBadge({ status }) {
  const active = status === 'Active';

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
      active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
    }`}>
      {status}
    </span>
  );
}

// ADMIN: CATEGORIES
export function AdminCategories() {
  const [categories, setCategories] = useState(initialCategories);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [search, setSearch] = useState('');

  const filtered = categories.filter((category) =>
    `${category.name} ${category.description}`.toLowerCase().includes(search.toLowerCase())
  );

  const addCategory = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setCategories((previous) => [
      ...previous,
      {
        id: Date.now(),
        name: name.trim(),
        description: description.trim() || 'No description provided.',
        complaints: 0,
        status: 'Active',
      },
    ]);

    setName('');
    setDescription('');
    setShowForm(false);
  };

  const deleteCategory = (id) => {
    if (window.confirm('Delete this demo category?')) {
      setCategories((previous) => previous.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Complaint Categories"
        description="View and manage the categories used to classify citizen complaints."
      >
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-800"
        >
          <Plus size={18} /> Add Category
        </button>
      </PageHeader>

      {showForm && (
        <form onSubmit={addCategory} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-900">Add New Category</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Category name"
              required
              className="rounded-lg border border-gray-300 px-4 py-3"
            />
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Category description"
              className="rounded-lg border border-gray-300 px-4 py-3"
            />
          </div>
          <div className="mt-4 flex gap-3">
            <button className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white">
              Save Category
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total Categories" value={categories.length} icon={FileText} />
        <StatCard title="Active Categories" value={categories.filter((c) => c.status === 'Active').length} icon={CheckCircle} color="green" />
        <StatCard title="Total Complaints" value={categories.reduce((sum, c) => sum + c.complaints, 0)} icon={Users} color="purple" />
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search categories..."
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Description</th>
                <th className="px-5 py-4">Complaints</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((category) => (
                <tr key={category.id}>
                  <td className="px-5 py-4 font-semibold text-gray-900">{category.name}</td>
                  <td className="px-5 py-4 text-gray-500">{category.description}</td>
                  <td className="px-5 py-4">{category.complaints}</td>
                  <td className="px-5 py-4"><StatusBadge status={category.status} /></td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => deleteCategory(category.id)}
                      className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                      title="Delete demo category"
                    >
                      <Trash2 size={17} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan="5" className="px-5 py-8 text-center text-gray-500">No categories found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ADMIN: POLICE STATIONS
export function AdminStations() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');

  const filtered = demoStations.filter((station) => {
    const matchesSearch = `${station.name} ${station.code} ${station.district}`
      .toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === 'All' || station.status === status;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Police Stations"
        description="View the demo directory of police stations and their details."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total Stations" value={demoStations.length} icon={Building2} />
        <StatCard title="Active Stations" value={demoStations.filter((s) => s.status === 'Active').length} icon={CheckCircle} color="green" />
        <StatCard title="Total Officers" value={demoStations.reduce((sum, s) => sum + s.officers, 0)} icon={Users} color="purple" />
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search station, code or district..."
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
        >
          <option>All</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.map((station) => (
          <div key={station.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
                  <Building2 size={22} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{station.name}</h3>
                  <p className="text-xs text-gray-500">{station.code}</p>
                </div>
              </div>
              <StatusBadge status={station.status} />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin size={16} /> {station.district}, {station.state}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Users size={16} /> {station.officers} Officers
              </div>
              <div className="col-span-2 text-gray-600">
                Contact: {station.phone}
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500 lg:col-span-2">
            No police stations match your search.
          </div>
        )}
      </div>
    </div>
  );
}

// ADMIN: REPORTS
export function AdminReports() {
  const monthly = [
    { month: 'Jun', total: 42, resolved: 30 },
    { month: 'Jul', total: 58, resolved: 41 },
    { month: 'Aug', total: 51, resolved: 39 },
    { month: 'Sep', total: 72, resolved: 53 },
    { month: 'Oct', total: 64, resolved: 48 },
    { month: 'Nov', total: 86, resolved: 61 },
  ];

  const categories = [
    { name: 'Theft', value: 128, percent: 82 },
    { name: 'Cyber Crime', value: 96, percent: 68 },
    { name: 'Harassment', value: 74, percent: 52 },
    { name: 'Traffic', value: 53, percent: 38 },
    { name: 'Missing Person', value: 42, percent: 30 },
  ];

  const max = Math.max(...monthly.map((item) => item.total));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Analytics"
        description="Review complaint statistics and performance indicators."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Complaints" value="384" icon={FileText} />
        <StatCard title="Resolved Cases" value="272" icon={CheckCircle} color="green" />
        <StatCard title="Pending Cases" value="86" icon={Clock} color="amber" />
        <StatCard title="High Priority" value="26" icon={AlertTriangle} color="red" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="mb-6">
            <h2 className="font-semibold text-gray-900">Monthly Complaint Overview</h2>
            <p className="mt-1 text-xs text-gray-500">Demo figures for June–November 2026</p>
          </div>

          <div className="flex h-64 items-end justify-around gap-3 border-b border-gray-200 px-2">
            {monthly.map((item) => (
              <div key={item.month} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <div className="flex h-[85%] w-full items-end justify-center gap-1">
                  <div
                    title={`${item.total} complaints`}
                    className="w-5 rounded-t bg-blue-600 sm:w-8"
                    style={{ height: `${(item.total / max) * 100}%` }}
                  />
                  <div
                    title={`${item.resolved} resolved`}
                    className="w-5 rounded-t bg-green-500 sm:w-8"
                    style={{ height: `${(item.resolved / max) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500">{item.month}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-center gap-5 text-xs text-gray-600">
            <span className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-blue-600" /> Total</span>
            <span className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-green-500" /> Resolved</span>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900">Complaint Status</h2>
          <p className="mt-1 text-xs text-gray-500">Current demo distribution</p>

          <div className="mt-6 space-y-5">
            {[
              { label: 'Resolved', value: 272, color: 'bg-green-500' },
              { label: 'Pending', value: 86, color: 'bg-amber-500' },
              { label: 'Under Investigation', value: 26, color: 'bg-blue-500' },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-gray-600">{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: `${(item.value / 384) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-5 font-semibold text-gray-900">Complaints by Category</h2>
        <div className="space-y-4">
          {categories.map((item) => (
            <div key={item.name}>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-gray-700">{item.name}</span>
                <span className="font-semibold text-gray-900">{item.value}</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                <div className="h-full rounded-full bg-blue-600" style={{ width: `${item.percent}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-500">
        All figures on this page are illustrative demo values and are not live database reports.
      </p>
    </div>
  );
}

// ADMIN: SETTINGS
export function AdminSettings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    complaintAlerts: true,
    officerRegistration: false,
    citizenRegistration: true,
    maintenanceMode: false,
    twoFactor: true,
  });
  const [saved, setSaved] = useState(false);

  const toggle = (key) => {
    setSettings((previous) => ({ ...previous, [key]: !previous[key] }));
    setSaved(false);
  };

  const SettingToggle = ({ label, description, settingKey }) => (
    <div className="flex items-center justify-between gap-4 border-b border-gray-100 py-4 last:border-0">
      <div>
        <p className="font-medium text-gray-800">{label}</p>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={settings[settingKey]}
        onClick={() => toggle(settingKey)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          settings[settingKey] ? 'bg-blue-700' : 'bg-gray-300'
        }`}
      >
        <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
          settings[settingKey] ? 'left-6' : 'left-1'
        }`} />
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Settings"
        description="Configure general preferences and portal behaviour."
      />

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-2 flex items-center gap-3">
          <Globe className="text-blue-700" size={21} />
          <h2 className="font-semibold text-gray-900">General Settings</h2>
        </div>
        <div className="grid gap-4 pt-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Portal Name</label>
            <input defaultValue="Digital Police Portal" className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Default Language</label>
            <select defaultValue="English" className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm">
              <option>English</option>
              <option>Hindi</option>
              <option>Bengali</option>
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-2 flex items-center gap-3">
          <Bell className="text-blue-700" size={21} />
          <h2 className="font-semibold text-gray-900">Notifications</h2>
        </div>
        <SettingToggle
          label="Email Notifications"
          description="Enable email notifications for portal activity."
          settingKey="emailNotifications"
        />
        <SettingToggle
          label="Complaint Alerts"
          description="Notify administrators when new complaints are submitted."
          settingKey="complaintAlerts"
        />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-2 flex items-center gap-3">
          <Users className="text-blue-700" size={21} />
          <h2 className="font-semibold text-gray-900">Registration Settings</h2>
        </div>
        <SettingToggle
          label="Citizen Registration"
          description="Allow new citizens to register through the portal."
          settingKey="citizenRegistration"
        />
        <SettingToggle
          label="Officer Self-Registration"
          description="Allow officers to register without administrator approval."
          settingKey="officerRegistration"
        />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-2 flex items-center gap-3">
          <Lock className="text-blue-700" size={21} />
          <h2 className="font-semibold text-gray-900">Security & Maintenance</h2>
        </div>
        <SettingToggle
          label="Two-Factor Authentication"
          description="Require an additional verification step for accounts."
          settingKey="twoFactor"
        />
        <SettingToggle
          label="Maintenance Mode"
          description="Display a maintenance notice to portal visitors."
          settingKey="maintenanceMode"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-gray-500">
          Demo settings are temporary and reset when this page is refreshed.
        </p>
        <button
          onClick={() => setSaved(true)}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800"
        >
          <Save size={17} /> Save Settings
        </button>
      </div>

      {saved && (
        <p className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          Demo settings updated for this page session. No database changes were made.
        </p>
      )}
    </div>
  );
}
