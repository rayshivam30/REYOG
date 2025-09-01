import Link from "next/link"
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
      <section className="bg-gradient-to-br from-background to-muted py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Empowering Rural
              <span className="text-accent block">Governance</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Connect with your local government, raise queries, track services, and ensure transparent governance in
              your community through ReYog.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/offices">
                <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                  Explore Offices
                  <MapPin className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How ReYog Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple steps to connect with your government and get the services you need
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                  <FileText className="h-8 w-8 text-accent" />
                </div>
                <CardTitle>Raise a Query</CardTitle>
                <CardDescription>
                  Submit your concerns, requests, or complaints about government services in your area
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                  <Clock className="h-8 w-8 text-accent" />
                </div>
                <CardTitle>Track Progress</CardTitle>
                <CardDescription>
                  Monitor the status of your queries with real-time updates and estimated completion times
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-accent" />
                </div>
                <CardTitle>Get Results</CardTitle>
                <CardDescription>
                  Receive notifications when your issues are resolved and provide feedback on services
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Key Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to engage with your local government effectively
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <MapPin className="h-8 w-8 text-accent mb-2" />
                <CardTitle className="text-lg">Location Services</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Find nearby government offices and services with integrated maps and directions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Bell className="h-8 w-8 text-accent mb-2" />
                <CardTitle className="text-lg">Real-time Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Get instant notifications about your query status and important announcements
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Star className="h-8 w-8 text-accent mb-2" />
                <CardTitle className="text-lg">Rate & Review</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Provide feedback on government services to help improve quality and accountability
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Phone className="h-8 w-8 text-accent mb-2" />
                <CardTitle className="text-lg">Emergency SOS</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Quick access to emergency contacts and nearest government offices during crises
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-accent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-accent-foreground mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-accent-foreground/80 mb-8 max-w-2xl mx-auto">
            Join thousands of citizens who are already using ReYog to improve their communities
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button
                size="lg" 
                variant="secondary" 
                className="w-full sm:w-auto bg-transparent border-accent-foreground text-accent-foreground hover:bg-accent-foreground hover:text-accent "
              >
                Create Account
                <Users className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/offices">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto bg-transparent border-accent-foreground text-accent-foreground hover:bg-accent-foreground hover:text-accent"
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