import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../feature/authSlice";
import notifReducer from "../feature/penggunaanSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    notif: notifReducer
  },
});

export default store;