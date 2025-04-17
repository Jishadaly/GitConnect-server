export interface IUserConnection {
    username: string;
    userId: number;
    nodeId: string;
    profileImage: string;
    gravatarId?: string;
    apiUrl: string;
    webpageUrl: string;
    followersApi: string;
    followingApi: string;
    gistsApi: string;
    starredApi: string;
    subscriptionsApi: string;
    orgsApi: string;
    repositoriesApi: string;
    eventsApi: string;
    receivedEventsApi: string;
    accountType: "User" | "Organization";
    isSiteAdmin: boolean;
}