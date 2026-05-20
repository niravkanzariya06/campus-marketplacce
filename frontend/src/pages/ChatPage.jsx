import React, { useEffect, useState, useRef, useCallback } from "react";
import usePageTitle from '../hooks/usePageTitle';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import chatService from '../services/chatService';
import MessageBubble from '../Components/chat/MessageBubble';
import AtmosphericBlooms from '../Components/Theme/AtmosphericBlooms';
import { Skeleton } from "boneyard-js/react";
import { ConversationListFixture, ChatMessagesFixture } from '../bones/fixtures';

const Chat = () => {
  const user = useSelector((state) => state.auth.userData);
  const products = useSelector((state) => state.products.products);
  usePageTitle('Messages');
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage] = useState(false);
  const [typingUser, setTypingUser] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Safe string comparison for user IDs (Postgres int vs Redux string)
  const isCurrentUser = useCallback((id) => {
    if (!user || !id) return false;
    return String(id) === String(user.id);
  }, [user]);

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const hours = diff / (1000 * 60 * 60);
    const days = Math.floor(hours);

    if (hours < 1) return 'Just now';
    if (hours < 2) return '1h ago';
    if (hours < 24) return `${Math.floor(hours)}h ago`;
    if (days === 1) return 'Yesterday';
    if (days < 7) return date.toLocaleDateString('en-IN', { weekday: 'short' });
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  };


  // Load conversations
  useEffect(() => {
    if (!user) return;
    const loadConversations = async () => {
      try {
        setLoading(true);
        const res = await chatService.getUserConversations(user.$id);
        setConversations(res.documents);
      } catch (error) {
        console.error("Failed to load conversations:", error);
      } finally {
        setLoading(false);
      }
    };
    loadConversations();
  }, [user]);

  // Open a conversation and load messages
  const openChat = async (conv) => {
    setActiveConversation(conv);
    setLoadingMessages(true);
    setMessages([]);
    setTypingUser(null);

    try {
      const res = await chatService.getMessages(conv.$id);
      setMessages(res.documents);

      if (conv.unreadCount > 0) {
        await chatService.markAsRead(conv.$id, user.$id);
        setConversations((prev) =>
          prev.map((c) =>
            c.$id === conv.$id ? { ...c, unreadCount: 0 } : c
          )
        );
      }
    } catch (error) {
      console.error("Failed to load messages:", error);
    } finally {
      setLoadingMessages(false);
    }
  };

  // Send a message — optimistic, don't wait for backend
  const sendMessage = async () => {
    if (!activeConversation || !input.trim()) return;

    const textToSend = input;
    setInput("");

    // Optimistic: add message to UI immediately
    const tempId = `temp-${Date.now()}`;
    const tempMsg = {
      $id: tempId,
      isTemp: true,
      $createdAt: new Date().toISOString(),
      conversationId: activeConversation.$id,
      senderId: String(user.id),
      text: textToSend,
    };

    setMessages((prev) => [...prev, tempMsg]);

    // Fire-and-forget to backend via socket
    chatService.sendMessage(activeConversation.$id, user?.$id || user?.id, textToSend).catch((err) => {
      console.error("Failed to send message:", err);
      setMessages((prev) => prev.filter((m) => m.$id !== tempId));
      setInput(textToSend);
    });

    setConversations((prev) =>
      prev.map((c) =>
        c.$id === activeConversation.$id
          ? { ...c, lastMessage: textToSend, $updatedAt: new Date().toISOString() }
          : c
      )
    );
  };

  // Realtime updates — receives echo from backend for ALL messages (own + others)
  useEffect(() => {
    if (!activeConversation || !user) return;
    try {
      const unsub = chatService.subscribeMessages(activeConversation.$id, (event) => {
        const msg = event.payload;
        if (String(msg.conversationId) !== String(activeConversation.$id)) return;

        setMessages((prev) => {
          // Skip if message with same id already exists
          if (prev.some((m) => String(m.$id) === String(msg.$id))) return prev;

          // If it's our own message from backend echo, replace the temp message
          if (isCurrentUser(msg.senderId)) {
            const tempIdx = prev.findIndex((m) => m.isTemp && String(m.text) === String(msg.text));
            if (tempIdx !== -1) {
              const copy = [...prev];
              copy[tempIdx] = msg;
              return copy;
            }
            return [...prev, msg];
          }

          // Other person's message
          return [...prev, msg];
        });
      });
      return () => {
        try {
          if (typeof unsub === "function") unsub();
          else if (unsub && typeof unsub.unsubscribe === "function") unsub.unsubscribe();
        } catch (err) {
          console.error("Failed to unsubscribe from messages:", err);
        }
      };
    } catch (error) {
      console.error("Failed to subscribe to messages:", error);
    }
  }, [activeConversation, user, isCurrentUser]);

  // Scroll effect — fires when messages change or conversation switches
  useEffect(() => {
    containerRef.current?.scrollTo(0, containerRef.current.scrollHeight);
  }, [messages]);

  // Focus input
  useEffect(() => {
    if (activeConversation && !loadingMessages) inputRef.current?.focus();
  }, [activeConversation, loadingMessages]);

  // Filter conversations
  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const otherName = getOtherParticipantName(conv);
    return (
      otherName?.toLowerCase().includes(query) ||
      conv.productName?.toLowerCase().includes(query) ||
      conv.lastMessage?.toLowerCase().includes(query)
    );
  });

  const getOtherParticipantName = (conv) => {
    if (!conv) return "";
    // Use otherUserName directly from service mapping (avoids ID format mismatch)
    if (conv.otherUserName) return conv.otherUserName;
    return conv.sellerName || conv.buyerName || "User";
  };

  const getParticipantRole = (conv) => {
    if (!conv) return "";
    return conv.otherUserRole || (conv.sellerId ? "Buyer" : "Seller");
  };

  const getProductName = (conv) => {
    if (!conv) return "";
    if (conv.productName) return conv.productName;
    const prod = products.find((p) => p.$id === conv.productId);
    return prod?.title || "Product";
  };

  const getProductPrice = (conv) => {
    const prod = products.find((p) => p.$id === conv.productId);
    return prod?.price ? `₹${parseFloat(prod.price).toLocaleString('en-IN')}` : '';
  };

  const getProductImage = (conv) => {
    // Direct from backend mapping
    if (conv?.productImage) return conv.productImage;
    const prod = products.find((p) => p.$id === conv.productId);
    if (prod) return prod?.imageUrl || prod?.images?.[0] || '';
    return '';
  };

  const getOtherParticipantAvatar = (conv) => {
    if (!conv) return '';
    // Use otherUserAvatar directly from service mapping (avoids ID format mismatch)
    if (conv.otherUserAvatar) return conv.otherUserAvatar;
    return conv.buyerId === user?.$id
      ? (conv.sellerAvatar || '')
      : (conv.buyerAvatar || '');
  };

  const getUnreadCount = (conv) => conv.unreadCount || 0;

  return (
    <div className="relative min-h-screen bg-surface-dim py-4 md:py-6">
      <AtmosphericBlooms intensity="subtle" />
      <div className="max-w-7xl mx-auto px-4 lg:px-6 h-full">
        <div className="flex gap-6 h-[calc(100vh-80px)] md:h-[calc(100vh-128px)] rounded-2xl overflow-hidden border border-white/5">
          {/* ========== LEFT PANE: Conversations List ========== */}
          <aside className={`w-full md:w-[400px] h-full flex flex-col bg-surface-container-low/50 backdrop-blur-md shrink-0 rounded-2xl ${activeConversation ? 'hidden md:flex' : 'flex'}`}>
            {/* Inbox Header */}
            <div className="px-6 pt-6 pb-4 flex flex-col gap-4 border-b border-white/5">
              <div className="flex items-center justify-between">
                <h1 className="font-headline text-xl font-extrabold gradient-text tracking-tight">Inbox</h1>
                <button className="w-10 h-10 rounded-full glass flex items-center justify-center text-primary hover:bg-primary/10 transition-colors">
                  <span className="material-symbols-outlined text-lg">edit_square</span>
                </button>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
                <input
                  className="w-full bg-surface-container-highest border-none rounded-2xl pl-11 pr-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/40 outline-none transition-all"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Conversation List */}
            <Skeleton name="conversation-list" loading={loading} fixture={<ConversationListFixture />}>
              <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-3 space-y-2">
                {loading ? null : filteredConversations.length > 0 ? (
                  filteredConversations.map((conv) => {
                    const isActive = activeConversation?.$id === conv.$id;
                    const otherName = getOtherParticipantName(conv);
                    const role = getParticipantRole(conv);
                    const unread = getUnreadCount(conv);
                    const avatarUrl = getOtherParticipantAvatar(conv);

                    return (
                      <div
                        key={conv.$id}
                        onClick={() => openChat(conv)}
                        className={`
                      rounded-2xl p-4 flex gap-4 cursor-pointer transition-all duration-200 border
                      ${isActive
                            ? 'glass-panel border-primary/20 active-glow'
                            : 'hover:bg-white/5 border-transparent'
                          }
                    `}
                      >
                        {/* Avatar with image or fallback */}
                        <div className="relative shrink-0">
                          {avatarUrl ? (
                            <img className="w-12 h-12 rounded-xl object-cover border border-white/10 bg-surface-container-highest" src={avatarUrl} alt={otherName} />
                          ) : (
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-semibold text-on-surface shrink-0 border border-white/10 overflow-hidden glass">
                              {getInitials(otherName)}
                            </div>
                          )}
                          {unread > 0 && (
                            <div className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-secondary text-on-secondary rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-surface-container px-1">
                              {unread}
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <div>
                              <h3 className="font-headline font-bold text-on-surface text-sm truncate">
                                {otherName}
                              </h3>
                              <p className="text-[9px] text-on-surface-variant/50 font-bold uppercase tracking-widest mt-0.5">
                                {role}
                              </p>
                            </div>
                            <span className={`text-[10px] font-bold ${isActive ? 'text-primary uppercase' : 'text-on-surface-variant'}`}>
                              {formatTime(conv.$updatedAt)}
                            </span>
                          </div>
                          <p className={`text-xs truncate ${unread > 0 ? 'text-on-surface font-bold' : 'text-on-surface-variant'}`}>
                            {conv.lastMessage || 'No messages yet'}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : conversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                    <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 mb-3">forum</span>
                    <p className="text-on-surface-variant font-medium mb-1">No conversations yet</p>
                    <p className="text-xs text-on-surface-variant/60">Start chatting from any product listing</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                    <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 mb-3">search_off</span>
                    <p className="text-on-surface-variant">No conversations found</p>
                  </div>
                )}
              </div>
            </Skeleton>
          </aside>

          {/* ========== RIGHT PANE: Chat Window ========== */}
          <section className={`flex-1 flex flex-col h-full bg-surface relative ${!activeConversation ? 'hidden md:flex' : 'flex'}`}>
            {activeConversation ? (
              <>
                {/* Chat Header */}
                <header className="h-20 border-b border-white/5 px-6 flex items-center justify-between glass-panel z-20 shrink-0">
                  <div className="flex items-center gap-4">
                    <button
                      className="md:hidden p-2 text-on-surface-variant hover:bg-white/5 rounded-lg transition-colors"
                      onClick={() => setActiveConversation(null)}
                    >
                      <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        {getOtherParticipantAvatar(activeConversation) ? (
                          <img className="w-10 h-10 rounded-full object-cover border border-primary/30 bg-surface-container-highest" src={getOtherParticipantAvatar(activeConversation)} alt={getOtherParticipantName(activeConversation)} />
                        ) : (
                          <div className="w-10 h-10 rounded-full overflow-hidden border border-primary/30 bg-surface-container-highest flex items-center justify-center text-xs font-semibold text-on-surface">
                            {getInitials(getOtherParticipantName(activeConversation))}
                          </div>
                        )}
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-surface" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="font-headline font-bold text-on-surface leading-tight text-sm">
                            {getOtherParticipantName(activeConversation)}
                          </h2>
                          <span className="px-2 py-0.5 rounded bg-primary/20 text-primary text-[9px] font-extrabold uppercase tracking-widest">
                            {getParticipantRole(activeConversation)}
                          </span>
                        </div>
                        <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Active now</p>
                      </div>
                    </div>
                  </div>
                </header>

                {/* Product Context Card */}
                <div className="px-6 py-3 bg-surface-container/30 border-b border-white/5 z-10 shrink-0">
                  <div className="flex items-center justify-between glass p-3 px-5 rounded-2xl border border-white/5 shadow-2xl product-card-hover transition-all cursor-pointer">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-14 h-14 rounded-xl overflow-hidden shadow-xl border border-white/10 rotate-[-2deg] shrink-0">
                        {getProductImage(activeConversation) ? (
                          <img className="w-full h-full object-cover" src={getProductImage(activeConversation)} alt={getProductName(activeConversation)} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-on-surface-variant/30 bg-surface-container-highest">
                            <span className="material-symbols-outlined">image</span>
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="text-[9px] text-primary font-black uppercase tracking-widest mb-1 block">Product Context</span>
                        <h3 className="font-headline font-bold text-on-surface text-sm truncate">{getProductName(activeConversation)}</h3>
                        <p className="text-xs font-bold text-primary">{getProductPrice(activeConversation)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="hidden sm:block text-right mr-2">
                        <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-tighter">Your Role</p>
                        <p className="text-xs font-black text-on-surface">{activeConversation.myUserRole || "Buyer"}</p>
                      </div>
                      <button
                        className="bg-primary/20 text-primary text-xs font-black px-4 py-2 rounded-xl hover:scale-105 transition-transform border border-primary/20 whitespace-nowrap"
                        onClick={() => navigate(`/product/${activeConversation.productId}`)}
                      >
                        View Listing
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages Stream */}
                <div ref={containerRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-2 custom-scrollbar relative bg-transparent">
                  {/* Decorative background blooms */}
                  <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
                  <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-tertiary/5 rounded-full blur-[120px] pointer-events-none" />

                  <Skeleton name="chat-messages" loading={loadingMessages} fixture={<ChatMessagesFixture />}>
                    {loadingMessages ? null : messages.length > 0 ? (
                      <>
                        {/* Date separator */}
                        <div className="flex justify-center relative z-10">
                          <span className="px-4 py-1 rounded-full bg-surface-container text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                            Today
                          </span>
                        </div>

                        {messages.map((msg, i) => {
                          if (!msg) return null;
                          const isOwn = isCurrentUser(msg.senderId);

                          return (
                            <MessageBubble
                              key={msg.$id || i}
                              isOwn={isOwn}
                              text={msg.text || ""}
                              timestamp={msg.$createdAt}
                            />
                          );
                        })}

                        {/* Typing indicator (demo) */}
                        {typingUser && (
                          <div className="flex items-center gap-3 ml-11">
                            <div className="flex gap-1">
                              <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                              <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                            <span className="text-[10px] text-on-surface-variant font-bold italic">{typingUser} is typing...</span>
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-center text-on-surface-variant/60">
                        <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 mb-3">chat_bubble_outline</span>
                        <p className="text-sm">No messages yet. Start the conversation!</p>
                      </div>
                    )}
                  </Skeleton>
                </div>

                {/* Input Area */}
                <footer className="p-4 md:p-6 bg-surface/80 backdrop-blur-xl border-t border-white/5 shrink-0">
                  <div className="max-w-4xl mx-auto relative flex items-center gap-3">
                    <div className="flex-1 relative">
                      <input
                        ref={inputRef}
                        className="w-full bg-surface-container-highest/50 border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary/10 rounded-2xl px-6 py-4 text-sm text-on-surface placeholder:text-on-surface-variant/40 transition-all outline-none pr-24"
                        placeholder="Type a message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey && !sendingMessage) {
                            e.preventDefault();
                            sendMessage();
                          }
                        }}
                      />
                    </div>
                    <button
                      className="shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-tertiary text-on-primary shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      onClick={sendMessage}
                      disabled={!input.trim()}
                    >
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
                    </button>
                  </div>
                </footer>
              </>
            ) : (
              /* Empty state - no conversation selected */
              <div className="flex flex-col items-center justify-center h-full text-center p-8 relative">
                <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-tertiary/5 rounded-full blur-[100px] pointer-events-none" />
                <div className="relative z-10">
                  <div className="w-24 h-24 rounded-3xl glass flex items-center justify-center mx-auto mb-6 rotate-[-2deg]">
                    <span className="material-symbols-outlined text-5xl text-primary/60">forum</span>
                  </div>
                  <h2 className="font-headline text-2xl font-extrabold text-on-surface mb-2">Your Messages</h2>
                  <p className="text-sm text-on-surface-variant max-w-xs">Select a conversation from the sidebar to start chatting with buyers and sellers.</p>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Chat;
