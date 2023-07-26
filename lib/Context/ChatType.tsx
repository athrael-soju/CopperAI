import { createContext } from 'react';

type ChatTypeContextType = {
  chatType: string | null;
  setChatType: React.Dispatch<React.SetStateAction<string | null>>;
};

const ChatTypeContext = createContext<ChatTypeContextType | undefined>(
  undefined
);

export default ChatTypeContext;
