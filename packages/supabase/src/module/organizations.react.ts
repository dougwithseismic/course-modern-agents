import { SupabaseClient } from '@supabase/supabase-js'
import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import type { Database } from '../database.types'
import {
  Organization,
  OrganizationUpdate,
  OrganizationMember,
  getOrganization,
  updateOrganization,
  getOrganizationMembers,
  addOrganizationMember,
} from './organizations'
import type { Json, Role } from '../types'

// Common Types
import type { SupabaseProps, QueryEnabledProps } from '../types/react-query'

type OrganizationResponse<T> = {
  data: T
  error: OrganizationError | null
}

/**
 * Custom error class for handling organization-related errors with additional context
 *
 * @example
 * ```ts
 * // Create a new error
 * const error = new OrganizationError('Failed to fetch organization', 'FETCH_ERROR', 500)
 *
 * // Convert from unknown error
 * try {
 *   await someOperation()
 * } catch (err) {
 *   throw OrganizationError.fromError(err, 'OPERATION_ERROR')
 * }
 * ```
 */
export class OrganizationError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly status?: number,
  ) {
    super(message)
    this.name = 'OrganizationError'
  }

  static fromError(
    err: unknown,
    code = 'UNKNOWN_ERROR',
    status = 500,
  ): OrganizationError {
    if (err instanceof Error) {
      return new OrganizationError(
        err.message,
        err instanceof OrganizationError ? err.code : code,
        err instanceof OrganizationError ? err.status : status,
      )
    }
    return new OrganizationError('An unknown error occurred', code, status)
  }
}

// Query Key Types
type BaseKey = ['organizations']
type ListKey = [...BaseKey, 'list', { filters: Record<string, unknown> }]
type DetailKey = [...BaseKey, 'detail', string]
type MembersKey = [...DetailKey, 'members']

/**
 * Query key factory for organizations with proper type safety
 *
 * @example
 * ```ts
 * // Get base key
 * const baseKey = organizationKeys.all()
 *
 * // Get list key with filters
 * const listKey = organizationKeys.list({ filters: { status: 'active' } })
 *
 * // Get detail key
 * const detailKey = organizationKeys.detail({ orgId: '123' })
 *
 * // Get members key
 * const membersKey = organizationKeys.members({ orgId: '123' })
 * ```
 */
export const organizationKeys = {
  all: (): BaseKey => ['organizations'],
  lists: () => [...organizationKeys.all(), 'list'] as const,
  list: ({ filters }: { filters: Record<string, unknown> }): ListKey => [
    ...organizationKeys.lists(),
    { filters },
  ],
  details: () => [...organizationKeys.all(), 'detail'] as const,
  detail: ({ orgId }: { orgId: string }): DetailKey => [
    ...organizationKeys.details(),
    orgId,
  ],
  members: ({ orgId }: { orgId: string }): MembersKey => [
    ...organizationKeys.detail({ orgId }),
    'members',
  ],
} as const

type OrganizationQueryParams = SupabaseProps & {
  orgId: string
}

/**
 * Query options factory for organization queries with error handling
 *
 * @example
 * ```ts
 * // Use in a custom query
 * const { data } = useQuery({
 *   ...organizationQueries.detail({
 *     supabase,
 *     orgId: '123'
 *   })
 * })
 *
 * // Get members query options
 * const { data } = useQuery({
 *   ...organizationQueries.members({
 *     supabase,
 *     orgId: '123'
 *   })
 * })
 * ```
 */
export const organizationQueries = {
  detail: ({ supabase, orgId }: OrganizationQueryParams) =>
    queryOptions({
      queryKey: organizationKeys.detail({ orgId }),
      queryFn: async (): Promise<Organization> => {
        try {
          const data = await getOrganization({ supabase, orgId })
          if (!data) {
            throw new OrganizationError(
              'Organization not found',
              'NOT_FOUND',
              404,
            )
          }
          return data
        } catch (err) {
          throw OrganizationError.fromError(err, 'FETCH_ERROR')
        }
      },
    }),

  members: ({ supabase, orgId }: OrganizationQueryParams) =>
    queryOptions({
      queryKey: organizationKeys.members({ orgId }),
      queryFn: async (): Promise<OrganizationMember[]> => {
        try {
          const data = await getOrganizationMembers({ supabase, orgId })
          return data
        } catch (err) {
          throw OrganizationError.fromError(err, 'FETCH_ERROR')
        }
      },
    }),
}

type GetOrganizationParams = OrganizationQueryParams & QueryEnabledProps

/**
 * React hook to fetch an organization's details with type safety and error handling
 *
 * @example
 * ```ts
 * // Basic usage
 * const { data, error } = useGetOrganization({
 *   supabase,
 *   orgId: '123'
 * })
 *
 * // With enabled flag
 * const { data, error } = useGetOrganization({
 *   supabase,
 *   orgId: '123',
 *   enabled: isReady
 * })
 *
 * if (error) {
 *   console.error('Failed to fetch organization:', error.message)
 * }
 * ```
 */
export const useGetOrganization = ({
  supabase,
  orgId,
  enabled = true,
}: GetOrganizationParams): OrganizationResponse<Organization | null> => {
  const { data, error } = useQuery<Organization, OrganizationError>({
    ...organizationQueries.detail({ supabase, orgId }),
    enabled: Boolean(orgId) && enabled,
  })

  return {
    data: data ?? null,
    error: error ?? null,
  }
}

