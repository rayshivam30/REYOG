// Real-time Market Price API Integration
export interface MetalPrice {
  symbol: string
  name: string
  price: number
  currency: string
  unit: string
  change24h: number
  changePercent24h: number
  volume24h: number
  marketCap?: number
  lastUpdated: string
  exchange: string
}

export interface PreciousMetalPrice extends MetalPrice {
  purity: string
  premiumOverSpot: number
  bidAskSpread: number
}

export interface CommodityPrice {
  commodity: string
  price: number
  currency: string
  unit: string
  change: number
  changePercent: number
  high52Week: number
  low52Week: number
  lastUpdated: string
  exchange: string
}

export interface MarketTrend {
  period: string
  startPrice: number
  endPrice: number
  change: number
  changePercent: number
  volatility: number
  volume: number
}

export class MarketPriceService {
  private apiKeys: Map<string, string>
  private baseUrls: Map<string, string>
  private cache: Map<string, { data: any, timestamp: number }>
  private cacheTimeout: number = 5 * 60 * 1000 // 5 minutes

  constructor() {
    this.initializeAPIs()
    this.cache = new Map()
  }

  private initializeAPIs() {
    // API configuration for various market data providers
    this.apiKeys = new Map([
      ['metals_api', process.env.METALS_API_KEY || 'demo_key'],
      ['lme_api', process.env.LME_API_KEY || 'demo_key'],
      ['comex_api', process.env.COMEX_API_KEY || 'demo_key'],
      ['alpha_vantage', process.env.ALPHA_VANTAGE_KEY || 'demo_key'],
      ['quandl', process.env.QUANDL_KEY || 'demo_key']
    ])

    this.baseUrls = new Map([
      ['metals_api', 'https://metals-api.com/api'],
      ['lme_api', 'https://www.lme.com/api/v1'],
      ['comex_api', 'https://www.cmegroup.com/api'],
      ['alpha_vantage', 'https://www.alphavantage.co/query'],
      ['quandl', 'https://www.quandl.com/api/v3']
    ])
  }

  // Get current metal prices
  async getMetalPrices(metals: string[] = ['copper', 'aluminum', 'gold', 'silver', 'platinum']): Promise<MetalPrice[]> {
    const cacheKey = `metal_prices_${metals.join(',')}`
    const cached = this.getFromCache(cacheKey)
    if (cached) return cached

    try {
      // In production, would make actual API calls
      // For demo, returning mock data with realistic prices
      const prices: MetalPrice[] = await this.fetchMetalPricesFromAPI(metals)
      
      this.setCache(cacheKey, prices)
      return prices
    } catch (error) {
      console.error('Error fetching metal prices:', error)
      return this.getMockMetalPrices(metals)
    }
  }

