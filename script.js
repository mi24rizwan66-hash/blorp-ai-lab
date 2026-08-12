const enterBtn = document.getElementById("enterBtn");

enterBtn.addEventListener("click", () => {

    document.body.innerHTML = `
        <div class="lab-screen">

            <header class="topbar">
                <div class="logo">BLORP<span>_</span></div>

                <div class="core-status">
                    <span class="dot"></span>
                    NEURAL CORE ONLINE
                </div>
            </header>

            <div class="dashboard">

                <aside class="sidebar">
                    <div class="side-title">EXPERIMENTS</div>

                    <button class="nav-btn active" data-mode="chat">◉ CHAT</button>
                    <button class="nav-btn" data-mode="code">◇ CODE</button>
                    <button class="nav-btn" data-mode="vision">◎ VISION</button>
                    <button class="nav-btn" data-mode="system">⌁ SYSTEM</button>
                </aside>

                <section class="core">

                    <div class="panel-title">
                        NEURAL CORE
                        <span>LIVE</span>
                    </div>

                    <div id="chatBox" class="chat-box">
                        <div class="ai-message">
                            <strong>BLORP:</strong>
                            Neural core initialized. Awaiting input...
                        </div>
                    </div>

                    <div class="chat-input-area">
                        <input
                            id="messageInput"
                            type="text"
                            placeholder="Talk to BLORP..."
                            autocomplete="off"
                        />

                        <button id="sendBtn">SEND</button>
                    </div>

                </section>

            </div>

            <footer>
                BLORP AI LAB v0.3
                <span>LOCAL QWEN CORE</span>
            </footer>

        </div>
    `;

    const sendBtn = document.getElementById("sendBtn");
    const messageInput = document.getElementById("messageInput");
    const chatBox = document.getElementById("chatBox");

    async function sendMessage() {

        const message = messageInput.value.trim();

        if (!message) return;

        chatBox.innerHTML += `
            <div class="user-message">
                <strong>YOU:</strong> ${message}
            </div>
        `;

        messageInput.value = "";

        chatBox.innerHTML += `
            <div id="thinking" class="ai-message">
                <strong>BLORP:</strong> Thinking...
            </div>
        `;

        chatBox.scrollTop = chatBox.scrollHeight;

        try {

            const response = await fetch("http://localhost:3000/api/chat", {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    message: message
                })
            });

            const data = await response.json();

            document.getElementById("thinking").remove();

            chatBox.innerHTML += `
                <div class="ai-message">
                    <strong>BLORP:</strong> ${data.reply || data.error}
                </div>
            `;

        } catch (error) {

            document.getElementById("thinking").innerHTML = `
                <strong>BLORP:</strong>
                ⚠️ Cannot connect to local neural core.
            `;

            console.error(error);
        }

        chatBox.scrollTop = chatBox.scrollHeight;
    }

    sendBtn.addEventListener("click", sendMessage);

    messageInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            sendMessage();
        }
    });

    // Navigation
    document.querySelectorAll(".nav-btn").forEach(button => {

        button.addEventListener("click", () => {

            document.querySelectorAll(".nav-btn").forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            const mode = button.dataset.mode;

            if (mode === "chat") {
                messageInput.placeholder = "Talk to BLORP...";
            }

            if (mode === "code") {
                messageInput.placeholder = "Ask BLORP to write code...";
            }

            if (mode === "vision") {
                messageInput.placeholder = "Vision module coming soon...";
            }

            if (mode === "system") {
                messageInput.placeholder = "System diagnostics...";
            }
        });

    });

});
