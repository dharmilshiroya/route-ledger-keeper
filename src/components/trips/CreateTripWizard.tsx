
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { TripBasicDetails } from "./wizard/TripBasicDetails";
import { TripInboundDetails } from "./wizard/TripInboundDetails";
import { TripOutboundDetails } from "./wizard/TripOutboundDetails";

interface CreateTripWizardProps {
  onComplete: () => void;
  onCancel: () => void;
  tripData?: Partial<TripData>;
  isEditing?: boolean;
}

export interface TripData {
  tripId?: string;
  tripNumber: string;
  vehicleId: string;
  localDriverId: string;
  routeDriverId: string;
  status: string;
  
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

export function CreateTripWizard({ onComplete, onCancel, tripData, isEditing = false }: CreateTripWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>(isEditing ? [1] : []);
  const [localTripData, setLocalTripData] = useState<Partial<TripData>>(tripData || {
    inboundItems: [{
      id: `temp-1`,
      srNo: 1,
      customerName: "",
      receiverName: "",
      goodsTypeId: "",
      totalWeight: 0,
      totalQuantity: 0,
      farePerPiece: 0,
      totalPrice: 0
    }],
    outboundItems: [{
      id: `temp-1`,
      srNo: 1,
      customerName: "",
      receiverName: "",
      goodsTypeId: "",
      totalWeight: 0,
      totalQuantity: 0,
      farePerPiece: 0,
      totalPrice: 0
    }]
  });

  const handleStepComplete = (stepData: Partial<TripData>) => {
    setLocalTripData(prev => ({ ...prev, ...stepData }));
    
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep]);
    }
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStepClick = (stepNumber: number) => {
    if (stepNumber === 1 || completedSteps.includes(1)) {
      setCurrentStep(stepNumber);
    }
  };

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

  const handleFinalSubmit = async () => {
    onComplete();
  };

  const isStepAccessible = (step: number) => {
    return step === 1 || completedSteps.includes(1);
  };

  const isStepCompleted = (step: number) => {
    return completedSteps.includes(step);
  };

  const canCompleteTrip = () => {
    return completedSteps.includes(1);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="text-2xl font-bold text-center text-gray-800">
            {isEditing ? "Edit Trip" : "Create New Trip"}
          </CardTitle>
          
          <div className="flex justify-center mt-6">
            <div className="flex items-center space-x-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => handleStepClick(step.id)}
                      disabled={!isStepAccessible(step.id)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                        currentStep === step.id 
                          ? 'bg-blue-600 border-blue-600 text-white' 
                          : isStepCompleted(step.id)
                          ? 'bg-green-600 border-green-600 text-white hover:bg-green-700'
                          : isStepAccessible(step.id)
                          ? 'bg-white border-gray-300 text-gray-500 hover:border-blue-300 hover:text-blue-500'
                          : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {isStepCompleted(step.id) ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        step.id
                      )}
                    </button>
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
          
          {canCompleteTrip() && (
            <div className="flex justify-center mt-4">
              <Button 
                onClick={handleFinalSubmit}
                className="bg-green-600 hover:bg-green-700"
                size="sm"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {isEditing ? "Complete Trip Update" : "Complete Trip Creation"}
              </Button>
            </div>
          )}
        </CardHeader>

        <CardContent className="p-6">
          {currentStep === 1 && (
            <TripBasicDetails
              data={localTripData}
              onNext={handleStepComplete}
              onCancel={onCancel}
              isEditing={isEditing}
            />
          )}
          
          {currentStep === 2 && (
            <TripInboundDetails
              data={localTripData}
              onNext={handleStepComplete}
              onPrevious={handlePrevious}
              isEditing={isEditing}
            />
          )}
          
          {currentStep === 3 && (
            <TripOutboundDetails
              data={localTripData}
              onComplete={handleStepComplete}
              onPrevious={handlePrevious}
              isEditing={isEditing}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
