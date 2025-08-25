import { useState, useEffect, useRef } from "react";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  // Đã loại bỏ trạng thái kéo và vị trí
  const position = useRef({ x: 24, y: 24 }); // Vẫn giữ vị trí tham chiếu nhưng không thay đổi

  const robotIcon = (
    <svg
      viewBox="0 0 100 100"
      style={{
        width: "60%",
        height: "60%",
        transition: "all 0.3s ease",
        transform: isHovered ? "rotate(5deg) scale(1.1)" : "none",
        filter: isHovered ? "drop-shadow(0 0 8px rgba(255, 215, 0, 0.7))" : "none",
      }}
    >
      <defs>
        <linearGradient id="metalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="30%" stopColor="#FFD700" stopOpacity="1" />
          <stop offset="70%" stopColor="#FFEC8B" stopOpacity="1" />
          <stop offset="100%" stopColor="#DAA520" stopOpacity="1" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
          <feOffset in="blur" dx="2" dy="2" result="offsetBlur" />
          <feMerge>
            <feMergeNode in="offsetBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect x="25" y="20" width="50" height="55" rx="10" fill="url(#metalGradient)" stroke="#8B5E3C" strokeWidth="2" filter="url(#shadow)" />
      <rect x="30" y="30" width="40" height="20" rx="5" fill="#1a1a1a" />
      <rect x="32" y="32" width="36" height="16" rx="3" fill="#00bfff" />
      <circle cx="45" cy="37" r="1.5" fill="#ffffff" />
      <circle cx="55" cy="37" r="1.5" fill="#ffffff" />
      <rect x="40" y="42" width="20" height="2" rx="1" fill="#ffffff" />
      <line x1="40" y1="20" x2="35" y2="10" stroke="#8B5E3C" strokeWidth="2" />
      <line x1="60" y1="20" x2="65" y2="10" stroke="#8B5E3C" strokeWidth="2" />
      <circle cx="35" cy="10" r="3" fill="#FF4500" />
      <circle cx="65" cy="10" r="3" fill="#FF4500" />
      <circle cx="35" cy="60" r="3" fill="#4B2E2B" />
      <circle cx="50" cy="60" r="3" fill="#4B2E2B" />
      <circle cx="65" cy="60" r="3" fill="#4B2E2B" />
      <rect x="30" y="75" width="40" height="5" rx="2" fill="#8B5E3C" />
      <rect x="20" y="80" width="60" height="5" rx="2" fill="#8B5E3C" />
    </svg>
  );

  return (
    <div>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: "fixed",
          bottom: "24px", // Cố định ở góc dưới bên phải
          right: "24px",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          flexDirection: "row-reverse",
          gap: "10px",
          cursor: "pointer", // Đổi từ grab sang pointer vì không kéo được nữa
        }}
      >
        <div
          style={{
            backgroundColor: "#FAF9F6",
            color: "#020202ff",
            padding: "8px 16px",
            borderRadius: "16px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            fontSize: "14px",
            fontWeight: "bold",
            transition: "all 0.3s ease-out",
            transform: isOpen ? "translateX(100px)" : "translateX(0)",
            opacity: isOpen ? "0" : "1",
            whiteSpace: "nowrap",
            pointerEvents: isOpen ? "none" : "auto",
          }}
        >
              Trợ lý AI

        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            backgroundColor: "#ffffffff",
            border: "none",
            borderRadius: "60%",
            width: "80px",
            height: "80px",
            cursor: "pointer",
            boxShadow: isHovered
              ? "0 15px 20px rgba(0,0,0,0.35), 0 0 20px rgba(255, 200, 0, 0.6)"
              : "0 15px 15px rgba(0,0,0,0.25)",
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            transform: isHovered ? "translateY(-5px)" : "none",
          }}
        >
          {robotIcon}
          {isHovered && (
            <div
              style={{
                position: "absolute",
                top: "-5px",
                left: "-5px",
                right: "-5px",
                bottom: "-5px",
                borderRadius: "50%",
                border: "2px solid rgba(255, 215, 0, 0.4)",
                animation: "pulse 1.5s infinite",
                zIndex: -1,
              }}
            />
          )}
        </button>
      </div>

      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "100px", // Hiển thị phía trên nút chatbot
            right: "24px",
            width: "350px",
            height: "450px",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
            backgroundColor: "#FAF9F6",
            display: "flex",
            flexDirection: "column",
            zIndex: 9999,
            animation: "slideIn 0.3s ease-out",
          }}
        >
          <div className="chat-container">
            <div
              className="chat-header"
            >
              <svg width="25" height="25" viewBox="0 0 24 24">
                <rect x="6" y="4" width="12" height="8" rx="2" fill="#FFD700" />
                <rect x="4" y="12" width="16" height="8" rx="2" fill="#FFD700" />
                <circle cx="9" cy="8" r="1" fill="#333" />
                <circle cx="15" cy="8" r="1" fill="#333" />
                <circle cx="9" cy="16" r="1" fill="#333" />
                <circle cx="15" cy="16" r="1" fill="#333" />
              </svg>
          Next Gen
            </div>
          </div>
          <iframe
            src="https://www.chatbase.co/chatbot-iframe/DAmb9BsvS0IcV4R_4yauW"
            style={{
              flex: 1,
              border: "none",
              width: "100%",
              height: "100%",
              borderRadius: "0 0 16px 16px",
            }}
            frameBorder="0"
          ></iframe>
        </div>
      )}

      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.05); opacity: 0.4; }
            100% { transform: scale(1); opacity: 0.8; }
          }
          @keyframes slideIn {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }

          .chat-container {
            position: relative;
            padding: 1px;
            border-radius: 16px;
            overflow: hidden;
          }

          .chat-container::before {
            content: "";
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: conic-gradient(from 0deg, #FFD700, #FFEC8B, #DAA520, #FFD700);
            background-size: 100% 100%;
            animation: borderRotate 4s linear infinite;
            z-index: -1;
            border-radius: 18px;
            padding: 2px;
          }

          .chat-container .chat-header {
            background-color: #4B2E2B;
            color: white;
            padding: 14px 16px;
            font-weight: bold;
            font-size: 16px;
            display: flex;
            align-items: center;
            gap: 10px;
            cursor: default;
            border-top-right-radius: 14px;
            border-top-left-radius: 14px;
          }

          @keyframes borderRotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}
