import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Plus, MapPin, Truck, Users } from "lucide-react";
import { InboundTripForm } from "./InboundTripForm";
import { OutboundTripForm } from "./OutboundTripForm";
import { TripItemsList } from "./TripItemsList";

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

interface TripDetailsProps {
  trip: Trip;
  onClose: () => void;
  onTripUpdated: () => void;
}

export function TripDetails({ trip, onClose, onTripUpdated }: TripDetailsProps) {
  const [showInboundForm, setShowInboundForm] = useState(false);
  const [showOutboundForm, setShowOutboundForm] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

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

  const calculateTripTotals = () => {
    const inboundTotal = trip.inbound_trips?.reduce((sum, ib) => sum + (ib.total_fare || 0), 0) || 0;
    const outboundTotal = trip.outbound_trips?.reduce((sum, ob) => sum + (ob.total_fare || 0), 0) || 0;
    return { inboundTotal, outboundTotal, total: inboundTotal + outboundTotal };
  };

  const totals = calculateTripTotals();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-3">
              <Truck className="h-6 w-6 text-blue-600" />
              <span>Trip #{trip.trip_number}</span>
              <Badge className={getStatusColor(trip.status)}>
                {trip.status}
              </Badge>
            </CardTitle>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Truck className="h-4 w-4" />
                <span>Vehicle: {trip.vehicles?.license_plate || "Not assigned"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Local: {trip.local_driver ? `${trip.local_driver.first_name} ${trip.local_driver.last_name}` : "Not assigned"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Route: {trip.route_driver ? `${trip.route_driver.first_name} ${trip.route_driver.last_name}` : "Not assigned"}</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="inbound">Inbound Trips</TabsTrigger>
              <TabsTrigger value="outbound">Outbound Trips</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-blue-600">{trip.inbound_trips?.length || 0}</div>
                    <div className="text-sm text-gray-600">Inbound Trips</div>
                    <div className="text-lg font-semibold text-green-600 mt-2">₹{totals.inboundTotal.toLocaleString()}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-orange-600">{trip.outbound_trips?.length || 0}</div>
                    <div className="text-sm text-gray-600">Outbound Trips</div>
                    <div className="text-lg font-semibold text-green-600 mt-2">₹{totals.outboundTotal.toLocaleString()}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-green-600">₹{totals.total.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Total Revenue</div>
                    <div className="text-xs text-gray-500 mt-2">All trips combined</div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Recent Trip Activities</h3>
                <div className="space-y-2">
                  {trip.inbound_trips?.slice(0, 3).map((inbound) => (
                    <div key={inbound.id} className="flex items-center justify-between p-3 bg-blue-50 rounded">
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">{inbound.source} → {inbound.destination}</span>
                        <Badge variant="outline" className="text-xs">Inbound</Badge>
                      </div>
                      <div className="text-sm font-medium">₹{inbound.total_fare}</div>
                    </div>
                  ))}
                  {trip.outbound_trips?.slice(0, 3).map((outbound) => (
                    <div key={outbound.id} className="flex items-center justify-between p-3 bg-orange-50 rounded">
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-4 w-4 text-orange-600" />
                        <span className="text-sm">{outbound.source} → {outbound.destination}</span>
                        <Badge variant="outline" className="text-xs">Outbound</Badge>
                      </div>
                      <div className="text-sm font-medium">₹{outbound.total_fare}</div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="inbound" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Inbound Trips</h3>
                <Button onClick={() => setShowInboundForm(true)} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Inbound Trip
                </Button>
              </div>
              <TripItemsList 
                subTripId={trip.inbound_trips?.[0]?.id || ''} 
                type="inbound" 
                items={[]}
                onRefresh={onTripUpdated}
              />
            </TabsContent>

            <TabsContent value="outbound" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Outbound Trips</h3>
                <Button onClick={() => setShowOutboundForm(true)} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Outbound Trip
                </Button>
              </div>
              <TripItemsList 
                subTripId={trip.outbound_trips?.[0]?.id || ''} 
                type="outbound" 
                items={[]}
                onRefresh={onTripUpdated}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {showInboundForm && (
        <InboundTripForm
          tripId={trip.id}
          onSubmit={() => {
            setShowInboundForm(false);
            onTripUpdated();
          }}
          onCancel={() => setShowInboundForm(false)}
        />
      )}

      {showOutboundForm && (
        <OutboundTripForm
          tripId={trip.id}
          onSubmit={() => {
            setShowOutboundForm(false);
            onTripUpdated();
          }}
          onCancel={() => setShowOutboundForm(false)}
        />
      )}
    </div>
  );
}
