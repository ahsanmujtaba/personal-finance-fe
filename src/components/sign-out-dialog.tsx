import { useState } from 'react'
import { useNavigate, useLocation } from '@tanstack/react-router'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

interface SignOutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SignOutDialog({ open, onOpenChange }: SignOutDialogProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout, logoutFromAllDevices, isLoading } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleSignOut = async (logoutAll = false) => {
    setIsLoggingOut(true)
    try {
      const result = logoutAll ? await logoutFromAllDevices() : await logout()
      
      if (result.success) {
        toast.success(logoutAll ? 'Signed out from all devices' : 'Signed out successfully')
        onOpenChange(false)
        // Preserve current location for redirect after sign-in
        const currentPath = location.href
        navigate({
          to: '/sign-in',
          search: { redirect: currentPath },
          replace: true,
        })
      } else {
        toast.error(result.error || 'Failed to sign out')
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Sign out</DialogTitle>
          <DialogDescription>
            Choose how you want to sign out of your account.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='flex-col gap-2 sm:flex-col'>
          <Button
            variant='outline'
            onClick={() => handleSignOut(false)}
            disabled={isLoggingOut || isLoading}
            className='w-full'
          >
            {isLoggingOut ? 'Signing out...' : 'Sign out current session'}
          </Button>
          <Button
            variant='destructive'
            onClick={() => handleSignOut(true)}
            disabled={isLoggingOut || isLoading}
            className='w-full'
          >
            {isLoggingOut ? 'Signing out...' : 'Sign out from all devices'}
          </Button>
          <Button
            variant='ghost'
            onClick={() => onOpenChange(false)}
            disabled={isLoggingOut || isLoading}
            className='w-full'
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
