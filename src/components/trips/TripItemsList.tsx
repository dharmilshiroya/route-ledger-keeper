
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

interface SupabaseSubTripResponse {
  id: string;
  date: string;
  source: string;
  destination: string;
  total_weight: number | null;
  total_fare: number | null;
}

interface SupabaseTripItemResponse {
  id: string;
  sr_no: number;
  customer_name: string;
  receiver_name: string;
  total_weight: number;
  total_quantity: number;
  fare_per_piece: number;
  total_price: number;
  goods_type_id: string | null;
}

interface SupabaseGoodsTypeResponse {
  id: string;
  name: string;
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
      
      const response = await supabase
        .from(tableName)
        .select('id, date, source, destination, total_weight, total_fare')
        .eq('trip_id', tripId)
        .order('date', { ascending: false });

      if (response.error) throw response.error;
      
      const rawData = response.data as SupabaseSubTripResponse[] | null;
      const mappedData: SubTrip[] = (rawData || []).map((item) => ({
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
      
      const itemsResponse = await supabase
        .from(tableName)
        .select('id, sr_no, customer_name, receiver_name, total_weight, total_quantity, fare_per_piece, total_price, goods_type_id')
        .eq(foreignKey, selectedSubTrip)
        .order('sr_no', { ascending: true });

      if (itemsResponse.error) throw itemsResponse.error;

      const rawItemsData = itemsResponse.data as SupabaseTripItemResponse[] | null;
      
      const goodsTypeIds = (rawItemsData || [])
        .map((item) => item.goods_type_id)
        .filter((id): id is string => Boolean(id));
      
      let goodsTypesMap: Record<string, string> = {};
      
      if (goodsTypeIds.length > 0) {
        const goodsResponse = await supabase
          .from('goods_types')
          .select('id, name')
          .in('id', goodsTypeIds);
          
        if (!goodsResponse.error && goodsResponse.data) {
          const goodsData = goodsResponse.data as SupabaseGoodsTypeResponse[];
          goodsTypesMap = goodsData.reduce((acc, goods) => {
            acc[goods.id] = goods.name;
            return acc;
          }, {} as Record<string, string>);
        }
      }

      const mappedItems: TripItem[] = (rawItemsData || []).map((item) => ({
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
    fetchSubTrips();
  };

  const currentSubTrip = subTrips.find(trip => trip.id === selectedSubTrip);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (subTrips.length === 0) {
    return (
      <Card className="border-dashed border-2 border-gray-200">
        <CardContent className="text-center py-12">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Plus className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No {type} trips found</h3>
          <p className="text-gray-500">Add your first {type} trip to get started.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {subTrips.map((subTrip) => (
          <Button
            key={subTrip.id}
            variant={selectedSubTrip === subTrip.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedSubTrip(subTrip.id)}
            className="transition-all duration-200 hover:scale-105"
          >
            <span className="font-medium">{subTrip.source} → {subTrip.destination}</span>
            <span className="ml-2 text-xs opacity-75">
              ({new Date(subTrip.date).toLocaleDateString()})
            </span>
          </Button>
        ))}
      </div>

      {currentSubTrip && (
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="space-y-2">
                <h4 className="text-xl font-bold text-gray-900">
                  {currentSubTrip.source} → {currentSubTrip.destination}
                </h4>
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Date:</span>
                    <span>{new Date(currentSubTrip.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Weight:</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                      {currentSubTrip.total_weight || 0} kg
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Fare:</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                      ₹{currentSubTrip.total_fare || 0}
                    </span>
                  </div>
                </div>
              </div>
              <Button 
                onClick={() => setShowItemForm(true)} 
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left p-4 font-semibold text-gray-700">Sr.</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Customer</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Receiver</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Goods</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Weight</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Qty</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Rate</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Amount</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tripItems.map((item, index) => (
                      <tr key={item.id} className={`border-b border-gray-100 hover:bg-blue-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="p-4 font-medium text-gray-900">{item.sr_no}</td>
                        <td className="p-4 text-gray-700">{item.customer_name}</td>
                        <td className="p-4 text-gray-700">{item.receiver_name}</td>
                        <td className="p-4">
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                            {item.goods_types?.name || "N/A"}
                          </span>
                        </td>
                        <td className="p-4 font-medium text-gray-900">{item.total_weight} kg</td>
                        <td className="p-4 font-medium text-gray-900">{item.total_quantity}</td>
                        <td className="p-4 font-medium text-green-600">₹{item.fare_per_piece}</td>
                        <td className="p-4 font-bold text-green-700">₹{item.total_price}</td>
                        <td className="p-4">
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedItem(item);
                                setShowItemDetails(true);
                              }}
                              className="hover:bg-blue-50 hover:border-blue-200 transition-colors duration-150"
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="hover:bg-orange-50 hover:border-orange-200 transition-colors duration-150"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {tripItems.length === 0 && (
                      <tr>
                        <td colSpan={9} className="text-center py-12">
                          <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Plus className="h-6 w-6 text-gray-400" />
                          </div>
                          <p className="text-gray-500 font-medium">No items found</p>
                          <p className="text-gray-400 text-sm mt-1">Add some items to this trip to get started.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
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
