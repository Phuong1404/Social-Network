import { createContext, useContext } from 'react';
import { getConversationInfo } from '../utils';
import { useAuth } from '@/views/auth/hooks';

const ConversationContext = createContext(null);

export const ConversationProvider = ConversationContext.Provider;
export const useConversationContext = () => {
	const context = useContext(ConversationContext);
	const { authUser } = useAuth();

	if (!context) {
		throw new Error('useConversationContext must be used within an ConversationProvider');
	}

	return { ...context, info: getConversationInfo(context.conversation, authUser) };
};
