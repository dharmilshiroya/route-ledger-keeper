
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className
}: EmptyStateProps) {
  return (
    <Card className={`border-dashed border-2 border-border/50 hover:border-border transition-all duration-300 ${className}`}>
      <CardContent className="text-center py-16 px-8">
        <div className="mx-auto w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-8 hover-scale">
          <Icon className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-3 tracking-wide">{title}</h3>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">{description}</p>
        {actionLabel && onAction && (
          <Button 
            onClick={onAction}
            className="btn-gradient hover-lift shadow-md"
            size="lg"
          >
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