  private async fetchMetalPricesFromAPI(metals: string[]): Promise<MetalPrice[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 200))

    // Mock realistic metal prices (would be actual API calls in production)
    const mockPrices: { [key: string]: Partial<MetalPrice> } = {
      copper: {
        symbol: 'CU',
        name: 'Copper',
        price: 8.45,
        currency: 'USD',
        unit: 'per kg',
        change24h: 0.12,
        changePercent24h: 1.44,
        volume24h: 125000,
        exchange: 'LME'
      },
      aluminum: {
        symbol: 'AL',
        name: 'Aluminum',
        price: 2.15,
        currency: 'USD',
        unit: 'per kg',
        change24h: -0.03,
        changePercent24h: -1.37,
        volume24h: 89000,
        exchange: 'LME'
      },
      gold: {
        symbol: 'AU',
        name: 'Gold',
        price: 65.20,
        currency: 'USD',
        unit: 'per gram',
        change24h: 1.15,
        changePercent24h: 1.79,
        volume24h: 45000,
        exchange: 'COMEX'
      },
      silver: {
        symbol: 'AG',
        name: 'Silver',
        price: 0.85,
        currency: 'USD',
        unit: 'per gram',
        change24h: -0.02,
        changePercent24h: -2.31,
        volume24h: 78000,
        exchange: 'COMEX'
      },
      platinum: {
        symbol: 'PT',
        name: 'Platinum',
        price: 32.40,
        currency: 'USD',
        unit: 'per gram',
        change24h: 0.85,
        changePercent24h: 2.69,
        volume24h: 12000,
        exchange: 'NYMEX'
      },
      palladium: {
        symbol: 'PD',
        name: 'Palladium',
        price: 89.60,
        currency: 'USD',
        unit: 'per gram',
        change24h: -2.15,
        changePercent24h: -2.34,
        volume24h: 8500,
        exchange: 'NYMEX'
      },
      steel: {
        symbol: 'ST',
        name: 'Steel',
        price: 0.75,
        currency: 'USD',
        unit: 'per kg',
        change24h: 0.02,
        changePercent24h: 2.74,
        volume24h: 156000,
        exchange: 'Shanghai'
      },
      zinc: {
        symbol: 'ZN',
        name: 'Zinc',
        price: 2.85,
        currency: 'USD',
        unit: 'per kg',
        change24h: 0.08,
        changePercent24h: 2.89,
        volume24h: 67000,
        exchange: 'LME'
      },
      nickel: {
        symbol: 'NI',
        name: 'Nickel',
        price: 18.75,
        currency: 'USD',
        unit: 'per kg',
        change24h: -0.45,
        changePercent24h: -2.34,
        volume24h: 34000,
        exchange: 'LME'
      },
      lead: {
        symbol: 'PB',
        name: 'Lead',
        price: 2.12,
        currency: 'USD',
        unit: 'per kg',
        change24h: 0.05,
        changePercent24h: 2.41,
        volume24h: 45000,
        exchange: 'LME'
      }
    }

    return metals.map(metal => ({
      ...mockPrices[metal.toLowerCase()],
      lastUpdated: new Date().toISOString()
    } as MetalPrice))
  }

  private getMockMetalPrices(metals: string[]): MetalPrice[] {
    // Fallback mock data
    return metals.map(metal => ({
      symbol: metal.toUpperCase().substring(0, 2),
      name: metal.charAt(0).toUpperCase() + metal.slice(1),
      price: Math.random() * 50 + 1,
      currency: 'USD',
      unit: 'per kg',
      change24h: (Math.random() - 0.5) * 2,
      changePercent24h: (Math.random() - 0.5) * 10,
      volume24h: Math.floor(Math.random() * 100000),
      lastUpdated: new Date().toISOString(),
      exchange: 'Mock'
    }))
  }

  // Get precious metal prices with additional details
  async getPreciousMetalPrices(): Promise<PreciousMetalPrice[]> {
    const cacheKey = 'precious_metals'
    const cached = this.getFromCache(cacheKey)
    if (cached) return cached

    try {
      const preciousMetals = ['gold', 'silver', 'platinum', 'palladium']
      const basePrices = await this.getMetalPrices(preciousMetals)
      
      const preciousMetalPrices: PreciousMetalPrice[] = basePrices.map(price => ({
        ...price,
        purity: '99.9%',
        premiumOverSpot: Math.random() * 5 + 1, // 1-6% premium
        bidAskSpread: Math.random() * 0.5 + 0.1 // 0.1-0.6% spread
      }))

      this.setCache(cacheKey, preciousMetalPrices)
      return preciousMetalPrices
    } catch (error) {
      console.error('Error fetching precious metal prices:', error)
      return []
    }
  }

  // Get commodity prices for industrial materials
  async getCommodityPrices(): Promise<CommodityPrice[]> {
    const cacheKey = 'commodity_prices'
    const cached = this.getFromCache(cacheKey)
    if (cached) return cached

    try {
      await new Promise(resolve => setTimeout(resolve, 150))

      const commodities: CommodityPrice[] = [
        {
          commodity: 'Iron Ore',
          price: 125.50,
          currency: 'USD',
          unit: 'per tonne',
          change: 2.30,
          changePercent: 1.87,
          high52Week: 145.20,
          low52Week: 98.40,
          lastUpdated: new Date().toISOString(),
          exchange: 'Dalian'
        },
        {
          commodity: 'Coal',
          price: 89.75,
          currency: 'USD',
          unit: 'per tonne',
          change: -1.25,
          changePercent: -1.37,
          high52Week: 125.80,
          low52Week: 65.30,
          lastUpdated: new Date().toISOString(),
          exchange: 'Newcastle'
        },
        {
          commodity: 'Natural Gas',
          price: 3.45,
          currency: 'USD',
          unit: 'per MMBtu',
          change: 0.12,
          changePercent: 3.60,
          high52Week: 6.20,
          low52Week: 2.10,
          lastUpdated: new Date().toISOString(),
          exchange: 'NYMEX'
        },
        {
          commodity: 'Crude Oil',
          price: 78.90,
          currency: 'USD',
          unit: 'per barrel',
          change: 1.45,
          changePercent: 1.87,
          high52Week: 95.50,
          low52Week: 65.20,
          lastUpdated: new Date().toISOString(),
          exchange: 'WTI'
        }
      ]

      this.setCache(cacheKey, commodities)
      return commodities
    } catch (error) {
      console.error('Error fetching commodity prices:', error)
      return []
    }
  }

  // Get historical price trends
  async getMarketTrends(metal: string, periods: string[] = ['1D', '1W', '1M', '3M', '1Y']): Promise<MarketTrend[]> {
    const cacheKey = `trends_${metal}_${periods.join(',')}`
    const cached = this.getFromCache(cacheKey)
    if (cached) return cached

    try {
      await new Promise(resolve => setTimeout(resolve, 300))

      const currentPrice = await this.getMetalPrices([metal])
      const basePrice = currentPrice[0]?.price || 10

      const trends: MarketTrend[] = periods.map(period => {
        const volatility = Math.random() * 0.3 + 0.1 // 10-40% volatility
        const change = (Math.random() - 0.5) * volatility * basePrice
        const startPrice = basePrice - change
        
        return {
          period,
          startPrice,
          endPrice: basePrice,
          change,
          changePercent: (change / startPrice) * 100,
          volatility: volatility * 100,
          volume: Math.floor(Math.random() * 1000000)
        }
      })

      this.setCache(cacheKey, trends)
      return trends
    } catch (error) {
      console.error('Error fetching market trends:', error)
      return []
    }
  }

  // Calculate e-waste value based on metal content
  async calculateEWasteValue(metalContent: { [metal: string]: number }): Promise<{ totalValue: number, breakdown: { [metal: string]: number } }> {
    const prices = await this.getMetalPrices(Object.keys(metalContent))
    const breakdown: { [metal: string]: number } = {}
    let totalValue = 0

    for (const [metal, amount] of Object.entries(metalContent)) {
      const price = prices.find(p => p.name.toLowerCase() === metal.toLowerCase())
      if (price) {
        const value = amount * price.price
        breakdown[metal] = value
        totalValue += value
      }
    }

    return { totalValue, breakdown }
  }

  // Get regional price variations
  async getRegionalPrices(metal: string, regions: string[] = ['North America', 'Europe', 'Asia', 'Global']): Promise<{ [region: string]: number }> {
    const cacheKey = `regional_${metal}_${regions.join(',')}`
    const cached = this.getFromCache(cacheKey)
    if (cached) return cached

    try {
      await new Promise(resolve => setTimeout(resolve, 200))

      const basePrice = (await this.getMetalPrices([metal]))[0]?.price || 10
      const regionalPrices: { [region: string]: number } = {}

      regions.forEach(region => {
        // Simulate regional price variations
        const variation = (Math.random() - 0.5) * 0.2 // ±10% variation
        regionalPrices[region] = basePrice * (1 + variation)
      })

      this.setCache(cacheKey, regionalPrices)
      return regionalPrices
    } catch (error) {
      console.error('Error fetching regional prices:', error)
      return {}
    }
  }

  // Price alerts and notifications
  async setPriceAlert(metal: string, targetPrice: number, condition: 'above' | 'below'): Promise<{ alertId: string, message: string }> {
    const alertId = `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // In production, would store in database and set up monitoring
    const message = `Price alert set for ${metal}: notify when price goes ${condition} $${targetPrice}`
    
    return { alertId, message }
  }

  // Market analysis and insights
  async getMarketAnalysis(metal: string): Promise<{
    currentPrice: number
    trend: 'bullish' | 'bearish' | 'neutral'
    support: number
    resistance: number
    recommendation: string
    confidence: number
  }> {
    const prices = await this.getMetalPrices([metal])
    const trends = await this.getMarketTrends(metal)
    
    const currentPrice = prices[0]?.price || 0
    const weeklyTrend = trends.find(t => t.period === '1W')
    
    let trend: 'bullish' | 'bearish' | 'neutral' = 'neutral'
    if (weeklyTrend && weeklyTrend.changePercent > 2) trend = 'bullish'
    else if (weeklyTrend && weeklyTrend.changePercent < -2) trend = 'bearish'

    const support = currentPrice * 0.95 // 5% below current
    const resistance = currentPrice * 1.05 // 5% above current

    let recommendation = 'Hold'
    if (trend === 'bullish') recommendation = 'Buy'
    else if (trend === 'bearish') recommendation = 'Sell'

    const confidence = Math.random() * 30 + 70 // 70-100% confidence

    return {
      currentPrice,
      trend,
      support,
      resistance,
      recommendation,
      confidence
    }
  }

  // Cache management
  private getFromCache(key: string): any {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data
    }
    return null
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() })
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear()
  }

  // Get API status
  async getAPIStatus(): Promise<{ [provider: string]: { status: 'online' | 'offline', latency: number } }> {
    const status: { [provider: string]: { status: 'online' | 'offline', latency: number } } = {}

    for (const [provider, url] of this.baseUrls) {
      try {
        const start = Date.now()
        // In production, would make actual health check calls
        await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 50))
        const latency = Date.now() - start
        
        status[provider] = { status: 'online', latency }
      } catch (error) {
        status[provider] = { status: 'offline', latency: 0 }
      }
    }

    return status
  }
}

// Export singleton instance
export const marketPriceService = new MarketPriceService()