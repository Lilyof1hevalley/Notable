const Database = require('better-sqlite3');
const path = require('path');
const crypto = require('crypto');

const dbPath = path.join(__dirname, 'database', 'notable.db');
const db = new Database(dbPath);

console.log('Connected to the database for seeding.');

// Ensure we have at least one user
let user = db.prepare('SELECT id FROM users LIMIT 1').get();

if (!user) {
    console.log('No user found, creating a dummy user...');
    const userId = crypto.randomUUID();
    db.prepare(`
        INSERT INTO users (id, name, email, password_hash, display_name, role)
        VALUES (?, ?, ?, ?, ?, ?)
    `).run(userId, 'Dummy User', 'dummy@example.com', 'dummyhash', 'Dummy', 'user');
    user = { id: userId };
}

const userId = user.id;

console.log(`Using user ID: ${userId}`);

// Create some folders
const folderTitles = ['University', 'Personal', 'Work', 'Projects', 'Ideas', 'Archive'];
const folderIds = [];

const insertFolder = db.prepare('INSERT INTO folders (id, user_id, title) VALUES (?, ?, ?)');

for (const title of folderTitles) {
    const folderId = crypto.randomUUID();
    insertFolder.run(folderId, userId, title);
    folderIds.push(folderId);
}
console.log(`Created ${folderTitles.length} folders.`);

// Create many notebooks
const insertNotebook = db.prepare('INSERT INTO notebooks (id, user_id, folder_id, title) VALUES (?, ?, ?, ?)');

const subjects = ['Mathematics', 'Physics', 'Computer Science', 'History', 'Literature', 'Biology', 'Chemistry', 'Art', 'Music', 'Philosophy'];
const adjectives = ['Advanced', 'Introductory', 'Applied', 'Theoretical', 'Modern', 'Classical', 'Fundamentals of', 'Exploring', 'Deep Dive into', 'Basics of'];

let notebookCount = 0;

db.transaction(() => {
    for (let i = 0; i < 200; i++) {
        const notebookId = crypto.randomUUID();
        const folderId = folderIds[Math.floor(Math.random() * folderIds.length)]; // random folder
        const title = `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${subjects[Math.floor(Math.random() * subjects.length)]} ${i + 1}`;
        insertNotebook.run(notebookId, userId, folderId, title);
        notebookCount++;
    }
})();

console.log(`Successfully injected ${notebookCount} dummy notebooks!`);

db.close();
