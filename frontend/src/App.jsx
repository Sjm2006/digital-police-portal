import { ShieldCheck } from 'lucide-react';

// Phase 0 placeholder shell. Routing and real pages arrive in Phase 2 and Phase 3.
export default function App() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="max-w-md rounded-lg border border-navy-100 bg-white p-8 shadow-card">
        <ShieldCheck className="mb-4 h-8 w-8 text-gold-600" aria-hidden="true" />
        <h1 className="text-2xl font-bold">Digital Police Portal</h1>
        <p className="mt-2 text-sm text-navy-600">
          Foundation ready. Educational prototype; not an official police service. In an emergency, call 112.
        </p>
      </div>
    </main>
  );
}
