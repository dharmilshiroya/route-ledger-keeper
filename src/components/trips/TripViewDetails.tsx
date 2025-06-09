
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Truck, Users, MapPin, Package, Calendar, Edit } from "lucide-react";
import { TripDetails } from "./TripDetails";

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

interface TripViewDetailsProps {
  trip: Trip;
  onClose: () => void;
  onEdit: () => void;
}

export function TripViewDetails({ trip, onClose, onEdit }: TripViewDetailsProps) {
  const [showEditForm, setShowEditForm] = useState(false);

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

  const calculateTripTotals = () => {
    const inboundTotal = trip.inbound_trips?.reduce((sum, ib) => sum + (ib.total_fare || 0), 0) || 0;
    const outboundTotal = trip.outbound_trips?.reduce((sum, ob) => sum + (ob.total_fare || 0), 0) || 0;
    const totalWeight = (trip.inbound_trips?.[0]?.total_weight || 0) + (trip.outbound_trips?.[0]?.total_weight || 0);
    return { inboundTotal, outboundTotal, total: inboundTotal + outboundTotal, totalWeight };
  };

  const totals = calculateTripTotals();

  const handleEditClick = () => {
    setShowEditForm(true);
  };

  const handleEditClose = () => {
    setShowEditForm(false);
    onEdit(); // Refresh the trip data
  };

  if (showEditForm) {
    return (
      <TripDetails
        trip={trip}
        onClose={handleEditClose}
        onTripUpdated={onEdit}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-hidden">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-3 text-2xl">
                <Truck className="h-7 w-7 text-blue-600" />
                <span>Trip #{trip.trip_number}</span>
                <Badge className={`${getStatusColor(trip.status)} border`}>
                  {trip.status.toUpperCase()}
                </Badge>
              </CardTitle>
              <div className="mt-3 text-sm text-gray-600">
                Created on {new Date(trip.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleEditClick} className="bg-blue-600 hover:bg-blue-700">
                <Edit className="h-4 w-4 mr-2" />
                Edit Trip
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Trip Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-green-700">₹{totals.total.toLocaleString()}</div>
                <div className="text-sm text-green-600 mt-1">Total Revenue</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-700">₹{totals.inboundTotal.toLocaleString()}</div>
                <div className="text-sm text-blue-600 mt-1">Inbound Revenue</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-700">₹{totals.outboundTotal.toLocaleString()}</div>
                <div className="text-sm text-orange-600 mt-1">Outbound Revenue</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-700">{totals.totalWeight}</div>
                <div className="text-sm text-purple-600 mt-1">Total Weight (kg)</div>
              </CardContent>
            </Card>
          </div>

          {/* Trip Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <Truck className="h-5 w-5 mr-2 text-blue-600" />
                  Vehicle Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">License Plate:</span>
                  <span className="font-semibold">{trip.vehicles?.license_plate || "N/A"}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <Users className="h-5 w-5 mr-2 text-green-600" />
                  Driver Assignment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Local Driver:</span>
                  <span className="font-semibold">
                    {trip.local_driver ? `${trip.local_driver.first_name} ${trip.local_driver.last_name}` : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Route Driver:</span>
                  <span className="font-semibold">
                    {trip.route_driver ? `${trip.route_driver.first_name} ${trip.route_driver.last_name}` : "N/A"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trip Routes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trip.inbound_trips && trip.inbound_trips.length > 0 && (
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-lg">
                    <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                    Inbound Trip
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {trip.inbound_trips.map((inbound) => (
                    <div key={inbound.id} className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-blue-800">
                          {inbound.source} → {inbound.destination}
                        </span>
                        <Badge variant="outline" className="text-blue-600 border-blue-300">
                          ₹{inbound.total_fare?.toLocaleString() || "N/A"}
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-blue-600">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(inbound.date).toLocaleDateString()}
                        <Package className="h-3 w-3 ml-3 mr-1" />
                        {inbound.total_weight || "N/A"} kg
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {trip.outbound_trips && trip.outbound_trips.length > 0 && (
              <Card className="border-l-4 border-l-orange-500">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-lg">
                    <MapPin className="h-5 w-5 mr-2 text-orange-600" />
                    Outbound Trip
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {trip.outbound_trips.map((outbound) => (
                    <div key={outbound.id} className="bg-orange-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-orange-800">
                          {outbound.source} → {outbound.destination}
                        </span>
                        <Badge variant="outline" className="text-orange-600 border-orange-300">
                          ₹{outbound.total_fare?.toLocaleString() || "N/A"}
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-orange-600">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(outbound.date).toLocaleDateString()}
                        <Package className="h-3 w-3 ml-3 mr-1" />
                        {outbound.total_weight || "N/A"} kg
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* No trips message */}
          {(!trip.inbound_trips || trip.inbound_trips.length === 0) && 
           (!trip.outbound_trips || trip.outbound_trips.length === 0) && (
            <Card>
              <CardContent className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No trip routes have been added yet.</p>
                <p className="text-sm text-gray-400 mt-1">Use the Edit button to add inbound and outbound trip details.</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
