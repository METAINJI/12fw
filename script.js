const API_BASE = "https://vacation-calendar-api.pcofjeongchan.workers.dev";

const TOKEN_KEY = "vacation_token";
const TOKEN_EXPIRES_KEY = "vacation_token_expires_at";

function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

function getTokenExpiresAt() {
    const value = localStorage.getItem(TOKEN_EXPIRES_KEY);
    return value ? new Date(value) : null;
}

function saveToken(token, expiresAtIso) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(TOKEN_EXPIRES_KEY, expiresAtIso);
}

function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRES_KEY);
}

function isLoggedIn() {
    const token = getToken();
    const expiresAt = getTokenExpiresAt();
    return Boolean(token) && Boolean(expiresAt) && expiresAt.getTime() > Date.now();
}

function authHeaders() {
    return { Authorization: "Bearer " + getToken() };
}

async function apiFetch(path, options) {

    const response = await fetch(API_BASE + path, options || {});

    if (response.status === 401) {
        clearToken();
        window.location.reload();
    }

    return response;
}

document.addEventListener("DOMContentLoaded", function () {

    const loginScreen = document.getElementById("loginScreen");
    const appScreen = document.getElementById("appScreen");
    const loginForm = document.getElementById("loginForm");
    const loginErrorEl = document.getElementById("loginError");
    const logoutButton = document.getElementById("logoutButton");

    function showLogin() {
        appScreen.classList.add("hidden");
        loginScreen.classList.remove("hidden");
    }

    function showApp() {
        loginScreen.classList.add("hidden");
        appScreen.classList.remove("hidden");
        initApp();
    }

    if (loginForm) {

        loginForm.addEventListener("submit", async function (event) {

            event.preventDefault();

            loginErrorEl.classList.add("hidden");

            const codeInput = document.getElementById("accessCode");
            const submitButton = loginForm.querySelector("button[type=submit]");

            submitButton.disabled = true;

            try {

                const response = await fetch(API_BASE + "/api/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ code: codeInput.value })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.detail || "로그인에 실패했습니다.");
                }

                saveToken(data.token, data.expires_at);

                codeInput.value = "";

                showApp();

            }
            catch (error) {

                loginErrorEl.textContent = error.message;
                loginErrorEl.classList.remove("hidden");

            }
            finally {

                submitButton.disabled = false;

            }

        });

    }

    if (logoutButton) {

        logoutButton.addEventListener("click", function () {

            clearToken();
            showLogin();

        });

    }

    if (isLoggedIn()) {
        showApp();
    }
    else {
        showLogin();
    }

});