/**
 * React hook to fetch organization members with type safety and error handling
 *
 * @example
 * ```ts
 * // Basic usage
 * const { data, error } = useGetOrganizationMembers({
 *   supabase,
 *   orgId: '123'
 * })
 *
 * // With enabled flag
 * const { data, error } = useGetOrganizationMembers({
 *   supabase,
 *   orgId: '123',
 *   enabled: isReady
 * })
 *
 * // Map through members
 * data.map(member => (
 *   <div key={member.id}>
 *     {member.user.email} - {member.role}
 *   </div>
 * ))
 * ```
 */
export const useGetOrganizationMembers = ({
  supabase,
  orgId,
  enabled = true,
}: GetOrganizationParams): OrganizationResponse<OrganizationMember[]> => {
  const { data, error } = useQuery<OrganizationMember[], OrganizationError>({
    ...organizationQueries.members({ supabase, orgId }),
    enabled: Boolean(orgId) && enabled,
  })

  return {
    data: data ?? [],
    error: error ?? null,
  }
}

type UpdateOrganizationRequest = {
  orgId: string
  updates: OrganizationUpdate
}

/**
 * React hook to update an organization with optimistic updates and error handling
 *
 * @example
 * ```ts
 * // Basic usage
 * const mutation = useUpdateOrganization({ supabase })
 *
 * // Update organization
 * mutation.mutate({
 *   orgId: '123',
 *   updates: {
 *     name: 'New Name',
 *     settings: { theme: 'dark' }
 *   }
 * })
 *
 * // With error handling
 * try {
 *   await mutation.mutateAsync({
 *     orgId: '123',
 *     updates: { name: 'New Name' }
 *   })
 *   console.log('Organization updated successfully')
 * } catch (error) {
 *   console.error('Failed to update:', error.message)
 * }
 * ```
 */
export const useUpdateOrganization = ({ supabase }: SupabaseProps) => {
  const queryClient = useQueryClient()

  return useMutation<
    Organization,
    OrganizationError,
    UpdateOrganizationRequest,
    { previousData: Organization | undefined }
  >({
    mutationFn: async ({ orgId, updates }) => {
      try {
        const data = await updateOrganization({ supabase, orgId, updates })
        if (!data) {
          throw new OrganizationError(
            'Failed to update organization',
            'UPDATE_FAILED',
          )
        }
        return data
      } catch (err) {
        throw OrganizationError.fromError(err, 'UPDATE_ERROR')
      }
    },
    onMutate: async ({ orgId, updates }) => {
      await queryClient.cancelQueries({
        queryKey: organizationKeys.detail({ orgId }),
      })
      const previousData = queryClient.getQueryData<Organization>(
        organizationKeys.detail({ orgId }),
      )

      if (previousData) {
        const existingSettings = (previousData.settings ?? {}) as Record<
          string,
          unknown
        >
        const newSettings = (updates.settings ?? {}) as Record<string, unknown>

        const updatedData: Organization = {
          ...previousData,
          ...updates,
          settings: { ...existingSettings, ...newSettings } as Json,
        }

        queryClient.setQueryData<Organization>(
          organizationKeys.detail({ orgId }),
          updatedData,
        )
      }

      return { previousData }
    },
    onError: (err, { orgId }, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          organizationKeys.detail({ orgId }),
          context.previousData,
        )
      }
    },
    onSuccess: (data, { orgId }) => {
      void queryClient.invalidateQueries({
        queryKey: organizationKeys.detail({ orgId }),
      })
      void queryClient.invalidateQueries({
        queryKey: organizationKeys.lists(),
      })
    },
  })
}

type AddOrganizationMemberRequest = {
  orgId: string
  userId: string
  role?: Role
}

/**
 * React hook to add a member to an organization with error handling
 *
 * @example
 * ```ts
 * // Basic usage
 * const mutation = useAddOrganizationMember({ supabase })
 *
 * // Add member with default role
 * mutation.mutate({
 *   orgId: '123',
 *   userId: 'user-456'
 * })
 *
 * // Add member with specific role
 * mutation.mutate({
 *   orgId: '123',
 *   userId: 'user-456',
 *   role: 'ADMIN'
 * })
 *
 * // With async/await and error handling
 * try {
 *   const member = await mutation.mutateAsync({
 *     orgId: '123',
 *     userId: 'user-456',
 *     role: 'MEMBER'
 *   })
 *   console.log('Member added:', member)
 * } catch (error) {
 *   console.error('Failed to add member:', error.message)
 * }
 * ```
 */
export const useAddOrganizationMember = ({ supabase }: SupabaseProps) => {
  const queryClient = useQueryClient()

  return useMutation<
    OrganizationMember,
    OrganizationError,
    AddOrganizationMemberRequest
  >({
    mutationFn: async ({ orgId, userId, role }) => {
      try {
        const data = await addOrganizationMember({
          supabase,
          orgId,
          userId,
          role,
        })
        if (!data) {
          throw new OrganizationError(
            'Failed to add member',
            'ADD_MEMBER_FAILED',
          )
        }
        return data as unknown as OrganizationMember
      } catch (err) {
        throw OrganizationError.fromError(err, 'ADD_MEMBER_ERROR')
      }
    },
    onSuccess: (_, { orgId }) => {
      void queryClient.invalidateQueries({
        queryKey: organizationKeys.members({ orgId }),
      })
    },
  })
}
