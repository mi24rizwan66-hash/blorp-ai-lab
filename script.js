const enterBtn = document.getElementById("enterBtn");

enterBtn.addEventListener("click", () => {

    document.body.innerHTML = `
        <div class="boot">
            <div class="boot-box">

                <div class="boot-logo">
                    BLORP AI LAB
                </div>

                <div class="boot-status">
                    INITIALIZING NEURAL CORE...
                </div>

                <div class="progress">
                    <div class="progress-bar"></div>
                </div>

                <div class="boot-log">
                    > Loading neural modules...<br>
                    > Establishing core connection...<br>
                    > Calibrating intelligence matrix...<br>
                    > Running system diagnostics...<br>
                    > BLORP CORE: ONLINE
                </div>

            </div>
        </div>
    `;

    setTimeout(() => {
        document.querySelector(".boot-status").textContent =
            "NEURAL CORE ONLINE";
    }, 2500);

});