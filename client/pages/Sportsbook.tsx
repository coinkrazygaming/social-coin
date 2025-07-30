import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Trophy,
  Activity,
  Clock,
  DollarSign,
  TrendingUp,
  Users,
  Target,
  Calendar,
  MapPin,
  Star,
  Zap,
  BarChart3,
  RefreshCw,
  Filter,
  Search,
  Play,
  Pause,
  Volume2,
  Coins,
  Timer,
  AlertCircle,
  CheckCircle,
  Crown,
} from 'lucide-react';
import { useAuth } from '@/components/AuthContext';
import { RealTimeWallet, WalletBalance } from '@/components/RealTimeWallet';
import { SportsEvent, SportsMarket, SportsBet } from '@shared/database';

interface LiveEvent extends SportsEvent {
  isLive: boolean;
  timeRemaining?: string;
  liveStats?: {
    possession?: number;
    shots?: number;
    corners?: number;
    yellowCards?: number;
    redCards?: number;
  };
}

interface BetSlip {
  events: Array<{
    event: LiveEvent;
    market: SportsMarket;
    selection: string;
    odds: number;
    stake: number;
  }>;
  totalStake: number;
  potentialWin: number;
  currency: 'GC' | 'SC';
}

export default function Sportsbook() {
  const { user } = useAuth();
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<LiveEvent[]>([]);
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [selectedLeague, setSelectedLeague] = useState<string>('all');
  const [betSlip, setBetSlip] = useState<BetSlip>({
    events: [],
    totalStake: 0,
    potentialWin: 0,
    currency: 'GC',
  });
  const [showBetSlip, setShowBetSlip] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [myBets, setMyBets] = useState<SportsBet[]>([]);
  const [activeView, setActiveView] = useState<'live' | 'upcoming' | 'mybets'>('live');

  // Sports categories
  const sports = [
    { id: 'all', name: 'All Sports', icon: Trophy },
    { id: 'football', name: 'Football', icon: Trophy },
    { id: 'basketball', name: 'Basketball', icon: Target },
    { id: 'baseball', name: 'Baseball', icon: Star },
    { id: 'hockey', name: 'Hockey', icon: Zap },
    { id: 'soccer', name: 'Soccer', icon: Activity },
    { id: 'tennis', name: 'Tennis', icon: Users },
  ];

  // Load sportsbook data
  useEffect(() => {
    loadSportsData();
    
    if (autoRefresh) {
      const interval = setInterval(() => {
        loadLiveUpdates();
      }, 5000); // Update every 5 seconds
      
      return () => clearInterval(interval);
    }
  }, [selectedSport, selectedLeague, autoRefresh]);

  const loadSportsData = async () => {
    setIsLoading(true);
    try {
      // Simulate API calls - in production, replace with real sports API
      const mockLiveEvents = generateMockLiveEvents();
      const mockUpcomingEvents = generateMockUpcomingEvents();
      
      setLiveEvents(mockLiveEvents);
      setUpcomingEvents(mockUpcomingEvents);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error loading sports data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadLiveUpdates = async () => {
    try {
      // Update live scores and odds in real-time
      setLiveEvents(prev => prev.map(event => ({
        ...event,
        home_score: event.home_score ? event.home_score + Math.floor(Math.random() * 2) : 0,
        away_score: event.away_score ? event.away_score + Math.floor(Math.random() * 2) : 0,
        odds: {
          ...event.odds,
          home: event.odds.home + (Math.random() - 0.5) * 0.2,
          away: event.odds.away + (Math.random() - 0.5) * 0.2,
        },
      })));
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error updating live data:', error);
    }
  };

  const generateMockLiveEvents = (): LiveEvent[] => {
    return [
      {
        id: 'live1',
        sport: 'football',
        league: 'NFL',
        home_team: 'New England Patriots',
        away_team: 'Buffalo Bills',
        start_time: new Date(Date.now() - 3600000).toISOString(),
        status: 'live',
        home_score: 14,
        away_score: 7,
        odds: { home: 1.85, away: 2.10, draw: 12.0 },
        markets: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        isLive: true,
        timeRemaining: '2nd Quarter - 8:32',
        liveStats: {
          possession: 58,
          shots: 12,
          corners: 3,
          yellowCards: 1,
          redCards: 0,
        },
      },
      {
        id: 'live2',
        sport: 'basketball',
        league: 'NBA',
        home_team: 'Los Angeles Lakers',
        away_team: 'Boston Celtics',
        start_time: new Date(Date.now() - 1800000).toISOString(),
        status: 'live',
        home_score: 89,
        away_score: 92,
        odds: { home: 1.92, away: 1.88 },
        markets: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        isLive: true,
        timeRemaining: '3rd Quarter - 4:25',
      },
      {
        id: 'live3',
        sport: 'soccer',
        league: 'Premier League',
        home_team: 'Manchester United',
        away_team: 'Liverpool',
        start_time: new Date(Date.now() - 2700000).toISOString(),
        status: 'live',
        home_score: 1,
        away_score: 2,
        odds: { home: 3.20, away: 1.75, draw: 3.80 },
        markets: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        isLive: true,
        timeRemaining: '68th minute',
        liveStats: {
          possession: 42,
          shots: 8,
          corners: 5,
          yellowCards: 3,
          redCards: 0,
        },
      },
    ];
  };

  const generateMockUpcomingEvents = (): LiveEvent[] => {
    return [
      {
        id: 'upcoming1',
        sport: 'football',
        league: 'NFL',
        home_team: 'Dallas Cowboys',
        away_team: 'Green Bay Packers',
        start_time: new Date(Date.now() + 7200000).toISOString(),
        status: 'scheduled',
        odds: { home: 1.95, away: 1.85 },
        markets: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        isLive: false,
      },
      {
        id: 'upcoming2',
        sport: 'basketball',
        league: 'NBA',
        home_team: 'Golden State Warriors',
        away_team: 'Chicago Bulls',
        start_time: new Date(Date.now() + 10800000).toISOString(),
        status: 'scheduled',
        odds: { home: 1.65, away: 2.25 },
        markets: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        isLive: false,
      },
    ];
  };

  const addToBetSlip = (event: LiveEvent, market: string, selection: string, odds: number) => {
    if (!user) return;

    const newBet = {
      event,
      market: { id: market, name: market } as SportsMarket,
      selection,
      odds,
      stake: 10, // Default stake
    };

    setBetSlip(prev => ({
      ...prev,
      events: [...prev.events, newBet],
    }));
    setShowBetSlip(true);
  };

  const removeFromBetSlip = (index: number) => {
    setBetSlip(prev => ({
      ...prev,
      events: prev.events.filter((_, i) => i !== index),
    }));
  };

  const updateStake = (index: number, stake: number) => {
    setBetSlip(prev => {
      const newEvents = [...prev.events];
      newEvents[index].stake = stake;
      
      const totalStake = newEvents.reduce((sum, bet) => sum + bet.stake, 0);
      const potentialWin = newEvents.reduce((sum, bet) => sum + (bet.stake * bet.odds), 0);
      
      return {
        ...prev,
        events: newEvents,
        totalStake,
        potentialWin,
      };
    });
  };

  const placeBets = async () => {
    if (!user || betSlip.events.length === 0) return;

    try {
      // TODO: Implement actual bet placement
      console.log('Placing bets:', betSlip);
      
      // Clear bet slip after successful placement
      setBetSlip({
        events: [],
        totalStake: 0,
        potentialWin: 0,
        currency: betSlip.currency,
      });
      setShowBetSlip(false);
      
      // Refresh user bets
      loadUserBets();
    } catch (error) {
      console.error('Error placing bets:', error);
    }
  };

  const loadUserBets = async () => {
    if (!user) return;
    
    // TODO: Load actual user bets from database
    setMyBets([]);
  };

  const filteredLiveEvents = liveEvents.filter(event => {
    const matchesSport = selectedSport === 'all' || event.sport === selectedSport;
    const matchesLeague = selectedLeague === 'all' || event.league === selectedLeague;
    const matchesSearch = !searchTerm || 
      event.home_team.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.away_team.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.league.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSport && matchesLeague && matchesSearch;
  });

  const filteredUpcomingEvents = upcomingEvents.filter(event => {
    const matchesSport = selectedSport === 'all' || event.sport === selectedSport;
    const matchesLeague = selectedLeague === 'all' || event.league === selectedLeague;
    const matchesSearch = !searchTerm || 
      event.home_team.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.away_team.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.league.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSport && matchesLeague && matchesSearch;
  });

  const formatTimeUntilStart = (startTime: string) => {
    const start = new Date(startTime);
    const now = new Date();
    const diff = start.getTime() - now.getTime();
    
    if (diff <= 0) return 'Started';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getSportIcon = (sport: string) => {
    const sportConfig = sports.find(s => s.id === sport);
    return sportConfig?.icon || Trophy;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800">
      {/* Header */}
      <section className="py-12 bg-gradient-to-r from-blue-900/50 to-purple-900/50">
        <div className="container px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-5xl font-bold text-white mb-2">
                <span className="text-gold">CoinKrazy</span> Sportsbook
              </h1>
              <p className="text-purple-200 text-xl">
                Live betting with real-time odds and instant payouts
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <RealTimeWallet compact />
              <Button
                variant={autoRefresh ? "default" : "outline"}
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={autoRefresh ? "bg-green-600 hover:bg-green-700" : ""}
              >
                {autoRefresh ? (
                  <Activity className="h-4 w-4 mr-2 animate-pulse" />
                ) : (
                  <Pause className="h-4 w-4 mr-2" />
                )}
                {autoRefresh ? "Live Updates" : "Paused"}
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl">
            <div className="text-center bg-gray-800/50 backdrop-blur-sm rounded-lg p-4">
              <Activity className="h-6 w-6 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-400">{liveEvents.length}</div>
              <div className="text-sm text-gray-400">Live Events</div>
            </div>
            <div className="text-center bg-gray-800/50 backdrop-blur-sm rounded-lg p-4">
              <Clock className="h-6 w-6 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-400">{upcomingEvents.length}</div>
              <div className="text-sm text-gray-400">Upcoming</div>
            </div>
            <div className="text-center bg-gray-800/50 backdrop-blur-sm rounded-lg p-4">
              <Target className="h-6 w-6 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-400">{betSlip.events.length}</div>
              <div className="text-sm text-gray-400">Bet Slip</div>
            </div>
            <div className="text-center bg-gray-800/50 backdrop-blur-sm rounded-lg p-4">
              <TrendingUp className="h-6 w-6 text-gold mx-auto mb-2" />
              <div className="text-2xl font-bold text-gold">Live</div>
              <div className="text-sm text-gray-400">Real-Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Controls */}
      <section className="py-6 bg-gray-800/30 backdrop-blur-sm">
        <div className="container px-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Sports Filter */}
            <div className="flex flex-wrap gap-2">
              {sports.map((sport) => {
                const Icon = sport.icon;
                return (
                  <Button
                    key={sport.id}
                    variant={selectedSport === sport.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSport(sport.id)}
                    className={selectedSport === sport.id 
                      ? "bg-gold text-black font-bold" 
                      : "border-gray-600 text-gray-300 hover:bg-gray-700"
                    }
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {sport.name}
                  </Button>
                );
              })}
            </div>

            {/* Search */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search teams, leagues..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div className="text-sm text-gray-400">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container px-4">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Events Section */}
            <div className="xl:col-span-3">
              <Tabs value={activeView} onValueChange={(value) => setActiveView(value as any)}>
                <TabsList className="grid w-full grid-cols-3 bg-gray-800/50 backdrop-blur-sm">
                  <TabsTrigger value="live" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                    <Activity className="h-4 w-4 mr-2" />
                    Live Events ({liveEvents.length})
                  </TabsTrigger>
                  <TabsTrigger value="upcoming" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                    <Clock className="h-4 w-4 mr-2" />
                    Upcoming ({upcomingEvents.length})
                  </TabsTrigger>
                  <TabsTrigger value="mybets" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                    <Trophy className="h-4 w-4 mr-2" />
                    My Bets ({myBets.length})
                  </TabsTrigger>
                </TabsList>

                {/* Live Events */}
                <TabsContent value="live" className="mt-6">
                  <div className="space-y-4">
                    {filteredLiveEvents.map((event) => {
                      const Icon = getSportIcon(event.sport);
                      return (
                        <Card key={event.id} className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <Icon className="h-5 w-5 text-gold" />
                                <div>
                                  <Badge className="bg-red-600 text-white animate-pulse mr-2">
                                    LIVE
                                  </Badge>
                                  <span className="text-sm text-gray-400">{event.league}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-gray-400">{event.timeRemaining}</div>
                                {event.liveStats && (
                                  <div className="text-xs text-gray-500">
                                    Possession: {event.liveStats.possession}%
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-3 gap-4 items-center">
                              {/* Home Team */}
                              <div className="text-center">
                                <div className="text-lg font-bold text-white">{event.home_team}</div>
                                <div className="text-3xl font-bold text-gold">{event.home_score}</div>
                                <Button
                                  size="sm"
                                  onClick={() => addToBetSlip(event, 'moneyline', 'home', event.odds.home)}
                                  className="mt-2 bg-green-600 hover:bg-green-700"
                                >
                                  {event.odds.home.toFixed(2)}
                                </Button>
                              </div>

                              {/* VS / Draw */}
                              <div className="text-center">
                                <div className="text-sm text-gray-400">VS</div>
                                {event.odds.draw && (
                                  <Button
                                    size="sm"
                                    onClick={() => addToBetSlip(event, 'moneyline', 'draw', event.odds.draw)}
                                    className="mt-2 bg-blue-600 hover:bg-blue-700"
                                  >
                                    Draw {event.odds.draw.toFixed(2)}
                                  </Button>
                                )}
                              </div>

                              {/* Away Team */}
                              <div className="text-center">
                                <div className="text-lg font-bold text-white">{event.away_team}</div>
                                <div className="text-3xl font-bold text-gold">{event.away_score}</div>
                                <Button
                                  size="sm"
                                  onClick={() => addToBetSlip(event, 'moneyline', 'away', event.odds.away)}
                                  className="mt-2 bg-green-600 hover:bg-green-700"
                                >
                                  {event.odds.away.toFixed(2)}
                                </Button>
                              </div>
                            </div>

                            {/* Live Stats */}
                            {event.liveStats && (
                              <div className="mt-4 pt-4 border-t border-gray-700">
                                <div className="grid grid-cols-3 gap-4 text-xs">
                                  <div className="text-center">
                                    <div className="text-gray-400">Shots</div>
                                    <div className="text-white font-bold">{event.liveStats.shots}</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-gray-400">Corners</div>
                                    <div className="text-white font-bold">{event.liveStats.corners}</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-gray-400">Cards</div>
                                    <div className="text-white font-bold">
                                      {event.liveStats.yellowCards + event.liveStats.redCards}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}

                    {filteredLiveEvents.length === 0 && (
                      <div className="text-center py-12">
                        <Activity className="h-16 w-16 mx-auto text-gray-500 mb-4" />
                        <h3 className="text-xl font-semibold mb-2 text-white">No live events</h3>
                        <p className="text-gray-400">Check back soon for live betting action!</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Upcoming Events */}
                <TabsContent value="upcoming" className="mt-6">
                  <div className="space-y-4">
                    {filteredUpcomingEvents.map((event) => {
                      const Icon = getSportIcon(event.sport);
                      return (
                        <Card key={event.id} className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <Icon className="h-5 w-5 text-gold" />
                                <div>
                                  <span className="text-sm text-gray-400">{event.league}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-blue-400">
                                  Starts in {formatTimeUntilStart(event.start_time)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {new Date(event.start_time).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-3 gap-4 items-center">
                              {/* Home Team */}
                              <div className="text-center">
                                <div className="text-lg font-bold text-white">{event.home_team}</div>
                                <Button
                                  size="sm"
                                  onClick={() => addToBetSlip(event, 'moneyline', 'home', event.odds.home)}
                                  className="mt-2 bg-green-600 hover:bg-green-700"
                                >
                                  {event.odds.home.toFixed(2)}
                                </Button>
                              </div>

                              {/* VS / Time */}
                              <div className="text-center">
                                <div className="text-sm text-gray-400">
                                  {new Date(event.start_time).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                                {event.odds.draw && (
                                  <Button
                                    size="sm"
                                    onClick={() => addToBetSlip(event, 'moneyline', 'draw', event.odds.draw)}
                                    className="mt-2 bg-blue-600 hover:bg-blue-700"
                                  >
                                    Draw {event.odds.draw.toFixed(2)}
                                  </Button>
                                )}
                              </div>

                              {/* Away Team */}
                              <div className="text-center">
                                <div className="text-lg font-bold text-white">{event.away_team}</div>
                                <Button
                                  size="sm"
                                  onClick={() => addToBetSlip(event, 'moneyline', 'away', event.odds.away)}
                                  className="mt-2 bg-green-600 hover:bg-green-700"
                                >
                                  {event.odds.away.toFixed(2)}
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}

                    {filteredUpcomingEvents.length === 0 && (
                      <div className="text-center py-12">
                        <Clock className="h-16 w-16 mx-auto text-gray-500 mb-4" />
                        <h3 className="text-xl font-semibold mb-2 text-white">No upcoming events</h3>
                        <p className="text-gray-400">New events are added regularly!</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* My Bets */}
                <TabsContent value="mybets" className="mt-6">
                  <div className="text-center py-12">
                    <Trophy className="h-16 w-16 mx-auto text-gray-500 mb-4" />
                    <h3 className="text-xl font-semibold mb-2 text-white">No bets placed yet</h3>
                    <p className="text-gray-400">Start betting on live or upcoming events!</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Bet Slip Sidebar */}
            <div className="space-y-6">
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Target className="h-5 w-5 mr-2 text-gold" />
                    Bet Slip
                    {betSlip.events.length > 0 && (
                      <Badge className="ml-2 bg-gold text-black">
                        {betSlip.events.length}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {betSlip.events.length === 0 ? (
                    <div className="text-center py-8">
                      <Target className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                      <p className="text-gray-400">Click odds to add bets</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Currency Selection */}
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant={betSlip.currency === 'GC' ? "default" : "outline"}
                          onClick={() => setBetSlip(prev => ({ ...prev, currency: 'GC' }))}
                          className={betSlip.currency === 'GC' ? "bg-gold text-black" : ""}
                        >
                          <Coins className="h-4 w-4 mr-1" />
                          GC
                        </Button>
                        <Button
                          size="sm"
                          variant={betSlip.currency === 'SC' ? "default" : "outline"}
                          onClick={() => setBetSlip(prev => ({ ...prev, currency: 'SC' }))}
                          className={betSlip.currency === 'SC' ? "bg-purple-600 text-white" : ""}
                        >
                          <Star className="h-4 w-4 mr-1" />
                          SC
                        </Button>
                      </div>

                      {/* Bet Events */}
                      <div className="space-y-3">
                        {betSlip.events.map((bet, index) => (
                          <div key={index} className="border border-gray-600 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <div className="text-sm text-white font-medium">
                                {bet.event.home_team} vs {bet.event.away_team}
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeFromBetSlip(index)}
                                className="h-6 w-6 p-0 text-gray-400 hover:text-red-400"
                              >
                                ×
                              </Button>
                            </div>
                            <div className="text-xs text-gray-400 mb-2">
                              {bet.selection} @ {bet.odds.toFixed(2)}
                            </div>
                            <Input
                              type="number"
                              value={bet.stake}
                              onChange={(e) => updateStake(index, Number(e.target.value))}
                              placeholder="Stake"
                              className="bg-gray-700 border-gray-600 text-white text-sm"
                            />
                          </div>
                        ))}
                      </div>

                      {/* Totals */}
                      <div className="border-t border-gray-600 pt-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-400">Total Stake:</span>
                          <WalletBalance 
                            currency={betSlip.currency} 
                            amount={betSlip.totalStake} 
                            size="sm" 
                          />
                        </div>
                        <div className="flex justify-between text-sm mb-4">
                          <span className="text-gray-400">Potential Win:</span>
                          <WalletBalance 
                            currency={betSlip.currency} 
                            amount={betSlip.potentialWin} 
                            size="sm" 
                          />
                        </div>
                        <Button
                          onClick={placeBets}
                          disabled={!user || betSlip.events.length === 0}
                          className="w-full bg-green-600 hover:bg-green-700 font-bold"
                        >
                          Place Bets
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Featured Promotions */}
              <Card className="bg-gradient-to-br from-gold/10 to-yellow-400/5 border-gold/20">
                <CardHeader>
                  <CardTitle className="text-gold flex items-center">
                    <Star className="h-5 w-5 mr-2" />
                    Promotions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm">
                      <div className="font-medium text-white">Welcome Bonus</div>
                      <div className="text-gray-400">Get 100% match on first bet</div>
                    </div>
                    <div className="text-sm">
                      <div className="font-medium text-white">Live Betting Boost</div>
                      <div className="text-gray-400">+10% on all live bets today</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
