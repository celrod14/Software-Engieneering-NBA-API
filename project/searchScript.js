// JavaScript source code
const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.navbar__menu');

menu.addEventListener('click',function()
{
  menu.classList.toggle('is-active');
  menuLinks.classList.toggle('active');
})
function searchForPlayers()
{
     var selectedPlayers = [];
     var name1 = document.getElementById("player1").value;
     var name2 = document.getElementById("player2").value;

     var season1 = document.getElementById("season1").value;
     var season2 = document.getElementById("season2").value;

     fetch('https://www.balldontlie.io/api/v1/players?search=' + name1)
  .then(response => response.json())
  .then(data => {

    // handle response data
    let players = data.data;

    //let players = data.data;
    let tableHtml = '<table>';
    tableHtml += '<tr><th>Name</th><th>Position</th><th>Team(most recently)</th></tr>';
    
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
    document.getElementById('playersFound1').innerHTML = tableHtml;
    
      // add click event listener to table rows
    let rows = document.querySelectorAll('#playersFound1 table tr');
    
    
    rows.forEach(row => {
      row.addEventListener('click', () => {
        // check if player is already selected
        let player = JSON.parse(row.getAttribute('data-player'));
    
        if (selectedPlayers.length >= 2) {
          alert('Select one player from this search, and one player from the other search');
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
              <tr><td>Team(most recently)</td><td>${player1.team.full_name}</td><td>${player2.team.full_name}</td></tr>
            </table> `;
    
          // fetch player stats
          let statsUrls = [`https://www.balldontlie.io/api/v1/season_averages?season=${season1}&player_ids[]=${player1.id}`,
             `https://www.balldontlie.io/api/v1/season_averages?season=${season2}&player_ids[]=${player2.id}`
          ];
    
          let statsPromises = statsUrls.map(url => fetch(url).then(response => response.json()));
    
          Promise.all(statsPromises)
            .then(statsData => {
              // handle stats response data
              let player1Stats = statsData[0].data;
              let player2Stats = statsData[1].data;
              console.log(player1Stats.length);
              console.log(player2Stats.length);
              
              if(player1Stats.length === 0 && player2Stats.length ===0)
              {
                    let nextyear1 = parseInt(season1)+1;
                    let nextyear2 = parseInt(season2)+1;
                    alert(player1.first_name + ' ' + player1.last_name + ' didn\'t play during the ' + season1 + '-' + nextyear1 + ' season, and ' + player2.first_name + ' ' + player2.last_name + ' didn\'t play during the ' + season2 + '-' + nextyear2 + ' season.');
                    return;
              }
              else if(player2Stats.length === 0)
              {
                    let nextyear = parseInt(season2)+1;
                    alert(player2.first_name + ' ' + player2.last_name + ' didn\'t play during the ' + season2 + '-' + nextyear + ' season.');
                    return;
              }
              else if(player1Stats.length === 0)
              {
                   let nextyear = parseInt(season1)+1;
                   alert(player1.first_name + ' ' + player1.last_name + ' didn\'t play during the ' + season1 + '-' + nextyear + ' season.');
                   return;
              }
              else 
              {
                   infoHtml += `
                     <table>
                     <tr><td>Points</td><td>${player1Stats[0].pts}</td><td>${player2Stats[0].pts}</td></tr>
                     `;
                     // display player comparison info on page
                  document.getElementById('player-info').innerHTML = infoHtml;
                  document.getElementById('restart-btn').style.display = 'inline'; 
              }
                   
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



  fetch('https://www.balldontlie.io/api/v1/players?search=' + name2)
  .then(response => response.json())
  .then(data => {

    // handle response data
    let players = data.data;

    //let players = data.data;
    let tableHtml = '<table>';
    tableHtml += '<tr><th>Name</th><th>Position</th><th>Team(most recently)</th></tr>';
    
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
    document.getElementById('playersFound2').innerHTML = tableHtml;
    
      // add click event listener to table rows
    let rows = document.querySelectorAll('#playersFound2 table tr');
    
    
    rows.forEach(row => {
      row.addEventListener('click', () => {
        // check if player is already selected
        let player = JSON.parse(row.getAttribute('data-player'));
    
        if (selectedPlayers.length >= 2) {
          alert('Select one player from this search, and one player from the other search');
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
              <tr><td>Team(most recently)</td><td>${player1.team.full_name}</td><td>${player2.team.full_name}</td></tr>
            </table> `;
    
          // fetch player stats
          let statsUrls = [`https://www.balldontlie.io/api/v1/season_averages?season=${season1}&player_ids[]=${player1.id}`,
             `https://www.balldontlie.io/api/v1/season_averages?season=${season2}&player_ids[]=${player2.id}`
          ];
    
          let statsPromises = statsUrls.map(url => fetch(url).then(response => response.json()));
    
          Promise.all(statsPromises)
            .then(statsData => {
              // handle stats response data
              let player1Stats = statsData[0].data;
              let player2Stats = statsData[1].data;
              console.log(player1Stats.length);
              console.log(player2Stats.length);
              
              if(player1Stats.length === 0 && player2Stats.length ===0)
              {
                    let nextyear1 = parseInt(season1)+1;
                    let nextyear2 = parseInt(season2)+1;
                    alert(player1.first_name + ' ' + player1.last_name + ' didn\'t play during the ' + season1 + '-' + nextyear1 + ' season, and ' + player2.first_name + ' ' + player2.last_name + ' didn\'t play during the ' + season2 + '-' + nextyear2 + ' season.');
                    return;
              }
              else if(player2Stats.length === 0)
              {
                    let nextyear = parseInt(season2)+1;
                    alert(player2.first_name + ' ' + player2.last_name + ' didn\'t play during the ' + season2 + '-' + nextyear + ' season.');
                    return;
              }
              else if(player1Stats.length === 0)
              {
                   let nextyear = parseInt(season1)+1;
                   alert(player1.first_name + ' ' + player1.last_name + ' didn\'t play during the ' + season1 + '-' + nextyear + ' season.');
                   return;
              }
              else 
              {
                   infoHtml += `
                     <table>
                     <tr><td>Points</td><td>${player1Stats[0].pts}</td><td>${player2Stats[0].pts}</td></tr>
                     <tr><td>Assists</td><td>${player1Stats[0].ast}</td><td>${player2Stats[0].ast}</td></tr>
                     <tr><td>Rebounds</td><td>${player1Stats[0].reb}</td><td>${player2Stats[0].reb}</td></tr>
                     <tr><td>Blocks</td><td>${player1Stats[0].blk}</td><td>${player2Stats[0].blk}</td></tr>
                     <tr><td>Steals</td><td>${player1Stats[0].stl}</td><td>${player2Stats[0].stl}</td></tr>
                     <tr><td>Turnovers</td><td>${player1Stats[0].turnover}</td><td>${player2Stats[0].turnover}</td></tr>
                     <tr><td>Field Goal %</td><td>${player1Stats[0].fg_pct*100}%</td><td>${player2Stats[0].fg_pct*100}%</td></tr>
                     <tr><td>3-Point %</td><td>${player1Stats[0].fg3_pct*100}%</td><td>${player2Stats[0].fg3_pct*100}%</td></tr>
                     <tr><td>Free Throw %</td><td>${player1Stats[0].ft_pct*100}%</td><td>${player2Stats[0].ft_pct*100}%</td></tr>`;
                     // display player comparison info on page
                  document.getElementById('player-info').innerHTML = infoHtml;
                  document.getElementById('restart-btn').style.display = 'inline'; 
              }
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
}