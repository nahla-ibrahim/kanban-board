# 🧩 Kanban Board

A modern **Kanban Board web application** to manage tasks efficiently using a simple and intuitive UI.

🚧 **This project is currently under development**

---

## 📸 Preview

<a href="https://kanban-board-weld-five.vercel.app/"> 🔗 LIVE DEMO </a>

---

## 📌 About The Project

This project is a task management application inspired by Kanban methodology (similar to Trello), where users can:

* Organize tasks into columns
* Track progress visually
* Manage workflow easily

The goal is to build a clean, scalable, and real-world project that demonstrates strong frontend skills.

---

## 🚀 Features (Implemented)

* ✅ Create, edit and delete task cards
* ✅ Create, rename and delete columns
* ✅ Give a task a priority, tags and a description — priority and tags show on the card, with a small marker when a description exists
* ✅ Reorder columns with drag & drop
* ✅ Drag & drop tasks within and across columns
* ✅ Duplicate names rejected, with feedback shown to the user
* ✅ Board saved to LocalStorage and restored on reload
* ✅ Works on mobile — columns scroll sideways and the edit dialog fits the screen
* ✅ Clean and reusable components structure

---

## 🔄 Features In Progress / Planned

* ⏳ Move persistence to a backend API
* ⏳ Authentication (Login / Register)
* ⏳ Dark mode 🌙
* ⏳ Better UI/UX improvements

---

## 🛠️ Tech Stack

* **Framework:** Angular 21 (standalone components, signals, zoneless)
* **Language:** TypeScript
* **Styling:** Tailwind CSS v4
* **Drag & Drop:** Angular CDK
* **Notifications:** Angular Material (snack bar)
* **Forms:** Angular signal forms
* **Testing:** Vitest
* **Other Tools:** Git & GitHub

---

## 🧱 Architecture

All board state lives in a single `BoardStore` service built on Angular signals.
It owns the list of columns, every validation rule, and saving to LocalStorage.

Components render what the store exposes and go through it for anything that changes
the board, so the board's rules are never duplicated across the UI. Swapping
LocalStorage for an API later would only touch the store.

```
src/app/
├── pages/board/              # the board page
└── shared/
    ├── components/           # list, single-task, edit-modal, confirm-btn, add-new-list
    ├── directives/           # click-outside
    ├── models/               # TaskData, ListData
    └── services/             # BoardStore
```

---

## ▶️ Getting Started

To run the project locally:

```bash
git clone https://github.com/nahla-ibrahim/kanban-board.git
cd kanban-board
npm install
npm start
```

Then open:

```
http://localhost:4200
```

---

## 🧪 Testing

Unit tests cover the board logic in `BoardStore` — validation, adding and deleting,
moving tasks between columns, and falling back to a default board when the saved
data cannot be read.

```bash
npm test
```

---

## 🎯 Goals

This project is built to:

* Practice real-world frontend development
* Improve problem-solving skills
* Build a strong portfolio project

---

## 📬 Contact

If you have any feedback or suggestions, feel free to reach out!

---

⭐ Don't forget to star the repo if you like it!
