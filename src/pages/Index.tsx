
import { useState, useRef, useEffect } from "react";
import { MessageSquare, ArrowRight, Mic } from "lucide-react";

interface Message {
  text: string;
  isBot: boolean;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello! I'm your FAQ assistant. How can I help you today?",
      isBot: true,
    },
  ]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize speech recognition
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognitionAPI();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      console.error('Speech recognition not supported');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, isBot: false };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        text: "I understand your question. Let me help you with that.",
        isBot: true,
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 md:p-6">
      <div className="max-w-4xl w-full text-center mb-8 space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">FAQ Assistant</h1>
        <p className="text-muted-foreground">
          Get instant answers to your questions
        </p>
      </div>

      <div className="w-full max-w-4xl glass-morphism rounded-2xl overflow-hidden">
        <div className="h-[500px] overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.isBot ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`flex items-start space-x-2 max-w-[80%] message-animation ${
                  message.isBot
                    ? "bg-secondary"
                    : "bg-white/10"
                } rounded-2xl p-4`}
              >
                {message.isBot && (
                  <MessageSquare className="w-5 h-5 mt-1 shrink-0" />
                )}
                <p className="text-sm md:text-base">{message.text}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={handleSubmit}
          className="border-t border-white/10 p-4 input-animation"
        >
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={toggleListening}
              className={`transition-all duration-200 rounded-xl p-3 ${
                isListening 
                  ? "bg-red-500/80 hover:bg-red-500" 
                  : "bg-white/10 hover:bg-white/20"
              }`}
            >
              <Mic className="w-5 h-5" />
            </button>
            <div className="flex-1 bg-secondary rounded-xl px-4 py-3 flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question here..."
                className="flex-1 bg-transparent text-sm md:text-base focus:outline-none"
              />
              <button
                type="submit"
                className="ml-2 text-white/70 hover:text-white transition-colors"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Index;
