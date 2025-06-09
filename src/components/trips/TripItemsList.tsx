
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Package, Calendar, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TripItemForm } from "./TripItemForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface TripItem {
  id: string;
  sr_no: number;
  customer_name: string;
  receiver_name: string;
  total_weight: number;
  total_quantity: number;
  fare_per_piece: number;
  total_price: number;
  goods_type_id?: string;
  goods_types?: { name: string };
}

interface TripItemsListProps {
  subTripId: string;
  type: "inbound" | "outbound";
  items: TripItem[];
  onRefresh: () => void;
}

export function TripItemsList({ subTripId, type, items, onRefresh }: TripItemsListProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);

  const handleDeleteItem = async (itemId: string) => {
    try {
      setDeletingItemId(itemId);
      
      const tableName = type === "inbound" ? "inbound_trip_items" : "outbound_trip_items";
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      toast.success('Item deleted successfully');
      onRefresh();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    } finally {
      setDeletingItemId(null);
    }
  };

  const nextSrNo = items.length > 0 ? Math.max(...items.map(item => item.sr_no)) + 1 : 1;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center">
          <Package className="h-5 w-5 mr-2" />
          {type === "inbound" ? "Inbound" : "Outbound"} Trip Items
        </h3>
        <Button 
          onClick={() => setShowAddForm(true)}
          size="sm"
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No items added yet</p>
            <p className="text-sm text-gray-400 mt-1">Click "Add Item" to get started</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {items.map((item) => (
            <Card key={item.id} className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-semibold mr-3">
                      #{item.sr_no}
                    </span>
                    {item.goods_types?.name && (
                      <Badge variant="outline" className="ml-2">
                        {item.goods_types.name}
                      </Badge>
                    )}
                  </CardTitle>
                  <div className="text-xl font-bold text-green-600">
                    ₹{item.total_price.toLocaleString()}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-gray-600">Customer:</span>
                    <span className="font-medium">{item.customer_name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">Receiver:</span>
                    <span className="font-medium">{item.receiver_name}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Weight:</span>
                    <div className="font-semibold">{item.total_weight} kg</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Quantity:</span>
                    <div className="font-semibold">{item.total_quantity}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Rate/Piece:</span>
                    <div className="font-semibold">₹{item.fare_per_piece}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Total:</span>
                    <div className="font-semibold text-green-600">₹{item.total_price.toLocaleString()}</div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 mt-4 pt-4 border-t">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-600 hover:bg-red-50"
                        disabled={deletingItemId === item.id}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        {deletingItemId === item.id ? "Deleting..." : "Delete"}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Item</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this trip item? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteItem(item.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showAddForm && (
        <TripItemForm
          subTripId={subTripId}
          type={type}
          nextSrNo={nextSrNo}
          onSubmit={() => {
            setShowAddForm(false);
            onRefresh();
          }}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
}
