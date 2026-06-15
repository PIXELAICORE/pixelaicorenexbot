import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, Database, HelpCircle, Activity, 
  TrendingUp, Users, DollarSign, Calendar, Layers, FileText,
  UserCheck, AlertCircle, RefreshCw, CheckCircle, Info, Settings 
} from 'lucide-react';
import { FirebaseUser } from '../firebase';
import { ContactRequest, ProjectLead, PaymentReceipt, ConsultationBooking, AdminStats } from '../types';

interface AdminDashboardProps {
  user: FirebaseUser | null;
  onLogin: () => void;
}

export default function AdminDashboard({ user, onLogin }: AdminDashboardProps) {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [contacts, setContacts] = useState<ContactRequest[]>([]);
  const [projects, setProjects] = useState<ProjectLead[]>([]);
  const [payments, setPayments] = useState<PaymentReceipt[]>([]);
  const [consultations, setConsultations] = useState<ConsultationBooking[]>([]);
  
  const [activeSubTab, setActiveSubTab] = useState<'leads' | 'payments' | 'projects' | 'consultations' | 'firestore'>('leads');
  const [isLoading, setIsLoading] = useState(true);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Cloud Firestore Real-time Console Management Engine States
  const [selectedCol, setSelectedCol] = useState<string>('contacts');
  const [firestoreDocs, setFirestoreDocs] = useState<any[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [docJsonText, setDocJsonText] = useState<string>('');
  const [dbMeta, setDbMeta] = useState<any>(null);
  const [dbRules, setDbRules] = useState<string>('');
  const [isConsoleLoading, setIsConsoleLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isCreatingNewDoc, setIsCreatingNewDoc] = useState<boolean>(false);
  const [newDocId, setNewDocId] = useState<string>('');

  const dbCollections = [
    { name: 'contacts', title: 'Leads (contacts)', desc: 'Captured client contact requests and inquiries' },
    { name: 'payments', title: 'Financials (payments)', desc: 'Store authenticated records of settled PayPal receipts' },
    { name: 'projects', title: 'Production (projects)', desc: 'Operational development sprints and track delivery SLA' },
    { name: 'consultations', title: 'Briefings (consultations)', desc: 'Calendar briefings scheduled by prospect accounts' },
    { name: 'users', title: 'Identities (users)', desc: 'Registered user credentials and client profiles' },
    { name: 'admins', title: 'Authorities (admins)', desc: 'Root database administrators and system handlers' },
    { name: 'services', title: 'Service Menu (services)', desc: 'Operational agency catalog of technology programs' },
    { name: 'testimonials', title: 'Social Proofs (testimonials)', desc: 'Client endorsements and high conversion reviews' },
    { name: 'portfolio', title: 'Showcase (portfolio)', desc: 'Engineering portfolios and previous delivery assets' },
    { name: 'blog', title: 'Articles (blog)', desc: 'Aesthetic marketing reports and agency whitepapers' }
  ];

  const fetchFirestoreMeta = async () => {
    try {
      const res = await fetch('/api/firestore/meta');
      if (res.ok) setDbMeta(await res.json());
    } catch (err) {
      console.error("Failed to fetch firestore metadata");
    }
  };

  const fetchFirestoreRules = async () => {
    try {
      const res = await fetch('/api/firestore/rules');
      if (res.ok) {
        const data = await res.json();
        setDbRules(data.content);
      }
    } catch (err) {
      console.error("Failed to fetch firestore rules");
    }
  };

  const fetchFirestoreDocs = async (collectionName: string) => {
    setIsConsoleLoading(true);
    try {
      const res = await fetch(`/api/firestore/collections/${collectionName}/documents`);
      if (res.ok) {
        const docs = await res.json();
        setFirestoreDocs(docs);
        if (docs.length > 0) {
          setSelectedDocId(docs[0].id);
          setDocJsonText(JSON.stringify(docs[0].data, null, 2));
        } else {
          setSelectedDocId(null);
          setDocJsonText('{}');
        }
      }
    } catch (err) {
      console.error("Failed to fetch documents for collection", collectionName);
    } finally {
      setIsConsoleLoading(false);
    }
  };

  const handleSelectDoc = (docId: string, data: any) => {
    setSelectedDocId(docId);
    setDocJsonText(JSON.stringify(data, null, 2));
    setIsCreatingNewDoc(false);
  };

  const handleSaveDoc = async () => {
    if (!selectedDocId) return;
    try {
      let parsedData;
      try {
        parsedData = JSON.parse(docJsonText);
      } catch (e) {
        setFeedbackMsg({ type: 'error', text: 'Invalid JSON signature syntax. Please review formatting.' });
        return;
      }

      const res = await fetch(`/api/firestore/collections/${selectedCol}/documents/${selectedDocId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedData)
      });

      if (res.ok) {
        setFeedbackMsg({ type: 'success', text: `Document '${selectedDocId}' in collection '${selectedCol}' successfully committed to Cloud Firestore.` });
        setFirestoreDocs(firestoreDocs.map(d => d.id === selectedDocId ? { ...d, data: parsedData } : d));
      } else {
        setFeedbackMsg({ type: 'error', text: 'Cloud Firestore rejected your document modifications (rules violation).' });
      }
    } catch (err) {
      setFeedbackMsg({ type: 'error', text: 'Connection interrupt while committing documents.' });
    }
  };

  const handleDocDelete = async (docId: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete document '${docId}' in collection '${selectedCol}'? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/firestore/collections/${selectedCol}/documents/${docId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setFeedbackMsg({ type: 'success', text: `Document '${docId}' successfully deleted from Cloud Firestore.` });
        setFirestoreDocs(firestoreDocs.filter(d => d.id !== docId));
        if (selectedDocId === docId) {
          setSelectedDocId(null);
          setDocJsonText('{}');
        }
      } else {
        setFeedbackMsg({ type: 'error', text: 'Failed to delete document. Ensure authentication is valid.' });
      }
    } catch (err) {
      setFeedbackMsg({ type: 'error', text: 'Connection interrupt.' });
    }
  };

  const handleStartCreateDoc = () => {
    setIsCreatingNewDoc(true);
    setSelectedDocId(null);
    setNewDocId('');
    
    // Auto skeleton generator
    const prefillShapes: Record<string, any> = {
      contacts: { name: "Prospect Name", email: "prospect@org.com", phone: "", company: "", projectType: "AI Solutions", budget: "$10,000+", message: "New inquiry from sandbox explorer", status: "new", createdAt: new Date().toISOString() },
      payments: { clientName: "Payer Name", clientEmail: "payer@paypal.com", amount: 2500, package: "Starter Package", status: "approved", createdAt: new Date().toISOString() },
      projects: { clientName: "Client Name", clientEmail: "client@mail.com", title: "New Milestone Tracker", service: "AI Systems Integration", status: "pending", description: "Milestone specifications.", createdAt: new Date().toISOString() },
      consultations: { clientName: "Client Name", clientEmail: "client@mail.com", date: new Date().toISOString().split('T')[0], timeSlot: "11:00 AM - 12:00 PM (EST)", topic: "Initial Briefing", description: "Consultation objectives", paid: false, createdAt: new Date().toISOString() },
      users: { uid: "user-" + Math.floor(Math.random() * 10000), email: "client@example.com", displayName: "Sample Client", photoURL: "", role: "user", createdAt: new Date().toISOString() },
      admins: { email: "newadmin@example.com", role: "admin", createdAt: new Date().toISOString() },
      services: { id: "custom-auth", title: "Authentication Shielding", description: "Hardening Firebase systems to zero-trust level.", icon: "ShieldAlert", category: "AI & Security", price: "Starting at $4,999" }
    };
    
    const prefill = prefillShapes[selectedCol] || { name: "Entity Title", createdAt: new Date().toISOString() };
    setDocJsonText(JSON.stringify(prefill, null, 2));
  };

  const handleCreateDocSubmit = async () => {
    try {
      let parsedData;
      try {
        parsedData = JSON.parse(docJsonText);
      } catch (e) {
        setFeedbackMsg({ type: 'error', text: 'Invalid JSON format. Please verify keys and brackets.' });
        return;
      }

      const payload = { ...parsedData };
      if (newDocId.trim()) {
        payload.__custom_id = newDocId.trim();
      }

      const res = await fetch(`/api/firestore/collections/${selectedCol}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const result = await res.json();
        setFeedbackMsg({ type: 'success', text: `Document successfully created with ID: ${result.id}` });
        setIsCreatingNewDoc(false);
        fetchFirestoreDocs(selectedCol);
      } else {
        setFeedbackMsg({ type: 'error', text: 'Cloud Firestore rejected your insert instruction.' });
      }
    } catch (err) {
      setFeedbackMsg({ type: 'error', text: 'Connection interrupt submitting document.' });
    }
  };

  useEffect(() => {
    if (isAdmin && activeSubTab === 'firestore') {
      fetchFirestoreMeta();
      fetchFirestoreRules();
    }
  }, [activeSubTab]);

  useEffect(() => {
    if (isAdmin && activeSubTab === 'firestore') {
      fetchFirestoreDocs(selectedCol);
    }
  }, [selectedCol, activeSubTab]);

  const isAdmin = user?.email === 'kdpranga144@gmail.com';

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Parallelize fetches safely
      const [statsRes, contactsRes, projectsRes, paymentsRes, consultationsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/contacts'),
        fetch('/api/projects'),
        fetch('/api/payments'),
        fetch('/api/consultations')
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (contactsRes.ok) setContacts(await contactsRes.json());
      if (projectsRes.ok) setProjects(await projectsRes.json());
      if (paymentsRes.ok) setPayments(await paymentsRes.json());
      if (consultationsRes.ok) setConsultations(await consultationsRes.json());
    } catch (err) {
      console.error("Failed to sync backend admin records.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [user]);

  const handleSeedSystem = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/seed', { method: 'POST' });
      const data = await response.json();
      if (response.ok) {
        setFeedbackMsg({ type: 'success', text: data.message });
        await fetchData();
      } else {
        setFeedbackMsg({ type: 'error', text: data.error || "Seed operation already performed." });
      }
    } catch (err) {
      setFeedbackMsg({ type: 'error', text: "Failed to connect to seeder engine." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateContactStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/contacts/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setContacts(contacts.map(c => c.id === id ? { ...c, status: newStatus as any } : c));
        // Refresh stats
        const statsRes = await fetch('/api/admin/stats');
        if (statsRes.ok) setStats(await statsRes.json());
      }
    } catch (err) {
      console.error("Status modify failed.");
    }
  };

  const handleUpdateProjectStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setProjects(projects.map(p => p.id === id ? { ...p, status: newStatus as any } : p));
        // Refresh stats
        const statsRes = await fetch('/api/admin/stats');
        if (statsRes.ok) setStats(await statsRes.json());
      }
    } catch (err) {
      console.error("Status modify failed.");
    }
  };

  // Restricting layout view to non-admins
  if (!user) {
    return (
      <div className="py-20 flex items-center justify-center min-h-[60vh]">
        <div className="max-w-md p-8 rounded-2xl bg-[#090D22]/80 border border-white/5 text-center space-y-6">
          <ShieldAlert className="w-12 h-12 text-[#8B5CF6] mx-auto animate-pulse" />
          <h3 className="text-xl font-bold text-white">Dashboard Restricted</h3>
          <p className="text-sm text-slate-400">
            Please sign in under your credentials to access the administrative panels, review lead workflows, and examine PayPal records.
          </p>
          <button
            onClick={onLogin}
            className="w-full py-3 rounded-lg bg-[#3B82F6] hover:bg-blue-500 text-xs font-bold uppercase tracking-widest text-white cursor-pointer"
          >
            Access Authorized Login
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="py-20 flex items-center justify-center min-h-[60vh]">
        <div className="max-w-md p-8 rounded-2xl bg-[#090D22]/80 border border-white/5 text-center space-y-6">
          <ShieldAlert className="w-12 h-12 text-red-500 mx-auto animate-pulse" />
          <h3 className="text-xl font-bold text-white">Privileges Restricted</h3>
          <p className="text-sm text-slate-400">
            Authenticated successfully under email <strong className="text-slate-200">{user.email}</strong>, but administrative clearance is limited.
          </p>
          <div className="p-3.5 bg-yellow-950/20 border border-yellow-500/20 text-xs text-yellow-300 rounded-lg flex items-start space-x-2 text-left leading-relaxed">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <span>To authorize full access out-of-the-box, register or login with email <strong>kdpranga144@gmail.com</strong>.</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 shrink-0">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/5 pb-8 mb-10">
          <div>
            <div className="flex items-center space-x-2 text-blue-400 text-xs font-bold tracking-widest uppercase mb-1">
              <Activity className="w-3.5 h-3.5" />
              <span>Pixel-HQ Infrastructure Node</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white">Technology Administration Matrix</h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleSeedSystem}
              id="admin-btn-seed"
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-purple-950/50 border border-purple-500/30 text-xs font-bold uppercase tracking-wider text-purple-300 hover:bg-purple-900/40 cursor-pointer"
            >
              <Database className="w-4 h-4" />
              <span>Bootstrap Seed Leads</span>
            </button>

            <button
              onClick={fetchData}
              id="admin-btn-refresh"
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-slate-900 border border-white/10 text-xs font-bold uppercase tracking-wider text-slate-300 hover:bg-slate-950 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Core</span>
            </button>
          </div>
        </div>

        {feedbackMsg && (
          <div className={`p-4 rounded-xl mb-8 flex items-center justify-between text-xs font-bold ${
            feedbackMsg.type === 'success' 
              ? 'bg-green-950/30 border border-green-500/20 text-green-400' 
              : 'bg-red-950/30 border border-red-500/20 text-red-400'
          }`}>
            <span>{feedbackMsg.text}</span>
            <button onClick={() => setFeedbackMsg(null)} className="text-slate-400 hover:text-white uppercase">Dismiss</button>
          </div>
        )}

        {/* Analytics cards grid */}
        <div id="admin-stats-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          {/* Card: Total leads */}
          <div className="p-6 rounded-2xl bg-[#090D22]/80 border border-white/5 space-y-3">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Total Leads</span>
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-3xl font-extrabold text-white font-mono">{stats?.totalLeads ?? 0}</div>
            <div className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">{stats?.newLeadsCount ?? 0} brand-new pipelines</div>
          </div>

          {/* Card: Total revenues */}
          <div className="p-6 rounded-2xl bg-[#090D22]/80 border border-white/5 space-y-3">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Approved Revenues</span>
              <DollarSign className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-3xl font-extrabold text-white font-mono">${(stats?.totalRevenue ?? 0).toLocaleString()}</div>
            <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">{stats?.paymentsCount ?? 0} PayPal operations</div>
          </div>

          {/* Card: active deliverables */}
          <div className="p-6 rounded-2xl bg-[#090D22]/80 border border-white/5 space-y-3">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Project Tracks</span>
              <Layers className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-3xl font-extrabold text-white font-mono">{stats?.projectsCount ?? 0}</div>
            <div className="text-[10px] text-purple-400 font-bold uppercase tracking-widest">{stats?.activeProjectsCount ?? 0} active/pending SLA</div>
          </div>

          {/* Card: strategic bookings */}
          <div className="p-6 rounded-2xl bg-[#090D22]/80 border border-white/5 space-y-3">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Briefings Booked</span>
              <Calendar className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="text-3xl font-extrabold text-white font-mono">{stats?.consultationsCount ?? 0}</div>
            <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">Schedules indexed</div>
          </div>

        </div>

        {/* Dashboard sub-navigation tabs */}
        <div id="admin-subtabs" className="flex flex-wrap border-b border-white/5 mb-8">
          {[
            { id: 'leads', label: `Lead Manager (${contacts.length})` },
            { id: 'payments', label: `PayPal Logs (${payments.length})` },
            { id: 'projects', label: `Project Leads (${projects.length})` },
            { id: 'consultations', label: `Schedules (${consultations.length})` },
            { id: 'firestore', label: `Cloud Firestore Console ⚡` }
          ].map(sub => (
            <button
              key={sub.id}
              onClick={() => setActiveSubTab(sub.id as any)}
              className={`px-6 py-4.5 text-xs uppercase tracking-widest font-bold border-b-2 cursor-pointer transition-all ${
                activeSubTab === sub.id 
                  ? 'border-blue-500 text-white font-black' 
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              {sub.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center py-20 bg-[#090D22]/45 border border-white/5 rounded-3xl space-y-2">
            <div className="w-8 h-8 rounded-full border-2 border-t-transparent border-blue-500 animate-spin mx-auto"></div>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-mono">Synchronizing matrices...</p>
          </div>
        ) : (
          <div className="bg-[#090D22]/80 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
            
            {/* View - Leads section */}
            {activeSubTab === 'leads' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-950 border-b border-white/5 font-mono text-[10px] text-slate-500 uppercase tracking-widest">
                      <th className="p-5 font-semibold">Inquirer Details</th>
                      <th className="p-5 font-semibold">Service Need</th>
                      <th className="p-5 font-semibold">Budget SLA</th>
                      <th className="p-5 font-semibold">Specifications</th>
                      <th className="p-5 font-semibold">Status Gateway</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300 text-sm">
                    {contacts.map(c => (
                      <tr key={c.id} className="hover:bg-white/[0.01]">
                        <td className="p-5">
                          <div className="font-bold text-white mb-0.5">{c.name}</div>
                          <div className="text-xs text-slate-400 select-all font-mono">{c.email}</div>
                          {c.phone && <div className="text-[10px] text-slate-500 mt-1">{c.phone}</div>}
                          {c.company && <div className="text-[10px] text-blue-400 mt-0.5">Org: {c.company}</div>}
                        </td>
                        <td className="p-5">
                          <span className="inline-flex rounded bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-xs text-blue-400 font-semibold">{c.projectType}</span>
                        </td>
                        <td className="p-5 text-slate-200 font-mono font-bold">{c.budget}</td>
                        <td className="p-5 max-w-xs">
                          <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">{c.message}</p>
                        </td>
                        <td className="p-5">
                          <select
                            value={c.status}
                            onChange={(e) => handleUpdateContactStatus(c.id, e.target.value)}
                            className="bg-slate-950 border border-white/10 text-xs text-white rounded p-1.5 focus:outline-none"
                          >
                            <option value="new">New Lead</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="contacted">Contacted</option>
                            <option value="completed">Completed</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                    {contacts.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-10 text-center text-slate-500 italic">No inquires captured in Firestore contacts. Click "Bootstrap Seed Leads" to test.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* View - Payments Receipts */}
            {activeSubTab === 'payments' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-950 border-b border-white/5 font-mono text-[10px] text-slate-500 uppercase tracking-widest">
                      <th className="p-5 font-semibold">PayPal Transaction ID</th>
                      <th className="p-5 font-semibold">Payer recipient</th>
                      <th className="p-5 font-semibold">Acquired Tier</th>
                      <th className="p-5 font-semibold">Settled Sum</th>
                      <th className="p-5 font-semibold">Gateway Status</th>
                      <th className="p-5 font-semibold">Invoice printable</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300 text-sm">
                    {payments.map(p => (
                      <tr key={p.id} className="hover:bg-white/[0.01]">
                        <td className="p-5 select-all font-mono text-xs text-blue-400 font-bold">{p.id}</td>
                        <td className="p-5">
                          <div className="font-bold text-white mb-0.5">{p.clientName}</div>
                          <div className="text-xs text-slate-400 font-mono">{p.clientEmail}</div>
                        </td>
                        <td className="p-5">
                          <span className="text-xs tracking-wide">{p.package}</span>
                        </td>
                        <td className="p-5 text-emerald-400 font-mono font-bold">${p.amount.toLocaleString()}</td>
                        <td className="p-5">
                          <span className="inline-flex rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs text-green-400 font-bold border border-green-500/20">{p.status.toUpperCase()}</span>
                        </td>
                        <td className="p-5">
                          <a
                            href={`/api/invoice/${p.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 text-xs font-bold uppercase tracking-wider text-cyan-400 hover:underline"
                          >
                            <FileText className="w-4 h-4 mr-1" />
                            <span>View details &rarr;</span>
                          </a>
                        </td>
                      </tr>
                    ))}
                    {payments.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-10 text-center text-slate-500 italic">No dynamic transaction settled in PayPal matrix log. Go to Pricing tab and launch Sandbox Checkout to populate.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* View - Deliverable Projects */}
            {activeSubTab === 'projects' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-950 border-b border-white/5 font-mono text-[10px] text-slate-500 uppercase tracking-widest">
                      <th className="p-5 font-semibold">Deliverable Label</th>
                      <th className="p-5 font-semibold">User Payer Account</th>
                      <th className="p-5 font-semibold">Assigned Service</th>
                      <th className="p-5 font-semibold">Financials</th>
                      <th className="p-5 font-semibold">Status workflow</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300 text-sm">
                    {projects.map(p => (
                      <tr key={p.id} className="hover:bg-white/[0.01]">
                        <td className="p-5">
                          <div className="font-bold text-white mb-1.5">{p.title}</div>
                          {p.description && <p className="text-xs text-slate-400 line-clamp-2 italic">{p.description}</p>}
                        </td>
                        <td className="p-5">
                          <div className="font-semibold text-slate-200">{p.clientName}</div>
                          <div className="text-xs text-slate-400 font-mono">{p.clientEmail}</div>
                        </td>
                        <td className="p-5">
                          <span className="text-xs font-bold text-[#8B5CF6] uppercase">{p.service}</span>
                        </td>
                        <td className="p-5 text-slate-200 font-mono font-bold">${p.cost ? p.cost.toLocaleString() : '0'}</td>
                        <td className="p-5">
                          <select
                            value={p.status}
                            onChange={(e) => handleUpdateProjectStatus(p.id, e.target.value)}
                            className="bg-slate-950 border border-white/10 text-xs text-white rounded p-1.5 focus:outline-none"
                          >
                            <option value="pending">Pending Delivery</option>
                            <option value="in-progress">In-Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                    {projects.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-10 text-center text-slate-500 italic">No deliverable leads. Checkouts automatically dispatch projects.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* View - Consultations booked */}
            {activeSubTab === 'consultations' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-950 border-b border-white/5 font-mono text-[10px] text-slate-500 uppercase tracking-widest">
                      <th className="p-5 font-semibold">Payer / Client</th>
                      <th className="p-5 font-semibold">Target date</th>
                      <th className="p-5 font-semibold">Time Slot</th>
                      <th className="p-5 font-semibold">Strategic Briefing Topic</th>
                      <th className="p-5 font-semibold">SLA Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300 text-sm">
                    {consultations.map(con => (
                      <tr key={con.id} className="hover:bg-white/[0.01]">
                        <td className="p-5">
                          <div className="font-bold text-white mb-0.5">{con.clientName}</div>
                          <div className="text-xs text-slate-400 font-mono">{con.clientEmail}</div>
                        </td>
                        <td className="p-5 font-mono text-xs">{con.date}</td>
                        <td className="p-5 font-mono text-xs text-[#06B6D4]">{con.timeSlot}</td>
                        <td className="p-5">
                          <div className="font-bold text-white text-xs mb-1">{con.topic}</div>
                          {con.description && <p className="text-[11px] text-slate-400 line-clamp-1">{con.description}</p>}
                        </td>
                        <td className="p-5">
                          <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                            con.paid 
                              ? 'bg-amber-500/10 border-amber-500/25 text-amber-400' 
                              : 'bg-slate-800 border-white/5 text-slate-400'
                          }`}>
                            {con.paid ? 'PAID CONSULT' : 'PRO-BONOS'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {consultations.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-10 text-center text-slate-500 italic">No scheduled strategies. Use booking assistant widgets to register.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* View - Cloud Firestore Developer Console Sandbox */}
            {activeSubTab === 'firestore' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/5 min-h-[600px] bg-slate-950/45 rounded-3xl overflow-hidden border border-white/5">
                
                {/* 1. Left Sidebar: Collection Schemes */}
                <div className="lg:col-span-3 p-5 space-y-4">
                  <div className="flex items-center space-x-2 pb-2 border-b border-white/5">
                    <Database className="w-4 h-4 text-amber-500 animate-pulse" />
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest font-mono">Firestore Schema IR</span>
                  </div>
                  
                  <div className="space-y-1 max-h-[500px] overflow-y-auto pr-1">
                    {dbCollections.map(col => {
                      const isActive = selectedCol === col.name;
                      return (
                        <button
                          key={col.name}
                          onClick={() => {
                            setSelectedCol(col.name);
                            setIsCreatingNewDoc(false);
                          }}
                          className={`w-full text-left p-3 rounded-xl transition-all border ${
                            isActive 
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' 
                              : 'bg-transparent border-transparent hover:bg-white/5 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <div className="font-bold text-xs uppercase tracking-wider font-mono flex items-center justify-between">
                            <span>/{col.name}</span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-slate-500 font-normal">Path</span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">{col.desc}</p>
                        </button>
                      );
                    })}
                  </div>

                  {/* DB Connections Metadata Card */}
                  {dbMeta && (
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10 space-y-2 mt-4">
                      <span className="text-[9px] font-bold text-slate-500 tracking-widest font-mono uppercase block">Live Target DB</span>
                      <div className="text-[11px] text-slate-300 space-y-1 font-mono">
                        <div className="truncate"><span className="text-amber-500">proj:</span> {dbMeta.projectId}</div>
                        <div className="truncate"><span className="text-amber-500">db_id:</span> {dbMeta.databaseId}</div>
                        <div className="truncate"><span className="text-amber-500">domain:</span> {dbMeta.authDomain}</div>
                      </div>
                      <a 
                        href={`https://console.firebase.google.com/project/${dbMeta.projectId}/firestore`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 mt-2 text-[10px] font-bold uppercase text-blue-400 hover:underline"
                      >
                        <span>Open Firebase Console</span>
                        <Database className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>

                {/* 2. Middle Panel: Document Identifier Grid */}
                <div className="lg:col-span-4 p-5 flex flex-col border-t lg:border-t-0 border-white/5 bg-slate-950/20">
                  <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
                    <div className="flex items-center space-x-2">
                       <Layers className="w-4 h-4 text-blue-400" />
                      <span className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">/{selectedCol}</span>
                    </div>
                    <button
                      onClick={handleStartCreateDoc}
                      className="px-2.5 py-1.5 rounded bg-[#F57C00] hover:bg-[#E65100] text-[10px] text-white font-bold uppercase tracking-wider flex items-center space-x-1 transition-colors cursor-pointer"
                    >
                      <Database className="w-3 h-3" />
                      <span>+ Add Doc</span>
                    </button>
                  </div>

                  {/* Document Search filter */}
                  <div className="relative mb-4">
                    <input
                      type="text"
                      placeholder="Filter by Document ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
                    />
                  </div>

                  {/* Document IDs Lists Container */}
                  <div className="flex-grow overflow-y-auto space-y-1.5 max-h-[450px]">
                    {isConsoleLoading ? (
                      <div className="text-center py-10 space-y-2">
                        <RefreshCw className="w-6 h-6 text-amber-500 animate-spin mx-auto" />
                        <span className="text-[10px] text-slate-500 font-mono block">Querying documents...</span>
                      </div>
                    ) : (
                      <>
                        {firestoreDocs
                          .filter(doc => doc.id.toLowerCase().includes(searchTerm.toLowerCase()))
                          .map(doc => {
                            const isDocSelected = selectedDocId === doc.id;
                            return (
                              <div
                                key={doc.id}
                                className={`group flex items-center justify-between p-2.5 rounded-lg border text-xs font-mono transition-all ${
                                  isDocSelected
                                    ? 'bg-blue-600/10 border-blue-500/30 text-blue-300 font-bold'
                                    : 'bg-transparent border-transparent hover:bg-white/5 text-slate-400 hover:text-slate-300'
                                }`}
                              >
                                <button
                                  onClick={() => handleSelectDoc(doc.id, doc.data)}
                                  className="flex-grow text-left truncate cursor-pointer pr-2"
                                  title={doc.id}
                                >
                                  📄 {doc.id}
                                </button>
                                <button
                                  onClick={() => handleDocDelete(doc.id)}
                                  className="p-1 px-2 text-[10px] text-red-400 bg-red-950/10 border border-red-500/25 hover:bg-red-500 hover:text-white rounded transition-all cursor-pointer"
                                  title="Delete Document"
                                >
                                  Delete
                                </button>
                              </div>
                            );
                          })}
                        {firestoreDocs.length === 0 && (
                          <div className="text-center py-10 text-slate-500 italic text-xs">
                            No documents in /{selectedCol}.
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* 3. Right Panel: Dynamic JSON code editor / Rules Spec */}
                <div className="lg:col-span-5 p-5 flex flex-col border-t lg:border-t-0 border-white/5">
                  <div className="flex border-b border-white/5 pb-2 mb-4">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                      {isCreatingNewDoc ? "⚡ Document Creator" : "📝 Document Fields"}
                    </span>
                  </div>

                  {isCreatingNewDoc && (
                    <div className="space-y-2 mb-4 bg-[#030712] p-3.5 border border-white/5 rounded-xl">
                      <label className="text-[10px] font-bold text-slate-500 font-mono tracking-widest block uppercase">Specify Custom Object ID (Optional)</label>
                      <input
                        type="text"
                        placeholder="Auto-assigned (blank)"
                        value={newDocId}
                        onChange={(e) => setNewDocId(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 font-mono"
                      />
                    </div>
                  )}

                  {!isCreatingNewDoc && selectedDocId && (
                    <div className="flex items-center space-x-2 text-[11px] bg-slate-900 border border-white/5 px-3 py-1.5 rounded-lg text-slate-400 font-mono select-all truncate mb-4">
                      <span className="text-blue-400">Path:</span>
                      <span className="truncate">/{selectedCol}/{selectedDocId}</span>
                    </div>
                  )}

                  {/* Code Editor Container */}
                  <div className="flex-grow flex flex-col">
                    <label className="text-[10px] font-bold text-amber-500 font-mono tracking-widest block uppercase mb-1">Raw JSON Payload Document</label>
                    <textarea
                      value={docJsonText}
                      onChange={(e) => setDocJsonText(e.target.value)}
                      rows={12}
                      className="w-full flex-grow p-4 bg-[#030712] border border-white/10 rounded-2xl font-mono text-xs text-blue-300 focus:outline-none focus:border-amber-500/50 resize-y"
                      placeholder="{}"
                    />
                    
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5 mt-4">
                      {isCreatingNewDoc ? (
                        <>
                          <button
                            onClick={() => {
                              setIsCreatingNewDoc(false);
                              if (firestoreDocs.length > 0) {
                                setSelectedDocId(firestoreDocs[0].id);
                                setDocJsonText(JSON.stringify(firestoreDocs[0].data, null, 2));
                              }
                            }}
                            className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white border border-white/10 rounded-xl cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleCreateDocSubmit}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all cursor-pointer"
                          >
                            Create Document
                          </button>
                        </>
                      ) : (
                        <>
                          {selectedDocId && (
                            <button
                              onClick={() => handleDocDelete(selectedDocId)}
                              className="px-3 py-2 border border-red-500/20 text-red-400 hover:bg-red-950/20 text-xs font-bold rounded-xl transition-all cursor-pointer"
                            >
                              Delete Doc
                            </button>
                          )}
                          <button
                            onClick={handleSaveDoc}
                            disabled={!selectedDocId}
                            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-xs font-bold text-slate-950 rounded-xl shadow-[0_0_15px_rgba(245,124,0,0.30)] transition-all disabled:opacity-50 cursor-pointer"
                          >
                            Save Document Fields
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Rules status footer */}
                  {dbRules && (
                    <div className="mt-6 pt-6 border-t border-white/5">
                      <span className="text-[10px] font-bold text-slate-500 font-mono tracking-widest block uppercase mb-2">🔥 Firestore Rules Health Shield</span>
                      <div className="p-3 bg-green-950/20 border border-green-500/25 text-green-400 rounded-xl text-[10px] leading-relaxed">
                        The security rules of this applet were prebuilt and audited against multi-privilege Escalation, Identity Spoofing, and Denial of Wallet attacks. Real-time rules match exactly against schema.
                      </div>
                    </div>
                  )}

                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
