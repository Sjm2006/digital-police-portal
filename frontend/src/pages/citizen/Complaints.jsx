
import { useEffect, useState } from 'react';
import apiClient from '../../services/apiClient';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

export default function Complaints() {
  const [categories, setCategories] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    category_id: '',
    subject: '',
    description: '',
    incident_date: '',
    incident_location: '',
  });

  const today = new Date().toLocaleDateString('en-CA');

  async function loadData() {
    setLoading(true);
    setError('');

    try {
      const [categoryResponse, complaintResponse] = await Promise.all([
        apiClient.get('/complaints/categories.php'),
        apiClient.get('/citizen/complaints.php'),
      ]);

      setCategories(categoryResponse.data.data || []);
      setComplaints(complaintResponse.data.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Unable to load complaint information.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (
      !form.category_id ||
      form.subject.trim().length < 5 ||
      form.description.trim().length < 20 ||
      !form.incident_location.trim() ||
      !form.incident_date
    ) {
      setError('Please complete all fields correctly.');
      return;
    }

    setSubmitting(true);

    try {
      const response = await apiClient.post(
        '/citizen/complaints.php',
        {
          ...form,
          category_id: Number(form.category_id),
          subject: form.subject.trim(),
          description: form.description.trim(),
          incident_location: form.incident_location.trim(),
        }
      );

      const data = response.data.data;

      setSuccess(
        `Complaint submitted successfully. Reference: ${data.complaint_ref}`
      );

      setForm({
        category_id: '',
        subject: '',
        description: '',
        incident_date: '',
        incident_location: '',
      });

      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Complaint submission failed.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="My Complaints"
        description="Submit a new complaint and track the progress of your existing complaints."
      />

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          {success}
        </div>
      )}

      <Card>
        <h2 className="mb-6 text-lg font-semibold text-navy-900">
          Submit a New Complaint
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Complaint Category *
            </label>
            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-navy-700"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Complaint Subject *
            </label>
            <input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              minLength={5}
              maxLength={200}
              required
              placeholder="Briefly describe your complaint"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-navy-700"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Detailed Description *
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              minLength={20}
              maxLength={10000}
              required
              rows={5}
              placeholder="Explain what happened in detail..."
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-navy-700"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Incident Date *
              </label>
              <input
                type="date"
                name="incident_date"
                value={form.incident_date}
                onChange={handleChange}
                max={today}
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-navy-700"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Incident Location *
              </label>
              <input
                name="incident_location"
                value={form.incident_location}
                onChange={handleChange}
                maxLength={255}
                required
                placeholder="Enter incident location"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-navy-700"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-navy-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-navy-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Submitting...' : 'Submit Complaint'}
          </button>
        </form>
      </Card>

      <Card>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-navy-900">
            Complaint History
          </h2>
          <button
            type="button"
            onClick={loadData}
            className="text-sm font-medium text-navy-800 hover:underline"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="py-6 text-sm text-slate-500">Loading complaints...</p>
        ) : complaints.length === 0 ? (
          <p className="py-6 text-sm text-slate-500">
            You have not submitted any complaints yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="px-3 py-3">Reference</th>
                  <th className="px-3 py-3">Subject</th>
                  <th className="px-3 py-3">Category</th>
                  <th className="px-3 py-3">Date</th>
                  <th className="px-3 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((complaint) => (
                  <tr key={complaint.id} className="border-b border-slate-100">
                    <td className="px-3 py-4 font-medium text-navy-900">
                      {complaint.complaint_ref}
                    </td>
                    <td className="px-3 py-4">{complaint.subject}</td>
                    <td className="px-3 py-4">{complaint.category_name}</td>
                    <td className="px-3 py-4">
                      {complaint.incident_date}
                    </td>
                    <td className="px-3 py-4">
                      <Badge>{complaint.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