function initApp() {

    const calendarGrid =
        document.getElementById("calendarGrid");

    if (!calendarGrid) {
        return;
    }

    const calendarDays =
        document.getElementById("calendarDays");

    const listView =
        document.getElementById("listView");

    const calendarTitle =
        document.getElementById("calendarTitle");

    const prevButton =
        document.getElementById("prevButton");

    const nextButton =
        document.getElementById("nextButton");

    const todayButton =
        document.getElementById("todayButton");

    const calendarViewButton =
        document.getElementById("calendarViewButton");

    const listViewButton =
        document.getElementById("listViewButton");


    const vacationModal =
        document.getElementById("vacationModal");

    const detailModal =
        document.getElementById("detailModal");

    const addButton =
        document.getElementById("addVacationButton");

    const closeModalButton =
        document.getElementById("closeModalButton");

    const closeDetailButton =
        document.getElementById("closeDetailButton");

    const cancelButton =
        document.getElementById("cancelButton");

    const vacationForm =
        document.getElementById("vacationForm");

    const deleteButton =
        document.getElementById("deleteButton");

    const editButton =
        document.getElementById("editButton");



    const vacationId =
        document.getElementById("vacationId");

    const person =
        document.getElementById("person");

    const personCharCount =
        document.getElementById("personCharCount");

    const reason =
        document.getElementById("reason");

    const reasonCharCount =
        document.getElementById("reasonCharCount");

    const colorSwatches =
        document.getElementById("colorSwatches");

    const colorHex =
        document.getElementById("colorHex");

    const colorPreview =
        document.getElementById("colorPreview");

    const startDate =
        document.getElementById("startDate");

    const endDate =
        document.getElementById("endDate");

    const note =
        document.getElementById("note");

    const noteCharCount =
        document.getElementById("noteCharCount");

    const indefinite =
        document.getElementById("indefinite");

    const vacationTypeGroup =
        document.getElementById("vacationTypeGroup");

    const regularTypeButton =
        document.getElementById("regularTypeButton");

    const irregularTypeButton =
        document.getElementById("irregularTypeButton");

    const indefiniteList =
        document.getElementById("indefiniteList");

    const indefiniteSection =
        document.getElementById("indefiniteSection");

    const formError =
        document.getElementById("formError");


    const detailPerson =
        document.getElementById("detailPerson");

    const detailReason =
        document.getElementById("detailReason");

    const detailDate =
        document.getElementById("detailDate");

    const detailNote =
        document.getElementById("detailNote");

    const liveClock =
        document.getElementById("liveClock");

    const sessionInfo =
        document.getElementById("sessionInfo");

    const extendSessionButton =
        document.getElementById("extendSessionButton");

    const clearCacheButton =
        document.getElementById("clearCacheButton");


    let selectedVacation = null;

    let vacationType = "regular";


    function setVacationType(type) {

        vacationType =
            type === "irregular" ? "irregular" : "regular";

        regularTypeButton.classList.toggle(
            "active",
            vacationType === "regular"
        );

        irregularTypeButton.classList.toggle(
            "active",
            vacationType === "irregular"
        );

    }


    regularTypeButton.addEventListener(
        "click",
        function () {
            setVacationType("regular");
        }
    );


    irregularTypeButton.addEventListener(
        "click",
        function () {
            setVacationType("irregular");
        }
    );


    setVacationType("regular");


    function updateCharCounter(input, counterEl) {

        counterEl.textContent =
            input.value.length + "/" + input.maxLength;

    }


    function syncCharCounters() {

        updateCharCounter(person, personCharCount);

        updateCharCounter(reason, reasonCharCount);

        updateCharCounter(note, noteCharCount);

    }


    person.addEventListener(
        "input",
        function () {
            updateCharCounter(person, personCharCount);
        }
    );


    reason.addEventListener(
        "input",
        function () {
            updateCharCounter(reason, reasonCharCount);
        }
    );


    note.addEventListener(
        "input",
        function () {
            updateCharCounter(note, noteCharCount);
        }
    );


    syncCharCounters();


    function colorForPerson(name) {

        let hash = 0;

        for (let i = 0; i < name.length; i++) {

            hash = name.charCodeAt(i)
                + ((hash << 5) - hash);

        }

        const hue =
            Math.abs(hash) % 360;

        return `hsl(${hue}, 62%, 42%)`;

    }


    function colorForVacation(vacation) {

        return vacation.color
            || colorForPerson(vacation.person);

    }


    const PRESET_COLORS = [
        "#4F46E5",
        "#0EA5E9",
        "#059669",
        "#D97706",
        "#DC2626",
        "#7C3AED",
        "#DB2777",
        "#475569"
    ];

    const AUTO_COLOR_HUES =
        [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];


    function hslToHex(h, s, l) {

        s /= 100;
        l /= 100;

        const k =
            function (n) {
                return (n + h / 30) % 12;
            };

        const a =
            s * Math.min(l, 1 - l);

        const f =
            function (n) {

                return l - a * Math.max(
                    -1,
                    Math.min(k(n) - 3, Math.min(9 - k(n), 1))
                );

            };

        const toHex =
            function (x) {
                return Math.round(255 * x)
                    .toString(16)
                    .padStart(2, "0");
            };

        return "#" + toHex(f(0)) + toHex(f(8)) + toHex(f(4));

    }


    function pickAutoColor(usedColors) {

        const used =
            new Set(
                usedColors
                    .filter(Boolean)
                    .map(function (hex) {
                        return hex.toLowerCase();
                    })
            );

        for (let i = 0; i < AUTO_COLOR_HUES.length; i++) {

            const candidate =
                hslToHex(AUTO_COLOR_HUES[i], 62, 42);

            if (!used.has(candidate.toLowerCase())) {
                return candidate;
            }

        }
        
        const randomHue =
            Math.floor(Math.random() * 360);

        return hslToHex(randomHue, 62, 42);

    }


    function buildColorSwatches() {

        colorSwatches.innerHTML = "";

        const autoSwatch =
            document.createElement("button");

        autoSwatch.type = "button";

        autoSwatch.className =
            "color-swatch color-swatch-auto";

        autoSwatch.dataset.hex = "";

        autoSwatch.title = "자동 배정";

        autoSwatch.textContent = "자동";

        autoSwatch.addEventListener(
            "click",
            function () {
                setColorValue("");
            }
        );

        colorSwatches.appendChild(autoSwatch);

        PRESET_COLORS.forEach(
            function (hex) {

                const swatch =
                    document.createElement("button");

                swatch.type = "button";

                swatch.className = "color-swatch";

                swatch.dataset.hex = hex;

                swatch.style.backgroundColor = hex;

                swatch.title = hex;

                swatch.addEventListener(
                    "click",
                    function () {
                        setColorValue(hex);
                    }
                );

                colorSwatches.appendChild(swatch);

            }
        );

    }


    function updateColorUI() {

        const value =
            colorHex.value.trim();

        const swatchButtons =
            colorSwatches.querySelectorAll(".color-swatch");

        swatchButtons.forEach(
            function (swatch) {

                swatch.classList.toggle(
                    "active",
                    swatch.dataset.hex.toLowerCase() === value.toLowerCase()
                );

            }
        );

        if (value) {

            colorPreview.style.backgroundColor = value;

            colorPreview.classList.remove("is-auto");

        }
        else {

            colorPreview.style.backgroundColor = "#fff";

            colorPreview.classList.add("is-auto");

        }

    }


    function setColorValue(hex) {

        colorHex.value = hex;

        updateColorUI();

    }


    buildColorSwatches();

    updateColorUI();

    colorHex.addEventListener(
        "input",
        updateColorUI
    );


    function openDatePicker(input) {

        if (input.disabled) {
            return;
        }

        if (typeof input.showPicker === "function") {

            try {

                input.showPicker();

            }
            catch (error) {

            }

        }

    }


    startDate.addEventListener(
        "click",
        function () {
            openDatePicker(startDate);
        }
    );


    endDate.addEventListener(
        "click",
        function () {
            openDatePicker(endDate);
        }
    );


    function formatDate(dateString) {

        const date =
            new Date(dateString + "T00:00:00");

        return date.toLocaleDateString(
            "ko-KR",
            {
                year: "numeric",
                month: "long",
                day: "numeric"
            }
        );
    }


    function toLocalDateString(date) {

        const year = date.getFullYear();

        const month =
            String(date.getMonth() + 1).padStart(2, "0");

        const day =
            String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;

    }


    function vacationStatus(vacation) {

        const today =
            toLocalDateString(new Date());

        if (vacation.end_date < today) {

            return {
                label: "종료됨",
                className: "status-ended"
            };

        }

        if (vacation.start_date > today) {

            return {
                label: "예정",
                className: "status-upcoming"
            };

        }

        return {
            label: "진행중",
            className: "status-ongoing"
        };

    }


    function showVacationDetail(vacation) {

        selectedVacation = vacation;

        detailPerson.textContent =
            vacation.person;

        detailReason.textContent =
            vacation.reason;

        detailDate.textContent =
            vacation.indefinite
                ? (
                    vacation.start_date
                        ? formatDate(vacation.start_date) + "부터 무기한"
                        : "무기한"
                )
                : formatDate(vacation.start_date)
                    + " ~ "
                    + formatDate(vacation.end_date)
                    + (
                        vacation.vacation_type === "regular"
                            ? " (정기 휴가)"
                            : vacation.vacation_type === "irregular"
                                ? " (비정기 휴가)"
                                : ""
                    );

        detailNote.textContent =
            vacation.note || "없음";

        detailModal.classList.remove(
            "hidden"
        );

    }


    function renderIndefiniteList(vacations) {

        indefiniteList.innerHTML = "";

        if (!vacations.length) {

            const emptyItem =
                document.createElement("li");

            emptyItem.className = "empty-message";

            emptyItem.textContent =
                "등록된 무기한 휴가가 없습니다.";

            indefiniteList.appendChild(emptyItem);

            return;

        }

        vacations.forEach(
            function (vacation) {

                const item =
                    document.createElement("li");

                item.className = "indefinite-item";

                item.style.borderLeft =
                    "4px solid "
                    + colorForVacation(vacation);

                item.innerHTML =
                    '<span class="indefinite-item-main">'
                    + '<strong></strong>'
                    + '<span class="indefinite-item-reason"></span>'
                    + '</span>'
                    + '<span class="indefinite-badge">무기한</span>';

                item.querySelector("strong").textContent =
                    vacation.person;

                item.querySelector(".indefinite-item-reason")
                    .textContent =
                        vacation.start_date
                            ? vacation.reason
                                + " · "
                                + formatDate(vacation.start_date)
                                + "부터"
                            : vacation.reason;

                item.addEventListener(
                    "click",
                    function () {

                        showVacationDetail(vacation);

                    }
                );

                indefiniteList.appendChild(item);

            }
        );

    }


    function applyIndefiniteState(isIndefinite) {

        endDate.disabled = isIndefinite;

        if (isIndefinite) {

            endDate.value = "";

        }

        vacationTypeGroup.classList.toggle(
            "hidden",
            isIndefinite
        );

    }


    indefinite.addEventListener(
        "change",
        function () {

            applyIndefiniteState(
                indefinite.checked
            );

        }
    );


    function openAddModal() {

        document.getElementById("modalTitle")
            .textContent = "휴가 추가";

        vacationId.value = "";

        person.value = "";

        reason.value = "";

        startDate.value = "";

        endDate.value = "";

        note.value = "";

        syncCharCounters();

        colorHex.value = "";

        updateColorUI();

        setVacationType("regular");

        indefinite.checked = false;

        applyIndefiniteState(false);

        formError.classList.add("hidden");

        deleteButton.classList.add("hidden");

        vacationModal.classList.remove("hidden");
    }


    function openEditModal(vacation) {

        document.getElementById("modalTitle")
            .textContent = "휴가 수정";

        vacationId.value =
            vacation.id;

        person.value =
            vacation.person;

        reason.value =
            vacation.reason;

        indefinite.checked =
            Boolean(vacation.indefinite);

        setVacationType(
            vacation.vacation_type === "regular"
                ? "regular"
                : "irregular"
        );

        applyIndefiniteState(
            indefinite.checked
        );

        startDate.value =
            vacation.start_date || "";

        endDate.value =
            vacation.indefinite ? "" : vacation.end_date;

        note.value =
            vacation.note || "";

        syncCharCounters();

        colorHex.value =
            vacation.color || "";

        updateColorUI();

        formError.classList.add("hidden");

        deleteButton.classList.remove("hidden");

        detailModal.classList.add("hidden");

        vacationModal.classList.remove("hidden");
    }


    function closeVacationModal() {

        vacationModal.classList.add("hidden");
    }


    function closeDetailModal() {

        detailModal.classList.add("hidden");
    }

    addButton.addEventListener(
        "click",
        openAddModal
    );


    closeModalButton.addEventListener(
        "click",
        closeVacationModal
    );


    cancelButton.addEventListener(
        "click",
        closeVacationModal
    );


    closeDetailButton.addEventListener(
        "click",
        closeDetailModal
    );

    let currentView = "calendar";

    let viewDate = new Date();
    viewDate.setDate(1);

    let allVacations = [];


    function isSameLocalDate(a, b) {

        return (
            a.getFullYear() === b.getFullYear()
            && a.getMonth() === b.getMonth()
            && a.getDate() === b.getDate()
        );

    }


    function updateCalendarTitle() {

        calendarTitle.textContent =
            viewDate.toLocaleDateString(
                "ko-KR",
                {
                    year: "numeric",
                    month: "long"
                }
            );

    }


    function updateViewToggleUI() {

        calendarViewButton.classList.toggle(
            "active",
            currentView === "calendar"
        );

        listViewButton.classList.toggle(
            "active",
            currentView === "list"
        );

    }


    function buildEventClickHandler(vacation) {

        return function () {

            showVacationDetail(vacation);

        };

    }


    function renderCalendarView(regularVacations) {

        calendarDays.innerHTML = "";

        const year = viewDate.getFullYear();

        const month = viewDate.getMonth();

        const firstOfMonth =
            new Date(year, month, 1);

        const firstWeekday =
            (firstOfMonth.getDay() + 6) % 7;

        const daysInMonth =
            new Date(year, month + 1, 0).getDate();

        const totalCells =
            Math.ceil((firstWeekday + daysInMonth) / 7) * 7;

        const totalWeeks = totalCells / 7;

        const today = new Date();

        const DAY_NUMBER_HEIGHT = 24;

        const BAR_HEIGHT = 19;

        const BAR_GAP = 3;

        const WEEK_PADDING = 5;

        const MIN_WEEK_HEIGHT = 120;

        for (let w = 0; w < totalWeeks; w++) {

            const weekDates = [];

            for (let d = 0; d < 7; d++) {

                const cellIndex = w * 7 + d;

                weekDates.push(
                    new Date(year, month, cellIndex - firstWeekday + 1)
                );

            }

            const weekStartStr =
                toLocalDateString(weekDates[0]);

            const weekEndStr =
                toLocalDateString(weekDates[6]);

            const weekVacations =
                regularVacations.filter(
                    function (vacation) {

                        return (
                            vacation.start_date <= weekEndStr
                            && weekStartStr <= vacation.end_date
                        );

                    }
                ).sort(
                    function (a, b) {

                        if (a.start_date !== b.start_date) {

                            return a.start_date < b.start_date
                                ? -1
                                : 1;

                        }

                        return a.end_date > b.end_date
                            ? -1
                            : 1;

                    }
                );

            const segments =
                weekVacations.map(
                    function (vacation) {

                        let startCol =
                            weekDates.findIndex(
                                function (date) {
                                    return toLocalDateString(date)
                                        === vacation.start_date;
                                }
                            );

                        let endCol =
                            weekDates.findIndex(
                                function (date) {
                                    return toLocalDateString(date)
                                        === vacation.end_date;
                                }
                            );

                        const isTrueStart = startCol !== -1;

                        const isTrueEnd = endCol !== -1;

                        if (startCol === -1) {
                            startCol = 0;
                        }

                        if (endCol === -1) {
                            endCol = 6;
                        }

                        return {

                            vacation: vacation,

                            startCol: startCol,

                            endCol: endCol,

                            isTrueStart: isTrueStart,

                            isTrueEnd: isTrueEnd,

                            lane: 0

                        };

                    }
                );

            const lanes = [];

            segments.forEach(
                function (segment) {

                    let laneIndex =
                        lanes.findIndex(
                            function (lane) {

                                return lane.every(
                                    function (existing) {

                                        return (
                                            segment.endCol < existing.startCol
                                            || segment.startCol > existing.endCol
                                        );

                                    }
                                );

                            }
                        );

                    if (laneIndex === -1) {

                        laneIndex = lanes.length;

                        lanes.push([]);

                    }

                    lanes[laneIndex].push(segment);

                    segment.lane = laneIndex;

                }
            );

            const laneCount = lanes.length;

            const weekHeight =
                Math.max(
                    MIN_WEEK_HEIGHT,
                    WEEK_PADDING * 2
                        + DAY_NUMBER_HEIGHT
                        + laneCount * (BAR_HEIGHT + BAR_GAP)
                );

            const weekElement =
                document.createElement("div");

            weekElement.className = "calendar-week";

            weekElement.style.height =
                weekHeight + "px";

            const backgroundLayer =
                document.createElement("div");

            backgroundLayer.className = "calendar-week-bg";

            weekDates.forEach(
                function (cellDate) {

                    const isOtherMonth =
                        cellDate.getMonth() !== month;

                    const dayOfWeek =
                        cellDate.getDay();

                    const backgroundCell =
                        document.createElement("div");

                    backgroundCell.className = "calendar-day-bg";

                    if (isOtherMonth) {
                        backgroundCell.classList.add("other-month");
                    }

                    if (isSameLocalDate(cellDate, today)) {
                        backgroundCell.classList.add("is-today");
                    }

                    if (dayOfWeek === 6) {
                        backgroundCell.classList.add("is-saturday");
                    }

                    if (dayOfWeek === 0) {
                        backgroundCell.classList.add("is-sunday");
                    }

                    const dayNumber =
                        document.createElement("div");

                    dayNumber.className = "calendar-day-number";

                    dayNumber.textContent =
                        String(cellDate.getDate());

                    backgroundCell.appendChild(dayNumber);

                    backgroundLayer.appendChild(backgroundCell);

                }
            );

            weekElement.appendChild(backgroundLayer);

            const barsLayer =
                document.createElement("div");

            barsLayer.className = "calendar-week-bars";

            segments.forEach(
                function (segment) {

                    const bar =
                        document.createElement("div");

                    bar.className = "calendar-event-bar";

                    if (!segment.isTrueStart) {
                        bar.classList.add("continues-start");
                    }

                    if (!segment.isTrueEnd) {
                        bar.classList.add("continues-end");
                    }

                    bar.style.left =
                        (segment.startCol / 7) * 100 + "%";

                    bar.style.width =
                        ((segment.endCol - segment.startCol + 1) / 7)
                            * 100 + "%";

                    bar.style.top =
                        (
                            WEEK_PADDING
                            + DAY_NUMBER_HEIGHT
                            + segment.lane * (BAR_HEIGHT + BAR_GAP)
                        ) + "px";

                    bar.style.height =
                        BAR_HEIGHT + "px";

                    bar.style.backgroundColor =
                        colorForVacation(segment.vacation);

                    bar.textContent =
                        segment.vacation.person
                        + " - "
                        + segment.vacation.reason;

                    bar.addEventListener(
                        "click",
                        buildEventClickHandler(segment.vacation)
                    );

                    barsLayer.appendChild(bar);

                }
            );

            weekElement.appendChild(barsLayer);

            calendarDays.appendChild(weekElement);

        }

    }


    function renderListView(regularVacations) {

        listView.innerHTML = "";

        const year = viewDate.getFullYear();

        const month = viewDate.getMonth();

        const monthVacations =
            regularVacations.filter(
                function (vacation) {

                    const start =
                        new Date(vacation.start_date + "T00:00:00");

                    return (
                        start.getFullYear() === year
                        && start.getMonth() === month
                    );

                }
            ).sort(
                function (a, b) {

                    return a.start_date > b.start_date
                        ? -1
                        : a.start_date < b.start_date
                            ? 1
                            : 0;

                }
            );

        if (!monthVacations.length) {

            const emptyMessage =
                document.createElement("div");

            emptyMessage.className = "list-empty-message";

            emptyMessage.textContent =
                "이 달에 시작하는 휴가가 없습니다.";

            listView.appendChild(emptyMessage);

            return;

        }

        monthVacations.forEach(
            function (vacation) {

                const group =
                    document.createElement("div");

                group.className = "list-day-group";

                const heading =
                    document.createElement("div");

                heading.className = "list-day-heading";

                const headingRange =
                    document.createElement("span");

                headingRange.textContent =
                    vacation.start_date === vacation.end_date
                        ? formatDate(vacation.start_date)
                        : formatDate(vacation.start_date)
                            + " ~ "
                            + formatDate(vacation.end_date);

                const status =
                    vacationStatus(vacation);

                const headingStatus =
                    document.createElement("span");

                headingStatus.className =
                    "list-day-heading-status " + status.className;

                headingStatus.textContent =
                    status.label;

                heading.appendChild(headingRange);

                heading.appendChild(headingStatus);

                group.appendChild(heading);

                const row =
                    document.createElement("div");

                row.className = "list-event-row";

                const dot =
                    document.createElement("span");

                dot.className = "list-event-dot";

                dot.style.backgroundColor =
                    colorForVacation(vacation);

                const body =
                    document.createElement("div");

                body.className = "list-event-body";

                const title =
                    document.createElement("div");

                title.className = "list-event-title";

                title.textContent =
                    vacation.person + " - " + vacation.reason;

                body.appendChild(title);

                row.appendChild(dot);

                row.appendChild(body);

                row.addEventListener(
                    "click",
                    buildEventClickHandler(vacation)
                );

                group.appendChild(row);

                listView.appendChild(group);

            }
        );

    }


    function renderCalendarUI() {

        const regularVacations =
            allVacations.filter(
                function (vacation) {
                    return !vacation.indefinite;
                }
            );

        const indefiniteVacations =
            allVacations.filter(
                function (vacation) {
                    return Boolean(vacation.indefinite);
                }
            );

        renderIndefiniteList(indefiniteVacations);

        updateCalendarTitle();

        updateViewToggleUI();

        if (currentView === "calendar") {

            calendarGrid.classList.remove("hidden");

            listView.classList.add("hidden");

            indefiniteSection.classList.add("hidden");

            renderCalendarView(regularVacations);

        }
        else {

            calendarGrid.classList.add("hidden");

            listView.classList.remove("hidden");

            indefiniteSection.classList.remove("hidden");

            renderListView(regularVacations);

        }

    }


    async function loadVacations() {

        try {

            const response =
                await apiFetch("/api/vacations", { headers: authHeaders() });

            if (!response.ok) {
                throw new Error(
                    "휴가 정보를 가져올 수 없습니다."
                );
            }

            allVacations = await response.json();

        }
        catch (error) {

            console.error(error);

            allVacations = [];

        }

        renderCalendarUI();

    }


    prevButton.addEventListener(
        "click",
        function () {

            viewDate.setMonth(viewDate.getMonth() - 1);

            renderCalendarUI();

        }
    );


    nextButton.addEventListener(
        "click",
        function () {

            viewDate.setMonth(viewDate.getMonth() + 1);

            renderCalendarUI();

        }
    );


    todayButton.addEventListener(
        "click",
        function () {

            viewDate = new Date();

            viewDate.setDate(1);

            renderCalendarUI();

        }
    );


    calendarViewButton.addEventListener(
        "click",
        function () {

            currentView = "calendar";

            renderCalendarUI();

        }
    );


    listViewButton.addEventListener(
        "click",
        function () {

            currentView = "list";

            renderCalendarUI();

        }
    );



    function updateClock() {

        const now = new Date();

        const dateText =
            now.toLocaleDateString(
                "ko-KR",
                {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    weekday: "long"
                }
            );

        const timeText =
            now.toLocaleTimeString(
                "ko-KR",
                {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true
                }
            );

        liveClock.textContent =
            dateText + " " + timeText;

    }


    updateClock();

    setInterval(updateClock, 1000);


    let sessionExpiresAt = null;


    function formatRemaining(ms) {

        const totalSeconds =
            Math.max(
                Math.floor(ms / 1000),
                0
            );

        const hours =
            Math.floor(totalSeconds / 3600);

        const minutes =
            Math.floor((totalSeconds % 3600) / 60);

        const seconds =
            totalSeconds % 60;

        return `접속 만료까지 ${hours}시간 ${minutes}분 ${seconds}초 남음`;

    }


    function updateSessionUI() {

        if (!sessionExpiresAt) {
            return;
        }

        const remainingMs =
            sessionExpiresAt.getTime() - Date.now();

        if (remainingMs <= 0) {

            window.location.reload();

            return;

        }

        sessionInfo.textContent =
            formatRemaining(remainingMs);

        sessionInfo.classList.remove("hidden");


        if (remainingMs < 12 * 60 * 60 * 1000) {

            extendSessionButton.classList.remove("hidden");

        }
        else {

            extendSessionButton.classList.add("hidden");

        }

    }


    async function loadSessionInfo() {

        try {

            const response =
                await apiFetch("/api/session-info", { headers: authHeaders() });

            if (!response.ok) {

                console.error(
                    "세션 정보를 가져오지 못했습니다. 상태 코드:",
                    response.status
                );

                return;

            }

            const data =
                await response.json();

            sessionExpiresAt =
                new Date(data.expires_at);

            updateSessionUI();

        }
        catch (error) {

            console.error(error);

        }

    }


    extendSessionButton.addEventListener(
        "click",
        async function () {

            extendSessionButton.disabled = true;

            try {

                const response =
                    await apiFetch(
                        "/api/extend-session",
                        {
                            method: "POST",
                            headers: authHeaders()
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {

                    throw new Error(
                        data.detail ||
                        "연장에 실패했습니다."
                    );

                }

                sessionExpiresAt =
                    new Date(data.expires_at);

                saveToken(data.token, data.expires_at);

                updateSessionUI();

            }
            catch (error) {

                alert(error.message);

            }
            finally {

                extendSessionButton.disabled = false;

            }

        }
    );


    clearCacheButton.addEventListener(
        "click",
        async function () {

            clearCacheButton.disabled = true;

            clearCacheButton.textContent =
                "캐시 삭제 중...";

            try {

                if ("caches" in window) {

                    const cacheKeys =
                        await caches.keys();

                    await Promise.all(
                        cacheKeys.map(
                            function (key) {
                                return caches.delete(key);
                            }
                        )
                    );

                }


                if ("serviceWorker" in navigator) {

                    const registrations =
                        await navigator.serviceWorker
                            .getRegistrations();

                    await Promise.all(
                        registrations.map(
                            function (registration) {
                                return registration.unregister();
                            }
                        )
                    );

                }


                await fetch(
                    window.location.pathname,
                    { cache: "reload" }
                );

            }
            catch (error) {

                console.error(error);

            }
            finally {

                window.location.href =
                    window.location.pathname
                    + "?_cache_bust="
                    + Date.now();

            }

        }
    );


    loadSessionInfo();

    setInterval(updateSessionUI, 1000);
    setInterval(loadSessionInfo, 1000 * 60 * 10);


    loadVacations();

    vacationForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            formError.classList.add(
                "hidden"
            );


            if (!indefinite.checked) {

                if (!startDate.value || !endDate.value) {

                    formError.textContent =
                        "휴가 기간을 입력해주세요.";

                    formError.classList.remove(
                        "hidden"
                    );

                    return;

                }

                if (startDate.value > endDate.value) {

                    formError.textContent =
                        "종료일은 시작일보다 빠를 수 없습니다.";

                    formError.classList.remove(
                        "hidden"
                    );

                    return;

                }

                const dayCount =
                    Math.round(
                        (
                            new Date(endDate.value + "T00:00:00")
                            - new Date(startDate.value + "T00:00:00")
                        ) / (1000 * 60 * 60 * 24)
                    ) + 1;

                if (dayCount > 14) {

                    formError.textContent =
                        "휴가 기간은 14일을 넘을 수 없습니다.";

                    formError.classList.remove(
                        "hidden"
                    );

                    return;

                }

                if (
                    vacationType === "regular"
                    && startDate.value.slice(0, 7)
                        !== endDate.value.slice(0, 7)
                ) {

                    formError.textContent =
                        "정기 휴가는 시작일과 종료일이 같은 달이어야 합니다.";

                    formError.classList.remove(
                        "hidden"
                    );

                    return;

                }

            }


            const id =
                vacationId.value;


            let colorValue =
                colorHex.value.trim();

            if (colorValue && !/^#[0-9A-Fa-f]{6}$/.test(colorValue)) {

                formError.textContent =
                    "색상은 #RRGGBB 형식의 HEX 코드로 입력해주세요.";

                formError.classList.remove(
                    "hidden"
                );

                return;

            }

            if (!colorValue) {

                const sameGroupColors =
                    allVacations.filter(
                        function (v) {

                            if (String(v.id) === id) {
                                return false;
                            }

                            if (indefinite.checked) {
                                return Boolean(v.indefinite);
                            }

                            return !v.indefinite
                                && (v.start_date || "").slice(0, 7)
                                    === startDate.value.slice(0, 7);

                        }
                    ).map(
                        function (v) {
                            return v.color;
                        }
                    );

                colorValue = pickAutoColor(sameGroupColors);

            }


            const payload = {
                person: person.value,
                reason: reason.value,
                indefinite: indefinite.checked,
                vacation_type: indefinite.checked ? "" : vacationType,
                start_date: startDate.value,
                end_date: endDate.value,
                note: note.value,
                color: colorValue
            };

            const jsonHeaders =
                Object.assign(
                    { "Content-Type": "application/json" },
                    authHeaders()
                );


            let response;


            try {

                if (id) {

                    response =
                        await apiFetch(
                            `/api/vacations/${id}`,
                            {
                                method: "PUT",
                                headers: jsonHeaders,
                                body: JSON.stringify(payload)
                            }
                        );

                }
                else {

                    response =
                        await apiFetch(
                            "/api/vacations",
                            {
                                method: "POST",
                                headers: jsonHeaders,
                                body: JSON.stringify(payload)
                            }
                        );

                }


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.detail ||
                        "저장에 실패했습니다."
                    );

                }


                closeVacationModal();


                loadVacations();


            }
            catch (error) {

                formError.textContent =
                    error.message;

                formError.classList.remove(
                    "hidden"
                );

            }

        }
    );

    deleteButton.addEventListener(
        "click",
        async function () {

            const id =
                vacationId.value;


            if (!id) {
                return;
            }


            const confirmed =
                confirm(
                    "정말 이 휴가를 삭제하시겠습니까?"
                );


            if (!confirmed) {
                return;
            }


            try {

                const response =
                    await apiFetch(
                        `/api/vacations/${id}`,
                        {
                            method: "DELETE",
                            headers: authHeaders()
                        }
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.detail ||
                        "삭제에 실패했습니다."
                    );

                }


                closeVacationModal();


                loadVacations();

            }
            catch (error) {

                formError.textContent =
                    error.message;

                formError.classList.remove(
                    "hidden"
                );

            }

        }
    );

    editButton.addEventListener(
        "click",
        function () {

            if (!selectedVacation) {
                return;
            }

            openEditModal(
                selectedVacation
            );

        }
    );

    vacationModal
        .querySelector(".modal-background")
        .addEventListener(
            "click",
            closeVacationModal
        );


    detailModal
        .querySelector(".modal-background")
        .addEventListener(
            "click",
            closeDetailModal
        );

}
