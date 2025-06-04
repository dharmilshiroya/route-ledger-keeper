
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { VehicleForm } from "@/components/VehicleForm";

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  status: "active" | "maintenance" | "inactive";
  mileage: number;
  lastService: string;
}

const sampleVehicles: Vehicle[] = [
  {
    id: "1",
    make: "Ford",
    model: "Transit",
    year: 2022,
    licensePlate: "TRK-001",
    status: "active",
    mileage: 45000,
    lastService: "2024-05-15"
  },
  {
    id: "2",
    make: "Mercedes",
    model: "Sprinter",
    year: 2021,
    licensePlate: "TRK-002",
    status: "maintenance",
    mileage: 67000,
    lastService: "2024-05-20"
  },
  {
    id: "3",
    make: "Volvo",
    model: "FH16",
    year: 2023,
    licensePlate: "TRK-003",
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
    vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase())
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
                  <CardTitle className="text-lg">{vehicle.make} {vehicle.model}</CardTitle>
                  <p className="text-sm text-gray-500">{vehicle.year} • {vehicle.licensePlate}</p>
                </div>
                <Badge className={getStatusColor(vehicle.status)}>
                  {vehicle.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
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
