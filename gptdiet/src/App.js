import React, { useState } from "react";
import styled from "styled-components";

const AppContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    height: 100vh;
    padding: 20px;
    background: linear-gradient(to bottom, #ffffff, #e7f6d5);
    color: #4a593b;
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
    max-height: 600px;
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

const Message = styled.div`
    background-color: ${(props) => (props.isUser ? "#cbe8a6" : "#e7f6d5")};
    color: ${(props) => (props.isUser ? "#4a593b" : "#4a593b")};
    padding: 12px;
    border-radius: 12px;
    align-self: ${(props) => (props.isUser ? "flex-end" : "flex-start")};
    max-width: 70%;
    font-size: 14px;
    line-height: 1.4;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
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
    const [chatType, setChatType] = useState("diet"); // diet or exercise
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const handleSendMessage = () => {
        if (input.trim()) {
            setMessages([
                ...messages,
                { text: input, isUser: true, type: chatType },
            ]);
            setInput("");

            const response =
                chatType === "diet"
                    ? "여기 식단 추천이 있습니다! 🥗"
                    : "여기 운동 추천이 있습니다! 💪";
            setTimeout(() => {
                setMessages((prev) => [
                    ...prev,
                    { text: response, isUser: false, type: chatType },
                ]);
            }, 500);
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
                            <Message key={index} isUser={msg.isUser}>
                                {msg.text}
                            </Message>
                        ))}
                </MessagesContainer>
            </ChatWindow>

            <MessageInputContainer>
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="메시지를 입력하세요..."
                />
                <SendButton onClick={handleSendMessage}>보내기</SendButton>
            </MessageInputContainer>
        </AppContainer>
    );
}

export default App;
