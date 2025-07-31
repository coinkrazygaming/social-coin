import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  BarChart3,
  TrendingUp,
  Users,
  AlertTriangle,
  Settings,
  Eye,
  Download,
  RefreshCw,
  Gamepad2,
  DollarSign,
  Activity,
  Shield,
  Database,
  Bot,
  Palette,
  Filter,
  Search,
  Calendar,
  Clock,
  Zap
} from 'lucide-react';
import { useAuth } from './AuthContext';
import { AdminGameEditor } from './AdminGameEditor';
import { SpinLoggerService } from '@shared/spinLogger';
import { RealTimeStatsService } from '@shared/realTimeStats';
import { APISlotProvidersService } from '@shared/apiSlotsProviders';
import { AdminSpinLog, RealTimeStats, SocialCasinoGame } from '@shared/socialCasinoTypes';

export function SocialCasinoAdminPanel() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [realTimeStats, setRealTimeStats] = useState<RealTimeStats | null>(null);
  const [spinLogs, setSpinLogs] = useState<AdminSpinLog[]>([]);
  const [topPerformers, setTopPerformers] = useState<any>(null);
  const [gameStats, setGameStats] = useState<any[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'today' | 'week' | 'month'>('today');
  const [showGameEditor, setShowGameEditor] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'admin') {
      loadAdminData();
      
      // Subscribe to real-time stats
      const unsubscribe = RealTimeStatsService.subscribe((stats) => {
        setRealTimeStats(stats);
      });

      return unsubscribe;
    }
  }, [user]);

  const loadAdminData = async () => {
    try {
      setIsLoading(true);
      
      // Load recent spin logs
      const logs = await SpinLoggerService.getAdminSpinLogs({
        limit: 50,
        dateFrom: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      });
      setSpinLogs(logs);

      // Load top performers
      const performers = await SpinLoggerService.getTopPerformers(selectedTimeframe);
      setTopPerformers(performers);

      // Load game statistics
      const stats = await RealTimeStatsService.getGameStats();
      setGameStats(stats);

    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportData = async (type: 'spins' | 'analytics' | 'all') => {
    try {
      let data = '';
      
      switch (type) {
        case 'spins':
          data = await SpinLoggerService.exportSpinLogs({}, 'csv');
          break;
        case 'analytics':
          data = JSON.stringify(gameStats, null, 2);
          break;
        case 'all':
          const spinsData = await SpinLoggerService.exportSpinLogs({}, 'json');
          const analyticsData = JSON.stringify(gameStats, null, 2);
          data = JSON.stringify({ spins: JSON.parse(spinsData), analytics: gameStats }, null, 2);
          break;
      }

      // Create and download file
      const blob = new Blob([data], { type: type === 'spins' ? 'text/csv' : 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `social_casino_${type}_${new Date().toISOString().split('T')[0]}.${type === 'spins' ? 'csv' : 'json'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Admin Access Required</h3>
            <p className="text-muted-foreground">
              This panel is only accessible to administrators.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 mx-auto text-gold animate-spin mb-4" />
          <h2 className="text-2xl font-bold mb-2">Loading Admin Panel</h2>
          <p className="text-muted-foreground">Gathering administrative data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <BarChart3 className="h-8 w-8 mr-3 text-gold" />
            Social Casino Admin Panel
          </h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive management and analytics for your social casino platform
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => loadAdminData()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setShowGameEditor(true)} className="bg-purple-600 hover:bg-purple-700">
            <Palette className="h-4 w-4 mr-2" />
            Game Editor
          </Button>
        </div>
      </div>

      {/* Real-Time Stats Overview */}
      {realTimeStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Spins Today</p>
                  <p className="text-3xl font-bold">{realTimeStats.total_spins_today.toLocaleString()}</p>
                </div>
                <Activity className="h-8 w-8 text-gold" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">SC Earned Today</p>
                  <p className="text-3xl font-bold">{realTimeStats.sc_earned_today.toFixed(2)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-sweep" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Players Online</p>
                  <p className="text-3xl font-bold">{realTimeStats.total_players_online}</p>
                </div>
                <Users className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Games</p>
                  <p className="text-3xl font-bold">{realTimeStats.total_active_games}</p>
                </div>
                <Gamepad2 className="h-8 w-8 text-casino-green" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="spins">Spin Logs</TabsTrigger>
          <TabsTrigger value="games">Game Stats</TabsTrigger>
          <TabsTrigger value="players">Players</TabsTrigger>
          <TabsTrigger value="providers">API Providers</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Earners */}
            {topPerformers && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-gold" />
                    Top Earners ({selectedTimeframe})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topPerformers.topEarners?.slice(0, 5).map((player: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                        <div className="flex items-center space-x-3">
                          <Badge className="bg-gold text-black">#{index + 1}</Badge>
                          <span className="font-medium">{player.player_name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{player.win_amount.toLocaleString()} {player.currency}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Biggest Wins */}
            {topPerformers && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-sweep" />
                    Biggest Wins ({selectedTimeframe})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topPerformers.biggestWins?.slice(0, 5).map((win: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                        <div>
                          <div className="font-medium">{win.player_name}</div>
                          <div className="text-sm text-muted-foreground">{win.game_name}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-sweep">{win.win_amount.toLocaleString()} {win.currency}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(win.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Game Performance Grid */}
          <Card>
            <CardHeader>
              <CardTitle>Game Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {gameStats.slice(0, 6).map((game) => (
                  <Card key={game.gameId} className="p-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold truncate">{game.gameName}</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Spins:</span>
                          <span className="ml-2 font-medium">{game.totalSpins}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Revenue:</span>
                          <span className="ml-2 font-medium">{game.totalRevenue.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Active:</span>
                          <span className="ml-2 font-medium">{game.activeNow}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Score:</span>
                          <span className="ml-2 font-medium">{game.popularityScore}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Spin Logs Tab */}
        <TabsContent value="spins" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Recent Spin Activity</h2>
            <div className="flex items-center space-x-2">
              <Button onClick={() => exportData('spins')} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button onClick={() => loadAdminData()} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr className="text-left">
                      <th className="p-4 font-medium">Player</th>
                      <th className="p-4 font-medium">Game</th>
                      <th className="p-4 font-medium">Bet</th>
                      <th className="p-4 font-medium">Win</th>
                      <th className="p-4 font-medium">Net</th>
                      <th className="p-4 font-medium">Time</th>
                      <th className="p-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {spinLogs.slice(0, 20).map((log) => (
                      <tr key={log.id} className="border-b hover:bg-muted/50">
                        <td className="p-4 font-medium">{log.player_name}</td>
                        <td className="p-4">{log.game_name}</td>
                        <td className="p-4">{log.bet_amount} {log.currency}</td>
                        <td className="p-4 text-green-600">{log.win_amount} {log.currency}</td>
                        <td className={`p-4 ${log.net_result >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {log.net_result >= 0 ? '+' : ''}{log.net_result}
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </td>
                        <td className="p-4">
                          {log.suspicious_activity ? (
                            <Badge variant="destructive">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Flagged
                            </Badge>
                          ) : (
                            <Badge variant="outline">Normal</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Game Stats Tab */}
        <TabsContent value="games" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Game Analytics</h2>
            <Button onClick={() => exportData('analytics')} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {gameStats.map((game) => (
              <Card key={game.gameId}>
                <CardHeader>
                  <CardTitle className="text-lg">{game.gameName}</CardTitle>
                  <CardDescription>{game.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Spins:</span>
                      <span className="font-medium">{game.totalSpins.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Revenue:</span>
                      <span className="font-medium">{game.totalRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Biggest Win:</span>
                      <span className="font-medium text-gold">{game.biggestWin.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Active Now:</span>
                      <span className="font-medium">{game.activeNow}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Popularity:</span>
                      <Badge variant="outline">{game.popularityScore}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* API Providers Tab */}
        <TabsContent value="providers" className="space-y-6">
          <h2 className="text-2xl font-bold">API Providers Status</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {APISlotProvidersService.getProviderStats().map((provider) => (
              <Card key={provider.name}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {provider.name}
                    <Badge variant={provider.isActive ? 'default' : 'secondary'}>
                      {provider.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Games:</span>
                      <span className="font-medium">{provider.gamesCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Sync:</span>
                      <span className="text-sm">
                        {new Date(provider.lastSync).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Error Rate:</span>
                      <span className="font-medium">{(provider.errorRate * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <h2 className="text-2xl font-bold">Security & Compliance</h2>
          
          {topPerformers?.suspiciousActivity && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-destructive">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Suspicious Activity ({topPerformers.suspiciousActivity.length} alerts)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topPerformers.suspiciousActivity.slice(0, 10).map((alert: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-destructive/10 rounded border border-destructive/20">
                      <div>
                        <div className="font-medium">{alert.player_name}</div>
                        <div className="text-sm text-muted-foreground">{alert.notes}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{alert.win_amount} {alert.currency}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(alert.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Game Editor Modal */}
      <Dialog open={showGameEditor} onOpenChange={setShowGameEditor}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Game Visual Editor</DialogTitle>
            <DialogDescription>
              Create and customize social casino games with AI assistance
            </DialogDescription>
          </DialogHeader>
          <AdminGameEditor 
            onSave={(gameData) => {
              console.log('Game saved:', gameData);
              setShowGameEditor(false);
              loadAdminData(); // Refresh data
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
