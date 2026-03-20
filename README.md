# SafeStart Dashboard 

## What is this?

This is a **website** that shows security information. You will run it on your own computer.

---

# PART 1: INSTALL NODE.JS

Node.js is a program that runs our website. You need to install it first.

## Step 1.1: Download Node.js

1. Open your internet browser (Chrome, Edge, Firefox)

2. Go to this website:
   ```
   https://nodejs.org
   ```

3. You will see a green button that says **"LTS"** - click it

4. A file will download (about 30 MB)

## Step 1.2: Install Node.js

1. Find the downloaded file (usually in your Downloads folder)
   - The file is called something like: `node-v20.11.0-x64.msi`

2. Double-click the file to open it

3. Click **"Next"**

4. Check the box "I accept the terms" and click **"Next"**

5. Keep clicking **"Next"** (don't change anything)

6. Click **"Install"**

7. If Windows asks "Do you want to allow this app?" click **"Yes"**

8. Wait for it to finish

9. Click **"Finish"**

## Step 1.3: Restart Your Computer

**Important!** Restart your computer now. This makes sure Node.js works.

## Step 1.4: Check Node.js is Working

1. Press the **Windows key** on your keyboard

2. Type: `cmd`

3. Click on **"Command Prompt"**

4. A black window will open

5. Type this exactly and press Enter:
   ```
   node --version
   ```

6. You should see something like: `v20.11.0`

   - **If you see a version number** = Node.js is installed! Go to Part 2.
   - **If you see an error** = Go back to Step 1.1 and try again.

---

# PART 2: OPEN THE PROJECT

## Step 2.1: Open Command Prompt

1. Press the **Windows key** on your keyboard

2. Type: `cmd`

3. Click on **"Command Prompt"**

4. A black window opens

## Step 2.2: Go to the Project Folder

1. In the black window, type this exactly:
   ```
   cd C:\Users\Public\safestart-dashboard
   ```

2. Press **Enter**

3. The line should now show: `C:\Users\Public\safestart-dashboard>`

---

# PART 3: INSTALL THE PROJECT

This downloads extra files the project needs. **You only do this once.**

## Step 3.1: Run the Install Command

1. In the same black window, type:
   ```
   npm install
   ```

2. Press **Enter**

3. Wait. You will see text scrolling. This takes 30-60 seconds.

4. When it's done, you'll see something like:
   ```
   added 64 packages in 5s
   ```

5. Done! Go to Part 4.

---

# PART 4: START THE WEBSITE

## Step 4.1: Run the Start Command

1. In the same black window, type:
   ```
   npm start
   ```

2. Press **Enter**

3. You should see:
   ```
   SafeStart Security Dashboard running at http://localhost:3000
   ```

4. **DO NOT CLOSE THIS WINDOW!** The website only works while this window is open.

---

# PART 5: OPEN THE WEBSITE

## Step 5.1: Open Your Browser

1. Open Chrome, Edge, or Firefox

2. Click in the address bar at the top

3. Type this exactly:
   ```
   http://localhost:3000
   ```

4. Press **Enter**

5. **You should see the SafeStart Dashboard!**

---

# PART 6: STOP THE WEBSITE

When you are done:

1. Go back to the black Command Prompt window

2. Press **Ctrl + C** (hold Ctrl and press C)

3. If it asks "Terminate batch job?" type: `Y` and press Enter

4. The website is now stopped

5. You can close the black window

---

# HOW TO START AGAIN NEXT TIME

After the first time, you only need to do this:

1. Open Command Prompt (Windows key → type "cmd" → Enter)

2. Type: `cd C:\Users\Public\safestart-dashboard` → Enter

3. Type: `npm start` → Enter

4. Open browser to: `http://localhost:3000`

That's it! You don't need to run `npm install` again.

---

# QUICK CHEAT SHEET

```
╔═══════════════════════════════════════════════════════════╗
║                     HOW TO RUN                            ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║   1. Open Command Prompt                                  ║
║                                                           ║
║   2. Type: cd C:\Users\Public\safestart-dashboard         ║
║                                                           ║
║   3. Type: npm install  (only first time!)                ║
║                                                           ║
║   4. Type: npm start                                      ║
║                                                           ║
║   5. Open browser: http://localhost:3000                  ║
║                                                           ║
║   6. To stop: Press Ctrl+C                                ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

---

# COMMON PROBLEMS

## "npm is not recognized"

**Meaning:** Node.js is not installed.

**Fix:** Go back to Part 1 and install Node.js. Make sure to restart your computer.

---

## "Cannot find path"

**Meaning:** You typed the folder path wrong.

**Fix:** Make sure you type exactly: `cd C:\Users\Public\safestart-dashboard`

---

## "Port 3000 is already in use"

**Meaning:** Something else is using port 3000.

**Fix:** 
1. Type: `set PORT=3001 && npm start`
2. Then open browser to: `http://localhost:3001`

---

## Browser says "This site can't be reached"

**Meaning:** The server is not running.

**Fix:** 
1. Make sure the black Command Prompt window is still open
2. Make sure it shows "SafeStart Security Dashboard running"
3. If not, type `npm start` again

---

## Page looks wrong / no colors

**Meaning:** Browser cache issue.

**Fix:** Press **Ctrl + Shift + R** to refresh the page

---

# WHAT DO THE FILES DO?

| File | What It Does |
|------|--------------|
| `server.js` | The engine that runs the website |
| `public/index.html` | The webpage you see |
| `public/css/styles.css` | The colors and layout |
| `public/js/main.js` | The animations and buttons |
| `package.json` | List of things the project needs |

---

# GLOSSARY (WORDS EXPLAINED)

| Word | Meaning |
|------|---------|
| **Node.js** | A program that runs JavaScript code on your computer |
| **npm** | A tool that downloads extra code libraries |
| **Command Prompt** | The black window where you type commands |
| **localhost** | Your own computer (not the internet) |
| **Port 3000** | A "door" on your computer where the website runs |
| **Server** | A program that sends web pages to your browser |

---

# SUMMARY

**First time setup:**
1. Install Node.js from nodejs.org
2. Restart computer
3. Open Command Prompt
4. `cd C:\Users\Public\safestart-dashboard`
5. `npm install`
6. `npm start`
7. Open browser to `http://localhost:3000`

**Every time after:**
1. Open Command Prompt
2. `cd C:\Users\Public\safestart-dashboard`
3. `npm start`
4. Open browser to `http://localhost:3000`

**To stop:**
- Press `Ctrl + C` in Command Prompt
