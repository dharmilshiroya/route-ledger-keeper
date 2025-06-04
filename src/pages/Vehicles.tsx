
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { VehicleForm } from "@/components/VehicleForm";

interface Vehicle {
  id: string;
  licensePlate: string;
  vehicleOwner: string;
  fuelType: "CNG" | "Diesel" | "Bio Diesel" | "Other";
  financed: boolean;
  nationalPermitExpiry: string;
  puccExpiry: string;
  permitExpiry: string;
  insuranceExpiry: string;
  emiDate?: string;
  status: "active" | "maintenance" | "inactive";
  mileage: number;
  lastService: string;
}

const sampleVehicles: Vehicle[] = [
  {
    id: "1",
    licensePlate: "TRK-001",
    vehicleOwner: "John Doe",
    fuelType: "Diesel",
    financed: true,
    nationalPermitExpiry: "2025-12-31",
    puccExpiry: "2024-12-15",
    permitExpiry: "2025-06-30",
    insuranceExpiry: "2025-03-15",
    emiDate: "15",
    status: "active",
    mileage: 45000,
    lastService: "2024-05-15"
  },
  {
    id: "2",
    licensePlate: "TRK-002",
    vehicleOwner: "Jane Smith",
    fuelType: "CNG",
    financed: false,
    nationalPermitExpiry: "2025-08-20",
    puccExpiry: "2024-11-10",
    permitExpiry: "2025-04-25",
    insuranceExpiry: "2025-01-30",
    status: "maintenance",
    mileage: 67000,
    lastService: "2024-05-20"
  },
  {
    id: "3",
    licensePlate: "TRK-003",
    vehicleOwner: "Mike Johnson",
    fuelType: "Bio Diesel",
    financed: true,
    nationalPermitExpiry: "2026-02-14",
    puccExpiry: "2025-01-05",
    permitExpiry: "2025-09-18",
    insuranceExpiry: "2025-07-22",
    emiDate: "5",
    status: "active",
    mileage: 23000,
    lastService: "2024-06-01"
  }
];

const Vehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(sampleVehicles);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.vehicleOwner.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.fuelType.toLowerCase().includes(searchTerm.toLowerCase())
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
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
  };

  const isExpired = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    return expiry < today;
  };

  const getExpiryStatus = (expiryDate: string) => {
    if (isExpired(expiryDate)) return "text-red-600 font-semibold";
    if (isExpiryNear(expiryDate)) return "text-orange-600 font-semibold";
    return "text-gray-600";
  };

  const handleAddVehicle = (vehicleData: Omit<Vehicle, "id">) => {
    const newVehicle = {
      ...vehicleData,
      id: (vehicles.length + 1).toString()
    };
    setVehicles([...vehicles, newVehicle]);
    setShowForm(false);
  };

  const handleEditVehicle = (vehicleData: Omit<Vehicle, "id">) => {
    if (editingVehicle) {
      setVehicles(vehicles.map(v => 
        v.id === editingVehicle.id ? { ...vehicleData, id: editingVehicle.id } : v
      ));
      setEditingVehicle(null);
      setShowForm(false);
    }
  };

  const handleDeleteVehicle = (id: string) => {
    setVehicles(vehicles.filter(v => v.id !== id));
  };

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

      {/* Search */}
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

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => (
          <Card key={vehicle.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{vehicle.licensePlate}</CardTitle>
                  <p className="text-sm text-gray-500">Owner: {vehicle.vehicleOwner}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <Badge className={getStatusColor(vehicle.status)}>
                    {vehicle.status}
                  </Badge>
                  <Badge className={getFuelTypeColor(vehicle.fuelType)}>
                    {vehicle.fuelType}
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
                {vehicle.financed && vehicle.emiDate && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">EMI Date:</span>
                    <span>{vehicle.emiDate} of every month</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">National Permit:</span>
                  <span className={getExpiryStatus(vehicle.nationalPermitExpiry)}>
                    {vehicle.nationalPermitExpiry}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">PUCC:</span>
                  <span className={getExpiryStatus(vehicle.puccExpiry)}>
                    {vehicle.puccExpiry}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Permit:</span>
                  <span className={getExpiryStatus(vehicle.permitExpiry)}>
                    {vehicle.permitExpiry}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Insurance:</span>
                  <span className={getExpiryStatus(vehicle.insuranceExpiry)}>
                    {vehicle.insuranceExpiry}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Mileage:</span>
                  <span>{vehicle.mileage.toLocaleString()} miles</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Last Service:</span>
                  <span>{vehicle.lastService}</span>
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

      {/* Vehicle Form Modal */}
      {showForm && (
        <VehicleForm
          vehicle={editingVehicle}
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
