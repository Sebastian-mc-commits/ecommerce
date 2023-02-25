let authUser = "";

const handleRenderUsers = (root) => {

    authUser = showCurrentUserValues();
    HTML = "";

    const { _, userSender } = root;
    // if (!!!messages.length) return;
    for (let {
        _id: receiver, name, auth
    } of userSender) {

        if (auth.email === authUser.email) continue;
        HTML += `<li data-id-fast-view="${receiver}">${name} <sub>${auth.email}</sub> </li>`;
    }

    HTML = `
            <div class="side-bar-wrapper">
                <input type="checkbox" id="btn" onclick="pushContent()" hidden />
                <label for="btn" class="menu-btn">
                    <p>&#9776</p>
                </label>

                <nav class="sidebar">
                    <div>
                    <p class="title">Fast view</p>
                    </div>
                    <ul class="list-items" id="list_items">
                    ${HTML}
                    </ul>
                </nav>

            </div>

            <div class="side-bar-content">

            <div class='message' id='showMessages'></div>
                <div class="typeMessageDesign">

                    <input type="text" class="typeMessageDesignInput opacity" disabled data-chat required>
                    <span hidden>&#187;</span>
                </div>
            </div>
            `;

    functionsMethods.activeOnChangeFunction();
    functionsMethods.onChangeFunction = () => selectedContactuser(root);
}

const pushContent = () => {
    const sideBarContent = document.querySelector(".side-bar-content");
    console.log("is working");
    sideBarContent.classList.toggle("translate")
}

const selectedContactuser = (root) => {

    const inputChat = document.querySelector("input[data-chat]");
    const messageButton = inputChat.closest("div").querySelector("span");
    const timestamp = new Date(Date.now()).toString();
    const messageContainer = document.querySelector("#showMessages");
    let selectedId;
    let admins = [];

    document.querySelector("#list_items").closest("div").querySelector(".title").onclick = async function (event) {
        event.stopPropagation();
        const list_items = this.closest("nav").querySelector("#list_items")

        if (!!admins.length && list_items.style.display === "none") {
            list_items.style.display = "";
            // return this.closest("nav").removeChild(this.closest("nav").querySelector("ul:not(#list_items)"));
            this.textContent = "Fast view";
            return this.closest("nav").querySelector("ul:not(#list_items)").style.display = "none"
            // list_items.style.display = "none"
        }
        else if (!!admins.length) {
            list_items.style.display = "none";
            this.textContent = "Write to an administrator";
            return this.closest("nav").querySelector("ul:not(#list_items)").style.display = "";
        }

        list_items.style.display = "none";
        this.textContent = "Write to an administrator";

        loader(this);
        const request = await fetch("http://localhost:4000/api/crud-admin/getAdmins", {
            method: "GET"
        });

        hideLoader(this);
        if (!request.ok) return;
        admins = await request.json();

        // list_items.
        //     insertAdjacentHTML("afterend", `<ul class='list-items'>
        //         ${admins.map(({ _id, name, auth }) => `<li data-id="${_id}">${name} <sub>${auth.email}</sub> </li>`).join("")
        //         }
        //     </ul>`);

        let data = [];
        for (let { _id, name, auth } of admins) {
            if (_id === authUser._id) continue;
            data.push(`<li data-id="${_id}">${name} <sub>${auth.email}</sub> </li>`);
        }

        list_items.insertAdjacentHTML("afterend", `<ul class='list-items'>${data.join("")}</ul>`);

    }

    document.querySelector("#list_items").closest("nav").addEventListener("click", async function (e) {
        const target = e.target;

        if (!target?.dataset?.idFastView && !target?.dataset?.id) return;

        let renderMessages = "";

        const { userMessages, userSender } = root;

        selectedId = target?.dataset?.idFastView || target?.dataset?.id;

        const getMessages = userMessages.filter(message => message.to === selectedId || message.from === selectedId);

        if (!!getMessages.length) {
            const { name } = userSender.find(user => user._id === selectedId);
            for (let { message, timestamp, from } of getMessages) {

                const self = authUser._id === from;
                renderMessages += `
                <div class=${self ? 'self' : 'from'}>
                    <h4>${self ? "you" : name}</h4>
                    <p>${message}</p>
                    <p><strong>${timestamp}</strong></p>
                </div>
                `;
            }
        }
        else {
            renderMessages = "<h3>Void</h3>";
        }

        messageButton.dataset.selectedId = selectedId;
        inputChat.disabled = false;
        inputChat.classList.remove("opacity");
        messageContainer.innerHTML = renderMessages;
    });

    inputChat.addEventListener("input", function () {
        if (this.value.length >= 1) {
            return messageButton.hidden = false;
        }
        return messageButton.hidden = true;
    });

    messageButton.onclick = async function () {

        const value = inputChat.value;

        console.log("selectedId");
        console.log(selectedId);

        if (!value) return;

        loader(messageContainer);
        const request = await fetch("http://localhost:4000/api/user/options", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                to: selectedId,
                message: value
            })
        });
        hideLoader(messageContainer);

        if (!request.ok) return;

        messageContainer.insertAdjacentHTML("beforeend", `
            <div class='self'>
                <h4>You</h4>
                <p>${value}</p>
                <p><strong>${timestamp}</strong></p>
            </div>
            `);

        messageContainer.scrollTo({
            top: messageContainer.lastElementChild.getBoundingClientRect().y,
            left: 0,
            behavior: "smooth"
        });
        inputChat.value = "";
        return messageButton.hidden = true;

    };
}