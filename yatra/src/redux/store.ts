import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice';
import partnerReducer from './partnerSlice';
import adminReducer from './adminSlice';
import vehicleReducer from './vehicleSlice'

export const store = configureStore({
  reducer: {
    user:userReducer,
    partner: partnerReducer,
    admin: adminReducer,
    vehicle: vehicleReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch