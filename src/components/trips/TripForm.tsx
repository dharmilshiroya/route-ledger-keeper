
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface TripFormProps {
  onSubmit: () => void;
  onCancel: () => void;
}

interface Driver {
  id: string;
  first_name: string;
  last_name: string;
}

interface Vehicle {
  id: string;
  license_plate: string;
}

export function TripForm({ onSubmit, onCancel }: TripFormProps) {
  const [tripNumber, setTripNumber] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [localDriverId, setLocalDriverId] = useState("");
  const [routeDriverId, setRouteDriverId] = useState("");
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchDriversAndVehicles();
    generateTripNumber();
  }, []);

  const generateTripNumber = () => {
    const timestamp = Date.now().toString().slice(-6);
    setTripNumber(`TR-${timestamp}`);
  };

  const fetchDriversAndVehicles = async () => {
    try {
      const [driversResult, vehiclesResult] = await Promise.all([
        supabase.from('drivers').select('id, first_name, last_name').eq('status', 'active'),
        supabase.from('vehicles').select('id, license_plate').eq('status', 'active')
      ]);

      if (driversResult.error) throw driversResult.error;
      if (vehiclesResult.error) throw vehiclesResult.error;

      setDrivers(driversResult.data || []);
      setVehicles(vehiclesResult.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load drivers and vehicles');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('trips')
        .insert({
          trip_number: tripNumber,
          user_id: user.id,
          vehicle_id: vehicleId || null,
          local_driver_id: localDriverId || null,
          route_driver_id: routeDriverId || null,
          status: 'active'
        });

      if (error) throw error;
      onSubmit();
    } catch (error) {
      console.error('Error creating trip:', error);
      toast.error('Failed to create trip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create New Trip</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="trip_number">Trip Number</Label>
              <Input
                id="trip_number"
                value={tripNumber}
                onChange={(e) => setTripNumber(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicle">Vehicle</Label>
              <Select value={vehicleId} onValueChange={setVehicleId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle (optional)" />
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

            <div className="space-y-2">
              <Label htmlFor="local_driver">Local Driver</Label>
              <Select value={localDriverId} onValueChange={setLocalDriverId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select local driver (optional)" />
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

            <div className="space-y-2">
              <Label htmlFor="route_driver">Route Driver</Label>
              <Select value={routeDriverId} onValueChange={setRouteDriverId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select route driver (optional)" />
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

            <div className="flex space-x-3 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Creating..." : "Create Trip"}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
