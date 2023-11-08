import { z } from 'zod'


export const userGenerarQRSchema = z.object({
    glosa: z.string({
            required_error: "La glosa es requerida"
        }),
    amount: z.number({
        required_error: "El monto es requerido",
        invalid_type_error: "El monto debe ser un numero"
    }).min(1, {
        message: "El monto debe ser mayor o igual a 1"
    })
});