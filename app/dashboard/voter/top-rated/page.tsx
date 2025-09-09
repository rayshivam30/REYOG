"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, MapPin, Phone, Mail, Clock, Building, Users, Award, Filter, MessageSquare } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface Office {
  id: string
  name: string
  address: string
  contactPhone?: string
  contactEmail?: string
  workingHours?: string
  department: {
    id: string
    name: string
  }
  panchayat: {
    id: string
    name: string
    district: string
    state: string
  }
  avgRating: number
  ratingCount: number
  recentRatings: Array<{
    rating: number
    comment?: string
    createdAt: string
    userName: string
    source: 'general' | 'query'
    queryTitle?: string
  }>
}

interface Stats {
  totalOffices: number
  averageRating: number
  totalRatings: number
  highlyRatedCount: number
}

interface Department {
  id: string
  name: string
}

interface Panchayat {
  id: string
  name: string
}

export default function TopRatedOfficesPage() {
  const [offices, setOffices] = useState<Office[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [departments, setDepartments] = useState<Department[]>([])
  const [panchayats, setPanchayats] = useState<Panchayat[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const [filters, setFilters] = useState({
    department: 'all',
    panchayat: user?.panchayat?.id || 'all',
    search: ''
  })

  // Set default panchayat filter when user data is available
  useEffect(() => {
    if (user?.panchayat?.id && filters.panchayat === 'all') {
      setFilters(prev => ({
        ...prev,
        panchayat: user.panchayat?.id || 'all'
      }));
    }
  }, [user, filters.panchayat]);

  // Fetch top-rated offices
  const fetchOffices = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      if (filters.department && filters.department !== 'all') params.set('departmentId', filters.department)
      if (filters.panchayat && filters.panchayat !== 'all') params.set('panchayatId', filters.panchayat)
      params.set('limit', '20')

      const response = await fetch(`/api/offices/top-rated?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        let filteredOffices = data.offices || []
        
        // Apply search filter on client side
        if (filters.search) {
          const searchLower = filters.search.toLowerCase()
          filteredOffices = filteredOffices.filter((office: Office) => 
            office.name.toLowerCase().includes(searchLower) ||
            office.address.toLowerCase().includes(searchLower) ||
            office.department.name.toLowerCase().includes(searchLower)
          )
        }
        
        setOffices(filteredOffices)
        setStats(data.stats)
      } else {
        console.error('Failed to fetch offices')
      }
    } catch (error) {
      console.error('Error fetching offices:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch departments and panchayats for filters
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [deptRes, panchayatRes] = await Promise.all([
          fetch('/api/departments'),
          fetch('/api/panchayats')
        ])
        
        if (deptRes.ok) {
          const deptData = await deptRes.json()
          setDepartments(deptData.departments || [])
        }
        
        if (panchayatRes.ok) {
          const panchayatData = await panchayatRes.json()
          setPanchayats(Array.isArray(panchayatData) ? panchayatData : [])
        }
      } catch (error) {
        console.error('Error fetching filter options:', error)
      }
    }

    fetchFilterOptions()
  }, [])

  useEffect(() => {
    fetchOffices()
  }, [filters.department, filters.panchayat])

  // Handle search with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOffices()
    }, 500)

    return () => clearTimeout(timer)
  }, [filters.search])

  const RatingStars = ({ rating }: { rating: number }) => (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating 
              ? 'text-yellow-400 fill-yellow-400' 
              : 'text-gray-300'
          }`}
        />
      ))}
      <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
    </div>
  )

  return (
    <div className="container mx-auto p-6">
      {/* Header with Stats */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Top Rated Offices</h1>
            <p className="text-muted-foreground">
              Discover the highest-rated government offices based on community feedback
            </p>
          </div>
          <Award className="h-12 w-12 text-yellow-500 self-start sm:self-auto" />
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Offices</p>
                    <p className="text-2xl font-bold">{stats.totalOffices}</p>
                  </div>
                  <Building className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Average Rating</p>
                    <p className="text-2xl font-bold">{stats.averageRating}</p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Reviews</p>
                    <p className="text-2xl font-bold">{stats.totalRatings}</p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Highly Rated</p>
                    <p className="text-2xl font-bold">{stats.highlyRatedCount}</p>
                  </div>
                  <Award className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <Input
                placeholder="Search offices..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Department</label>
              <Select 
                value={filters.department} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, department: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Panchayat</label>
              <Select 
                value={filters.panchayat} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, panchayat: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={user?.panchayat ? user.panchayat.name : "All panchayats"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All panchayats</SelectItem>
                  {panchayats.map((panchayat) => (
                    <SelectItem key={panchayat.id} value={panchayat.id}>
                      {panchayat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Office Cards */}
      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : offices.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {offices.map((office, index) => (
            <Card key={office.id} className="hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-200">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-lg">{office.name}</CardTitle>
                      {index < 3 && (
                        <Badge variant="outline" className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0">
                          #{index + 1}
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-sm">
                      {office.department.name} • {office.panchayat.name}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <RatingStars rating={office.avgRating} />
                    <p className="text-xs text-muted-foreground mt-1">
                      {office.ratingCount} review{office.ratingCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mt-0.5 mr-2 text-muted-foreground flex-shrink-0" />
                    <span className="text-muted-foreground">{office.address}</span>
                  </div>
                  {office.contactPhone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <a href={`tel:${office.contactPhone}`} className="hover:underline text-blue-600">
                        {office.contactPhone}
                      </a>
                    </div>
                  )}
                  {office.contactEmail && (
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <a href={`mailto:${office.contactEmail}`} className="hover:underline text-blue-600">
                        {office.contactEmail}
                      </a>
                    </div>
                  )}
                  {office.workingHours && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-muted-foreground">{office.workingHours}</span>
                    </div>
                  )}
                  
                  {/* Recent Ratings Preview */}
                  {office.recentRatings.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="font-medium mb-2 text-sm">Recent Review:</p>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <RatingStars rating={office.recentRatings[0].rating} />
                          <span className="text-xs text-muted-foreground">
                            by {office.recentRatings[0].userName}
                          </span>
                        </div>
                        {office.recentRatings[0].comment && (
                          <p className="text-xs text-muted-foreground mt-1">
                            "{office.recentRatings[0].comment.length > 60 
                              ? office.recentRatings[0].comment.substring(0, 60) + '...'
                              : office.recentRatings[0].comment}"
                          </p>
                        )}
                        {office.recentRatings[0].source === 'query' && office.recentRatings[0].queryTitle && (
                          <p className="text-xs text-blue-600 mt-1">
                            From query: {office.recentRatings[0].queryTitle}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Star className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No rated offices found</h3>
              <p className="text-muted-foreground mb-4">
                {filters.search || filters.department || filters.panchayat
                  ? "Try adjusting your filters to see more results."
                  : "Be the first to rate an office after your query is resolved!"}
              </p>
              <Button onClick={() => setFilters({ department: '', panchayat: '', search: '' })}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
