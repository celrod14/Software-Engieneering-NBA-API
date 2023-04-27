fetch('https://www.balldontlie.io/api/v1/stats?seasons[]=2020&per_page=100000')
  .then(response => response.json())
  .then(data => {
    // handle response data
    let players = data.data.filter(player => player.team.conference === 'West');

    let dropdown = document.getElementById('team-dropdown');
    dropdown.addEventListener('change', () => {
      // get selected option from dropdown
      let selectedOption = dropdown.value;

      // filter players by selected option
      let filteredPlayers;
      if (selectedOption !== '') {
        filteredPlayers = players.filter(player => player.team.name === selectedOption);
      } else {
        filteredPlayers = players;
      }

      // create HTML for filtered players
      let filteredTableHtml = '<table>';
      filteredTableHtml += '<tr><th>Name</th><th>Position</th><th>Team</th></tr>';
      filteredPlayers.forEach(player => {
        filteredTableHtml += `
          <tr data-player='${JSON.stringify(player)}'>
            <td>${player.player.first_name} ${player.player.last_name}</td>
            <td>${player.player.position}</td>
            <td>${player.team.full_name}</td>
          </tr>`;
      });
      filteredTableHtml += '</table>';
      document.getElementById('players').innerHTML = filteredTableHtml;


    
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
    
          if (selectedPlayers.some(p => p.id === player.player.id)) {
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
              <h2>${player1.player.first_name} ${player1.player.last_name} vs ${player2.player.first_name} ${player2.player.last_name}</h2>
              <table>
                <tr><th></th><th>${player1.player.first_name} ${player1.player.last_name}</th><th>${player2.player.first_name} ${player2.player.last_name}</th></tr>
                <tr><td>Position</td><td>${player1.player.position}</td><td>${player2.player.position}</td></tr>
                <tr><td>Team</td><td>${player1.team.full_name}</td><td>${player2.team.full_name}</td></tr>
              </table> `;
    
            //   fetch player stats
            let statsUrls = [`https://www.balldontlie.io/api/v1/stats?player_ids[]=${player1.id}&seasons[]=2020`,
               `https://www.balldontlie.io/api/v1/stats?player_ids[]=${player2.id}&seasons[]=2020`
            ];
    
            let statsPromises = statsUrls.map(url => fetch(url).then(response => response.json()));
    
            Promise.all(statsPromises)
            .then(statsData => {

              ast1 = player1.ast ?? "N/A"
              ast2 = player2.ast ?? "N/A"
              reb1 = player1.reb ?? "N/A"
              reb2 = player2.reb ?? "N/A"
              blk1 = player1.blk ?? "N/A"
              blk2 = player2.blk ?? "N/A"
              stl1 = player1.stl ?? "N/A"
              stl2 = player2.stl ?? "N/A"
              turnover1 = player1.turnover ?? "N/A"
              turnover2 = player2.turnover ?? "N/A"
              fg_pct1 = player1.fg_pct ?? "N/A"
              fg_pct2 = player2.fg_pct ?? "N/A"
              fg3_pct1 = player1.fg3_pct ?? "N/A"
              fg3_pct2 = player2.fg3_pct ?? "N/A"
              ft_pct1 = player1.ft_pct ?? "N/A"
              ft_pct2 = player2.ft_pct ?? "N/A"
    
              infoHtml += `
                <table>
                  <tr><td>Assists</td><td>${ast1}</td><td>${ast2}</td></tr>
                  <tr><td>Rebounds</td><td>${reb1}</td><td>${reb2}</td></tr>
                  <tr><td>Blocks</td><td>${blk1}</td><td>${blk2}</td></tr>
                  <tr><td>Steals</td><td>${stl1}</td><td>${stl2}</td></tr>
                  <tr><td>Turnovers</td><td>${turnover1}</td><td>${turnover2}</td></tr>
                  <tr><td>Field Goal %</td><td>${fg_pct1}%</td><td>${fg_pct2}%</td></tr>
                  <tr><td>3-Point %</td><td>${fg3_pct1}%</td><td>${fg3_pct1}%</td></tr>
                  <tr><td>Free Throw %</td><td>${ft_pct1}%</td><td>${ft_pct2}%</td></tr>
		  <tr><td>Season </td><td>${player1.game.season}</td><td>${player2.game.season}</td></tr>`;
                  
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
  })
  .catch(error => console.error(error));


// Retrieve the latest NBA news articles
fetch('http://site.api.espn.com/apis/site/v2/sports/basketball/nba/news')
  .then(response => response.json())
  .then(data => {
  // Extract the latest 5 NBA news articles
    const latestArticles = data.articles.slice(0, 3);

  // Display each article on the web page
    const articlesDiv = document.getElementById("articles");

    latestArticles.forEach(article => {
      const articleDiv = document.createElement("div");
      articleDiv.classList.add("article");
      articleDiv.innerHTML = `
        <h2>${article.headline}</h2>
        <img src="${article.images[0].url}" width="300" height="300">
        <p>${article.description}</p>
        <a href="${article.links.web.href}" class="link" target="_blank"> Read more </a>
        `;
      articlesDiv.appendChild(articleDiv);
    });

    // Add event listener to the button to scroll down
    const scrollButton = document.getElementById("scroll-button");
    scrollButton.addEventListener("click", () => {
      window.scroll({
        top: articlesDiv.offsetTop,
        behavior: "smooth"
      });
    });
  })
  .catch(error => console.error(error));



