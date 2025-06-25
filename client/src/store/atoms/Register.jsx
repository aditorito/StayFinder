import { atom } from "recoil";

export const titleAtom = atom({
    key:"titleAtom",
    default:""
});

export const LongitudeAtom = atom({
    key:"LongitudeAtom",
    default:0
})
export const LatitudeAtom = atom({
    key:"LatitudeAtom",
    default:0
})

export const fromAtom = atom({
    key:"formAtom",
    default:''
})

export const toAtom = atom({
    key:"toAtom",
    default:''
})




export const descriptionAtom = atom({
    key:"descriptionAtom",
    default:""
});

export const locationAtom = atom({
    key:"locationAtom",
    default:{
        type:'Point',
        coordinates: [0, 0],
        address:'',
    }
});

export const pricePerNightAtom = atom({
    key:"pricePerNightAtom",
    default:0
});

export const imagesAtom = atom({
    key: 'imageAtom',
    default:[],
})

export const hostIdAtom = atom({
    key:"hostIdAtom",
    default:""
});

export const availabilityAtom = atom({
    key:"availabilityAtom",
    default:[
        {
        from:"",
        to:""
    },
]
})


