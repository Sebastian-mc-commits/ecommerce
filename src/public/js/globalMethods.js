const globalMethods = {

    activeGlobalMessage: ({ type, message, error }) => {
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 5000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener("mouseenter", Swal.stopTimer);
                toast.addEventListener("mouseleave", Swal.resumeTimer);
            }
        })
        Toast.fire({
            icon: type,
            title: message,
            text: error
        });
    },

    activeGlobalMessageV2: ({ message, type }) => {
        Swal.fire({
            text: message,
            toast: true,
            position: "top",
            color: type
        });
    },

    showConfirmationMessage: async ({ title, onConfirmTitle }, handleConfirmationSuccess) => {
        Swal.fire({
            title,
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Continue",
        }).then(({ isConfirmed, isDenied }) => {
            if (isConfirmed) {
                Swal.fire({
                    title: onConfirmTitle,
                    showDenyButton: true,
                    showCancelButton: true,
                    confirmButtonText: "Continue",
                }).then(async ({ isConfirmed, isDenied }) => {

                    if (isConfirmed) await handleConfirmationSuccess();

                    else if (isDenied) Swal.fire("Changes are not save", "", "info");
                })
            }
            else if (isDenied) {
                Swal.fire("Changes are not save", "", "info");
            }
        })
    },

    loader: (target, position = "last") => {
        let spinner = "<div class='loader'></div>";
        switch (position) {
            case "first":
                return target.insertAdjacentHTML("afterbegin", spinner);
            case "last":
                // return target.innerHTML += spinner;
                return target.insertAdjacentHTML("beforeend", spinner);
            default:
                return;
        }
    },

    hideLoader: (parentTarget) => {
        return parentTarget.removeChild(parentTarget.querySelector(".loader"));
    },

    showCurrentUserValues: () => {
        let authUser = {};
        const userData = document.querySelector("[data-user-for-js='true']").textContent.split(" ");

        for (let i = 0; i < userData.length; i += 2) {

            authUser[userData[i]] = userData[i + 1];
        }

        return Object.values(authUser).length ? authUser : {};
    },

    randomColor: () => {
        const color = "#" + ((1 << 24) * Math.random() | 0).toString(16);

        document.documentElement.style.setProperty('--random-color', color);
    },

    memo: (fn) => {

        let keepfn = {}

        return () => {
            if (fn in keepfn) {
                return fn();
            }

            keepfn[fn] = fn;
            fn();
        }
    },

    functionsMethods: {

        activeOnChangeFunction: () => {
            Object.defineProperty(globalMethods.functionsMethods, "onChangeFunction", {
                get: () => {
                    const onReplaceFunction = this._onChangeFunction;
                    delete globalMethods.functionsMethods.onChangeFunction;
                    return onReplaceFunction;
                },
                set: (val) => {
                    this._onChangeFunction = val;
                },
                configurable: true
            });
        },
    },

    useFetch: async ({

        url, method, useLoader = "", maxTime = 5000,
        messageTimeEndedFetch = "The server is taking too long to respond. Please try again later or wait.",
        ...fetchBody

    }) => {

        if (useLoader) globalMethods.loader(useLoader);

        const timeout = setTimeout(() => {
            globalMethods.activeGlobalMessageV2({
                message: messageTimeEndedFetch,
                type: "brown"
            });
        }, maxTime);

        const startTime = performance.now();

        const request = await fetch(url, { method, ...fetchBody });

        const contentType = request.headers.get("Content-Type");

        let result;

        if (contentType.startsWith("application/json")) {
            result = await request.json();
        }

        const endTime = performance.now();

        clearTimeout(timeout);

        if (!request.ok && result && "message" in result) {
            globalMethods.activeGlobalMessage({
                message: result.message,
                type: "warning"
            });
        }

        else if (!request.ok) {

            return activeGlobalMessage({
                message: "SERVER ERROR",
                type: "warning"
            });
        }

        if (useLoader) globalMethods.hideLoader(useLoader);

        return {
            result,
            request,
            timeTaken: endTime - startTime
        }
    }
}