# Assignment Write-Up (300 words max)

## What AI tools did you use and for what?

I used **Cursor AI (with Auto agent)** to help build this trip waitlist feature. The AI assisted with:
- Setting up the initial project structure for both backend and mobile app
- Writing the Express.js API endpoints (join waitlist, check position, simulate spot opening)
- Creating the React Native screen component with proper state management
- Structuring the code into separate files (screens, config, styles) for better organization
- Troubleshooting Expo SDK version compatibility issues
- Fixing network connectivity issues between mobile app and backend server

The AI helped me understand the requirements and generate boilerplate code quickly, especially since I had limited backend experience.

## What did AI get wrong that you had to fix yourself?

Several issues required manual fixes:
1. **Version incompatibilities**: The AI initially suggested React 19.0.0 and React Native 0.79.6, but these were incompatible with Expo SDK 53. I had to research and fix this to use React 18.3.1 and React Native 0.76.5.

2. **Button tap issues**: TouchableOpacity buttons weren't working initially. The AI's initial solution didn't fully resolve it - I had to add proper `activeOpacity` props and ensure ScrollView wasn't blocking touch events.

3. **Network configuration**: The AI didn't account for physical device testing. I had to manually configure the API to use my computer's IP address instead of localhost when testing on my phone.

4. **File structure**: The AI created files but I had to reorganize them into a proper `src/screens`, `src/config`, `src/styles` structure for better maintainability.

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
6. **Implement rate limiting** to prevent API abuse
7. **Add logging and monitoring** for production debugging
8. **Create a web admin dashboard** to view and manage waitlists

---

**Word count: ~300 words**
