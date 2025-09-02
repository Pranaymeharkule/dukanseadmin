import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import axios from "axios";
import socketService from "../../services/SocketService";

const API_BASE = `${process.env.REACT_APP_BACKEND_API_BASEURL}/adminSupport`;

export default function HelpSupportChat() {
  const navigate = useNavigate();
  const { ticketId } = useParams(); // MUST be the ticket document _id
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");
  const [input, setInput] = useState("");

  const token = localStorage.getItem("admin_token") || "";
  const adminId = localStorage.getItem("admin_id") || "admin"; // Adjust based on your app
  const axiosConfig = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

  const isMongoId = (id) => /^[a-f\d]{24}$/i.test(id);

  // ✅ Fetch old messages from API
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      setErrorText("");

      if (!ticketId) {
        setErrorText('No ":ticketId" in the URL.');
        setLoading(false);
        return;
      }
      if (!isMongoId(ticketId)) {
        setErrorText(
          `The ":ticketId" must be a valid 24-char ObjectId. You passed: ${ticketId}`
        );
        setLoading(false);
        return;
      }

      try {
        const url = `${API_BASE}/getTicketMessages/${ticketId}`;
        const res = await axios.get(url, axiosConfig);
        const data = Array.isArray(res.data?.messages) ? res.data.messages : [];
        setMessages(data);
      } catch (err) {
        setErrorText(
          err?.response?.data?.message ||
            err?.response?.data?.error ||
            err.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [ticketId]); // eslint-disable-line

  // ✅ Setup Socket.IO connection and listeners
  useEffect(() => {
    if (!socketService.socket) {
      socketService.initializeConnection({ userId: adminId });
    }

    // Join chat room
    socketService.emitEvent("joinChat", { chatId: ticketId });
    console.log(`✅ Joined chat room: ${ticketId}`);

    // Listen for new messages
    socketService.onEvent("message", (data) => {
      console.log("📩 New message received:", data);
      setMessages((prev) => [...prev, data]);
    });

    // Cleanup on unmount
    return () => {
      socketService.offEvent("message");
      socketService.disconnect();
    };
  }, [ticketId, adminId]);

  // ✅ Send message through socket
  const handleSendMessage = () => {
    if (!input.trim()) return;

    const newMessage = {
      chatId: ticketId,
      senderType: "support", // Adjust if dynamic
      content: input,
    };

    // Emit event to socket server
    socketService.emitEvent("sendMessage", newMessage);

    // Optimistic UI update
    setMessages((prev) => [...prev, { ...newMessage, createdAt: new Date() }]);
    setInput("");
  };

  // ✅ Mark ticket as resolved
  const handleMarkResolved = async () => {
    setErrorText("");
    if (!isMongoId(ticketId)) {
      setErrorText("Cannot resolve: invalid ticket _id.");
      return;
    }
    try {
      await axios.put(`${API_BASE}/reSolve/${ticketId}`, {}, axiosConfig);
      alert("Ticket marked as resolved.");
    } catch (err) {
      setErrorText(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err.message
      );
    }
  };

  const isSupport = (type) => String(type || "").toLowerCase() === "support";

  return (
    <div className="bg-gray-100 min-h-screen p-3 md:p-4">
      {/* Header */}
      <div className="bg-white p-3 md:p-4 rounded-md shadow mb-4 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="mr-3 text-xl text-gray-600 hover:text-gray-800"
        >
          <FiArrowLeft />
        </button>
        <h2 className="text-lg md:text-xl font-semibold text-gray-800">
          Help & Support Chat
        </h2>
      </div>

      {/* Ticket ID + Error */}
      <div className="bg-white p-3 md:p-4 rounded-md shadow mb-4 text-sm md:text-base">
        <p className="text-gray-700">
          Ticket _id: <span className="font-semibold">{ticketId}</span>
        </p>
        {errorText ? (
          <p className="mt-2 text-red-600">Error: {errorText}</p>
        ) : null}
      </div>

      {/* Chat Section */}
      <div className="bg-white rounded-md shadow flex flex-col h-[70vh] md:h-[70vh]">
        <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4">
          {loading ? (
            <p className="text-center text-gray-500">Loading messages...</p>
          ) : messages.length === 0 ? (
            <p className="text-center text-gray-500">No messages found.</p>
          ) : (
            messages.map((msg, index) => (
              <div
                key={msg._id || index}
                className={`flex items-start space-x-2 md:space-x-3 ${
                  isSupport(msg.senderType) ? "justify-end" : ""
                }`}
              >
                {!isSupport(msg.senderType) && (
                  <img
                    src="/avatar1.png"
                    alt="User"
                    className="w-6 h-6 md:w-8 md:h-8 rounded-full"
                  />
                )}

                <div className="flex flex-col">
                  <div
                    className={`p-2 md:p-3 rounded-lg max-w-[250px] md:max-w-xs break-words ${
                      isSupport(msg.senderType)
                        ? "bg-orange-500 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    <p className="text-xs font-semibold mb-1">
                      {msg.senderType}
                    </p>
                    <p>{msg.content}</p>
                  </div>
                  <p className="text-xs md:text-sm text-gray-400 mt-1 text-right">
                    {msg.createdAt
                      ? new Date(msg.createdAt).toLocaleTimeString()
                      : ""}
                  </p>
                </div>

                {isSupport(msg.senderType) && (
                  <img
                    src="/avatar2.png"
                    alt="Support"
                    className="w-6 h-6 md:w-8 md:h-8 rounded-full"
                  />
                )}
              </div>
            ))
          )}
        </div>

        {/* Input & Buttons */}
        <div className="p-2 md:p-3 border-t flex flex-col md:flex-row items-center gap-2 md:gap-3">
          <input
            type="text"
            placeholder="Message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border border-gray-300 rounded-md px-2 md:px-3 py-2 md:py-2 text-sm md:text-base focus:outline-none focus:ring focus:border-orange-400 w-full"
          />
          <button
            type="button"
            onClick={handleSendMessage}
            className="w-full md:w-auto bg-blue-500 text-white px-4 py-2 rounded-md text-sm md:text-base"
          >
            Send
          </button>
          <button
            type="button"
            onClick={handleMarkResolved}
            className="w-full md:w-auto bg-[#FEBC1D] text-red-600 px-4 py-2 rounded-md text-sm md:text-base"
          >
            Mark Resolved
          </button>
        </div>
      </div>
    </div>
  );
}
