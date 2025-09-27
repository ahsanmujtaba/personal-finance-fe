import { Wallet } from 'lucide-react'

type AuthLayoutProps = {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className='container grid h-svh max-w-none items-center justify-center'>
      <div className='mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:w-[480px] sm:p-8'>
        <div className='mb-4 flex items-center justify-center'>
          {/* <Logo className='me-2' /> */}

          {/* logo icon should be in the middle */}
          <div className='flex items-center gap-2'>
            <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-10 items-center justify-center rounded-lg'>
              <Wallet className='m-2 h-10 w-10 size-4' />
            </div>
            
            <h1 className='text-xl font-bold'>Personal Finance</h1>
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}
