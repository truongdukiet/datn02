import { useState, useEffect } from "react";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          backgroundColor: "#8B5E3C",
          border: "none",
          borderRadius: "50%",
          width: "65px",
          height: "65px",
          cursor: "pointer",
          boxShadow: "0 6px 15px rgba(0,0,0,0.25)",
          transition: "all 0.3s ease",
          zIndex: 9999,

          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
        }}
      >
        <img
          src="http://localhost:8000/storage/chatbot.png"
          alt="Chat"
          style={{
            width: "60%",
            height: "60%",
            objectFit: "cover",
            borderRadius: "50%"
          }}
        />
      </button>

      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "100px",
            right: "24px",
            width: "350px",
            height: "450px",
            border: "1px solid #D4AF37",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
            backgroundColor: "#FAF9F6",
            display: "flex",
            flexDirection: "column",
            zIndex: 9999,
          }}
        >

          <div
            style={{
              backgroundColor: "#4B2E2B",
              color: "white",
              padding: "14px 16px",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            Trợ lý Nội Thất NextGen
          </div>

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
