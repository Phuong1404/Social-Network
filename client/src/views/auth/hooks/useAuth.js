import { create } from 'zustand';
import { loginApi, loginTokenApi, updateProfileApi } from '../api';

export const useAuth = create((set, get) => ({
	authUser: null,

	setAuthUser: (user) => set({ authUser: user }),

	login: async (data) => {

		if (!data) {
			const user = await loginTokenApi();



			set({ authUser: user });
		}


		else {
			const { user, accessToken, refreshToken } = await loginApi(data);


			localStorage.setItem('accessToken', accessToken);
			localStorage.setItem('refreshToken', refreshToken);



			set({ authUser: user });
		}
	},

	logout: () => {

		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');


		set({ authUser: null });
	},

	updateAuthUser: async (data, optimisticData) => {

		const prev = get().authUser;

		if (prev) {

			optimisticData ??= {
				...data,


			};


			set({ authUser: { ...prev, ...optimisticData } });
		}

		try {

			const user = await updateProfileApi(data);
			set({ authUser: user });
		} catch (error) {

			set({ authUser: prev });
			throw error;
		}
	},
}));
