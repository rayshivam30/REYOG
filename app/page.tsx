import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { FileText, MapPin, Bell, Users, CheckCircle, Clock, Star, ArrowRight, Building2, Phone } from "lucide-react"
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
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight px-2">
              Empowering Rural{' '}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Governance
              </span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
              Connect with your local government, raise queries, track services, and ensure transparent governance in
              your community through ReYog.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4 px-4">
              <Link href="/auth/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto min-h-12 text-base transition-all hover:shadow-lg hover:shadow-accent/20 cursor-pointer">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/offices" className="w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto min-h-12 text-base bg-background/50 backdrop-blur-sm border-border/50 hover:bg-accent/5 hover:border-accent/30 transition-colors cursor-pointer"
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
                className="group relative overflow-hidden transition-all hover:shadow-lg hover:border-accent/30 hover:-translate-y-1 h-full"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="relative z-10">
                  <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                    {step.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold">{step.title}</CardTitle>
                  <CardDescription className="text-base">
                    {step.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-16 sm:py-20 md:py-24 bg-muted/50">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -right-1/2 -top-1/2 h-[200%] w-[200%] rounded-full bg-gradient-to-bl from-primary/5 via-accent/5 to-transparent blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-accent/10 text-accent mb-4">
              Powerful Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Everything You Need</h2>
            <p className="text-lg text-muted-foreground">
              Comprehensive tools to engage with your local government effectively
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                icon: <MapPin className="h-7 w-7 text-accent" />,
                title: "Location Services",
                description: "Find nearby government offices and services with integrated maps and directions"
              },
              {
                icon: <Bell className="h-7 w-7 text-accent" />,
                title: "Real-time Updates",
                description: "Get instant notifications about your query status and important announcements"
              },
              {
                icon: <Star className="h-7 w-7 text-accent" />,
                title: "Rate & Review",
                description: "Provide feedback on government services to help improve quality and accountability"
              },
              {
                icon: <Phone className="h-7 w-7 text-accent" />,
                title: "Emergency SOS",
                description: "Quick access to emergency contacts and nearest government offices during crises"
              }
            ].map((feature, index) => (
              <Card 
                key={index} 
                className="group relative overflow-hidden transition-all hover:shadow-md hover:border-accent/30 h-full bg-background/50 backdrop-blur-sm"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="relative z-10 pb-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10 pt-0">
                  <p className="text-muted-foreground text-sm sm:text-base">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="relative py-16 sm:py-20 md:py-24 bg-accent overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0.1))] opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-accent/80" />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-accent-foreground mb-6 leading-tight">
              Ready to Transform Your Community?
            </h2>
            <p className="text-lg sm:text-xl text-accent-foreground/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of citizens who are already using ReYog to improve their communities and engage with local governance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto px-4">
              <Link href="/auth/register" className="w-full sm:w-auto group">
                <Button
                  size="lg" 
                  className="w-full sm:w-auto min-h-12 text-base bg-accent-foreground text-accent hover:bg-accent-foreground/90 hover:shadow-lg hover:shadow-accent-foreground/20 transition-all duration-300 cursor-pointer"
                >
                  <span className="relative z-10">Create Free Account</span>
                  <Users className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <Link href="/offices" className="w-full sm:w-auto group">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto min-h-12 text-base bg-transparent border-accent-foreground/20 text-accent-foreground hover:bg-accent-foreground/10 hover:border-accent-foreground/40 hover:shadow-sm transition-all duration-300 cursor-pointer"
                >
                  <MapPin className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                  Find Offices
                </Button>
              </Link>
            </div>
            
            <p className="text-sm text-accent-foreground/70 mt-6">
              No credit card required • Easy setup • Secure & private
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}