fetch('https://www.balldontlie.io/api/v1/teams')
  .then(response => response.json())
  .then(data => {
    // handle response data
    let teams = data.data.filter(team => team.conference === 'West');
    let tableHtml = '<table>';
    tableHtml += '<tr><th>Team Name</th><th>City</th><</tr>';

    // create HTML for each team row
    teams.forEach(team => {
      tableHtml += `
        <tr>
          <td>${team.full_name}</td>
          <td>${team.city}</td>
        </tr>`;
    });

    tableHtml += '</table>';
    document.getElementById('teams').innerHTML = tableHtml;
  })
  .catch(error => console.error(error));

fetch('https://www.balldontlie.io/api/v1/players?per_page=1000')
  .then(response => response.json())
  .then(data => {

    // handle response data
    let players = data.data.filter(player => player.team.conference === 'West');

    let tableHtml = '<table>';
    tableHtml += '<tr><th>Name</th><th>Position</th><th>Team</th></tr>';
    
      // create HTML for each player row
    players.forEach(player => {
      tableHtml += `
        <tr data-player='${JSON.stringify(player)}'>
          <td>${player.first_name} ${player.last_name}</td>
          <td>${player.position}</td>
          <td>${player.team.full_name}</td>
        </tr>`;
    });
    
    tableHtml += '</table>';
    
      // display HTML on page
    document.getElementById('players').innerHTML = tableHtml;
    
      // add click event listener to table rows
    let rows = document.querySelectorAll('#players table tr');
    let selectedPlayers = [];
    
    rows.forEach(row => {
      row.addEventListener('click', () => {
        // check if player is already selected
        let player = JSON.parse(row.getAttribute('data-player'));
    
        if (selectedPlayers.length >= 2) {
          alert('You can only select two players at a time.');
          return;
        }
    
        if (selectedPlayers.some(p => p.id === player.id)) {
          alert('This player has already been selected.');
          return;
        }
    
        // add player to selected players array
        selectedPlayers.push(player);
    
        // update row style
        row.classList.add('selected');
    
        if (selectedPlayers.length === 2) {
          // display player info for comparison
          let player1 = selectedPlayers[0];
          let player2 = selectedPlayers[1];
    
          let infoHtml = `
            <h2>${player1.first_name} ${player1.last_name} vs ${player2.first_name} ${player2.last_name}</h2>
            <table>
              <tr><th></th><th>${player1.first_name} ${player1.last_name}</th><th>${player2.first_name} ${player2.last_name}</th></tr>
              <tr><td>Position</td><td>${player1.position}</td><td>${player2.position}</td></tr>
              <tr><td>Team</td><td>${player1.team.full_name}</td><td>${player2.team.full_name}</td></tr>
            </table> `;
    
          // fetch player stats
          let statsUrls = [`https://www.balldontlie.io/api/v1/stats?player_ids[]=${player1.id}`,
             `https://www.balldontlie.io/api/v1/stats?player_ids[]=${player2.id}`
          ];
    
          let statsPromises = statsUrls.map(url => fetch(url).then(response => response.json()));
    
          Promise.all(statsPromises)
            .then(statsData => {
              // handle stats response data
              let player1Stats = statsData[0].data;
              let player2Stats = statsData[1].data;

              ast1 = player1Stats[0].ast ?? "N/A"
              ast2 = player2Stats[0].ast ?? "N/A"
              reb1 = player1Stats[0].reb ?? "N/A"
              reb2 = player2Stats[0].reb ?? "N/A"
              blk1 = player1Stats[0].blk ?? "N/A"
              blk2 = player2Stats[0].blk ?? "N/A"
              stl1 = player1Stats[0].stl ?? "N/A"
              stl2 = player2Stats[0].stl ?? "N/A"
              turnover1 = player1Stats[0].turnover ?? "N/A"
              turnover2 = player2Stats[0].turnover ?? "N/A"
              fg_pct1 = player1Stats[0].fg_pct ?? "N/A"
              fg_pct2 = player2Stats[0].fg_pct ?? "N/A"
              fg3_pct1 = player1Stats[0].fg3_pct ?? "N/A"
              fg3_pct2 = player2Stats[0].fg3_pct ?? "N/A"
              ft_pct1 = player1Stats[0].ft_pct ?? "N/A"
              ft_pct2 = player2Stats[0].ft_pct ?? "N/A"
    
              infoHtml += `
                <table>
                  <tr><td>Assists</td><td>${ast1}</td><td>${ast2}</td></tr>
                  <tr><td>Rebounds</td><td>${reb1}</td><td>${reb2}</td></tr>
                  <tr><td>Blocks</td><td>${blk1}</td><td>${blk2}</td></tr>
                  <tr><td>Steals</td><td>${stl1}</td><td>${stl2}</td></tr>
                  <tr><td>Turnovers</td><td>${turnover1}</td><td>${turnover2}</td></tr>
                  <tr><td>Field Goal %</td><td>${fg_pct1}%</td><td>${fg_pct2}%</td></tr>
                  <tr><td>3-Point %</td><td>${fg3_pct1}%</td><td>${fg3_pct1}%</td></tr>
                  <tr><td>Free Throw %</td><td>${ft_pct1}%</td><td>${ft_pct2}%</td></tr>`;


                  
                  // display player comparison info on page
                  document.getElementById('player-info').innerHTML = infoHtml;
                  document.getElementById('restart-btn').style.display = 'inline';  
              })
            .catch(error => console.error(error));
        }
      });
    })
                   
  document.getElementById('restart-btn').addEventListener('click', () => {
    // clear selected players array
    selectedPlayers = [];

    // clear row styles
    rows.forEach(row => {
      row.classList.remove('selected');
    });

    // hide player comparison info and restart/deselect player button
    document.getElementById('player-info').innerHTML = '';
    document.getElementById('restart-btn').style.display = 'none';
  });
})
  .catch(error => console.error(error));

