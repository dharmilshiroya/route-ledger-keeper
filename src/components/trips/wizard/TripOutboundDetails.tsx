
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MapPin, Package, Plus, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TripData } from "../CreateTripWizard";

interface GoodsType {
  id: string;
  name: string;
}

interface TripOutboundDetailsProps {
  data: Partial<TripData>;
  onComplete: (data: Partial<TripData>) => void;
  onPrevious: () => void;
}

export function TripOutboundDetails({ data, onComplete, onPrevious }: TripOutboundDetailsProps) {
  const [formData, setFormData] = useState({
    outboundDate: data.outboundDate || new Date().toISOString().split('T')[0],
    outboundSource: data.outboundSource || data.inboundDestination || "",
    outboundDestination: data.outboundDestination || data.inboundSource || "",
    outboundItems: data.outboundItems || []
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
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      setGoodsTypes(data || []);
    } catch (error) {
      console.error('Error fetching goods types:', error);
    }
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...formData.outboundItems];
    const item = { ...newItems[index], [field]: value };
    
    // Auto-calculate total price
    if (field === 'totalQuantity' || field === 'farePerPiece') {
      item.totalPrice = item.totalQuantity * item.farePerPiece;
    }
    
    newItems[index] = item;
    setFormData(prev => ({ ...prev, outboundItems: newItems }));
  };

  const addNewRow = () => {
    const newItem = {
      id: `temp-${formData.outboundItems.length + 1}`,
      srNo: formData.outboundItems.length + 1,
      customerName: "",
      receiverName: "",
      goodsTypeId: "",
      totalWeight: 0,
      totalQuantity: 0,
      farePerPiece: 0,
      totalPrice: 0
    };
    
    setFormData(prev => ({
      ...prev,
      outboundItems: [...prev.outboundItems, newItem]
    }));
  };

  // Initialize with empty rows if no items exist
  useEffect(() => {
    if (formData.outboundItems.length === 0) {
      const initialItems = Array.from({ length: 15 }, (_, i) => ({
        id: `temp-${i + 1}`,
        srNo: i + 1,
        customerName: "",
        receiverName: "",
        goodsTypeId: "",
        totalWeight: 0,
        totalQuantity: 0,
        farePerPiece: 0,
        totalPrice: 0
      }));
      setFormData(prev => ({ ...prev, outboundItems: initialItems }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Create outbound trip
      const { data: outboundTrip, error: tripError } = await supabase
        .from('outbound_trips')
        .insert({
          trip_id: data.tripNumber, // This will be the actual trip ID from step 1
          date: formData.outboundDate,
          source: formData.outboundSource,
          destination: formData.outboundDestination
        })
        .select()
        .single();

      if (tripError) throw tripError;

      // Save valid items
      const validItems = formData.outboundItems.filter(item => 
        item.customerName.trim() !== "" || item.receiverName.trim() !== ""
      );

      if (validItems.length > 0) {
        const itemsToInsert = validItems.map(item => ({
          outbound_trip_id: outboundTrip.id,
          sr_no: item.srNo,
          customer_name: item.customerName,
          receiver_name: item.receiverName,
          goods_type_id: item.goodsTypeId || null,
          total_weight: item.totalWeight,
          total_quantity: item.totalQuantity,
          fare_per_piece: item.farePerPiece,
          total_price: item.totalPrice
        }));

        const { error: itemsError } = await supabase
          .from('outbound_trip_items')
          .insert(itemsToInsert);

        if (itemsError) throw itemsError;
      }

      toast.success('Trip created successfully! 🎉');
      onComplete(formData);
    } catch (error) {
      console.error('Error creating outbound trip:', error);
      toast.error('Failed to create trip');
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = formData.outboundItems.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Route Information */}
      <Card className="border-l-4 border-l-orange-500">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-orange-600" />
            Outbound Trip Route
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="outbound-date">Date</Label>
              <Input
                id="outbound-date"
                type="date"
                value={formData.outboundDate}
                onChange={(e) => setFormData(prev => ({ ...prev, outboundDate: e.target.value }))}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="outbound-source">Source</Label>
              <Input
                id="outbound-source"
                value={formData.outboundSource}
                onChange={(e) => setFormData(prev => ({ ...prev, outboundSource: e.target.value }))}
                placeholder="Origin location"
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="outbound-destination">Destination</Label>
              <Input
                id="outbound-destination"
                value={formData.outboundDestination}
                onChange={(e) => setFormData(prev => ({ ...prev, outboundDestination: e.target.value }))}
                placeholder="Destination location"
                required
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Details */}
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Package className="h-5 w-5 mr-2 text-purple-600" />
              Customer & Goods Details
            </div>
            <div className="text-lg font-bold text-purple-600">
              Total: ₹{totalRevenue.toLocaleString()}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left p-2 font-semibold">Sr.</th>
                  <th className="text-left p-2 font-semibold">Customer</th>
                  <th className="text-left p-2 font-semibold">Receiver</th>
                  <th className="text-left p-2 font-semibold">Goods</th>
                  <th className="text-left p-2 font-semibold">Weight (kg)</th>
                  <th className="text-left p-2 font-semibold">Quantity</th>
                  <th className="text-left p-2 font-semibold">Rate</th>
                  <th className="text-left p-2 font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody>
                {formData.outboundItems.map((item, index) => (
                  <tr key={item.id} className={`border-b hover:bg-gray-50 ${index < 15 ? 'bg-purple-50' : ''}`}>
                    <td className="p-2 font-medium">{item.srNo}</td>
                    <td className="p-2">
                      <Input
                        value={item.customerName}
                        onChange={(e) => handleItemChange(index, 'customerName', e.target.value)}
                        placeholder="Customer name"
                        className={`${index < 15 ? 'border-purple-300' : ''}`}
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        value={item.receiverName}
                        onChange={(e) => handleItemChange(index, 'receiverName', e.target.value)}
                        placeholder="Receiver name"
                        className={`${index < 15 ? 'border-purple-300' : ''}`}
                      />
                    </td>
                    <td className="p-2">
                      <Select 
                        value={item.goodsTypeId} 
                        onValueChange={(value) => handleItemChange(index, 'goodsTypeId', value)}
                      >
                        <SelectTrigger className={`${index < 15 ? 'border-purple-300' : ''}`}>
                          <SelectValue placeholder="Select goods" />
                        </SelectTrigger>
                        <SelectContent>
                          {goodsTypes.map((goods) => (
                            <SelectItem key={goods.id} value={goods.id}>
                              {goods.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        value={item.totalWeight}
                        onChange={(e) => handleItemChange(index, 'totalWeight', parseFloat(e.target.value) || 0)}
                        className={`${index < 15 ? 'border-purple-300' : ''}`}
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        value={item.totalQuantity}
                        onChange={(e) => handleItemChange(index, 'totalQuantity', parseInt(e.target.value) || 0)}
                        className={`${index < 15 ? 'border-purple-300' : ''}`}
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        value={item.farePerPiece}
                        onChange={(e) => handleItemChange(index, 'farePerPiece', parseFloat(e.target.value) || 0)}
                        className={`${index < 15 ? 'border-purple-300' : ''}`}
                      />
                    </td>
                    <td className="p-2 font-semibold">₹{item.totalPrice.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-center mt-4">
            <Button type="button" onClick={addNewRow} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Row
            </Button>
          </div>
          
          <div className="mt-4 p-3 bg-purple-100 border border-purple-300 rounded-lg">
            <p className="text-sm text-purple-800">
              <strong>Note:</strong> Outbound trip details are optional. Add customer details as needed for return journey.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-6 border-t">
        <Button type="button" variant="outline" onClick={onPrevious}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
          <CheckCircle className="h-4 w-4 mr-2" />
          {loading ? "Creating Trip..." : "Complete Trip Creation"}
        </Button>
      </div>
    </form>
  );
}
