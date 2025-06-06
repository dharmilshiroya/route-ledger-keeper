
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface VehicleFormData {
  license_plate: string;
  vehicle_owner: string;
  fuel_type: string;
  financed: boolean;
  national_permit_expiry: string;
  pucc_expiry: string;
  permit_expiry: string;
  insurance_expiry: string;
  emi_date?: string;
  emi_amount?: number;
  status: string;
  mileage: number;
  last_service: string;
}

interface VehicleFormProps {
  vehicle?: VehicleFormData | null;
  onSubmit: (vehicle: VehicleFormData) => void;
  onCancel: () => void;
}

export function VehicleForm({ vehicle, onSubmit, onCancel }: VehicleFormProps) {
  const [formData, setFormData] = useState<VehicleFormData>({
    license_plate: vehicle?.license_plate || "",
    vehicle_owner: vehicle?.vehicle_owner || "",
    fuel_type: vehicle?.fuel_type || "Diesel",
    financed: vehicle?.financed || false,
    national_permit_expiry: vehicle?.national_permit_expiry || "",
    pucc_expiry: vehicle?.pucc_expiry || "",
    permit_expiry: vehicle?.permit_expiry || "",
    insurance_expiry: vehicle?.insurance_expiry || "",
    emi_date: vehicle?.emi_date || "",
    emi_amount: vehicle?.emi_amount || 0,
    status: vehicle?.status || "active",
    mileage: vehicle?.mileage || 0,
    last_service: vehicle?.last_service || ""
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
                <Label htmlFor="license_plate">Vehicle Number</Label>
                <Input
                  id="license_plate"
                  value={formData.license_plate}
                  onChange={(e) => setFormData({ ...formData, license_plate: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicle_owner">Vehicle Owner</Label>
                <Input
                  id="vehicle_owner"
                  value={formData.vehicle_owner}
                  onChange={(e) => setFormData({ ...formData, vehicle_owner: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fuel_type">Fuel Type</Label>
                <Select
                  value={formData.fuel_type}
                  onValueChange={(value: string) => 
                    setFormData({ ...formData, fuel_type: value })
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emi_date">EMI Date (Day of Month)</Label>
                  <Input
                    id="emi_date"
                    type="number"
                    min="1"
                    max="31"
                    value={formData.emi_date}
                    onChange={(e) => setFormData({ ...formData, emi_date: e.target.value })}
                    placeholder="e.g., 15 for 15th of every month"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emi_amount">EMI Amount</Label>
                  <Input
                    id="emi_amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.emi_amount || ""}
                    onChange={(e) => setFormData({ ...formData, emi_amount: parseFloat(e.target.value) || 0 })}
                    placeholder="Monthly EMI amount"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="national_permit_expiry">National Permit Expiry</Label>
                <Input
                  id="national_permit_expiry"
                  type="date"
                  value={formData.national_permit_expiry}
                  onChange={(e) => setFormData({ ...formData, national_permit_expiry: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pucc_expiry">PUCC Expiry</Label>
                <Input
                  id="pucc_expiry"
                  type="date"
                  value={formData.pucc_expiry}
                  onChange={(e) => setFormData({ ...formData, pucc_expiry: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="permit_expiry">Permit Expiry</Label>
                <Input
                  id="permit_expiry"
                  type="date"
                  value={formData.permit_expiry}
                  onChange={(e) => setFormData({ ...formData, permit_expiry: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="insurance_expiry">Insurance Expiry</Label>
                <Input
                  id="insurance_expiry"
                  type="date"
                  value={formData.insurance_expiry}
                  onChange={(e) => setFormData({ ...formData, insurance_expiry: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: string) => 
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
                  step="0.1"
                  value={formData.mileage || ""}
                  onChange={(e) => setFormData({ ...formData, mileage: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_service">Last Service</Label>
              <Input
                id="last_service"
                type="date"
                value={formData.last_service}
                onChange={(e) => setFormData({ ...formData, last_service: e.target.value })}
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
