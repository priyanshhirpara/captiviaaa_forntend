export interface User {
    id: number;
    username: string;
    fullname: string;
    email?: string;
    mobile_number?: string;
    profile_picture?: string;
    bio?: string;
    website?: string;
    is_private?: boolean;
}

export interface LoginData {
    email?: string;
    mobile_number?: string;
    username?: string;
    password: string;
}

export interface SignupData {
    username: string;
    fullname: string;
    password: string;
    email?: string;
    mobile_number?: string;
}

export interface PersonalInfoData {
    profile_picture: string;
    bio: string;
    website: string;
}