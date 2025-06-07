
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface TripItem {
  id: string;
  sr_no: number;
  customer_name: string;
  receiver_name: string;
  total_weight: number;
  total_quantity: number;
  fare_per_piece: number;
  total_price: number;
  goods_types?: { name: string };
}

interface TripItemDetailsProps {
  item: TripItem;
  onClose: () => void;
}

export function TripItemDetails({ item, onClose }: TripItemDetailsProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[80]">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Trip Item Details</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-gray-600">Serial Number</div>
              <div className="text-lg">{item.sr_no}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-600">Goods Type</div>
              <div className="text-lg">{item.goods_types?.name || "N/A"}</div>
            </div>
          </div>

          <div>
            <div className="text-sm font-medium text-gray-600">Customer Name</div>
            <div className="text-lg">{item.customer_name}</div>
          </div>

          <div>
            <div className="text-sm font-medium text-gray-600">Receiver Name</div>
            <div className="text-lg">{item.receiver_name}</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-gray-600">Weight</div>
              <div className="text-lg">{item.total_weight} kg</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-600">Quantity</div>
              <div className="text-lg">{item.total_quantity} pieces</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-gray-600">Rate per Piece</div>
              <div className="text-lg">₹{item.fare_per_piece}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-600">Total Amount</div>
              <div className="text-xl font-bold text-green-600">₹{item.total_price}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
