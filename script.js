// =====================================================
// BLORP AI LAB
// FRONTEND SCRIPT
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    // -------------------------------------------------
    // ENTER LAB
    // -------------------------------------------------

    const enterBtn = document.getElementById("enterBtn");

    if (enterBtn) {

        enterBtn.addEventListener("click", () => {

            document.body.innerHTML = `

                <div class="lab-screen">

                    <header class="topbar">

                        <div class="logo">
                            BLORP<span>_</span>
                        </div>

                        <div class="core-status">
                            <span class="dot"></span>
                            NEURAL CORE ONLINE
                        </div>

                    </header>


                    <div class="dashboard">

                        <aside class="sidebar">

                            <div class="side-title">
                                EXPERIMENTS
                            </div>

                            <button class="nav-btn active">
                                ◉ CHAT
                            </button>

                            <button class="nav-btn">
                                ◇ CODE
                            </button>

                            <button class="nav-btn">
                                ◎ VISION
                            </button>

                            <button class="nav-btn">
                                ⌁ SYSTEM
                            </button>

                        </aside>


                        <section class="core">

                            <div class="panel-title">

                                <span>
                                    NEURAL CORE
                                </span>

                                <span>
                                    LIVE
                                </span>

                            </div>


                            <div class="neural">

                                <div class="node n1"></div>
                                <div class="node n2"></div>
                                <div class="node n3"></div>
                                <div class="node n4"></div>
                                <div class="node n5"></div>
                                <div class="node n6"></div>
                                <div class="node n7"></div>

                            </div>


                            <div class="metrics">

                                <div class="metric">

                                    <small>
                                        CORE LOAD
                                    </small>

                                    <strong>
                                        82%
                                    </strong>

                                    <div class="meter">
                                        <i style="width:82%"></i>
                                    </div>

                                </div>


                                <div class="metric">

                                    <small>
                                        MEMORY
                                    </small>

                                    <strong>
                                        4.2 GB
                                    </strong>

                                    <div class="meter">
                                        <i style="width:64%"></i>
                                    </div>

                                </div>


                                <div class="metric">

                                    <small>
                                        STATUS
                                    </small>

                                    <strong>
                                        STABLE
                                    </strong>

                                </div>

                            </div>


                            <!-- CHAT AREA -->

                            <div class="chat-box">

                                <div
                                    class="chat-output"
                                    id="chatOutput"
                                >

                                    <div>
                                        BLORP AI CORE READY.
                                    </div>

                                    <div>
                                        Ask me something...
                                    </div>

                                </div>


                                <div class="chat-input">

                                    <input
                                        id="aiInput"
                                        type="text"
                                        placeholder="Talk to BLORP..."
                                        autocomplete="off"
                                    />

                                    <button id="sendBtn">
                                        SEND
                                    </button>

                                </div>

                            </div>

                        </section>

                    </div>


                    <footer>

                        <span>
                            BLORP AI LAB v0.2
                        </span>

                        <span>
                            EXPERIMENTAL ENVIRONMENT
                        </span>

                    </footer>

                </div>

            `;


            // Start BLORP chat
            setupChat();

        });

    }

});


// =====================================================
// BLORP CHAT SYSTEM
// =====================================================

function setupChat() {

    const input = document.getElementById("aiInput");
    const sendBtn = document.getElementById("sendBtn");
    const chatOutput = document.getElementById("chatOutput");


    // Safety check
    if (!input || !sendBtn || !chatOutput) {

        console.error("BLORP: Chat elements not found.");

        return;

    }


    // -------------------------------------------------
    // SEND MESSAGE
    // -------------------------------------------------

    async function sendMessage() {

        const message = input.value.trim();


        // Empty message
        if (!message) {
            return;
        }


        // Display user message

        chatOutput.innerHTML += `

            <div class="user-message">

                <span style="color:white;">
                    YOU >
                </span>

                ${escapeHTML(message)}

            </div>

        `;


        // Clear input

        input.value = "";


        // Disable button

        sendBtn.disabled = true;


        // Thinking message

        const thinking = document.createElement("div");

        thinking.id = "thinking";

        thinking.style.color = "#00ff88";

        thinking.style.marginTop = "10px";

        thinking.innerHTML =
            "BLORP > THINKING...";


        chatOutput.appendChild(thinking);


        scrollChat();


        try {

            // -------------------------------------------------
            // CONNECT TO NODE BACKEND
            // -------------------------------------------------

            const response = await fetch(
                "http://localhost:3000/api/generate",
                {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        prompt: message
                    })

                }
            );


            // Backend HTTP error

            if (!response.ok) {

                throw new Error(
                    "Backend returned HTTP " +
                    response.status
                );

            }


            const data = await response.json();


            // Remove thinking

            thinking.remove();


            // -------------------------------------------------
            // FIND AI RESPONSE
            // -------------------------------------------------

            const reply =
                data.response ||
                data.message ||
                data.text ||
                data.output ||
                "BLORP received no response.";


            // Display AI response

            chatOutput.innerHTML += `

                <div
                    class="ai-message"
                    style="margin-top:15px;"
                >

                    <span style="color:#00ff88;">
                        BLORP >
                    </span>

                    ${escapeHTML(reply)}

                </div>

            `;


        } catch (error) {

            console.error(
                "BLORP CONNECTION ERROR:",
                error
            );


            // Remove thinking

            thinking.remove();


            // Display error

            chatOutput.innerHTML += `

                <div
                    style="
                        margin-top:15px;
                        color:#ff5555;
                    "
                >

                    BLORP >

                    CONNECTION ERROR.

                    <br>

                    Make sure the backend is running at:

                    <br>

                    localhost:3000

                </div>

            `;

        }


        // Re-enable button

        sendBtn.disabled = false;

        input.focus();

        scrollChat();

    }


    // -------------------------------------------------
    // BUTTON
    // -------------------------------------------------

    sendBtn.addEventListener(
        "click",
        sendMessage
    );


    // -------------------------------------------------
    // ENTER KEY
    // -------------------------------------------------

    input.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Enter") {

                event.preventDefault();

                sendMessage();

            }

        }
    );


    // Focus input

    input.focus();

}


// =====================================================
// SCROLL CHAT
// =====================================================

function scrollChat() {

    const chatOutput =
        document.getElementById("chatOutput");


    if (chatOutput) {

        chatOutput.scrollTop =
            chatOutput.scrollHeight;

    }

}


// =====================================================
// SECURITY
// Prevent HTML injection in AI/user messages
// =====================================================

function escapeHTML(text) {

    return String(text)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}
