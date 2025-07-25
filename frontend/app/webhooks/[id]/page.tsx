'use client'

import { useI18n } from "@/locales/I18nContext";
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { fetchWebhookRecipient, testWebook, updateWebhookRecipient } from '@/lib/api'
import { WebhookRecipient } from '@/types'
import LoadingSpinner from '@/components/LoadingSpinner'
import SelectBox from '@/components/SelectBox'
import PageHeader from '@/components/PageHeader'
import FormButtons from '@/components/FormButtons'
import TextInput from '@/components/TextInput'
import { showSuccess, showError } from '@/lib/toast'

export default function EditWebhookPage() {
  const { id } = useParams()
  const router = useRouter()
  const { locale } = useI18n()
  const [form, setForm] = useState<WebhookRecipient | null>(null)
  const [testing, setTesting] = useState(false)

  useEffect(() => {
    if (id) {
      fetchWebhookRecipient(Number(id)).then(setForm)
    }
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!form) return
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form) return

    try {
      await updateWebhookRecipient(form.id, {
        name: form.name,
        url: form.url,
      })

      showSuccess('Updated')
    } catch (error: any) {
      const message = error?.response?.data?.detail || error?.message || 'Failed to update webhook'
      showError(message)
    }
  }

  const handleTest = async () => {
    setTesting(true)
    try {
      const payload = {
        ...form
      }
      await testWebook(payload)
      showSuccess('Test success!')
      console.log(payload)
    } catch (e: any) {
      // setTestResult(`❌ Error: ${e.message || 'Connection failure.'}`)
      showError(`Error: ${e.message || 'Connection failure.'}`)
    } finally {
      setTesting(false)
    }
  }

  // if (loading) { return <LoadingSpinner /> }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <PageHeader
        hasBack={true}
        title={locale.ui.edit}
      />
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <TextInput
          label={locale.forms.labels.name}
          name="name"
          value={form?.name}
          onChange={handleChange}
          placeholder={locale.forms.labels.name}
        />
        <TextInput
          label={form?.type === 'CUSTOM' ? locale.forms.labels.webhook_type.url : locale.forms.labels.webhook_type.token}
          name="url"
          value={form?.url}
          onChange={handleChange}
          placeholder={form?.type === 'CUSTOM' ? 'https://example.com/webhook' : 'xxxxxxxxxxxxxxxxxx'}
        />

        <div className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleTest}
              disabled={testing}
              className="px-4 py-2 bg-gray-100 border border-gray-300 rounded"
            >
              {testing ? locale.buttons.states.testing : locale.buttons.test}
            </button>
          </div>

          <FormButtons
            cancelLabel={locale.buttons.cancel}
            saveLabel={locale.buttons.update}
          />
        </div>
      </form>
    </div>
  )
}