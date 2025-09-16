import bycrypt from 'bcrypt';
import { text } from 'stream/consumers';


export const hashText = (text: string): string => {
    const textHash = bycrypt.hashSync(text, Number(process.env.SALT) as number)
    return textHash
}


export const compareText = (text: string, hashed: string): boolean => {
    return bycrypt.compareSync(text, hashed)
}