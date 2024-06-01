document.addEventListener('DOMContentLoaded', () => {
    const playerForm = document.getElementById('playerForm');
    const playerNameInput = document.getElementById('playerName');
    const playerLevelSelect = document.getElementById('playerLevel');
    const playerListDiv = document.getElementById('playerList');
    const togglePlayerListButton = document.getElementById('togglePlayerList');
    const generateTeamsButton = document.getElementById('generateTeams');
    const generateTournamentButton = document.getElementById('generateTournament');
    const teamsDiv = document.getElementById('teams');
    const tournamentDiv = document.getElementById('tournament');
    const editModal = document.getElementById('editModal');
    const closeModal = document.getElementsByClassName('close')[0];
    const editPlayerForm = document.getElementById('editPlayerForm');
    const editPlayerNameInput = document.getElementById('editPlayerName');
    const editPlayerLevelSelect = document.getElementById('editPlayerLevel');

    let players = JSON.parse(localStorage.getItem('players')) || [];
    let editIndex = null;

    function savePlayersToLocalStorage() {
        localStorage.setItem('players', JSON.stringify(players));
    }

    function displayPlayers() {
        playerListDiv.innerHTML = '';
        players.forEach((player, index) => {
            const playerDiv = document.createElement('div');
            playerDiv.className = 'player';
            playerDiv.innerHTML = `${player.name} (${player.level}) 
                <button class="edit" onclick="editPlayer(${index})">Edit</button>
                <button class="delete" onclick="deletePlayer(${index})">Delete</button>`;
            playerListDiv.appendChild(playerDiv);
        });
    }

    function generateBalancedTeams(players) {
        const teams = [];
        const levelGroups = { A: [], B: [], C: [] };

        players.forEach(player => {
            levelGroups[player.level].push(player);
        });

        while (teams.length < players.length / 2) {
            const team = [];

            if (levelGroups.A.length > 0) team.push(levelGroups.A.pop());
            if (team.length < 2 && levelGroups.C.length > 0) team.push(levelGroups.C.pop());

            if (team.length < 2 && levelGroups.B.length > 0) team.push(levelGroups.B.pop());
            if (team.length < 2 && levelGroups.B.length > 0) team.push(levelGroups.B.pop());

            if (team.length < 2 && levelGroups.A.length > 0) team.push(levelGroups.A.pop());
            if (team.length < 2 && levelGroups.C.length > 0) team.push(levelGroups.C.pop());

            if (team.length === 2) {
                teams.push(team);
            }
        }

        return teams;
    }

    function generateTournamentSchedule(teams) {
        const schedule = [];
        const numTeams = teams.length;

        for (let round = 0; round < numTeams - 1; round++) {
            for (let i = 0; i < numTeams / 2; i++) {
                const team1 = (round + i) % (numTeams - 1);
                let team2 = (numTeams - 1 - i + round) % (numTeams - 1);

                if (i === 0) {
                    team2 = numTeams - 1;
                }

                schedule.push({ team1: `Team ${team1 + 1}`, team2: `Team ${team2 + 1}` });
            }
        }

        return schedule;
    }

    function editPlayer(index) {
        const player = players[index];
        editPlayerNameInput.value = player.name;
        editPlayerLevelSelect.value = player.level;
        editIndex = index;
        editModal.style.display = 'block';
    }

    function deletePlayer(index) {
        players.splice(index, 1);
        savePlayersToLocalStorage();
        displayPlayers();
    }

    playerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const playerName = playerNameInput.value.trim();
        const playerLevel = playerLevelSelect.value;
        if (playerName && playerLevel) {
            if (editIndex !== null) {
                players[editIndex] = { name: playerName, level: playerLevel };
                editIndex = null;
            } else {
                players.push({ name: playerName, level: playerLevel });
            }
            savePlayersToLocalStorage();
            displayPlayers();
            playerForm.reset();
        }
    });

    editPlayerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const editedName = editPlayerNameInput.value.trim();
        const editedLevel = editPlayerLevelSelect.value;
        if (editedName && editedLevel) {
            players[editIndex].name = editedName;
            players[editIndex].level = editedLevel;
            savePlayersToLocalStorage();
            displayPlayers();
            editModal.style.display = 'none';
        }
    });

    togglePlayerListButton.addEventListener('click', () => {
        playerListDiv.classList.toggle('collapsible');
    });

    window.onclick = function(event) {
        if (event.target === editModal) {
            editModal.style.display = 'none';
        }
    }

    closeModal.onclick = function() {
        editModal.style.display = 'none';
    }

    generateTeamsButton.addEventListener('click', () => {
        if (players.length < 4 || players.length % 2 !== 0) {
            alert('An even number of at least 4 players is required to form teams.');
            return;
        }
        const teams = generateBalancedTeams(players);
        displayTeams(teams);
    });

    generateTournamentButton.addEventListener('click', () => {
        if (players.length < 4 || players.length % 2 !== 0) {
            alert('An even number of at least 4 players is required to form teams.');
            return;
        }
        const teams = generateBalancedTeams(players);
        displayTeams(teams);
        const tournament = generateTournamentSchedule(teams);
        displayTournament(tournament);
    });

    function displayTeams(teams) {
        teamsDiv.innerHTML = '';
        teams.forEach((team, index) => {
            const teamDiv = document.createElement('div');
            teamDiv.className = 'team';
            teamDiv.textContent = `Team ${index + 1}: ${team.map(player => player.name).join(' and ')}`;
            teamsDiv.appendChild(teamDiv);
        });
    }

    function displayTournament(schedule) {
        tournamentDiv.innerHTML = '<h3>Tournament Schedule</h3>';
        schedule.forEach((match, index) => {
            const matchDiv = document.createElement('div');
            matchDiv.className = 'match';
            matchDiv.textContent = `Match ${index + 1}: ${match.team1} vs ${match.team2}`;
            tournamentDiv.appendChild(matchDiv);
        });
    }

    // Initial display of players on page load
    displayPlayers();
});

//     generateTeamsButton.addEventListener('click', () => {
//         if (players.length < 4 || players.length % 2 !== 0) {
//             alert('An even number of at least 4 players is required to form teams.');
//             return;
//         }
//         const teams = generateBalancedTeams(players);
//         displayTeams(teams);
//     });

//     generateTournamentButton.addEventListener('click', () => {
//         if (players.length < 4 || players.length % 2 !== 0) {
//             alert('An even number of at least 4 players is required to form teams.');
//             return;
//         }
//         const teams = generateBalancedTeams(players);
//         displayTeams(teams);
//         const tournament = generateTournamentSchedule(teams);
//         displayTournament(tournament);
//     });

//     window.editPlayer = editPlayer;
//     window.deletePlayer = deletePlayer;

//     function displayTeams(teams) {
//         teamsDiv.innerHTML = '';
//         teams.forEach((team, index) => {
//             const teamDiv = document.createElement('div');
//             teamDiv.className = 'team';
//             teamDiv.textContent = `Team ${index + 1}: ${team.map(player => player.name).join(' and ')}`;
//             teamsDiv.appendChild(teamDiv);
//         });
//     }

//     function displayTournament(schedule) {
//         tournamentDiv.innerHTML = '<h3>Tournament Schedule</h3>';
//         schedule.forEach((match, index) => {
//             const matchDiv = document.createElement('div');
//             matchDiv.className = 'match';
//             matchDiv.textContent = `Match ${index + 1}: ${match.team1} vs ${match.team2}`;
//             tournamentDiv.appendChild(matchDiv);
//         });
//     }

//     // Initial display of players on page load
//     displayPlayers();
// });
