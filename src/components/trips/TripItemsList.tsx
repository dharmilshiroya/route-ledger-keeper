
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TripItemForm } from "./TripItemForm";
import { TripItemDetails } from "./TripItemDetails";

interface TripItem {
  id: string;
  sr_no: number;
  customer_name: string;
  receiver_name: string;
  total_weight: number;
  total_quantity: number;
  fare_per_piece: number;
  total_price: number;
  goods_types?: { name: string } | null;
}

interface SubTrip {
  id: string;
  date: string;
  source: string;
  destination: string;
  total_weight: number | null;
  total_fare: number | null;
}

interface TripItemsListProps {
  tripId: string;
  type: "inbound" | "outbound";
}

export function TripItemsList({ tripId, type }: TripItemsListProps) {
  const [subTrips, setSubTrips] = useState<SubTrip[]>([]);
  const [selectedSubTrip, setSelectedSubTrip] = useState<string | null>(null);
  const [tripItems, setTripItems] = useState<TripItem[]>([]);
  const [showItemForm, setShowItemForm] = useState(false);
  const [showItemDetails, setShowItemDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TripItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubTrips();
  }, [tripId, type]);

  useEffect(() => {
    if (selectedSubTrip) {
      fetchTripItems();
    }
  }, [selectedSubTrip]);

  const fetchSubTrips = async () => {
    try {
      setLoading(true);
      const tableName = type === "inbound" ? "inbound_trips" : "outbound_trips";
      
      const { data, error } = await supabase
        .from(tableName)
        .select('id, date, source, destination, total_weight, total_fare')
        .eq('trip_id', tripId)
        .order('date', { ascending: false });

      if (error) throw error;
      
      const mappedData: SubTrip[] = (data || []).map(item => ({
        id: item.id,
        date: item.date,
        source: item.source,
        destination: item.destination,
        total_weight: item.total_weight,
        total_fare: item.total_fare
      }));
      
      setSubTrips(mappedData);
      if (mappedData.length > 0) {
        setSelectedSubTrip(mappedData[0].id);
      }
    } catch (error) {
      console.error(`Error fetching ${type} trips:`, error);
      toast.error(`Failed to load ${type} trips`);
    } finally {
      setLoading(false);
    }
  };

  const fetchTripItems = async () => {
    if (!selectedSubTrip) return;

    try {
      const tableName = type === "inbound" ? "inbound_trip_items" : "outbound_trip_items";
      const foreignKey = type === "inbound" ? "inbound_trip_id" : "outbound_trip_id";
      
      // First get the items
      const { data: itemsData, error: itemsError } = await supabase
        .from(tableName)
        .select('id, sr_no, customer_name, receiver_name, total_weight, total_quantity, fare_per_piece, total_price, goods_type_id')
        .eq(foreignKey, selectedSubTrip)
        .order('sr_no', { ascending: true });

      if (itemsError) throw itemsError;

      // Then get goods types separately to avoid complex type inference
      const goodsTypeIds = itemsData?.map(item => item.goods_type_id).filter(Boolean) || [];
      let goodsTypesMap: Record<string, string> = {};
      
      if (goodsTypeIds.length > 0) {
        const { data: goodsData, error: goodsError } = await supabase
          .from('goods_types')
          .select('id, name')
          .in('id', goodsTypeIds);
          
        if (!goodsError && goodsData) {
          goodsTypesMap = goodsData.reduce((acc, goods) => {
            acc[goods.id] = goods.name;
            return acc;
          }, {} as Record<string, string>);
        }
      }

      // Map the data with explicit typing
      const mappedItems: TripItem[] = (itemsData || []).map(item => ({
        id: item.id,
        sr_no: item.sr_no,
        customer_name: item.customer_name,
        receiver_name: item.receiver_name,
        total_weight: item.total_weight,
        total_quantity: item.total_quantity,
        fare_per_piece: item.fare_per_piece,
        total_price: item.total_price,
        goods_types: item.goods_type_id ? { name: goodsTypesMap[item.goods_type_id] || "Unknown" } : null
      }));

      setTripItems(mappedItems);
    } catch (error) {
      console.error(`Error fetching ${type} trip items:`, error);
      toast.error(`Failed to load ${type} trip items`);
    }
  };

  const handleItemCreated = () => {
    setShowItemForm(false);
    fetchTripItems();
    fetchSubTrips(); // Refresh to update totals
  };

  const currentSubTrip = subTrips.find(trip => trip.id === selectedSubTrip);

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (subTrips.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">No {type} trips found. Add one to get started.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Sub-trip selector */}
      <div className="flex flex-wrap gap-2">
        {subTrips.map((subTrip) => (
          <Button
            key={subTrip.id}
            variant={selectedSubTrip === subTrip.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedSubTrip(subTrip.id)}
          >
            {subTrip.source} → {subTrip.destination}
            <span className="ml-2 text-xs">
              ({new Date(subTrip.date).toLocaleDateString()})
            </span>
          </Button>
        ))}
      </div>

      {currentSubTrip && (
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h4 className="font-semibold">{currentSubTrip.source} → {currentSubTrip.destination}</h4>
                <p className="text-sm text-gray-600">
                  Date: {new Date(currentSubTrip.date).toLocaleDateString()} | 
                  Weight: {currentSubTrip.total_weight || 0} kg | 
                  Fare: ₹{currentSubTrip.total_fare || 0}
                </p>
              </div>
              <Button onClick={() => setShowItemForm(true)} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>

            {/* Trip items table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Sr.</th>
                    <th className="text-left p-2">Customer</th>
                    <th className="text-left p-2">Receiver</th>
                    <th className="text-left p-2">Goods</th>
                    <th className="text-left p-2">Weight</th>
                    <th className="text-left p-2">Qty</th>
                    <th className="text-left p-2">Rate</th>
                    <th className="text-left p-2">Amount</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tripItems.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">{item.sr_no}</td>
                      <td className="p-2">{item.customer_name}</td>
                      <td className="p-2">{item.receiver_name}</td>
                      <td className="p-2">{item.goods_types?.name || "N/A"}</td>
                      <td className="p-2">{item.total_weight} kg</td>
                      <td className="p-2">{item.total_quantity}</td>
                      <td className="p-2">₹{item.fare_per_piece}</td>
                      <td className="p-2">₹{item.total_price}</td>
                      <td className="p-2">
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedItem(item);
                              setShowItemDetails(true);
                            }}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {tripItems.length === 0 && (
                    <tr>
                      <td colSpan={9} className="text-center py-4 text-gray-500">
                        No items found. Add some items to this trip.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {showItemForm && selectedSubTrip && (
        <TripItemForm
          subTripId={selectedSubTrip}
          type={type}
          nextSrNo={tripItems.length + 1}
          onSubmit={handleItemCreated}
          onCancel={() => setShowItemForm(false)}
        />
      )}

      {showItemDetails && selectedItem && (
        <TripItemDetails
          item={selectedItem}
          onClose={() => {
            setShowItemDetails(false);
            setSelectedItem(null);
          }}
        />
      )}
    </div>
  );
}
