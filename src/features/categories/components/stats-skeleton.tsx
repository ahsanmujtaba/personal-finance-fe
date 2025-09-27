import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function StatsCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          <Skeleton className="h-4 w-[120px]" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-[60px]" />
      </CardContent>
    </Card>
  )
}

export function StatsGridSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <StatsCardSkeleton key={index} />
      ))}
    </div>
  )
}