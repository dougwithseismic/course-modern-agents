import { Metadata } from 'next'
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query'

export const metadata: Metadata = {
  title: 'TermsAndConditions',
  robots: {
    index: false,
    follow: false,
  },
}

interface TermsAndConditionsData {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

const fetchTermsAndConditionsData = async (): Promise<
  TermsAndConditionsData[]
> => {
  // TODO: Implement actual API endpoint
  return [
    {
      id: '1',
      name: 'Terms and Conditions v1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]
}

const Page = async () => {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['termsAndConditionsData'],
    queryFn: fetchTermsAndConditionsData,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <section>
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-96">
          <h1 className="text-2xl font-bold text-foreground">
            TermsAndConditions
          </h1>
        </div>
      </section>
    </HydrationBoundary>
  )
}

export default Page