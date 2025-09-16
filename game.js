// --- ‼️ YOU ONLY NEED TO EDIT THIS SECTION ‼️ ---
const players = [
    { id: "nasra", name: "Nasra", avatar: "avatars/nasra.png", sqo: 0, partnerSqo: 0, weeklyWins: 0 },
    { id: "clement", name: "Clement", avatar: "avatars/clement.png", sqo: 0, partnerSqo: 0, weeklyWins: 0 },
    { id: "ahmad", name: "Ahmad", avatar: "avatars/ahmad.png", sqo: 1, partnerSqo: 0, weeklyWins: 0 },
    { id: "pouya", name: "Pouya", avatar: "avatars/pouya.png", sqo: 2, partnerSqo: 0, weeklyWins: 0 },
    { id: "valentin", name: "Valentin", avatar: "avatars/valentin.png", sqo: 1, partnerSqo: 0, weeklyWins: 0 },
    { id: "mara", name: "Mara", avatar: "avatars/mara.png", sqo: 0, partnerSqo: 0, weeklyWins: 0 },
    { id: "lylia", name: "Lylia", avatar: "avatars/lylia.png", sqo: 4, partnerSqo: 0, weeklyWins: 0 },
    { id: "antho", name: "Antho", avatar: "avatars/antho.png", sqo: 0, partnerSqo: 0, weeklyWins: 0 },
];

// TRANSLATED: All special spaces are now in English
const specialSpaces = {
    // Dons de la Montagne (Instantanés)
    7: { type: 'good', title: 'Fountain of Youth', description: 'Immediate gain of +3 steps.' },
    24: { type: 'good', title: 'Energy Geyser', description: 'Immediate gain of +5 steps.' },
    28: { type: 'good', title: 'Shortcut of the Ancients', description: 'Gain +2 steps per Echo Bonus won.' },
    31: { type: 'good', title: 'Fountain of Youth', description: 'Immediate gain of +3 steps.' },

    // Faveurs des Anciens (Stratégiques)
    12: { type: 'good', title: 'Altar of Clarity', description: 'Your next Regular SQO is doubled (worth 6 steps).' },
    18: { type: 'good', title: 'The Conqueror\'s Forge', description: 'Your next Partner SQO grants +3 extra steps (10 total).' },
    36: { type: 'good', title: 'The Conqueror\'s Forge', description: 'Your next Partner SQO grants +3 extra steps (10 total).' },
    41: { type: 'good', title: 'Altar of Clarity', description: 'Your next Regular SQO is doubled (worth 6 steps).' },
};
// --- END OF EDIT SECTION ---


// --- Don't touch the code below this line ---
const TOTAL_SPACES = 50;
const COLUMNS = 10;
const POINTS_SQO = 3;
const POINTS_PARTNER = 7;
const POINTS_ECHO = 5;

const board = document.getElementById('game-board');
const spriteLayer = document.getElementById('sprite-layer');
const leaderboardBody = document.getElementById('leaderboard-body');
const legendList = document.getElementById('legend-list');
const scoringRulesContainer = document.getElementById('scoring-rules');

function getZone(spaceNumber) { if (spaceNumber <= 10) return 'zone-plains'; if (spaceNumber <= 20) return 'zone-caves'; if (spaceNumber <= 30) return 'zone-pass'; if (spaceNumber <= 40) return 'zone-forest'; return 'zone-citadel'; }

function createBoardAndLegend() {
    board.innerHTML = '';
    legendList.innerHTML = '';
    for (let i = 1; i <= TOTAL_SPACES; i++) {
        const space = document.createElement('div');
        space.classList.add('game-space');
        space.id = `space-${i}`;
        space.textContent = i;
        space.classList.add(getZone(i));
        if (specialSpaces[i]) { space.classList.add(`special-${specialSpaces[i].type}`); }
        if (i === TOTAL_SPACES) space.classList.add('finish-space');
        board.appendChild(space);
    }
    for (const spaceNum in specialSpaces) { const space = specialSpaces[spaceNum]; const li = document.createElement('li'); li.innerHTML = `<strong>[${spaceNum}] ${space.title}</strong><span>${space.description}</span>`; legendList.appendChild(li); }
}

function createRulesDisplay() {
    // TRANSLATED: The rules display is now in English
    scoringRulesContainer.innerHTML = `
        <h3>Point System</h3>
        <ul>
            <li><strong>Regular SQO:</strong> ${POINTS_SQO} steps</li>
            <li><strong>Partner SQO:</strong> ${POINTS_PARTNER} steps</li>
            <li><strong>Echo Bonus:</strong> ${POINTS_ECHO} steps</li>
        </ul>
    `;
}

function calculateAndSortPlayers() {
    players.forEach(player => {
        player.position = (player.sqo * POINTS_SQO) + (player.partnerSqo * POINTS_PARTNER) + (player.weeklyWins * POINTS_ECHO);
    });
    players.sort((a, b) => b.position - a.position);
}

function updateLeaderboard() {
    leaderboardBody.innerHTML = '';
    players.forEach((player, index) => {
        const row = document.createElement('tr');
        const heroCell = `<div class="hero-cell"><img src="${player.avatar}" alt="${player.name}"><span>${player.name}</span></div>`;
        row.innerHTML = `<td>${index + 1}</td><td>${heroCell}</td><td>${player.sqo}</td><td>${player.partnerSqo}</td><td>${player.weeklyWins}</td><td><strong>${player.position}</strong></td>`;
        leaderboardBody.appendChild(row);
    });
}

function createPlayerSprites() {
    spriteLayer.innerHTML = '';
    players.forEach(player => {
        const sprite = document.createElement('div');
        sprite.classList.add('player-sprite');
        sprite.id = `sprite-${player.id}`;
        const avatarImg = document.createElement('img');
        avatarImg.src = player.avatar;
        sprite.appendChild(avatarImg);
        spriteLayer.appendChild(sprite);
        moveSprite(player.id, player.position);
    });
}

function moveSprite(playerId, position) {
    const sprite = document.getElementById(`sprite-${playerId}`);
    let finalPosition = position < 1 ? 1 : position;
    if (finalPosition > TOTAL_SPACES) finalPosition = TOTAL_SPACES;

    const positionIndex = finalPosition - 1;
    const colIndex = positionIndex % COLUMNS;
    const rowIndex = Math.floor(positionIndex / COLUMNS);

    sprite.style.left = `${colIndex * (100 / COLUMNS)}%`;
    sprite.style.top = `${rowIndex * (100 / (TOTAL_SPACES / COLUMNS))}%`;

    const targetSpace = document.getElementById(`space-${finalPosition}`);
    if (targetSpace) {
        targetSpace.classList.add('flash-animation');
        setTimeout(() => { targetSpace.classList.remove('flash-animation'); }, 800);
    }
}

// --- Main execution ---
createBoardAndLegend();
createRulesDisplay();
calculateAndSortPlayers();
updateLeaderboard();
createPlayerSprites();
