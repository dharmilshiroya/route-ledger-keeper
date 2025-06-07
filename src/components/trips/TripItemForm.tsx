
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface GoodsType {
  id: string;
  name: string;
}

interface TripItemFormProps {
  subTripId: string;
  type: "inbound" | "outbound";
  nextSrNo: number;
  onSubmit: () => void;
  onCancel: () => void;
}

export function TripItemForm({ subTripId, type, nextSrNo, onSubmit, onCancel }: TripItemFormProps) {
  const [formData, setFormData] = useState({
    sr_no: nextSrNo,
    customer_name: "",
    receiver_name: "",
    total_weight: 0,
    total_quantity: 0,
    goods_type_id: "",
    fare_per_piece: 0,
  });
  const [goodsTypes, setGoodsTypes] = useState<GoodsType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGoodsTypes();
  }, []);

  const fetchGoodsTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('goods_types')
        .select('*')
        .order('name');

      if (error) throw error;
      setGoodsTypes(data || []);
    } catch (error) {
      console.error('Error fetching goods types:', error);
      toast.error('Failed to load goods types');
    }
  };

  const calculateTotalPrice = () => {
    return formData.total_quantity * formData.fare_per_piece;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const totalPrice = calculateTotalPrice();
      
      if (type === "inbound") {
        const { error: itemError } = await supabase
          .from("inbound_trip_items")
          .insert({
            inbound_trip_id: subTripId,
            sr_no: formData.sr_no,
            customer_name: formData.customer_name,
            receiver_name: formData.receiver_name,
            total_weight: formData.total_weight,
            total_quantity: formData.total_quantity,
            goods_type_id: formData.goods_type_id || null,
            fare_per_piece: formData.fare_per_piece,
            total_price: totalPrice,
          });

        if (itemError) throw itemError;

        // Update the parent trip totals
        const { data: currentTrip, error: fetchError } = await supabase
          .from("inbound_trips")
          .select('total_weight, total_fare')
          .eq('id', subTripId)
          .single();

        if (fetchError) throw fetchError;

        const { error: updateError } = await supabase
          .from("inbound_trips")
          .update({
            total_weight: (currentTrip.total_weight || 0) + formData.total_weight,
            total_fare: (currentTrip.total_fare || 0) + totalPrice,
          })
          .eq('id', subTripId);

        if (updateError) throw updateError;
      } else {
        const { error: itemError } = await supabase
          .from("outbound_trip_items")
          .insert({
            outbound_trip_id: subTripId,
            sr_no: formData.sr_no,
            customer_name: formData.customer_name,
            receiver_name: formData.receiver_name,
            total_weight: formData.total_weight,
            total_quantity: formData.total_quantity,
            goods_type_id: formData.goods_type_id || null,
            fare_per_piece: formData.fare_per_piece,
            total_price: totalPrice,
          });

        if (itemError) throw itemError;

        // Update the parent trip totals
        const { data: currentTrip, error: fetchError } = await supabase
          .from("outbound_trips")
          .select('total_weight, total_fare')
          .eq('id', subTripId)
          .single();

        if (fetchError) throw fetchError;

        const { error: updateError } = await supabase
          .from("outbound_trips")
          .update({
            total_weight: (currentTrip.total_weight || 0) + formData.total_weight,
            total_fare: (currentTrip.total_fare || 0) + totalPrice,
          })
          .eq('id', subTripId);

        if (updateError) throw updateError;
      }

      toast.success('Trip item added successfully');
      onSubmit();
    } catch (error) {
      console.error('Error creating trip item:', error);
      toast.error('Failed to create trip item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[70]">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>Add {type === "inbound" ? "Inbound" : "Outbound"} Trip Item</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sr_no">Serial Number</Label>
                <Input
                  id="sr_no"
                  type="number"
                  value={formData.sr_no}
                  onChange={(e) => setFormData({ ...formData, sr_no: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="goods_type">Goods Type</Label>
                <Select value={formData.goods_type_id} onValueChange={(value) => setFormData({ ...formData, goods_type_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select goods type" />
                  </SelectTrigger>
                  <SelectContent>
                    {goodsTypes.map((goods) => (
                      <SelectItem key={goods.id} value={goods.id}>
                        {goods.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customer_name">Customer Name</Label>
                <Input
                  id="customer_name"
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="receiver_name">Receiver Name</Label>
                <Input
                  id="receiver_name"
                  value={formData.receiver_name}
                  onChange={(e) => setFormData({ ...formData, receiver_name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="total_weight">Total Weight (kg)</Label>
                <Input
                  id="total_weight"
                  type="number"
                  step="0.01"
                  value={formData.total_weight || ""}
                  onChange={(e) => setFormData({ ...formData, total_weight: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="total_quantity">Quantity</Label>
                <Input
                  id="total_quantity"
                  type="number"
                  value={formData.total_quantity || ""}
                  onChange={(e) => setFormData({ ...formData, total_quantity: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fare_per_piece">Rate per Piece (₹)</Label>
                <Input
                  id="fare_per_piece"
                  type="number"
                  step="0.01"
                  value={formData.fare_per_piece || ""}
                  onChange={(e) => setFormData({ ...formData, fare_per_piece: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded">
              <div className="text-lg font-semibold">
                Total Amount: ₹{calculateTotalPrice().toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">
                {formData.total_quantity} pieces × ₹{formData.fare_per_piece}
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Adding..." : "Add Item"}
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
