
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Receipt, TrendingUp, Fuel, Wrench } from "lucide-react";

interface Expense {
  id: string;
  type: "fuel" | "maintenance" | "insurance" | "tolls" | "other";
  amount: number;
  description: string;
  vehicle: string;
  date: string;
  receipt?: string;
}

const sampleExpenses: Expense[] = [
  {
    id: "1",
    type: "fuel",
    amount: 85.50,
    description: "Fuel fill-up at Shell Station",
    vehicle: "TRK-001",
    date: "2024-06-04",
    receipt: "receipt-001.jpg"
  },
  {
    id: "2",
    type: "maintenance",
    amount: 245.00,
    description: "Oil change and tire rotation",
    vehicle: "TRK-002",
    date: "2024-06-03",
    receipt: "receipt-002.jpg"
  },
  {
    id: "3",
    type: "tolls",
    amount: 12.75,
    description: "Highway toll - Route 95",
    vehicle: "TRK-001",
    date: "2024-06-03"
  },
  {
    id: "4",
    type: "insurance",
    amount: 180.00,
    description: "Monthly vehicle insurance",
    vehicle: "TRK-003",
    date: "2024-06-01"
  }
];

const Expenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>(sampleExpenses);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.vehicle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || expense.type === filterType;
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case "fuel":
        return "bg-blue-100 text-blue-800";
      case "maintenance":
        return "bg-red-100 text-red-800";
      case "insurance":
        return "bg-green-100 text-green-800";
      case "tolls":
        return "bg-yellow-100 text-yellow-800";
      case "other":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "fuel":
        return <Fuel className="h-4 w-4" />;
      case "maintenance":
        return <Wrench className="h-4 w-4" />;
      case "insurance":
        return <Receipt className="h-4 w-4" />;
      default:
        return <Receipt className="h-4 w-4" />;
    }
  };

  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-600">Track and manage your transportation costs</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Expense</span>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Total Expenses</p>
                <p className="text-2xl font-bold">${totalExpenses.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Fuel className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Fuel Costs</p>
                <p className="text-2xl font-bold">
                  ${expenses.filter(e => e.type === "fuel").reduce((sum, e) => sum + e.amount, 0).toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Wrench className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-sm text-gray-500">Maintenance</p>
                <p className="text-2xl font-bold">
                  ${expenses.filter(e => e.type === "maintenance").reduce((sum, e) => sum + e.amount, 0).toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Receipt className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-500">Other Costs</p>
                <p className="text-2xl font-bold">
                  ${expenses.filter(e => !["fuel", "maintenance"].includes(e.type)).reduce((sum, e) => sum + e.amount, 0).toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex space-x-2">
              {["all", "fuel", "maintenance", "insurance", "tolls", "other"].map((type) => (
                <Button
                  key={type}
                  variant={filterType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType(type)}
                  className="capitalize"
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expenses List */}
      <div className="space-y-4">
        {filteredExpenses.map((expense) => (
          <Card key={expense.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {getTypeIcon(expense.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold">{expense.description}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Vehicle: {expense.vehicle}</span>
                      <span>Date: {expense.date}</span>
                      {expense.receipt && (
                        <span className="flex items-center space-x-1">
                          <Receipt className="h-4 w-4" />
                          <span>Receipt attached</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Badge className={getTypeColor(expense.type)}>
                    {expense.type}
                  </Badge>
                  <div className="text-right">
                    <div className="text-lg font-bold">${expense.amount.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Expenses;
