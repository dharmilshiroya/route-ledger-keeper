
import { cn } from "@/lib/utils"

interface LoadingProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function Loading({ size = "md", className }: LoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  }

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className={cn(
        "loading-spinner border-2 border-gray-200 border-t-blue-600",
        sizeClasses[size]
      )} />
    </div>
  )
}

export function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center space-y-4">
        <Loading size="lg" />
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">Loading...</h2>
          <p className="text-gray-600">Please wait while we prepare your data</p>
        </div>
      </div>
    </div>
  )
}

export function LoadingCard() {
  return (
    <div className="card-modern p-6 space-y-4">
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  )
}
