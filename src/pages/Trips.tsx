
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Truck, FileText, Calendar, Eye, Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { CreateTripWizard } from "@/components/trips/CreateTripWizard";
import { TripViewDetails } from "@/components/trips/TripViewDetails";

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
  const [showCreateWizard, setShowCreateWizard] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [showTripView, setShowTripView] = useState(false);
  const [showTripEdit, setShowTripEdit] = useState(false);
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
        return "bg-green-100 text-green-800 border-green-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleTripCreated = () => {
    setShowCreateWizard(false);
    fetchTrips();
    toast.success('Trip created successfully! 🎉');
  };

  const handleViewTrip = (trip: Trip) => {
    setSelectedTrip(trip);
    setShowTripView(true);
  };

  const handleEditTrip = (trip: Trip) => {
    setSelectedTrip(trip);
    setShowTripEdit(true);
    setShowTripView(false);
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
          <p className="text-gray-600">Streamlined trip creation and management with detailed tracking</p>
        </div>
        <Button onClick={() => setShowCreateWizard(true)} className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          <span>Schedule New Trip</span>
        </Button>
      </div>

      <Card className="border-0 shadow-md">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search trips by number, driver, or vehicle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredTrips.map((trip) => (
          <Card key={trip.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <Truck className="h-6 w-6 text-blue-600" />
                    <h3 className="text-xl font-bold text-gray-900">Trip #{trip.trip_number}</h3>
                    <Badge className={`${getStatusColor(trip.status)} border font-medium`}>
                      {trip.status.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Truck className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Vehicle:</span>
                      <span className="font-medium">{trip.vehicles?.license_plate || "Not assigned"}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-blue-500" />
                      <span className="text-gray-600">Inbound:</span>
                      <span className="font-medium">{trip.inbound_trips?.length || 0} trip(s)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-orange-500" />
                      <span className="text-gray-600">Outbound:</span>
                      <span className="font-medium">{trip.outbound_trips?.length || 0} trip(s)</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">Local Driver:</span>
                      <span className="font-medium">
                        {trip.local_driver ? `${trip.local_driver.first_name} ${trip.local_driver.last_name}` : "Not assigned"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">Route Driver:</span>
                      <span className="font-medium">
                        {trip.route_driver ? `${trip.route_driver.first_name} ${trip.route_driver.last_name}` : "Not assigned"}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right ml-6">
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    ₹{calculateTripTotals(trip).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">Total Revenue</div>
                  <div className="flex items-center text-xs text-gray-400 mt-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(trip.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleViewTrip(trip)}
                  className="flex items-center space-x-1 hover:bg-blue-50 hover:border-blue-300"
                >
                  <Eye className="h-4 w-4" />
                  <span>View Details</span>
                </Button>
                <Button 
                  size="sm"
                  onClick={() => handleEditTrip(trip)}
                  className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit Trip</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTrips.length === 0 && !loading && (
        <Card className="border-2 border-dashed border-gray-200">
          <CardContent className="text-center py-12">
            <Truck className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No trips found</h3>
            <p className="text-gray-500 mb-4">Get started by scheduling your first trip</p>
            <Button onClick={() => setShowCreateWizard(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Schedule New Trip
            </Button>
          </CardContent>
        </Card>
      )}

      {showCreateWizard && (
        <CreateTripWizard
          onComplete={handleTripCreated}
          onCancel={() => setShowCreateWizard(false)}
        />
      )}

      {showTripView && selectedTrip && (
        <TripViewDetails
          trip={selectedTrip}
          onClose={() => {
            setShowTripView(false);
            setSelectedTrip(null);
          }}
          onEdit={() => handleEditTrip(selectedTrip)}
        />
      )}
    </div>
  );
};

export default Trips;
