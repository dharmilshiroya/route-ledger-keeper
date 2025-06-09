
import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  color?: "blue" | "green" | "orange" | "purple" | "red"
  className?: string
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  color = "blue",
  className
}: StatsCardProps) {
  const colorClasses = {
    blue: "from-blue-50 to-blue-100 border-blue-200 text-blue-700",
    green: "from-green-50 to-green-100 border-green-200 text-green-700",
    orange: "from-orange-50 to-orange-100 border-orange-200 text-orange-700",
    purple: "from-purple-50 to-purple-100 border-purple-200 text-purple-700",
    red: "from-red-50 to-red-100 border-red-200 text-red-700"
  }

  const iconColorClasses = {
    blue: "text-blue-600 bg-blue-100",
    green: "text-green-600 bg-green-100",
    orange: "text-orange-600 bg-orange-100",
    purple: "text-purple-600 bg-purple-100",
    red: "text-red-600 bg-red-100"
  }

  return (
    <Card className={cn(
      "hover-lift hover-glow transition-all duration-200 border-0 shadow-modern",
      `bg-gradient-to-br ${colorClasses[color]}`,
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium opacity-75">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            {trend && (
              <div className="flex items-center text-sm">
                <span className={cn(
                  "font-medium",
                  trend.isPositive ? "text-green-600" : "text-red-600"
                )}>
                  {trend.isPositive ? "+" : ""}{trend.value}%
                </span>
                <span className="text-gray-600 ml-1">from last month</span>
              </div>
            )}
          </div>
          <div className={cn(
            "p-3 rounded-lg",
            iconColorClasses[color]
          )}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
