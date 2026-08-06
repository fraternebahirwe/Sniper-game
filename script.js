// ==========================================================================
// CONFIGURATION ET ÉLÉMENTS
// ==========================================================================
const GAME_DURATION = 10; // Durée de la partie en secondes
let score = 0;
let timeLeft = GAME_DURATION;
let gameInterval;
let gameActive = false;

// Récupération du meilleur score sauvegardé dans le navigateur
let bestScore = localStorage.getItem('sniperBestScore') ? parseInt(localStorage.getItem('sniperBestScore')) : 0;

const gameArea = document.getElementById('game-area');
const gameOverlay = document.getElementById('game-overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlayDesc = document.getElementById('overlay-desc');
const finalScoreBox = document.getElementById('final-score-box');
const scoreVal = document.getElementById('score-val');
const bestVal = document.getElementById('best-val');
const finalScoreVal = document.getElementById('final-score-val');
const timerBar = document.getElementById('timer-bar');
const actionBtn = document.getElementById('action-btn');
const targets = document.querySelectorAll('.target');

// Affichage initial du meilleur record au chargement
bestVal.textContent = bestScore;

// ==========================================================================
// MÉCANIQUES DE JEU
// ==========================================================================

function startGame() {
    score = 0;
    timeLeft = GAME_DURATION;
    gameActive = true;
    
    scoreVal.textContent = score;
    timerBar.style.width = '100%';
    timerBar.style.backgroundColor = 'var(--success)';
    
    // Cacher l'écran de menu
    gameOverlay.classList.add('hidden');
    
    // Positionner et afficher toutes les cibles
    targets.forEach(target => {
        target.classList.remove('hidden', 'hit-animation');
        moveTargetRandomly(target);
    });
    
    // Lancer la boucle de temps
    gameInterval = setInterval(updateFrame, 100);
}

function updateFrame() {
    timeLeft -= 0.1;
    
    // Gestion visuelle de la barre de temps
    const percentage = (timeLeft / GAME_DURATION) * 100;
    timerBar.style.width = `${percentage}%`;
    
    if (timeLeft <= 3) {
        timerBar.style.backgroundColor = 'var(--danger)';
    } else if (timeLeft <= 6) {
        timerBar.style.backgroundColor = '#f1c40f';
    }

    if (timeLeft <= 0) {
        endGame();
    }
}

function moveTargetRandomly(target) {
    if (!gameActive) return;
    
    // Coordonnées aléatoires dans la zone de jeu (450px)
    const x = Math.floor(Math.random() * 370) + 40;
    const y = Math.floor(Math.random() * 370) + 40;
    
    target.style.left = `${x}px`;
    target.style.top = `${y}px`;
}

function endGame() {
    gameActive = false;
    clearInterval(gameInterval);
    
    // Masquer les cibles
    targets.forEach(target => target.classList.add('hidden'));
    
    // Vérification et sauvegarde du Meilleur Record
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('sniperBestScore', bestScore); // Sauvegarde locale
        bestVal.textContent = bestScore;
        overlayTitle.textContent = "🏆 NOUVEAU RECORD !";
    } else {
        overlayTitle.textContent = "Temps Écoulé !";
    }
    
    // Configurer l'écran de fin
    overlayDesc.textContent = "Fin de la session de tir.";
    finalScoreVal.textContent = score;
    finalScoreBox.classList.remove('hidden');
    actionBtn.textContent = "🔄 Recommencer";
    
    gameOverlay.classList.remove('hidden');
}

// ==========================================================================
// ÉVÉNEMENTS CONTROLES
// ==========================================================================

actionBtn.addEventListener('click', startGame);

targets.forEach(target => {
    target.addEventListener('mousedown', (e) => {
        if (!gameActive || target.classList.contains('hit-animation')) return;
        
        // Empêche le flash rouge de tir manqué
        e.stopPropagation();
        
        // C'est ici que le score augmente enfin !
        score++;
        scoreVal.textContent = score;
        
        // Effet visuel d'impact
        target.classList.add('hit-animation');
        
        // Déplace la cible après son explosion
        setTimeout(() => {
            target.classList.remove('hit-animation');
            moveTargetRandomly(target);
        }, 200);
    });
});