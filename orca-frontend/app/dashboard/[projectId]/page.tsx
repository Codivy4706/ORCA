"use client"

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useMemo } from "react"
import { Hexagon, ChevronDown, ChevronRight, X, RotateCcw, Check } from "lucide-react"
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

// Types
type TimeframeOption = {
  label: string
  value: number
  unit: "hour" | "day"
}

type ChartOption = {
  id: string
  label: string
  checked: boolean
}

type HealingStatus = "AUTO_PATCHED" | "REJECTED_BY_DEV" | "CACHED_PATCH"

type HealingRecord = {
  id: string
  timestamp: string
  workspace: string
  endpoint: string
  driftSignature: string
  status: HealingStatus
  detectedDrift: string
  healedPayload: object
}

// Constants
const TIMEFRAME_OPTIONS: TimeframeOption[] = [
  { label: "1 hour", value: 1, unit: "hour" },
  { label: "6 hours", value: 6, unit: "hour" },
  { label: "12 hours", value: 12, unit: "hour" },
  { label: "1 day", value: 1, unit: "day" },
  { label: "2 days", value: 2, unit: "day" },
  { label: "4 days", value: 4, unit: "day" },
  { label: "7 days", value: 7, unit: "day" },
  { label: "14 days", value: 14, unit: "day" },
  { label: "30 days", value: 30, unit: "day" },
]

const DEFAULT_CHART_OPTIONS: ChartOption[] = [
  { id: "traffic-response", label: "Traffic by response code", checked: false },
  { id: "traffic-method", label: "Traffic by API method", checked: false },
  { id: "traffic-credential", label: "Traffic by credential", checked: false },
  { id: "errors-method", label: "Errors by API method", checked: true },
  { id: "errors-credential", label: "Errors by credential", checked: false },
  { id: "overall-latency", label: "Overall latency", checked: true },
  { id: "latency-response", label: "Latency by response code (median)", checked: false },
  { id: "latency-method", label: "Latency by API method (median)", checked: true },
]

