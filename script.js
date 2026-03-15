document.addEventListener('DOMContentLoaded', () => {

    const bgMusic = document.getElementById('bgMusic');
    const startOverlay = document.getElementById('startOverlay');
    let experienceStarted = false;

    // Click-to-start: unmute and begin
    startOverlay.addEventListener('click', () => {
        if (!experienceStarted) {
            experienceStarted = true;
            bgMusic.muted = false;
            bgMusic.volume = 0.45;
            bgMusic.play().catch(e => console.log('Audio play failed:', e));
            startOverlay.classList.add('hidden');
        }
    });

    // Fallback: try autoplay immediately
    bgMusic.volume = 0.45;
    bgMusic.play().then(() => {
        // Autoplay succeeded, hide overlay
        startOverlay.classList.add('hidden');
        experienceStarted = true;
    }).catch(() => {
        // Autoplay blocked, user must click
        console.log('Autoplay blocked - waiting for user interaction');
    });

    // ── Scene management ──────────────────────────────────────
    function goTo(id) {
        document.querySelectorAll('.scene.active').forEach(s => {
            s.classList.remove('active');
            s.classList.add('out');
            setTimeout(() => s.classList.remove('out'), 1600);
        });
        setTimeout(() => {
            const next = document.getElementById(id);
            if (next) next.classList.add('active');
        }, 650);
    }

    // ── Particles ─────────────────────────────────────────────
    (function spawnParticles() {
        const container = document.getElementById('particles');
        const css = `
            @keyframes p0 {
                0%,100% { transform: translate(0,0) scale(1);    opacity: .55; }
                50%      { transform: translate(14px,-50px) scale(1.25); opacity: .8;  }
            }
            @keyframes p1 {
                0%,100% { transform: translate(0,0) scale(1);    opacity: .4; }
                50%      { transform: translate(-20px,-38px) scale(.7); opacity: .25; }
            }
            @keyframes p2 {
                0%,100% { transform: translate(0,0);   opacity: .6; }
                33%      { transform: translate(22px,-28px); opacity: .85; }
                66%      { transform: translate(-12px,-55px); opacity: .3; }
            }
        `;
        const st = document.createElement('style');
        st.textContent = css;
        document.head.appendChild(st);

        // Warm amber / ember palette — no red, matches parchment theme
        const colors = [
            [212, 175, 55],   // gold
            [200, 145, 40],   // amber
            [230, 190, 80],   // bright gold
            [180, 110, 25],   // bronze
        ];

        for (let i = 0; i < 50; i++) {
            const p   = document.createElement('div');
            const sz  = Math.random() * 3 + 0.6;
            const c   = colors[Math.floor(Math.random() * colors.length)];
            const op  = Math.random() * 0.4 + 0.15;
            const dur = 16 + Math.random() * 24;
            const del = -(Math.random() * dur);
            p.style.cssText = `
                position:absolute;
                width:${sz}px; height:${sz}px;
                border-radius:50%;
                background:rgba(${c[0]},${c[1]},${c[2]},${op});
                box-shadow:0 0 ${sz * 3.5}px rgba(${c[0]},${c[1]},${c[2]},${op * 0.7});
                left:${Math.random() * 100}vw;
                top:${Math.random() * 100}vh;
                animation:p${i % 3} ${dur}s ease-in-out ${del}s infinite;
            `;
            container.appendChild(p);
        }
    })();

    // ── Cinematic sequence ────────────────────────────────────
    // Scene 1: Intro (0ms) — 5.8s view
    // Scene 2: Raven (5.8s + 650ms transition)
    //   Raven animation: 3.8s, feather follows at 3s offset
    //   Total raven scene: 5.5s
    // Scene 3: Sealed letter (user arrives, auto-shown)
    // Scene 4: Message (user clicks seal)

    const T_INTRO  = 5800;
    const T_RAVEN  = T_INTRO + 650 + 5500;   // 11950ms

    // Intro → Raven
    setTimeout(() => {
        goTo('scene-raven');
    }, T_INTRO);

    // Raven → Sealed letter
    setTimeout(() => {
        goTo('scene-letter');
    }, T_RAVEN);

    // Sealed letter → Message (user clicks wax seal)
    document.getElementById('sealBtn').addEventListener('click', () => {
        goTo('scene-message');
    });
});
