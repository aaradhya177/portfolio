# AaradhyaOS v1.0 — Portfolio Website

> An interactive OS-themed portfolio built by Aaradhya Mehra.
> Boots up like a real operating system, lands on a fully functional desktop,
> and lets visitors explore projects, skills, achievements, and contact info
> through draggable app windows — just like a real OS.

---

## 🖥️ Live Demo

**[aaradhya.dev](https://portfolio-coral-tau-ovbo27wuwd.vercel.app/)** ← replace with your actual deployed URL

---

## 📸 Preview

| Boot Sequence | Desktop | Projects App |
|---|---|---|
| BIOS → Loading → Login | Particle wallpaper + Icons | Finder-style browser |

---

## ✨ Features

### 🚀 Boot Sequence
- **BIOS Screen** — Classic blue POST screen with fake hardware specs
- **Loading Bar** — Animated progress bar with rotating system messages
- **Login Screen** — Glassmorphism card with aurora background, avatar, social links
- **Desktop Reveal** — Smooth fade-in transition to the full desktop

### 🖥️ Desktop Environment
- **Animated Wallpaper** — 8 switchable themes (Deep Space, Cyberpunk, Neural, Ocean, Mars, Matrix, Synthwave, Holographic)
- **Desktop Icons** — 6 app icons, double-click to open
- **Taskbar** — Live clock, open app buttons, Open to Work indicator
- **Right Click Menu** — Context menu with wallpaper switcher, About AaradhyaOS
- **Wallpaper Picker** — Bottom-left button cycles through all 8 wallpapers with thumbnails

### 🪟 Window Manager
- **Draggable Windows** — Drag by title bar, resize from corner
- **Minimize / Maximize / Close** — Full window state management
- **Active Window Glow** — Focused window gets cyan border glow
- **Smooth Animations** — Spring physics on open, fast collapse on close
- **Z-index Stacking** — Click any window to bring it to front

### 📱 Apps

| App | Description |
|---|---|
| 📁 **Projects** | Finder-style browser with case study mode for each project |
| >_ **Terminal** | Real interactive terminal with 10+ commands and fake file system |
| 📄 **Resume** | Inline PDF viewer with download button |
| 👤 **About Me** | Notes-style app with scrollable bio |
| 📬 **Contact** | Mail-style form with working mailto + social quick links |
| 🏆 **Achievements** | Trophy case with animated achievement cards |
| 📊 **Skills** | Radar chart + animated skill bars by category |
| 📈 **Stats** | Live session stats — time on portfolio, apps opened, IST clock |

### 🎮 Easter Eggs
- **Konami Code** — ↑↑↓↓←→←→BA triggers confetti explosion + hire me message
- **F12 Boot Menu** — During BIOS screen, opens boot options (Normal / Safe Mode / Dev Mode)
- **`sudo rm -rf /`** — Screen flickers, permission denied message
- **`hire me`** in terminal — ASCII rocket + witty message

### 🎵 Music Player
- Floating Spotify-style player, bottom-right corner
- Collapsible to mini pill mode
- Animated equalizer bars when playing
- Volume control + progress bar with seeking

### 🔔 Notifications
- Scheduled toast notifications simulating live system activity
- Auto-dismiss with progress bar
- Slide in/out animations

### 🌧️ Rain Effect
- Toggle via right-click context menu
- 3 intensity levels: Light / Medium / Heavy
- Cyan rain drops with splash effect at bottom
- Fog layer on Heavy mode

### 📱 Mobile View
- Fully responsive card-based layout for viewports under 768px
- All 6 sections: Hero, About, Projects, Skills, Achievements, Contact
- Scroll-triggered animations + section nav dots

---

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| **Framework** | React 18 (Vite) |
| **Styling** | TailwindCSS |
| **Animations** | Framer Motion |
| **Window Dragging** | react-draggable |
| **Terminal** | xterm.js |
| **Fonts** | JetBrains Mono, Syne (Google Fonts) |
| **Charts** | Recharts |
| **Deployment** | Vercel |

---

## 📂 Project Structure

```
src/
├── components/
│   ├── boot/
│   │   ├── BiosScreen.jsx         # BIOS POST animation
│   │   ├── LoadingBar.jsx         # OS loading progress bar
│   │   └── LoginScreen.jsx        # Glassmorphism login card
│   ├── desktop/
│   │   ├── Desktop.jsx            # Main desktop canvas
│   │   ├── DesktopIcon.jsx        # Clickable app icons
│   │   ├── Taskbar.jsx            # Bottom taskbar
│   │   └── Wallpaper.jsx          # Animated background router
│   ├── windows/
│   │   ├── WindowFrame.jsx        # Reusable draggable window shell
│   │   ├── ProjectsApp.jsx        # Projects browser + case studies
│   │   ├── TerminalApp.jsx        # xterm.js terminal
│   │   ├── ResumeApp.jsx          # PDF viewer
│   │   ├── AboutApp.jsx           # Notes-style about me
│   │   ├── ContactApp.jsx         # Mail-style contact form
│   │   ├── AchievementsApp.jsx    # Trophy case
│   │   ├── SkillsApp.jsx          # Radar chart + skill bars
│   │   └── StatsApp.jsx           # Live session stats
│   ├── MusicPlayer.jsx            # Floating music player
│   ├── NotificationContainer.jsx  # Toast notification stack
│   ├── ContextMenu.jsx            # Right click menu
│   ├── WallpaperPicker.jsx        # Wallpaper switcher panel
│   ├── ShareButton.jsx            # Copy portfolio URL button
│   ├── OpenToWorkBanner.jsx       # Top internship banner
│   ├── RainCanvas.jsx             # Rain effect overlay
│   ├── Screensaver.jsx            # Idle screensaver
│   └── KonamiEasterEgg.jsx        # Konami code effect
├── hooks/
│   ├── useWindowManager.js        # Window open/close/minimize/focus state
│   ├── useBoot.js                 # Boot sequence state machine
│   ├── useTerminal.js             # Terminal command handler
│   ├── useWallpaper.js            # Wallpaper selection + localStorage
│   ├── useMusicPlayer.js          # Audio playback state
│   ├── useNotifications.js        # Notification queue + scheduling
│   ├── useScreensaver.js          # Idle detection + screensaver
│   └── useZoom.js                 # D3 zoom behavior (if used)
├── wallpapers/
│   ├── DeepSpaceWallpaper.jsx
│   ├── CyberpunkWallpaper.jsx
│   ├── NeuralWallpaper.jsx
│   ├── OceanWallpaper.jsx
│   ├── MarsWallpaper.jsx
│   ├── MatrixWallpaper.jsx
│   ├── SynthwaveWallpaper.jsx
│   └── HolographicWallpaper.jsx
├── data/
│   ├── projects.js                # All project data + case studies
│   ├── skills.js                  # Skills by category with levels
│   ├── achievements.js            # Achievement cards data
│   ├── about.js                   # About me note content
│   ├── profile.js                 # Personal info + social links
│   ├── notifications.js           # Notification schedule
│   ├── terminalCommands.js        # Terminal command definitions
│   ├── fileSystem.js              # Fake file system tree
│   ├── links.js                   # All social URLs in one place
│   └── searchIndex.js             # Spotlight search index
├── styles/
│   └── globals.css                # CSS variables, scrollbar, animations
├── App.jsx                        # Root — boot sequence + desktop render
└── main.jsx                       # Entry point + MotionConfig
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repo
git clone https://github.com/aaradhya177/aaradhyaos-portfolio.git

# Navigate to project
cd aaradhyaos-portfolio

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Adding Your Resume

Place your resume PDF in the `public/` folder:
```
public/
└── Aaradhya_Mehra_Resume.pdf
```
The ResumeApp will automatically load it.

---

## 🎮 Terminal Commands

Open the Terminal app and type any of these:

| Command | Output |
|---|---|
| `help` | Lists all available commands |
| `whoami` | Bio, college, CGPA, target roles |
| `skills` | Skills grouped by category |
| `projects` | All 5 projects with descriptions |
| `education` | College, degree, CGPA, duration |
| `achievements` | All 3 achievements with context |
| `contact` | Email and all social links |
| `download resume` | Triggers resume PDF download |
| `search [keyword]` | Search projects by name, tag, or description |
| `open [project]` | Open a project in the Projects app |
| `ls` | List files in current directory |
| `cd [folder]` | Navigate the fake file system |
| `cat [file]` | Read file contents |
| `pwd` | Print current directory path |
| `tree` | Show full directory tree |
| `clear` | Clear terminal |
| `hire me` | 🚀 Try it |

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl/Cmd + K` | Open Spotlight search |
| `F12` (on BIOS screen) | Open boot menu |
| `F11` (window focused) | Toggle maximize |
| `Escape` | Close search / context menu |
| `↑ ↑ ↓ ↓ ← → ← → B A` | Konami code easter egg |
| `sudo rm -rf /` | Try it in the terminal |

---

## 🎨 Design System

### Colors
```css
--bg-base:        #050508   /* Desktop background */
--bg-window:      #13131a   /* Window background */
--bg-elevated:    #1a1a24   /* Title bars, hover states */
--border:         #2a2a3a   /* Default borders */
--text-primary:   #e2e8f0   /* Primary text */
--text-secondary: #94a3b8   /* Secondary text */
--text-muted:     #64748b   /* Labels, hints */
--accent-cyan:    #00F5FF   /* Projects, primary accent */
--accent-violet:  #A855F7   /* Skills */
--accent-amber:   #F59E0B   /* Achievements */
--accent-emerald: #10B981   /* Education */
--accent-rose:    #F43F5E   /* Contact */
--accent-green:   #22c55e   /* Open to work */
```

### Fonts
- **JetBrains Mono** — All body text, terminal, labels, code
- **Syne** — Headings, project titles, desktop labels

---

## 📦 Build & Deploy

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

Or connect your GitHub repo to [vercel.com](https://vercel.com) for automatic deployments on every push.

---

## 🧑‍💻 About the Developer

**Aaradhya Mehra**
CS undergrad at Bangalore Institute of Technology (CGPA: 8.5/10, graduating June 2027).
Building AI/ML systems and full-stack products. Actively seeking internships in AI/ML Engineering and Software Engineering.

| | |
|---|---|
| 📧 Email | aaradhyamehra240@gmail.com |
| 💼 LinkedIn | [aaradhyamehra-builds](https://www.linkedin.com/in/aaradhyamehra-builds/) |
| 🐙 GitHub | [aaradhya177](https://github.com/aaradhya177) |
| 𝕏 Twitter | [4aradhya_17](https://x.com/4aradhya_17) |
| ♟ Codeforces | [YoullNeverCodeAlone17](https://codeforces.com/profile/YoullNeverCodeAlone17) |

---

## 📄 License

MIT License — feel free to fork and build your own OS portfolio.
If you do, a star ⭐ would be appreciated!

---

<div align="center">
  <p>Built with React + Framer Motion + D3 + xterm.js</p>
  <p>AaradhyaOS v1.0 • Bengaluru, India • 2025</p>
</div>
