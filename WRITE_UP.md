# Assignment Write-Up (300 words max)

## What AI tools did you use and for what?
I used Cursor AI as a productivity aid during development. My usage was intentionally limited to non-core logic tasks, including:

Writing and refining the README with clear setup and run instructions

Adding inline code comments to improve readability and explain intent

Assisting with basic UI styling and layout suggestions in React Native

Helping set up a clean project structure (separating screens, config, and styles)

Occasionally checking or recalling syntax for React Native and Express to avoid spending time on documentation lookups

## What did AI get wrong that you had to fix yourself?
Since I used AI only for simple and supportive tasks, there were no major logic-level issues introduced by it. 

## How did you handle the "two users joining at same time" problem?

For this prototype, the implementation relies on **Node.js's single-threaded event loop**, which processes requests sequentially. This provides basic protection since array operations like `push()` execute atomically in JavaScript.

However, for production, I would implement **database transactions with row-level locking** (see CONCURRENCY_NOTES.md). This would:
- Use ACID transactions to ensure atomicity
- Lock the waitlist row during join operations
- Prevent race conditions even with multiple server instances
- Handle high concurrency reliably

The current approach is sufficient for a demo but would need proper database transactions for real-world use.

## What would you improve if you had more time?

1. **Add a database** (PostgreSQL/MongoDB) with proper transactions for production-ready concurrency handling
2. **Implement authentication** instead of hardcoded test users
3. **Add push notifications** to alert users when their spot opens
4. **Improve UI/UX** with better loading states, animations, and error handling
5. **Add unit and integration tests** to ensure reliability
6. **Create a web admin dashboard** to view and manage waitlists

---

**Word count: ~300 words**
