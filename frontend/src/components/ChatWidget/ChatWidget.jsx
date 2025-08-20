import { useState } from "react";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {/* Nút mở chat */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          backgroundColor: "#8B5E3C", // nâu gỗ sang trọng
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "65px",
          height: "65px",
          fontSize: "26px",
          cursor: "pointer",
          boxShadow: "0 6px 15px rgba(0,0,0,0.25)",
          transition: "all 0.3s ease",
          zIndex: 9999,
        }}
      >
        🛋️
      </button>

      {/* Chatbox */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "100px",
            right: "24px",
            width: "380px",
            height: "520px",
            border: "1px solid #D4AF37", // vàng đồng
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
            backgroundColor: "#FAF9F6", // nền trắng kem
            display: "flex",
            flexDirection: "column",
            zIndex: 9999,
          }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: "#4B2E2B", // nâu đậm
              color: "white",
              padding: "14px 16px",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            🪑 Trợ lý Nội Thất NextGen
          </div>

          {/* Iframe Chatbase (full, có input chat) */}
          <iframe
            src="https://www.chatbase.co/chatbot-iframe/DAmb9BsvS0IcV4R_4yauW"
            style={{
              flex: 1,
              border: "none",
              width: "100%",
              height: "100%",
            }}
            frameBorder="0"
          ></iframe>
        </div>
      )}
    </div>
  );
}
