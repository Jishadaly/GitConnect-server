export interface    IGitUserProfile {
    id?: number;
    login: string;
    name?: string;
    username:string;
    email?: string;
    avatar_url?: string;
    location?: string;
    blog?: string;
    bio?: string;
    public_repos?: number;
    public_gists?: number;
    followers?: number;
    following?: number;
    followers_url?: string;
    following_url?: string;
    created_at?: Date;
}

// types/user.ts or interfaces/user.ts
export interface IUser {
    _id?: string;
    login: string;
    name?: string;
    username: string;
    location?: string;
    avatar?: string;
    blog?: string;
    bio?: string;
    public_repos?: number;
    public_gists?: number;
    followers?: number;
    following?: number;
    github_created_at?: Date;
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }
  