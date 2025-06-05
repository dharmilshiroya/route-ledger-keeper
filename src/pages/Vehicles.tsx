
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { VehicleForm } from "@/components/VehicleForm";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Vehicle {
  id: string;
  license_plate: string;
  vehicle_owner: string;
  fuel_type: string;
  financed: boolean;
  national_permit_expiry: string;
  pucc_expiry: string;
  permit_expiry: string;
  insurance_expiry: string;
  emi_date?: string;
  status: string;
  mileage: number;
  last_service: string;
}

interface VehicleFormData {
  license_plate: string;
  vehicle_owner: string;
  fuel_type: string;
  financed: boolean;
  national_permit_expiry: string;
  pucc_expiry: string;
  permit_expiry: string;
  insurance_expiry: string;
  emi_date?: string;
  status: string;
  mileage: number;
  last_service: string;
}

const Vehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchVehicles();
    }
  }, [user]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVehicles(data || []);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast.error('Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.license_plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.vehicle_owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.fuel_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getFuelTypeColor = (fuelType: string) => {
    switch (fuelType) {
      case "CNG":
        return "bg-blue-100 text-blue-800";
      case "Diesel":
        return "bg-gray-100 text-gray-800";
      case "Bio Diesel":
        return "bg-green-100 text-green-800";
      default:
        return "bg-purple-100 text-purple-800";
    }
  };

  const isExpiryNear = (expiryDate: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
  };

  const isExpired = (expiryDate: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    return expiry < today;
  };

  const getExpiryStatus = (expiryDate: string) => {
    if (!expiryDate) return "text-gray-600";
    if (isExpired(expiryDate)) return "text-red-600 font-semibold";
    if (isExpiryNear(expiryDate)) return "text-orange-600 font-semibold";
    return "text-gray-600";
  };

  const displayValue = (value: string | number | undefined) => {
    if (value === undefined || value === null || value === "") {
      return "NA";
    }
    return value;
  };

  const handleAddVehicle = async (vehicleData: VehicleFormData) => {
    try {
      const { error } = await supabase
        .from('vehicles')
        .insert([{
          ...vehicleData,
          user_id: user?.id
        }]);

      if (error) throw error;
      
      toast.success('Vehicle added successfully');
      setShowForm(false);
      fetchVehicles();
    } catch (error) {
      console.error('Error adding vehicle:', error);
      toast.error('Failed to add vehicle');
    }
  };

  const handleEditVehicle = async (vehicleData: VehicleFormData) => {
    if (!editingVehicle) return;
    
    try {
      const { error } = await supabase
        .from('vehicles')
        .update(vehicleData)
        .eq('id', editingVehicle.id);

      if (error) throw error;

      toast.success('Vehicle updated successfully');
      setEditingVehicle(null);
      setShowForm(false);
      fetchVehicles();
    } catch (error) {
      console.error('Error updating vehicle:', error);
      toast.error('Failed to update vehicle');
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return;
    
    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Vehicle deleted successfully');
      fetchVehicles();
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      toast.error('Failed to delete vehicle');
    }
  };

  // Convert Vehicle to VehicleFormData format for editing
  const convertToFormData = (vehicle: Vehicle): VehicleFormData => {
    return {
      license_plate: vehicle.license_plate,
      vehicle_owner: vehicle.vehicle_owner,
      fuel_type: vehicle.fuel_type,
      financed: vehicle.financed,
      national_permit_expiry: vehicle.national_permit_expiry,
      pucc_expiry: vehicle.pucc_expiry,
      permit_expiry: vehicle.permit_expiry,
      insurance_expiry: vehicle.insurance_expiry,
      emi_date: vehicle.emi_date,
      status: vehicle.status,
      mileage: vehicle.mileage,
      last_service: vehicle.last_service
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
          <h1 className="text-3xl font-bold text-gray-900">Vehicles</h1>
          <p className="text-gray-600">Manage your fleet vehicles</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Vehicle</span>
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search vehicles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => (
          <Card key={vehicle.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{displayValue(vehicle.license_plate)}</CardTitle>
                  <p className="text-sm text-gray-500">Owner: {displayValue(vehicle.vehicle_owner)}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <Badge className={getStatusColor(vehicle.status)}>
                    {vehicle.status}
                  </Badge>
                  <Badge className={getFuelTypeColor(vehicle.fuel_type)}>
                    {vehicle.fuel_type}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Financed:</span>
                  <span className={vehicle.financed ? "text-orange-600" : "text-green-600"}>
                    {vehicle.financed ? "Yes" : "No"}
                  </span>
                </div>
                {vehicle.financed && vehicle.emi_date && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">EMI Date:</span>
                    <span>{vehicle.emi_date} of every month</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">National Permit:</span>
                  <span className={getExpiryStatus(vehicle.national_permit_expiry)}>
                    {displayValue(vehicle.national_permit_expiry)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">PUCC:</span>
                  <span className={getExpiryStatus(vehicle.pucc_expiry)}>
                    {displayValue(vehicle.pucc_expiry)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Permit:</span>
                  <span className={getExpiryStatus(vehicle.permit_expiry)}>
                    {displayValue(vehicle.permit_expiry)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Insurance:</span>
                  <span className={getExpiryStatus(vehicle.insurance_expiry)}>
                    {displayValue(vehicle.insurance_expiry)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Mileage:</span>
                  <span>{vehicle.mileage ? vehicle.mileage.toLocaleString() + " miles" : "NA"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Last Service:</span>
                  <span>{displayValue(vehicle.last_service)}</span>
                </div>
              </div>
              <div className="flex space-x-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingVehicle(vehicle);
                    setShowForm(true);
                  }}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteVehicle(vehicle.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVehicles.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No vehicles found. Add your first vehicle to get started.</p>
          </CardContent>
        </Card>
      )}

      {showForm && (
        <VehicleForm
          vehicle={editingVehicle ? convertToFormData(editingVehicle) : undefined}
          onSubmit={editingVehicle ? handleEditVehicle : handleAddVehicle}
          onCancel={() => {
            setShowForm(false);
            setEditingVehicle(null);
          }}
        />
      )}
    </div>
  );
};

export default Vehicles;
