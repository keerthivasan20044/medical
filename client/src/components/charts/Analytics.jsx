import { useLanguage } from '../../context/LanguageContext';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, Legend
} from 'recharts';

const THEME = {
  teal: '#028090',
  mint: '#02C39A',
  navy: '#0a1628',
  slate: '#1e3a5f',
  off: '#f4fafb',
  border: '#d0e8ed',
  muted: '#8da8b8'
};

/**
 * Monthly yield architecture bar chart.
 */
export function RevenueBarChart({ data = [] }) {
  const { t } = useLanguage();
  return (
    <div className="h-[400px] w-full p-8 bg-white border border-gray-100 rounded-[3.5rem] shadow-soft hover:shadow-2xl transition duration-500">
       <div className="mb-10 flex items-center justify-between">
          <div className="space-y-1">
             <h3 className="font-syne font-black text-xl text-[#0a1628] uppercase tracking-tighter">{t('financialEnclave')}</h3>
             <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest italic">/ {t('monthlyRevenueProtocol')}</p>
          </div>
          <div className="font-syne font-black text-emerald-500 text-sm italic">+12.4% {t('enclaveGrowth')}</div>
       </div>
       <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%" minHeight={200}>
             <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 0 }}>
             <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="0%" stopColor={THEME.mint} stopOpacity={1} />
                   <stop offset="100%" stopColor={THEME.teal} stopOpacity={0.8} />
                </linearGradient>
             </defs>
             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
             <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: THEME.muted, fontSize: 10, fontWeight: 700 }} 
                dy={15}
             />
             <YAxis 
                hide 
             />
             <Tooltip 
                cursor={{ fill: '#f8fafc', radius: 16 }}
                contentStyle={{ 
                   backgroundColor: '#0a1628', 
                   border: 'none', 
                   borderRadius: '24px',
                   boxShadow: '0 25px 50px rgba(0,0,0,0.1)',
                   padding: '24px'
                }}
                itemStyle={{ color: '#02C39A', fontSize: 14, fontWeight: 900, fontFamily: 'Syne' }}
                labelStyle={{ color: '#ffffff40', fontSize: 10, fontWeight: 900, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
             />
             <Bar 
                dataKey="value" 
                fill="url(#barGradient)" 
                radius={[12, 12, 4, 4]} 
                animationBegin={500}
                animationDuration={2000}
                animationEasing="ease-out"
             />
          </BarChart>
       </ResponsiveContainer>
      </div>
    </div>
  );
}

/**
 * 7-day active node line architecture.
 */
export function OrdersLineChart({ data = [] }) {
  const { t } = useLanguage();
  return (
    <div className="h-[400px] w-full p-10 bg-[#0a1628] rounded-[4rem] shadow-4xl relative overflow-hidden group">
       <div className="absolute top-0 right-0 h-40 w-40 bg-[#028090] rounded-full blur-[80px] opacity-10" />
       <div className="mb-10 relative z-10 flex items-center justify-between">
          <div className="space-y-1">
             <h3 className="font-syne font-black text-xl text-white uppercase tracking-tighter">{t('orderFlowArchitecture')}</h3>
             <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest italic">/ {t('realTimeStreamProtocol')}</p>
          </div>
       </div>
       <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%" minHeight={200}>
             <AreaChart data={data}>
             <defs>
                <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="0%" stopColor={THEME.teal} stopOpacity={0.3} />
                   <stop offset="100%" stopColor={THEME.teal} stopOpacity={0} />
                </linearGradient>
             </defs>
             <XAxis 
                dataKey="name" 
                hide
             />
             <YAxis hide />
             <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '16px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
             />
             <Area 
                type="monotone" 
                dataKey="orders" 
                stroke={THEME.mint} 
                strokeWidth={4} 
                fill="url(#lineFill)"
                animationDuration={3000}
             />
          </AreaChart>
       </ResponsiveContainer>
      </div>
    </div>
  );
}

/**
 * Specialized category distribution pie node.
 */
export function CategoryPieChart({ data = [] }) {
  const { t } = useLanguage();
  const COLORS = [THEME.teal, THEME.mint, '#6366f1', '#f43f5e'];

  return (
    <div className="h-[400px] w-full p-10 bg-white border border-gray-100 rounded-[3.5rem] shadow-soft hover:shadow-2xl transition duration-500 flex flex-col items-center">
       <div className="w-full text-left mb-6 space-y-1">
          <h3 className="font-syne font-black text-xl text-[#0a1628] uppercase tracking-tighter">{t('enclaveInventory')}</h3>
          <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest italic">/ {t('resourceNodeProtocol')}</p>
       </div>
       <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%" minHeight={150}>
             <PieChart>
             <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={8}
                dataKey="value"
                stroke="none"
                animationDuration={2500}
             >
                {data.map((entry, index) => (
                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={8} />
                ))}
             </Pie>
             <Tooltip 
                contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}
             />
          </PieChart>
         </ResponsiveContainer>
       </div>
       <div className="w-full grid grid-cols-2 gap-4 mt-6">
          {data.map((d, i) => (
             <div key={d.name} className="flex items-center gap-4">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <div className="text-[10px] font-black uppercase text-[#0a1628] tracking-widest">{t(d.name.toLowerCase())}</div>
             </div>
          ))}
       </div>
    </div>
  );
}
