/**
 * Token types
 */
export type JwtPayload = {
    sub: number
    first_name: string
    last_name: string
    email: string
};

export type RefreshPayload = Pick<JwtPayload, "sub">;