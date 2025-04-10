import { isValidObjectId } from "mongoose"
export const validId = (idParam) => {
    return isValidObjectId(idParam)

}


export const capitalize = (s) => {
    return (s && String(s[0]).toUpperCase() + String(s).slice(1))
}
export const lowerCase = (s) => { return (s && String(s[0]).toLowerCase() + String(s).slice(1)) }

