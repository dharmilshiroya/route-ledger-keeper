
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Download, TrendingUp, TrendingDown, Calendar } from "lucide-react";

const monthlyRevenue = [
  { month: "Jan", revenue: 45000, expenses: 30000, profit: 15000 },
  { month: "Feb", revenue: 52000, expenses: 32000, profit: 20000 },
  { month: "Mar", revenue: 48000, expenses: 29000, profit: 19000 },
  { month: "Apr", revenue: 55000, expenses: 35000, profit: 20000 },
  { month: "May", revenue: 60000, expenses: 38000, profit: 22000 },
  { month: "Jun", revenue: 58000, expenses: 36000, profit: 22000 },
];

const vehiclePerformance = [
  { vehicle: "TRK-001", trips: 45, revenue: 18000, efficiency: 85 },
  { vehicle: "TRK-002", trips: 38, revenue: 15200, efficiency: 78 },
  { vehicle: "TRK-003", trips: 52, revenue: 20800, efficiency: 92 },
  { vehicle: "TRK-004", trips: 41, revenue: 16400, efficiency: 80 },
];

const expenseBreakdown = [
  { name: "Fuel", value: 45, amount: 16200, color: "#3b82f6" },
  { name: "Maintenance", value: 25, amount: 9000, color: "#ef4444" },
  { name: "Insurance", value: 15, amount: 5400, color: "#10b981" },
  { name: "Tolls", value: 10, amount: 3600, color: "#f59e0b" },
  { name: "Other", value: 5, amount: 1800, color: "#8b5cf6" },
];

const Reports = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Comprehensive insights into your transportation operations</p>
        </div>
        <div className="flex space-x-3">
          <Select defaultValue="last-6-months">
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="last-3-months">Last 3 Months</SelectItem>
              <SelectItem value="last-6-months">Last 6 Months</SelectItem>
              <SelectItem value="last-year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold">$318,000</p>
                <div className="flex items-center space-x-1 text-green-600 text-sm">
                  <TrendingUp className="h-4 w-4" />
                  <span>+12.5%</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Expenses</p>
                <p className="text-2xl font-bold">$200,000</p>
                <div className="flex items-center space-x-1 text-red-600 text-sm">
                  <TrendingUp className="h-4 w-4" />
                  <span>+8.2%</span>
                </div>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Net Profit</p>
                <p className="text-2xl font-bold">$118,000</p>
                <div className="flex items-center space-x-1 text-green-600 text-sm">
                  <TrendingUp className="h-4 w-4" />
                  <span>+18.7%</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Trips</p>
                <p className="text-2xl font-bold">176</p>
                <div className="flex items-center space-x-1 text-green-600 text-sm">
                  <TrendingUp className="h-4 w-4" />
                  <span>+5.2%</span>
                </div>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue, Expenses & Profit Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, ""]} />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} name="Revenue" />
                <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="Expenses" />
                <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} name="Profit" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseBreakdown}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {expenseBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [
                  `${value}% ($${expenseBreakdown.find(e => e.name === name)?.amount.toLocaleString()})`,
                  name
                ]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Vehicle Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Vehicle</th>
                  <th className="text-left py-3 px-4">Total Trips</th>
                  <th className="text-left py-3 px-4">Revenue</th>
                  <th className="text-left py-3 px-4">Efficiency</th>
                  <th className="text-left py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {vehiclePerformance.map((vehicle) => (
                  <tr key={vehicle.vehicle} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{vehicle.vehicle}</td>
                    <td className="py-3 px-4">{vehicle.trips}</td>
                    <td className="py-3 px-4">${vehicle.revenue.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${vehicle.efficiency >= 85 ? 'bg-green-500' : vehicle.efficiency >= 75 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${vehicle.efficiency}%` }}
                          ></div>
                        </div>
                        <span className="text-sm">{vehicle.efficiency}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                        vehicle.efficiency >= 85 ? 'bg-green-100 text-green-800' :
                        vehicle.efficiency >= 75 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {vehicle.efficiency >= 85 ? 'Excellent' : vehicle.efficiency >= 75 ? 'Good' : 'Needs Attention'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
