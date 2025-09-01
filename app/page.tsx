"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { FileText, MapPin, Bell, Users, CheckCircle, Clock, Star, ArrowRight, Building2, Phone } from "lucide-react"
import { motion } from "framer-motion"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-background via-secondary/5 to-accent/10 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-8">
              Empowering Rural
              <span className="text-accent block mt-2 bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">Governance</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Connect with your local government, raise queries, track services, and ensure transparent governance in
              your community through ReYog.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Link href="/auth/register">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Button size="lg" className="w-full sm:w-auto shadow-lg bg-gradient-to-r from-accent to-secondary hover:from-secondary hover:to-accent transition-all duration-300">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </Link>
              <Link href="/offices">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="outline" size="lg" className="w-full sm:w-auto bg-background/80 backdrop-blur-sm border-accent/20 shadow-md hover:bg-accent/5 transition-all duration-300">
                    Explore Offices
                    <MapPin className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              <span className="inline-block bg-accent/10 px-4 py-1 rounded-full text-accent text-sm font-medium mb-4">Process</span>
              <br />How ReYog Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple steps to connect with your government and get the services you need
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card className="text-center border-accent/10 shadow-md hover:shadow-xl transition-all duration-300 h-full">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-accent/20 to-secondary/20 rounded-full flex items-center justify-center mb-4 shadow-inner">
                    <FileText className="h-8 w-8 text-accent" />
                  </div>
                  <CardTitle>Raise a Query</CardTitle>
                  <CardDescription className="text-base">
                    Submit your concerns, requests, or complaints about government services in your area
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card className="text-center border-accent/10 shadow-md hover:shadow-xl transition-all duration-300 h-full">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-accent/20 to-secondary/20 rounded-full flex items-center justify-center mb-4 shadow-inner">
                    <Clock className="h-8 w-8 text-accent" />
                  </div>
                  <CardTitle>Track Progress</CardTitle>
                  <CardDescription className="text-base">
                    Monitor the status of your queries with real-time updates and estimated completion times
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card className="text-center border-accent/10 shadow-md hover:shadow-xl transition-all duration-300 h-full">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-accent/20 to-secondary/20 rounded-full flex items-center justify-center mb-4 shadow-inner">
                    <CheckCircle className="h-8 w-8 text-accent" />
                  </div>
                  <CardTitle>Get Results</CardTitle>
                  <CardDescription className="text-base">
                    Receive notifications when your issues are resolved and provide feedback on services
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-background to-muted relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              <span className="inline-block bg-accent/10 px-4 py-1 rounded-full text-accent text-sm font-medium mb-4">Benefits</span>
              <br />Key Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to engage with your local government effectively
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 400 }}>
              <Card className="h-full border-accent/10 shadow-md hover:shadow-xl transition-all duration-300 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="rounded-full bg-accent/10 w-12 h-12 flex items-center justify-center mb-2">
                    <MapPin className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle className="text-lg">Location Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Find nearby government offices and services with integrated maps and directions
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 400 }}>
              <Card className="h-full border-accent/10 shadow-md hover:shadow-xl transition-all duration-300 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="rounded-full bg-accent/10 w-12 h-12 flex items-center justify-center mb-2">
                    <Bell className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle className="text-lg">Real-time Updates</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Get instant notifications about your query status and important announcements
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 400 }}>
              <Card className="h-full border-accent/10 shadow-md hover:shadow-xl transition-all duration-300 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="rounded-full bg-accent/10 w-12 h-12 flex items-center justify-center mb-2">
                    <Star className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle className="text-lg">Rate & Review</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Provide feedback on government services to help improve quality and accountability
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 400 }}>
              <Card className="h-full border-accent/10 shadow-md hover:shadow-xl transition-all duration-300 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="rounded-full bg-accent/10 w-12 h-12 flex items-center justify-center mb-2">
                    <Phone className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle className="text-lg">Emergency SOS</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Quick access to emergency contacts and nearest government offices during crises
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-accent to-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern-dots opacity-10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-accent-foreground mb-4 drop-shadow-md">Ready to Get Started?</h2>
            <p className="text-xl text-accent-foreground/90 mb-10 max-w-2xl mx-auto drop-shadow">
              Join thousands of citizens who are already using ReYog to improve their communities
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Link href="/auth/register">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    size="lg" 
                    variant="secondary" 
                    className="w-full sm:w-auto bg-white/90 backdrop-blur-sm text-accent shadow-lg hover:bg-white transition-all duration-300 border-0"
                  >
                    Create Account
                    <Users className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </Link>
              <Link href="/offices">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto bg-transparent border-white/80 text-white hover:bg-white/20 transition-all duration-300 shadow-lg"
                  >
                    Find Offices Near You
                    <Building2 className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />

      <style jsx global>{`
        .bg-grid-pattern {
          background-size: 20px 20px;
          background-image: linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
                          linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px);
        }
        
        .bg-pattern-dots {
          background-image: radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  )
}