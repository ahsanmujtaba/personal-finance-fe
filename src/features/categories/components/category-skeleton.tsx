import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export function CategorySkeleton() {
  return (
    <div className="space-y-4">
      {/* Table Header Skeleton */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[80px]" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Table Rows Skeleton */}
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b last:border-b-0">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-5 w-[80px] rounded-full" />
                <Skeleton className="h-4 w-[60px]" />
              </div>
              <div className="flex items-center space-x-2">
                <Skeleton className="h-8 w-[70px]" />
                <Skeleton className="h-8 w-[70px]" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

// Alternative grid skeleton for different layouts
export function CategoryGridSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-[120px]" />
              <Skeleton className="h-5 w-[60px] rounded-full" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-[80px]" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}