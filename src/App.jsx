import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";

function App() {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [loading, setLoading] = useState(false); // Состояние загрузки
    const chatHistoryRef = useRef(null); // Реф для прокрутки



    const handleSend = async () => {
        if (!inputValue.trim()) return;

        // Добавляем сообщение пользователя в чат
        setMessages((prevMessages) => [
            ...prevMessages,
            { text: inputValue, sender: "user" },
        ]);
        setInputValue("");

        setLoading(true);

        // Отправляем запрос на сервер
        try {
            console.log(inputValue);
            const response = await axios({
                method: "POST",
                url: "https://7372-176-59-172-99.ngrok-free.app/chat/",
                data:{text: inputValue},
            })
            console.log(response.data);
            const botResponse = response.data.bot_response || "Ошибка: пустой ответ сервера";

            // Добавляем ответ бота в чат
            setMessages((prevMessages) => [
                ...prevMessages,
                { text: botResponse, sender: "bot" },
            ]);
        } catch (error) {
            setMessages((prevMessages) => [
                ...prevMessages,
                { text: "Ошибка соединения с сервером 😢", sender: "bot" },
            ]);
        } finally {
            setLoading(false); // Выключаем индикатор загрузки
        }

        // Очищаем поле ввода
        setInputValue("");
    };

    useEffect(() => {
        // Прокрутка вниз при добавлении нового сообщения
        if (chatHistoryRef.current) {
            chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <>
            <div className="chat-history" ref={chatHistoryRef}>
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`message ${message.sender}`}>
                        {message.text}
                    </div>
                ))}
            </div>
            <div className="input-container">
                <input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Введите ваш вопрос..."/>
                <button onClick={handleSend} disabled={loading}>Отправить</button>
            </div>


        </>
    );
}

export default App;
