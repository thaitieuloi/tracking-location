import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import type { CreateFamilyRequest, CreateGeofenceRequest, Family, FamilyDashboard, FamilyWithMembers, Geofence, GetFamilyMessagesParams, GetMemberLocationHistoryParams, HealthStatus, JoinFamilyRequest, LatestLocation, LocationHistoryPoint, MemberWithLocation, Message, Profile, SOSAlert, SendMessageRequest, SendSOSRequest, UpdateLocationRequest, UpdateProfileRequest } from "./api.schemas";
import { customFetch } from "../custom-fetch";
import type { ErrorType, BodyType } from "../custom-fetch";
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
/**
 * @summary Health check
 */
export declare const getHealthCheckUrl: () => string;
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get current user profile
 */
export declare const getGetMyProfileUrl: () => string;
export declare const getMyProfile: (options?: RequestInit) => Promise<Profile>;
export declare const getGetMyProfileQueryKey: () => readonly ["/api/auth/profile"];
export declare const getGetMyProfileQueryOptions: <TData = Awaited<ReturnType<typeof getMyProfile>>, TError = ErrorType<void>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMyProfile>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getMyProfile>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetMyProfileQueryResult = NonNullable<Awaited<ReturnType<typeof getMyProfile>>>;
export type GetMyProfileQueryError = ErrorType<void>;
/**
 * @summary Get current user profile
 */
export declare function useGetMyProfile<TData = Awaited<ReturnType<typeof getMyProfile>>, TError = ErrorType<void>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMyProfile>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Update current user profile
 */
