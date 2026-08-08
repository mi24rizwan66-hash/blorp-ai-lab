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

                    <button class="nav-btn active">◉ CHAT</button>
                    <button class="nav-btn">◇ CODE</button>
                    <button class="nav-btn">◎ VISION</button>
                    <button class="nav-btn">⌁ SYSTEM</button>
                </aside>

                <section class="core">

                    <div class="panel-title">
                        NEURAL CORE
                        <span>LIVE</span>
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
                            <small>CORE LOAD</small>
                            <strong>82%</strong>
                            <div class="meter">
                                <i style="width:82%"></i>
                            </div>
                        </div>

                        <div class="metric">
                            <small>MEMORY</small>
                            <strong>4.2 GB</strong>
                            <div class="meter">
                                <i style="width:64%"></i>
                            </div>
                        </div>

                        <div class="metric">
                            <small>STATUS</small>
                            <strong>STABLE</strong>
                        </div>

                    </div>

                </section>

            </div>

            <footer>
                BLORP AI LAB v0.2
                <span>EXPERIMENTAL ENVIRONMENT</span>
            </footer>

        </div>
    `;

});