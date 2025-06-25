import { atom } from "recoil";

export const isLoggedInAtom = atom({
  key: "isLoggedInAtom",
  default: false, // false until login succeeds
});

export const nameAtom = atom({
    key:"nameAtom",
    default:''
})

export const roleAtom = atom({
    key:'roleAtom',
    default:'guest'
})

export const emailAtom = atom({
    key:"emailAtom",
    default:''
});

export const passwordAtom = atom({
    key:"passwodAtom",
    default:''
})

export const isHostAtom = atom({
    key:"isHostAtom",
    default:false
})
