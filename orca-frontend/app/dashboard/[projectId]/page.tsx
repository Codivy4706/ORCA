"use client"

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState, Fragment } from "react"
import { Hexagon, X } from "lucide-react"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

type TimeframeOption = {
  label: string
  value: number
  unit: "hour" | "day" | "minute"
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

const TIMEFRAME_OPTIONS: TimeframeOption[] = [
  { label: "5 minutes", value: 5, unit: "minute" },
  { label: "1 hour", value: 1, unit: "hour" },
  { label: "6 hours", value: 6, unit: "hour" },
  { label: "12 hours", value: 12, unit: "hour" },
  { label: "1 day", value: 1, unit: "day" },
  { label: "7 days", value: 7, unit: "day" },
  { label: "30 days", value: 30, unit: "day" },
]

function Header({ 
  projectName,
  selectedTimeframe, 
  onTimeframeChange,
}: { 
  projectName: string
  selectedTimeframe: TimeframeOption
  onTimeframeChange: (tf: TimeframeOption) => void
}) {
  return (
    <header className="border-b border-zinc-200 px-6 py-4 flex items-center justify-between bg-white">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Hexagon className="h-8 w-8 text-zinc-900" strokeWidth={1.5} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-2 w-2 bg-zinc-900 rounded-full" />
          </div>
        </div>
        <div>
          <h1 className="text-lg font-medium tracking-tight text-zinc-900 uppercase">
            O.R.C.A. <span className="text-zinc-400">//</span> {projectName}
          </h1>
          <p className="text-xs text-zinc-500 font-mono tracking-wider">SYSTEM OPERATIONS</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        {TIMEFRAME_OPTIONS.map((option) => (
          <button
            key={option.label}
            onClick={() => onTimeframeChange(option)}
            className={`text-xs uppercase tracking-wider transition-colors ${
              selectedTimeframe.label === option.label
                ? "text-zinc-900 font-bold border-b-2 border-zinc-900 pb-1"
                : "text-zinc-400 hover:text-zinc-600 pb-1 border-b-2 border-transparent"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </header>
  )
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-zinc-200 p-3 shadow-xl min-w-[150px]">
        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-3 border-b border-zinc-100 pb-2">
          {new Date(label).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </p>
        <div className="space-y-2">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex justify-between items-center gap-6 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="font-medium text-zinc-600">{entry.name}</span>
              </div>
              <span className="font-bold text-zinc-900 font-mono">
                {entry.value}{entry.name.toLowerCase().includes("latency") ? "ms" : ""}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }
  return null;
}

function OverallLatencyChart({ data, domain }: { data: any[], domain: any[] }) {
  return (
    <div className="border border-zinc-200 bg-white">
      <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
        <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest">System Latency</h3>
        <span className="text-[10px] font-medium text-zinc-400 bg-zinc-100 px-2 py-1 rounded">P99/MEDIAN</span>
      </div>
      <div className="p-4 pt-6">
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#18181b" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#18181b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
            <XAxis 
              dataKey="timestamp" 
              type="number"        
              domain={domain} 
              allowDataOverflow={true}      
              tickFormatter={(unix) => new Date(unix).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
              tickMargin={12}
              minTickGap={60}
            />
            <YAxis 
              stroke="#a1a1aa" 
              tick={{ fill: "#a1a1aa", fontSize: 10 }} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(v) => `${v}ms`}
              tickMargin={10}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e4e4e7', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Area 
              type="monotone" // Smooths the jagged edges into a flowing curve
              name="Latency"
              dataKey="latency" 
              stroke="#18181b" 
              strokeWidth={2} 
              fill="url(#latencyGradient)" 
              activeDot={{ r: 4, strokeWidth: 0, fill: '#18181b' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function ErrorChart({ data, domain }: { data: any[], domain: any[] }) {
  return (
    <div className="border border-zinc-200 bg-white">
      <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
        <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest">AI Interventions</h3>
        <span className="text-[10px] font-medium text-zinc-400 bg-zinc-100 px-2 py-1 rounded">COUNT</span>
      </div>
      <div className="p-4 pt-6">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
            <XAxis 
              dataKey="timestamp" 
              type="number"       
              domain={domain}  
              allowDataOverflow={true}     
              tickFormatter={(unix) => new Date(unix).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
              tickMargin={12}
              minTickGap={60}
            />
            <YAxis 
              tick={{ fill: "#a1a1aa", fontSize: 10 }} 
              tickLine={false} 
              axisLine={false} 
              tickMargin={10}
              allowDecimals={false} // Prevents Recharts from showing 0.5 interventions
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f4f4f5', opacity: 0.5 }} />
            <Legend 
              verticalAlign="top" 
              align="right"
              iconType="circle"
              wrapperStyle={{ fontSize: '10px', paddingBottom: '20px', fontWeight: 600, color: '#71717a' }} 
            />
            <Bar dataKey="AI Surgery" fill="#18181b" stackId="a" maxBarSize={30} radius={[0, 0, 0, 0]} />
            <Bar dataKey="Cached Patch" fill="#a1a1aa" stackId="a" maxBarSize={30} radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function HealingTable({ records, onRevert }: { records: any[], onRevert: (id: string) => void }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  const displayRecords = useMemo(() => {
    return [...records].reverse().filter(r => 
      r.endpoint?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.status?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [records, searchTerm])

  return (
    <div className="border border-zinc-200 bg-white overflow-hidden">
      <div className="p-4 border-b border-zinc-200 bg-zinc-50 flex justify-between items-center">
        <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest">Surgery Audit Log</h3>
        <input 
          type="text" 
          placeholder="Search logs..." 
          className="text-xs border border-zinc-200 px-3 py-2 w-64 focus:ring-1 focus:ring-zinc-900 outline-none rounded-none"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="max-h-[400px] overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-white shadow-sm z-10 border-b border-zinc-200">
            <tr>
              <th className="w-8 px-4 py-3"></th>
              <th className="px-4 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Timestamp</th>
              <th className="px-4 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Endpoint</th>
              <th className="px-4 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {displayRecords.map((record: any) => (
              <Fragment key={record.id}>
                <tr 
                  className={`cursor-pointer transition-colors ${expandedRow === record.id ? 'bg-zinc-50' : 'hover:bg-zinc-50/50'}`}
                  onClick={() => setExpandedRow(expandedRow === record.id ? null : record.id)}
                >
                  <td className="px-4 py-4 text-[10px] text-zinc-400">{expandedRow === record.id ? "▼" : "▶"}</td>
                  <td className="px-4 py-4 text-xs font-mono text-zinc-500">{new Date(record.timestamp).toLocaleTimeString()}</td>
                  <td className="px-4 py-4 text-xs font-bold text-zinc-900">{record.endpoint}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 text-[9px] font-bold uppercase border ${
                      record.status === 'AI_GENERATED_PATCH' ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white text-zinc-500 border-zinc-200'
                    }`}>
                      {record.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
                {expandedRow === record.id && (
                  <tr className="bg-zinc-50">
                    <td colSpan={4} className="px-8 py-6 border-t border-zinc-200">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-[9px] font-bold uppercase text-zinc-500 mb-2 tracking-widest">Detected Drift</h4>
                          <div className="p-3 bg-white border border-zinc-200 text-[11px] font-mono text-zinc-800 break-all">
                            {record.driftSignature || record.detectedDrift}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-[9px] font-bold uppercase text-zinc-500 mb-2 tracking-widest">Healed Payload</h4>
                          <pre className="p-3 bg-zinc-900 border border-zinc-900 text-[11px] font-mono text-zinc-100 overflow-x-auto">
                            {JSON.stringify(record.healedPayload, null, 2)}
                          </pre>
                        </div>
                      </div>
                      <div className="mt-6 flex justify-end">
                        <button 
                          onClick={() => onRevert(record.id)}
                          className="text-[10px] font-bold text-zinc-500 hover:text-zinc-900 uppercase tracking-widest border border-zinc-300 px-4 py-2 hover:border-zinc-900 transition-all"
                        >
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
    </div>
  )
}

export default function Dashboard() {
  const params = useParams()
  const router = useRouter() 
  const projectId = params.projectId
  const [stats, setStats] = useState<any>(null)
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeframeOption>(TIMEFRAME_OPTIONS[5])
  const [healingRecords, setHealingRecords] = useState<any[]>([]) 
  const [liveTraffic, setLiveTraffic] = useState<any[]>([])

  const fetchRecords = async () => {
    const rawToken = localStorage.getItem("orca_token") || ""
    const cleanToken = rawToken.replace(/^"|"$/g, '').trim()
    if (!cleanToken) return

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;

      const surgeryRes = await fetch(`${baseUrl}/api/metrics?projectId=${projectId}`, {
        headers: { 'Authorization': `Bearer ${cleanToken}` }
      })
      if (surgeryRes.ok) setHealingRecords(await surgeryRes.json())

      const trafficRes = await fetch(`${baseUrl}/api/orca/traffic`, {
        headers: { 'Authorization': `Bearer ${cleanToken}` }
      })
      if (trafficRes.ok) setLiveTraffic(await trafficRes.json())
    } catch (err) {}
  } // <--- Added the missing closing brace here

  // 2. Now call hooks at the top level
  useEffect(() => {
    if (projectId) {
      fetchRecords()
      const interval = setInterval(fetchRecords, 2000)
      return () => clearInterval(interval)
    }
  }, [projectId])

  useEffect(() => {
    const fetchDashboardStats = async () => {
      const rawToken = localStorage.getItem("orca_token") || ""
      const cleanToken = rawToken.replace(/^"|"$/g, '').trim()
      if (!cleanToken) return router.push("/login")

      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${baseUrl}/api/orca/stats?projectId=${projectId}`, {
          headers: { 'Authorization': `Bearer ${cleanToken}` }
        })
        
        if (response.status === 401) return
        if (response.ok) {
          const data = await response.json()
          if (data && data.projectName) setStats(data)
        }
      } catch (err) {}
    }
    if (projectId) fetchDashboardStats()
  }, [projectId, router])

  const handleRevert = async (id: string) => {
    const rawToken = localStorage.getItem("orca_token") || ""
    const cleanToken = rawToken.replace(/^"|"$/g, '').trim()
    if (!cleanToken) return
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${baseUrl}/api/surgeries/${id}/revert`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${cleanToken}` }
      })
      
      if (response.ok) {
        setHealingRecords((records) => records.map((r) => (r.id === id ? { ...r, status: "REJECTED_BY_DEV" } : r)))
      }
    } catch (err) {}
  }

  const chartDomain = useMemo(() => {
    const now = new Date().getTime()
    let multiplier = 3600000
    if (selectedTimeframe.unit === 'day') multiplier = 86400000
    if (selectedTimeframe.unit === 'minute') multiplier = 60000
    
    const startTime = now - (selectedTimeframe.value * multiplier)
    return [startTime, now]
  }, [selectedTimeframe])

  const realChartData = useMemo(() => {
    if (liveTraffic.length === 0 && healingRecords.length === 0) return []
    const buckets: Record<string, any> = {}
    const bucketSizeMs = 1000 

    liveTraffic.forEach((t) => {
      const bucketId = Math.floor(t.timestamp / bucketSizeMs) * bucketSizeMs
      if (!buckets[bucketId]) {
        buckets[bucketId] = { timestamp: bucketId, latency: 0, "AI Surgery": 0, "Cached Patch": 0 }
      }
      buckets[bucketId].latency = Math.max(buckets[bucketId].latency, t.latency || 12)
    })

    healingRecords.forEach((r) => {
      const time = new Date(r.timestamp).getTime()
      const bucketId = Math.floor(time / bucketSizeMs) * bucketSizeMs
      if (!buckets[bucketId]) {
        buckets[bucketId] = { timestamp: bucketId, latency: 0, "AI Surgery": 0, "Cached Patch": 0 }
      }

      if (r.status === "AI_GENERATED_PATCH") {
        buckets[bucketId]["AI Surgery"] += 1
      } else if (r.status === "CACHED_PATCH" || r.status === "AUTO_PATCHED") {
        buckets[bucketId]["Cached Patch"] += 1
      }

      if (r.latency) {
        buckets[bucketId].latency = Math.max(buckets[bucketId].latency, r.latency)
      }
    })

    const [startTime, endTime] = chartDomain;
    return Object.values(buckets)
      .filter(b => b.timestamp >= startTime && b.timestamp <= endTime)
      .sort((a, b) => a.timestamp - b.timestamp)
  }, [liveTraffic, healingRecords, chartDomain]) 

  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      <Header 
        projectName={stats?.projectName || "..."}
        selectedTimeframe={selectedTimeframe} 
        onTimeframeChange={setSelectedTimeframe}
      />
      <main className="p-6 max-w-[1600px] mx-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ErrorChart data={realChartData} domain={chartDomain} />
          <OverallLatencyChart data={realChartData} domain={chartDomain} />
        </div>
        <HealingTable records={healingRecords} onRevert={handleRevert} />
      </main>
    </div>
  )
}