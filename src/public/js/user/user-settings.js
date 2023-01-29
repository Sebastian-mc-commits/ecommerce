
const handleUserSettings = () => {
    HTML = `
            <div>
                <form class="form card" id="form" action="/auth/singup" method="POST">
                <div class="group">
                <input
                    type="text"
                    class="title_form"
                    placeholder="Change Password"
                    name="password"
                />

                <input
                    type="text"
                    class="title_form"
                    placeholder="Change name"
                    name="name"
                />

                <input
                    type="text"
                    class="title_form"
                    placeholder="Change last name"
                    name="last_name"
                />

                <input
                    type="number"
                    class="title_form"
                    placeholder="Phone"
                    name="phone"
                />

                <input
                    type="text"
                    class="title_form"
                    placeholder="Direction"
                    name="direction"
                />
                </div>
            
                <input
                type="submit"
                value="Done"
                class="w-6 btn-transition"
                />
                </form>
            </div>
            `;
}