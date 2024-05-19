import { create } from 'zustand';
import { getProfileApi, loginApi } from '../api';

export const useAuth = create()((set) => ({
	user: null,

	login: async (params) => {
		const { user, accessToken, refreshToken } = await loginApi(params);
		localStorage.setItem('accessToken', accessToken);
		localStorage.setItem('refreshToken', refreshToken);

		set({ user });
	},

	getProfile: async () => {
		const user = await getProfileApi();
		set({ user });
	},

	logout: () => {
		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');

		set({ user: null });
	},
}));
