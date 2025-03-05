import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const AppContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    height: 100vh;
    padding: 20px;
    background: linear-gradient(to top, #ffffff, #e7f6d5);
    color: #4a593b;
    max-height: 100%;
    font-family: "Roboto", sans-serif;
`;

const Header = styled.div`
    display: flex;
    justify-content: center;
    gap: 15px;
    padding: 15px;
    background-color: #cbe8a6;
    border-radius: 15px;
    width: 100%;
    max-width: 800px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const ChatTypeButton = styled.button`
    background-color: ${(props) => (props.active ? "#b5d68d" : "#d7efb7")};
    border: none;
    border-radius: 10px;
    padding: 12px 25px;
    font-size: 16px;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;

    &:hover {
        transform: scale(1.1);
        background-color: #c3de98;
    }
`;

const ChatWindow = styled.div`
    flex: 1;
    width: 100%;
    max-width: 800px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 20px;
    background-color: #f0f8e2;
    border: 1px solid #d7efb7;
    border-radius: 15px;
    margin: 20px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    overflow-y: auto;
    min-height: 300px;
`;

const MessagesContainer = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 10px;
    overflow-y: auto;
    max-height: 100%;
`;

const MarkdownMessage = styled(ReactMarkdown)`
    background-color: ${(props) => (props.isUser ? "#cbe8a6" : "#e7f6d5")};
    color: ${(props) => (props.isUser ? "#4a593b" : "#4a593b")};
    padding: 12px;
    border-radius: 12px;
    align-self: ${(props) => (props.isUser ? "flex-end" : "flex-start")};
    max-width: 70%;
    font-size: 14px;
    line-height: 1.4;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);

    h1,
    h2,
    h3 {
        color: #4a593b;
    }

    ul {
        list-style: disc;
        margin-left: 20px;
    }
`;

const MessageInputContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 15px;
    background-color: #e7f6d5;
    border-radius: 15px;
    width: 100%;
    max-width: 800px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
    flex: 1;
    padding: 12px;
    border: 1px solid #cbe8a6;
    border-radius: 8px;
    font-size: 16px;
    outline: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    &:focus {
        border-color: #b5d68d;
    }
`;
const Spinner = styled.div`
    border: 4px solid #e7f6d5;
    border-top: 4px solid #cbe8a6;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
`;

const SendButton = styled.button`
    background-color: #cbe8a6;
    border: none;
    border-radius: 10px;
    padding: 12px 25px;
    font-size: 16px;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;

    &:hover {
        transform: scale(1.1);
        background-color: #b5d68d;
    }
`;

function App() {
    const [chatType, setChatType] = useState("diet"); // 식단 추천 또는 운동 추천
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const sendMessageToBackend = async (message, type) => {
        try {
            const response = await axios.post("http://localhost:5000/chat", {
                message,
                type,
            });
            return response.data.content;
        } catch (error) {
            console.error("Error communicating with backend:", error);
            return "오류가 발생했습니다. 다시 시도해주세요.";
        } finally {
            setLoading(false); // 로딩 종료
        }
    };

    const handleSendMessage = async () => {
        if (input.trim()) {
            const userMessage = { text: input, isUser: true, type: chatType };
            setMessages((prev) => [...prev, userMessage]);
            setInput("");
            setLoading(true);
            const response = await sendMessageToBackend(input, chatType);
            const gptMessage = {
                text: response,
                isUser: false,
                type: chatType,
            };
            setMessages((prev) => [...prev, gptMessage]);
        }
    };

    return (
        <AppContainer>
            <Header>
                <ChatTypeButton
                    active={chatType === "diet"}
                    onClick={() => setChatType("diet")}
                >
                    식단 추천
                </ChatTypeButton>
                <ChatTypeButton
                    active={chatType === "exercise"}
                    onClick={() => setChatType("exercise")}
                >
                    운동 추천
                </ChatTypeButton>
            </Header>

            <ChatWindow>
                <MessagesContainer>
                    {messages
                        .filter((msg) => msg.type === chatType)
                        .map((msg, index) => (
                            <MarkdownMessage
                                key={index}
                                isUser={msg.isUser}
                                remarkPlugins={[remarkGfm]}
                            >
                                {msg.text}
                            </MarkdownMessage>
                        ))}
                    {loading && (
                        <div style={{ alignSelf: "center", margin: "10px 0" }}>
                            <Spinner />
                        </div>
                    )}
                </MessagesContainer>
            </ChatWindow>

            <MessageInputContainer>
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="메시지를 입력하세요..."
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            handleSendMessage();
                        }
                    }}
                />
                <SendButton onClick={handleSendMessage}>보내기</SendButton>
            </MessageInputContainer>
        </AppContainer>
    );
}

export default App;
