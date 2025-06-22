export interface loginResponseBody {
    accessToken: string;
    refreshToken: string
} 

export type Users = {
    id: string;
    email: string;
    displayName: string | null;
}

export type Message = {
    from: string;
    message: string;
    email?: string; 
}