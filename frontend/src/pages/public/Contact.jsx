import { Mail, MapPin, MessageSquare, ShieldAlert, Terminal } from 'lucide-react';
import usePageTitle from '../../hooks/usePageTitle';
import Section from '../../components/common/Section';
import EmergencyNotice from '../../components/common/EmergencyNotice';
import ContactForm from '../../components/forms/ContactForm';
import Badge from '../../components/ui/Badge';
import { EMERGENCY_NUMBER } from '../../constants/site';

const PROJECT_CONTACT = {
  email: '',
  location: '',
};

const CONTACT_ITEMS = [
  { icon: Mail, label: 'Email', value: PROJECT_CONTACT.email },
  { icon: MapPin, label: 'Location', value: PROJECT_CONTACT.location },
].filter((item) => item.value);

export default function Contact() {
  usePageTitle('Contact');

  return (
    <div className="bg-slate-950 text-slate-300 selection:bg-brand-500/30 min-h-screen">
      <div className="relative overflow-hidden border-b border-slate-800 bg-slate-900/50 py-20 lg:py-28">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center z-10">
          <Badge variant="outline" className="mb-6 border-brand-500/50 text-brand-400 bg-brand-500/10 backdrop-blur-sm">
            <Terminal className="w-3 h-3 mr-2" /> Comm_Link
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl mb-6">
            Contact the <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-blue-500">Project Team</span>
          </h1>
          <p className="text-lg leading-relaxed text-slate-400 max-w-3xl mx-auto">
            Have a question or feedback regarding the Digital Police Portal? Prepare a message below. Sending messages is not enabled yet, and the form will indicate this upon submission.
          </p>
        </div>
      </div>

      <Section labelledBy="contact-form-heading" className="py-24">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <h2 id="contact-form-heading" className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-brand-400" /> Send a Message
              </h2>
              <p className="text-sm text-slate-400 mb-8 font-mono">Fields marked with * are required.</p>
              <div className="relative z-10 [&_input]:bg-slate-950 [&_input]:border-slate-700 [&_input]:text-white [&_textarea]:bg-slate-950 [&_textarea]:border-slate-700 [&_textarea]:text-white [&_label]:text-slate-300">
                <ContactForm />
              </div>
            </div>
          </div>

          <div className="space-y-6 lg:col-span-5">
            <section aria-labelledby="contact-info-heading" className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm">
              <h2 id="contact-info-heading" className="text-lg font-semibold text-white mb-4">
                System Info
              </h2>

              {CONTACT_ITEMS.length > 0 ? (
                <dl className="space-y-4">
                  {CONTACT_ITEMS.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-3 p-3 rounded-lg bg-slate-950/50 border border-slate-800">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-brand-400 border border-slate-700">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <div>
                        <dt className="text-[10px] font-mono uppercase tracking-widest text-slate-500">{label}</dt>
                        <dd className="mt-1 text-sm text-slate-200">{value}</dd>
                      </div>
                    </div>
                  ))}
                </dl>
              ) : (
                <div className="rounded-lg bg-slate-800/30 border border-slate-700/50 p-4">
                  <p className="text-sm leading-relaxed text-slate-400">
                    Project contact details have not been published yet. This is an educational college project and has no official office, station or helpline.
                  </p>
                </div>
              )}
            </section>

            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-1">
               <EmergencyNotice compact message={`For immediate emergency assistance, contact ${EMERGENCY_NUMBER}.`} />
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}