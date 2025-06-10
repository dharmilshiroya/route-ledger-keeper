
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowLeft, ArrowRight, CheckCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto card-elevated animate-scale-in">
        <CardHeader className="border-b border-border/50 bg-gradient-subtle">
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-2xl font-bold text-foreground">
              {isEditing ? "Edit Trip" : "Create New Trip"}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onCancel} className="hover:bg-muted/50">
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-6">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => handleStepClick(step.id)}
                      disabled={!isStepAccessible(step.id)}
                      className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 hover-scale", 
                        currentStep === step.id 
                          ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/25' 
                          : isStepCompleted(step.id)
                          ? 'bg-green-600 border-green-600 text-white hover:bg-green-700 shadow-md'
                          : isStepAccessible(step.id)
                          ? 'bg-card border-border text-muted-foreground hover:border-primary/50 hover:text-primary'
                          : 'bg-muted border-muted text-muted-foreground/50 cursor-not-allowed'
                      )}
                    >
                      {isStepCompleted(step.id) ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        step.id
                      )}
                    </button>
                    <div className="mt-3 text-center">
                      <div className={cn(
                        "text-sm font-semibold tracking-wide",
                        currentStep === step.id ? 'text-primary' : 'text-foreground'
                      )}>
                        {step.title}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{step.description}</div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={cn(
                      "w-16 h-0.5 mx-6 mt-[-24px] transition-all duration-300",
                      isStepCompleted(step.id + 1) ? 'bg-green-600' : 'bg-border'
                    )} />
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {canCompleteTrip() && (
            <div className="flex justify-center mt-6">
              <Button 
                onClick={handleFinalSubmit}
                className="btn-gradient hover-lift shadow-lg"
                size="sm"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {isEditing ? "Complete Trip Update" : "Complete Trip Creation"}
              </Button>
            </div>
          )}
        </CardHeader>

        <CardContent className="p-8 bg-gradient-subtle">
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
