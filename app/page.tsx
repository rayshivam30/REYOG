import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { FileText, MapPin, Bell, Users, CheckCircle, Clock, Star, ArrowRight, Building2, Phone, ChevronRight } from "lucide-react"
import Script from 'next/script';

export default function HomePage() {
  return (
    <div className="flex-1">
      <Header />

      {/* Tidio Chat Widget */}
      <Script 
        src="//code.tidio.co/xqdpdonnhkjfw0zwz6oj30v2ib9eeqiq.js" 
        strategy="afterInteractive"
        id="tidio-chat"
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-background via-background/95 to-muted/80 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -right-1/2 -top-1/2 h-[200%] w-[200%] rounded-full bg-gradient-to-tr from-accent/5 via-primary/5 to-transparent blur-3xl" />
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight px-2 animate-fade-in">
              Empowering Rural{' '}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Governance
              </span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4 animate-slide-up">
              Connect with your local government, raise queries, track services, and ensure transparent governance in
              your community through ReYog.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4 px-4 animate-slide-up" style={{animationDelay: "0.2s"}}>
              <Link href="/auth/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto min-h-12 text-base transition-all hover:shadow-lg hover:shadow-accent/20 cursor-pointer group">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/offices" className="w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto min-h-12 text-base bg-background/50 backdrop-blur-sm border-border/50 hover:shadow-lg hover:shadow-accent/20 cursor-pointer group"
                >
                  <MapPin className="mr-2 h-5 w-5" />
                  Explore Offices
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-16 sm:py-20 md:py-24 overflow-hidden">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-1/2 -bottom-1/2 h-[200%] w-[200%] rounded-full bg-gradient-to-tl from-accent/5 via-primary/5 to-transparent blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-accent/10 text-accent mb-4">
              Simple Steps
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">How ReYog Works</h2>
            <p className="text-lg text-muted-foreground">
              Simple steps to connect with your government and get the services you need
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: <FileText className="h-8 w-8 text-accent" />,
                title: "Raise a Query",
                description: "Submit your concerns, requests, or complaints about government services in your area"
              },
              {
                icon: <Clock className="h-8 w-8 text-accent" />,
                title: "Track Progress",
                description: "Monitor the status of your queries with real-time updates and estimated completion times"
              },
              {
                icon: <CheckCircle className="h-8 w-8 text-accent" />,
                title: "Get Results",
                description: "Receive notifications when your issues are resolved and provide feedback on services"
              }
            ].map((step, index) => (
              <Card 
                key={index} 
                className="border border-border/40 bg-card/50 backdrop-blur-sm hover:shadow-md hover:border-accent/20 transition-all duration-300"
              >
                <CardHeader>
                  <div className="bg-accent/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                    {step.icon}
                  </div>
                  <CardTitle>{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{step.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/auth/register">
              <Button variant="outline" className="group">
                Learn more about our services
                <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}