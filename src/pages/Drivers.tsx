
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Edit, Trash2, Phone, Mail, Eye, EyeOff } from "lucide-react";
import { DriverForm } from "@/components/DriverForm";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Driver {
  id: string;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  phone: string;
  license_number: string;
  joining_date: string;
  age: number;
  salary: number;
  address: string;
  city: string;
  state: string;
  status: string;
  experience: number;
  hire_date: string;
}

interface DriverFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  license_number: string;
  joining_date: string;
  age: number;
  salary: number;
  address: string;
  city: string;
  state: string;
  status: string;
  experience: number;
}

const Drivers = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [expandedDriverId, setExpandedDriverId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchDrivers();
    }
  }, [user]);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('drivers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDrivers(data || []);
    } catch (error) {
      console.error('Error fetching drivers:', error);
      toast.error('Failed to load drivers');
    } finally {
      setLoading(false);
    }
  };

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = 
      (driver.first_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (driver.last_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      driver.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || driver.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      case "on_leave":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    const first = firstName?.charAt(0) || '';
    const last = lastName?.charAt(0) || '';
    return (first + last).toUpperCase() || 'D';
  };

  const displayValue = (value: string | number | undefined) => {
    if (value === undefined || value === null || value === "") {
      return "Not set";
    }
    return value;
  };

  const handleAddDriver = async (driverData: DriverFormData) => {
    try {
      const { error } = await supabase
        .from('drivers')
        .insert([{
          ...driverData,
          user_id: user?.id
        }]);

      if (error) throw error;
      
      toast.success('Driver added successfully');
      setShowForm(false);
      fetchDrivers();
    } catch (error) {
      console.error('Error adding driver:', error);
      toast.error('Failed to add driver');
    }
  };

  const handleEditDriver = async (driverData: DriverFormData) => {
    if (!editingDriver) return;
    
    try {
      const { error } = await supabase
        .from('drivers')
        .update(driverData)
        .eq('id', editingDriver.id);

      if (error) throw error;

      toast.success('Driver updated successfully');
      setEditingDriver(null);
      setShowForm(false);
      fetchDrivers();
    } catch (error) {
      console.error('Error updating driver:', error);
      toast.error('Failed to update driver');
    }
  };

  const handleDeleteDriver = async (id: string) => {
    if (!confirm('Are you sure you want to delete this driver?')) return;
    
    try {
      const { error } = await supabase
        .from('drivers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Driver deleted successfully');
      fetchDrivers();
    } catch (error) {
      console.error('Error deleting driver:', error);
      toast.error('Failed to delete driver');
    }
  };

  const convertToFormData = (driver: Driver): DriverFormData => {
    return {
      first_name: driver.first_name || '',
      last_name: driver.last_name || '',
      email: driver.email,
      phone: driver.phone,
      license_number: driver.license_number,
      joining_date: driver.joining_date || '',
      age: driver.age || 0,
      salary: driver.salary || 0,
      address: driver.address || '',
      city: driver.city || '',
      state: driver.state || '',
      status: driver.status,
      experience: driver.experience || 0
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Drivers</h1>
          <p className="text-gray-600">Manage your driver workforce</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Driver</span>
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="on_leave">On Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredDrivers.map((driver) => (
          <Card key={driver.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {getInitials(driver.first_name, driver.last_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {displayValue(driver.first_name)} {displayValue(driver.last_name)}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Phone className="h-4 w-4" />
                        <span>{driver.phone}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>Joining: {displayValue(driver.joining_date)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <Badge className={getStatusColor(driver.status)}>
                      {driver.status}
                    </Badge>
                    <div className="text-sm text-gray-500 mt-1">
                      {driver.city && driver.state ? `${driver.city}, ${driver.state}` : 'Location not set'}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setExpandedDriverId(expandedDriverId === driver.id ? null : driver.id)}
                    >
                      {expandedDriverId === driver.id ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setEditingDriver(driver);
                        setShowForm(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteDriver(driver.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {expandedDriverId === driver.id && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Email:</span>
                      <span className="ml-2 font-medium">{driver.email}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Age:</span>
                      <span className="ml-2 font-medium">{displayValue(driver.age)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Experience:</span>
                      <span className="ml-2 font-medium">{driver.experience || 0} years</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Salary:</span>
                      <span className="ml-2 font-medium">{driver.salary ? `₹${driver.salary.toLocaleString()}` : 'Not set'}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500">Address:</span>
                      <span className="ml-2 font-medium">{displayValue(driver.address)}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDrivers.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">
              {searchTerm || statusFilter !== "all" 
                ? "No drivers found matching your criteria." 
                : "No drivers found. Add your first driver to get started."
              }
            </p>
          </CardContent>
        </Card>
      )}

      {showForm && (
        <DriverForm
          driver={editingDriver ? convertToFormData(editingDriver) : null}
          onSubmit={editingDriver ? handleEditDriver : handleAddDriver}
          onCancel={() => {
            setShowForm(false);
            setEditingDriver(null);
          }}
        />
      )}
    </div>
  );
};

export default Drivers;