export declare const getUpdateMyProfileUrl: () => string;
export declare const updateMyProfile: (updateProfileRequest: UpdateProfileRequest, options?: RequestInit) => Promise<Profile>;
export declare const getUpdateMyProfileMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateMyProfile>>, TError, {
        data: BodyType<UpdateProfileRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateMyProfile>>, TError, {
    data: BodyType<UpdateProfileRequest>;
}, TContext>;
export type UpdateMyProfileMutationResult = NonNullable<Awaited<ReturnType<typeof updateMyProfile>>>;
export type UpdateMyProfileMutationBody = BodyType<UpdateProfileRequest>;
export type UpdateMyProfileMutationError = ErrorType<unknown>;
/**
 * @summary Update current user profile
 */
export declare const useUpdateMyProfile: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateMyProfile>>, TError, {
        data: BodyType<UpdateProfileRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateMyProfile>>, TError, {
    data: BodyType<UpdateProfileRequest>;
}, TContext>;
/**
 * @summary Create a new family group
 */
export declare const getCreateFamilyUrl: () => string;
export declare const createFamily: (createFamilyRequest: CreateFamilyRequest, options?: RequestInit) => Promise<Family>;
export declare const getCreateFamilyMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createFamily>>, TError, {
        data: BodyType<CreateFamilyRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createFamily>>, TError, {
    data: BodyType<CreateFamilyRequest>;
}, TContext>;
export type CreateFamilyMutationResult = NonNullable<Awaited<ReturnType<typeof createFamily>>>;
export type CreateFamilyMutationBody = BodyType<CreateFamilyRequest>;
export type CreateFamilyMutationError = ErrorType<unknown>;
/**
 * @summary Create a new family group
 */
export declare const useCreateFamily: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createFamily>>, TError, {
        data: BodyType<CreateFamilyRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createFamily>>, TError, {
    data: BodyType<CreateFamilyRequest>;
}, TContext>;
/**
 * @summary Join a family using invite code
 */
export declare const getJoinFamilyUrl: () => string;
export declare const joinFamily: (joinFamilyRequest: JoinFamilyRequest, options?: RequestInit) => Promise<Family>;
export declare const getJoinFamilyMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof joinFamily>>, TError, {
        data: BodyType<JoinFamilyRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof joinFamily>>, TError, {
    data: BodyType<JoinFamilyRequest>;
}, TContext>;
export type JoinFamilyMutationResult = NonNullable<Awaited<ReturnType<typeof joinFamily>>>;
export type JoinFamilyMutationBody = BodyType<JoinFamilyRequest>;
export type JoinFamilyMutationError = ErrorType<unknown>;
/**
 * @summary Join a family using invite code
 */
export declare const useJoinFamily: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof joinFamily>>, TError, {
        data: BodyType<JoinFamilyRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof joinFamily>>, TError, {
    data: BodyType<JoinFamilyRequest>;
}, TContext>;
/**
 * @summary Get current user's family
 */
export declare const getGetMyFamilyUrl: () => string;
export declare const getMyFamily: (options?: RequestInit) => Promise<FamilyWithMembers>;
export declare const getGetMyFamilyQueryKey: () => readonly ["/api/families/my"];
export declare const getGetMyFamilyQueryOptions: <TData = Awaited<ReturnType<typeof getMyFamily>>, TError = ErrorType<void>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMyFamily>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getMyFamily>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetMyFamilyQueryResult = NonNullable<Awaited<ReturnType<typeof getMyFamily>>>;
export type GetMyFamilyQueryError = ErrorType<void>;
/**
 * @summary Get current user's family
 */
export declare function useGetMyFamily<TData = Awaited<ReturnType<typeof getMyFamily>>, TError = ErrorType<void>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMyFamily>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get all members with their latest locations
 */
export declare const getGetFamilyMembersUrl: (familyId: string) => string;
export declare const getFamilyMembers: (familyId: string, options?: RequestInit) => Promise<MemberWithLocation[]>;
export declare const getGetFamilyMembersQueryKey: (familyId: string) => readonly [`/api/families/${string}/members`];
export declare const getGetFamilyMembersQueryOptions: <TData = Awaited<ReturnType<typeof getFamilyMembers>>, TError = ErrorType<unknown>>(familyId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getFamilyMembers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getFamilyMembers>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetFamilyMembersQueryResult = NonNullable<Awaited<ReturnType<typeof getFamilyMembers>>>;
export type GetFamilyMembersQueryError = ErrorType<unknown>;
/**
 * @summary Get all members with their latest locations
 */
export declare function useGetFamilyMembers<TData = Awaited<ReturnType<typeof getFamilyMembers>>, TError = ErrorType<unknown>>(familyId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getFamilyMembers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Remove a member from family
 */
export declare const getRemoveFamilyMemberUrl: (familyId: string, userId: string) => string;
export declare const removeFamilyMember: (familyId: string, userId: string, options?: RequestInit) => Promise<void>;
export declare const getRemoveFamilyMemberMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof removeFamilyMember>>, TError, {
        familyId: string;
        userId: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof removeFamilyMember>>, TError, {
    familyId: string;
    userId: string;
}, TContext>;
export type RemoveFamilyMemberMutationResult = NonNullable<Awaited<ReturnType<typeof removeFamilyMember>>>;
export type RemoveFamilyMemberMutationError = ErrorType<unknown>;
/**
 * @summary Remove a member from family
 */
export declare const useRemoveFamilyMember: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof removeFamilyMember>>, TError, {
        familyId: string;
        userId: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof removeFamilyMember>>, TError, {
    familyId: string;
    userId: string;
}, TContext>;
/**
 * @summary Update current user's location (called by Flutter app)
 */
export declare const getUpdateLocationUrl: () => string;
export declare const updateLocation: (updateLocationRequest: UpdateLocationRequest, options?: RequestInit) => Promise<LatestLocation>;
export declare const getUpdateLocationMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateLocation>>, TError, {
        data: BodyType<UpdateLocationRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateLocation>>, TError, {
    data: BodyType<UpdateLocationRequest>;
}, TContext>;
export type UpdateLocationMutationResult = NonNullable<Awaited<ReturnType<typeof updateLocation>>>;
export type UpdateLocationMutationBody = BodyType<UpdateLocationRequest>;
export type UpdateLocationMutationError = ErrorType<unknown>;
/**
 * @summary Update current user's location (called by Flutter app)
 */
export declare const useUpdateLocation: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateLocation>>, TError, {
        data: BodyType<UpdateLocationRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateLocation>>, TError, {
    data: BodyType<UpdateLocationRequest>;
}, TContext>;
/**
 * @summary Get latest location of a family member
 */
export declare const getGetMemberLatestLocationUrl: (userId: string) => string;
export declare const getMemberLatestLocation: (userId: string, options?: RequestInit) => Promise<LatestLocation>;
export declare const getGetMemberLatestLocationQueryKey: (userId: string) => readonly [`/api/locations/${string}/latest`];
export declare const getGetMemberLatestLocationQueryOptions: <TData = Awaited<ReturnType<typeof getMemberLatestLocation>>, TError = ErrorType<unknown>>(userId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMemberLatestLocation>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getMemberLatestLocation>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetMemberLatestLocationQueryResult = NonNullable<Awaited<ReturnType<typeof getMemberLatestLocation>>>;
export type GetMemberLatestLocationQueryError = ErrorType<unknown>;
/**
 * @summary Get latest location of a family member
 */
export declare function useGetMemberLatestLocation<TData = Awaited<ReturnType<typeof getMemberLatestLocation>>, TError = ErrorType<unknown>>(userId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMemberLatestLocation>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get location history trail of a member
 */
export declare const getGetMemberLocationHistoryUrl: (userId: string, params?: GetMemberLocationHistoryParams) => string;
export declare const getMemberLocationHistory: (userId: string, params?: GetMemberLocationHistoryParams, options?: RequestInit) => Promise<LocationHistoryPoint[]>;
export declare const getGetMemberLocationHistoryQueryKey: (userId: string, params?: GetMemberLocationHistoryParams) => readonly [`/api/locations/${string}/history`, ...GetMemberLocationHistoryParams[]];
export declare const getGetMemberLocationHistoryQueryOptions: <TData = Awaited<ReturnType<typeof getMemberLocationHistory>>, TError = ErrorType<unknown>>(userId: string, params?: GetMemberLocationHistoryParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMemberLocationHistory>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getMemberLocationHistory>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetMemberLocationHistoryQueryResult = NonNullable<Awaited<ReturnType<typeof getMemberLocationHistory>>>;
export type GetMemberLocationHistoryQueryError = ErrorType<unknown>;
/**
 * @summary Get location history trail of a member
 */
export declare function useGetMemberLocationHistory<TData = Awaited<ReturnType<typeof getMemberLocationHistory>>, TError = ErrorType<unknown>>(userId: string, params?: GetMemberLocationHistoryParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMemberLocationHistory>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get full family dashboard data (all members + locations)
 */
export declare const getGetFamilyDashboardUrl: (familyId: string) => string;
export declare const getFamilyDashboard: (familyId: string, options?: RequestInit) => Promise<FamilyDashboard>;
export declare const getGetFamilyDashboardQueryKey: (familyId: string) => readonly [`/api/families/${string}/dashboard`];
export declare const getGetFamilyDashboardQueryOptions: <TData = Awaited<ReturnType<typeof getFamilyDashboard>>, TError = ErrorType<unknown>>(familyId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getFamilyDashboard>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getFamilyDashboard>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetFamilyDashboardQueryResult = NonNullable<Awaited<ReturnType<typeof getFamilyDashboard>>>;
export type GetFamilyDashboardQueryError = ErrorType<unknown>;
/**
 * @summary Get full family dashboard data (all members + locations)
 */
export declare function useGetFamilyDashboard<TData = Awaited<ReturnType<typeof getFamilyDashboard>>, TError = ErrorType<unknown>>(familyId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getFamilyDashboard>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get all geofences for current user's family
 */
export declare const getGetGeofencesUrl: () => string;
export declare const getGeofences: (options?: RequestInit) => Promise<Geofence[]>;
export declare const getGetGeofencesQueryKey: () => readonly ["/api/geofences"];
export declare const getGetGeofencesQueryOptions: <TData = Awaited<ReturnType<typeof getGeofences>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getGeofences>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getGeofences>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetGeofencesQueryResult = NonNullable<Awaited<ReturnType<typeof getGeofences>>>;
export type GetGeofencesQueryError = ErrorType<unknown>;
/**
 * @summary Get all geofences for current user's family
 */
export declare function useGetGeofences<TData = Awaited<ReturnType<typeof getGeofences>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getGeofences>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create a new geofence
 */
export declare const getCreateGeofenceUrl: () => string;
export declare const createGeofence: (createGeofenceRequest: CreateGeofenceRequest, options?: RequestInit) => Promise<Geofence>;
export declare const getCreateGeofenceMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createGeofence>>, TError, {
        data: BodyType<CreateGeofenceRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createGeofence>>, TError, {
    data: BodyType<CreateGeofenceRequest>;
}, TContext>;
export type CreateGeofenceMutationResult = NonNullable<Awaited<ReturnType<typeof createGeofence>>>;
export type CreateGeofenceMutationBody = BodyType<CreateGeofenceRequest>;
export type CreateGeofenceMutationError = ErrorType<unknown>;
/**
 * @summary Create a new geofence
 */
export declare const useCreateGeofence: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createGeofence>>, TError, {
        data: BodyType<CreateGeofenceRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createGeofence>>, TError, {
    data: BodyType<CreateGeofenceRequest>;
}, TContext>;
/**
 * @summary Delete a geofence
 */
export declare const getDeleteGeofenceUrl: (geofenceId: string) => string;
export declare const deleteGeofence: (geofenceId: string, options?: RequestInit) => Promise<void>;
export declare const getDeleteGeofenceMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteGeofence>>, TError, {
        geofenceId: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteGeofence>>, TError, {
    geofenceId: string;
}, TContext>;
export type DeleteGeofenceMutationResult = NonNullable<Awaited<ReturnType<typeof deleteGeofence>>>;
export type DeleteGeofenceMutationError = ErrorType<unknown>;
/**
 * @summary Delete a geofence
 */
export declare const useDeleteGeofence: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteGeofence>>, TError, {
        geofenceId: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteGeofence>>, TError, {
    geofenceId: string;
}, TContext>;
/**
 * @summary Get family chat messages
 */
export declare const getGetFamilyMessagesUrl: (params?: GetFamilyMessagesParams) => string;
export declare const getFamilyMessages: (params?: GetFamilyMessagesParams, options?: RequestInit) => Promise<Message[]>;
export declare const getGetFamilyMessagesQueryKey: (params?: GetFamilyMessagesParams) => readonly ["/api/messages", ...GetFamilyMessagesParams[]];
export declare const getGetFamilyMessagesQueryOptions: <TData = Awaited<ReturnType<typeof getFamilyMessages>>, TError = ErrorType<unknown>>(params?: GetFamilyMessagesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getFamilyMessages>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getFamilyMessages>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetFamilyMessagesQueryResult = NonNullable<Awaited<ReturnType<typeof getFamilyMessages>>>;
export type GetFamilyMessagesQueryError = ErrorType<unknown>;
/**
 * @summary Get family chat messages
 */
export declare function useGetFamilyMessages<TData = Awaited<ReturnType<typeof getFamilyMessages>>, TError = ErrorType<unknown>>(params?: GetFamilyMessagesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getFamilyMessages>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Send a message to family chat
 */
export declare const getSendMessageUrl: () => string;
export declare const sendMessage: (sendMessageRequest: SendMessageRequest, options?: RequestInit) => Promise<Message>;
export declare const getSendMessageMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof sendMessage>>, TError, {
        data: BodyType<SendMessageRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof sendMessage>>, TError, {
    data: BodyType<SendMessageRequest>;
}, TContext>;
export type SendMessageMutationResult = NonNullable<Awaited<ReturnType<typeof sendMessage>>>;
export type SendMessageMutationBody = BodyType<SendMessageRequest>;
export type SendMessageMutationError = ErrorType<unknown>;
/**
 * @summary Send a message to family chat
 */
export declare const useSendMessage: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof sendMessage>>, TError, {
        data: BodyType<SendMessageRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof sendMessage>>, TError, {
    data: BodyType<SendMessageRequest>;
}, TContext>;
/**
 * @summary Send SOS alert to family
 */
export declare const getSendSOSUrl: () => string;
export declare const sendSOS: (sendSOSRequest: SendSOSRequest, options?: RequestInit) => Promise<SOSAlert>;
export declare const getSendSOSMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof sendSOS>>, TError, {
        data: BodyType<SendSOSRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof sendSOS>>, TError, {
    data: BodyType<SendSOSRequest>;
}, TContext>;
export type SendSOSMutationResult = NonNullable<Awaited<ReturnType<typeof sendSOS>>>;
export type SendSOSMutationBody = BodyType<SendSOSRequest>;
export type SendSOSMutationError = ErrorType<unknown>;
/**
 * @summary Send SOS alert to family
 */
export declare const useSendSOS: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof sendSOS>>, TError, {
        data: BodyType<SendSOSRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof sendSOS>>, TError, {
    data: BodyType<SendSOSRequest>;
}, TContext>;
/**
 * @summary Get recent SOS alerts for family
 */
export declare const getGetSOSAlertsUrl: () => string;
export declare const getSOSAlerts: (options?: RequestInit) => Promise<SOSAlert[]>;
export declare const getGetSOSAlertsQueryKey: () => readonly ["/api/sos/alerts"];
export declare const getGetSOSAlertsQueryOptions: <TData = Awaited<ReturnType<typeof getSOSAlerts>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSOSAlerts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getSOSAlerts>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetSOSAlertsQueryResult = NonNullable<Awaited<ReturnType<typeof getSOSAlerts>>>;
export type GetSOSAlertsQueryError = ErrorType<unknown>;
/**
 * @summary Get recent SOS alerts for family
 */
export declare function useGetSOSAlerts<TData = Awaited<ReturnType<typeof getSOSAlerts>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSOSAlerts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export {};
//# sourceMappingURL=api.d.ts.map