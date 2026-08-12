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

                    <button class="nav-btn active" id="chatTab">
                        ◉ CHAT
                    </button>

                    <button class="nav-btn" id="codeTab">
                        ◇ CODE
                    </button>

                    <button class="nav-btn" id="visionTab">
                        ◎ VISION
                    </button>

                    <button class="nav-btn">
                        ⌁ SYSTEM
                    </button>

                </aside>


                <section class="core">

                    <div class="panel-title">
                        NEURAL CORE
                        <span>QWEN 2.5 : 3B</span>
                    </div>

                    <div id="chatBox" style="
                        height:350px;
                        border:1px solid #222;
                        padding:20px;
                        overflow-y:auto;
                        margin-bottom:15px;
                    ">

                        <div style="color:#00ff88;">
                            BLORP › Neural core initialized.
                        </div>

                        <div style="color:#666; margin-top:8px;">
                            BLORP › Qwen 2.5 Coder 3B connected.
                        </div>

                    </div>


                    <div style="
                        display:flex;
                        gap:10px;
                    ">

                        <input
                            id="prompt"
                            type="text"
                            placeholder="Talk to BLORP..."
                            style="
                                flex:1;
                                background:#0a0a0a;
                                border:1px solid #222;
                                color:white;
                                padding:15px;
                                font-family:monospace;
                                outline:none;
                            "
                        >

                        <button
                            id="sendBtn"
                            style="
                                margin:0;
                            "
                        >
                            SEND
                        </button>

                    </div>

                </section>

            </div>


            <footer>
                BLORP AI LAB v0.2
                <span>LOCAL AI ENVIRONMENT</span>
            </footer>

        </div>
    `;


    const prompt = document.getElementById("prompt");
    const sendBtn = document.getElementById("sendBtn");
    const chatBox = document.getElementById("chatBox");


    async function sendMessage() {

        const message = prompt.value.trim();

        if (!message) return;


        chatBox.innerHTML += `
            <div style="margin-top:20px;">
                <span style="color:white;">YOU ›</span>
                ${message}
            </div>
        `;

        prompt.value = "";

        chatBox.innerHTML += `
            <div id="thinking" style="
                color:#00ff88;
                margin-top:10px;
            ">
                BLORP › THINKING...
            </div>
        `;

        chatBox.scrollTop = chatBox.scrollHeight;


        try {

            const response = await fetch(
                "http://localhost:3000/api/chat",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        message: message
                    })
                }
            );


            const data = await response.json();


            document.getElementById("thinking").remove();


            chatBox.innerHTML += `
                <div style="
                    margin-top:20px;
                    color:#00ff88;
                ">
                    BLORP ›
                </div>

                <div style="
                    margin-top:6px;
                    color:#ddd;
                    white-space:pre-wrap;
                ">
                    ${data.response}
                </div>
            `;


        } catch (error) {

            document.getElementById("thinking").remove();

            chatBox.innerHTML += `
                <div style="
                    margin-top:20px;
                    color:#ff4444;
                ">
                    BLORP › CONNECTION ERROR
                </div>

                <div style="color:#777;">
                    Backend is not responding.
                </div>
            `;

            console.error(error);
        }


        chatBox.scrollTop = chatBox.scrollHeight;
    }


    sendBtn.addEventListener("click", sendMessage);


    prompt.addEventListener("keydown", (event) => {

        if (event.key === "Enter") {
            sendMessage();
        }

    });

});
