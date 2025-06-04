
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Vehicle {
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

interface VehicleFormProps {
  vehicle?: Vehicle | null;
  onSubmit: (vehicle: Vehicle) => void;
  onCancel: () => void;
}

export function VehicleForm({ vehicle, onSubmit, onCancel }: VehicleFormProps) {
  const [formData, setFormData] = useState<Vehicle>({
    licensePlate: vehicle?.licensePlate || "",
    vehicleOwner: vehicle?.vehicleOwner || "",
    fuelType: vehicle?.fuelType || "Diesel",
    financed: vehicle?.financed || false,
    nationalPermitExpiry: vehicle?.nationalPermitExpiry || "",
    puccExpiry: vehicle?.puccExpiry || "",
    permitExpiry: vehicle?.permitExpiry || "",
    insuranceExpiry: vehicle?.insuranceExpiry || "",
    emiDate: vehicle?.emiDate || "",
    status: vehicle?.status || "active",
    mileage: vehicle?.mileage || 0,
    lastService: vehicle?.lastService || ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>{vehicle ? "Edit Vehicle" : "Add New Vehicle"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="licensePlate">Vehicle Number</Label>
                <Input
                  id="licensePlate"
                  value={formData.licensePlate}
                  onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicleOwner">Vehicle Owner</Label>
                <Input
                  id="vehicleOwner"
                  value={formData.vehicleOwner}
                  onChange={(e) => setFormData({ ...formData, vehicleOwner: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fuelType">Fuel Type</Label>
                <Select
                  value={formData.fuelType}
                  onValueChange={(value: "CNG" | "Diesel" | "Bio Diesel" | "Other") => 
                    setFormData({ ...formData, fuelType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CNG">CNG</SelectItem>
                    <SelectItem value="Diesel">Diesel</SelectItem>
                    <SelectItem value="Bio Diesel">Bio Diesel</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Financed</Label>
                <RadioGroup
                  value={formData.financed ? "yes" : "no"}
                  onValueChange={(value) => setFormData({ ...formData, financed: value === "yes" })}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="financed-yes" />
                    <Label htmlFor="financed-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="financed-no" />
                    <Label htmlFor="financed-no">No</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {formData.financed && (
              <div className="space-y-2">
                <Label htmlFor="emiDate">EMI Date (Day of Month)</Label>
                <Input
                  id="emiDate"
                  type="number"
                  min="1"
                  max="31"
                  value={formData.emiDate}
                  onChange={(e) => setFormData({ ...formData, emiDate: e.target.value })}
                  placeholder="e.g., 15 for 15th of every month"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nationalPermitExpiry">National Permit Expiry</Label>
                <Input
                  id="nationalPermitExpiry"
                  type="date"
                  value={formData.nationalPermitExpiry}
                  onChange={(e) => setFormData({ ...formData, nationalPermitExpiry: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="puccExpiry">PUCC Expiry</Label>
                <Input
                  id="puccExpiry"
                  type="date"
                  value={formData.puccExpiry}
                  onChange={(e) => setFormData({ ...formData, puccExpiry: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="permitExpiry">Permit Expiry</Label>
                <Input
                  id="permitExpiry"
                  type="date"
                  value={formData.permitExpiry}
                  onChange={(e) => setFormData({ ...formData, permitExpiry: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="insuranceExpiry">Insurance Expiry</Label>
                <Input
                  id="insuranceExpiry"
                  type="date"
                  value={formData.insuranceExpiry}
                  onChange={(e) => setFormData({ ...formData, insuranceExpiry: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "active" | "maintenance" | "inactive") => 
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mileage">Mileage</Label>
                <Input
                  id="mileage"
                  type="number"
                  value={formData.mileage}
                  onChange={(e) => setFormData({ ...formData, mileage: parseInt(e.target.value) })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastService">Last Service</Label>
              <Input
                id="lastService"
                type="date"
                value={formData.lastService}
                onChange={(e) => setFormData({ ...formData, lastService: e.target.value })}
                required
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <Button type="submit" className="flex-1">
                {vehicle ? "Update" : "Add"} Vehicle
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
