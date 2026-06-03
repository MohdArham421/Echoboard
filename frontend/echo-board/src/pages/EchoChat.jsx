import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import axios from "axios";
import { io } from "socket.io-client";
import {
  PaperAirplaneIcon,
} from "@heroicons/react/24/solid";

import {
  useLocation,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import { useAuth } from "../hooks/useAuth";


const socket = io("http://localhost:5000", {
  transports: ["websocket"],
});

function EchoChat() {
  const { user } = useAuth();

  const location = useLocation();

  const selectedUserFromWall =
    location.state?.selectedUser || null;

  const [selectedUser, setSelectedUser] = useState(null);
  const [chatUsers, setChatUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState({});
  const messagesEndRef = useRef(null);

  const normalizeId = (id) => {
    if (!id) return "";

    if (typeof id === "object") {
      return String(id._id);
    }

    return String(id);
  };

  const createRoomId = (id1, id2) => {
    return [id1, id2].sort().join("_");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);


  useEffect(() => {
    if (!user?._id) return;

    socket.emit(
      "register_user",
      user._id
    );
  }, [user]);


  useEffect(() => {
    socket.on(
      "online_users",
      (users) => {
        setOnlineUsers(users);
      }
    );

    return () => {
      socket.off("online_users");
    };
  }, []);

  useEffect(() => {
    if (!selectedUserFromWall) return;

    setSelectedUser(
      selectedUserFromWall
    );

    setChatUsers((prev) => {
      const exists = prev.find(
        (u) =>
          normalizeId(u._id) ===
          normalizeId(
            selectedUserFromWall._id
          )
      );

      if (exists) return prev;

      return [
        selectedUserFromWall,
        ...prev,
      ];
    });
  }, [selectedUserFromWall]);

  // LOAD SIDEBAR USERS

  useEffect(() => {
    if (!user?._id) return;

    const fetchChats = async () => {
      try {
        const res =
          await axios.get(
            `http://localhost:5000/api/chat/users/${user._id}`
          );

        setChatUsers(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchChats();
  }, [user]);

  // FETCH MESSAGES

  useEffect(() => {
    if (
      !selectedUser ||
      !user?._id
    )
      return;

    const roomId = createRoomId(
      user._id,
      selectedUser._id
    );

    socket.emit("join_room", roomId);

    const fetchMessages =
      async () => {
        try {
          const res =
            await axios.get(
              `http://localhost:5000/api/chat/${roomId}`
            );

          setMessages(res.data);
        } catch (error) {
          console.log(error);
        }
      };

    fetchMessages();
  }, [selectedUser, user]);

  // RECEIVE MESSAGE

  useEffect(() => {
    const receiveMessage = (msg) => {
      setMessages((prev) => {
        const exists = prev.find(
          (m) =>
            normalizeId(m._id) ===
            normalizeId(msg._id)
        );

        if (exists) return prev;

        return [...prev, msg];
      });

      const otherUser =
      normalizeId(msg.senderId?._id || msg.senderId) ===
      normalizeId(user._id)
        ? {
        _id:
          msg.receiverId?._id ||
          msg.receiverId,

        username:
          msg.receiverId?.username ||
          msg.receiverName ||
          "User",
      }
    : {
        _id:
          msg.senderId?._id ||
          msg.senderId,

        username:
          msg.senderId?.username ||
          msg.senderName ||
          "User",
      };

      setChatUsers((prev) => {
        const exists = prev.find(
          (u) =>
            normalizeId(u._id) ===
            normalizeId(otherUser._id)
        );

        if (exists) return prev;

        return [otherUser, ...prev];
      });
    };

    socket.on(
      "receive_private_message",
      receiveMessage
    );

    return () => {
      socket.off(
        "receive_private_message",
        receiveMessage
      );
    };
  }, [user]);

  // SEND MESSAGE

  const handleSend = async (e) => {
    e.preventDefault();

    if (
      !message.trim() ||
      !selectedUser
    )
      return;

    const msgObj = {
      roomId: createRoomId(
        user._id,
        selectedUser._id
      ),

      senderId: user._id,

      senderName: user.username,

      receiverId: selectedUser._id,

      receiverName:
        selectedUser.username,

      text: message.trim(),
    };

    socket.emit(
      "send_private_message",
      msgObj
    );

    setMessage("");
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">

      <Navbar />

      <div className="h-[calc(100vh-72px)] flex">

        {/* SIDEBAR */}

        <div className="w-[320px] bg-[#111827] border-r border-white/10 hidden md:flex flex-col">

          <div className="p-5 border-b border-white/10">
            <h2 className="text-2xl font-bold text-cyan-400">
              Chats
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto">

            {chatUsers.length === 0 ? (
              <div className="p-5 text-gray-500">
                No chats yet
              </div>
            ) : (
              chatUsers.map((chatUser) => {
                const isOnline =
                  onlineUsers[
                    normalizeId(
                      chatUser._id
                    )
                  ];

                return (
                  <div
                    key={chatUser._id}
                    onClick={() =>
                      setSelectedUser(
                        chatUser
                      )
                    }
                    className={`p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition flex items-center gap-3 ${
                      normalizeId(
                        selectedUser?._id
                      ) ===
                      normalizeId(
                        chatUser._id
                      )
                        ? "bg-cyan-700/20"
                        : ""
                    }`}
                  >
                    <div className="relative">

                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center font-bold">
                        {chatUser.username
                          ?.charAt(0)
                          .toUpperCase()}
                      </div>

                      <span
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#111827] ${
                          isOnline
                            ? "bg-green-500"
                            : "bg-gray-500"
                        }`}
                      />
                    </div>

                    <div>
                      <h3 className="font-semibold">
                        {
                          chatUser.username
                        }
                      </h3>

                      <p className="text-xs text-gray-400">
                        {isOnline
                          ? "Online"
                          : "Offline"}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* CHAT AREA */}

        <div className="flex-1 flex flex-col">

          {/* HEADER */}

          <div className="bg-[#111827] border-b border-white/10 px-6 py-4">

            {selectedUser ? (
              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center font-bold">
                  {selectedUser.username
                    ?.charAt(0)
                    .toUpperCase()}
                </div>

                <div>
                  <h2 className="font-bold text-lg">
                    {
                      selectedUser.username
                    }
                  </h2>
                </div>
              </div>
            ) : (
              <div className="text-gray-500">
                Select a chat
              </div>
            )}
          </div>

          {/* MESSAGES */}


            <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-[#0d1117] to-[#111827]">
            
              {/* NO CHAT SELECTED */}
            
              {!selectedUser ? (
            
                <div className="h-full flex flex-col items-center justify-center text-center px-6">
            
                  <div className="w-24 h-24 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6 shadow-2xl shadow-cyan-500/10">
            
                    <div className="text-5xl">
                      💬
                    </div>
            
                  </div>
            
                  <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    Welcome to EchoChat
                  </h1>
            
                  <p className="text-gray-400 max-w-md leading-relaxed">
                    Start real-time conversations with your friends,
                    share ideas, collaborate, and stay connected
                    instantly inside EchoBoard.
                  </p>
            
                  <div className="mt-8 flex gap-3">
            
                    <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300">
                      ⚡ Real-time Messaging
                    </div>
            
                    <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300">
                      🟢 Live Online Status
                    </div>
            
                  </div>
            
                </div>
            
              ) : messages.length === 0 ? (
            
                /* EMPTY CHAT */
            
                <div className="h-full flex flex-col items-center justify-center text-center">
            
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-3xl font-bold shadow-lg shadow-cyan-500/20">
                    {selectedUser.username
                      ?.charAt(0)
                      .toUpperCase()}
                  </div>
            
                  <h2 className="mt-5 text-2xl font-bold">
                    {selectedUser.username}
                  </h2>
            
                  <p className="text-gray-400 mt-2">
                    This conversation is empty.
                  </p>
            
                  <p className="text-gray-500 text-sm mt-1">
                    Send your first message 🚀
                  </p>
            
                </div>
            
              ) : (
            
                /* CHAT MESSAGES */
            
                <div className="space-y-2">
            
                  {messages.map((msg) => {
            
                    // FIXED SENDER ID
                    const senderId =
                      typeof msg.senderId === "object"
                        ? msg.senderId._id
                        : msg.senderId;
            
                    // CHECK MY MESSAGE
                    const isMine =
                      normalizeId(senderId) ===
                      normalizeId(user._id);
            
                    // USERNAME
                    const senderUsername =
                      typeof msg.senderId === "object"
                        ? msg.senderId.username
                        : isMine
                        ? user.username
                        : selectedUser?.username || "User";
            
                    return (
                      <div
                        key={msg._id}
                        className={`flex ${
                          isMine
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`
                            max-w-[75%]
                            px-4 py-3
                            rounded-2xl
                            backdrop-blur-md
                            border
                            shadow-lg
                            transition-all
                            duration-200
                            hover:scale-[1.01]
                            ${
                              isMine
                                ? `
                                  bg-cyan-600
                                  border-cyan-500/30
                                  rounded-br-sm
                                  text-white
                                `
                                : `
                                  bg-white/5
                                  border-white/10
                                  rounded-bl-sm
                                  text-gray-100
                                `
                            }
                          `}
                        >
            
                          {/* USERNAME */}
            
                          <p
                            className={`text-xs mb-1 font-medium ${
                              isMine
                                ? "text-cyan-100"
                                : "text-cyan-300"
                            }`}
                          >
                            {senderUsername}
                          </p>
            
                          {/* MESSAGE */}
            
                          <p className="text-sm leading-relaxed break-words">
                            {msg.text}
                          </p>
            
                          {/* TIME */}
            
                          <p
                            className={`text-[10px] mt-2 text-right ${
                              isMine
                                ? "text-cyan-100/80"
                                : "text-gray-400"
                            }`}
                          >
                            {new Date(
                              msg.createdAt
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
            
                        </div>
                      </div>
                    );
                  })}
            
                </div>
            
              )}
            
              <div ref={messagesEndRef} />
            
            </div>

          {/* INPUT */}

          {selectedUser && (
            <form
              onSubmit={handleSend}
              className="p-4 border-t border-white/10 bg-[#111827] flex gap-2"
            >
              <input
                type="text"
                value={message}
                onChange={(e) =>
                  setMessage(
                    e.target.value
                  )
                }
                placeholder="Type message..."
                className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 outline-none"
              />

              <button
                type="submit"
                className="bg-cyan-700 hover:bg-cyan-600 p-3 rounded-2xl"
              >
                <PaperAirplaneIcon className="h-5 w-5 rotate-90" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default EchoChat;