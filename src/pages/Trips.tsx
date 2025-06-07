
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Truck, FileText, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { TripForm } from "@/components/trips/TripForm";
import { TripDetails } from "@/components/trips/TripDetails";

interface Trip {
  id: string;
  trip_number: string;
  user_id: string;
  vehicle_id?: string;
  local_driver_id?: string;
  route_driver_id?: string;
  status: string;
  created_at: string;
  vehicles?: { license_plate: string };
  local_driver?: { first_name: string; last_name: string };
  route_driver?: { first_name: string; last_name: string };
  inbound_trips?: Array<{
    id: string;
    date: string;
    source: string;
    destination: string;
    total_weight: number;
    total_fare: number;
  }>;
  outbound_trips?: Array<{
    id: string;
    date: string;
    source: string;
    destination: string;
    total_weight: number;
    total_fare: number;
  }>;
}

const Trips = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showTripForm, setShowTripForm] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [showTripDetails, setShowTripDetails] = useState(false);
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
          vehicles(license_plate),
          local_driver:drivers!trips_local_driver_id_fkey(first_name, last_name),
          route_driver:drivers!trips_route_driver_id_fkey(first_name, last_name),
          inbound_trips(id, date, source, destination, total_weight, total_fare),
          outbound_trips(id, date, source, destination, total_weight, total_fare)
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
    trip.trip_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.local_driver?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.local_driver?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.route_driver?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.route_driver?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.vehicles?.license_plate?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleTripCreated = () => {
    setShowTripForm(false);
    fetchTrips();
    toast.success('Trip created successfully');
  };

  const handleViewDetails = (trip: Trip) => {
    setSelectedTrip(trip);
    setShowTripDetails(true);
  };

  const calculateTripTotals = (trip: Trip) => {
    const inboundTotal = trip.inbound_trips?.reduce((sum, ib) => sum + (ib.total_fare || 0), 0) || 0;
    const outboundTotal = trip.outbound_trips?.reduce((sum, ob) => sum + (ob.total_fare || 0), 0) || 0;
    return inboundTotal + outboundTotal;
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
          <h1 className="text-3xl font-bold text-gray-900">Trip Management</h1>
          <p className="text-gray-600">Manage inbound and outbound trips with detailed bill book entries</p>
        </div>
        <Button onClick={() => setShowTripForm(true)} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>New Trip</span>
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search trips by number, driver, or vehicle..."
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
                    <Truck className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold">Trip #{trip.trip_number}</h3>
                    <Badge className={getStatusColor(trip.status)}>
                      {trip.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Vehicle:</span> {trip.vehicles?.license_plate || "Not assigned"}
                    </div>
                    <div>
                      <span className="font-medium">Local Driver:</span> {
                        trip.local_driver ? 
                        `${trip.local_driver.first_name} ${trip.local_driver.last_name}` : 
                        "Not assigned"
                      }
                    </div>
                    <div>
                      <span className="font-medium">Route Driver:</span> {
                        trip.route_driver ? 
                        `${trip.route_driver.first_name} ${trip.route_driver.last_name}` : 
                        "Not assigned"
                      }
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    ₹{calculateTripTotals(trip).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">Total Revenue</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center space-x-2 text-sm">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <span>Inbound Trips: {trip.inbound_trips?.length || 0}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <FileText className="h-4 w-4 text-orange-500" />
                  <span>Outbound Trips: {trip.outbound_trips?.length || 0}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>Created: {new Date(trip.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleViewDetails(trip)}
                >
                  View Details
                </Button>
                <Button size="sm">
                  Manage Trip
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTrips.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-8">
            <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No trips found. Create your first trip to get started.</p>
          </CardContent>
        </Card>
      )}

      {showTripForm && (
        <TripForm
          onSubmit={handleTripCreated}
          onCancel={() => setShowTripForm(false)}
        />
      )}

      {showTripDetails && selectedTrip && (
        <TripDetails
          trip={selectedTrip}
          onClose={() => {
            setShowTripDetails(false);
            setSelectedTrip(null);
          }}
          onTripUpdated={fetchTrips}
        />
      )}
    </div>
  );
};

export default Trips;
