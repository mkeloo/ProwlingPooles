import React, {useState, useEffect} from 'react';
import { config } from 'dotenv';
import axios from 'axios';


const Feature3Component = () => {

    const nbaApiKey = import.meta.env.VITE_REACT_APP_API_KEY;
    const [searchTerm, setSearchTerm] = useState('');
    const [players, setPlayers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [playersInfo, setPlayersInfo] = useState([]);
    const [season, setSeason] = useState('2023');
    const [showSeason, setShowSeason] = useState(false);
    const [currPlayer, setCurrPlayer] = useState("");
    const [stats, setStats] = useState([]);
    const [Zstats, setZStats] = useState([]);
    const [showZStats, setShowZStats] = useState(false);
    const [showStats, setShowStats] = useState(false);
    const handleSearch = async () => {
        if(!searchTerm) return;
        const data = searchNames(searchTerm);
        setShowModal(false);
        setShowStats(false);
        setShowSeason(false);
        setShowZStats(false);
        //console.log(data);
    };

    const [playerStats, setPlayerStats] = useState([]);

    const addPlayerStatsToTable = () => {
      const playerName = searchTerm;
      const playerZStats = Zstats;
      console.log("Added to table:", playerName, playerZStats);
      setPlayerStats([...playerStats, { playerName, playerZStats }]);
  };



    const handleStats = async () => {
        const response = getDataForPlayerAndSeason(currPlayer, season);
        addPlayerStatsToTable(response.data);
        //console.log(response.data)
    }
    const handlePlayerClick = (player) => {
        // Handle click on player row (e.g., show more details)
        //console.log('Clicked on player:', player.name);
        //console.log('With id:', player.id);
        setCurrPlayer(player.id);
        setShowSeason(true);
      };
      const handleSeasonChange = (event) => {
        // Handle click on player row (e.g., show more details)
        // console.log('Clicked on player:', player.name);
        // console.log('With id:', player.id);
        setShowSeason(true);
        setSeason(event.target.value);

      };

      function convertToNumber(str) {
        // Remove leading "+" or "-"
        const sign = str.startsWith("-") ? "-" : "";
        const numberStr = str.replace(/^[\+\-]/, '');
        // Convert remaining characters into a number
        const number = parseInt(numberStr);
        return isNaN(number) ? null : parseInt(sign + numberStr);
      }



      const fg_percent_mean = 0.468;
      const fg_percent_std = 0.044;
      const ft_percent_mean = 0.791;
      const ft_percent_std = 0.072;
      const rebounds_mean = 5.7;
      const rebounds_std = 2.8;
      const assists_mean = 3.3;
      const assists_std = 2.5;
      const steals_mean = 0.9;
      const steals_std = 0.6;
      const blocks_mean = 0.6;
      const blocks_std = 0.6;
      const turnovers_mean = 1.8;
      const turnovers_std = 1.1;
      const points_mean = 15.6;
      const points_std = 6.9;

      function getPlayerZScores(stats) {
        const {
            points,
            rebounds,
            assists,
            blocks,
            steals,
            FG_percent,
            FT_percent,
            turnovers
        } = stats;

        const fg_percent_z = (FG_percent - fg_percent_mean) / fg_percent_std;
        const ft_percent_z = (FT_percent - ft_percent_mean) / ft_percent_std;
        const rebounds_z = (rebounds - rebounds_mean) / rebounds_std;
        const assists_z = (assists - assists_mean) / assists_std;
        const steals_z = (steals - steals_mean) / steals_std;
        const blocks_z = (blocks - blocks_mean) / blocks_std;
        const turnovers_z = (turnovers - turnovers_mean) / turnovers_std;
        const points_z = (points - points_mean) / points_std;

        const z_scores = [fg_percent_z, ft_percent_z, rebounds_z, assists_z, steals_z, blocks_z, turnovers_z, points_z];
        const total_z_scores = z_scores.length;
        const sum_of_z_scores = z_scores.reduce((acc, val) => acc + val, 0);
        const average_z_score = sum_of_z_scores / total_z_scores;
        return [
            points_z.toFixed(2),
            rebounds_z.toFixed(2),
            assists_z.toFixed(2),
            blocks_z.toFixed(2),
            steals_z.toFixed(2),
            fg_percent_z.toFixed(2),
            ft_percent_z.toFixed(2),
            turnovers_z.toFixed(2),
            average_z_score.toFixed(2),
        ];
      }
    const getDataForPlayerAndSeason = async (_id, _season) => {
        const options = {
        method: 'GET',
        url: 'https://api-nba-v1.p.rapidapi.com/players/statistics',
        params: {
          id: _id,
          season: _season
        },
        headers: {
             'X-RapidAPI-Key': nbaApiKey,
             'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
        }
      };

      try {
          const response = await axios.request(options);
          //console.log("hiiii");
          //console.log(response.data);
          const arr = response.data.response;
          //console.log(arr);
          var points = 0;
          var rebounds = 0;
          var assists = 0;
          var blocks = 0;
          var steals = 0;
          var total = 0;
          var plusMinus = 0;
          var FG_percent = 0;
          var fieldGoalMakes = 0;
          var fieldGoalAttempts = 0;
          var FT_percent = 0;
          var freeThrowMakes = 0;
          var freeThrowAttempts = 0;
          var turnovers = 0;
        for(let i = 0; i < arr.length; i++) {
            points += arr[i].points;
            rebounds += arr[i].totReb;
            assists += arr[i].assists;
            blocks += arr[i].blocks;
            steals += arr[i].steals;
            plusMinus += convertToNumber(arr[i].plusMinus);
            fieldGoalMakes += arr[i].fgm;
            fieldGoalAttempts += arr[i].fga;
            freeThrowMakes += arr[i].ftm;
            freeThrowAttempts += arr[i].fta;
            turnovers += arr[i].turnovers;
            total += 1;
        }
        points /= total;
        rebounds /= total;
        assists /= total;
        blocks /= total;
        steals /= total;
        FG_percent = fieldGoalMakes/fieldGoalAttempts;
        FT_percent = freeThrowMakes/freeThrowAttempts;
        turnovers /= total;
        const currStats = {
            Points: points.toFixed(1),
            Rebounds: rebounds.toFixed(1),
            Assists: assists.toFixed(1),
            Blocks: blocks.toFixed(1),
            Steals: steals.toFixed(1),

            FieldGoalPercentage: FG_percent.toFixed(2),
            FreeThrowPercentage: FT_percent.toFixed(2),
            Turnovers: turnovers.toFixed(1),
            PlusMinus: plusMinus.toFixed(1)
        }
        const mathStats = {
            points,
            rebounds,
            assists,
            blocks,
            steals,
            FG_percent,
            FT_percent,
            turnovers
        }
        const statsArr = Object.entries(currStats);
        console.log(statsArr);
        const ZScoreArr = getPlayerZScores(mathStats);
        console.log(ZScoreArr);
        setZStats(ZScoreArr);
        setStats(statsArr);
       // playerStats = ZScoreArr;

      } catch (error) {
          console.error(error);
      }

    };
    const searchNames = async (name) => {
        //const axios = require('axios');

        const options = {
          method: 'GET',
          url: 'https://api-nba-v1.p.rapidapi.com/players',
          params: {search: name},
          headers: {
            'X-RapidAPI-Key': nbaApiKey,
            'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
          }
        };

        try {
            const response = await axios.request(options);
            const playersInfoNew = response.data.response.map(player => ({
                id: player.id,
                name: `${player.firstname} ${player.lastname}`
            }));
            setPlayersInfo(playersInfoNew);
            console.log(playersInfoNew);
            setShowModal(true);
            //console.log(response.data.response);
        } catch (error) {
            console.error(error);
            setShowModal(false);
        }
    };

      const [tableData, setTableData] = useState([
        ['Comparison 1', 'Comparison 2'],
        ['Click to Add', 'Click to Add'],
        ['Click to Add', 'Click to Add'],
        ['Click to Add', 'Click to Add'],
        ['Click to Add', 'Click to Add'],
      ]);
      const [leftSums, setLeftSums] = useState(new Array(Zstats.length).fill(0));
      const [rightSums, setRightSums] = useState(new Array(Zstats.length).fill(0));


      const handleCellClick = (row, col) => {
        const updatedData = [...tableData];
        const cellContent = [];

        const labels = [
          "Points",
          "Rebounds",
          "Assists",
          "Blocks",
          "Steals",
          "FieldGoal%",
          "FreeThrow%",
          "Turnovers",
          "Total",
        ];

        cellContent.push(searchTerm);
        cellContent.push(<br key="br" />);

        cellContent.push(
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {labels.map((label, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <span style={{ fontSize: "0.6rem" }}>{label}</span>
                <span
                  style={{
                    display: "inline-block",
                    border: "1px solid black",
                    padding: "2px 4px",
                    marginTop: "2px",
                    backgroundColor:
                      Zstats[i] < 0
                        ? `hsl(0, 100%, ${50 - Math.abs(Zstats[i] * 20)}%)`
                        : Zstats[i] > 0
                        ? `hsl(120, 100%, ${50 - Math.abs(Math.min(Zstats[i], 4) * 10)}%)`
                        : Zstats[i] <= 0.5
                        ? "lightgreen"
                        : "green",
                  }}
                >
                  {Zstats[i]}
                </span>
              </div>
            ))}
          </div>
        );

        updatedData[row][col] = cellContent;
        setTableData(updatedData);
      };

      const clearTable = () => {
        setTableData([
        ['Comparison 1', 'Comparison 2'],
        ['Click to Add', 'Click to Add'],
        ['Click to Add', 'Click to Add'],
        ['Click to Add', 'Click to Add'],
        ['Click to Add', 'Click to Add'],
        ]);
        setLeftSums(new Array(Zstats.length).fill(' '));
        setRightSums(new Array(Zstats.length).fill(' '));
      };

      const calculateValues = () => {
        const leftSums = new Array(Zstats.length).fill( ' ');
        const rightSums = new Array(Zstats.length).fill( ' ');

        for (let row = 1; row < tableData.length; row++) {
          const leftValue = tableData[row][0];
          const rightValue = tableData[row][1];

          if (leftValue !== 'Click to Add') {
            console.log("leftValue",leftValue);
            const cellContent = leftValue[2].props.children;
            const child1 = cellContent[0].props.children;
            const child1child1 = child1[1].props.children;

            const child2 = cellContent[1].props.children;
            const child2child2 = child2[1].props.children;

            const child3 = cellContent[2].props.children;
            const child3child3 = child3[1].props.children;

            const child4 = cellContent[3].props.children;
            const child4child4 = child4[1].props.children;

            const child5 = cellContent[4].props.children;
            const child5child5 = child5[1].props.children;

            const child6 = cellContent[5].props.children;
            const child6child6 = child6[1].props.children;

            const child7 = cellContent[6].props.children;
            const child7child7 = child7[1].props.children;

            const child8 = cellContent[7].props.children;
            const child8child8 = child8[1].props.children;

            const child9 = cellContent[8].props.children;
            const child9child9 = child9[1].props.children;

            // Store the bottom child of each level into an array
            const childrenArray = [child1child1, child2child2, child3child3, child4child4, child5child5, child6child6, child7child7, child8child8, child9child9];

            // Now childrenArray contains the bottom child of each level
            //console.log("Array of children:", childrenArray);
            //const cellContent = leftValue.split("<br />")[2];
            //const zstatsArray = cellContent ? cellContent.split(" ").map(parseFloat) : [];

            for (let i = 0; i < childrenArray.length; i++) {
              leftSums[i] += childrenArray[i];
            }
          }

          if (rightValue !== 'Click to Add') {
            console.log("rightValue", rightValue);
            const cellContent = rightValue[2].props.children;
            const child1 = cellContent[0].props.children;
            const child1child1 = child1[1].props.children;

            const child2 = cellContent[1].props.children;
            const child2child2 = child2[1].props.children;

            const child3 = cellContent[2].props.children;
            const child3child3 = child3[1].props.children;

            const child4 = cellContent[3].props.children;
            const child4child4 = child4[1].props.children;

            const child5 = cellContent[4].props.children;
            const child5child5 = child5[1].props.children;

            const child6 = cellContent[5].props.children;
            const child6child6 = child6[1].props.children;

            const child7 = cellContent[6].props.children;
            const child7child7 = child7[1].props.children;

            const child8 = cellContent[7].props.children;
            const child8child8 = child8[1].props.children;

            const child9 = cellContent[8].props.children;
            const child9child9 = child9[1].props.children;

            // Store the bottom child of each level into an array
            const childrenArray = [child1child1, child2child2, child3child3, child4child4, child5child5, child6child6, child7child7, child8child8, child9child9];

            // Now childrenArray contains the bottom child of each level
            // console.log("Array of children:", childrenArray);
            // const cellContent = rightValue.split("<br />")[2];
            // const zstatsArray = cellContent ? cellContent.split(" ").map(parseFloat) : [];

            for (let i = 0; i < childrenArray.length; i++) {
              rightSums[i] += childrenArray[i];
            }
        }

        }

        setLeftSums(leftSums);
        setRightSums(rightSums);
      };

      const tableWidth = window.innerWidth - 128;
      const cellWidth = tableWidth / 2 - 40;

    return (
        <div>
        <input
                type="text"
                placeholder="Enter player name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={handleSearch} type="submit">Search</button>
            {showModal && (
                <div className="modal">
                <div className="modal-content">
                    <span className="close" onClick={() => {setShowModal(false); setShowSeason(false); setShowStats(false); setShowZStats(false)}}>&times;</span>
                    <h2>Player List</h2>
                    <table>
                    <thead>
                        <tr>
                        <th>Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {playersInfo.map(player => (
                        <tr key={player.id} onClick={() => handlePlayerClick(player)}>
                            <td>{player.name}</td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                </div>
            )}
            {showSeason && (
                <div className="modal">
                <div className="modal-content">
                    <span className="close" onClick={() => {setShowSeason(false); setShowSeason(false);}}>&times;</span>
                    <h2>Seasons</h2>
                    <select value={season} onChange={handleSeasonChange}>
                        <option value="2015">2015</option>
                        <option value="2016">2016</option>
                        <option value="2017">2017</option>
                        <option value="2018">2018</option>
                        <option value="2019">2019</option>
                        <option value="2020">2020</option>
                        <option value="2021">2021</option>
                        <option value="2022">2022</option>
                        <option value="2023">2023</option>
                    </select>
                    <button onClick={() => {handleStats(); setShowStats(true); setShowZStats(true)}} type="submit">Get stats</button>
                </div>
                </div>
            )}
            {showStats && (
              <div className="modal">
                <div className="modal-content">
                  <span className="close" onClick={() => { setShowStats(false); }}>&times;</span>
                  <h2>Average Stats and ZStats</h2>
                  <table>
                    <thead>
                      <tr>
                        <th>Stat</th>
                        <th>Value</th>
                        <th>Z-Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.map(([key, value], index) => (
                        <tr key={index}>
                          <td>{key}</td>
                          <td>{value}</td>
                          <td style={{
                            backgroundColor: Zstats[index] < 0 ? `hsl(0, 100%, ${50 - Math.abs(Zstats[index] * 20)}%)` : (Zstats[index] > 0 ? `hsl(120, 100%, ${50 - Math.abs(Math.min(Zstats[index], 4) * 10)}%)` : (Zstats[index] <= 0.5 ? 'lightgreen' : 'green')),
                          }}>
                            {Zstats[index]}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', padding: '0 1in' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: '0 1in' }}>
        <table style={{ borderCollapse: 'collapse', fontSize: '2rem', fontWeight: 'bold', width: '100%' }}>
          <tbody>
            {tableData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <td
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    style={{
                      border: '2px solid black',
                      padding: '20px',
                      width: `${cellWidth}px`,
                      height: '100px',
                      textAlign: 'center',
                      verticalAlign: 'middle',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {Array.isArray(cell) ? cell : cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: '20px' }}>
        <button onClick={clearTable} style={{ marginRight: '10px' }}>Clear</button>
        <button onClick={calculateValues}>Calculate</button>
        <div>
          <span style={{ marginRight: '10px' }}>Left Sums: [{leftSums.join(', ')}]</span>
          <span>Right Sums: [{rightSums.join(', ')}]</span>
        </div>
      </div>
    </div>



        </div>
    );
};

export default Feature3Component;

