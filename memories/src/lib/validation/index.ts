import { z } from "zod"

export const signUpValidationSchema = z.object({
    name: z.string().min(2, {message : 'too short'}), 
    username: z.string().min(2 ,{message: 'too short'}),
    email: z.string().email(), 
    password: z.string().min(0, {message: 'password must be atleast 8 characters'})
})

export const signInValidationSchema = z.object({
    email: z.string().email(), 
    password: z.string().min(0, {message: 'wrong password'})
})