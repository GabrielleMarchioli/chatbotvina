import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Stethoscope, Sun, Moon } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Olá! Sou a Assistente Vina, sua assistente médica virtual. Como posso ajudá-lo hoje? Lembre-se: sou apenas um auxiliar e não substituo uma consulta médica presencial.",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // URL da API configurada via variável de ambiente
  const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
    document.documentElement.classList.toggle("dark");
  };

  // Função para remover citações [X:Y†qualquer_texto] ou 【X:Y†qualquer_texto】
  const cleanResponse = (text: string) => {
    console.log("Resposta bruta:", text); // Log para depuração
    return text
      .replace(/(\[\d+:\d+†[\w_]+\]|\【\d+:\d+†[\w_]+\】)/g, "") // Captura ambos os formatos
      .trim();
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: newMessage }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: cleanResponse(data.response),
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Desculpe, ocorreu um erro ao processar sua pergunta. Tente novamente.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-purple-800/30 border-b border-gray-200 dark:border-purple-700">
        <div className="flex items-center space-x-3">
          <div className="bg-purple-100 dark:bg-purple-600/20 p-2 rounded-lg">
            <Stethoscope className="h-5 w-5 text-purple-600 dark:text-purple-300" />
          </div>
          <div>
            <h1 className="font-semibold text-lg text-purple-800 dark:text-purple-200">Assistente Vina</h1>
            <p className="text-sm text-purple-600 dark:text-purple-400">Assistente Virtual sobre Pré Natal</p>
          </div>
        </div>
        <Button
          onClick={toggleTheme}
          size="sm"
          variant="outline"
          className="bg-gray-200 dark:bg-gray-800 text-purple-600 dark:text-purple-300 border-purple-300 dark:border-purple-600 hover:bg-purple-100 dark:hover:bg-purple-700/50"
        >
          {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </Button>
      </div>

      {/* Área de mensagens */}
      <ScrollArea className="flex-1 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-3xl mx-auto py-6">
          <div className="space-y-6">
            {messages.map((message) => (
              <div key={message.id} className="group">
                <div
                  className={`flex items-start space-x-4 ${
                    message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.sender === "user"
                        ? "bg-purple-600 text-white"
                        : "bg-purple-200 dark:bg-purple-800/50 text-purple-800 dark:text-purple-300"
                    }`}
                  >
                    {message.sender === "user" ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div
                      className={`flex items-center space-x-2 ${
                        message.sender === "user" ? "justify-end" : ""
                      }`}
                    >
                      <span className="font-medium text-sm text-purple-800 dark:text-purple-200">
                        {message.sender === "user" ? "Você" : "Assistente Vina"}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-purple-400">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <div
                      className={`rounded-lg p-3 shadow-sm ${
                        message.sender === "user"
                          ? "bg-purple-100 dark:bg-purple-600/30 text-right"
                          : "bg-gray-100 dark:bg-gray-800/50"
                      }`}
                    >
                      <ReactMarkdown
                        components={{
                          p: ({ node, ...props }) => (
                            <p className="text-sm text-gray-900 dark:text-white leading-relaxed" {...props} />
                          ),
                        }}
                      >
                        {message.text}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center space-x-2 p-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-purple-200 dark:bg-purple-800/50 text-purple-800 dark:text-purple-300">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-purple-600 dark:bg-purple-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-purple-600 dark:bg-purple-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-purple-600 dark:bg-purple-300 rounded-full animate-bounce"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>

      {/* Área de input */}
      <div className="border-t border-gray-200 dark:border-purple-700 p-4 bg-white dark:bg-gray-900">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <Input
              placeholder="Faça uma pergunta sobre saúde..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-16 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-purple-600 focus:ring-purple-500 focus:border-purple-500 min-h-[56px] h-14"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700 text-white rounded-full w-10 h-10"
              disabled={isLoading}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 dark:text-purple-400 mt-2 text-center">
            ⚠️ Este chatbot não substitui consulta médica presencial
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;