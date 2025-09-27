import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'
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
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'Name must be at least 2 characters.',
    })
    .max(30, {
      message: 'Name must not be longer than 30 characters.',
    }),
  email: z
    .string()
    .min(1, 'Please enter a valid email address.')
    .email(),
  currency_code: z
    .string()
    .length(3, {
      message: 'Currency code must be exactly 3 characters.',
    })
    .optional(),
  timezone: z.string().optional(),
  avatar: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.literal('')),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>



export function ProfileForm() {
  const { user, updateProfile, refreshProfile, isLoading } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)



  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      email: '',
      currency_code: '',
      timezone: '',
      avatar: '',
    },
    mode: 'onChange',
  })



  // Load user data when component mounts or user changes
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || '',
        email: user.email || '',
        currency_code: user.currency_code || '',
        timezone: user.timezone || '',
        avatar: user.avatar || '',
      })
    }
  }, [user, form])

  // Ensure profile is loaded on component mount if not already available
  useEffect(() => {
    if (!user && !isLoading) {
      refreshProfile()
    }
  }, [user, isLoading, refreshProfile])

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true)
    try {
      const result = await updateProfile({
        name: data.name,
        email: data.email,
        currency_code: data.currency_code,
        timezone: data.timezone,
        avatar: data.avatar,
      })

      if (result.success) {
        toast.success('Profile updated successfully!')
        
        // Reset the form with the updated data from the update result
        if (result.data) {
          form.reset({
            name: result.data.name || '',
            email: result.data.email || '',
            currency_code: result.data.currency_code || '',
            timezone: result.data.timezone || '',
            avatar: result.data.avatar || '',
          })
        }
        
        // Refresh the profile to sync with Redux store
        await refreshProfile()
      } else {
        toast.error(result.error || 'Failed to update profile')
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-8'
      >
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder='Your full name' {...field} />
              </FormControl>
              <FormDescription>
                This is your full name that will be displayed on your profile.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='currency_code'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Currency Code</FormLabel>
              <FormControl>
                <Input placeholder='USD' {...field} />
              </FormControl>
              <FormDescription>
                Your preferred currency code (e.g., USD, EUR, GBP).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='your.email@example.com' {...field} />
              </FormControl>
              <FormDescription>
                This is your email address used for account notifications.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='timezone'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Timezone</FormLabel>
              <FormControl>
                <Input placeholder='America/New_York' {...field} />
              </FormControl>
              <FormDescription>
                Your timezone (e.g., America/New_York, Europe/London).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='avatar'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Avatar URL</FormLabel>
              <FormControl>
                <Input placeholder='https://example.com/avatar.jpg' {...field} />
              </FormControl>
              <FormDescription>
                URL to your profile picture or avatar image.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' disabled={isSubmitting || isLoading}>
          {isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
          Update profile
        </Button>
      </form>
    </Form>
  )
}
