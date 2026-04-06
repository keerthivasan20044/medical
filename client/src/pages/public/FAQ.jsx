import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Minus, Search, Filter,
  ChevronRight, ArrowRight,
  MessageSquare, Phone, Mail,
  Store, ShoppingBag, Truck, Pill, 
  User, CreditCard, ShieldCheck, X 
} from 'lucide-react';

const FAQ_DATA = [
  { 
    category: 'Orders', 
    questions: [
      { q: 'How do I place an order on MediReach in Karaikal?', a: 'Browse medicines or pharmacies, add items to your cart, and click checkout. You can also upload a prescription directly, and our pharmacists will process the order architecture for you.' },
      { q: 'Can I order from multiple pharmacies in one order?', a: 'No, each order is fulfilled by a single pharmacy to ensure architecture delivery speed and accountability. You can place multiple orders for separate pharmacies.' },
      { q: 'How do I cancel my order?', a: 'Go to "My Orders", find your active order, and click "Cancel". Cancellations are allowed before the pharmacy marks the order as "Preparing".' },
      { q: 'What is the minimum order amount?', a: 'Most pharmacies in Karaikal have a minimum order architecture of ₹100 for delivery. Pickup has no minimum.' }
    ]
  },
  { 
    category: 'Delivery', 
    questions: [
      { q: 'How fast is delivery in Karaikal town?', a: 'We deliver within 30 minutes in Karaikal town area. For Nagore and Poompuhar areas, delivery takes 45-60 minutes depending on the courier enclave.' },
      { q: 'Do you deliver to Nagore and Poompuhar?', a: 'Yes! We cover the entire Karaikal district including Nagore, Poompuhar, and T.R. Pattinam.' },
      { q: 'What if I am not home during delivery?', a: 'Our rider will call you. You can authorize them to leave it with a neighbor or reschedule the delivery architecture.' },
      { q: 'How does GPS tracking work?', a: 'Once an order is "Out for Delivery", you can view the live GPS location of your rider on the "Track Order" page.' },
      { q: 'What is OTP delivery confirmation?', a: 'For security, you must provide a 4-digit code (sent via SMS) to the rider to confirm you received your medical architecture correctly.' }
    ]
  },
  { 
    category: 'Medicines', 
    questions: [
      { q: 'Are all medicines authentic at Karaikal pharmacies?', a: 'Yes. MediReach only partners with licensed pharmacies in the Karaikal district. Every architecture delivery comes with a real tax invoice.' },
      { q: 'Can I get prescription medicines without prescription?', a: 'No. For Schedule H and X medicines, a valid prescription is legally required and must be verified by our licensed pharmacists.' },
      { q: 'What if a medicine is out of stock?', a: 'The app will notify you if a medicine is unavailable at your chosen pharmacy. You can try searching in other partner pharmacies in the enclave.' }
    ]
  },
  { 
    category: 'Prescriptions', 
    questions: [
      { q: 'How do I upload my prescription?', a: 'On the "Store" or "Prescriptions" page, click the "Upload" button. You can take a photo or select a PDF from your device.' },
      { q: 'How long does prescription verification take?', a: 'Our licensed pharmacists verify prescriptions within 15 minutes during pharmacy hours (8AM–10PM in Karaikal).' }
    ]
  },
  { 
    category: 'Payment', 
    questions: [
      { q: 'What payment methods are accepted?', a: 'UPI (GPay, PhonePe, Paytm), Debit/Credit Cards (Visa, Mastercard, RuPay), Net Banking, and Cash on Delivery — all accepted.' },
      { q: 'Is my payment information secure?', a: 'Absolutely. We use industry-standard encryption architecture. MediReach does not store your card or UPI pins.' },
      { q: 'Can I pay on delivery?', a: 'Yes, most pharmacies in the Karaikal enclave support Cash on Delivery (COD).' }
    ]
  }
];

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState('Orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState(0);

  const categories = FAQ_DATA.map(d => d.category);
  const currentFaqs = FAQ_DATA.find(d => d.category === activeCategory).questions;

  const filteredFaqs = searchQuery 
    ? FAQ_DATA.flatMap(cat => cat.questions).filter(f => 
        f.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
        f.a.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : currentFaqs;

  return (
    <div className="bg-white min-h-screen pb-40">
      {/* Hero Header */}
      <section className="bg-[#0a1628] py-32 md:py-48 relative overflow-hidden">
         <div className="absolute inset-0 bg-grid opacity-10" />
         <div className="max-w-7xl mx-auto px-6 text-center space-y-8 relative z-10">
            <h1 className="font-syne font-black text-5xl md:text-8xl text-white tracking-tighter">Support & <br /><span className="text-[#02C39A]">Architecture FAQs.</span></h1>
            <p className="text-white/40 font-dm text-lg md:text-2xl max-w-2xl mx-auto italic leading-relaxed">Everything you need to know about MediReach Karaikal operations in one place.</p>

            <div className="max-w-2xl mx-auto pt-12">
               <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-[3rem] p-4 flex items-center gap-6 shadow-2xl focus-within:bg-white/20 focus-within:border-[#02C39A]/40 transition group">
                  <div className="h-14 w-14 bg-[#02C39A] text-[#0a1628] rounded-[2rem] flex items-center justify-center shadow-lg"><Search size={24} /></div>
                  <input 
                     type="text" 
                     placeholder="Search for answers (e.g. delivery speed)..." 
                     className="bg-transparent border-none outline-none font-dm text-lg text-white placeholder-white/30 w-full"
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && <button onClick={() => setSearchQuery('')} className="text-white/40 hover:text-white transition"><X size={24} /></button>}
               </div>
            </div>
         </div>
         <div className="absolute -bottom-8 -left-8 h-64 w-64 bg-[#028090] rounded-full blur-3xl opacity-20" />
         <div className="absolute -top-8 -right-8 h-64 w-64 bg-[#02C39A] rounded-full blur-3xl opacity-10" />
      </section>

      {/* Main Content Enclave */}
      <div className="max-w-7xl mx-auto px-6 py-24">
         <div className="grid lg:grid-cols-[300px_1fr] gap-20 items-start">
            
            {/* Nav Sidebar */}
            <aside className="space-y-12 lg:sticky lg:top-32">
               <div className="space-y-4">
                  <h3 className="font-syne font-black text-[#0a1628] uppercase tracking-widest text-sm flex items-center gap-3"><Filter size={18} /> Protocol Categories</h3>
                  <div className="flex flex-col gap-2">
                     {categories.map(cat => (
                        <button
                           key={cat}
                           onClick={() => { setActiveCategory(cat); setOpenIndex(0); setSearchQuery(''); }}
                           className={`w-full text-left px-8 py-5 rounded-2xl font-syne font-black text-[10px] uppercase tracking-widest transition-all ${activeCategory === cat && !searchQuery ? 'bg-[#0a1628] text-white shadow-xl scale-105' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                        >
                           {cat}
                        </button>
                     ))}
                  </div>
               </div>

               <div className="p-10 bg-gray-50 rounded-[3rem] border border-gray-100 flex flex-col items-center text-center space-y-6">
                  <div className="h-16 w-16 bg-[#028090] text-white rounded-[1.8rem] flex items-center justify-center shadow-lg"><MessageSquare size={24} /></div>
                  <div>
                     <h4 className="font-syne font-black text-[#0a1628]">Still have questions?</h4>
                     <p className="text-gray-400 font-dm text-xs italic mt-1 leading-relaxed">Our support architecture is available 24/7 for Karaikal residents.</p>
                  </div>
                  <button className="w-full py-4 bg-[#0a1628] text-white rounded-2xl font-syne font-black text-[10px] uppercase tracking-widest hover:bg-[#028090] transition shadow-lg">Chat with Enclave Support</button>
               </div>
            </aside>

            {/* Accordion Component */}
            <div className="space-y-12">
               <div className="flex items-center justify-between border-b border-gray-50 pb-8">
                  <h2 className="font-syne font-black text-4xl text-[#0a1628]">{searchQuery ? 'Search Architecture Results' : `${activeCategory} Protocol`}</h2>
                  <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Showing {filteredFaqs.length} Answers</div>
               </div>

               <div className="space-y-6">
                  {filteredFaqs.map((faq, i) => (
                     <div 
                        key={i}
                        className={`bg-white rounded-[3.5rem] border transition-all duration-500 overflow-hidden ${openIndex === i ? 'border-[#028090]/20 shadow-3xl' : 'border-gray-50 hover:border-gray-200 shadow-sm'}`}
                     >
                        <button 
                           onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                           className="w-full text-left p-12 flex items-center justify-between gap-10 group"
                        >
                           <h3 className="font-syne font-black text-2xl text-[#0a1628] group-hover:text-[#028090] transition flex-1">{faq.q}</h3>
                           <div className={`h-12 w-12 rounded-2xl shrink-0 flex items-center justify-center transition-all ${openIndex === i ? 'bg-[#0a1628] text-white rotate-180' : 'bg-gray-50 text-gray-400'}`}>
                              {openIndex === i ? <Minus size={20} /> : <Plus size={20} />}
                           </div>
                        </button>
                        
                        <AnimatePresence>
                           {openIndex === i && (
                              <motion.div
                                 initial={{ height: 0, opacity: 0 }}
                                 animate={{ height: 'auto', opacity: 1 }}
                                 exit={{ height: 0, opacity: 0 }}
                                 className="px-12 pb-12"
                              >
                                 <div className="pt-8 border-t border-gray-50 space-y-8">
                                    <p className="text-xl font-dm text-gray-500 leading-relaxed italic">{faq.a}</p>
                                    <div className="flex gap-4">
                                       <button className="px-8 py-3 bg-gray-50 rounded-xl text-[10px] font-black text-[#028090] uppercase tracking-widest hover:bg-[#028090] hover:text-white transition">Was this helpful?</button>
                                       <button className="px-8 py-3 bg-gray-50 rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-widest hover:bg-white hover:border-[#0a1628] transition border border-transparent">No, talk to agent</button>
                                    </div>
                                 </div>
                              </motion.div>
                           )}
                        </AnimatePresence>
                     </div>
                  ))}
               </div>

               {filteredFaqs.length === 0 && (
                  <div className="py-24 text-center space-y-8 bg-gray-50 rounded-[4rem] border-2 border-dashed border-gray-100">
                     <div className="h-32 w-32 mx-auto bg-gray-100 rounded-full flex items-center justify-center text-gray-300 opacity-50 shadow-inner">
                        <X size={64} />
                     </div>
                     <div>
                        <h3 className="font-syne font-black text-3xl text-[#0a1628]">Architecture Insight Not Found.</h3>
                        <p className="text-gray-400 text-lg font-dm max-w-xs mx-auto italic mt-2 leading-relaxed">We couldn't find an answer for your specific medical query. Please connect with our enclave support.</p>
                     </div>
                     <button className="px-12 py-5 bg-[#0a1628] text-white rounded-3xl font-syne font-black text-xs uppercase tracking-widest hover:bg-[#028090] transition shadow-2xl">Connect with Real Agent &rarr;</button>
                  </div>
               )}
            </div>
         </div>
      </div>

      {/* Quick Links Section */}
      <section className="bg-[#f8fafc] py-32 border-y border-gray-100">
         <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
               { icon: Phone, label: 'Emergency Support', val: '108 (District)' },
               { icon: MessageSquare, label: 'WhatsApp Stream', val: '+91 99999 99999' },
               { icon: Mail, label: 'Email Architecture', val: 'support@medireach.in' },
               { icon: Store, label: 'Partner Enclave', val: '8 Licensed Pharmacies' }
            ].map(link => (
               <div key={link.label} className="space-y-6">
                  <div className="h-16 w-16 bg-white rounded-3xl flex items-center justify-center text-[#028090] shadow-sm"><link.icon size={26} /></div>
                  <div className="space-y-1">
                     <div className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">{link.label}</div>
                     <div className="text-sm font-syne font-black text-[#0a1628] uppercase tracking-widest">{link.val}</div>
                  </div>
               </div>
            ))}
         </div>
      </section>
    </div>
  );
}
