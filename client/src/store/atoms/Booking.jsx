import { atom } from "recoil";

export const checkInAtom = atom({
    key: "checkInAtom",
    default: ''
})

export const checkOutAtom = atom({
    key: "checkOutAtom",
    default: ''
})

export const propertAtom = atom({
    key: "propertyAtom",
    default: ''
})

export const guestAtom = atom({
    key: "guestAtom",
    default: {
        adults: 1,
        children: 0,
        infants: 0,
    }
})

export const totalPriceAtom = atom({
    key:"totalPriceAtom",
    default:0
})