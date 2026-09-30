const CATS = [
    "Contest",
    "Workshop",
    "Tech",
    "Social",
    "Recruitment"
];

const iso = (d) => {
    const t = new Date(Date.now() + d * 864e5);

    t.setMinutes(0, 0, 0);

    return new Date(
        t - t.getTimezoneOffset() * 6e4
    )
        .toISOString()
        .slice(0, 16);
};

const seed = () => [
    {
        id: 1,
        name: "CodeChef Campus Coding Marathon",
        date: iso(-0.5),
        end: iso(2),
        venue: "Online + Computer Lab 3",
        category: "Contest",
        desc: "Multi-day contest with algorithmic problems for all levels. Solo entries, live leaderboard.",
        featured: true
    },

    {
        id: 2,
        name: "Weekly Starters Contest Discussion",
        date: iso(2),
        end: "",
        venue: "Seminar Hall 2",
        category: "Contest",
        desc: "Upsolve the latest contest together and learn the intended approaches.",
        featured: false
    },

    {
        id: 3,
        name: "Competitive Programming Bootcamp",
        date: iso(5),
        end: "",
        venue: "Computer Lab 1",
        category: "Workshop",
        desc: "From arrays to graphs: a beginner-friendly bootcamp on problem solving.",
        featured: false
    },

    {
        id: 4,
        name: "Web Development with React",
        date: iso(9),
        end: "",
        venue: "Innovation Lab",
        category: "Tech",
        desc: "Build and deploy a small React app in one session. Bring a laptop.",
        featured: false
    },

    {
        id: 5,
        name: "Recruitment: Technical Team",
        date: iso(-1),
        end: iso(10),
        venue: "Online form + interview in Lab 3",
        category: "Recruitment",
        desc: "Set contests, review problems and mentor juniors. Good DSA fundamentals expected.",
        featured: false
    },

    {
        id: 6,
        name: "Recruitment: Content & Design Team",
        date: iso(-1),
        end: iso(8),
        venue: "Online form + portfolio review",
        category: "Recruitment",
        desc: "Design posters and write social posts for our contests and workshops.",
        featured: false
    },

    {
        id: 7,
        name: "Recruitment: Events & Outreach Team",
        date: iso(-1),
        end: iso(9),
        venue: "Online form + interview",
        category: "Recruitment",
        desc: "Plan logistics, manage volunteers and coordinate with other clubs.",
        featured: false
    }
];

let events = seed();
let regs = [];
let isAdmin = false;
let tab = "events";
let editId = null;
let regFor = null;

