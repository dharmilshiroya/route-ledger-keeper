
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { TripData } from "../CreateTripWizard";

interface Driver {
  id: string;
  first_name: string;
  last_name: string;
}

interface Vehicle {
  id: string;
  license_plate: string;
}

interface TripBasicDetailsProps {
  data: Partial<TripData>;
  onNext: (data: Partial<TripData>) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export function TripBasicDetails({ data, onNext, onCancel, isEditing = false }: TripBasicDetailsProps) {
  const [formData, setFormData] = useState({
    vehicleId: data.vehicleId || "",
    localDriverId: data.localDriverId || "",
    routeDriverId: data.routeDriverId || "",
    status: data.status || "active"
  });
  
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [tripNumber, setTripNumber] = useState(data.tripNumber || "");
  const { user } = useAuth();

  useEffect(() => {
    fetchDriversAndVehicles();
    if (isEditing && data.tripNumber) {
      setTripNumber(data.tripNumber);
    } else if (!isEditing) {
      generateTripNumber();
    }
  }, [isEditing, data.tripNumber]);

  const generateTripNumber = async () => {
    try {
      const { count } = await supabase
        .from('trips')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id);

      const tripNum = `TR-${Date.now().toString().slice(-6)}-${(count || 0) + 1}`;
      setTripNumber(tripNum);
    } catch (error) {
      console.error('Error generating trip number:', error);
      setTripNumber(`TR-${Date.now().toString().slice(-6)}`);
    }
  };

  const fetchDriversAndVehicles = async () => {
    try {
      const [driversResult, vehiclesResult] = await Promise.all([
        supabase.from('drivers').select('id, first_name, last_name').eq('status', 'active'),
        supabase.from('vehicles').select('id, license_plate').eq('status', 'active')
      ]);

      if (driversResult.data) setDrivers(driversResult.data);
      if (vehiclesResult.data) setVehicles(vehiclesResult.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!formData.vehicleId) {
      alert('Please select a vehicle to continue');
      return;
    }

    setLoading(true);
    try {
      if (isEditing && data.tripId) {
        // Update existing trip
        const { error } = await supabase
          .from('trips')
          .update({
            vehicle_id: formData.vehicleId,
            local_driver_id: formData.localDriverId || null,
            route_driver_id: formData.routeDriverId || null,
            status: formData.status
          })
          .eq('id', data.tripId);

        if (error) throw error;
        
        onNext({ 
          ...formData, 
          tripNumber,
          tripId: data.tripId 
        });
      } else {
        // Create new trip
        const { data: tripData, error } = await supabase
          .from('trips')
          .insert({
            trip_number: tripNumber,
            user_id: user.id,
            vehicle_id: formData.vehicleId,
            local_driver_id: formData.localDriverId || null,
            route_driver_id: formData.routeDriverId || null,
            status: formData.status
          })
          .select()
          .single();

        if (error) throw error;
        
        onNext({ 
          ...formData, 
          tripNumber,
          tripId: tripData.id 
        });
      }
    } catch (error) {
      console.error('Error saving trip:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-hidden">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="text-2xl">
            {isEditing ? "Edit Trip Details" : "Basic Trip Details"}
          </CardTitle>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Trip Number:</span>
            <span className="font-mono font-semibold text-blue-600">{tripNumber}</span>
            {!isEditing && <span className="text-xs text-gray-500">(Auto-generated)</span>}
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-lg">
                    <Truck className="h-5 w-5 mr-2 text-blue-600" />
                    Trip Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="status">Trip Status</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="vehicle">Vehicle <span className="text-red-500">*</span></Label>
                    <Select 
                      value={formData.vehicleId} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, vehicleId: value }))}
                      required
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select vehicle (required)" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicles.map((vehicle) => (
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            {vehicle.license_plate}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-lg">
                    <Users className="h-5 w-5 mr-2 text-green-600" />
                    Driver Assignment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="local_driver">Local Driver</Label>
                    <Select value={formData.localDriverId} onValueChange={(value) => setFormData(prev => ({ ...prev, localDriverId: value }))}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select local driver" />
                      </SelectTrigger>
                      <SelectContent>
                        {drivers.map((driver) => (
                          <SelectItem key={driver.id} value={driver.id}>
                            {driver.first_name} {driver.last_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="route_driver">Route Driver</Label>
                    <Select value={formData.routeDriverId} onValueChange={(value) => setFormData(prev => ({ ...prev, routeDriverId: value }))}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select route driver" />
                      </SelectTrigger>
                      <SelectContent>
                        {drivers.map((driver) => (
                          <SelectItem key={driver.id} value={driver.id}>
                            {driver.first_name} {driver.last_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading || !formData.vehicleId} 
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? "Saving..." : isEditing ? "Update Basic Details" : "Save Basic Details"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
