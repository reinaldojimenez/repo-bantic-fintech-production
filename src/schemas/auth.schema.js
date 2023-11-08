import { z } from 'zod'

export const registerSchema = z.object({
    username: z.string({
        required_error: "Username is required"
    }),
    email: z.string({
            required_error: "Email is required"
        }).email({
            message: "invalid email"
        }),
    password: z.string({
            required_error: "Password is required"
        }).min(6, {
            message: "Password must be at least 6 characteres",
        }),
});


export const loginSchema = z.object({
    username: z.string({
            required_error: "El usuario es requerido"
        }),
    password: z.string({
            required_error: "La contraseña es requerida"
        }).min(6, {
            message: "La contraseña debe tener al menos 6 caracteres",
        }),
});