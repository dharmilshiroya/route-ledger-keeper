
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowLeft, ArrowRight } from "lucide-react";
import { TripBasicDetails } from "./wizard/TripBasicDetails";
import { TripInboundDetails } from "./wizard/TripInboundDetails";
import { TripOutboundDetails } from "./wizard/TripOutboundDetails";

interface CreateTripWizardProps {
  onComplete: () => void;
  onCancel: () => void;
}

export interface TripData {
  // Step 1: Basic Details
  tripNumber: string;
  vehicleId: string;
  localDriverId: string;
  routeDriverId: string;
  
  // Step 2: Inbound Details
  inboundDate: string;
  inboundSource: string;
  inboundDestination: string;
  inboundItems: Array<{
    id: string;
    srNo: number;
    customerName: string;
    receiverName: string;
    goodsTypeId: string;
    totalWeight: number;
    totalQuantity: number;
    farePerPiece: number;
    totalPrice: number;
  }>;
  
  // Step 3: Outbound Details
  outboundDate: string;
  outboundSource: string;
  outboundDestination: string;
  outboundItems: Array<{
    id: string;
    srNo: number;
    customerName: string;
    receiverName: string;
    goodsTypeId: string;
    totalWeight: number;
    totalQuantity: number;
    farePerPiece: number;
    totalPrice: number;
  }>;
}

const steps = [
  { id: 1, title: "Basic Details", description: "Trip info, vehicle & drivers" },
  { id: 2, title: "Inbound Trip", description: "Route & customer details" },
  { id: 3, title: "Outbound Trip", description: "Return route & details" }
];

export function CreateTripWizard({ onComplete, onCancel }: CreateTripWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [tripData, setTripData] = useState<Partial<TripData>>({
    inboundItems: Array.from({ length: 15 }, (_, i) => ({
      id: `temp-${i + 1}`,
      srNo: i + 1,
      customerName: "",
      receiverName: "",
      goodsTypeId: "",
      totalWeight: 0,
      totalQuantity: 0,
      farePerPiece: 0,
      totalPrice: 0
    })),
    outboundItems: Array.from({ length: 15 }, (_, i) => ({
      id: `temp-${i + 1}`,
      srNo: i + 1,
      customerName: "",
      receiverName: "",
      goodsTypeId: "",
      totalWeight: 0,
      totalQuantity: 0,
      farePerPiece: 0,
      totalPrice: 0
    }))
  });

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepComplete = (stepData: Partial<TripData>) => {
    setTripData(prev => ({ ...prev, ...stepData }));
    if (currentStep === 3) {
      onComplete();
    } else {
      handleNext();
    }
  };

  const isStepCompleted = (step: number) => {
    return step < currentStep;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="text-2xl font-bold text-center text-gray-800">
            Create New Trip
          </CardTitle>
          
          {/* Progress Steps */}
          <div className="flex justify-center mt-6">
            <div className="flex items-center space-x-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                      currentStep === step.id 
                        ? 'bg-blue-600 border-blue-600 text-white' 
                        : isStepCompleted(step.id)
                        ? 'bg-green-600 border-green-600 text-white'
                        : 'bg-white border-gray-300 text-gray-500'
                    }`}>
                      {isStepCompleted(step.id) ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        step.id
                      )}
                    </div>
                    <div className="mt-2 text-center">
                      <div className={`text-sm font-medium ${
                        currentStep === step.id ? 'text-blue-600' : 'text-gray-600'
                      }`}>
                        {step.title}
                      </div>
                      <div className="text-xs text-gray-500">{step.description}</div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-4 mt-[-20px] ${
                      isStepCompleted(step.id + 1) ? 'bg-green-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {currentStep === 1 && (
            <TripBasicDetails
              data={tripData}
              onNext={handleStepComplete}
              onCancel={onCancel}
            />
          )}
          
          {currentStep === 2 && (
            <TripInboundDetails
              data={tripData}
              onNext={handleStepComplete}
              onPrevious={handlePrevious}
            />
          )}
          
          {currentStep === 3 && (
            <TripOutboundDetails
              data={tripData}
              onComplete={handleStepComplete}
              onPrevious={handlePrevious}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
