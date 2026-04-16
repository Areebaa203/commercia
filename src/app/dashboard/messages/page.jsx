"use client";
import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import { clsx } from "clsx";

const contacts = [
  { id: 1, name: "Alice Smith", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Alice", status: "online", lastMsg: "Hey, can you check order #123?", time: "5m ago", unread: 2 },
  { id: 2, name: "Bob Jones", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Bob", status: "offline", lastMsg: "Thanks for the quick response!", time: "1h ago", unread: 0 },
  { id: 3, name: "Charlie Day", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Charlie", status: "away", lastMsg: "Is this item back in stock?", time: "3h ago", unread: 0 },
  { id: 4, name: "David Miller", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=David", status: "online", lastMsg: "When will my order ship?", time: "5h ago", unread: 1 },
  { id: 5, name: "Eva Green", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Eva", status: "offline", lastMsg: "Great product! Loved it.", time: "1d ago", unread: 0 },
];

const initialMessages = {
  1: [
    { id: 1, sender: "Alice Smith", text: "Hi, I have a question about my recent order.", time: "10:30 AM", isMe: false },
    { id: 2, sender: "Me", text: "Hello Alice! Sure, I'd be happy to help. What's your order number?", time: "10:32 AM", isMe: true },
    { id: 3, sender: "Alice Smith", text: "It's order #1234. I haven't received a tracking number yet.", time: "10:33 AM", isMe: false },
    { id: 4, sender: "Me", text: "Let me check that for you right away. One moment please.", time: "10:35 AM", isMe: true },
    { id: 5, sender: "Alice Smith", text: "Hey, can you check order #123?", time: "10:40 AM", isMe: false },
  ],
  2: [
    { id: 1, sender: "Bob Jones", text: "Do you have this in blue?", time: "Yesterday", isMe: false },
    { id: 2, sender: "Me", text: "Yes, we do! Here is the link.", time: "Yesterday", isMe: true },
    { id: 3, sender: "Bob Jones", text: "Thanks for the quick response!", time: "1h ago", isMe: false },
  ],
  3: [
    { id: 1, sender: "Charlie Day", text: "Is this item back in stock?", time: "3h ago", isMe: false },
  ],
  4: [
    { id: 1, sender: "David Miller", text: "When will my order ship?", time: "5h ago", isMe: false },
  ],
  5: [
    { id: 1, sender: "Eva Green", text: "Great product! Loved it.", time: "1d ago", isMe: false },
  ]
};

export default function MessagesPage() {
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState(initialMessages);
  const [msgInput, setMsgInput] = useState("");
  const messagesEndRef = useRef(null);

  // Set default contact on desktop, but null on mobile to show list first
  useEffect(() => {
    const handleResize = () => {
        if (window.innerWidth >= 768 && !selectedContact) {
            setSelectedContact(contacts[0]);
        }
    };
    
    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [selectedContact]);

  const currentMessages = selectedContact ? (messages[selectedContact.id] || []) : [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages, selectedContact]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!msgInput.trim() || !selectedContact) return;

    const newMessage = {
      id: Date.now(),
      sender: "Me",
      text: msgInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    };

    setMessages(prev => ({
      ...prev,
      [selectedContact.id]: [...(prev[selectedContact.id] || []), newMessage]
    }));
    setMsgInput("");
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100 relative">
      {/* Contacts Sidebar */}
      <div 
        className={clsx(
            "flex flex-col border-r border-gray-100 transition-all duration-300 absolute inset-0 z-10 bg-white md:static md:w-80",
            selectedContact ? "-translate-x-full md:translate-x-0" : "translate-x-0"
        )}
      >
        <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Messages</h2>
            <div className="relative">
                <Icon icon="mingcute:search-line" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="18" />
                <input 
                    type="text" 
                    placeholder="Search messages..." 
                    className="w-full rounded-lg bg-gray-50 py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                />
            </div>
        </div>
        <div className="flex-1 overflow-y-auto">
            {contacts.map((contact) => (
                <div 
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    className={clsx(
                        "flex cursor-pointer items-center gap-3 p-4 transition-colors hover:bg-gray-50 border-b border-gray-50 last:border-0",
                        selectedContact?.id === contact.id ? "bg-blue-50/50 border-r-2 border-r-blue-600" : "border-r-2 border-r-transparent"
                    )}
                >
                    <div className="relative shrink-0">
                        <img src={contact.avatar} alt={contact.name} className="h-10 w-10 rounded-full bg-gray-100 object-cover" />
                        <span className={clsx(
                            "absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white",
                            contact.status === "online" ? "bg-green-500" :
                            contact.status === "away" ? "bg-yellow-500" : "bg-gray-400"
                        )} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-0.5">
                            <h3 className="font-semibold text-gray-900 truncate text-sm">{contact.name}</h3>
                            <span className="text-[10px] text-gray-400">{contact.time}</span>
                        </div>
                        <p className={clsx("text-xs truncate", contact.unread > 0 ? "font-medium text-gray-900" : "text-gray-500")}>
                            {contact.lastMsg}
                        </p>
                    </div>
                    {contact.unread > 0 && (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shrink-0">
                            {contact.unread}
                        </div>
                    )}
                </div>
            ))}
        </div>
      </div>

      {/* Chat Area */}
      <div 
        className={clsx(
            "flex flex-1 flex-col transition-all duration-300 absolute inset-0 bg-white md:static",
            selectedContact ? "translate-x-0" : "translate-x-full md:translate-x-0"
        )}
      >
        {selectedContact ? (
            <>
                {/* Chat Header */}
                <div className="flex items-center justify-between border-b border-gray-100 p-4">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setSelectedContact(null)}
                            className="mr-1 rounded-lg p-1 text-gray-500 hover:bg-gray-100 md:hidden"
                        >
                            <Icon icon="mingcute:arrow-left-line" width="24" />
                        </button>
                        <div className="relative">
                            <img src={selectedContact.avatar} alt={selectedContact.name} className="h-10 w-10 rounded-full bg-gray-100 object-cover" />
                            <span className={clsx(
                                "absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white",
                                selectedContact.status === "online" ? "bg-green-500" :
                                selectedContact.status === "away" ? "bg-yellow-500" : "bg-gray-400"
                            )} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">{selectedContact.name}</h3>
                            <p className="text-xs text-gray-500">
                                {selectedContact.status === "online" ? "Active now" : 
                                selectedContact.status === "away" ? "Away" : "Offline"}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                        <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors hover:text-gray-600 hidden sm:block">
                            <Icon icon="mingcute:phone-line" width="20" />
                        </button>
                        <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors hover:text-gray-600 hidden sm:block">
                            <Icon icon="mingcute:video-line" width="20" />
                        </button>
                        <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors hover:text-gray-600">
                            <Icon icon="mingcute:more-2-fill" width="20" />
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
                    {currentMessages.map((msg, index) => (
                        <div key={index} className={clsx("flex gap-3 max-w-[85%] sm:max-w-[70%]", msg.isMe ? "ml-auto flex-row-reverse" : "")}>
                            {!msg.isMe && (
                                <img src={selectedContact.avatar} alt={selectedContact.name} className="h-8 w-8 rounded-full bg-gray-100 object-cover self-end hidden sm:block" />
                            )}
                            <div className={clsx(
                                "rounded-2xl px-4 py-2.5 shadow-sm text-sm",
                                msg.isMe ? "bg-blue-600 text-white rounded-br-none" : "bg-white text-gray-700 rounded-bl-none ring-1 ring-gray-100"
                            )}>
                                <p>{msg.text}</p>
                                <p className={clsx("text-[10px] mt-1 text-right", msg.isMe ? "text-blue-100" : "text-gray-400")}>{msg.time}</p>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-3 sm:p-4 border-t border-gray-100 bg-white">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-2 rounded-xl bg-gray-50 p-2 ring-1 ring-gray-100">
                        <button type="button" className="p-2 text-gray-400 hover:text-gray-600 transition-colors hidden sm:block">
                            <Icon icon="mingcute:add-circle-line" width="20" />
                        </button>
                        <button type="button" className="p-2 text-gray-400 hover:text-gray-600 transition-colors hidden sm:block">
                            <Icon icon="mingcute:pic-line" width="20" />
                        </button>
                        <button type="button" className="p-2 text-gray-400 hover:text-gray-600 transition-colors sm:hidden">
                            <Icon icon="mingcute:add-line" width="20" />
                        </button>
                        <input 
                            type="text" 
                            placeholder="Type a message..." 
                            className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400 min-w-0"
                            value={msgInput}
                            onChange={(e) => setMsgInput(e.target.value)}
                        />
                        <button type="button" className="p-2 text-gray-400 hover:text-gray-600 transition-colors hidden sm:block">
                            <Icon icon="mingcute:emoji-line" width="20" />
                        </button>
                        <button type="submit" className="rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-700 transition-colors shadow-sm shrink-0">
                            <Icon icon="mingcute:send-plane-fill" width="18" />
                        </button>
                    </form>
                </div>
            </>
        ) : (
            <div className="flex h-full flex-col items-center justify-center text-center p-8 text-gray-500 md:flex hidden">
                <div className="mb-4 rounded-full bg-gray-50 p-6">
                    <Icon icon="mingcute:message-3-line" width="48" className="text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Select a conversation</h3>
                <p className="max-w-xs text-sm">Choose a contact from the left sidebar to start messaging.</p>
            </div>
        )}
      </div>
    </div>
  );
}
