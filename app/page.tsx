"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { FileText, MapPin, Bell, Users, CheckCircle, Clock, Star, ArrowRight, Building2, Phone } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-accent/10 via-background to-muted py-24">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent/20 rounded-full blur-3xl" />
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
              Empowering Rural
              <span className="text-accent block">Governance</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Connect with your local government, raise queries, track services, and ensure transparent governance in
              your community through <span className="font-semibold text-accent">ReYog</span>.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Link href="/auth/register">
                <Button size="lg" className="w-full sm:w-auto shadow-lg hover:shadow-accent/40 transition">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/offices">
                <Button variant="outline" size="lg" className="w-full sm:w-auto bg-background/70 backdrop-blur hover:bg-accent hover:text-white transition">
                  Explore Offices
                  <MapPin className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">How ReYog Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple steps to connect with your government and get the services you need
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: FileText, title: "Raise a Query", desc: "Submit your concerns, requests, or complaints about government services in your area" },
              { icon: Clock, title: "Track Progress", desc: "Monitor the status of your queries with real-time updates and estimated completion times" },
              { icon: CheckCircle, title: "Get Results", desc: "Receive notifications when your issues are resolved and provide feedback on services" }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="text-center rounded-2xl shadow-md hover:shadow-accent/30 transition">
                  <CardHeader>
                    <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                      <item.icon className="h-8 w-8 text-accent" />
                    </div>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.desc}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Key Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to engage with your local government effectively
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: MapPin, title: "Location Services", desc: "Find nearby government offices and services with integrated maps and directions" },
              { icon: Bell, title: "Real-time Updates", desc: "Get instant notifications about your query status and important announcements" },
              { icon: Star, title: "Rate & Review", desc: "Provide feedback on government services to help improve quality and accountability" },
              { icon: Phone, title: "Emergency SOS", desc: "Quick access to emergency contacts and nearest government offices during crises" }
            ].map((item, idx) => (
              <Card key={idx} className="rounded-2xl shadow-sm hover:shadow-lg hover:scale-[1.02] transition">
                <CardHeader>
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-3">
                    <item.icon className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-accent to-accent/80 text-center text-accent-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Ready to Get Started?
          </motion.h2>
          <p className="text-lg text-accent-foreground/90 mb-10 max-w-2xl mx-auto">
            Join thousands of citizens who are already using ReYog to improve their communities
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/auth/register">
              <Button
                size="lg" 
                variant="outline"
                className="rounded-xl w-full sm:w-auto border-accent-foreground bg-background/20 backdrop-blur text-accent-foreground hover:text-background transition"
              >
                Create Account
                <Users className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/offices">
              <Button
                size="lg"
                variant="outline"
                className="rounded-xl w-full sm:w-auto border-accent-foreground bg-background/20 backdrop-blur text-accent-foreground hover:text-background transition"
              >
                Find Offices Near You
                <Building2 className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}