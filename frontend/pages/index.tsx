import React, {
  Fragment,
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ChatMessage } from '@/types/chat';
import { Document } from 'langchain/document';
import { Message } from '@/types';
import useNamespaces from '@/hooks/useNamespaces';
import { useChats } from '@/hooks/useChats';
import MessageList from '@/components/main/MessageList';
import ChatForm from '@/components/main/ChatForm';
import EmptyState from '@/components/main/EmptyState';
import ActivitySelection from '@/components/main/ActivitySelection';

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const router = useRouter();
  const [query, setQuery] = useState<string>('');
  const [chatId, setChatId] = useState<string>('1');

  const { data: session, status } = useSession({
    required: true,
    // onUnauthenticated: () => router.push('/login'),
    onUnauthenticated: () => {},
  });
  const [returnSourceDocuments, setReturnSourceDocuments] =
    useState<boolean>(false);
  const [modelTemperature, setModelTemperature] = useState<number>(0.5);
  const [userEmail, setUserEmail] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [userImage, setUserImage] = useState<string>('');

  const { namespaces, selectedNamespace, setSelectedNamespace } =
    useNamespaces(userEmail);

  const {
    chatList,
    selectedChatId,
    setSelectedChatId,
    createChat,
    deleteChat,
    chatNames,
    updateChatName,
  } = useChats(selectedNamespace, userEmail);

  const nameSpaceHasChats = chatList.length > 0;

  const [error, setError] = useState<string | null>(null);
  const [messageState, setMessageState] = useState<{
    messages: ChatMessage[];
    pending?: string;
    history: [string, string][];
    pendingSourceDocs?: Document[];
  }>({
    messages: [
      {
        message: 'Hi, what would you like to know about these documents?',
        type: 'apiMessage',
      },
    ],
    history: [],
  });

  function mapChatMessageToMessage(chatMessage: ChatMessage): Message {
    return {
      ...chatMessage,
      sourceDocs: chatMessage.sourceDocs?.map((doc) => ({
        pageContent: doc.pageContent,
        metadata: { source: doc.metadata.source },
      })),
    };
  }

  const { messages, history } = messageState;

  const messageListRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const fetchChatHistory = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/history?chatId=${selectedChatId}&userEmail=${userEmail}`,
      );
      const data = await response.json();

      const pairedMessages: [any, any][] = [];

      for (let i = 0; i < data.length; i += 2) {
        pairedMessages.push([data[i], data[i + 1]]);
      }

      setMessageState((state) => ({
        ...state,
        messages: [],
        // messages: data?.map((message: any) => ({
        //   type: message.sender === 'user' ? 'userMessage' : 'apiMessage',
        //   message: message.content,
        //   sourceDocs: message.sourceDocs?.map((doc: any) => ({
        //     pageContent: doc.pageContent,
        //     metadata: { source: doc.metadata.source },
        //   })),
        // })),
        history: pairedMessages.map(([userMessage, botMessage]: any) => [
          userMessage.content,
          botMessage?.content || '',
        ]),
      }));
    } catch (error) {
      console.error('Failed to fetch chat history:', error);
    }
  }, [selectedChatId, userEmail]);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      setUserEmail(session.user.email);
      if (session?.user?.name) {
        setUserName(session.user.name);
      }
      if (session?.user?.image) {
        setUserImage(session.user.image);
      }
    }
  }, [status, session]);

  useEffect(() => {
    if (selectedNamespace && chatList.length > 0) {
      setSelectedChatId(chatList[0]);
    }
  }, [selectedNamespace, chatList, setSelectedChatId]);

  useEffect(() => {
    if (selectedChatId) {
      fetchChatHistory();
    }
  }, [selectedChatId, fetchChatHistory]);

  useEffect(() => {
    textAreaRef.current?.focus();
  }, []);

  useEffect(() => {
    fetchChatHistory();
  }, [chatId, fetchChatHistory]);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setError(null);

    if (!query) {
      alert('Please input a question');
      return;
    }

    const question = query.trim();
    setMessageState((state) => ({
      ...state,
      messages: [
        ...state.messages,
        {
          type: 'userMessage',
          message: question,
        },
      ],
    }));

    setQuery('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          history,
          chatId,
          selectedNamespace,
          userEmail,
          returnSourceDocuments,
          modelTemperature,
        }),
      });
      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setMessageState((state) => ({
          ...state,
          messages: [
            ...state.messages,
            {
              type: 'apiMessage',
              message: data.text,
              sourceDocs: data.sourceDocuments,
            },
          ],
          history: [...state.history, [question, data.text]],
        }));
      }

      messageListRef.current?.scrollTo(0, messageListRef.current.scrollHeight);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error) {
        console.error('Server responded with:', error);
      }
      setError('An error occurred while fetching the data. Please try again.');
    }
  }

  const handleEnter = (e: any) => {
    if (e.key === 'Enter' && query) {
      handleSubmit(e);
    } else if (e.key == 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <>
      <div className="h-full">
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog as="div" onClose={setSidebarOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>
            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        <div className="lg h-screen">
          <ActivitySelection />
          <main className="flex flex-col">
            {nameSpaceHasChats && selectedNamespace ? (
              <>
                <div className="overflow-y-auto flex-grow pb-36">
                  <MessageList
                    messages={messages.map(mapChatMessageToMessage)}
                    messageListRef={messageListRef}
                    userImage={userImage}
                    userName={userName}
                  />
                </div>
              </>
            ) : (
              <>
                <EmptyState />
              </>
            )}
            {nameSpaceHasChats && selectedNamespace && (
              <div className="fixed w-full bottom-0 flex bg-gradient-to-t from-gray-800 to-gray-800/0 justify-center lg:pr-72">
                <ChatForm
                  error={error}
                  query={query}
                  textAreaRef={textAreaRef}
                  handleEnter={handleEnter}
                  handleSubmit={handleSubmit}
                  setQuery={setQuery}
                />
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
