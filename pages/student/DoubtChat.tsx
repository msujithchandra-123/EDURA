import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { DoubtMessage } from '../../types';
import { geminiService } from '../../services/geminiService';
import { api } from '../../services/api';
import { Card } from '../../components/ui/Card';
import AIAvatar from '../../components/AIAvatar';

const DoubtChat: React.FC = () => {
    const [messages, setMessages] = useState<DoubtMessage[]>([]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [isAiSpeaking, setIsAiSpeaking] = useState(false);

    useEffect(() => {
        const fetchHistory = async () => {
            const history = await api.getDoubtHistory();
            setMessages(history);
        };
        fetchHistory();
    }, []);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: DoubtMessage = {
            id: `msg-${Date.now()}`,
            sender: 'student',
            message: input,
            timestamp: new Date().toISOString()
        };
        
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setIsThinking(true);
        setIsAiSpeaking(false);

        try {
            const aiResponse = await geminiService.getChatResponse(input, messages);
            const aiMessage: DoubtMessage = {
                id: `msg-${Date.now() + 1}`,
                sender: 'ai',
                message: aiResponse,
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, aiMessage]);
            setIsAiSpeaking(true);
            setTimeout(() => setIsAiSpeaking(false), 5000 + aiResponse.length * 50);

        } catch (error) {
            console.error("AI chat failed", error);
            const errorMessage: DoubtMessage = {
                 id: `msg-err-${Date.now()}`,
                 sender: 'ai',
                 message: "I'm having trouble connecting right now. Please try again in a moment.",
                 timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsThinking(false);
        }
    };
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-[calc(100vh-8rem)]">
            {/* Left: History */}
            <div className="lg:col-span-1 hidden lg:block">
                <Card title="History" className="h-full flex flex-col">
                    <ul className="space-y-2 overflow-y-auto flex-1">
                        {messages.filter(m => m.sender === 'student').map((msg, i) => (
                            <li key={i} className="text-sm p-2 rounded bg-gray-100 dark:bg-gray-700 truncate cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600">
                                {msg.message}
                            </li>
                        ))}
                    </ul>
                </Card>
            </div>

            {/* Center: Avatar & Conversation */}
            <div className="lg:col-span-3 flex flex-col items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <div className="flex-1 w-full flex items-center justify-center">
                    <AIAvatar isTalking={isAiSpeaking} className="scale-125 md:scale-150" />
                </div>
                <div className="w-full max-w-3xl text-center p-4 h-48 overflow-y-auto bg-gray-50 dark:bg-gray-900/50 rounded-lg border dark:border-gray-700">
                    {messages.length > 1 ? (
                        messages.slice(-3).map((msg, index) => (
                            <p key={index} className={`mb-2 text-left ${msg.sender === 'student' ? 'text-gray-800 dark:text-white' : 'text-primary-600 dark:text-primary-400'}`}>
                                <span className="font-bold">{msg.sender === 'student' ? 'You' : 'EDURA'}: </span>{msg.message}
                            </p>
                        ))
                    ) : (
                         <p className="text-gray-500 dark:text-gray-400">Your conversation will appear here.</p>
                    )}
                     {isThinking && (
                        <p className="text-left text-primary-600 dark:text-primary-400">
                            <span className="font-bold">EDURA: </span>Thinking...
                        </p>
                    )}
                </div>
            </div>

            {/* Right: Chatbox */}
            <div className="lg:col-span-1">
                 <Card title="Ask a Question" className="h-full flex flex-col justify-end">
                    <div className="flex flex-col space-y-4">
                        <textarea
                            placeholder="Type your question here..." 
                            className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500 min-h-[150px]"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            disabled={isThinking}
                        />
                        <Button onClick={handleSend} disabled={isThinking || !input.trim()}>
                            Send
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default DoubtChat;
