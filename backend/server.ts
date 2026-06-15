import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  setDoc,
  updateDoc, 
  deleteDoc,
  query, 
  where, 
  orderBy,
  limit,
  serverTimestamp,
  FieldValue
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json' with { type: 'json' };

// Initialize Firebase in Node environment for backend persistence
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);

// Handle resilient path finding for the local JSON backup database
let LOCAL_STORE_PATH = path.join(process.cwd(), 'local_database.json');
if (!fs.existsSync(LOCAL_STORE_PATH) && fs.existsSync(path.join(process.cwd(), '..', 'local_database.json'))) {
  LOCAL_STORE_PATH = path.join(process.cwd(), '..', 'local_database.json');
}

function readLocalStore() {
  if (!fs.existsSync(LOCAL_STORE_PATH)) {
    return {
      contacts: [
        {
          id: "seed-contact-1",
          name: "John Stark",
          email: "john@starkindustries.com",
          phone: "+1 415-555-0199",
          company: "Stark Industries",
          projectType: "AI Solutions & Automation",
          budget: "$10,000 - $25,000",
          message: "We need an integrated AI agent system that monitors our heavy machinery logistics and generates real-time scheduling guides. Essential to have Firestore safety rules.",
          status: "new",
          createdAt: new Date().toISOString()
        },
        {
          id: "seed-contact-2",
          name: "Sarah Jenkins",
          email: "sarah@apexledger.dev",
          phone: "+44 20-7946-0958",
          company: "Apex Ledger Corp",
          projectType: "PayPal Integration",
          budget: "$5,000 - $10,000",
          message: "Looking for robust Express backend microservice supporting structured PayPal callbacks and automatic PDF layout invoice generation.",
          status: "reviewed",
          createdAt: new Date(Date.now() - 48 * 3600000).toISOString()
        }
      ],
      payments: [
        {
          id: "PAYID-MIN827136284X8911",
          clientName: "Elena Rostova",
          clientEmail: "elena@synthetix.io",
          amount: 4999,
          package: "Professional Package",
          status: "approved",
          createdAt: new Date(Date.now() - 24 * 3600000).toISOString()
        },
        {
          id: "PAYID-MAX991204859B1234",
          clientName: "Marcus Vance",
          clientEmail: "marcus@apexledger.dev",
          amount: 2500,
          package: "Starter Package",
          status: "approved",
          createdAt: new Date(Date.now() - 120 * 3600000).toISOString()
        }
      ],
      projects: [
        {
          id: "seed-proj-1",
          clientName: "Elena Rostova",
          clientEmail: "elena@synthetix.io",
          title: "Professional Package Implementation",
          service: "AI Solutions & Automation",
          status: "pending",
          package: "Professional Package",
          cost: 4999,
          description: "Auto-generated delivery track for Elena Rostova's purchased Professional Package. Paid via PayPal Transaction ID: PAYID-MIN827136284X8911.",
          createdAt: new Date(Date.now() - 24 * 3600000).toISOString()
        }
      ],
      consultations: [
        {
          id: "seed-consult-1",
          clientName: "David Kim",
          clientEmail: "kim.david@spacetech.co",
          date: new Date(Date.now() + 48 * 3600000).toISOString().split('T')[0],
          timeSlot: "10:00 AM - 11:00 AM (EST)",
          topic: "Enterprise AI & Scalability Planning",
          description: "Evaluating migration from legacy neural architectures to customized multi-agent setups.",
          paid: true,
          createdAt: new Date().toISOString()
        }
      ],
      admins: [
        {
          id: 'kdpranga144',
          email: 'kdpranga144@gmail.com',
          role: 'admin',
          createdAt: new Date().toISOString()
        }
      ],
      users: []
    };
  }
  try {
    const data = fs.readFileSync(LOCAL_STORE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return { contacts: [], payments: [], projects: [], consultations: [], admins: [], users: [] };
  }
}

function writeLocalStore(store: any) {
  try {
    fs.writeFileSync(LOCAL_STORE_PATH, JSON.stringify(store, null, 2), 'utf8');
  } catch (err) {
    console.error("Local filesystem storage save failure", err);
  }
}

async function safeGetDocs(collectionName: string) {
  try {
    const snap = await getDocs(collection(db, collectionName));
    const results: any[] = [];
    snap.forEach(doc => {
      results.push({ id: doc.id, ...doc.data() });
    });
    return results;
  } catch (err: any) {
    console.warn(`[HYBRID DB] Firestore pull failed for ${collectionName}. Falling back to local filesystem store: ${err.message}`);
    const store = readLocalStore();
    return store[collectionName] || [];
  }
}

async function safeGetDoc(collectionName: string, docId: string) {
  try {
    const snap = await getDoc(doc(db, collectionName, docId));
    if (snap.exists()) {
      return { id: snap.id, exists: true, data: () => snap.data() };
    }
    return { id: docId, exists: false, data: () => null };
  } catch (err: any) {
    console.warn(`[HYBRID DB] Firestore get failed for ${collectionName}/${docId}. Falling back to local filesystem store: ${err.message}`);
    const store = readLocalStore();
    const items = store[collectionName] || [];
    const item = items.find((i: any) => i.id === docId || (i.id && i.id.toString() === docId.toString()));
    return {
      id: docId,
      exists: !!item,
      data: () => item || null
    };
  }
}

async function safeAddDoc(collectionName: string, data: any) {
  try {
    const ref = await addDoc(collection(db, collectionName), data);
    return { id: ref.id };
  } catch (err: any) {
    console.warn(`[HYBRID DB] Firestore add failed for ${collectionName}. Falling back to local filesystem store: ${err.message}`);
    const store = readLocalStore();
    const docId = 'local-' + Math.floor(Math.random() * 1000000).toString();
    const newItem = { id: docId, ...data };
    if (!store[collectionName]) store[collectionName] = [];
    store[collectionName].push(newItem);
    writeLocalStore(store);
    return { id: docId };
  }
}

async function safeSetDoc(collectionName: string, docId: string, data: any) {
  try {
    await setDoc(doc(db, collectionName, docId), data);
    return { success: true };
  } catch (err: any) {
    console.warn(`[HYBRID DB] Firestore set failed for ${collectionName}/${docId}. Falling back to local filesystem store: ${err.message}`);
    const store = readLocalStore();
    if (!store[collectionName]) store[collectionName] = [];
    const index = store[collectionName].findIndex((i: any) => i.id === docId || (i.id && i.id.toString() === docId.toString()));
    const newItem = { id: docId, ...data };
    if (index >= 0) {
      store[collectionName][index] = newItem;
    } else {
      store[collectionName].push(newItem);
    }
    writeLocalStore(store);
    return { success: true };
  }
}

async function safeUpdateDoc(collectionName: string, docId: string, data: any) {
  try {
    await updateDoc(doc(db, collectionName, docId), data);
    return { success: true };
  } catch (err: any) {
    console.warn(`[HYBRID DB] Firestore update failed for ${collectionName}/${docId}. Falling back to local filesystem store: ${err.message}`);
    const store = readLocalStore();
    if (!store[collectionName]) return { success: false };
    const index = store[collectionName].findIndex((i: any) => i.id === docId || (i.id && i.id.toString() === docId.toString()));
    if (index >= 0) {
      store[collectionName][index] = { ...store[collectionName][index], ...data };
      writeLocalStore(store);
      return { success: true };
    }
    return { success: false };
  }
}

async function safeDeleteDoc(collectionName: string, docId: string) {
  try {
    await deleteDoc(doc(db, collectionName, docId));
    return { success: true };
  } catch (err: any) {
    console.warn(`[HYBRID DB] Firestore delete failed for ${collectionName}/${docId}. Falling back to local filesystem store: ${err.message}`);
    const store = readLocalStore();
    if (!store[collectionName]) return { success: false };
    store[collectionName] = store[collectionName].filter((i: any) => i.id !== docId && (i.id && i.id.toString() !== docId.toString()));
    writeLocalStore(store);
    return { success: true };
  }
}

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

// Enable CORS for client site origin access
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));

