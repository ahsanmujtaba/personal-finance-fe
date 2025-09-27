import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { PasswordInput } from '@/components/password-input'

const passwordFormSchema = z
  .object({
    current_password: z
      .string()
      .min(1, 'Please enter your current password'),
    password: z
      .string()
      .min(1, 'Please enter your new password')
      .min(8, 'Password must be at least 8 characters long')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/\d/, 'Password must contain at least one number'),
    password_confirmation: z
      .string()
      .min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match.",
    path: ['password_confirmation'],
  })

type PasswordFormValues = z.infer<typeof passwordFormSchema>

export function PasswordForm() {
  const { updatePassword, isLoading } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      current_password: '',
      password: '',
      password_confirmation: '',
    },
    mode: 'onChange',
  })

  const onSubmit = async (data: PasswordFormValues) => {
    setIsSubmitting(true)
    try {
      const result = await updatePassword({
        current_password: data.current_password,
        password: data.password,
        password_confirmation: data.password_confirmation,
      })

      if (result.success) {
        toast.success('Password updated successfully!')
        form.reset()
      } else {
        toast.error(result.error || 'Failed to update password')
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <FormField
          control={form.control}
          name='current_password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Password</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder='Enter your current password'
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Enter your current password to confirm your identity.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder='Enter your new password'
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Password must be at least 8 characters long and contain at least
                one uppercase letter, one lowercase letter, and one number.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password_confirmation'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm New Password</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder='Confirm your new password'
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Re-enter your new password to confirm.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' disabled={isSubmitting || isLoading}>
          {isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
          Update Password
        </Button>
      </form>
    </Form>
  )
}