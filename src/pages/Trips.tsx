
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, MapPin, Clock, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Trip {
  id: string;
  driver_id: string;
  vehicle_id: string;
  origin: string;
  destination: string;
  distance: number;
  status: string;
  start_time: string;
  end_time?: string;
  revenue: number;
  drivers?: { name: string };
  vehicles?: { license_plate: string };
}

const Trips = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchTrips();
    }
  }, [user]);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('trips')
        .select(`
          *,
          drivers(name),
          vehicles(license_plate)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTrips(data || []);
    } catch (error) {
      console.error('Error fetching trips:', error);
      toast.error('Failed to load trips');
    } finally {
      setLoading(false);
    }
  };

  const filteredTrips = trips.filter(trip =>
    trip.drivers?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.vehicles?.license_plate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleString();
  };

  const calculateDuration = (startTime: string, endTime?: string) => {
    if (!endTime) return "In progress";
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffHours = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60) * 10) / 10;
    return `${diffHours} hours`;
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
          <h1 className="text-3xl font-bold text-gray-900">Trips</h1>
          <p className="text-gray-600">Track and manage your transportation routes</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Schedule Trip</span>
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search trips..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredTrips.map((trip) => (
          <Card key={trip.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold">Trip #{trip.id.slice(0, 8)}</h3>
                    <Badge className={getStatusColor(trip.status)}>
                      {trip.status.replace("-", " ")}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    Driver: <span className="font-medium">{trip.drivers?.name || "Not assigned"}</span> • 
                    Vehicle: <span className="font-medium">{trip.vehicles?.license_plate || "Not assigned"}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-green-600 font-semibold">
                    <DollarSign className="h-4 w-4" />
                    <span>${trip.revenue || 0}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-sm">Route</div>
                    <div className="text-sm text-gray-600">
                      {trip.origin} → {trip.destination}
                    </div>
                    <div className="text-xs text-gray-500">{trip.distance || 0} miles</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-sm">Schedule</div>
                    <div className="text-sm text-gray-600">
                      Started: {formatDateTime(trip.start_time)}
                    </div>
                    {trip.end_time && (
                      <div className="text-sm text-gray-600">
                        Ended: {formatDateTime(trip.end_time)}
                      </div>
                    )}
                    <div className="text-xs text-gray-500">
                      Duration: {calculateDuration(trip.start_time, trip.end_time)}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  {trip.status === "scheduled" && (
                    <Button size="sm">
                      Start Trip
                    </Button>
                  )}
                  {trip.status === "in-progress" && (
                    <Button size="sm" variant="destructive">
                      Complete Trip
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTrips.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No trips found. Schedule your first trip to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Trips;
