
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Truck, MapPin, Calendar, Eye, Users, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { CreateTripWizard } from "@/components/trips/CreateTripWizard";
import { TripViewDetails } from "@/components/trips/TripViewDetails";
import { EmptyState } from "@/components/ui/empty-state";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  const [deletingTripId, setDeletingTripId] = useState<string | null>(null);
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

  const handleDeleteTrip = async (tripId: string) => {
    try {
      setDeletingTripId(tripId);
      
      // Delete related inbound and outbound trips first
      await supabase.from('inbound_trips').delete().eq('trip_id', tripId);
      await supabase.from('outbound_trips').delete().eq('trip_id', tripId);
      
      // Then delete the main trip
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', tripId);

      if (error) throw error;

      toast.success('Trip deleted successfully');
      fetchTrips();
    } catch (error) {
      console.error('Error deleting trip:', error);
      toast.error('Failed to delete trip');
    } finally {
      setDeletingTripId(null);
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

  const calculateTripTotals = (trip: Trip) => {
    const inboundTotal = trip.inbound_trips?.[0]?.total_fare || 0;
    const outboundTotal = trip.outbound_trips?.[0]?.total_fare || 0;
    const inboundWeight = trip.inbound_trips?.[0]?.total_weight || 0;
    const outboundWeight = trip.outbound_trips?.[0]?.total_weight || 0;
    return { 
      inboundTotal, 
      outboundTotal, 
      total: inboundTotal + outboundTotal,
      inboundWeight,
      outboundWeight
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
          <h1 className="text-3xl font-bold text-gray-900">Trip Management</h1>
          <p className="text-gray-600">Manage your vehicle trips with detailed tracking</p>
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
              placeholder="Search trips by vehicle, driver, or trip number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredTrips.map((trip) => {
          const totals = calculateTripTotals(trip);
          const inboundTrip = trip.inbound_trips?.[0];
          const outboundTrip = trip.outbound_trips?.[0];
          
          return (
            <Card key={trip.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <Truck className="h-6 w-6 text-blue-600" />
                      <h3 className="text-xl font-bold text-blue-900">
                        {trip.vehicles?.license_plate || "N/A"}
                      </h3>
                      <Badge className={`${getStatusColor(trip.status)} border font-medium`}>
                        {trip.status.toUpperCase()}
                      </Badge>
                      <span className="text-sm text-gray-500">#{trip.trip_number}</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-green-500" />
                        <span className="text-gray-600">Local:</span>
                        <span className="font-medium">
                          {trip.local_driver ? `${trip.local_driver.first_name} ${trip.local_driver.last_name}` : "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-purple-500" />
                        <span className="text-gray-600">Route:</span>
                        <span className="font-medium">
                          {trip.route_driver ? `${trip.route_driver.first_name} ${trip.route_driver.last_name}` : "N/A"}
                        </span>
                      </div>
                      {inboundTrip && (
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-blue-500" />
                          <span className="text-gray-600">Inbound Date:</span>
                          <span className="font-medium">{new Date(inboundTrip.date).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                      {inboundTrip && (
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <MapPin className="h-4 w-4 text-blue-600" />
                            <span className="font-semibold text-blue-800">Inbound Route</span>
                          </div>
                          <div className="text-sm text-blue-700">
                            {inboundTrip.source} → {inboundTrip.destination}
                          </div>
                          <div className="flex justify-between mt-2 text-xs">
                            <span>Weight: {totals.inboundWeight || "N/A"} kg</span>
                            <span className="font-semibold">₹{totals.inboundTotal.toLocaleString()}</span>
                          </div>
                        </div>
                      )}
                      
                      {outboundTrip && (
                        <div className="bg-orange-50 p-3 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <MapPin className="h-4 w-4 text-orange-600" />
                            <span className="font-semibold text-orange-800">Outbound Route</span>
                            <span className="text-xs text-orange-600">
                              ({new Date(outboundTrip.date).toLocaleDateString()})
                            </span>
                          </div>
                          <div className="text-sm text-orange-700">
                            {outboundTrip.source} → {outboundTrip.destination}
                          </div>
                          <div className="flex justify-between mt-2 text-xs">
                            <span>Weight: {totals.outboundWeight || "N/A"} kg</span>
                            <span className="font-semibold">₹{totals.outboundTotal.toLocaleString()}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right ml-6">
                    <div className="text-3xl font-bold text-green-600 mb-1">
                      ₹{totals.total.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">Total Fare</div>
                    <div className="text-xs text-gray-400 mt-1">
                      Total Weight: {(totals.inboundWeight + totals.outboundWeight) || "N/A"} kg
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
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-1 hover:bg-red-50 hover:border-red-300 text-red-600"
                        disabled={deletingTripId === trip.id}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>{deletingTripId === trip.id ? "Deleting..." : "Delete"}</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Trip</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete trip #{trip.trip_number}? This action cannot be undone and will permanently remove all associated data including inbound/outbound trips and items.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteTrip(trip.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete Trip
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredTrips.length === 0 && !loading && (
        <EmptyState
          icon={Truck}
          title="No trips found"
          description="Get started by scheduling your first trip"
          actionLabel="Schedule New Trip"
          onAction={() => setShowCreateWizard(true)}
        />
      )}

      {showCreateWizard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-hidden">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CreateTripWizard
              onComplete={handleTripCreated}
              onCancel={() => setShowCreateWizard(false)}
            />
          </div>
        </div>
      )}

      {showTripView && selectedTrip && (
        <TripViewDetails
          trip={selectedTrip}
          onClose={() => {
            setShowTripView(false);
            setSelectedTrip(null);
          }}
          onEdit={() => {
            fetchTrips();
          }}
        />
      )}
    </div>
  );
};

export default Trips;
