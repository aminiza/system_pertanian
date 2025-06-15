import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    visible: true,
    type: null,
    message: "",
    persintent: false
};

const notifSlice = createSlice({
    name: "notif",
    initialState,
    reducers: {
        showNotif: (state, action) => {
            state.visible = true;
            state.type = action.payload.type;
            state.message = action.payload.message;
            state.persintent = action.payload.persistent;
        },
        clearNotif: (state) => {
            state.visible = false;
            state.type = null;
            state.message = "";
        }
    }
})

export const {showNotif, clearNotif} = notifSlice.actions;
export default notifSlice.reducer;