// AiChatBot component.
import React, { Suspense, lazy, useState } from "react";

const ChatBox = lazy(() => import("./ChatBox"));
function AiChatBot() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatBot = () => {
    setIsOpen(!isOpen);
    console.log("Chatbot toggled. Current state:", !isOpen);
  };
  return (
    <div className="fixed bottom-6 right-4 z-50 sm:bottom-8 sm:right-6">
      {isOpen && (
        <div className="absolute bottom-full right-0 mb-4 w-[320px] max-w-[90vw] sm:w-[420px]">
          <Suspense
            fallback={
              <div className="rounded-2xl bg-white px-4 py-5 text-xs text-zinc-500 shadow-2xl">
                Loading assistant...
              </div>
            }
          >
            <ChatBox />
          </Suspense>
        </div>
      )}
      <img
        src="/chatbot-icon.png"
        alt="ai-chatbot"
        className="h-14 w-14 rounded-full bg-white p-2 shadow-md hover:cursor-pointer sm:h-20 sm:w-20"
        onClick={toggleChatBot}
      />
    </div>
  );
}

export default AiChatBot;
