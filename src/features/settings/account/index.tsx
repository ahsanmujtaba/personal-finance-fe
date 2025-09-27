import { ContentSection } from '../components/content-section'
import { AccountForm } from './account-form'
import { PasswordForm } from './password-form'

export function SettingsAccount() {
  return (
    <div className='space-y-6'>  
      <ContentSection
        title='Password'
        desc='Change your password. Make sure it is at least 8 characters long and contains uppercase, lowercase, and numeric characters.'
      >
        <PasswordForm />
      </ContentSection>
    </div>
  )
}