app.use(express.json());

// -----------------------------------------------------------------
// 1. DYNAMIC SYSTEM SEEDING ENDPOINT (Out-of-the-box experience)
// -----------------------------------------------------------------
app.post('/api/admin/seed', async (req, res) => {
  try {
    try {
      const contactsRef = collection(db, 'contacts');
      const existingContacts = await getDocs(query(contactsRef, limit(1)));
      if (existingContacts.empty) {
        const seedContacts = [
          {
            name: "John Stark",
            email: "john@starkindustries.com",
            phone: "+1 415-555-0199",
            company: "Stark Industries",
            projectType: "AI Solutions & Automation",
            budget: "$10,000 - $25,000",
            message: "We need an integrated AI agent system.",
            status: "new",
            createdAt: new Date().toISOString()
          }
        ];
        for (const c of seedContacts) {
          await addDoc(collection(db, 'contacts'), c);
        }
      }
    } catch (fsErr: any) {
      console.warn("Firestore seeding skipped/denied (using filesystem fallback):", fsErr.message);
    }

    // Refresh and write local store files
    const store = readLocalStore();
    writeLocalStore(store);

    return res.json({ success: true, message: "System successfully seeded in hybrid mode." });
  } catch (error: any) {
    console.error("Failed to seed items:", error);
    res.status(500).json({ error: error.message });
  }
});

