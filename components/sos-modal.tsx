"use client"

import { Button } from "@/components/ui/button"
import { AlertTriangle, Phone } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function SOSModal() {
  const emergencyNumbers = [
    { name: "Police", number: "100", color: "bg-blue-100 text-blue-800" },
    { name: "Fire Brigade", number: "101", color: "bg-red-100 text-red-800" },
    { name: "Ambulance", number: "108", color: "bg-green-100 text-green-800" },
    { name: "Disaster Management", number: "1078", color: "bg-orange-100 text-orange-800" },
  ]

  const handleSOSLog = (service: string) => {
    // Log SOS action to audit trail
    fetch("/api/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "SOS_ACCESSED",
        details: `User accessed ${service} emergency contact`,
      }),
    }).catch(console.error)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" className="w-full">
          <AlertTriangle className="h-5 w-5 mr-2" />
          Emergency SOS
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-6 w-6" />
            Emergency Contacts
          </DialogTitle>
          <DialogDescription>
            Call these numbers in case of emergency
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          {emergencyNumbers.map((contact) => (
            <a
              key={contact.number}
              href={`tel:${contact.number}`}
              className={`flex items-center justify-between p-3 rounded-lg ${contact.color} hover:opacity-90 transition-opacity`}
              onClick={() => handleSOSLog(contact.name)}
            >
              <span className="font-medium">{contact.name}</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold">{contact.number}</span>
                <Phone className="h-4 w-4" />
              </div>
            </a>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
