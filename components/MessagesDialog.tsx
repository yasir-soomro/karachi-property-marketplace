import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, ArrowLeft, Building, User } from "lucide-react"

export type Message = {
  id: string;
  sender: "user" | "owner";
  text: string;
  timestamp: Date;
}

export type Conversation = {
  id: string;
  propertyId: string;
  ownerName: string;
  propertyTitle: string;
  messages: Message[];
}

const mockConversations: Conversation[] = [
  {
    id: "conv-1",
    propertyId: "1",
    ownerName: "Hasan Zaidi",
    propertyTitle: "Luxury Apartment in Clifton",
    messages: [
      { id: "m1", sender: "user", text: "Hi, is this apartment still available?", timestamp: new Date(Date.now() - 86400000) },
      { id: "m2", sender: "owner", text: "Hello! Yes, it is still available. Would you like to schedule a visit?", timestamp: new Date(Date.now() - 86000000) },
    ]
  },
  {
    id: "conv-2",
    propertyId: "2",
    ownerName: "Jimmy Gupta",
    propertyTitle: "Spacious House in DHA Phase 6",
    messages: [
      { id: "m3", sender: "user", text: "What is the final price for this house?", timestamp: new Date(Date.now() - 3600000) },
    ]
  }
];

interface MessagesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultConversationId?: string | null;
}

export function MessagesDialog({ open, onOpenChange, defaultConversationId }: MessagesDialogProps) {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations)
  const [activeConvId, setActiveConvId] = useState<string | null>(defaultConversationId || null)
  const [newMessage, setNewMessage] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (defaultConversationId) {
      setActiveConvId(defaultConversationId)
    }
  }, [defaultConversationId])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [conversations, activeConvId])

  const activeConversation = conversations.find(c => c.id === activeConvId)

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeConvId) return;

    setConversations(prev => prev.map(conv => {
      if (conv.id === activeConvId) {
        return {
          ...conv,
          messages: [
            ...conv.messages,
            {
              id: Math.random().toString(36).substr(2, 9),
              sender: "user",
              text: newMessage,
              timestamp: new Date()
            }
          ]
        }
      }
      return conv;
    }))
    setNewMessage("")
    
    // Simulate reply
    setTimeout(() => {
      setConversations(prev => prev.map(conv => {
        if (conv.id === activeConvId) {
          return {
            ...conv,
            messages: [
              ...conv.messages,
              {
                id: Math.random().toString(36).substr(2, 9),
                sender: "owner",
                text: "Thanks for your message! I'll get back to you shortly.",
                timestamp: new Date()
              }
            ]
          }
        }
        return conv;
      }))
    }, 1500)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden h-[80vh] flex flex-col bg-background gap-0">
        <div className="flex h-full w-full">
          {/* Sidebar */}
          <div className={`${activeConvId ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-1/3 border-r h-full`}>
            <DialogHeader className="p-4 border-b">
              <DialogTitle>Messages</DialogTitle>
            </DialogHeader>
            <ScrollArea className="flex-1">
              <div className="flex flex-col">
                {conversations.map(conv => {
                  const lastMessage = conv.messages[conv.messages.length - 1];
                  return (
                    <button
                      key={conv.id}
                      onClick={() => setActiveConvId(conv.id)}
                      className={`flex items-start gap-3 p-4 border-b hover:bg-muted/50 transition-colors text-left ${activeConvId === conv.id ? 'bg-muted/50' : ''}`}
                    >
                      <Avatar className="w-10 h-10 border">
                        <AvatarFallback><User className="w-5 h-5" /></AvatarFallback>
                      </Avatar>
                      <div className="flex-1 overflow-hidden">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-semibold text-sm truncate pr-2">{conv.ownerName}</span>
                          {lastMessage && (
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {formatTime(lastMessage.timestamp)}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate mb-1">
                          {conv.propertyTitle}
                        </p>
                        {lastMessage && (
                          <p className="text-sm truncate text-foreground/80">
                            {lastMessage.sender === 'user' ? 'You: ' : ''}{lastMessage.text}
                          </p>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div className={`${activeConvId ? 'flex' : 'hidden md:flex'} flex-col flex-1 h-full bg-muted/10`}>
            {activeConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b bg-background flex items-center shadow-sm z-10">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="md:hidden mr-2"
                    onClick={() => setActiveConvId(null)}
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                  <Avatar className="w-10 h-10 border mr-3">
                    <AvatarFallback><User className="w-5 h-5" /></AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <h3 className="font-semibold">{activeConversation.ownerName}</h3>
                    <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                      <Building className="w-3 h-3" />
                      {activeConversation.propertyTitle}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4 w-full">
                  <div className="flex flex-col gap-4 max-w-2xl mx-auto">
                    {activeConversation.messages.map((msg, index) => {
                      const isUser = msg.sender === 'user';
                      const showAvatar = index === 0 || activeConversation.messages[index - 1].sender !== msg.sender;
                      
                      return (
                        <div key={msg.id} className={`flex gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
                          {!isUser && (
                            <div className="w-8 shrink-0">
                              {showAvatar && (
                                <Avatar className="w-8 h-8 border">
                                  <AvatarFallback className="text-xs">O</AvatarFallback>
                                </Avatar>
                              )}
                            </div>
                          )}
                          <div className={`flex flex-col max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
                            <div 
                              className={`p-3 rounded-2xl ${
                                isUser 
                                  ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                                  : 'bg-muted border rounded-tl-sm'
                              }`}
                            >
                              <p className="text-sm sm:text-base leading-relaxed">{msg.text}</p>
                            </div>
                            <span className="text-[10px] text-muted-foreground mt-1 px-1">
                              {formatTime(msg.timestamp)}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="p-4 bg-background border-t">
                  <form 
                    className="flex gap-2 max-w-2xl mx-auto"
                    onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                  >
                    <Input 
                      placeholder="Type a message..." 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 bg-muted/50 rounded-full px-4 border-0 focus-visible:ring-1"
                    />
                    <Button 
                      type="submit" 
                      size="icon" 
                      className="rounded-full shrink-0"
                      disabled={!newMessage.trim()}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
                <MessagesSquare className="w-12 h-12 mb-4 opacity-20" />
                <h3 className="text-lg font-medium mb-1">Your Messages</h3>
                <p className="text-sm">Select a conversation from the sidebar to view messages.</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function MessagesSquare(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" />
      <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
    </svg>
  )
}