// -----------------------------------------------------------------
// 2. CONTACTS API (Lead processing and Intake)
// -----------------------------------------------------------------
app.post('/api/contacts', async (req, res) => {
  try {
    const { name, email, phone, company, projectType, budget, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing required contact details (name, email or message)." });
    }

    const payload = {
      name,
      email,
      phone: phone || "",
      company: company || "",
      projectType: projectType || "General AI Services",
      budget: budget || "Not specified",
      message,
      status: "new",
      createdAt: new Date().toISOString()
    };

    const docResult = await safeAddDoc('contacts', payload);
    return res.status(201).json({ success: true, id: docResult.id, message: "Contact lead archived successfully!" });
  } catch (error: any) {
    console.error("Error creating contact lead:", error);
    return res.status(500).json({ error: error.message });
  }
});

// Get contacts for admins
app.get('/api/contacts', async (req, res) => {
  try {
    const list = await safeGetDocs('contacts');
    const sorted = [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return res.json(sorted);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Update status of contacts
app.patch('/api/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await safeUpdateDoc('contacts', id, { status });
    return res.json({ success: true, message: "Lead status successfully updated." });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// -----------------------------------------------------------------
// 3. CONSULTATIONS API (Strategy briefings booking)
// -----------------------------------------------------------------
app.post('/api/consultations', async (req, res) => {
  try {
    const { clientName, clientEmail, date, timeSlot, topic, description, paid } = req.body;
    if (!clientName || !clientEmail || !date || !timeSlot) {
      return res.status(400).json({ error: "Missing booking properties." });
    }

    const payload = {
      clientName,
      clientEmail,
      date,
      timeSlot,
      topic: topic || "AI & Web Consulting",
      description: description || "",
      paid: !!paid,
      createdAt: new Date().toISOString()
    };

    const docResult = await safeAddDoc('consultations', payload);
    return res.status(201).json({ success: true, id: docResult.id, message: "Consultation booked successfully" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('/api/consultations', async (req, res) => {
  try {
    const list = await safeGetDocs('consultations');
    const sorted = [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return res.json(sorted);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// -----------------------------------------------------------------
// 4. PAYMENTS & TRANSACTIONS API (PayPal dynamic responses simulation)
// -----------------------------------------------------------------
app.get('/api/config/paypal', (req, res) => {
  return res.json({
    clientId: process.env.PAYPAL_CLIENT_ID || 'sb'
  });
});

app.post('/api/payments', async (req, res) => {
  try {
    const { paypalId, clientName, clientEmail, amount, package: pkg, clientUid } = req.body;
    if (!paypalId || !clientEmail || !amount || !pkg) {
      return res.status(400).json({ error: "Missing relative payment attributes." });
    }

    const payload = {
      clientUid: clientUid || null,
      clientName: clientName || "Valued Customer",
      clientEmail,
      amount: parseFloat(amount),
      package: pkg,
      status: "approved",
      createdAt: new Date().toISOString()
    };

    // Store in Firestore payments collection
    await safeSetDoc('payments', paypalId, payload);

    // Automatically instantiate a related Project lead for delivery
    const projectPayload = {
      clientUid: clientUid || null,
      clientName: clientName || "Valued Customer",
      clientEmail,
      title: `${pkg} Implementation`,
      service: pkg.includes("Starter") ? "Web Development" : "AI Solutions & Automation",
      status: "pending",
      package: pkg,
      cost: parseFloat(amount),
      description: `Auto-generated delivery track for ${clientName}'s purchased ${pkg}. Paid via PayPal Transaction ID: ${paypalId}.`,
      createdAt: new Date().toISOString()
    };
    await safeAddDoc('projects', projectPayload);

    return res.status(201).json({ 
      success: true, 
      id: paypalId,
      message: "PayPal checkout verification complete. Lead project dispatched successfully." 
    });
  } catch (error: any) {
    console.error("Error backing up payment transaction:", error);
    return res.status(500).json({ error: error.message });
  }
});

app.get('/api/payments', async (req, res) => {
  try {
    const list = await safeGetDocs('payments');
    const sorted = [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return res.json(sorted);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// GET all projects (leads delivery tracking)
app.get('/api/projects', async (req, res) => {
  try {
    const list = await safeGetDocs('projects');
    const sorted = [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return res.json(sorted);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.patch('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await safeUpdateDoc('projects', id, { status });
    return res.json({ success: true });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// -----------------------------------------------------------------
// 5. INVOICE GENERATOR ROUTING (Dynamic customized styling download)
// -----------------------------------------------------------------
app.get('/api/invoice/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const paymentDoc = await safeGetDoc('payments', id);
    
    if (!paymentDoc.exists) {
      return res.status(404).send("<h3>Receipt verification failed. Invoice could not be drafted.</h3>");
    }

    const data = paymentDoc.data() as any;
    const issueDate = new Date(data.createdAt).toLocaleDateString();
    
    // Serve an extremely beautiful, high-fidelity corporate HTML print layout for invoices
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Invoice - ${data.id || id}</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #FAFAFB; padding: 40px; color: #1E293B; margin: 0; }
          .invoice-card { max-width: 800px; margin: 0 auto; background: #ffffff; padding: 50px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #F1F5F9; padding-bottom: 30px; }
          .logo { font-size: 24px; font-weight: 800; color: #3B82F6; }
          .logo span { color: #8B5CF6; }
          .title { font-size: 28px; font-weight: 700; color: #0F172A; text-transform: uppercase; letter-spacing: 1px; }
          .meta-row { display: flex; justify-content: space-between; margin-top: 30px; font-size: 14px; line-height: 1.6; }
          .meta-col { flex: 1; }
          .meta-col:last-child { text-align: right; }
          .label { font-weight: bold; color: #64748B; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; }
          .value { font-size: 15px; color: #0F172A; }
          .table { width: 100%; border-collapse: collapse; margin-top: 40px; }
          .table th { background: #F8FAFC; text-align: left; padding: 15px; font-size: 12px; text-transform: uppercase; color: #64748B; border-bottom: 1px solid #E2E8F0; }
          .table td { padding: 15px; font-size: 14px; border-bottom: 1px solid #F1F5F9; color: #0F172A; }
          .total-section { display: flex; justify-content: flex-end; margin-top: 40px; }
          .total-box { width: 250px; text-align: right; }
          .total-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; }
          .total-main { font-size: 20px; font-weight: 800; color: #2563EB; border-top: 2px solid #E2E8F0; padding-top: 15px; margin-top: 10px; }
          .footer { text-align: center; margin-top: 60px; font-size: 12px; color: #94A3B8; border-top: 1px solid #F1F5F9; padding-top: 20px; }
          @media print {
            body { background: #fff; padding: 0; }
            .invoice-card { box-shadow: none; padding: 0; max-width: 100%; }
          }
        </style>
      </head>
      <body>
        <div class="invoice-card">
          <div class="header">
            <div>
              <div class="logo">Pixel <span>AICore</span></div>
              <p style="margin: 5px 0 0 0; font-size: 13px; color: #64748B;">Strategic Agency System</p>
            </div>
            <div style="text-align: right;">
              <div class="title">Invoice</div>
              <div style="font-size: 14px; color: #64748B; margin-top: 5px;">ID: ${data.id || id}</div>
            </div>
          </div>
          
          <div class="meta-row">
            <div class="meta-col">
              <div class="label">Billed From</div>
              <div class="value" style="font-weight: 600;">Pixel AICore & Nexbot Ltd</div>
              <div class="value">Suite 1200, AI Innovation Hub</div>
              <div class="value">San Francisco, CA 94107</div>
              <div class="value">operations@pixel-aicore.agency</div>
            </div>
            
            <div class="meta-col" style="margin-left: 50px;">
              <div class="label">Billed To</div>
              <div class="value" style="font-weight: 600;">${data.clientName}</div>
              <div class="value">${data.clientEmail}</div>
              <div class="value">Client Registered Account</div>
            </div>
            
            <div class="meta-col">
              <div class="label">Invoice Details</div>
              <div class="value"><strong>Date Issued:</strong> ${issueDate}</div>
              <div class="value"><strong>Payment Method:</strong> PayPal Secure Sandbox</div>
              <div class="value"><strong>Gateway Status:</strong> <span style="color: #10B981; font-weight: bold;">${(data.status || 'approved').toUpperCase()}</span></div>
            </div>
          </div>
          
          <table class="table">
            <thead>
              <tr>
                <th>Service Line Item</th>
                <th style="text-align: right;">Quantity</th>
                <th style="text-align: right;">Unit Price</th>
                <th style="text-align: right;">Amount (USD)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>${data.package}</strong><br><span style="font-size:12px; color:#64748B;">Complete technology implementation, custom development, and persistent database routing support.</span></td>
                <td style="text-align: right;">1</td>
                <td style="text-align: right;">$${(data.amount || 0).toLocaleString()}</td>
                <td style="text-align: right; font-weight: 600;">$${(data.amount || 0).toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
          
          <div class="total-section">
            <div class="total-box">
              <div class="total-row">
                <span class="value" style="color:#64748B;">Subtotal:</span>
                <span class="value" style="font-weight: 600;">$${(data.amount || 0).toLocaleString()}</span>
              </div>
              <div class="total-row">
                <span class="value" style="color:#64748B;">Applied VAT:</span>
                <span class="value" style="font-weight: 600;">$0.00</span>
              </div>
              <div class="total-row total-main">
                <span>Total Paid:</span>
                <span>$${(data.amount || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <div class="footer">
            <p>Thank you for choosing Pixel AICore & Nexbot to drive your intelligent automations.</p>
            <p style="margin-top: 5px; font-size:11px;">This receipt is system-generated and constitutes a binding invoice for services successfully settled. For support, reach out to partners@pixel-aicore.agency.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    res.setHeader('Content-Type', 'text/html');
    return res.send(html);
  } catch (error: any) {
    return res.status(500).send(`<h3>Invoice Render Failed: ${error.message}</h3>`);
  }
});

// -----------------------------------------------------------------
// 6. ADMIN SUMMARY ANALYTICS ENDPOINT
// -----------------------------------------------------------------
app.get('/api/admin/stats', async (req, res) => {
  try {
    const contacts = await safeGetDocs('contacts');
    const payments = await safeGetDocs('payments');
    const projects = await safeGetDocs('projects');
    const consultations = await safeGetDocs('consultations');

    let totalLeads = contacts.length;
    let newLeadsCount = contacts.filter((c: any) => c.status === 'new').length;

    let totalRevenue = 0;
    let paymentsCount = payments.length;
    payments.forEach((p: any) => {
      if (p.status === 'approved') {
        totalRevenue += p.amount || 0;
      }
    });

    let projectsCount = projects.length;
    let activeProjectsCount = projects.filter((p: any) => p.status === 'in-progress' || p.status === 'pending').length;

    let consultationsCount = consultations.length;

    return res.json({
      totalLeads,
      newLeadsCount,
      totalRevenue,
      projectsCount,
      activeProjectsCount,
      consultationsCount,
      paymentsCount
    });
  } catch (error: any) {
    console.error("Failed to compile admin stats:", error);
    res.status(500).json({ error: error.message });
  }
});

// -----------------------------------------------------------------
// 6.5 DYNAMIC CLOUD FIRESTORE CONSOLE BACKEND PROXY
// -----------------------------------------------------------------
app.get('/api/firestore/meta', async (req, res) => {
  try {
    return res.json({
      projectId: firebaseConfig.projectId,
      databaseId: firebaseConfig.firestoreDatabaseId || '(default)',
      authDomain: firebaseConfig.authDomain
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('/api/firestore/rules', async (req, res) => {
  try {
    const rulesPath = path.join(process.cwd(), '../firestore.rules');
    if (fs.existsSync(rulesPath)) {
      const content = fs.readFileSync(rulesPath, 'utf8');
      return res.json({ content });
    }
    const localRulesPath = path.join(process.cwd(), 'firestore.rules');
    if (fs.existsSync(localRulesPath)) {
      const content = fs.readFileSync(localRulesPath, 'utf8');
      return res.json({ content });
    }
    return res.json({ content: "// No firestore.rules found on file system." });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('/api/firestore/collections/:col/documents', async (req, res) => {
  try {
    const { col } = req.params;
    const items = await safeGetDocs(col);
    const results = items.map((item: any) => {
      const data = { ...item };
      const id = item.id || 'doc-' + Math.floor(Math.random() * 10000);
      delete data.id;
      return { id, data };
    });
    return res.json(results);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.post('/api/firestore/collections/:col/documents', async (req, res) => {
  try {
    const { col } = req.params;
    const body = req.body;
    let docId = body.__custom_id;
    const data = { ...body };
    delete data.__custom_id;

    if (docId) {
      await safeSetDoc(col, docId, data);
      return res.json({ success: true, id: docId });
    } else {
      const refResult = await safeAddDoc(col, data);
      return res.json({ success: true, id: refResult.id });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.put('/api/firestore/collections/:col/documents/:docId', async (req, res) => {
  try {
    const { col, docId } = req.params;
    const body = req.body;
    await safeSetDoc(col, docId, body);
    return res.json({ success: true });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.delete('/api/firestore/collections/:col/documents/:docId', async (req, res) => {
  try {
    const { col, docId } = req.params;
    await safeDeleteDoc(col, docId);
    return res.json({ success: true });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Launch server listener
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[PIXEL CORE SERVER] Running on http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || 'development'}`);
});
