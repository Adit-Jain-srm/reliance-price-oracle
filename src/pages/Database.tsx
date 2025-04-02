
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StockData, DatabaseStats } from '@/types/database';
import { 
  fetchAllStockData, 
  fetchDatabaseStats, 
  connectToDatabase,
  disconnectFromDatabase,
  getDatabaseConfig,
  syncDatabaseWithAPI,
  runCustomQuery
} from '@/services/stockService';
import { 
  Database, 
  Server, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2,
  Database as DatabaseIcon,
  BarChart, 
  LineChart,
  TableProperties,
  Code
} from 'lucide-react';
import DatabaseViewer from '@/components/DatabaseViewer';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const Database: React.FC = () => {
  const { toast } = useToast();
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [dbConfig, setDbConfig] = useState<{connected: boolean; type: string; lastSynced: string} | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dbType, setDbType] = useState<string>('supabase');
  const [sqlQuery, setSqlQuery] = useState<string>('SELECT * FROM stocks LIMIT 5');
  const [queryResults, setQueryResults] = useState<any>(null);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [isExecutingQuery, setIsExecutingQuery] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Fetch database configuration
      const config = await getDatabaseConfig();
      setDbConfig(config);
      
      // Fetch database stats
      const dbStats = await fetchDatabaseStats();
      setStats(dbStats);
      
      // Fetch all stock data
      const data = await fetchAllStockData('RELIANCE.NS');
      setStockData(data);
      
      toast({
        title: "Database connected",
        description: `Successfully connected to ${config.type} database`,
      });
    } catch (error) {
      console.error('Error loading database:', error);
      toast({
        title: "Database connection error",
        description: "There was a problem connecting to the database.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const success = await connectToDatabase(dbType);
      if (success) {
        toast({
          title: "Successfully connected",
          description: `Connected to ${dbType} database`,
        });
        loadData();
      }
    } catch (error) {
      console.error('Error connecting to database:', error);
      toast({
        title: "Connection failed",
        description: "Failed to connect to database",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      const success = await disconnectFromDatabase();
      if (success) {
        setDbConfig(prev => prev ? {...prev, connected: false} : null);
        toast({
          title: "Disconnected",
          description: "Successfully disconnected from database",
        });
      }
    } catch (error) {
      console.error('Error disconnecting from database:', error);
      toast({
        title: "Disconnect failed",
        description: "Failed to disconnect from database",
        variant: "destructive",
      });
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const success = await syncDatabaseWithAPI();
      if (success) {
        toast({
          title: "Sync completed",
          description: "Database successfully synchronized with external API",
        });
        loadData();
      }
    } catch (error) {
      console.error('Error syncing database:', error);
      toast({
        title: "Sync failed",
        description: "Failed to synchronize database",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const executeQuery = async () => {
    setIsExecutingQuery(true);
    setQueryError(null);
    try {
      const results = await runCustomQuery(sqlQuery);
      setQueryResults(results);
      toast({
        title: "Query executed",
        description: `Query returned ${results.rowCount} rows`,
      });
    } catch (error: any) {
      console.error('Error executing query:', error);
      setQueryResults(null);
      setQueryError(error.message || "Error executing query");
      toast({
        title: "Query failed",
        description: error.message || "An error occurred while executing the query",
        variant: "destructive",
      });
    } finally {
      setIsExecutingQuery(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      <Header 
        stockName="Database Explorer"
        currentPrice={0}
        previousClose={0}
        onRefresh={loadData}
        isLoading={isLoading}
        showPriceInfo={false}
      />
      
      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="explorer" className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="explorer" className="flex items-center gap-2">
              <DatabaseIcon size={16} />
              Data Explorer
            </TabsTrigger>
            <TabsTrigger value="connection" className="flex items-center gap-2">
              <Server size={16} />
              Connection
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart size={16} />
              Stats
            </TabsTrigger>
            <TabsTrigger value="query" className="flex items-center gap-2">
              <Code size={16} />
              SQL Query
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="explorer" className="space-y-6">
            <DatabaseViewer 
              data={stockData} 
              onRefresh={loadData} 
              isLoading={isLoading} 
            />
          </TabsContent>
          
          <TabsContent value="connection" className="space-y-6">
            <Card className="border-blue-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardTitle className="text-blue-800">Database Connection</CardTitle>
                <CardDescription>
                  Connect to your preferred database to store stock data and predictions
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-8">
                  {/* Connection Status */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Database className="text-blue-700" />
                        <div>
                          <h3 className="font-medium">Connection Status</h3>
                          <p className="text-sm text-gray-600">
                            {dbConfig?.connected 
                              ? `Connected to ${dbConfig.type} database` 
                              : "Not connected to any database"
                            }
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {dbConfig?.connected ? (
                          <div className="flex items-center">
                            <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                            <span className="text-green-600 font-medium">Connected</span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <AlertTriangle className="h-5 w-5 text-amber-600 mr-2" />
                            <span className="text-amber-600 font-medium">Disconnected</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Connection Controls */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                      <h3 className="font-medium text-lg mb-4">Connect to Database</h3>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Database Type</label>
                          <Select
                            disabled={dbConfig?.connected || isConnecting}
                            value={dbType}
                            onValueChange={setDbType}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select database type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="supabase">Supabase</SelectItem>
                              <SelectItem value="firebase">Firebase</SelectItem>
                              <SelectItem value="mock">Mock Database (Demo)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {dbType !== 'mock' && (
                          <>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Connection String</label>
                              <Input 
                                disabled={dbConfig?.connected || isConnecting}
                                type="text" 
                                placeholder="Database connection string"
                                value={dbType === 'supabase' ? 'https://your-project.supabase.co' : 'https://your-project.firebaseio.com'}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <label className="text-sm font-medium">API Key</label>
                              <Input 
                                disabled={dbConfig?.connected || isConnecting}
                                type="password" 
                                placeholder="Database API key"
                                value="••••••••••••••••"
                              />
                            </div>
                          </>
                        )}
                        
                        <div className="pt-4">
                          {dbConfig?.connected ? (
                            <Button 
                              variant="destructive" 
                              onClick={handleDisconnect}
                            >
                              Disconnect
                            </Button>
                          ) : (
                            <Button 
                              onClick={handleConnect} 
                              disabled={isConnecting}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              {isConnecting ? 'Connecting...' : 'Connect'}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                      <h3 className="font-medium text-lg mb-4">Data Synchronization</h3>
                      
                      <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Last synced:</span>
                            <span className="font-medium">
                              {dbConfig?.lastSynced 
                                ? new Date(dbConfig.lastSynced).toLocaleString() 
                                : 'Never'
                              }
                            </span>
                          </div>
                          
                          <div className="flex justify-between mt-2">
                            <span className="text-gray-600">Database type:</span>
                            <span className="font-medium capitalize">{dbConfig?.type || 'Not set'}</span>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                          <h4 className="font-medium mb-2">Sync Operations</h4>
                          <p className="text-sm text-gray-600 mb-4">
                            Synchronize your database with the latest market data from external APIs.
                          </p>
                          
                          <Button
                            variant="outline"
                            className="w-full border-blue-300 text-blue-700 hover:bg-blue-50"
                            onClick={handleSync}
                            disabled={!dbConfig?.connected || isSyncing}
                          >
                            <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                            {isSyncing ? 'Syncing...' : 'Sync with API'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="stats" className="space-y-6">
            <Card className="border-blue-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardTitle className="text-blue-800">Database Statistics</CardTitle>
                <CardDescription>
                  Summary of your database resources and usage
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {stats ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-blue-800 font-medium">Data Records</h3>
                        <TableProperties className="text-blue-700" />
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Stock data:</span>
                          <span className="font-bold text-blue-700">{stats.stockDataCount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Predictions:</span>
                          <span className="font-bold text-purple-600">{stats.predictionCount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Models:</span>
                          <span className="font-bold text-indigo-600">{stats.modelsCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total rows:</span>
                          <span className="font-bold text-gray-800">{stats.totalRows.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-5 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl border border-indigo-200 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-indigo-800 font-medium">Database Status</h3>
                        <Database className="text-indigo-700" />
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Connection:</span>
                          <span className={`font-bold ${stats.connectionStatus === 'Connected' ? 'text-green-600' : 'text-amber-600'}`}>
                            {stats.connectionStatus}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Type:</span>
                          <span className="font-bold text-indigo-700 capitalize">{stats.databaseType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Size:</span>
                          <span className="font-bold text-indigo-700">{stats.databaseSize}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Last updated:</span>
                          <span className="font-bold text-gray-800">
                            {new Date(stats.lastUpdated).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-purple-800 font-medium">Data Overview</h3>
                        <LineChart className="text-purple-700" />
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Data period:</span>
                          <span className="font-bold text-purple-700">2020-2024</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Prediction accuracy:</span>
                          <span className="font-bold text-green-600">97.9%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Market coverage:</span>
                          <span className="font-bold text-purple-700">NSE, BSE</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Active models:</span>
                          <span className="font-bold text-gray-800">3</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="animate-pulse grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                        <div className="h-6 bg-blue-100 rounded w-1/2 mb-4"></div>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <div className="h-4 bg-blue-100 rounded w-1/3"></div>
                            <div className="h-4 bg-blue-100 rounded w-1/4"></div>
                          </div>
                          <div className="flex justify-between">
                            <div className="h-4 bg-blue-100 rounded w-1/4"></div>
                            <div className="h-4 bg-blue-100 rounded w-1/5"></div>
                          </div>
                          <div className="flex justify-between">
                            <div className="h-4 bg-blue-100 rounded w-1/3"></div>
                            <div className="h-4 bg-blue-100 rounded w-1/6"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="query" className="space-y-6">
            <Card className="border-blue-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardTitle className="text-blue-800">SQL Query Editor</CardTitle>
                <CardDescription>
                  Run custom SQL queries against your database
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="sqlQuery" className="text-sm font-medium">SQL Query</label>
                    <Textarea
                      id="sqlQuery"
                      value={sqlQuery}
                      onChange={(e) => setSqlQuery(e.target.value)}
                      placeholder="Enter your SQL query here..."
                      className="font-mono h-32 border-blue-200"
                    />
                    <p className="text-xs text-gray-500">
                      Note: In demo mode, only SELECT queries are supported. 
                      No data will be modified.
                    </p>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button
                      onClick={executeQuery}
                      disabled={isExecutingQuery || !dbConfig?.connected}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isExecutingQuery ? 'Executing...' : 'Execute Query'}
                    </Button>
                  </div>
                  
                  {queryError && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <h4 className="text-red-700 font-medium mb-1">Error</h4>
                      <p className="text-sm text-red-600">{queryError}</p>
                    </div>
                  )}
                  
                  {queryResults && (
                    <div className="border rounded-lg overflow-hidden mt-4">
                      <div className="bg-blue-50 p-3 border-b border-blue-200">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium text-blue-800">Query Results</h4>
                          <span className="text-sm text-blue-600">
                            {queryResults.rowCount} rows returned
                          </span>
                        </div>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50 text-left text-gray-600 text-sm">
                            <tr>
                              {queryResults.results && queryResults.results.length > 0 && 
                                Object.keys(queryResults.results[0]).map(key => (
                                  <th key={key} className="px-4 py-2 font-medium">{key}</th>
                                ))
                              }
                            </tr>
                          </thead>
                          <tbody>
                            {queryResults.results && queryResults.results.map((row: any, i: number) => (
                              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                {Object.values(row).map((value: any, j: number) => (
                                  <td key={j} className="px-4 py-2 border-t border-gray-100">
                                    {typeof value === 'object' ? JSON.stringify(value) : value}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Database;
