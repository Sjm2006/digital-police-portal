import { useMemo, useState } from 'react';
import {
  Plus,
  Trash2,
  Search,
  MapPin,
  Building2,
  Users,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Shield,
  Bell,
  Lock,
  Globe,
  Save,
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
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
          {title}
        </h1>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
        <span className="mt-2 inline-flex rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 ring-1 ring-inset ring-amber-200">
          DEMO DATA
        </span>
      </div>
      {children}
    </div>
  );
}

function StatCard({ title, value, icon: Icon, tone = 'text-blue-600 bg-blue-50', note }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-slate-500">{title}</p>
        <span className={`rounded-lg p-1.5 ${tone}`}>
          <Icon size={15} />
        </span>
      </div>
      <p className="mt-3 text-xl font-semibold text-slate-900">{value}</p>
      {note && <p className="mt-0.5 text-xs text-slate-500">{note}</p>}
    </div>
  );
}

function StatusBadge({ status }) {
  const active = status === 'Active';
  return (
    <span
      className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${
        active
          ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
          : 'bg-slate-100 text-slate-600 ring-slate-200'
      }`}
    >
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
    `${category.name} ${category.description}`
      .toLowerCase()
      .includes(search.toLowerCase())
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
    <div className="space-y-5">
      <PageHeader
        title="Complaint Categories"
        description="View and manage the categories used to classify citizen complaints."
      >
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-3.5 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          <Plus size={16} /> Add Category
        </button>
      </PageHeader>

      {showForm && (
        <form
          onSubmit={addCategory}
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs"
        >
          <h2 className="mb-3 text-sm font-semibold text-slate-900">
            Add New Category
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Category name"
              required
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Category description"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div className="mt-3 flex gap-2">
            <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
              Save Category
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard title="Total Categories" value={categories.length} icon={FileText} tone="text-slate-600 bg-slate-100" />
        <StatCard title="Active Categories" value={categories.filter((c) => c.status === 'Active').length} icon={CheckCircle} tone="text-emerald-600 bg-emerald-50" />
        <StatCard title="Total Complaints" value={categories.reduce((sum, c) => sum + c.complaints, 0)} icon={Users} tone="text-violet-600 bg-violet-50" />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        <div className="border-b border-slate-100 p-3">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search categories..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead className="bg-slate-50/60 text-[11px] uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-2.5 font-semibold">Category</th>
                <th className="px-4 py-2.5 font-semibold">Description</th>
                <th className="px-4 py-2.5 font-semibold">Complaints</th>
                <th className="px-4 py-2.5 font-semibold">Status</th>
                <th className="px-4 py-2.5 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((category) => (
                <tr key={category.id} className="transition-colors hover:bg-slate-50/60">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {category.name}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {category.description}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {category.complaints}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={category.status} />
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => deleteCategory(category.id)}
                      className="rounded-lg p-1.5 text-rose-600 hover:bg-rose-50"
                      title="Delete demo category"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-sm text-slate-500">
                    No categories found.
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

// ADMIN: POLICE STATIONS
export function AdminStations() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');

  const filtered = demoStations.filter((station) => {
    const matchesSearch = `${station.name} ${station.code} ${station.district}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus = status === 'All' || station.status === status;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-5">
      <PageHeader
        title="Police Stations"
        description="View the demo directory of police stations and their details."
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard title="Total Stations" value={demoStations.length} icon={Building2} tone="text-slate-600 bg-slate-100" />
        <StatCard title="Active Stations" value={demoStations.filter((s) => s.status === 'Active').length} icon={CheckCircle} tone="text-emerald-600 bg-emerald-50" />
        <StatCard title="Total Officers" value={demoStations.reduce((sum, s) => sum + s.officers, 0)} icon={Users} tone="text-violet-600 bg-violet-50" />
      </div>

      <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-xs sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search station, code or district..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        >
          <option>All</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {filtered.map((station) => (
          <div
            key={station.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition hover:border-slate-300"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                  <Building2 size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    {station.name}
                  </h3>
                  <p className="text-xs text-slate-500">{station.code}</p>
                </div>
              </div>
              <StatusBadge status={station.status} />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin size={14} className="text-slate-400" />{' '}
                {station.district}, {station.state}
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Users size={14} className="text-slate-400" /> {station.officers} Officers
              </div>
              <div className="col-span-2 text-xs text-slate-500">
                Contact: {station.phone}
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 lg:col-span-2">
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
    <div className="space-y-5">
      <PageHeader
        title="Reports & Analytics"
        description="Review complaint statistics and performance indicators."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Complaints" value="384" icon={FileText} tone="text-slate-600 bg-slate-100" />
        <StatCard title="Resolved Cases" value="272" icon={CheckCircle} tone="text-emerald-600 bg-emerald-50" />
        <StatCard title="Pending Cases" value="86" icon={Clock} tone="text-amber-600 bg-amber-50" />
        <StatCard title="High Priority" value="26" icon={AlertTriangle} tone="text-rose-600 bg-rose-50" />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Monthly Complaint Overview
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Demo figures for June–November 2026
              </p>
            </div>
            <TrendingUp size={18} className="text-slate-400" />
          </div>

          <div className="flex h-56 items-end justify-around gap-3 border-b border-slate-100 px-2">
            {monthly.map((item) => (
              <div
                key={item.month}
                className="flex h-full flex-1 flex-col items-center justify-end gap-2"
              >
                <div className="flex h-[85%] w-full items-end justify-center gap-1">
                  <div
                    title={`${item.total} complaints`}
                    className="w-4 rounded-t bg-blue-500 sm:w-7"
                    style={{ height: `${(item.total / max) * 100}%` }}
                  />
                  <div
                    title={`${item.resolved} resolved`}
                    className="w-4 rounded-t bg-emerald-500 sm:w-7"
                    style={{ height: `${(item.resolved / max) * 100}%` }}
                  />
                </div>
                <span className="text-[11px] text-slate-500">{item.month}</span>
              </div>
            ))}
          </div>

          <div className="mt-3 flex justify-center gap-4 text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded bg-blue-500" /> Total
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded bg-emerald-500" /> Resolved
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <h2 className="text-sm font-semibold text-slate-900">
            Complaint Status
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Current demo distribution
          </p>

          <div className="mt-4 space-y-4">
            {[
              { label: 'Resolved', value: 272, color: 'bg-emerald-500' },
              { label: 'Pending', value: 86, color: 'bg-amber-500' },
              { label: 'Under Investigation', value: 26, color: 'bg-blue-500' },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-1.5 flex justify-between text-xs">
                  <span className="text-slate-600">{item.label}</span>
                  <span className="font-medium text-slate-900">
                    {item.value}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${(item.value / 384) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <h2 className="mb-4 text-sm font-semibold text-slate-900">
          Complaints by Category
        </h2>
        <div className="space-y-3">
          {categories.map((item) => (
            <div key={item.name}>
              <div className="mb-1.5 flex justify-between text-xs">
                <span className="text-slate-600">{item.name}</span>
                <span className="font-medium text-slate-900">
                  {item.value}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-blue-500"
                  style={{ width: `${item.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-500">
        All figures on this page are illustrative demo values and are not live
        database reports.
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
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-3 last:border-0">
      <div>
        <p className="text-sm font-medium text-slate-800">{label}</p>
        <p className="mt-0.5 text-xs text-slate-500">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={settings[settingKey]}
        onClick={() => toggle(settingKey)}
        className={`relative h-5 w-9 shrink-0 rounded-full transition ${
          settings[settingKey] ? 'bg-blue-600' : 'bg-slate-300'
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition ${
            settings[settingKey] ? 'left-4' : 'left-0.5'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="space-y-5">
      <PageHeader
        title="System Settings"
        description="Configure general preferences and portal behaviour."
      />

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="mb-3 flex items-center gap-2">
          <Globe className="text-blue-600" size={18} />
          <h2 className="text-sm font-semibold text-slate-900">
            General Settings
          </h2>
        </div>
        <div className="grid gap-3 pt-1 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Portal Name
            </label>
            <input
              defaultValue="Digital Police Portal"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Default Language
            </label>
            <select
              defaultValue="English"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            >
              <option>English</option>
              <option>Hindi</option>
              <option>Bengali</option>
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="mb-1 flex items-center gap-2">
          <Bell className="text-blue-600" size={18} />
          <h2 className="text-sm font-semibold text-slate-900">Notifications</h2>
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

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="mb-1 flex items-center gap-2">
          <Users className="text-blue-600" size={18} />
          <h2 className="text-sm font-semibold text-slate-900">
            Registration Settings
          </h2>
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

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="mb-1 flex items-center gap-2">
          <Lock className="text-blue-600" size={18} />
          <h2 className="text-sm font-semibold text-slate-900">
            Security & Maintenance
          </h2>
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

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">
          Demo settings are temporary and reset when this page is refreshed.
        </p>
        <button
          onClick={() => setSaved(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          <Save size={15} /> Save Settings
        </button>
      </div>

      {saved && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-3 text-sm text-emerald-700">
          Demo settings updated for this page session. No database changes were
          made.
        </p>
      )}
    </div>
  );
}