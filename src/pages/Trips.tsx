
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, MapPin, Clock, DollarSign } from "lucide-react";

interface Trip {
  id: string;
  driver: string;
  vehicle: string;
  origin: string;
  destination: string;
  distance: number;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  startTime: string;
  endTime?: string;
  revenue: number;
}

const sampleTrips: Trip[] = [
  {
    id: "1",
    driver: "John Smith",
    vehicle: "TRK-001",
    origin: "New York, NY",
    destination: "Boston, MA",
    distance: 215,
    status: "in-progress",
    startTime: "2024-06-04T08:00:00",
    revenue: 1200
  },
  {
    id: "2",
    driver: "Sarah Johnson",
    vehicle: "TRK-002",
    origin: "Chicago, IL",
    destination: "Detroit, MI",
    distance: 283,
    status: "completed",
    startTime: "2024-06-03T09:30:00",
    endTime: "2024-06-03T14:45:00",
    revenue: 1500
  },
  {
    id: "3",
    driver: "Mike Davis",
    vehicle: "TRK-003",
    origin: "Los Angeles, CA",
    destination: "San Francisco, CA",
    distance: 382,
    status: "scheduled",
    startTime: "2024-06-05T06:00:00",
    revenue: 1800
  }
];

const Trips = () => {
  const [trips, setTrips] = useState<Trip[]>(sampleTrips);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTrips = trips.filter(trip =>
    trip.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
    return new Date(dateString).toLocaleString();
  };

  const calculateDuration = (startTime: string, endTime?: string) => {
    if (!endTime) return "In progress";
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffHours = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60) * 10) / 10;
    return `${diffHours} hours`;
  };

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

      {/* Search */}
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

      {/* Trips List */}
      <div className="space-y-4">
        {filteredTrips.map((trip) => (
          <Card key={trip.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold">Trip #{trip.id}</h3>
                    <Badge className={getStatusColor(trip.status)}>
                      {trip.status.replace("-", " ")}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    Driver: <span className="font-medium">{trip.driver}</span> • 
                    Vehicle: <span className="font-medium">{trip.vehicle}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-green-600 font-semibold">
                    <DollarSign className="h-4 w-4" />
                    <span>${trip.revenue}</span>
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
                    <div className="text-xs text-gray-500">{trip.distance} miles</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-sm">Schedule</div>
                    <div className="text-sm text-gray-600">
                      Started: {formatDateTime(trip.startTime)}
                    </div>
                    {trip.endTime && (
                      <div className="text-sm text-gray-600">
                        Ended: {formatDateTime(trip.endTime)}
                      </div>
                    )}
                    <div className="text-xs text-gray-500">
                      Duration: {calculateDuration(trip.startTime, trip.endTime)}
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
    </div>
  );
};

export default Trips;
