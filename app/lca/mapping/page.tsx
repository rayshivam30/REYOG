"use client"

import { useMemo, useState, useEffect, type ReactNode } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Factory, Flame, Zap, ArrowLeft, Leaf } from "lucide-react"

// Mock process nodes for a steel route similar to openLCA mapping
// We model a simple 1 tonne steel functional unit
// Nodes: Coke Oven -> Blast Furnace (BF) -> Basic Oxygen Furnace (BOF) ; Power Plant supplies electricity

type ElectricitySource = "grid" | "renewable"

type NodeResult = {
  id: string
  name: string
  co2: number // kg CO2-eq per t steel
  energy: number // kWh per t steel
  cost: number // $ per t steel (mock)
  inputs: string[]
  outputs: string[]
}

export default function MappingPage() {
  const [scrapShare, setScrapShare] = useState<number>(10) // percent
  const [electricitySource, setElectricitySource] = useState<ElectricitySource>("grid")
  const [compare, setCompare] = useState<boolean>(false)

  // Emission factors and mock baselines
  const electricityEF = electricitySource === "grid" ? 0.85 : 0.05 // kg CO2/kWh (mock India grid vs RE)

  // Baseline intensities for 1 t crude steel (mock numbers for demo only)
  // These are split per node; totals will shift with scrapShare and electricity EF
  const baselines = {
    cokeOven: { co2: 350, energy: 120, cost: 35 }, // coking coal processing
    blastFurnace: { co2: 1400, energy: 220, cost: 140 }, // hot metal from ore
    bof: { co2: 300, energy: 90, cost: 60 }, // steelmaking from hot metal + scrap
    power: { co2: 0, energy: 0, cost: 20 }, // cost placeholder; emissions via electricityEF * demand
  }

  // Simple scenario logic (mock):
  // - Increasing scrapShare reduces BF and BOF burdens because less hot metal is needed
  // - We cap scrap in BOF to ~30-35% in practice; for illustration we let 0-60% and scale effects
  // - Electricity emissions scale with total kWh across nodes
  const results = useMemo(() => {
    const scrapFrac = Math.min(Math.max(scrapShare / 100, 0), 0.6)

    // Scale factors: less hot metal needed as scrap increases
    const bfScale = 1 - 0.9 * scrapFrac // BF burden strongly reduced by scrap
    const bofScale = 1 - 0.5 * scrapFrac // BOF burden moderately reduced

    const coke: NodeResult = {
      id: "coke",
      name: "Coke Oven",
      co2: baselines.cokeOven.co2 * bfScale,
      energy: baselines.cokeOven.energy * bfScale,
      cost: baselines.cokeOven.cost * bfScale,
      inputs: ["Coking coal", "Electricity"],
      outputs: ["Coke", "Coke oven gas"],
    }

    const bf: NodeResult = {
      id: "bf",
      name: "Blast Furnace",
      co2: baselines.blastFurnace.co2 * bfScale,
      energy: baselines.blastFurnace.energy * bfScale,
      cost: baselines.blastFurnace.cost * bfScale,
      inputs: ["Iron ore", "Coke", "Fluxes", "Electricity"],
      outputs: ["Hot metal", "Slag", "BF gas"],
    }

    const bof: NodeResult = {
      id: "bof",
      name: "Basic Oxygen Furnace",
      co2: baselines.bof.co2 * bofScale,
      energy: baselines.bof.energy * bofScale,
      cost: baselines.bof.cost * bofScale,
      inputs: ["Hot metal", `Scrap (${Math.round(scrapFrac * 100)}%)`, "Oxygen", "Electricity"],
      outputs: ["Crude steel", "BOF slag"],
    }

    const totalProcessKWh = coke.energy + bf.energy + bof.energy
    const power: NodeResult = {
      id: "power",
      name: "Power Plant",
      co2: totalProcessKWh * electricityEF,
      energy: 0, // supplier node
      cost: baselines.power.cost + totalProcessKWh * 0.02, // mock electricity cost adder
      inputs: [electricitySource === "grid" ? "Grid electricity" : "Renewable electricity"],
      outputs: ["Electricity to process"],
    }

    const nodes: NodeResult[] = [coke, bf, bof, power]
    const totals = nodes.reduce(
      (acc, n) => ({
        co2: acc.co2 + n.co2,
        energy: acc.energy + n.energy,
        cost: acc.cost + n.cost,
      }),
      { co2: 0, energy: 0, cost: 0 }
    )

    return { nodes, totals, totalProcessKWh }
  }, [scrapShare, electricitySource])

  // Scenario B (for comparison) uses independent controls derived simply for demo
  const [scrapShareB, setScrapShareB] = useState<number>(30)
  const [electricitySourceB, setElectricitySourceB] = useState<ElectricitySource>("renewable")
  const electricityEFB = electricitySourceB === "grid" ? 0.85 : 0.05
  const resultsB = useMemo(() => {
    const scrapFrac = Math.min(Math.max(scrapShareB / 100, 0), 0.6)
    const bfScale = 1 - 0.9 * scrapFrac
    const bofScale = 1 - 0.5 * scrapFrac
    const coke = { id: "coke", name: "Coke Oven", co2: baselines.cokeOven.co2 * bfScale, energy: baselines.cokeOven.energy * bfScale, cost: baselines.cokeOven.cost * bfScale, inputs: ["Coking coal", "Electricity"], outputs: ["Coke", "Coke oven gas"] }
    const bf = { id: "bf", name: "Blast Furnace", co2: baselines.blastFurnace.co2 * bfScale, energy: baselines.blastFurnace.energy * bfScale, cost: baselines.blastFurnace.cost * bfScale, inputs: ["Iron ore", "Coke", "Fluxes", "Electricity"], outputs: ["Hot metal", "Slag", "BF gas"] }
    const bof = { id: "bof", name: "Basic Oxygen Furnace", co2: baselines.bof.co2 * bofScale, energy: baselines.bof.energy * bofScale, cost: baselines.bof.cost * bofScale, inputs: ["Hot metal", `Scrap (${Math.round(scrapFrac * 100)}%)`, "Oxygen", "Electricity"], outputs: ["Crude steel", "BOF slag"] }
    const totalProcessKWh = (coke as NodeResult).energy + (bf as NodeResult).energy + (bof as NodeResult).energy
    const power = { id: "power", name: "Power Plant", co2: totalProcessKWh * electricityEFB, energy: 0, cost: baselines.power.cost + totalProcessKWh * 0.02, inputs: [electricitySourceB === "grid" ? "Grid electricity" : "Renewable electricity"], outputs: ["Electricity to process"] }
    const nodes = [coke, bf, bof, power] as NodeResult[]
    const totals = nodes.reduce((acc, n) => ({ co2: acc.co2 + n.co2, energy: acc.energy + n.energy, cost: acc.cost + n.cost }), { co2: 0, energy: 0, cost: 0 })
    return { nodes, totals, totalProcessKWh }
  }, [scrapShareB, electricitySourceB])

  // Product System Editor (drag & drop, connect flows)
  type NodeType = "Coke Oven" | "Blast Furnace" | "BOF" | "Power Plant" | "EAF" | "NG Boiler"
  type ProcessNode = { id: string; type: NodeType; name: string; x: number; y: number }
  type Edge = { from: string; to: string; qty: number; unit?: string }

  const [nodes, setNodes] = useState<ProcessNode[]>([
    { id: "n1", type: "Coke Oven", name: "Coke Oven", x: 80, y: 60 },
    { id: "n2", type: "Blast Furnace", name: "Blast Furnace", x: 320, y: 60 },
    { id: "n3", type: "BOF", name: "BOF", x: 560, y: 60 },
    { id: "n4", type: "Power Plant", name: "Power Plant", x: 320, y: 260 },
  ])
  const [edges, setEdges] = useState<Edge[]>([
    { from: "n1", to: "n2", qty: 1, unit: "t" },
    { from: "n2", to: "n3", qty: 1, unit: "t" },
  ])
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [offset, setOffset] = useState<{ dx: number; dy: number }>({ dx: 0, dy: 0 })
  const [connectMode, setConnectMode] = useState<boolean>(false)
  const [pendingFrom, setPendingFrom] = useState<string | null>(null)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [selectedEdgeIdx, setSelectedEdgeIdx] = useState<number | null>(null)
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null)

  // Auto-load system on mount if saved exists
  useEffect(() => {
    const raw = localStorage.getItem("ps-editor")
    if (!raw) return
    try {
      const data = JSON.parse(raw)
      if (Array.isArray(data.nodes) && Array.isArray(data.edges)) {
        const normNodes = data.nodes.map((n: any) => ({
          id: String(n.id),
          type: (n.type as NodeType) || "BOF",
          name: n.name || n.type || "Node",
          x: Number(n.x) || 80,
          y: Number(n.y) || 60,
        }))
        const normEdges = data.edges.map((e: any) => ({
          from: String(e.from),
          to: String(e.to),
          qty: Number(e.qty) || 1,
          unit: e.unit || "t",
        }))
        setNodes(normNodes)
        setEdges(normEdges)
      }
    } catch {}
  }, [])

  const addNode = (type: NodeType) => {
    const id = `n${Date.now()}`
    setNodes((prev) => [...prev, { id, type, name: type, x: 120 + (prev.length % 5) * 120, y: 40 + Math.floor(prev.length / 5) * 100 }])
  }
  const onNodeMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setSelectedNodeId(id)
    if (connectMode) {
      // selecting for connection
      if (!pendingFrom) {
        setPendingFrom(id)
      } else if (pendingFrom !== id) {
        setEdges((prev) => [...prev, { from: pendingFrom, to: id, qty: 1, unit: "t" }])
        setPendingFrom(null)
      }
      return
    }
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    setDraggingId(id)
    setOffset({ dx: e.clientX - rect.left, dy: e.clientY - rect.top })
  }
  const onCanvasMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const canvas = e.currentTarget.getBoundingClientRect()
    // update mouse pos always (for connection preview)
    setMousePos({ x: e.clientX - canvas.left, y: e.clientY - canvas.top })
    if (!draggingId) return
    // Snap to 10px grid
    const xRaw = e.clientX - canvas.left - offset.dx
    const yRaw = e.clientY - canvas.top - offset.dy
    const x = Math.round(xRaw / 10) * 10
    const y = Math.round(yRaw / 10) * 10
    setNodes((prev) => prev.map((n) => (n.id === draggingId ? { ...n, x: Math.max(10, Math.min(x, canvas.width - 140)), y: Math.max(10, Math.min(y, canvas.height - 60)) } : n)))
  }
  const onCanvasMouseUp = () => setDraggingId(null)

  const onCanvasMouseDown = () => {
    if (!connectMode) {
      setSelectedNodeId(null)
      setSelectedEdgeIdx(null)
    } else if (connectMode && pendingFrom) {
      // clicking empty space cancels current pending connection
      setPendingFrom(null)
    }
  }

  // Node actions
  const renameNode = (id: string) => {
    const n = nodes.find((x) => x.id === id)
    const next = prompt("Rename node", n?.name || "")
    if (next === null) return
    setNodes((prev) => prev.map((x) => (x.id === id ? { ...x, name: next } : x)))
  }
  const changeType = (id: string, type: NodeType) => {
    setNodes((prev) => prev.map((x) => (x.id === id ? { ...x, type, name: type } : x)))
  }
  const deleteNode = (id: string) => {
    setNodes((prev) => prev.filter((x) => x.id !== id))
    setEdges((prev) => prev.filter((e) => e.from !== id && e.to !== id))
    setSelectedNodeId(null)
  }

  const deleteEdge = (idx: number) => {
    setEdges((prev) => prev.filter((_, i) => i !== idx))
    setSelectedEdgeIdx(null)
  }

  // Persistence
  const saveSystem = () => {
    const data = { nodes, edges }
    localStorage.setItem("ps-editor", JSON.stringify(data))
  }
  const loadSystem = () => {
    const raw = localStorage.getItem("ps-editor")
    if (!raw) return
    try {
      const data = JSON.parse(raw)
      if (Array.isArray(data.nodes) && Array.isArray(data.edges)) {
        setNodes(data.nodes)
        setEdges(data.edges)
      }
    } catch {}
  }
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify({ nodes, edges }, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "product-system.json"
    a.click()
    URL.revokeObjectURL(url)
  }
  const importJSON = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result))
        if (Array.isArray(data.nodes) && Array.isArray(data.edges)) {
          setNodes(data.nodes)
          setEdges(data.edges)
        }
      } catch {}
    }
    reader.readAsText(file)
  }

  // Presets
  const presetBfBof = () => {
    const presetNodes: ProcessNode[] = [
      { id: "n1", type: "Coke Oven", name: "Coke Oven", x: 80, y: 60 },
      { id: "n2", type: "Blast Furnace", name: "Blast Furnace", x: 320, y: 60 },
      { id: "n3", type: "BOF", name: "BOF", x: 560, y: 60 },
      { id: "n4", type: "Power Plant", name: "Power Plant", x: 320, y: 260 },
    ]
    const presetEdges: Edge[] = [
      { from: "n1", to: "n2", qty: 1, unit: "t" },
      { from: "n2", to: "n3", qty: 1, unit: "t" },
    ]
    setNodes(presetNodes)
    setEdges(presetEdges)
  }
  const presetEaf = () => {
    const presetNodes: ProcessNode[] = [
      { id: "n10", type: "EAF", name: "EAF", x: 400, y: 80 },
      { id: "n11", type: "Power Plant", name: "Power Plant", x: 400, y: 260 },
    ]
    const presetEdges: Edge[] = []
    setNodes(presetNodes)
    setEdges(presetEdges)
  }

  // Compute simple editor totals (flow-weighted mock): multiply node metrics by avg of incoming qty (default 1)
  const editorTotals = useMemo(() => {
    const incoming: Record<string, number[]> = {}
    edges.forEach((e) => {
      incoming[e.to] = incoming[e.to] || []
      incoming[e.to].push(e.qty || 1)
    })
    const tot = nodes.reduce(
      (acc, n) => {
        const m = nodeMetrics(n.type, "A")
        const wList = incoming[n.id]
        const w = wList && wList.length ? wList.reduce((a, b) => a + b, 0) / wList.length : 1
        return { co2: acc.co2 + m.co2 * w, energy: acc.energy + m.energy * w, cost: acc.cost + m.cost * w }
      },
      { co2: 0, energy: 0, cost: 0 }
    )
    return tot
  }, [nodes, edges, scrapShare, electricitySource])

  // Visual helpers
  const nodeColor = (t: NodeType) => {
    switch (t) {
      case "Coke Oven":
        return "from-rose-500/30 to-orange-500/30 border-rose-400/60"
      case "Blast Furnace":
        return "from-slate-500/30 to-slate-700/30 border-slate-400/60"
      case "BOF":
        return "from-emerald-500/30 to-teal-500/30 border-emerald-400/60"
      case "Power Plant":
        return "from-yellow-500/30 to-amber-500/30 border-amber-400/60"
      case "EAF":
        return "from-blue-500/30 to-cyan-500/30 border-blue-400/60"
      case "NG Boiler":
        return "from-lime-500/30 to-green-500/30 border-lime-400/60"
      default:
        return "from-muted/20 to-muted/20 border-border"
    }
  }
  const edgeStroke = (unit?: string) => {
    if (unit === "kWh") return "hsl(var(--chart-2))"
    if (unit === "kg") return "hsl(var(--chart-4))"
    return "hsl(var(--muted-foreground))"
  }

  // Simple per-node mock metrics for the editor (scenario A)
  function nodeMetrics(type: NodeType, scenario: "A" | "B") {
    const sScrap = scenario === "A" ? scrapShare : scrapShareB
    const sElecEF = scenario === "A" ? electricityEF : electricityEFB
    const scrapFrac = Math.min(Math.max(sScrap / 100, 0), 0.6)
    const bfScale = 1 - 0.9 * scrapFrac
    const bofScale = 1 - 0.5 * scrapFrac
    const base = {
      "Coke Oven": { co2: 350 * bfScale, energy: 120 * bfScale, cost: 35 * bfScale },
      "Blast Furnace": { co2: 1400 * bfScale, energy: 220 * bfScale, cost: 140 * bfScale },
      BOF: { co2: 300 * bofScale, energy: 90 * bofScale, cost: 60 * bofScale },
      "Power Plant": { co2: 0, energy: 0, cost: 20 },
      EAF: { co2: 250 * (1 - scrapFrac), energy: 450 * (1 - scrapFrac), cost: 120 * (1 - scrapFrac) },
      "NG Boiler": { co2: 120, energy: 50, cost: 30 },
    } as const
    const m = base[type]
    // electricity emissions adder for non-power nodes
    const kWh = m.energy
    const elecEm = kWh * sElecEF
    return { co2: m.co2 + (type !== "Power Plant" ? elecEm : 0), energy: kWh, cost: m.cost }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-card/30">
      <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 md:space-x-4">
            <Link href="/lca">
              <Button variant="ghost" size="sm" className="hover-lift p-2 md:px-3">
                <ArrowLeft className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Back to LCA</span>
              </Button>
            </Link>
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="h-8 w-8 md:h-10 md:w-10 bg-gradient-to-br from-primary to-chart-2 rounded-xl flex items-center justify-center shadow-lg">
                <Leaf className="h-4 w-4 md:h-6 md:w-6 text-white" />
              </div>
              <div>
                <span className="text-lg md:text-2xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                  LCA Mapping
                </span>
                <div className="text-xs text-muted-foreground hidden sm:block">Process mapping with scenarios</div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="px-2 md:px-4 py-1 md:py-2 shadow-sm text-xs">Mock Demo</Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Scenario controls */}
          <Card className="lg:col-span-4 shadow-professional border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Scenario Controls</CardTitle>
              <CardDescription>Adjust scrap share and electricity source</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Scrap share in BOF</span>
                  <span className="text-sm text-muted-foreground">{Math.round(scrapShare)}%</span>
                </div>
                <Slider
                  value={[scrapShare]}
                  min={0}
                  max={60}
                  step={1}
                  onValueChange={(v) => setScrapShare(v[0])}
                />
                <div className="text-xs text-muted-foreground mt-1">0–60% (demo)</div>
              </div>

              <div>
                <div className="mb-2 text-sm font-medium">Electricity source</div>
                <Select value={electricitySource} onValueChange={(v: ElectricitySource) => setElectricitySource(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grid">Grid (coal-heavy)</SelectItem>
                    <SelectItem value="renewable">Renewable mix</SelectItem>
                  </SelectContent>
                </Select>
                <div className="text-xs text-muted-foreground mt-1">EF: {electricityEF.toFixed(2)} kg CO₂/kWh</div>
              </div>

              <Separator className="my-2" />

              <div className="grid grid-cols-3 gap-3">
                <Card className="bg-background/70 border shadow-sm">
                  <CardContent className="p-4 text-center">
                    <div className="text-xs text-muted-foreground">Total CO₂</div>
                    <div className="text-2xl font-bold tracking-tight">{results.totals.co2.toFixed(0)} kg</div>
                  </CardContent>
                </Card>
                <Card className="bg-background/70 border shadow-sm">
                  <CardContent className="p-4 text-center">
                    <div className="text-xs text-muted-foreground">Process kWh</div>
                    <div className="text-2xl font-bold tracking-tight">{results.totalProcessKWh.toFixed(0)}</div>
                  </CardContent>
                </Card>
                <Card className="bg-background/70 border shadow-sm">
                  <CardContent className="p-4 text-center">
                    <div className="text-xs text-muted-foreground">Total Cost</div>
                    <div className="text-2xl font-bold tracking-tight">${results.totals.cost.toFixed(0)}</div>
                  </CardContent>
                </Card>
              </div>

              <Separator className="my-4" />

              <div className="flex items-center justify-between">
                <Label htmlFor="compare" className="text-sm font-medium">Compare scenarios</Label>
                <Switch id="compare" checked={compare} onCheckedChange={setCompare} />
              </div>

              {compare && (
                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Scenario B — Scrap share</span>
                        <span className="text-sm text-muted-foreground">{Math.round(scrapShareB)}%</span>
                      </div>
                      <Slider value={[scrapShareB]} min={0} max={60} step={1} onValueChange={(v) => setScrapShareB(v[0])} />
                    </div>
                    <div>
                      <div className="mb-2 text-sm font-medium">Scenario B — Electricity source</div>
                      <Select value={electricitySourceB} onValueChange={(v: ElectricitySource) => setElectricitySourceB(v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="grid">Grid (coal-heavy)</SelectItem>
                          <SelectItem value="renewable">Renewable mix</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="text-xs text-muted-foreground mt-1">EF: {electricityEFB.toFixed(2)} kg CO₂/kWh</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Card className="bg-muted/40">
                      <CardContent className="p-3 text-center">
                        <div className="text-xs text-muted-foreground">Scenario A CO₂</div>
                        <div className="text-lg font-bold">{results.totals.co2.toFixed(0)} kg</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted/40">
                      <CardContent className="p-3 text-center">
                        <div className="text-xs text-muted-foreground">Scenario B CO₂</div>
                        <div className="text-lg font-bold">{resultsB.totals.co2.toFixed(0)} kg</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Graph and breakdown */}
          <div className="lg:col-span-8 space-y-6">
            <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Process Map</CardTitle>
                <CardDescription>Coke oven → Blast furnace → BOF with power supply</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Simple SVG diagram for nodes and connections */}
                <div className="relative w-full h-[360px]">
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 360">
                    {/* Connections */}
                    <defs>
                      <marker id="arrow" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
                      </marker>
                    </defs>
                    <g stroke="currentColor" strokeWidth="2" markerEnd="url(#arrow)">
                      <line x1="160" y1="180" x2="420" y2="180" />
                      <line x1="680" y1="180" x2="880" y2="180" />
                      {/* Power to each node */}
                      <line x1="500" y1="320" x2="160" y2="220" strokeDasharray="6 6" />
                      <line x1="500" y1="320" x2="420" y2="200" strokeDasharray="6 6" />
                      <line x1="500" y1="320" x2="680" y2="200" strokeDasharray="6 6" />
                    </g>
                  </svg>

                  {/* Node cards positioned over the SVG */}
                  <div className="absolute left-[40px] top-[120px] w-[180px]">
                    <NodeCard icon={<Flame className="h-4 w-4" />} title="Coke Oven" node={results.nodes[0]} />
                  </div>
                  <div className="absolute left-[300px] top-[120px] w-[200px]">
                    <NodeCard icon={<Factory className="h-4 w-4" />} title="Blast Furnace" node={results.nodes[1]} />
                  </div>
                  <div className="absolute left-[560px] top-[120px] w-[200px]">
                    <NodeCard icon={<Factory className="h-4 w-4" />} title="BOF" node={results.nodes[2]} />
                  </div>
                  <div className="absolute left-[440px] top-[280px] w-[200px]">
                    <NodeCard icon={<Zap className="h-4 w-4" />} title="Power Plant" node={results.nodes[3]} footer={`EF ${electricityEF.toFixed(2)} kg/kWh`} />
                  </div>
                </div>

                {/* Editor totals and inspectors */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  <div className="lg:col-span-4">
                    <Card className="bg-muted/40">
                      <CardContent className="p-3 space-y-2">
                        <div className="font-semibold text-sm">System totals (A)</div>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div>
                            <div className="text-[10px] text-muted-foreground">CO₂</div>
                            <div className="text-sm font-bold">{editorTotals.co2.toFixed(0)} kg</div>
                          </div>
                          <div>
                            <div className="text-[10px] text-muted-foreground">kWh</div>
                            <div className="text-sm font-bold">{editorTotals.energy.toFixed(0)}</div>
                          </div>
                          <div>
                            <div className="text-[10px] text-muted-foreground">$</div>
                            <div className="text-sm font-bold">{editorTotals.cost.toFixed(0)}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="lg:col-span-4">
                    <Card className="bg-muted/40">
                      <CardContent className="p-3 space-y-3">
                        <div className="font-semibold text-sm">Node inspector</div>
                        {selectedNodeId ? (
                          (() => {
                            const n = nodes.find((x) => x.id === selectedNodeId)!
                            return (
                              <div className="space-y-2">
                                <div className="space-y-1">
                                  <Label className="text-xs">Name</Label>
                                  <Input value={n.name} onChange={(e) => setNodes((prev) => prev.map((x) => x.id === n.id ? { ...x, name: e.target.value } : x))} />
                                </div>
                                <div className="space-y-1">
                                  <Label className="text-xs">Type</Label>
                                  <Select value={n.type} onValueChange={(v: NodeType) => changeType(n.id, v)}>
                                    <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Coke Oven">Coke Oven</SelectItem>
                                      <SelectItem value="Blast Furnace">Blast Furnace</SelectItem>
                                      <SelectItem value="BOF">BOF</SelectItem>
                                      <SelectItem value="Power Plant">Power Plant</SelectItem>
                                      <SelectItem value="EAF">EAF</SelectItem>
                                      <SelectItem value="NG Boiler">NG Boiler</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm" onClick={() => renameNode(n.id)}>Rename…</Button>
                                  <Button variant="outline" size="sm" onClick={() => deleteNode(n.id)}>Delete</Button>
                                </div>
                              </div>
                            )
                          })()
                        ) : (
                          <div className="text-xs text-muted-foreground">Select a node to edit</div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                  <div className="lg:col-span-4">
                    <Card className="bg-muted/40">
                      <CardContent className="p-3 space-y-3">
                        <div className="font-semibold text-sm">Edges</div>
                        <div className="space-y-2 max-h-48 overflow-auto pr-1">
                          {edges.map((e, idx) => (
                            <div key={idx} className={`p-2 rounded border ${selectedEdgeIdx === idx ? "border-primary" : "border-transparent"}`} onClick={() => setSelectedEdgeIdx(idx)}>
                              <div className="flex items-center justify-between text-xs mb-1">
                                <div>{e.from} → {e.to}</div>
                                <Button variant="outline" size="sm" className="h-7 px-2 text-xs" onClick={(ev) => { ev.stopPropagation(); deleteEdge(idx) }}>Delete</Button>
                              </div>
                              <div className="flex items-center gap-2">
                                <Label className="text-[10px]">Qty</Label>
                                <Input
                                  className="h-8"
                                  type="number"
                                  value={e.qty}
                                  onChange={(ev) => {
                                    const val = parseFloat(ev.target.value || "0")
                                    setEdges((prev) => prev.map((x, i) => i === idx ? { ...x, qty: val } : x))
                                  }}
                                />
                                <Label className="text-[10px]">Unit</Label>
                                <Select value={e.unit || "t"} onValueChange={(v) => setEdges((prev) => prev.map((x, i) => i === idx ? { ...x, unit: v } : x))}>
                                  <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="t">t</SelectItem>
                                    <SelectItem value="kWh">kWh</SelectItem>
                                    <SelectItem value="kg">kg</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Per-node breakdown</CardTitle>
                <CardDescription>Mock values recomputed from scenario</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.nodes.map((n) => (
                  <Card key={n.id} className="bg-muted/40">
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold">{n.name}</div>
                        <Badge variant="outline">{n.id}</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <div className="text-xs text-muted-foreground">CO₂</div>
                          <div className="font-bold">{n.co2.toFixed(0)} kg</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Energy</div>
                          <div className="font-bold">{n.energy.toFixed(0)} kWh</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Cost</div>
                          <div className="font-bold">${n.cost.toFixed(0)}</div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">Inputs: {n.inputs.join(", ")}</div>
                      <div className="text-xs text-muted-foreground">Outputs: {n.outputs.join(", ")}</div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            {/* Product System Editor */}
            <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Product System Editor (Beta)</CardTitle>
                <CardDescription>Drag to reposition nodes. Enable connect mode to create flows. Compare scenario A/B.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => addNode("Coke Oven")}>+ Coke Oven</Button>
                  <Button variant="outline" size="sm" onClick={() => addNode("Blast Furnace")}>+ Blast Furnace</Button>
                  <Button variant="outline" size="sm" onClick={() => addNode("BOF")}>+ BOF</Button>
                  <Button variant="outline" size="sm" onClick={() => addNode("Power Plant")}>+ Power Plant</Button>
                  <Button variant="outline" size="sm" onClick={() => addNode("EAF")}>+ EAF</Button>
                  <Button variant="outline" size="sm" onClick={() => addNode("NG Boiler")}>+ NG Boiler</Button>
                  <Separator orientation="vertical" className="h-6" />
                  <div className="flex items-center gap-2">
                    <Label htmlFor="connectMode" className="text-sm">Connect mode</Label>
                    <Switch id="connectMode" checked={connectMode} onCheckedChange={(v) => { setConnectMode(v); setPendingFrom(null) }} />
                    {connectMode && <Badge variant="outline" className="ml-1">{pendingFrom ? `From: ${pendingFrom}` : "Click a node to start"}</Badge>}
                  </div>
                  <Separator orientation="vertical" className="h-6" />
                  <Button variant="outline" size="sm" onClick={presetBfBof}>Preset: BF-BOF</Button>
                  <Button variant="outline" size="sm" onClick={presetEaf}>Preset: EAF</Button>
                  <Separator orientation="vertical" className="h-6" />
                  <Button variant="outline" size="sm" onClick={saveSystem}>Save</Button>
                  <Button variant="outline" size="sm" onClick={loadSystem}>Load</Button>
                  <Button variant="outline" size="sm" onClick={exportJSON}>Export</Button>
                  <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
                    <span className="px-2 py-1 border rounded">Import</span>
                    <input type="file" accept=".json" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) importJSON(f) }} />
                  </label>
                </div>

                <div
                  className="relative w-full h-[440px] rounded-xl border bg-card/40 shadow-sm overflow-hidden"
                  style={{
                    backgroundImage: `repeating-linear-gradient(0deg, hsl(var(--muted))/0.3 0px, hsl(var(--muted))/0.3 1px, transparent 1px, transparent 20px), repeating-linear-gradient(90deg, hsl(var(--muted))/0.3 0px, hsl(var(--muted))/0.3 1px, transparent 1px, transparent 20px)`
                  }}
                  onMouseMove={onCanvasMouseMove}
                  onMouseDown={onCanvasMouseDown}
                  onMouseUp={onCanvasMouseUp}
                >
                  {/* Legend */}
                  <div className="absolute right-3 top-3 z-10 flex items-center gap-3 px-3 py-2 rounded-md bg-background/80 backdrop-blur border text-xs shadow-sm">
                    <div className="flex items-center gap-1"><span className="inline-block w-3 h-0.5" style={{ backgroundColor: 'hsl(var(--muted-foreground))' }}></span><span>material (t/kg)</span></div>
                    <div className="flex items-center gap-1"><span className="inline-block w-3 h-0.5" style={{ backgroundColor: 'hsl(var(--chart-2))' }}></span><span>energy (kWh)</span></div>
                    <div className="flex items-center gap-1"><span className="inline-block w-3 h-0.5" style={{ backgroundColor: 'hsl(var(--chart-4))' }}></span><span>mass (kg)</span></div>
                    {connectMode && <div className="text-primary font-medium">Connect: click source → target</div>}
                  </div>
                  {/* Edges */}
                  <svg className="absolute inset-0 w-full h-full">
                    <defs>
                      <marker id="ps-arrow" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
                      </marker>
                    </defs>
                    <g strokeWidth="2" markerEnd="url(#ps-arrow)" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: "pointer" }}>
                      {edges.map((e, idx) => {
                        const from = nodes.find((n) => n.id === e.from)
                        const to = nodes.find((n) => n.id === e.to)
                        if (!from || !to) return null
                        const x1 = from.x + 100
                        const y1 = from.y + 24
                        const x2 = to.x
                        const y2 = to.y + 24
                        const midX = (x1 + x2) / 2
                        const midY = (y1 + y2) / 2
                        const cx = midX
                        const cy = midY - 40 // curve offset
                        const selected = selectedEdgeIdx === idx
                        return (
                          <g key={idx} onMouseDown={(ev) => { ev.stopPropagation(); setSelectedEdgeIdx(idx) }}>
                            <path d={`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`} style={{ stroke: selected ? 'hsl(var(--primary))' : edgeStroke(e.unit), fill: 'none' }} className={selected ? "stroke-[3px]" : ""} />
                            {/* Label with background for readability */}
                            <text x={midX} y={midY - 12} textAnchor="middle" fill="white" stroke="white" strokeWidth="3" opacity="0.8" className="text-[10px]">
                              {e.qty}{e.unit ? ` ${e.unit}` : ""}
                            </text>
                            <text x={midX} y={midY - 12} textAnchor="middle" className="fill-muted-foreground text-[10px]">
                              {e.qty}{e.unit ? ` ${e.unit}` : ""}
                            </text>
                          </g>
                        )
                      })}
                      {connectMode && pendingFrom && mousePos && (() => {
                        const from = nodes.find((n) => n.id === pendingFrom)
                        if (!from) return null
                        const x1 = from.x + 100
                        const y1 = from.y + 24
                        const x2 = mousePos.x
                        const y2 = mousePos.y
                        const midX = (x1 + x2) / 2
                        const midY = (y1 + y2) / 2
                        const cx = midX
                        const cy = midY - 40
                        return <path d={`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`} strokeDasharray="4 4" style={{ stroke: 'hsl(var(--muted-foreground))', fill: 'none' }} />
                      })()}
                    </g>
                  </svg>

                  {/* Nodes */}
                  {nodes.map((n) => {
                    const mA = nodeMetrics(n.type, "A")
                    const mB = nodeMetrics(n.type, "B")
                    return (
                      <div
                        key={n.id}
                        className={`absolute w-[260px] select-none transition-transform duration-150 hover:scale-[1.01]`}
                        style={{ left: n.x, top: n.y }}
                        onMouseDown={(e) => onNodeMouseDown(e, n.id)}
                      >
                        <Card className={`shadow-xl border ${pendingFrom === n.id ? "ring-2 ring-primary" : selectedNodeId === n.id ? "ring-1 ring-border" : ""}`}>
                          <div className={`h-1.5 w-full bg-gradient-to-r ${nodeColor(n.type)} border-b`}></div>
                          <CardContent className="p-4 space-y-3 bg-card/95 backdrop-blur-sm">
                            <div className="flex items-center justify-between">
                              <div className="font-semibold text-base">{n.name}</div>
                              <Badge variant="outline" className="text-[10px]">{n.id}</Badge>
                            </div>
                            <div className="grid grid-cols-3 gap-3 text-center">
                              <div>
                                <div className="text-[11px] text-muted-foreground">CO₂</div>
                                <div className="text-lg font-semibold">{mA.co2.toFixed(0)}</div>
                              </div>
                              <div>
                                <div className="text-[11px] text-muted-foreground">kWh</div>
                                <div className="text-lg font-semibold">{mA.energy.toFixed(0)}</div>
                              </div>
                              <div>
                                <div className="text-[11px] text-muted-foreground">$</div>
                                <div className="text-lg font-semibold">{mA.cost.toFixed(0)}</div>
                              </div>
                            </div>
                            {compare && (
                              <div className="text-[11px] text-muted-foreground text-right">B CO₂: {mB.co2.toFixed(0)} (Δ {(mB.co2 - mA.co2).toFixed(0)})</div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function NodeCard({
  icon,
  title,
  node,
  footer,
}: {
  icon: ReactNode
  title: string
  node: NodeResult
  footer?: string
}) {
  return (
    <Card className="shadow-lg">
      <CardContent className="p-3 space-y-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-md bg-primary/10 text-primary">{icon}</div>
          <div className="font-semibold text-sm">{title}</div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-[10px] text-muted-foreground">CO₂</div>
            <div className="text-sm font-bold">{node.co2.toFixed(0)} kg</div>
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground">Energy</div>
            <div className="text-sm font-bold">{node.energy.toFixed(0)} kWh</div>
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground">Cost</div>
            <div className="text-sm font-bold">${node.cost.toFixed(0)}</div>
          </div>
        </div>
        {footer && <div className="text-[10px] text-muted-foreground text-right">{footer}</div>}
      </CardContent>
    </Card>
  )
}
