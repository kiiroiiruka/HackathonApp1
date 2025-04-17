import { create } from 'zustand';

export type UserInfo = {
  uid: string;
  username: string;
  location: string;
  message: string;
  time: string;
};

type UserInfoState = {
  userInfo: UserInfo;
  setUserInfo: (info: UserInfo) => void;
  updateUsername: (username: string) => void;
  updateLocation: (location: string) => void;
  updateTime: (time: string) => void;
  updateMessage: (message: string) => void;
};

export const useMeInfoStore = create<UserInfoState>((set) => ({
  userInfo: {
    uid: '',
    username: '',
    location: '',
    message: '',
    time: '',
  },
  setUserInfo: (info) => set({ userInfo: info }),
  updateUsername: (username) =>
    set((state) => ({ userInfo: { ...state.userInfo, username } })),
  updateLocation: (location) =>
    set((state) => ({ userInfo: { ...state.userInfo, location } })),
  updateTime: (time) =>
    set((state) => ({ userInfo: { ...state.userInfo, time } })),
  updateMessage: (message) =>
    set((state) => ({ userInfo: { ...state.userInfo, message } })),
}));