const esc = (s) =>
    String(s).replace(
        /[&<>"']/g,
        (c) => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[c]
    );

const fmt = (d) =>
    new Date(d).toLocaleString([], {
        weekday: "short",
        day: "numeric",
        month: "short",
        hour: "numeric",
        minute: "2-digit"
    });

const $ = (id) => document.getElementById(id);

const sorted = () =>
    [...events].sort((a, b) =>
        a.date.localeCompare(b.date)
    );

const upcoming = () =>
    sorted().filter(
        (e) => new Date(e.date) > new Date()
    );

const live = (e) =>
    new Date(e.date) <= new Date() &&
    !!e.end &&
    new Date(e.end) >= new Date();

const toast = (m) => {
    const t = $("toast");

    t.textContent = m;
    t.style.display = "block";

    clearTimeout(toast.t);

    toast.t = setTimeout(() => {
        t.style.display = "none";
    }, 2600);
};

function card(e) {
    const n = regs.filter(
        (r) => r.eventId === e.id
    ).length;

    return `
        <article class="card">
            <div>
                <span class="chip">
                    ${esc(e.category)}
                </span>

                ${
                    live(e)
                        ? `
                            <span
                                class="chip"
                                style="background:var(--sun);color:#14213d;border-color:var(--sun)"
                            >
                                ${
                                    e.category === "Recruitment"
                                        ? "Applications open"
                                        : "Live now"
                                }
                            </span>
                        `
                        : ""
                }
            </div>

            <h3>${esc(e.name)}</h3>

            <div class="meta">
                <span>${fmt(e.date)}</span>

                <span>${esc(e.venue)}</span>

                ${
                    e.end
                        ? `<span>Ends ${fmt(e.end)}</span>`
                        : ""
                }

                <span>
                    ${n}
                    ${
                        e.category === "Recruitment"
                            ? "applied"
                            : "registered"
                    }
                </span>
            </div>

            <p>${esc(e.desc)}</p>

            <button class="btn" data-reg="${e.id}">
                ${
                    e.category === "Recruitment"
                        ? "Apply now"
                        : "Register"
                }
            </button>
        </article>
    `;
}

function home() {
    const up = upcoming().filter(
        (e) => e.category !== "Recruitment"
    );

    const on = events.filter(
        (e) =>
            live(e) &&
            e.category !== "Recruitment"
    );

    const rec = sorted().filter(
        (e) =>
            e.category === "Recruitment" &&
            new Date(e.end || e.date) >= new Date()
    );

    const f =
        on.find((e) => e.featured) ||
        on[0] ||
        up.find((e) => e.featured) ||
        up[0];

    return `
        <div class="hero">
            <div>
                <h1>
                    Code together. Compete together.
                </h1>

                <p>
                    CodeChef ABESEC is the competitive
                    programming chapter of ABES Engineering
                    College. Join live contests, workshops
                    and our recruitment drives. Register
                    in a minute and turn up.
                </p>

                <div class="stats">
                    <div>
                        <b>${CATS.length}</b>
                        <span>club categories</span>
                    </div>

                    <div>
                        <b>${up.length}</b>
                        <span>upcoming events</span>
                    </div>

                    <div>
                        <b>${regs.length}</b>
                        <span>students registered</span>
                    </div>
                </div>
            </div>

            ${
                f
                    ? `
                        <div class="feat">
                            <span class="tag">
                                Featured event
                            </span>

                            <h2>${esc(f.name)}</h2>

                            <div>
                                ${fmt(f.date)}
                                ·
                                ${esc(f.venue)}
                            </div>

                            <p>${esc(f.desc)}</p>

                            <button
                                class="btn"
                                data-reg="${f.id}"
                            >
                                Register now
                            </button>
                        </div>
                    `
                    : `
                        <div class="empty">
                            No featured event yet.
                        </div>
                    `
            }
        </div>

        ${
            on.length
                ? `
                    <section>
                        <div class="sec-h">
                            <h2>Ongoing now</h2>
                        </div>

                        <div class="grid">
                            ${on.map(card).join("")}
                        </div>
                    </section>
                `
                : ""
        }

        ${
            rec.length
                ? `
                    <section>
                        <div class="sec-h">
                            <h2>CodeChef recruitments</h2>
                            <a href="#join">
                                View all teams
                            </a>
                        </div>

                        <div class="grid">
                            ${rec
                                .slice(0, 3)
                                .map(card)
                                .join("")}
                        </div>
                    </section>
                `
                : ""
        }

        <section>
            <div class="sec-h">
                <h2>Upcoming events</h2>

                <a href="#events">
                    See all events
                </a>
            </div>

            <div class="grid">
                ${
                    up
                        .slice(0, 3)
                        .map(card)
                        .join("") ||
                    `
                        <div class="empty">
                            No upcoming events.
                            Check back soon.
                        </div>
                    `
                }
            </div>
        </section>
    `;
}

function eventsPage() {
    return `
        <section>
            <div class="sec-h">
                <h2>All events</h2>
            </div>

            <div class="bar">
                <input
                    id="q"
                    type="search"
                    placeholder="Search events by name"
                    aria-label="Search events"
                >

                <select
                    id="cat"
                    aria-label="Filter by category"
                >
                    <option value="">
                        All categories
                    </option>

                    ${CATS
                        .map(
                            (c) =>
                                `<option>${c}</option>`
                        )
                        .join("")}
                </select>
            </div>

            <div
                class="grid"
                id="list"
            ></div>
        </section>
    `;
}

function filterEvents() {
    const q = $("q").value.toLowerCase();
    const c = $("cat").value;

    const l = sorted().filter(
        (e) =>
            e.name.toLowerCase().includes(q) &&
            (!c || e.category === c)
    );

    $("list").innerHTML =
        l.map(card).join("") ||
        `
            <div
                class="empty"
                style="grid-column:1/-1"
            >
                No events match.
                Try a different name or category.
            </div>
        `;
}

function admin() {
    if (!isAdmin) {
        return `
            <div class="login card">
                <h3>Admin sign in</h3>

                <label for="pw">
                    Password
                </label>

                <input
                    id="pw"
                    type="password"
                >

                <div
                    class="err"
                    id="pwErr"
                ></div>

                <button
                    class="btn"
                    id="login"
                >
                    Sign in
                </button>

                <div class="meta">
                    Demo password: admin123
                </div>
            </div>
        `;
    }

    return `
        <section>
            <div class="sec-h">
                <h2>Admin dashboard</h2>

                <div>
                    <button
                        class="btn"
                        id="addEv"
                    >
                        Add event
                    </button>

                    <button
                        class="btn ghost"
                        id="logout"
                    >
                        Sign out
                    </button>
                </div>
            </div>

            <div class="tabs">
                <button
                    data-tab="events"
                    class="${
                        tab === "events"
                            ? "on"
                            : ""
                    }"
                >
                    Events (${events.length})
                </button>

                <button
                    data-tab="regs"
                    class="${
                        tab === "regs"
                            ? "on"
                            : ""
                    }"
                >
                    Registrations (${regs.length})
                </button>
            </div>

            ${
                tab === "events"
                    ? adminEvents()
                    : adminRegs()
            }
        </section>
    `;
}

function adminEvents() {
    return `
        <div class="tw">
            <table>
                <thead>
                    <tr>
                        <th>Event</th>
                        <th>Date &amp; time</th>
                        <th>Venue</th>
                        <th>Category</th>
                        <th>Registered</th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    ${
                        sorted()
                            .map(
                                (e) => `
                                    <tr>
                                        <td>
                                            <b>
                                                ${esc(e.name)}
                                            </b>

                                            ${
                                                e.featured
                                                    ? `
                                                        <span class="chip">
                                                            Featured
                                                        </span>
                                                    `
                                                    : ""
                                            }
                                        </td>

                                        <td>
                                            ${fmt(e.date)}
                                        </td>

                                        <td>
                                            ${esc(e.venue)}
                                        </td>

                                        <td>
                                            ${esc(e.category)}
                                        </td>

                                        <td>
                                            ${
                                                regs.filter(
                                                    (r) =>
                                                        r.eventId ===
                                                        e.id
                                                ).length
                                            }
                                        </td>

                                        <td>
                                            <button
                                                class="btn ghost sm"
                                                data-edit="${e.id}"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                class="btn del sm"
                                                data-del="${e.id}"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                `
                            )
                            .join("") ||
                        `
                            <tr>
                                <td colspan="6">
                                    No events yet.
                                    Add your first event.
                                </td>
                            </tr>
                        `
                    }
                </tbody>
            </table>
        </div>
    `;
}

function adminRegs() {
    return `
        <div class="bar">
            <input
                id="rq"
                type="search"
                placeholder="Search name, email or college"
                aria-label="Search registrations"
            >

            <select
                id="rev"
                aria-label="Filter by event"
            >
                <option value="">
                    All events
                </option>

                ${sorted()
                    .map(
                        (e) =>
                            `
                                <option value="${e.id}">
                                    ${esc(e.name)}
                                </option>
                            `
                    )
                    .join("")}
            </select>
        </div>

        <div class="tw">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>College / Year</th>
                        <th>Phone</th>
                        <th>Event</th>
                        <th></th>
                    </tr>
                </thead>

                <tbody id="rbody"></tbody>
            </table>
        </div>
    `;
}

function filterRegs() {
    const q = $("rq").value.toLowerCase();
    const ev = $("rev").value;

    const l = regs.filter(
        (r) =>
            (!ev || String(r.eventId) === ev) &&
            (r.name + r.email + r.college)
                .toLowerCase()
                .includes(q)
    );

    $("rbody").innerHTML =
        l
            .map((r) => {
                const e = events.find(
                    (x) => x.id === r.eventId
                );

                return `
                    <tr>
                        <td>${esc(r.name)}</td>

                        <td>${esc(r.email)}</td>

                        <td>
                            ${esc(r.college)},
                            ${esc(r.year)}
                        </td>

                        <td>${esc(r.phone)}</td>

                        <td>
                            ${
                                e
                                    ? esc(e.name)
                                    : "(deleted event)"
                            }
                        </td>

                        <td>
                            <button
                                class="btn del sm"
                                data-rdel="${r.id}"
                            >
                                Remove
                            </button>
                        </td>
                    </tr>
                `;
            })
            .join("") ||
        `
            <tr>
                <td colspan="6">
                    No registrations match.
                </td>
            </tr>
        `;
}

function joinPage() {
    const r = sorted().filter(
        (e) => e.category === "Recruitment"
    );

    return `
        <section>
            <div class="sec-h">
                <h2>
                    Join the CodeChef ABESEC team
                </h2>
            </div>

            <p
                style="color:var(--mute);max-width:60ch"
            >
                Open to all branches and years.
                Pick a team, apply once, and we
                will contact you about the
                interview round.
            </p>

            <div
                class="grid"
                style="margin-top:16px"
            >
                ${
                    r.map(card).join("") ||
                    `
                        <div class="empty">
                            No recruitments open
                            right now.
                        </div>
                    `
                }
            </div>
        </section>
    `;
}

function route() {
    const r =
        location.hash.slice(1) || "home";

    const p = [
        "home",
        "events",
        "join",
        "admin"
    ].includes(r)
        ? r
        : "home";

    document
        .querySelectorAll("nav a")
        .forEach((a) =>
            a.classList.toggle(
                "on",
                a.dataset.r === p
            )
        );

    $("app").innerHTML =
        p === "home"
            ? home()
            : p === "events"
            ? eventsPage()
            : p === "join"
            ? joinPage()
            : admin();

    if (p === "events") {
        $("q").oninput =
            $("cat").onchange =
            filterEvents;

        filterEvents();
    }

    if (
        p === "admin" &&
        isAdmin &&
        tab === "regs"
    ) {
        $("rq").oninput =
            $("rev").onchange =
            filterRegs;

        filterRegs();
    }

    window.scrollTo(0, 0);
}

const rerender = () => {
    const y = scrollY;

    route();

    scrollTo(0, y);
};

addEventListener("hashchange", route);

function openReg(id) {
    regFor = events.find(
        (e) => e.id === id
    );

    if (!regFor) return;

    $("regTitle").textContent =
        regFor.category === "Recruitment"
            ? "Apply"
            : "Register";

    $("regSub").textContent =
        regFor.name +
        " · " +
        fmt(regFor.date);

    $("rErr").textContent = "";

    [
        "rName",
        "rEmail",
        "rCollege",
        "rPhone"
    ].forEach(
        (i) => ($(i).value = "")
    );

    $("regModal")
        .classList
        .add("open");

    $("rName").focus();
}

$("rSubmit").onclick = () => {
    const v = (i) =>
        $(i).value.trim();

    const d = {
        name: v("rName"),
        email: v("rEmail"),
        college: v("rCollege"),
        year: $("rYear").value,
        phone: v("rPhone")
    };

    const bad =
        !d.name
            ? "Enter your name."
            : !/^\S+@\S+\.\S+$/.test(d.email)
            ? "Enter a valid email address."
            : !d.college
            ? "Enter your college."
            : !/^[+\d][\d\s-]{6,14}$/.test(d.phone)
            ? "Enter a valid phone number."
            : regs.some(
                  (r) =>
                      r.eventId === regFor.id &&
                      r.email.toLowerCase() ===
                          d.email.toLowerCase()
              )
            ? "This email is already registered for this event."
            : "";

    if (bad) {
        $("rErr").textContent = bad;
        return;
    }

    regs.push({
        id: Date.now(),
        eventId: regFor.id,
        ...d
    });

    $("regModal")
        .classList
        .remove("open");

    toast(
        "Registered for " +
        regFor.name
    );

    rerender();
};

function openEv(id) {
    editId = id;

    const e =
        events.find(
            (x) => x.id === id
        ) || {
            name: "",
            date: "",
            end: "",
            venue: "",
            category: CATS[0],
            desc: "",
            featured: false
        };

    $("evTitle").textContent =
        id
            ? "Edit event"
            : "Add event";

    $("eCat").innerHTML =
        CATS
            .map(
                (c) =>
                    `<option>${c}</option>`
            )
            .join("");

    $("eName").value = e.name;
    $("eDate").value = e.date;
    $("eEnd").value = e.end || "";
    $("eVenue").value = e.venue;
    $("eCat").value = e.category;
    $("eDesc").value = e.desc;
    $("eFeat").checked = e.featured;
    $("eErr").textContent = "";

    $("evModal")
        .classList
        .add("open");

    $("eName").focus();
}

$("eSave").onclick = () => {
    const d = {
        name: $("eName").value.trim(),
        date: $("eDate").value,
        end: $("eEnd").value,
        venue: $("eVenue").value.trim(),
        category: $("eCat").value,
        desc: $("eDesc").value.trim(),
        featured: $("eFeat").checked
    };

    if (!d.name || !d.date || !d.venue) {
        $("eErr").textContent =
            "Name, date & time and venue are required.";

        return;
    }

    if (d.featured) {
        events.forEach(
            (e) => (e.featured = false)
        );
    }

    if (editId) {
        events = events.map(
            (e) =>
                e.id === editId
                    ? {
                          ...e,
                          ...d
                      }
                    : e
        );
    } else {
        events.push({
            id: Date.now(),
            ...d
        });
    }

    $("evModal")
        .classList
        .remove("open");

    toast(
        editId
            ? "Event updated"
            : "Event added"
    );

    rerender();
};

document.addEventListener(
    "click",
    (e) => {
        const t =
            e.target.closest("button");

        if (!t) return;

        if (t.dataset.reg) {
            openReg(
                +t.dataset.reg
            );
        }

        if (
            t.hasAttribute(
                "data-close"
            )
        ) {
            document
                .querySelectorAll(
                    ".modal"
                )
                .forEach(
                    (m) =>
                        m.classList.remove(
                            "open"
                        )
                );
        }

        if (t.id === "login") {
            if (
                $("pw").value ===
                "admin123"
            ) {
                isAdmin = true;
                rerender();
            } else {
                $("pwErr").textContent =
                    "Incorrect password.";
            }
        }

        if (t.id === "logout") {
            isAdmin = false;
            rerender();
        }

        if (t.id === "addEv") {
            openEv(null);
        }

        if (t.dataset.edit) {
            openEv(
                +t.dataset.edit
            );
        }

        if (t.dataset.del) {
            const ev =
                events.find(
                    (x) =>
                        x.id ===
                        +t.dataset.del
                );

            if (
                confirm(
                    'Delete "' +
                        ev.name +
                        '" and its registrations?'
                )
            ) {
                events =
                    events.filter(
                        (x) =>
                            x.id !==
                            ev.id
                    );

                regs =
                    regs.filter(
                        (r) =>
                            r.eventId !==
                            ev.id
                    );

                toast(
                    "Event deleted"
                );

                rerender();
            }
        }

        if (t.dataset.rdel) {
            regs =
                regs.filter(
                    (r) =>
                        r.id !==
                        +t.dataset.rdel
                );

            toast(
                "Registration removed"
            );

            rerender();
        }

        if (t.dataset.tab) {
            tab = t.dataset.tab;

            rerender();
        }
    }
);

document.addEventListener(
    "keydown",
    (e) => {
        if (e.key === "Escape") {
            document
                .querySelectorAll(
                    ".modal"
                )
                .forEach(
                    (m) =>
                        m.classList.remove(
                            "open"
                        )
                );
        }

        if (
            e.key === "Enter" &&
            e.target.id === "pw"
        ) {
            $("login").click();
        }
    }
);

route();