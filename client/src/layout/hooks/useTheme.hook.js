import { create } from 'zustand';

export const useTheme = create()((set) => ({
	mode: 'light',
	getTheme: () => {
		const theme = localStorage.getItem('theme');
		if (theme) {
			set({ mode: theme === 'dark' ? 'dark' : 'light' });
		}
	},
	toggleTheme: () => {
		set((state) => {
			localStorage.setItem('theme', state.mode === 'light' ? 'dark' : 'light');

			return {
				mode: state.mode === 'light' ? 'dark' : 'light',
			};
		});
	},
}));
