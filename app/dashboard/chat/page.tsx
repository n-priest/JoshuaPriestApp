import { ChatInterface } from "../_components/chat-interface";

export default function ChatPage() {
  return (
    <div className="h-screen flex flex-col">
      <div className="p-6 pb-3 border-b border-gray-100">
        <h1 className="text-xl font-bold text-dark">AI Coach</h1>
        <p className="text-sm text-gray-500">Your 24/7 assistant — research, plan, build, organize</p>
      </div>
      <div className="flex-1 overflow-hidden">
        <ChatInterface />
      </div>
    </div>
  );
}
