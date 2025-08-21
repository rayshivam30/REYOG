
"use client"

import { useEffect, useState, Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Building2, Search, Plus, Phone, Mail, MapPin, Users, Trash2 } from "lucide-react"

// ✅ Add NGO Dialog
function AddNGODialog({ onAdd }: { onAdd: (ngo: any) => void }) {
  const [formData, setFormData] = useState({
    name: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    focusArea: "",
    coverage: "",
    address: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    const res = await fetch("/api/ngos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
    if (res.ok) {
      const newNGO = await res.json()
      onAdd(newNGO)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add NGO
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add New NGO</DialogTitle>
          <DialogDescription>Add a new NGO to the directory for potential collaboration.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">NGO Name</label>
              <Input name="name" placeholder="Enter NGO name" value={formData.name} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Contact Person</label>
              <Input name="contactName" placeholder="Contact person name" value={formData.contactName} onChange={handleChange} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <Input name="contactPhone" placeholder="+91-XXXXXXXXXX" value={formData.contactPhone} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input name="contactEmail" placeholder="contact@ngo.org" value={formData.contactEmail} onChange={handleChange} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Focus Area</label>
            <Input name="focusArea" placeholder="e.g., Education, Healthcare" value={formData.focusArea} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Coverage Area</label>
            <Input name="coverage" placeholder="e.g., Bhopal District" value={formData.coverage} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Address</label>
            <Input name="address" placeholder="Complete address" value={formData.address} onChange={handleChange} />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSubmit}>Add NGO</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ✅ Introduce Dialog
function IntroduceToPanchayatDialog({ ngo }: { ngo: any }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Users className="mr-2 h-4 w-4" />
          Introduce
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Introduce to Panchayat</DialogTitle>
          <DialogDescription>Connect {ngo.name} with a panchayat for potential collaboration.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Panchayat</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Choose panchayat" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bhopal">Bhopal Rural Panchayat</SelectItem>
                <SelectItem value="sehore">Sehore Urban Panchayat</SelectItem>
                <SelectItem value="indore">Indore Rural Panchayat</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Introduction Message</label>
            <Input defaultValue={`Introducing ${ngo.name} - specializing in ${ngo.focusArea}`} />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Send Introduction</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ✅ NGOs Table with Search & Filter
function NGOsTable({ ngos, onDelete }: { ngos: any[]; onDelete: (id: string) => void }) {
  const [search, setSearch] = useState("")
  const [focusFilter, setFocusFilter] = useState("all")

  const filteredNGOs = ngos.filter((ngo) =>
    ngo.name.toLowerCase().includes(search.toLowerCase()) &&
    (focusFilter === "all" || ngo.focusArea.toLowerCase().includes(focusFilter))
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          NGO Directory
        </CardTitle>
        <CardDescription>Manage NGO contacts and facilitate panchayat collaborations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search NGOs..." className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select onValueChange={(val) => setFocusFilter(val)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Focus Area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Areas</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="environment">Environment</SelectItem>
                <SelectItem value="water">Water & Sanitation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* NGOs Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredNGOs.map((ngo) => (
              <Card key={ngo.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{ngo.name}</CardTitle>
                  <CardDescription>{ngo.contactName}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" /> {ngo.contactPhone}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" /> {ngo.contactEmail}
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" /> {ngo.address}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Focus: </span>{ngo.focusArea}
                  </div>
                  <div>
                    <span className="font-medium">Coverage: </span>{ngo.coverage}
                  </div>
                  {/* <div className="flex gap-2 pt-2">
                    <IntroduceToPanchayatDialog ngo={ngo} />
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="destructive" size="sm" onClick={() => onDelete(ngo.id)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div> */}
                  <div className="flex gap-2 pt-2">
  <IntroduceToPanchayatDialog ngo={ngo} />
  <Button variant="outline" size="sm">Edit</Button>
  <Button variant="outline" size="sm" onClick={() => onDelete(ngo.id)}>
    <Trash2 className="mr-2 h-4 w-4" />
    Delete
  </Button>
</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ✅ Main Page
export default function AdminNGOsPage() {
  const [ngos, setNgos] = useState<any[]>([])

  useEffect(() => {
    fetch("/api/ngos")
      .then((res) => res.json())
      .then((data) => setNgos(data))
  }, [])

  const handleAddNGO = (newNGO: any) => {
    setNgos((prev) => [newNGO, ...prev])
  }

  // const handleDeleteNGO = async (ngoId: string) => {
  //   try {
  //     const res = await fetch(`/api/ngos/${ngoId}`, {
  //       method: "DELETE",
  //     });
  //     if (res.ok) {
  //       setNgos((prevNgos) => prevNgos.filter((ngo) => ngo.id !== ngoId));
  //     }
  //   } catch (error) {
  //     console.error("Failed to delete NGO:", error);
  //   }
  // }

  const handleDeleteNGO = async (ngoId: string) => {
  if (ngoId.startsWith("mock-")) {
    // Delete only from UI (mock data)
    setNgos((prevNgos) => prevNgos.filter((ngo) => ngo.id !== ngoId));
    return;
  }

  try {
    const res = await fetch(`/api/ngos/${ngoId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      // Remove from UI after successful deletion from DB
      setNgos((prevNgos) => prevNgos.filter((ngo) => ngo.id !== ngoId));
    } else {
      console.error("Failed to delete NGO from DB");
    }
  } catch (error) {
    console.error("Error deleting NGO:", error);
  }
};

//  useEffect(() => {
//     fetch("/api/ngos")
//       .then((res) => res.json())
//       .then((data) => {
//         const mockNGOs = [
//           {
//             id: "mock-1",
//             name: "Rural Development Foundation",
//             contactName: "Dr. Anjali Verma",
//             contactPhone: "+91-9876543220",
//             contactEmail: "contact@rdf.org.in",
//             focusArea: "Education and Healthcare",
//             coverage: "Madhya Pradesh",
//             address: "Plot 15, Civil Lines, Bhopal, MP 462001",
//           },
//           {
//             id: "mock-2",
//             name: "Clean Water Initiative",
//             contactName: "Ravi Agarwal",
//             contactPhone: "+91-9876543221",
//             contactEmail: "info@cleanwater.org",
//             focusArea: "Water and Sanitation",
//             coverage: "Central India",
//             address: "23, Green Park, Bhopal, MP 462003",
//           },
//           {
//             id: "mock-3",
//             name: "Women Empowerment Society",
//             contactName: "Meera Joshi",
//             contactPhone: "+91-9876543222",
//             contactEmail: "contact@wes.org.in",
//             focusArea: "Women Rights and Development",
//             coverage: "Bhopal District",
//             address: "45, Mahila Bhawan, Bhopal, MP 462001",
//           }
//         ]

//         setNgos([...mockNGOs, ...data])
//       })
//   }, [])
useEffect(() => {
  const fetchNGOs = async () => {
    try {
      const res = await fetch("/api/ngos");
      const data = await res.json();

      if (data.length === 0) {
        // Only inject mock NGOs if API returned nothing
        const mockNGOs = [
          {
            id: "mock-1",
            name: "Rural Development Foundation",
            contactName: "Dr. Anjali Verma",
            contactPhone: "+91-9876543220",
            contactEmail: "contact@rdf.org.in",
            focusArea: "Education and Healthcare",
            coverage: "Madhya Pradesh",
            address: "Plot 15, Civil Lines, Bhopal, MP 462001",
          },
          {
            id: "mock-2",
            name: "Clean Water Initiative",
            contactName: "Ravi Agarwal",
            contactPhone: "+91-9876543221",
            contactEmail: "info@cleanwater.org",
            focusArea: "Water and Sanitation",
            coverage: "Central India",
            address: "23, Green Park, Bhopal, MP 462003",
          },
          {
            id: "mock-3",
            name: "Women Empowerment Society",
            contactName: "Meera Joshi",
            contactPhone: "+91-9876543222",
            contactEmail: "contact@wes.org.in",
            focusArea: "Women Rights and Development",
            coverage: "Bhopal District",
            address: "45, Mahila Bhawan, Bhopal, MP 462001",
          },
        ];
        setNgos(mockNGOs);
      } else {
        setNgos(data);
      }
    } catch (error) {
      console.error("Failed to fetch NGOs:", error);
    }
  };

  fetchNGOs();
}, []);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">NGO Management</h2>
        <AddNGODialog onAdd={handleAddNGO} />
      </div>

      <Suspense fallback={<div>Loading NGOs...</div>}>
        <NGOsTable ngos={ngos} onDelete={handleDeleteNGO} />
      </Suspense>
    </div>
  )
}
