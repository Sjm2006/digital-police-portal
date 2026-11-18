import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, FileText } from 'lucide-react';
import apiClient from '../../services/apiClient';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

function formatDate(value) {
  if (!value) return 'Not available';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export default function ComplaintDetails() {
  const { ref } = useParams();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchDetails() {
      setLoading(true);
      setError('');

      try {
        const response = await apiClient.get(
          `/citizen/complaint-details.php?ref=${encodeURIComponent(ref)}`
        );

        setComplaint(response.data.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            'Unable to retrieve complaint details.'
        );
      } finally {
        setLoading(false);
      }
    }

    fetchDetails();
  }, [ref]);

  if (loading) {
    return (
      <div className="py-12 text-center text-slate-500">
        Loading complaint details...
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="space-y-5">
        <Link
          to="/citizen/complaints"
          className="inline-flex items-center gap-2 text-sm font-medium text-navy-800 hover:underline"
        >
          <ArrowLeft size={16} />
          Back to complaints
        </Link>

        <Card>
          <div className="py-6 text-center text-red-600">
            {error || 'Complaint not found.'}
          </div>
        </Card>
      </div>
    );
  }

  const history = complaint.history || [];

  return (
    <div className="space-y-8">
      <Link
        to="/citizen/complaints"
        className="inline-flex items-center gap-2 text-sm font-medium text-navy-800 hover:underline"
      >
        <ArrowLeft size={16} />
        Back to complaints
      </Link>

      <PageHeader
        title="Complaint Details"
        description="View your complaint information and track its progress."
      />

      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">Complaint Reference</p>
            <h2 className="mt-1 text-xl font-bold text-navy-900">
              {complaint.complaint_ref}
            </h2>
          </div>

          <Badge>{complaint.status}</Badge>
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <p className="text-sm font-medium text-slate-500">Subject</p>
            <p className="mt-1 font-semibold text-slate-900">
              {complaint.subject}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-500">Category</p>
            <p className="mt-1 text-slate-900">
              {complaint.category_name || 'Not available'}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-500">
              Detailed Description
            </p>
            <p className="mt-2 whitespace-pre-wrap leading-7 text-slate-700">
              {complaint.description}
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <Clock size={18} className="mt-1 text-slate-500" />

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Incident Date
                </p>
                <p className="mt-1 text-slate-900">
                  {complaint.incident_date || 'Not available'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin size={18} className="mt-1 text-slate-500" />

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Incident Location
                </p>
                <p className="mt-1 text-slate-900">
                  {complaint.incident_location || 'Not available'}
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-500">
              Police Station
            </p>
            <p className="mt-1 text-slate-900">
              {complaint.police_station_name || 'Not yet assigned'}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-500">
              Submitted On
            </p>
            <p className="mt-1 text-slate-900">
              {formatDate(complaint.submitted_at)}
            </p>
          </div>

          {complaint.resolved_at && (
            <div>
              <p className="text-sm font-medium text-slate-500">
                Resolved On
              </p>
              <p className="mt-1 text-slate-900">
                {formatDate(complaint.resolved_at)}
              </p>
            </div>
          )}

          {complaint.rejection_reason && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="font-semibold text-red-800">
                Rejection Reason
              </p>
              <p className="mt-2 text-sm text-red-700">
                {complaint.rejection_reason}
              </p>
            </div>
          )}
        </div>
      </Card>

      <Card>
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-navy-900">
            Complaint Status Timeline
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Updates visible to you regarding your complaint.
          </p>
        </div>

        {history.length === 0 ? (
          <p className="py-4 text-sm text-slate-500">
            No status updates are available yet.
          </p>
        ) : (
          <div className="space-y-6">
            {history.map((item, index) => (
              <div
                key={`${item.created_at}-${index}`}
                className="relative flex gap-4"
              >
                <div className="flex flex-col items-center">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100">
                    <FileText size={16} className="text-navy-800" />
                  </div>

                  {index !== history.length - 1 && (
                    <div className="mt-2 h-full min-h-8 w-px bg-slate-200" />
                  )}
                </div>

                <div className="flex-1 pb-3">
                  <p className="font-semibold text-slate-900">
                    {item.new_status || 'Status updated'}
                  </p>

                  {item.old_status && (
                    <p className="mt-1 text-sm text-slate-500">
                      Previous status: {item.old_status}
                    </p>
                  )}

                  {item.remark && (
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                      {item.remark}
                    </p>
                  )}

                  <p className="mt-2 text-xs text-slate-500">
                    {formatDate(item.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}