// Components
function ChartSelectorDialog({
  options,
  onOptionsChange,
  onClose,
}: {
  options: ChartOption[]
  onOptionsChange: (options: ChartOption[]) => void
  onClose: () => void
}) {
  const [tempOptions, setTempOptions] = useState(options)

  const handleToggle = (id: string) => {
    setTempOptions((prev) =>
      prev.map((opt) => (opt.id === id ? { ...opt, checked: !opt.checked } : opt))
    )
  }

  const handleOk = () => {
    onOptionsChange(tempOptions)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/20 flex items-start justify-center pt-32 z-50">
      <div className="bg-white border border-zinc-300 rounded-lg shadow-xl w-80">
        <fieldset className="p-4">
          <legend className="text-sm font-medium text-zinc-700 px-1 -ml-1">Select graphs</legend>
          <div className="mt-2 space-y-1">
            {tempOptions.map((option) => (
              <button
                type="button"
                key={option.id}
                onClick={() => handleToggle(option.id)}
                className="flex items-center gap-3 py-2 px-2 rounded hover:bg-zinc-50 cursor-pointer w-full text-left"
              >
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    option.checked
                      ? "bg-zinc-900 border-zinc-900"
                      : "border-zinc-400 bg-white"
                  }`}
                >
                  {option.checked && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
                </div>
                <span className="text-sm text-zinc-700">{option.label}</span>
              </button>
            ))}
          </div>
        </fieldset>
        <div className="flex justify-end gap-4 px-4 py-3 border-t border-zinc-200">
          <button
            onClick={onClose}
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 px-3 py-1"
          >
            Cancel
          </button>
          <button
            onClick={handleOk}
            className="text-sm font-medium text-zinc-900 hover:text-zinc-700 px-3 py-1"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  )
}

function Header({ 
  projectName,
  selectedTimeframe, 
  onTimeframeChange,
  chartOptions,
  onChartOptionsChange,
}: { 
  projectName: string
  selectedTimeframe: TimeframeOption
  onTimeframeChange: (tf: TimeframeOption) => void
  chartOptions: ChartOption[]
  onChartOptionsChange: (options: ChartOption[]) => void
}) {
  const [isTimeframeOpen, setIsTimeframeOpen] = useState(false)
  const [isChartSelectorOpen, setIsChartSelectorOpen] = useState(false)

  const selectedCount = chartOptions.filter((o) => o.checked).length

  console.log("Header received name:", projectName);
  return (
    <>
      <header className="border-b border-zinc-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Hexagon className="h-8 w-8 text-zinc-800" strokeWidth={1.5} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-2 w-2 bg-zinc-800 rounded-full" />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-medium tracking-tight text-zinc-900 uppercase">
                O.R.C.A. <span className="text-zinc-400">//</span> {projectName} DASHBOARD
              </h1>
              <p className="text-xs text-zinc-500">AI-Powered Self-Healing API Gateway</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {TIMEFRAME_OPTIONS.map((option) => (
              <button
                key={option.label}
                onClick={() => onTimeframeChange(option)}
                className={`text-sm transition-colors ${
                  selectedTimeframe.label === option.label
                    ? "text-zinc-900 font-medium"
                    : "text-zinc-400 hover:text-zinc-600"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4">
          <fieldset className="relative">
            <legend className="sr-only">Select graphs</legend>
            <button
              onClick={() => setIsChartSelectorOpen(true)}
              className="flex items-center gap-2 px-3 py-2 border border-zinc-300 rounded hover:bg-zinc-50 transition-colors"
            >
              <span className="text-sm text-zinc-600">Select graphs</span>
              <span className="text-sm font-medium text-zinc-900">{selectedCount} Graphs</span>
              <ChevronDown className="h-4 w-4 text-zinc-400" />
            </button>
          </fieldset>
        </div>
      </header>

      {isChartSelectorOpen && (
        <ChartSelectorDialog
          options={chartOptions}
          onOptionsChange={onChartOptionsChange}
          onClose={() => setIsChartSelectorOpen(false)}
        />
      )}
    </>
  )
}

function FullWidthChart({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-zinc-200 rounded-lg">
      <div className="px-4 py-3 border-b border-zinc-100">
        <h3 className="text-sm font-medium text-zinc-900">{title}</h3>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  )
}

function OverallLatencyChart({ data, domain }: { data: any[], domain: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#52525b" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#52525b" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
        <XAxis 
          dataKey="timestamp" // Use the raw timestamp for positioning
          type="number"
          domain={domain} // This forces the "30 days" or "1 hour" scale
          tickFormatter={(unixTime) => new Date(unixTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          fontSize={11} 
          tickLine={false} 
          axisLine={false} 
        />
        <YAxis 
          stroke="#a1a1aa" 
          tick={{ fill: "#71717a", fontSize: 11 }} 
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `${v}ms`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #e4e4e7",
            borderRadius: "6px",
            color: "#18181b",
          }}
          labelStyle={{ color: "#71717a" }}
          formatter={(value: number) => [`${value}ms`, "Median Latency"]}
        />
        <Area
          type="monotone"
          dataKey="latency"
          stroke="#52525b"
          strokeWidth={2}
          fill="url(#latencyGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

function MethodLatencyChart({ data, domain }: { data: any[], domain: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
        <XAxis 
          dataKey="timestamp" // Use the raw timestamp for positioning
          type="number"
          domain={domain} // This forces the "30 days" or "1 hour" scale
          tickFormatter={(unixTime) => new Date(unixTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          fontSize={11} 
          tickLine={false} 
          axisLine={false} 
        />
        <YAxis 
          stroke="#a1a1aa" 
          tick={{ fill: "#71717a", fontSize: 11 }} 
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `${v}ms`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #e4e4e7",
            borderRadius: "6px",
            color: "#18181b",
          }}
          labelStyle={{ color: "#71717a" }}
          formatter={(value: number) => [`${value}ms`]}
        />
        <Legend 
          wrapperStyle={{ paddingTop: "10px" }}
          formatter={(value) => <span className="text-xs text-zinc-600">{value}</span>}
        />
        <Line type="monotone" dataKey="GET /api/users" stroke="#18181b" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="POST /api/orders" stroke="#52525b" strokeWidth={2} dot={false} strokeDasharray="5 5" />
        <Line type="monotone" dataKey="PUT /api/inventory" stroke="#a1a1aa" strokeWidth={2} dot={false} strokeDasharray="3 3" />
        <Line type="monotone" dataKey="DELETE /api/sessions" stroke="#d4d4d8" strokeWidth={2} dot={false} strokeDasharray="1 1" />
      </LineChart>
    </ResponsiveContainer>
  )
}

function TrafficByMethodChart({ data, domain }: { data: any[], domain: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
        <XAxis 
          dataKey="timestamp" // Use the raw timestamp for positioning
          type="number"
          domain={domain} // This forces the "30 days" or "1 hour" scale
          tickFormatter={(unixTime) => new Date(unixTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          fontSize={11} 
          tickLine={false} 
          axisLine={false} 
        />
        <YAxis 
          stroke="#a1a1aa" 
          tick={{ fill: "#71717a", fontSize: 11 }} 
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #e4e4e7",
            borderRadius: "6px",
            color: "#18181b",
          }}
          labelStyle={{ color: "#71717a" }}
        />
        <Legend 
          wrapperStyle={{ paddingTop: "10px" }}
          formatter={(value) => <span className="text-xs text-zinc-600">{value}</span>}
        />
        <Bar dataKey="GET /api/users" stackId="a" fill="#18181b" />
        <Bar dataKey="POST /api/orders" stackId="a" fill="#52525b" />
        <Bar dataKey="PUT /api/inventory" stackId="a" fill="#a1a1aa" />
        <Bar dataKey="DELETE /api/sessions" stackId="a" fill="#d4d4d8" />
      </BarChart>
    </ResponsiveContainer>
  )
}

function TrafficChart({ data, domain }: { data: any[], domain: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
        <XAxis 
          dataKey="timestamp" // Use the raw timestamp for positioning
          type="number"
          domain={domain} // This forces the "30 days" or "1 hour" scale
          tickFormatter={(unixTime) => new Date(unixTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          fontSize={11} 
          tickLine={false} 
          axisLine={false} 
        />
        <YAxis 
          stroke="#a1a1aa" 
          tick={{ fill: "#71717a", fontSize: 11 }} 
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #e4e4e7",
            borderRadius: "6px",
            color: "#18181b",
          }}
          labelStyle={{ color: "#71717a" }}
        />
        <Legend 
          wrapperStyle={{ paddingTop: "10px" }}
          formatter={(value) => <span className="text-xs text-zinc-600">{value}</span>}
        />
        <Area type="monotone" dataKey="2xx" stackId="1" stroke="#18181b" fill="#18181b" fillOpacity={0.8} />
        <Area type="monotone" dataKey="3xx" stackId="1" stroke="#52525b" fill="#52525b" fillOpacity={0.8} />
        <Area type="monotone" dataKey="4xx" stackId="1" stroke="#a1a1aa" fill="#a1a1aa" fillOpacity={0.8} />
        <Area type="monotone" dataKey="5xx" stackId="1" stroke="#d4d4d8" fill="#d4d4d8" fillOpacity={0.8} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

function StatusBadge({ status }: { status: HealingStatus }) {
  switch (status) {
    case "AUTO_PATCHED":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-zinc-900 text-white">
          AUTO_PATCHED
        </span>
      )
    case "REJECTED_BY_DEV":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-medium bg-zinc-200 text-zinc-500 line-through">
          <X className="h-3 w-3" />
          REJECTED_BY_DEV
        </span>
      )
    case "CACHED_PATCH":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-transparent border border-dashed border-zinc-400 text-zinc-600">
          CACHED_PATCH
        </span>
      )
  }
}

import React, { useState, Fragment } from "react";

function HealingTable({ records, onRevert }: { records: any[], onRevert: (id: string) => void }) {
  // Add these two states INSIDE the HealingTable function now:
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Move the displayRecords logic here too:
  const displayRecords = useMemo(() => {
    return [...records]
      .reverse()
      .filter(r => 
        r.endpoint?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.status?.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [records, searchTerm]);

  return (
  <section className="mt-8 border border-zinc-200 rounded-xl bg-white shadow-sm overflow-hidden">
    {/* Header & Search Filter */}
    <div className="p-4 border-b border-zinc-200 bg-zinc-50/50 flex justify-between items-center">
      <div>
        <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-tight">AI Surgery Audit Log</h3>
        <p className="text-[10px] text-zinc-500 font-medium">Click a row to inspect the payload surgery</p>
      </div>
      <input 
        type="text" 
        placeholder="Search logs..." 
        className="text-xs border border-zinc-200 rounded-lg px-3 py-2 w-64 focus:ring-2 focus:ring-black/5 outline-none"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>

    {/*Scrollable Body */}
    <div className="max-h-[500px] overflow-y-auto scrollbar-thin">
      <table className="w-full text-left border-collapse">
        <thead className="sticky top-0 bg-white shadow-sm z-10">
          <tr className="border-b border-zinc-200 bg-zinc-50">
            <th className="w-8 px-4 py-3"></th>
            <th className="px-4 py-3 text-[10px] font-bold text-zinc-400 uppercase">Timestamp</th>
            <th className="px-4 py-3 text-[10px] font-bold text-zinc-400 uppercase">Endpoint</th>
            <th className="px-4 py-3 text-[10px] font-bold text-zinc-400 uppercase">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {displayRecords.map((record: any) => (
            <Fragment key={record.id}>
              {/* 📋 Main Row */}
              <tr 
                className={`cursor-pointer transition-colors ${expandedRow === record.id ? 'bg-zinc-50' : 'hover:bg-zinc-50/50'}`}
                onClick={() => setExpandedRow(expandedRow === record.id ? null : record.id)}
              >
                <td className="px-4 py-4 text-[10px] text-zinc-400">
                  {expandedRow === record.id ? "▼" : "▶"}
                </td>
                <td className="px-4 py-4 text-xs font-mono text-zinc-500">
                  {new Date(record.timestamp).toLocaleTimeString()}
                </td>
                <td className="px-4 py-4 text-xs font-bold text-zinc-800">{record.endpoint}</td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-0.5 text-[9px] font-black rounded border uppercase ${
                    record.status === 'AI_GENERATED_PATCH' ? 'bg-black text-white border-black' : 'bg-white text-zinc-500 border-zinc-200'
                  }`}>
                    {record.status.replace('_', ' ')}
                  </span>
                </td>
              </tr>

              {/* 🔎 Expanded Surgery Details */}
              {expandedRow === record.id && (
                <tr className="bg-zinc-50/30">
                  <td colSpan={4} className="px-8 py-6 border-t border-zinc-100 animate-in fade-in slide-in-from-top-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-[9px] font-black uppercase text-zinc-400 mb-2 tracking-widest">Detected Drift Signature</h4>
                        <div className="p-3 bg-red-50/50 border border-red-100 rounded text-[11px] font-mono text-red-700 leading-relaxed">
                          {record.driftSignature || record.detectedDrift}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-[9px] font-black uppercase text-zinc-400 mb-2 tracking-widest">Healed Response Payload</h4>
                        <pre className="p-3 bg-white border border-zinc-200 rounded text-[11px] font-mono text-zinc-700 overflow-x-auto shadow-inner">
                          {record.healedPayload}
                        </pre>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button className="text-[10px] font-bold text-zinc-400 hover:text-red-600 transition-colors uppercase">
                        Revert Surgery
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  </section>
  )
}

function ErrorChart({ data, domain }: { data: any[], domain: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
        <XAxis 
          dataKey="timestamp" 
          type="number"
          domain={domain}
          tickFormatter={(unix) => new Date(unix).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          fontSize={11} 
          tickLine={false} 
          axisLine={false} 
        />
        <YAxis fontSize={11} tickLine={false} axisLine={false} />
        
        <Tooltip 
          cursor={{ fill: '#f4f4f5' }}
          contentStyle={{ borderRadius: '8px', border: '1px solid #e4e4e7' }}
        />
        
        {/* The Legend shows what the colors mean */}
        <Legend 
          verticalAlign="bottom" 
          align="center" 
          iconType="square"
          wrapperStyle={{ fontSize: '12px', paddingBottom: '10px' }}
        />
        
        {/* Bar 1: Fresh Surgeries (Black) */}
        <Bar dataKey="AI Surgery" fill="#18181b" stackId="a" radius={[0, 0, 0, 0]} />
        
        {/* Bar 2: Cached Wins (Gray) */}
        <Bar dataKey="Cached Patch" fill="#a1a1aa" stackId="a" radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}


const CHART_COMPONENTS: Record<string, (data: any, domain: any) => React.ReactNode> = {
  "traffic-response": (data, domain) => <TrafficChart data={data} domain={domain} />,
  "traffic-method": (data, domain) => <MethodLatencyChart data={data} domain={domain} />,
  "traffic-credential": (data, domain) => <TrafficChart data={data} domain={domain} />,
  "errors-method": (data, domain) => <ErrorChart data={data} domain={domain} />,
  "errors-credential": (data, domain) => <ErrorChart data={data} domain={domain} />,
  "overall-latency": (data, domain) => <OverallLatencyChart data={data} domain={domain} />,
  "latency-response": (data, domain) => <OverallLatencyChart data={data} domain={domain} />,
  "latency-method": (data, domain) => <MethodLatencyChart data={data} domain={domain} />,
}

const CHART_TITLES: Record<string, string> = {
  "traffic-response": "Traffic by response code",
  "traffic-method": "Traffic by API method",
  "traffic-credential": "Traffic by credential",
  "errors-method": "Errors by API method",
  "errors-credential": "Errors by credential",
  "overall-latency": "Overall latency",
  "latency-response": "Latency by response code (median)",
  "latency-method": "Latency by API method (median)",
}


export default function Dashboard() {
  const params = useParams()
  const router = useRouter() 
  const projectId = params.projectId
  const [stats, setStats] = useState<any>(null)

  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeframeOption>(
    TIMEFRAME_OPTIONS.find((t) => t.label === "30 days")!
  )
  const [chartOptions, setChartOptions] = useState<ChartOption[]>(DEFAULT_CHART_OPTIONS)
  const [healingRecords, setHealingRecords] = useState<any[]>([]) 

  // --- LIVE API CONNECTION ---
  const fetchRecords = async () => {
    const rawToken = localStorage.getItem("orca_token") || "";
    const cleanToken = rawToken.replace(/^"|"$/g, '').trim();

    if (!cleanToken) return;

    try {
      const response = await fetch(`http://localhost:8080/api/metrics?projectId=${projectId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${cleanToken}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setHealingRecords(data);
      }
    } catch (err) {
      console.error("ORCA API Offline");
    }
  }

  useEffect(() => {
    const fetchDashboardStats = async () => {
      const rawToken = localStorage.getItem("orca_token") || "";
      const cleanToken = rawToken.replace(/^"|"$/g, '').trim();

      if (!cleanToken) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/api/orca/stats?projectId=${projectId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${cleanToken}`,
          'Content-Type': 'application/json'
        }
      });
        
        if (response.status === 401) {
          console.error("401 Unauthorized on Stats Endpoint.");
          // localStorage.removeItem("orca_token"); 
          // router.push("/login");
          return;
        }

        if (response.ok) {
          const data = await response.json();
          if (data && data.projectName) {
            setStats(data);
          }
        }
      } catch (err) {
        console.error("Connection failed:", err);
      }
    };

    if (projectId) {
      fetchDashboardStats();
      fetchRecords(); 
    }
  }, [projectId, router]);


  const handleRevert = async (id: string) => {
    const rawToken = localStorage.getItem("orca_token") || "";
    const cleanToken = rawToken.replace(/^"|"$/g, '').trim(); 
    if (!cleanToken) return;
    try {
      const response = await fetch(`http://localhost:8080/api/surgeries/${id}/revert`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${cleanToken}`,
          'Content-Type': 'application/json'
        }
        })
      if (response.ok) {
        setHealingRecords((records) =>
          records.map((r) => (r.id === id ? { ...r, status: "REJECTED_BY_DEV" } : r))
        )
      }
    } catch (err) { console.error(err) }
  }

  const chartDomain = useMemo(() => {
    const now = new Date().getTime();
    const startTime = now - (selectedTimeframe.value * (selectedTimeframe.unit === 'day' ? 86400000 : 3600000));
    return [startTime, now];
  }, [selectedTimeframe]);

  // --- THE DATA TRANSFORMER ---
  const realChartData = useMemo(() => {
    if (healingRecords.length === 0) return [];

    const buckets: Record<string, any> = {};
    const bucketSizeMs = 60000; 

    healingRecords.forEach((r) => {
      const time = new Date(r.timestamp).getTime();
      const bucketId = Math.floor(time / bucketSizeMs) * bucketSizeMs;
      
      if (!buckets[bucketId]) {
        buckets[bucketId] = {
          timestamp: bucketId,
          "AI Surgery": 0,   
          "Cached Patch": 0, 
        };
      }

      if (r.status === 'AI_GENERATED_PATCH' || r.status === 'AUTO_PATCHED') {
        buckets[bucketId]["AI Surgery"] += 1;
      } else {
        buckets[bucketId]["Cached Patch"] += 1;
      }
    });

    return Object.values(buckets).sort((a: any, b: any) => a.timestamp - b.timestamp);
  }, [healingRecords]);

  const getChartData = (chartId: string) => {
    return realChartData;
  }

  const selectedCharts = chartOptions.filter((o) => o.checked)

  const [searchTerm, setSearchTerm] = useState("");

  const displayRecords = useMemo(() => {
    if (!healingRecords || healingRecords.length === 0) return [];
    
    return [...healingRecords]
      .reverse()
      .filter(r => 
        r.endpoint?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.driftSignature?.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [healingRecords, searchTerm]);

  return (
    <div className="min-h-screen bg-white">
      <Header 
        projectName={stats?.projectName || "Loading..."}
        selectedTimeframe={selectedTimeframe} 
        onTimeframeChange={setSelectedTimeframe}
        chartOptions={chartOptions}
        onChartOptionsChange={setChartOptions}
      />

      <main className="p-6 space-y-6">
        {selectedCharts.length > 0 ? (
          <section className="space-y-4">
            {selectedCharts.map((chart) => (
              <FullWidthChart key={chart.id} title={CHART_TITLES[chart.id]}>
                {CHART_COMPONENTS[chart.id] 
                  ? CHART_COMPONENTS[chart.id](getChartData(chart.id), chartDomain)
                  : <div className="text-xs text-zinc-400 p-4">Chart configuration missing for: {chart.id}</div>
                }
              </FullWidthChart>
            ))}
          </section>
        ) : (
          <div className="border border-zinc-200 rounded-lg p-12 text-center text-zinc-500">
            No graphs selected.
          </div>
        )}

        <section>
          <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-4">Healing Records</h2>
          {displayRecords.length === 0 ? (
            <div className="text-zinc-400 py-10 text-center border rounded-lg border-dashed">
              No surgeries detected. System is running at 100% health.
            </div>
          ) : (
            <HealingTable records={displayRecords} onRevert={handleRevert} />
          )}
        </section>
      </main>
    </div>
  )
}