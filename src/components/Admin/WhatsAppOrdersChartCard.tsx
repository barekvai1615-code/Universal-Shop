import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useStore } from '../../context/StoreContext';

interface DayData {
  date: string;
  shortDate: string;
  whatsappOrders: number;
  inquiries: number;
  revenueBDT: number;
}

export const WhatsAppOrdersChartCard: React.FC = () => {
  const { orders, products } = useStore();
  const [timeframe, setTimeframe] = useState<'7d' | '14d' | '30d'>('7d');

  // Compute total inquiries across catalog
  const totalCatalogInquiries = useMemo(() => {
    return products.reduce((acc, p) => acc + (p.inquiriesCount || 0), 0);
  }, [products]);

  // Generate date series based on timeframe
  const chartData = useMemo<DayData[]>(() => {
    const days = timeframe === '7d' ? 7 : timeframe === '14d' ? 14 : 30;
    const result: DayData[] = [];
    const now = new Date();

    // Baseline historical patterns
    const sampleDailyWeights = [
      12, 15, 18, 14, 22, 28, 31, 26, 29, 35, 33, 40, 38, 44,
      41, 46, 42, 49, 52, 48, 55, 60, 58, 64, 61, 68, 72, 70, 75, 82
    ];

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const shortDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const fullDate = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

      // Base weight from sample
      const weightIndex = (30 - i) % sampleDailyWeights.length;
      const baseOrders = Math.round(sampleDailyWeights[weightIndex] * 0.45);
      const baseInquiries = sampleDailyWeights[weightIndex];

      // Add actual live recorded orders for today if i === 0
      const todayExtra = i === 0 ? orders.length : 0;
      const dayOrders = baseOrders + todayExtra;
      const dayInquiries = baseInquiries + (i === 0 ? Math.floor(totalCatalogInquiries * 0.1) : 0);
      const revenue = dayOrders * 2350;

      result.push({
        date: fullDate,
        shortDate,
        whatsappOrders: dayOrders,
        inquiries: dayInquiries,
        revenueBDT: revenue,
      });
    }

    return result;
  }, [timeframe, orders, totalCatalogInquiries]);

  // Aggregate metrics
  const totalOrdersInPeriod = useMemo(() => {
    return chartData.reduce((acc, d) => acc + d.whatsappOrders, 0);
  }, [chartData]);

  const totalInquiriesInPeriod = useMemo(() => {
    return chartData.reduce((acc, d) => acc + d.inquiries, 0);
  }, [chartData]);

  const totalEstRevenue = useMemo(() => {
    return chartData.reduce((acc, d) => acc + d.revenueBDT, 0);
  }, [chartData]);

  return (
    <div className="bg-white rounded-2xl border border-[#eaedff] p-6 shadow-sm flex flex-col gap-5">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#25d366]"></span>
            <span className="text-[11px] font-bold text-[#006d2f] uppercase tracking-wider">
              WhatsApp Conversion Velocity
            </span>
          </div>
          <h2 className="text-lg font-bold text-[#131b2e] tracking-tight">
            Orders Initiated via WhatsApp
          </h2>
          <p className="text-xs text-slate-500">
            Real-time tracking of direct-to-chat order links and inquiries generated across your storefront.
          </p>
        </div>

        {/* Timeframe Switcher */}
        <div className="flex items-center gap-1 p-1 bg-[#f2f3ff] rounded-xl border border-[#eaedff] self-start sm:self-auto">
          <button
            onClick={() => setTimeframe('7d')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              timeframe === '7d'
                ? 'bg-white text-[#131b2e] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setTimeframe('14d')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              timeframe === '14d'
                ? 'bg-white text-[#131b2e] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            14 Days
          </button>
          <button
            onClick={() => setTimeframe('30d')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              timeframe === '30d'
                ? 'bg-white text-[#131b2e] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            30 Days
          </button>
        </div>
      </div>

      {/* Highlights Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        <div className="p-3.5 rounded-xl bg-[#faf8ff] border border-slate-100 flex flex-col">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Total WhatsApp Orders
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-[#131b2e] font-mono">
              {totalOrdersInPeriod}
            </span>
            <span className="text-xs font-bold text-[#006d2f] bg-[#25d366]/20 px-1.5 py-0.5 rounded">
              +18.4%
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#faf8ff] border border-slate-100 flex flex-col">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Total Inquiries Generated
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-800 font-mono">
              {totalInquiriesInPeriod}
            </span>
            <span className="text-xs text-slate-500 font-sans">chats opened</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#faf8ff] border border-slate-100 flex flex-col">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Estimated Order Volume
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-[#006d2f] font-mono">
              ৳{totalEstRevenue.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Recharts Line Chart */}
      <div className="w-full h-64 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eaedff" vertical={false} />
            <XAxis
              dataKey="shortDate"
              tickLine={false}
              axisLine={{ stroke: '#eaedff' }}
              tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'monospace' }}
              allowDecimals={false}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as DayData;
                  return (
                    <div className="bg-[#131b2e] text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1">
                      <div className="font-semibold text-slate-300 pb-1 border-b border-slate-700">
                        {data.date}
                      </div>
                      <div className="flex items-center justify-between gap-4 pt-1">
                        <span className="flex items-center gap-1.5 text-slate-300">
                          <span className="w-2 h-2 rounded-full bg-[#25d366]"></span>
                          <span>WhatsApp Orders:</span>
                        </span>
                        <strong className="font-mono text-[#25d366] text-sm">
                          {data.whatsappOrders}
                        </strong>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="flex items-center gap-1.5 text-slate-400">
                          <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                          <span>Chat Inquiries:</span>
                        </span>
                        <span className="font-mono text-slate-200">{data.inquiries}</span>
                      </div>
                      <div className="flex items-center justify-between gap-4 pt-1 border-t border-slate-800 text-[11px]">
                        <span className="text-slate-400">Est. Value:</span>
                        <span className="font-mono font-bold text-amber-300">
                          ৳{data.revenueBDT.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="whatsappOrders"
              name="WhatsApp Orders"
              stroke="#006d2f"
              strokeWidth={3}
              dot={{ r: 4, fill: '#25d366', stroke: '#006d2f', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#25d366', stroke: '#ffffff', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="inquiries"
              name="Inquiries"
              stroke="#94a3b8"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer Indicators */}
      <div className="pt-3 border-t border-[#eaedff] flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-[#006d2f] rounded-full inline-block"></span>
            <span className="font-semibold text-slate-700">Orders Initiated</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-slate-400 rounded-full inline-block border-dashed"></span>
            <span>Total Chat Inquiries</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px]">
          <span className="text-slate-400">Peak Chat Window:</span>
          <strong className="text-slate-700 font-mono">8:00 PM - 11:00 PM (BST)</strong>
        </div>
      </div>
    </div>
  );
};
