
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StockData } from '@/types/database';
import { Download, Filter, Search, RefreshCcw } from 'lucide-react';

interface DatabaseViewerProps {
  data: StockData[];
  onRefresh: () => void;
  isLoading: boolean;
}

const DatabaseViewer: React.FC<DatabaseViewerProps> = ({ 
  data, 
  onRefresh,
  isLoading 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState<'date' | 'price' | 'volume'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Filter and sort data
  const filteredData = data
    .filter(item => {
      if (!searchTerm) return true;
      return item.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.close.toString().includes(searchTerm);
    })
    .sort((a, b) => {
      if (filterBy === 'date') {
        return sortDirection === 'asc' 
          ? new Date(a.date).getTime() - new Date(b.date).getTime() 
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (filterBy === 'price') {
        return sortDirection === 'asc' ? a.close - b.close : b.close - a.close;
      } else {
        return sortDirection === 'asc' ? a.volume - b.volume : b.volume - a.volume;
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  // Download CSV
  const downloadCSV = () => {
    const headers = ['Date', 'Open', 'High', 'Low', 'Close', 'Volume', 'Predicted'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map(item => 
        [
          item.date, 
          item.open, 
          item.high, 
          item.low, 
          item.close, 
          item.volume,
          item.predictedClose || 'N/A'
        ].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `reliance_stock_data_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="w-full shadow-lg border-blue-200">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-blue-800">Stock Database Explorer</CardTitle>
            <CardDescription>
              Browse, search, and export stock data
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            className="border-blue-300 text-blue-700 hover:bg-blue-50"
            onClick={onRefresh}
            disabled={isLoading}
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search by date or price..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-8"
              />
            </div>
            <div className="flex gap-2">
              <div className="w-40">
                <Select
                  value={filterBy}
                  onValueChange={(value) => setFilterBy(value as 'date' | 'price' | 'volume')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="volume">Volume</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-32">
                <Select
                  value={sortDirection}
                  onValueChange={(value) => setSortDirection(value as 'asc' | 'desc')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Newest</SelectItem>
                    <SelectItem value="asc">Oldest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                variant="outline" 
                className="border-green-300 text-green-700 hover:bg-green-50"
                onClick={downloadCSV}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Data Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-blue-50">
                <TableRow>
                  <TableHead className="text-blue-800">Date</TableHead>
                  <TableHead className="text-blue-800 text-right">Open</TableHead>
                  <TableHead className="text-blue-800 text-right">High</TableHead>
                  <TableHead className="text-blue-800 text-right">Low</TableHead>
                  <TableHead className="text-blue-800 text-right">Close</TableHead>
                  <TableHead className="text-blue-800 text-right">Volume</TableHead>
                  <TableHead className="text-blue-800 text-right">Predicted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i} className="animate-pulse">
                      <TableCell className="py-3">
                        <div className="h-4 bg-blue-100 rounded w-24"></div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="h-4 bg-blue-100 rounded w-16 ml-auto"></div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="h-4 bg-blue-100 rounded w-16 ml-auto"></div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="h-4 bg-blue-100 rounded w-16 ml-auto"></div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="h-4 bg-blue-100 rounded w-16 ml-auto"></div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="h-4 bg-blue-100 rounded w-20 ml-auto"></div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="h-4 bg-blue-100 rounded w-16 ml-auto"></div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : currentData.length > 0 ? (
                  currentData.map((item, i) => (
                    <TableRow key={i} className="hover:bg-blue-50">
                      <TableCell className="font-medium">{new Date(item.date).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">₹{item.open.toFixed(2)}</TableCell>
                      <TableCell className="text-right">₹{item.high.toFixed(2)}</TableCell>
                      <TableCell className="text-right">₹{item.low.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-medium">₹{item.close.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{item.volume.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        {item.predictedClose 
                          ? `₹${item.predictedClose.toFixed(2)}`
                          : 'N/A'
                        }
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No data found matching your search criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center pt-4">
              <div className="text-sm text-gray-500">
                Showing {(currentPage - 1) * recordsPerPage + 1} - {Math.min(currentPage * recordsPerPage, filteredData.length)} of {filteredData.length} records
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  Previous
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DatabaseViewer;
