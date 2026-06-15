import React, { useState } from 'react';
import { PRICING_TICKETS } from '../data';
import { Check, Star, Shield, HelpCircle, ArrowRight, Sparkles, CreditCard, Clock, FileText } from 'lucide-react';
import { auth, FirebaseUser } from '../firebase';

declare global {
  interface Window {
    paypal?: any;
  }
}

interface PricingViewProps {
  user: FirebaseUser | null;
  onSelectContactSales: (pkgName: string) => void;
}


export default function PricingView({ user, onSelectContactSales }: PricingViewProps) {
  const [selectedPkg, setSelectedPkg] = useState<any | null>(null);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [checkoutTab, setCheckoutTab] = useState<'paypal' | 'sandbox'>('paypal');
  
  // Checkout status
  const [payerName, setPayerName] = useState('');
  const [payerEmail, setPayerEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successTx, setSuccessTx] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // PayPal JS SDK status
  const [paypalReady, setPaypalReady] = useState(false);
  const [clientId, setClientId] = useState('');

  React.useEffect(() => {
    if (user) {
      setPayerName(user.displayName || '');
      setPayerEmail(user.email || '');
    }
  }, [user]);

  // PayPal active configuration & script injection load
  React.useEffect(() => {
    if (checkoutModalOpen && !clientId) {
      fetch('/api/config/paypal')
        .then(res => res.json())
        .then(data => {
          const fetchedId = data.clientId || 'sb';
          setClientId(fetchedId);
          
          const scriptId = 'paypal-js-sdk';
          let script = document.getElementById(scriptId) as HTMLScriptElement;
          
          if (script) {
            if (!script.src.includes(`client-id=${fetchedId}`)) {
              script.remove();
              script = null as any;
            }
          }
          
          if (!script) {
            script = document.createElement('script');
            script.id = scriptId;
            script.src = `https://www.paypal.com/sdk/js?client-id=${fetchedId}&currency=USD&intent=capture`;
            script.async = true;
            script.onload = () => setPaypalReady(true);
            script.onerror = () => {
              console.error("PayPal Smart Buttons SDK loading failed.");
              setPaypalReady(false);
              setErrorMsg("Failed to initialize PayPal Payment system. Use manual gateway instead.");
            };
            document.body.appendChild(script);
          } else {
            setPaypalReady(true);
          }
        })
        .catch(err => {
          console.error("Failed loading PayPal Client parameters", err);
          setClientId('sb');
          setPaypalReady(true);
        });
    }
  }, [checkoutModalOpen, clientId]);

  // PayPal Smart Button render mounting hook
  React.useEffect(() => {
    if (checkoutModalOpen && selectedPkg && paypalReady && window.paypal && checkoutTab === 'paypal' && !successTx) {
      // Small timeout to guarantee container is fully painted by React DOM
      const renderTimer = setTimeout(() => {
        const container = document.getElementById('paypal-button-container');
        if (container) {
          container.innerHTML = '';
          try {
            window.paypal.Buttons({
              style: {
                layout: 'vertical',
                color: 'gold',
                shape: 'rect',
                label: 'pay'
              },
              createOrder: (data: any, actions: any) => {
                return actions.order.create({
                  purchase_units: [{
                    amount: {
                      currency_code: 'USD',
                      value: selectedPkg.price.toString()
                    },
                    description: `Pixel AICore - ${selectedPkg.name} Service Implementation`
                  }]
                });
              },
              onApprove: async (data: any, actions: any) => {
                setIsSubmitting(true);
                setErrorMsg(null);
                try {
                  const order = await actions.order.capture();
                  const response = await fetch('/api/payments', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      paypalId: order.id,
                      clientName: `${order.payer?.name?.given_name || ''} ${order.payer?.name?.surname || ''}`.trim() || payerName || 'Valued Client',
                      clientEmail: order.payer?.email_address || payerEmail || 'billing@paypal.com',
                      amount: selectedPkg.price,
                      package: selectedPkg.name,
                      clientUid: user?.uid || null
                    })
                  });

                  const resData = await response.json();
                  if (response.ok) {
                    setSuccessTx(order.id);
                  } else {
                    setErrorMsg(resData.error || "Order metadata synchronization failed.");
                  }
                } catch (err: any) {
                  console.error("Failed to capture PayPal transaction details.", err);
                  setErrorMsg("PayPal capture sequence error: " + err.message);
                } finally {
                  setIsSubmitting(false);
                }
              },
              onError: (err: any) => {
                console.error("PayPal Payment Gate error", err);
                setErrorMsg("An error occurred during payment processing. Please ensure your sandbox accounts are initialized.");
              }
            }).render('#paypal-button-container');
          } catch (err: any) {
            console.error("PayPal Button Mount failure", err);
          }
        }
      }, 100);
      return () => clearTimeout(renderTimer);
    }
  }, [checkoutModalOpen, selectedPkg, paypalReady, checkoutTab, successTx]);

  const handleOpenCheckout = (pkg: any) => {
    setSelectedPkg(pkg);
    setSuccessTx(null);
    setErrorMsg(null);
    setCheckoutModalOpen(true);
    setCheckoutTab('paypal');
  };

  const handleSimulatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payerName || !payerEmail) {
      setErrorMsg("Please specify payment billing information.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    // Generate simulated PayPal transaction reference code
    const generatedPaypalId = `PAYID-LPX${Math.floor(100000 + Math.random() * 900000)}B${Math.floor(1000 + Math.random() * 9000)}X`;

    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paypalId: generatedPaypalId,
          clientName: payerName,
          clientEmail: payerEmail,
          amount: selectedPkg.price,
          package: selectedPkg.name,
          clientUid: user?.uid || null
        })
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessTx(generatedPaypalId);
      } else {
        setErrorMsg(data.error || "PayPal payment settlement failed.");
      }
    } catch (err: any) {
      setErrorMsg("Failed to communicate with authorization server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="pricing-section" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 rounded-full border border-blue-500/30 bg-blue-950/20 px-3 py-1 text-xs text-blue-300 font-semibold mb-4 tracking-wider uppercase">
            <span>Guaranteed Production SLAs</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-6">
            Transparent Scaling & Plans
          </h2>
          <p className="text-base sm:text-lg text-slate-400">
            Secure flexible terms and bulletproof development packages backed by automated delivery pipelines and continuous administrative support.
          </p>
        </div>

        {/* Pricing Layout Cards Container */}
        <div id="pricing-grid" className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-8">
          {PRICING_TICKETS.map((ticket) => {
            const isPopular = ticket.popular;
            return (
              <div
                key={ticket.name}
                id={`pricing-card-${ticket.name.toLowerCase().replace(/\s+/g, '-')}`}
                className={`relative flex flex-col justify-between p-8 rounded-3xl bg-white/[0.03] backdrop-blur-xl hover:bg-white/[0.04] border ${
                  isPopular 
                    ? 'border-purple-500/80 shadow-[0_0_30px_rgba(139,92,246,0.35)]' 
                    : 'border-white/10'
                } hover:border-blue-500/50 transition-all duration-300 scale-100 hover:scale-[1.01]`}
              >
                {/* Popular Badge banner */}
                {isPopular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center space-x-1.5 rounded-full bg-purple-600 px-4 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-md">
                    <Star className="w-3.5 h-3.5 fill-white text-white" />
                    <span>Most Requested</span>
                  </span>
                )}

                <div>
                  {/* Package Name and subtitler */}
                  <h3 className="text-2xl font-bold text-white mb-2">{ticket.name}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-6">{ticket.subtitle}</p>

                  {/* Price display tag */}
                  <div className="flex items-baseline mb-8">
                    <span className="text-4xl sm:text-5xl font-extrabold text-white font-mono">
                      ${ticket.price.toLocaleString()}
                    </span>
                    <span className="text-sm font-semibold text-slate-500 ml-2">/ flat rate</span>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-4 mb-10 border-t border-white/5 pt-8">
                    {ticket.features.map((feat) => (
                      <li key={feat} className="flex items-start text-sm text-slate-300">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mr-3 mt-1.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pricing Actions */}
                <div className="space-y-3">
                  <button
                    id={`btn-pricing-checkout-${ticket.name.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => handleOpenCheckout(ticket)}
                    className={`w-full py-3.5 rounded-xl text-center font-bold text-xs uppercase tracking-widest cursor-pointer hover:scale-[1.01] transition-transform ${
                      isPopular 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:brightness-110 text-white' 
                        : 'bg-white hover:bg-slate-200 text-slate-900'
                    }`}
                  >
                    PayPal Express Checkout
                  </button>
                  <button
                    id={`btn-pricing-sales-${ticket.name.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => onSelectContactSales(ticket.name)}
                    className="w-full py-3 rounded-xl text-center text-xs font-bold text-slate-400 hover:text-white uppercase tracking-wider hover:bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
                  >
                    Contact Strategy Partners
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Extended Security Guarantee Notice */}
        <div className="mt-16 bg-white/[0.03] border border-white/10 p-6 rounded-3xl backdrop-blur-xl hover:border-blue-500/50 transition-all duration-300 flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-4">
          <div className="flex items-center space-x-3 text-slate-300 text-sm">
            <Shield className="w-5 h-5 text-blue-400 shrink-0" />
            <span><strong>Secure Escrow Protection:</strong> Payments are processed via secure simulation protocols. Fully verifiable dynamic invoice details will be delivered instantly upon processing.</span>
          </div>
          <a href="#site-header" onClick={() => onSelectContactSales("Enterprise Project Setup")} className="text-xs font-bold uppercase tracking-widest text-[#3B82F6] hover:underline whitespace-nowrap">
            Schedule Briefing &rarr;
          </a>
        </div>

      </div>

      {/* RENDER PAYPAL SIMULATION MODAL BOX */}
      {checkoutModalOpen && selectedPkg && (
        <div id="paypal-sim-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-white/10 overflow-hidden shadow-2xl">
            
            {/* Header with stylized PayPal accent banner */}
            <div className="bg-gradient-to-r from-[#003087] via-[#0079C1] to-[#00457C] px-6 py-5 flex items-center justify-between text-white">
              <div className="flex items-center space-x-3">
                <CreditCard className="w-6 h-6 text-cyan-300" />
                <div>
                  <span className="text-lg font-extrabold tracking-tight">PayPal</span>
                  <span className="text-xs font-bold text-cyan-300 font-mono tracking-widest ml-2">PAYMENT PORTAL</span>
                </div>
              </div>
              <button 
                onClick={() => setCheckoutModalOpen(false)}
                className="text-white bg-white/10 hover:bg-white/20 px-2.5 py-1.5 rounded-lg text-xs font-semibold"
              >
                Cancel Process
              </button>
            </div>

            {/* Tab selector for Real PayPal SDK vs. Developers Mock Simulation */}
            {!successTx && (
              <div className="flex border-b border-white/10 bg-slate-950/40">
                <button
                  type="button"
                  onClick={() => setCheckoutTab('paypal')}
                  className={`flex-1 py-3 text-center text-xs font-bold uppercase tracking-wider transition-all ${
                    checkoutTab === 'paypal'
                      ? 'text-white border-b-2 border-blue-500 bg-slate-900'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  PayPal Smart Checkout
                </button>
                <button
                  type="button"
                  onClick={() => setCheckoutTab('sandbox')}
                  className={`flex-1 py-3 text-center text-xs font-bold uppercase tracking-wider transition-all ${
                    checkoutTab === 'sandbox'
                      ? 'text-white border-b-2 border-blue-500 bg-slate-900'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  Direct DB Simulation
                </button>
              </div>
            )}

            <div className="p-6">
              {!successTx ? (
                checkoutTab === 'paypal' ? (
                  /* Real Paypal button container */
                  <div className="space-y-5">
                    <div className="bg-[#030712] border border-white/5 p-4 rounded-xl flex justify-between items-center text-sm">
                      <div>
                        <div className="text-xs text-slate-500 uppercase tracking-widest font-mono">Deliverable Package</div>
                        <div className="font-bold text-white text-base mt-0.5">{selectedPkg.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-500 uppercase tracking-widest font-mono">Amount Due</div>
                        <div className="font-extrabold text-[#3B82F6] text-xl font-mono mt-0.5">${selectedPkg.price.toLocaleString()} USD</div>
                      </div>
                    </div>

                    {errorMsg && (
                      <div className="p-3.5 bg-red-950/40 border border-red-500/20 text-xs text-red-400 rounded-lg">
                        {errorMsg}
                      </div>
                    )}

                    {!paypalReady ? (
                      <div className="flex flex-col items-center justify-center py-10 space-y-3">
                        <span className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></span>
                        <p className="text-xs text-slate-400 font-mono">SECURELY LOADING PAYPAL SDK...</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="p-3 bg-blue-950/20 border border-blue-500/10 rounded-xl text-center">
                          <p className="text-xs text-blue-300 leading-relaxed">
                            Presents live & sandbox Smart Buttons to settle international payments with your choice of credentials.
                          </p>
                        </div>
                        
                        <div className="bg-slate-950/30 p-4 rounded-xl border border-white/5">
                          <div id="paypal-button-container" className="min-h-[150px]"></div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Primary checkout input form */
                  <form onSubmit={handleSimulatePayment} className="space-y-5">
                    <div className="bg-[#030712] border border-white/5 p-4 rounded-xl flex justify-between items-center text-sm">
                      <div>
                        <div className="text-xs text-slate-500 uppercase tracking-widest font-mono">Deliverable Package</div>
                        <div className="font-bold text-white text-base mt-0.5">{selectedPkg.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-500 uppercase tracking-widest font-mono">Amount Due</div>
                        <div className="font-extrabold text-[#3B82F6] text-xl font-mono mt-0.5">${selectedPkg.price.toLocaleString()} USD</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Recipient Full Name (Payer ID)</label>
                        <input
                          type="text"
                          value={payerName}
                          onChange={(e) => setPayerName(e.target.value)}
                          required
                          placeholder="e.g. Elena Rostova"
                          className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-white/5 text-sm text-white focus:border-blue-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">PayPal Associated Email</label>
                        <input
                          type="email"
                          value={payerEmail}
                          onChange={(e) => setPayerEmail(e.target.value)}
                          required
                          placeholder="e.g. sandbox@synthetix.io"
                          className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-white/5 text-sm text-white focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    {errorMsg && (
                      <div className="p-3.5 bg-red-950/40 border border-red-500/20 text-xs text-red-400 rounded-lg">
                        {errorMsg}
                      </div>
                    )}

                    <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center space-x-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Simulated Direct Database Sync Bypass</span>
                      </div>
                      <span className="font-mono">SLA Ref: DX-92</span>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 rounded-xl cursor-pointer bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-slate-950 text-sm font-extrabold tracking-widest uppercase transition-all flex items-center justify-center space-x-2"
                    >
                      <span>{isSubmitting ? 'Settling Payment Transactions...' : 'Pay Sandbox Secured'}</span>
                    </button>
                  </form>
                )
              ) : (
                /* Success feedback panel displaying invoice links */
                <div className="text-center py-6 space-y-6">
                  <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Check className="w-8 h-8" />
                  </div>

                  <div>
                    <h4 className="text-2xl font-extrabold text-white">Payment Approved!</h4>
                    <p className="text-sm text-slate-400 mt-2 max-w-sm mx-auto">
                      PayPal payment finalized and recorded inside Google Firebase Firestore collections.
                    </p>
                  </div>

                  <div className="bg-[#030712] border border-white/5 p-4 rounded-xl text-left font-mono text-xs space-y-2 max-w-sm mx-auto">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Transaction ID:</span>
                      <span className="text-slate-200 select-all font-bold">{successTx}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Payer Recipient:</span>
                      <span className="text-slate-200">{payerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Settled Sum:</span>
                      <span className="text-emerald-400 font-bold">${selectedPkg.price.toLocaleString()} USD</span>
                    </div>
                  </div>

                  {/* Fully functioning corporate invoice system link! */}
                  <div className="space-y-3 pt-4">
                    <a
                      href={`/api/invoice/${successTx}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-widest w-full justify-center transition-colors shadow-lg shadow-blue-600/20"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Download Dynamic Invoice</span>
                    </a>
                    
                    <button
                      onClick={() => setCheckoutModalOpen(false)}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Continue Exploring Site
                    </button>
                  </div>
                </div>
              )}
            </div>
            
          </div>
        </div>
      )}

    </section>
  );
}
