"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  Upload,
  FileText,
  BarChart3,
  Leaf,
  ArrowLeft,
  Edit,
  FileUp,
  Zap,
  Droplets,
  Trash2,
  TrendingDown,
  TrendingUp,
  Award,
  Factory,
  Fuel,
  Mountain,
  Recycle,
  Globe,
  Users,
  AlertTriangle,
  TreePine,
  Wind,
  Waves,
  Shield,
} from "lucide-react"
import Link from "next/link"
import { governmentDB } from "@/lib/government-database"
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts"

export default function LCAPage() {
  const [selectedMaterial, setSelectedMaterial] = useState("")
  const [analysisStep, setAnalysisStep] = useState(1)
  const [inputMethod, setInputMethod] = useState<"manual" | "document" | null>(null)
  const [lcaResults, setLcaResults] = useState<any>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  // Document upload (mock AI extraction)
  const [uploadedDoc, setUploadedDoc] = useState<string | null>(null)
  const [isParsingDoc, setIsParsingDoc] = useState(false)
  const [extractedFields, setExtractedFields] = useState<Record<string, string> | null>(null)

  // Government DB hints (mock integration)
  const [govHints, setGovHints] = useState<{ electricityEF?: number; waterStress?: number; mineralDepletion?: number }>({})

  // Preselect material from query if present (client-only)
  useEffect(() => {
    if (typeof window !== "undefined" && !selectedMaterial) {
      const sp = new URLSearchParams(window.location.search)
      const param = sp.get("material")
      if (param) setSelectedMaterial(param)
    }
  }, [selectedMaterial])

  // Fetch mock factors for hints whenever material changes
  useEffect(() => {
    let mounted = true
    async function fetchHints() {
      const electricityEF = await governmentDB.getElectricityEmissionFactor("United States")
      const waterStress = await governmentDB.getWaterStressFactor("North America")
      // Map material to mineral for depletion factor lookup
      const mineralKey = (selectedMaterial || "Aluminum").split(" ")[0]
      const mineralDepletion = await governmentDB.getMineralDepletionFactor(mineralKey)
      if (mounted) setGovHints({ electricityEF, waterStress, mineralDepletion })
    }
    fetchHints()
    return () => { mounted = false }
  }, [selectedMaterial])

  // Comprehensive LCA Form Data Structure
  const [formData, setFormData] = useState({
    // 1. Production & Operational Data
    productionVolume: "",
    operatingHours: "",
    yieldEfficiency: "",
    technology: "",
    oreGrade: "",
    functionalUnit: "",

    // 2. Energy Inputs
    electricityConsumption: "",
    gridEmissionFactor: "",
    fuelOilConsumption: "",
    coalCokeInput: "",
    naturalGasInput: "",
    renewableEnergyShare: "",
    onsiteElectricity: "",
    energyRecovery: "",

    // 3. Raw Material Inputs
    oreProcessed: "",
    concentratesUsed: "",
    limestone: "",
    dolomite: "",
    quartz: "",
    scrapMetalInput: "",
    nickel: "",
    chromium: "",
    molybdenum: "",
    zinc: "",
    coke: "",
    carbon: "",
    hydrogen: "",
    binders: "",
    reagents: "",
    catalysts: "",

    // 4. Air Emissions
    co2DirectEmissions: "",
    co2FossilFuels: "",
    ch4Emissions: "",
    n2oEmissions: "",
    so2Emissions: "",
    noxEmissions: "",
    coEmissions: "",
    pm10Emissions: "",
    pm25Emissions: "",
    vocEmissions: "",
    mercury: "",
    lead: "",
    arsenic: "",
    cadmium: "",
    pfcs: "",
    sf6: "",

    // 5. Water Inputs & Emissions
    waterWithdrawn: "",
    waterConsumed: "",
    coolingWater: "",
    processWastewater: "",
    wastewaterCOD: "",
    wastewaterBOD: "",
    heavyMetalsWastewater: "",
    nitrates: "",
    phosphates: "",
    effluentPH: "",

    // 6. Solid Waste & By-products
    overburden: "",
    tailings: "",
    slagGeneration: "",
    redMud: "",
    dustCollected: "",
    hazardousWaste: "",
    blastFurnaceGas: "",
    slagCement: "",

    // 7. Resource Use & Land
    landOccupied: "",
    landDisturbed: "",
    biodiversityImpact: "",
    waterSourceType: "",
    mineralResourceDepletion: "",
    fossilFuelDepletion: "",

    // 8. Toxicity & Human Health
    workplaceDust: "",
    workplaceHeavyMetals: "",
    dioxins: "",
    pahs: "",
    cyanides: "",
    phenols: "",

    // 9. Circularity & End-of-Life
    recycledInputShare: "",
    byproductReuse: "",
    wasteDiverted: "",
    recyclingCredit: "",
    productLifetime: "",
    productRecyclability: "",
    industrialSymbiosis: "",
  })

  const materials = [
    { name: "Aluminum", icon: "🔩", color: "from-blue-500 to-cyan-500" },
    { name: "Copper", icon: "⚡", color: "from-orange-500 to-red-500" },
    { name: "Steel", icon: "🏗️", color: "from-gray-500 to-slate-600" },
    { name: "Lithium", icon: "🔋", color: "from-green-500 to-emerald-500" },
    { name: "Gold", icon: "💰", color: "from-yellow-500 to-amber-500" },
    { name: "Silver", icon: "✨", color: "from-gray-400 to-slate-500" },
    { name: "Iron", icon: "⚙️", color: "from-red-600 to-orange-600" },
    { name: "Zinc", icon: "🔧", color: "from-indigo-500 to-purple-500" },
    { name: "Nickel", icon: "🪙", color: "from-teal-500 to-cyan-500" },
    { name: "Lead", icon: "🔩", color: "from-gray-600 to-slate-700" },
  ]

  const technologies = [
    "Blast Furnace",
    "Electric Arc Furnace", 
    "Hydrometallurgy",
    "Pyrometallurgy",
    "Electrowinning",
    "Solvent Extraction",
    "Flotation",
    "Leaching",
    "Smelting",
    "Roasting",
    "Calcination",
    "Electrolysis"
  ]

  const waterSourceTypes = [
    "River Water",
    "Groundwater",
    "Desalinated Water",
    "Recycled Water",
    "Municipal Supply",
    "Surface Water"
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleDocumentUpload = (file: File) => {
    setUploadedDoc(file.name)
    setIsParsingDoc(true)
    // Simulate AI extraction and prefilling a few fields
    setTimeout(() => {
      const mock = {
        productionVolume: "10000",
        operatingHours: "8760",
        electricityConsumption: "1500",
        gridEmissionFactor: "0.5",
        oreProcessed: "250000",
        scrapMetalInput: "35",
      }
      // Prefill form with extracted values
      Object.entries(mock).forEach(([k, v]) => handleInputChange(k, v as string))
      setExtractedFields(mock)
      setIsParsingDoc(false)
    }, 2000)
  }

  // Mock LCA Calculation Results
  const mockLCAResults = {
    // Core Impact Categories
    climateChange: {
      gwp: 2450.5, // kg CO2-eq
      breakdown: {
        directEmissions: 1200.3,
        fossilFuels: 890.2,
        electricity: 360.0
      }
    },
    airPollution: {
      acidification: 12.8, // kg SO2-eq
      ozoneCreation: 3.4, // kg C2H4-eq
      particulateMatter: 8.9, // kg PM2.5-eq
      ozoneDepletion: 0.0012 // kg CFC-11-eq
    },
    waterImpacts: {
      eutrophication: 5.6, // kg PO4-eq
      freshwaterEcotoxicity: 234.7, // kg 1,4-DCB-eq
      marineEcotoxicity: 189.3, // kg 1,4-DCB-eq
      waterScarcity: 45.2 // m3 water-eq
    },
    humanHealth: {
      toxicityPotential: 456.8, // kg 1,4-DCB-eq
      respiratoryInorganics: 0.0034, // DALYs
      occupationalRisk: "Medium"
    },
    resourceDepletion: {
      mineralDepletion: 0.89, // kg Sb-eq
      fossilFuelDepletion: 1250.4, // MJ
      waterDepletion: 67.3, // m3-eq
      landUse: 0.45 // ha·year
    },
    biodiversity: {
      terrestrialEcotoxicity: 123.4, // kg 1,4-DCB-eq
      landUseChange: 0.0023, // PDF·m²·year
      habitatAlteration: "Low-Medium"
    },
    // Circularity Metrics
    circularityIndicators: {
      materialCircularity: 0.65, // 0-1 scale
      wasteToResource: 0.78,
      recyclingRate: 0.82,
      byproductUtilization: 0.71
    },
    // Comparison: Conventional vs Sustainable
    comparison: {
      conventional: {
        co2: 2450.5,
        energy: 15600,
        water: 234.5,
        waste: 890.2
      },
      sustainable: {
        co2: 1680.3, // 31% reduction
        energy: 11200, // 28% reduction
        water: 167.8, // 28% reduction
        waste: 534.1 // 40% reduction
      }
    }
  }

  const calculateLCA = () => {
    setIsCalculating(true)
    // Simulate calculation time
    setTimeout(() => {
      setLcaResults(mockLCAResults)
      setIsCalculating(false)
      setAnalysisStep(4)
    }, 3000)
  }

  // Chart data
  const impactComparisonData = [
    { category: 'Climate Change', conventional: 2450, sustainable: 1680, unit: 'kg CO₂-eq' },
    { category: 'Energy Use', conventional: 15600, sustainable: 11200, unit: 'MJ' },
    { category: 'Water Use', conventional: 234, sustainable: 168, unit: 'm³' },
    { category: 'Waste Gen.', conventional: 890, sustainable: 534, unit: 'kg' },
  ]

  const radarData = [
    { subject: 'Climate', conventional: 85, sustainable: 60 },
    { subject: 'Water', conventional: 78, sustainable: 55 },
    { subject: 'Air Quality', conventional: 82, sustainable: 58 },
    { subject: 'Resources', conventional: 88, sustainable: 62 },
    { subject: 'Toxicity', conventional: 75, sustainable: 48 },
    { subject: 'Land Use', conventional: 70, sustainable: 45 },
  ]

  const circularityData = [
    { name: 'Material Circularity', value: 65 },
    { name: 'Waste to Resource', value: 78 },
    { name: 'Recycling Rate', value: 82 },
    { name: 'Byproduct Utilization', value: 71 },
  ]

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-card/30">
      <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 md:space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="hover-lift p-2 md:px-3">
                <ArrowLeft className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Back to Home</span>
              </Button>
            </Link>
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="h-8 w-8 md:h-10 md:w-10 bg-gradient-to-br from-primary to-chart-2 rounded-xl flex items-center justify-center shadow-lg">
                <Leaf className="h-4 w-4 md:h-6 md:w-6 text-white" />
              </div>
              <div>
                <span className="text-lg md:text-2xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                  LCA Analysis
                </span>
                <div className="text-xs text-muted-foreground hidden sm:block">Life Cycle Assessment Platform</div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/lca/mapping">
              <Button variant="outline" size="sm" className="hover-lift">Mapping</Button>
            </Link>
            <Badge variant="secondary" className="px-2 md:px-4 py-1 md:py-2 shadow-sm text-xs">
              <Award className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">ISO 14040 Compliant</span>
              <span className="sm:hidden">ISO 14040</span>
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 md:mb-8 animate-fade-in-up">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 space-y-2 md:space-y-0">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-balance">Life Cycle Assessment Wizard</h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  Complete environmental impact analysis following ISO 14040 guidelines
                </p>
              </div>
              <div className="text-left md:text-right">
                <div className="text-sm font-medium mb-1">Analysis Progress</div>
                <div className="text-xl md:text-2xl font-bold text-primary">{analysisStep}/4</div>
              </div>
            </div>
            <Progress value={(analysisStep / 4) * 100} className="h-2 md:h-3 shadow-sm" />
          </div>

          <Tabs value={`step-${analysisStep}`} className="space-y-6 md:space-y-8">
            <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-card/50 backdrop-blur-sm shadow-sm">
              <TabsTrigger
                value="step-1"
                onClick={() => setAnalysisStep(1)}
                className="flex flex-col py-2 md:py-3 px-1 md:px-2 text-xs"
              >
                <span className="font-medium">Material</span>
                <span className="text-xs opacity-70 hidden sm:inline">Selection</span>
              </TabsTrigger>
              <TabsTrigger
                value="step-2"
                onClick={() => setAnalysisStep(2)}
                className="flex flex-col py-2 md:py-3 px-1 md:px-2 text-xs"
              >
                <span className="font-medium">Input</span>
                <span className="text-xs opacity-70 hidden sm:inline">Method</span>
              </TabsTrigger>
              <TabsTrigger
                value="step-3"
                onClick={() => setAnalysisStep(3)}
                className="flex flex-col py-2 md:py-3 px-1 md:px-2 text-xs"
              >
                <span className="font-medium">Data</span>
                <span className="text-xs opacity-70 hidden sm:inline">Entry</span>
              </TabsTrigger>
              <TabsTrigger
                value="step-4"
                onClick={() => setAnalysisStep(4)}
                className="flex flex-col py-2 md:py-3 px-1 md:px-2 text-xs"
              >
                <span className="font-medium">Results</span>
                <span className="text-xs opacity-70 hidden sm:inline">Analysis</span>
              </TabsTrigger>
            </TabsList>

            {/* Step 1: Material Selection */}
            <TabsContent value="step-1" className="space-y-6 animate-fade-in-up">
              <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
                <CardHeader className="pb-4 md:pb-6">
                  <CardTitle className="text-xl md:text-2xl">Select Material/Mineral</CardTitle>
                  <CardDescription className="text-sm md:text-base">
                    Choose the primary material for your comprehensive LCA analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                    {materials.map((material) => (
                      <Card
                        key={material.name}
                        className={`cursor-pointer hover-lift transition-all duration-300 border-0 overflow-hidden ${
                          selectedMaterial === material.name ? "ring-2 ring-primary shadow-xl" : "shadow-lg"
                        }`}
                        onClick={() => setSelectedMaterial(material.name)}
                      >
                        <div className={`h-1 md:h-2 bg-gradient-to-r ${material.color}`}></div>
                        <CardContent className="p-3 md:p-4 text-center">
                          <div className="text-2xl md:text-3xl mb-1 md:mb-2 group-hover:scale-110 transition-transform">
                            {material.icon}
                          </div>
                          <div className="font-semibold text-xs md:text-sm">{material.name}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {selectedMaterial && (
                    <div className="mt-6 md:mt-8 text-center animate-slide-in-right">
                      <div className="mb-4">
                        <Badge variant="secondary" className="px-3 md:px-4 py-1 md:py-2 text-xs md:text-sm">
                          Selected: {selectedMaterial}
                        </Badge>
                      </div>
                      <Button
                        size="lg"
                        onClick={() => setAnalysisStep(2)}
                        className="w-full sm:w-auto shadow-lg hover-lift"
                      >
                        Continue with {selectedMaterial}
                        <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Step 2: Input Method Selection */}
            <TabsContent value="step-2" className="space-y-6 animate-fade-in-up">
              <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
                <CardHeader className="pb-4 md:pb-6">
                  <CardTitle className="text-xl md:text-2xl">Choose Input Method</CardTitle>
                  <CardDescription className="text-sm md:text-base">
                    Select how you want to provide your LCA data for analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <Card
                      className={`cursor-pointer hover-lift transition-all duration-300 border-0 shadow-lg overflow-hidden ${
                        inputMethod === "manual" ? "ring-2 ring-primary shadow-xl" : ""
                      }`}
                      onClick={() => setInputMethod("manual")}
                    >
                      <div className="h-1 md:h-2 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                      <CardContent className="p-6 md:p-8 text-center">
                        <div className="mb-4 md:mb-6 p-3 md:p-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl w-fit mx-auto shadow-lg">
                          <Edit className="h-6 w-6 md:h-8 md:w-8 text-white" />
                        </div>
                        <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">Manual Data Entry</h3>
                        <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6 leading-relaxed">
                          Enter production data, energy consumption, and operational parameters manually through guided forms
                        </p>
                        <div className="bg-muted/50 rounded-lg p-3 md:p-4">
                          <ul className="text-xs md:text-sm text-muted-foreground text-left space-y-1 md:space-y-2">
                            <li className="flex items-center">
                              <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary rounded-full mr-2"></span>Production volumes and operational data
                            </li>
                            <li className="flex items-center">
                              <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary rounded-full mr-2"></span>Energy consumption patterns
                            </li>
                            <li className="flex items-center">
                              <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary rounded-full mr-2"></span>Resource usage and waste generation
                            </li>
                            <li className="flex items-center">
                              <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary rounded-full mr-2"></span>Technology specifications
                            </li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>

                    <Card
                      className={`cursor-pointer hover-lift transition-all duration-300 border-0 shadow-lg overflow-hidden ${
                        inputMethod === "document" ? "ring-2 ring-primary shadow-xl" : ""
                      }`}
                      onClick={() => setInputMethod("document")}
                    >
                      <div className="h-1 md:h-2 bg-gradient-to-r from-green-500 to-emerald-500"></div>
                      <CardContent className="p-6 md:p-8 text-center">
                        <div className="mb-4 md:mb-6 p-3 md:p-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl w-fit mx-auto shadow-lg">
                          <FileUp className="h-6 w-6 md:h-8 md:w-8 text-white" />
                        </div>
                        <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">Document Upload</h3>
                        <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6 leading-relaxed">
                          Upload documents for AI-powered data extraction and automated analysis processing
                        </p>
                        <div className="bg-muted/50 rounded-lg p-3 md:p-4">
                          <ul className="text-xs md:text-sm text-muted-foreground text-left space-y-1 md:space-y-2">
                            <li className="flex items-center">
                              <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary rounded-full mr-2"></span>Production reports and specifications
                            </li>
                            <li className="flex items-center">
                              <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary rounded-full mr-2"></span>Environmental monitoring data
                            </li>
                            <li className="flex items-center">
                              <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary rounded-full mr-2"></span>Energy consumption records
                            </li>
                            <li className="flex items-center">
                              <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary rounded-full mr-2"></span>Technical documentation
                            </li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {inputMethod && (
                    <div className="mt-6 md:mt-8 text-center animate-slide-in-right">
                      <div className="mb-4">
                        <Badge variant="secondary" className="px-3 md:px-4 py-1 md:py-2 text-xs md:text-sm">
                          Method: {inputMethod === "manual" ? "Manual Entry" : "Document Upload"}
                        </Badge>
                      </div>

                      {inputMethod === "document" && (
                        <div className="mb-6 text-left space-y-4">
                          <div className="p-4 rounded-lg bg-muted/40">
                            <div className="font-medium mb-2">Upload production/report document</div>
                            <div className="text-sm text-muted-foreground mb-3">PDF, DOCX, XLSX, CSV up to 10MB</div>
                            <label className="inline-flex items-center px-4 py-2 rounded-md border cursor-pointer shadow-sm">
                              <Upload className="h-4 w-4 mr-2" />
                              <span>{uploadedDoc ? `Replace file (${uploadedDoc})` : "Choose file"}</span>
                              <input
                                type="file"
                                accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  if (file) handleDocumentUpload(file)
                                }}
                              />
                            </label>

                            {isParsingDoc && (
                              <div className="mt-4 text-sm">
                                <div className="font-medium mb-1">AI extracting key fields...</div>
                                <Progress value={70} className="h-2" />
                              </div>
                            )}

                            {extractedFields && !isParsingDoc && (
                              <div className="mt-4">
                                <div className="font-medium mb-2">Extracted fields</div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                  {Object.entries(extractedFields).map(([k, v]) => (
                                    <div key={k} className="flex justify-between bg-card/60 px-3 py-2 rounded">
                                      <span className="text-muted-foreground">{k}</span>
                                      <span className="font-medium">{v}</span>
                                    </div>
                                  ))}
                                </div>
                                <div className="text-xs text-muted-foreground mt-2">You can review and edit values in the next step.</div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <Button
                        size="lg"
                        onClick={() => setAnalysisStep(3)}
                        className="w-full sm:w-auto shadow-lg hover-lift"
                      >
                        Continue with {inputMethod === "manual" ? "Manual Entry" : "Document Upload"}
                        <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setAnalysisStep(1)} className="shadow-sm hover-lift">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Previous Step</span>
                  <span className="sm:hidden">Previous</span>
                </Button>
              </div>
            </TabsContent>     
       {/* Step 3: Comprehensive Data Entry */}
            <TabsContent value="step-3" className="space-y-6 animate-fade-in-up">
              {inputMethod === "manual" ? (
                <div className="space-y-8">
                  {/* Production & Operational Data */}
                  <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
                    <CardHeader className="pb-6">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                          <Factory className="h-5 w-5 text-white" />
                        </div>
                        <CardTitle className="text-xl">1. Production & Operational Data</CardTitle>
                      </div>
                      <CardDescription>
                        Enter your facility's operational parameters and production metrics
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="production-volume">Annual Production Volume (t/yr)</Label>
                          <Input
                            id="production-volume"
                            type="number"
                            placeholder="10,000"
                            value={formData.productionVolume}
                            onChange={(e) => handleInputChange("productionVolume", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="operating-hours">Plant Operating Hours (h/yr)</Label>
                          <Input
                            id="operating-hours"
                            type="number"
                            placeholder="8,760"
                            value={formData.operatingHours}
                            onChange={(e) => handleInputChange("operatingHours", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="yield-efficiency">Yield/Efficiency (%)</Label>
                          <Input
                            id="yield-efficiency"
                            type="number"
                            placeholder="85"
                            value={formData.yieldEfficiency}
                            onChange={(e) => handleInputChange("yieldEfficiency", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="technology">Technology Type</Label>
                          <Select
                            value={formData.technology}
                            onValueChange={(value) => handleInputChange("technology", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select technology" />
                            </SelectTrigger>
                            <SelectContent>
                              {technologies.map((tech) => (
                                <SelectItem key={tech} value={tech}>
                                  {tech}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ore-grade">Ore Grade (%)</Label>
                          <Input
                            id="ore-grade"
                            type="number"
                            placeholder="2.5"
                            value={formData.oreGrade}
                            onChange={(e) => handleInputChange("oreGrade", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="functional-unit">Functional Unit</Label>
                          <Input
                            id="functional-unit"
                            placeholder="per 1 tonne product"
                            value={formData.functionalUnit}
                            onChange={(e) => handleInputChange("functionalUnit", e.target.value)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Energy Inputs */}
                  <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
                    <CardHeader className="pb-6">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg">
                          <Zap className="h-5 w-5 text-white" />
                        </div>
                        <CardTitle className="text-xl">2. Energy Inputs</CardTitle>
                      </div>
                      <CardDescription>
                        Specify energy consumption patterns and sources
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="electricity">Grid Electricity Consumption (kWh/t)</Label>
                          <Input
                            id="electricity"
                            type="number"
                            placeholder="1,500"
                            value={formData.electricityConsumption}
                            onChange={(e) => handleInputChange("electricityConsumption", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="emission-factor">Grid Emission Factor (kg CO₂/kWh)</Label>
                          <Input
                            id="emission-factor"
                            type="number"
                            placeholder="0.5"
                            value={formData.gridEmissionFactor}
                            onChange={(e) => handleInputChange("gridEmissionFactor", e.target.value)}
                          />
                          {govHints.electricityEF !== undefined && (
                            <div className="text-xs text-muted-foreground mt-1">
                              Suggested (gov): <span className="font-medium">{(govHints.electricityEF/1000).toFixed(3)}</span> kg CO₂/kWh
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fuel-oil">Fuel Oil Consumption (L/t)</Label>
                          <Input
                            id="fuel-oil"
                            type="number"
                            placeholder="50"
                            value={formData.fuelOilConsumption}
                            onChange={(e) => handleInputChange("fuelOilConsumption", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="coal-coke">Coal/Coke Input (kg/t)</Label>
                          <Input
                            id="coal-coke"
                            type="number"
                            placeholder="200"
                            value={formData.coalCokeInput}
                            onChange={(e) => handleInputChange("coalCokeInput", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="natural-gas">Natural Gas Input (Nm³/t)</Label>
                          <Input
                            id="natural-gas"
                            type="number"
                            placeholder="100"
                            value={formData.naturalGasInput}
                            onChange={(e) => handleInputChange("naturalGasInput", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="renewable">Renewable Energy Share (%)</Label>
                          <Input
                            id="renewable"
                            type="number"
                            placeholder="15"
                            value={formData.renewableEnergyShare}
                            onChange={(e) => handleInputChange("renewableEnergyShare", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="onsite-electricity">On-site Generated Electricity (MWh/yr)</Label>
                          <Input
                            id="onsite-electricity"
                            type="number"
                            placeholder="500"
                            value={formData.onsiteElectricity}
                            onChange={(e) => handleInputChange("onsiteElectricity", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="energy-recovery">Energy Recovery from Waste Gases (MJ/yr)</Label>
                          <Input
                            id="energy-recovery"
                            type="number"
                            placeholder="2000"
                            value={formData.energyRecovery}
                            onChange={(e) => handleInputChange("energyRecovery", e.target.value)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Raw Material Inputs */}
                  <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
                    <CardHeader className="pb-6">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
                          <Mountain className="h-5 w-5 text-white" />
                        </div>
                        <CardTitle className="text-xl">3. Raw Material Inputs</CardTitle>
                      </div>
                      <CardDescription>
                        Critical metallurgy inputs including ores, concentrates, and additives
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="ore-processed">Ore Mined/Processed (t/yr)</Label>
                          <Input
                            id="ore-processed"
                            type="number"
                            placeholder="50,000"
                            value={formData.oreProcessed}
                            onChange={(e) => handleInputChange("oreProcessed", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="concentrates">Concentrates Used (t/yr)</Label>
                          <Input
                            id="concentrates"
                            type="number"
                            placeholder="15,000"
                            value={formData.concentratesUsed}
                            onChange={(e) => handleInputChange("concentratesUsed", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="scrap-metal">Scrap/Recycled Metal Input (%)</Label>
                          <Input
                            id="scrap-metal"
                            type="number"
                            placeholder="25"
                            value={formData.scrapMetalInput}
                            onChange={(e) => handleInputChange("scrapMetalInput", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="limestone">Limestone (kg/t product)</Label>
                          <Input
                            id="limestone"
                            type="number"
                            placeholder="300"
                            value={formData.limestone}
                            onChange={(e) => handleInputChange("limestone", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dolomite">Dolomite (kg/t product)</Label>
                          <Input
                            id="dolomite"
                            type="number"
                            placeholder="150"
                            value={formData.dolomite}
                            onChange={(e) => handleInputChange("dolomite", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="quartz">Quartz (kg/t product)</Label>
                          <Input
                            id="quartz"
                            type="number"
                            placeholder="100"
                            value={formData.quartz}
                            onChange={(e) => handleInputChange("quartz", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="nickel">Nickel (kg/t product)</Label>
                          <Input
                            id="nickel"
                            type="number"
                            placeholder="5"
                            value={formData.nickel}
                            onChange={(e) => handleInputChange("nickel", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="chromium">Chromium (kg/t product)</Label>
                          <Input
                            id="chromium"
                            type="number"
                            placeholder="8"
                            value={formData.chromium}
                            onChange={(e) => handleInputChange("chromium", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="molybdenum">Molybdenum (kg/t product)</Label>
                          <Input
                            id="molybdenum"
                            type="number"
                            placeholder="2"
                            value={formData.molybdenum}
                            onChange={(e) => handleInputChange("molybdenum", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="mineral-depletion">Mineral Resource Depletion (kg Sb-eq)</Label>
                          <Input
                            id="mineral-depletion"
                            type="number"
                            placeholder="0.001"
                            value={formData.mineralResourceDepletion}
                            onChange={(e) => handleInputChange("mineralResourceDepletion", e.target.value)}
                          />
                          {govHints.mineralDepletion !== undefined && (
                            <div className="text-xs text-muted-foreground mt-1">
                              Reference factor for {selectedMaterial || materialParam}: <span className="font-medium">{govHints.mineralDepletion}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Air Emissions */}
                  <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
                    <CardHeader className="pb-6">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg">
                          <Wind className="h-5 w-5 text-white" />
                        </div>
                        <CardTitle className="text-xl">4. Air Emissions</CardTitle>
                      </div>
                      <CardDescription>
                        Atmospheric emissions from production processes
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="co2-direct">CO₂ Direct Process Emissions (kg/t)</Label>
                          <Input
                            id="co2-direct"
                            type="number"
                            placeholder="1200"
                            value={formData.co2DirectEmissions}
                            onChange={(e) => handleInputChange("co2DirectEmissions", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="co2-fossil">CO₂ from Fossil Fuels (kg/t)</Label>
                          <Input
                            id="co2-fossil"
                            type="number"
                            placeholder="800"
                            value={formData.co2FossilFuels}
                            onChange={(e) => handleInputChange("co2FossilFuels", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ch4">CH₄ Emissions (kg/t)</Label>
                          <Input
                            id="ch4"
                            type="number"
                            placeholder="0.5"
                            value={formData.ch4Emissions}
                            onChange={(e) => handleInputChange("ch4Emissions", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="n2o">N₂O Emissions (kg/t)</Label>
                          <Input
                            id="n2o"
                            type="number"
                            placeholder="0.2"
                            value={formData.n2oEmissions}
                            onChange={(e) => handleInputChange("n2oEmissions", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="so2">SO₂ Emissions (kg/t)</Label>
                          <Input
                            id="so2"
                            type="number"
                            placeholder="5"
                            value={formData.so2Emissions}
                            onChange={(e) => handleInputChange("so2Emissions", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="nox">NOx Emissions (kg/t)</Label>
                          <Input
                            id="nox"
                            type="number"
                            placeholder="3"
                            value={formData.noxEmissions}
                            onChange={(e) => handleInputChange("noxEmissions", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="pm10">PM10 Emissions (kg/t)</Label>
                          <Input
                            id="pm10"
                            type="number"
                            placeholder="2"
                            value={formData.pm10Emissions}
                            onChange={(e) => handleInputChange("pm10Emissions", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="pm25">PM2.5 Emissions (kg/t)</Label>
                          <Input
                            id="pm25"
                            type="number"
                            placeholder="1.5"
                            value={formData.pm25Emissions}
                            onChange={(e) => handleInputChange("pm25Emissions", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="voc">VOCs (kg/t)</Label>
                          <Input
                            id="voc"
                            type="number"
                            placeholder="0.8"
                            value={formData.vocEmissions}
                            onChange={(e) => handleInputChange("vocEmissions", e.target.value)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Water Inputs & Emissions */}
                  <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
                    <CardHeader className="pb-6">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg">
                          <Droplets className="h-5 w-5 text-white" />
                        </div>
                        <CardTitle className="text-xl">5. Water Inputs & Emissions</CardTitle>
                      </div>
                      <CardDescription>
                        Water usage patterns and wastewater characteristics
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="water-withdrawn">Water Withdrawn (m³/t)</Label>
                          <Input
                            id="water-withdrawn"
                            type="number"
                            placeholder="25"
                            value={formData.waterWithdrawn}
                            onChange={(e) => handleInputChange("waterWithdrawn", e.target.value)}
                          />
                          {govHints.waterStress !== undefined && (
                            <div className="text-xs text-muted-foreground mt-1">
                              Regional water stress factor (gov): <span className="font-medium">{govHints.waterStress}</span>
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="water-consumed">Water Consumed (m³/t)</Label>
                          <Input
                            id="water-consumed"
                            type="number"
                            placeholder="15"
                            value={formData.waterConsumed}
                            onChange={(e) => handleInputChange("waterConsumed", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cooling-water">Cooling Water Used (m³/yr)</Label>
                          <Input
                            id="cooling-water"
                            type="number"
                            placeholder="100000"
                            value={formData.coolingWater}
                            onChange={(e) => handleInputChange("coolingWater", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="wastewater">Process Wastewater Generated (m³/t)</Label>
                          <Input
                            id="wastewater"
                            type="number"
                            placeholder="20"
                            value={formData.processWastewater}
                            onChange={(e) => handleInputChange("processWastewater", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cod">Wastewater COD (kg/t)</Label>
                          <Input
                            id="cod"
                            type="number"
                            placeholder="5"
                            value={formData.wastewaterCOD}
                            onChange={(e) => handleInputChange("wastewaterCOD", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bod">Wastewater BOD (kg/t)</Label>
                          <Input
                            id="bod"
                            type="number"
                            placeholder="3"
                            value={formData.wastewaterBOD}
                            onChange={(e) => handleInputChange("wastewaterBOD", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="water-source">Water Source Type</Label>
                          <Select
                            value={formData.waterSourceType}
                            onValueChange={(value) => handleInputChange("waterSourceType", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select water source" />
                            </SelectTrigger>
                            <SelectContent>
                              {waterSourceTypes.map((source) => (
                                <SelectItem key={source} value={source}>
                                  {source}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Solid Waste & By-products */}
                  <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
                    <CardHeader className="pb-6">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-gradient-to-br from-gray-600 to-slate-600 rounded-lg">
                          <Trash2 className="h-5 w-5 text-white" />
                        </div>
                        <CardTitle className="text-xl">6. Solid Waste & By-products</CardTitle>
                      </div>
                      <CardDescription>
                        Waste generation and recoverable by-products
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="overburden">Overburden/Waste Rock (t/yr)</Label>
                          <Input
                            id="overburden"
                            type="number"
                            placeholder="200000"
                            value={formData.overburden}
                            onChange={(e) => handleInputChange("overburden", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tailings">Tailings Generated (t/t ore)</Label>
                          <Input
                            id="tailings"
                            type="number"
                            placeholder="0.8"
                            value={formData.tailings}
                            onChange={(e) => handleInputChange("tailings", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="slag">Slag Generation (kg/t product)</Label>
                          <Input
                            id="slag"
                            type="number"
                            placeholder="400"
                            value={formData.slagGeneration}
                            onChange={(e) => handleInputChange("slagGeneration", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="hazardous">Hazardous Waste (kg/t)</Label>
                          <Input
                            id="hazardous"
                            type="number"
                            placeholder="10"
                            value={formData.hazardousWaste}
                            onChange={(e) => handleInputChange("hazardousWaste", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dust">Dust Collected (kg/t)</Label>
                          <Input
                            id="dust"
                            type="number"
                            placeholder="15"
                            value={formData.dustCollected}
                            onChange={(e) => handleInputChange("dustCollected", e.target.value)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Circularity & End-of-Life */}
                  <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
                    <CardHeader className="pb-6">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-gradient-to-br from-green-600 to-teal-600 rounded-lg">
                          <Recycle className="h-5 w-5 text-white" />
                        </div>
                        <CardTitle className="text-xl">7. Circularity & End-of-Life</CardTitle>
                      </div>
                      <CardDescription>
                        Circular economy indicators and end-of-life considerations
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="recycled-input">Share of Recycled Input (%)</Label>
                          <Input
                            id="recycled-input"
                            type="number"
                            placeholder="25"
                            value={formData.recycledInputShare}
                            onChange={(e) => handleInputChange("recycledInputShare", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="byproduct-reuse">Reuse of By-products (kg/t product)</Label>
                          <Input
                            id="byproduct-reuse"
                            type="number"
                            placeholder="300"
                            value={formData.byproductReuse}
                            onChange={(e) => handleInputChange("byproductReuse", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="waste-diverted">Waste Diverted from Landfill (%)</Label>
                          <Input
                            id="waste-diverted"
                            type="number"
                            placeholder="80"
                            value={formData.wasteDiverted}
                            onChange={(e) => handleInputChange("wasteDiverted", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="product-lifetime">Lifetime of Product (years)</Label>
                          <Input
                            id="product-lifetime"
                            type="number"
                            placeholder="50"
                            value={formData.productLifetime}
                            onChange={(e) => handleInputChange("productLifetime", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="recyclability">Recyclability of Final Product (%)</Label>
                          <Input
                            id="recyclability"
                            type="number"
                            placeholder="95"
                            value={formData.productRecyclability}
                            onChange={(e) => handleInputChange("productRecyclability", e.target.value)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-between items-center pt-6">
                    <Button variant="outline" onClick={() => setAnalysisStep(2)} className="shadow-sm hover-lift">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Previous Step
                    </Button>
                    <Button 
                      size="lg" 
                      onClick={calculateLCA}
                      className="shadow-lg hover-lift bg-gradient-to-r from-primary to-chart-2"
                    >
                      Calculate LCA Results
                      <BarChart3 className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : inputMethod === "document" ? (
                <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
                  <CardHeader className="pb-6">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg">
                        <FileUp className="h-5 w-5 text-white" />
                      </div>
                      <CardTitle className="text-xl">Document Upload & AI Processing</CardTitle>
                    </div>
                    <CardDescription>
                      Upload production reports, environmental data, or technical specifications for AI-powered data extraction
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed border-primary/30 rounded-xl p-12 text-center bg-gradient-to-br from-primary/5 to-chart-2/5 hover:border-primary/50 transition-colors">
                      <div className="mb-6 p-4 bg-gradient-to-br from-primary to-chart-2 rounded-xl w-fit mx-auto shadow-lg">
                        <Upload className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-3">Upload LCA Documents</h3>
                      <p className="text-base text-muted-foreground mb-6 max-w-md mx-auto leading-relaxed">
                        Drag and drop files here, or click to browse your computer for relevant documents
                      </p>
                      <Button size="lg" variant="outline" className="shadow-lg hover-lift bg-transparent">
                        <FileText className="mr-2 h-5 w-5" />
                        Choose Files
                      </Button>
                      <p className="text-xs text-muted-foreground mt-4">
                        Supported formats: PDF, DOC, XLS, CSV • Maximum file size: 10MB per file
                      </p>
                    </div>
                    
                    <div className="mt-8 bg-muted/30 rounded-lg p-6">
                      <h4 className="font-semibold mb-4 flex items-center text-base">
                        <Zap className="h-4 w-4 mr-2 text-primary" />
                        AI will automatically extract:
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          "Production volumes and operational data",
                          "Energy consumption patterns", 
                          "Emission factors and environmental data",
                          "Resource usage and waste generation",
                          "Technology specifications",
                          "Water usage and treatment data",
                          "Raw material compositions",
                          "By-product and waste streams"
                        ].map((item, index) => (
                          <div key={index} className="flex items-center text-sm text-muted-foreground">
                            <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-6">
                      <Button variant="outline" onClick={() => setAnalysisStep(2)} className="shadow-sm hover-lift">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Previous Step
                      </Button>
                      <Button 
                        size="lg" 
                        onClick={calculateLCA}
                        className="shadow-lg hover-lift bg-gradient-to-r from-primary to-chart-2"
                      >
                        Process Documents & Calculate
                        <Zap className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : null}

              {/* Calculation Progress */}
              {isCalculating && (
                <Card className="shadow-professional border-0 bg-gradient-to-r from-card to-muted/20">
                  <CardHeader className="pb-6">
                    <CardTitle className="flex items-center text-xl">
                      <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg mr-3">
                        <BarChart3 className="h-5 w-5 text-white animate-pulse" />
                      </div>
                      LCA Calculation in Progress
                    </CardTitle>
                    <CardDescription>
                      Processing your data according to ISO 14040 guidelines...
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm font-medium">
                        <span>Impact Category Analysis</span>
                        <span className="text-primary">Processing...</span>
                      </div>
                      <Progress value={85} className="h-3 shadow-sm" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm font-medium">
                        <span>Circularity Metrics Calculation</span>
                        <span className="text-chart-2">Calculating...</span>
                      </div>
                      <Progress value={65} className="h-3 shadow-sm" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm font-medium">
                        <span>Sustainability Comparison</span>
                        <span className="text-chart-3">Analyzing...</span>
                      </div>
                      <Progress value={40} className="h-3 shadow-sm" />
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>   
         {/* Step 4: Comprehensive Results & Analysis */}
            <TabsContent value="step-4" className="space-y-6 animate-fade-in-up">
              {lcaResults && (
                <>
                  {/* Executive Summary */}
                  <Card className="shadow-professional border-0 bg-gradient-to-r from-primary/10 via-chart-2/10 to-chart-3/10 backdrop-blur-sm">
                    <CardHeader className="pb-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-3 bg-gradient-to-br from-primary to-chart-2 rounded-xl shadow-lg">
                            <Award className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-2xl">LCA Results Summary</CardTitle>
                            <CardDescription className="text-base">
                              Comprehensive environmental impact assessment for {selectedMaterial}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge variant="secondary" className="px-4 py-2 text-sm">
                          <Shield className="h-4 w-4 mr-2" />
                          ISO 14040 Compliant
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center p-4 bg-white/50 dark:bg-black/20 rounded-xl">
                          <div className="text-3xl font-bold text-red-600 mb-2">
                            {lcaResults.climateChange.gwp.toLocaleString()}
                          </div>
                          <div className="text-sm font-medium text-muted-foreground">kg CO₂-eq</div>
                          <div className="text-xs text-muted-foreground mt-1">Climate Impact</div>
                        </div>
                        <div className="text-center p-4 bg-white/50 dark:bg-black/20 rounded-xl">
                          <div className="text-3xl font-bold text-blue-600 mb-2">
                            {lcaResults.waterImpacts.waterScarcity}
                          </div>
                          <div className="text-sm font-medium text-muted-foreground">m³ water-eq</div>
                          <div className="text-xs text-muted-foreground mt-1">Water Scarcity</div>
                        </div>
                        <div className="text-center p-4 bg-white/50 dark:bg-black/20 rounded-xl">
                          <div className="text-3xl font-bold text-green-600 mb-2">
                            {(lcaResults.circularityIndicators.materialCircularity * 100).toFixed(0)}%
                          </div>
                          <div className="text-sm font-medium text-muted-foreground">Circularity</div>
                          <div className="text-xs text-muted-foreground mt-1">Material Flow</div>
                        </div>
                        <div className="text-center p-4 bg-white/50 dark:bg-black/20 rounded-xl">
                          <div className="text-3xl font-bold text-purple-600 mb-2">
                            {((1 - lcaResults.comparison.sustainable.co2 / lcaResults.comparison.conventional.co2) * 100).toFixed(0)}%
                          </div>
                          <div className="text-sm font-medium text-muted-foreground">CO₂ Reduction</div>
                          <div className="text-xs text-muted-foreground mt-1">Sustainable vs Conv.</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Core Impact Categories */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Climate Change */}
                    <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
                      <CardHeader className="pb-6">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="p-2 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg">
                            <Globe className="h-5 w-5 text-white" />
                          </div>
                          <CardTitle className="text-xl">1. Climate Change Impact</CardTitle>
                        </div>
                        <CardDescription>
                          Global Warming Potential (GWP) - kg CO₂ equivalent
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="text-center">
                            <div className="text-4xl font-bold text-red-600 mb-2">
                              {lcaResults.climateChange.gwp.toLocaleString()}
                            </div>
                            <div className="text-sm text-muted-foreground">kg CO₂-eq per tonne</div>
                          </div>
                          <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                              <Pie
                                data={[
                                  { name: 'Direct Emissions', value: lcaResults.climateChange.breakdown.directEmissions },
                                  { name: 'Fossil Fuels', value: lcaResults.climateChange.breakdown.fossilFuels },
                                  { name: 'Electricity', value: lcaResults.climateChange.breakdown.electricity }
                                ]}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              >
                                {[
                                  { name: 'Direct Emissions', value: lcaResults.climateChange.breakdown.directEmissions },
                                  { name: 'Fossil Fuels', value: lcaResults.climateChange.breakdown.fossilFuels },
                                  { name: 'Electricity', value: lcaResults.climateChange.breakdown.electricity }
                                ].map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Air Pollution */}
                    <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
                      <CardHeader className="pb-6">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg">
                            <Wind className="h-5 w-5 text-white" />
                          </div>
                          <CardTitle className="text-xl">2. Air Pollution Impact</CardTitle>
                        </div>
                        <CardDescription>
                          Atmospheric impact categories
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <ResponsiveContainer width="100%" height={250}>
                            <BarChart
                              data={[
                                { category: 'Acidification', value: lcaResults.airPollution.acidification, unit: 'kg SO₂-eq' },
                                { category: 'Ozone Creation', value: lcaResults.airPollution.ozoneCreation, unit: 'kg C₂H₄-eq' },
                                { category: 'Particulate Matter', value: lcaResults.airPollution.particulateMatter, unit: 'kg PM₂.₅-eq' },
                                { category: 'Ozone Depletion', value: lcaResults.airPollution.ozoneDepletion * 1000, unit: 'g CFC-11-eq' }
                              ]}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
                              <YAxis />
                              <Tooltip formatter={(value, name, props) => [value, props.payload.unit]} />
                              <Bar dataKey="value" fill="#8884d8" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Water & Human Health Impacts */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Water Impacts */}
                    <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
                      <CardHeader className="pb-6">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                            <Droplets className="h-5 w-5 text-white" />
                          </div>
                          <CardTitle className="text-xl">3. Water-Related Impacts</CardTitle>
                        </div>
                        <CardDescription>
                          Water usage and aquatic ecosystem effects
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                              <div className="text-2xl font-bold text-blue-600">{lcaResults.waterImpacts.eutrophication}</div>
                              <div className="text-xs text-muted-foreground">kg PO₄³⁻-eq</div>
                              <div className="text-xs font-medium">Eutrophication</div>
                            </div>
                            <div className="text-center p-3 bg-cyan-50 dark:bg-cyan-950 rounded-lg">
                              <div className="text-2xl font-bold text-cyan-600">{lcaResults.waterImpacts.waterScarcity}</div>
                              <div className="text-xs text-muted-foreground">m³ water-eq</div>
                              <div className="text-xs font-medium">Water Scarcity</div>
                            </div>
                          </div>
                          <ResponsiveContainer width="100%" height={180}>
                            <AreaChart
                              data={[
                                { name: 'Freshwater Ecotoxicity', value: lcaResults.waterImpacts.freshwaterEcotoxicity },
                                { name: 'Marine Ecotoxicity', value: lcaResults.waterImpacts.marineEcotoxicity }
                              ]}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip formatter={(value) => [value, 'kg 1,4-DCB-eq']} />
                              <Area type="monotone" dataKey="value" stroke="#0088FE" fill="#0088FE" fillOpacity={0.6} />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Human Health */}
                    <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
                      <CardHeader className="pb-6">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
                            <Users className="h-5 w-5 text-white" />
                          </div>
                          <CardTitle className="text-xl">4. Human Health Impact</CardTitle>
                        </div>
                        <CardDescription>
                          Health effects from toxic substances and particulates
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-green-600 mb-2">
                              {lcaResults.humanHealth.toxicityPotential}
                            </div>
                            <div className="text-sm text-muted-foreground">kg 1,4-DCB-eq</div>
                            <div className="text-xs font-medium">Human Toxicity Potential</div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                              <div className="text-lg font-bold text-green-600">{lcaResults.humanHealth.respiratoryInorganics}</div>
                              <div className="text-xs text-muted-foreground">DALYs</div>
                              <div className="text-xs font-medium">Respiratory Impact</div>
                            </div>
                            <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-950 rounded-lg">
                              <div className="text-lg font-bold text-emerald-600">{lcaResults.humanHealth.occupationalRisk}</div>
                              <div className="text-xs text-muted-foreground">Risk Level</div>
                              <div className="text-xs font-medium">Occupational</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Resource Depletion & Biodiversity */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Resource Depletion */}
                    <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
                      <CardHeader className="pb-6">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg">
                            <Mountain className="h-5 w-5 text-white" />
                          </div>
                          <CardTitle className="text-xl">5. Resource Depletion</CardTitle>
                        </div>
                        <CardDescription>
                          Depletion of natural resources and materials
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <ResponsiveContainer width="100%" height={200}>
                            <BarChart
                              data={[
                                { name: 'Mineral', value: lcaResults.resourceDepletion.mineralDepletion, unit: 'kg Sb-eq' },
                                { name: 'Fossil Fuel', value: lcaResults.resourceDepletion.fossilFuelDepletion / 1000, unit: 'GJ' },
                                { name: 'Water', value: lcaResults.resourceDepletion.waterDepletion, unit: 'm³-eq' },
                                { name: 'Land Use', value: lcaResults.resourceDepletion.landUse * 100, unit: 'ha·year×100' }
                              ]}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip formatter={(value, name, props) => [value, props.payload.unit]} />
                              <Bar dataKey="value" fill="#FF8042" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Biodiversity */}
                    <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
                      <CardHeader className="pb-6">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="p-2 bg-gradient-to-br from-green-600 to-teal-600 rounded-lg">
                            <TreePine className="h-5 w-5 text-white" />
                          </div>
                          <CardTitle className="text-xl">6. Biodiversity & Ecosystem</CardTitle>
                        </div>
                        <CardDescription>
                          Impact on terrestrial and aquatic ecosystems
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-green-600 mb-2">
                              {lcaResults.biodiversity.terrestrialEcotoxicity}
                            </div>
                            <div className="text-sm text-muted-foreground">kg 1,4-DCB-eq</div>
                            <div className="text-xs font-medium">Terrestrial Ecotoxicity</div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                              <div className="text-lg font-bold text-green-600">{lcaResults.biodiversity.landUseChange}</div>
                              <div className="text-xs text-muted-foreground">PDF·m²·year</div>
                              <div className="text-xs font-medium">Land Use Change</div>
                            </div>
                            <div className="text-center p-3 bg-teal-50 dark:bg-teal-950 rounded-lg">
                              <div className="text-lg font-bold text-teal-600">{lcaResults.biodiversity.habitatAlteration}</div>
                              <div className="text-xs text-muted-foreground">Qualitative</div>
                              <div className="text-xs font-medium">Habitat Impact</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Circularity Indicators */}
                  <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
                    <CardHeader className="pb-6">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
                          <Recycle className="h-5 w-5 text-white" />
                        </div>
                        <CardTitle className="text-xl">Circularity Performance Indicators</CardTitle>
                      </div>
                      <CardDescription>
                        Circular economy metrics and material flow efficiency
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                          <ResponsiveContainer width="100%" height={300}>
                            <RadarChart data={[
                              {
                                subject: 'Material Circularity',
                                value: lcaResults.circularityIndicators.materialCircularity * 100,
                                fullMark: 100
                              },
                              {
                                subject: 'Waste to Resource',
                                value: lcaResults.circularityIndicators.wasteToResource * 100,
                                fullMark: 100
                              },
                              {
                                subject: 'Recycling Rate',
                                value: lcaResults.circularityIndicators.recyclingRate * 100,
                                fullMark: 100
                              },
                              {
                                subject: 'Byproduct Utilization',
                                value: lcaResults.circularityIndicators.byproductUtilization * 100,
                                fullMark: 100
                              }
                            ]}>
                              <PolarGrid />
                              <PolarAngleAxis dataKey="subject" />
                              <PolarRadiusAxis angle={90} domain={[0, 100]} />
                              <Radar name="Circularity" dataKey="value" stroke="#00C49F" fill="#00C49F" fillOpacity={0.3} />
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="space-y-4">
                          {circularityData.map((item, index) => (
                            <div key={index} className="space-y-2">
                              <div className="flex justify-between text-sm font-medium">
                                <span>{item.name}</span>
                                <span>{item.value}%</span>
                              </div>
                              <Progress value={item.value} className="h-3" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Conventional vs Sustainable Comparison */}
                  <Card className="shadow-professional border-0 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 backdrop-blur-sm">
                    <CardHeader className="pb-6">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg">
                          <TrendingDown className="h-5 w-5 text-white" />
                        </div>
                        <CardTitle className="text-xl">Conventional vs Sustainable Methods</CardTitle>
                      </div>
                      <CardDescription>
                        Comparison of environmental impacts between conventional and sustainable approaches
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <ResponsiveContainer width="100%" height={400}>
                          <BarChart data={impactComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="category" />
                            <YAxis />
                            <Tooltip formatter={(value, name, props) => [value, `${name} (${props.payload.unit})`]} />
                            <Legend />
                            <Bar dataKey="conventional" fill="#FF6B6B" name="Conventional Method" />
                            <Bar dataKey="sustainable" fill="#4ECDC4" name="Sustainable Method" />
                          </BarChart>
                        </ResponsiveContainer>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {impactComparisonData.map((item, index) => {
                            const reduction = ((item.conventional - item.sustainable) / item.conventional * 100).toFixed(1)
                            return (
                              <div key={index} className="text-center p-4 bg-white/50 dark:bg-black/20 rounded-xl">
                                <div className="text-2xl font-bold text-green-600 mb-1">-{reduction}%</div>
                                <div className="text-xs text-muted-foreground">{item.category}</div>
                                <div className="text-xs font-medium">Reduction</div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Environmental Impact Radar */}
                  <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
                    <CardHeader className="pb-6">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                          <BarChart3 className="h-5 w-5 text-white" />
                        </div>
                        <CardTitle className="text-xl">Overall Environmental Performance</CardTitle>
                      </div>
                      <CardDescription>
                        Comprehensive comparison across all impact categories
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={400}>
                        <RadarChart data={radarData}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="subject" />
                          <PolarRadiusAxis angle={90} domain={[0, 100]} />
                          <Radar name="Conventional" dataKey="conventional" stroke="#FF6B6B" fill="#FF6B6B" fillOpacity={0.3} />
                          <Radar name="Sustainable" dataKey="sustainable" stroke="#4ECDC4" fill="#4ECDC4" fillOpacity={0.3} />
                          <Legend />
                        </RadarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4 justify-center pt-6">
                    <Button size="lg" className="shadow-lg hover-lift">
                      <FileText className="mr-2 h-5 w-5" />
                      Export Full Report
                    </Button>
                    <Link href="/lca/results">
                      <Button size="lg" variant="outline" className="shadow-lg hover-lift bg-transparent">
                        <BarChart3 className="mr-2 h-5 w-5" />
                        View Detailed Analysis
                      </Button>
                    </Link>
                    <Link href="/lca/waste-analysis">
                      <Button size="lg" variant="outline" className="shadow-lg hover-lift bg-transparent">
                        <Factory className="mr-2 h-5 w-5" />
                        Waste Analysis
                      </Button>
                    </Link>
                    <Link href="/marketplace">
                      <Button size="lg" variant="outline" className="shadow-lg hover-lift bg-transparent">
                        <Recycle className="mr-2 h-5 w-5" />
                        Explore Marketplace
                      </Button>
                    </Link>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      onClick={() => {
                        setAnalysisStep(1)
                        setSelectedMaterial("")
                        setInputMethod(null)
                        setLcaResults(null)
                      }}
                      className="shadow-lg hover-lift bg-transparent"
                    >
                      <ArrowLeft className="mr-2 h-5 w-5" />
                      New Analysis
                    </Button>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}