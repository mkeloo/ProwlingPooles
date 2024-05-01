import React, {useState, useEffect} from 'react';
import { config } from 'dotenv';
import axios from 'axios';
import playerData from '../utils/players';
import '../utils/App.css'; // Assuming you have a CSS file named App.css

import { Select,
    Flex,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Box,
} from '@chakra-ui/react';

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
    const [playerName, setPlayerName] = useState("");

    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [showGraph, setShowGraph] = useState(false);
    const [graphDone, setGraphDone] = useState(false);
    const [preProcessedArr, setPreProcessedArr] = useState([]);
    const [currPlayerStartSeason, setcurrPlayerStartSeason] = useState(2023);

    const handleSearch = (e) => {
      e.preventDefault();
      const searchLower = searchTerm.trim().toLowerCase();
      // if(!searchTerm) return;
      // const data = searchNames(searchTerm);
      setShowModal(false);
      setShowStats(false);
      setShowSeason(false);
      setGraphDone(false);
      let allPlayers = [];
      if (playerData && playerData.NBA) {
      Object.values(playerData.NBA).forEach((division) => {
          if (division && division.teams) {
          division.teams.forEach((team) => {
              if (team && team.players) {
              team.players.forEach((player) => {
                  if (player.name.toLowerCase().includes(searchLower)) {
                  allPlayers.push({
                      name: player.name,
                      teamName: team.name,
                      teamImage: team.image_url,
                      imageUrl: player.image,
                      position: player.position,
                      age: player.age,
                      height: player.height,
                      weight: player.weight,
                      college: player.college,
                      salary: player.salary,
                  });
                  }
              });
              }
          });
          }
      });
      }

      setPlayers(allPlayers);
  };

    const [playerStats, setPlayerStats] = useState([]);

    const addPlayerStatsToTable = () => {
      console.log("sadfgsdag", playerName)
      //const playerName = playerName;
      //console.log("safaafsd", playerName);
      const playerZStats = Zstats;
      //console.log("Added to table:", playerName, playerZStats);
      setPlayerStats([...playerStats, { playerName, playerZStats }]);
  };



  const handleStats = async () => {
    console.log(currPlayer);
    const response = await getDataForPlayerAndSeason(currPlayer, season);
    await getPlayerfromId(currPlayer);
    addPlayerStatsToTable();
    console.log("111", currPlayer);
  };


  const handlePlayerClick = async (player) => {
    setSelectedPlayer(player === selectedPlayer ? null : player);
    const firstName = player.name.split(" ")[0];
    const lastName = player.name.split(" ").pop();
    console.log(player.name);
    console.log('Clicked on player:', player.name);
    console.log('With last name:', lastName);
    var selectedID = "";
    var startSeason = "";
    const playersInfoCurr = await searchNames(lastName);
    console.log("PLAYERS INFO");
    console.log(playersInfo);
    for(let i = 0; i < playersInfoCurr.length; i++) {
        if(playersInfoCurr[i].name.split(" ")[0] == firstName) {
            selectedID = playersInfoCurr[i].id;
            startSeason = playersInfoCurr[i].start;
        }
    }
    console.log("SELECTED ID: ", selectedID);
    console.log("SELECTED START SEASON: ", startSeason);
    setcurrPlayerStartSeason(startSeason);
    setCurrPlayer(selectedID);
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

      function parseNumber(str) {
        // Remove any extra characters from the string
        //console.log("check", str);
        const cleanedStr = str.replace(/[^\d.-]/g, '');
        // Convert the cleaned string to a floating-point number
        const number = parseFloat(cleanedStr);
        // Return the resulting number
        return isNaN(number) ? 0 : number;
    }

    const getPlayerfromId = async (_id) => {
      const options = {
        method: 'GET',
        url: 'https://api-nba-v1.p.rapidapi.com/players',
        params: {
          id: _id
        },
        headers: {
          'X-RapidAPI-Key': nbaApiKey,
          'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
        }
      };

      try {
        const response = await axios.request(options);
        const first = response.data.response[0]["firstname"];
        const last = response.data.response[0]["lastname"];
        const name = `${first} ${last}`;
        setPlayerName(name);
        console.log(name);
      } catch (error) {
        console.error(error);
      }
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
          console.log(arr);
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
        //console.log(statsArr);
        const ZScoreArr = getPlayerZScores(mathStats);
        //console.log(ZScoreArr);
        setZStats(ZScoreArr);
        setStats(statsArr);
        console.log(ZScoreArr);
        console.log(statsArr);
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
              name: `${player.firstname} ${player.lastname}`,
              start: player.nba.start
          }));

          setPlayersInfo(playersInfoNew);
          console.log("PLAYERSINFONEW");
          console.log(playersInfo);
          return playersInfoNew
          // setShowModal(true);
      } catch (error) {
          console.error(error);
          // setShowModal(false);
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
      const [totalValues, setTotalValues] = useState(new Array(Zstats.length).fill(0));


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
        console.log("asd",playerName);
        cellContent.push(playerName);
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
        setLeftSums(new Array(Zstats.length).fill(''));
        setRightSums(new Array(Zstats.length).fill(''));
        setTotalSums(new Array(Zstats.length).fill(''));
      };

      function sumDecimalNumbers(input) {
        // Regular expression to match decimal numbers
        const regex = /(-?\d+(\.\d+)?)/g;

        // Extract all decimal numbers from the input string
        const numbers = input.match(regex) || [];

        // If there's only one number, return it as is
        if (numbers.length === 1) {
            return parseFloat(numbers[0]);
        }

        // Otherwise, sum up the numbers
        const sum = numbers.reduce((acc, num) => {
            // Parse the number as a float and add it to the accumulator
            acc += parseFloat(num);
            return acc;
        }, 0);

        return sum;
    }

    // Test cases
    //console.log(sumDecimalNumbers('1.431.43')); // Output: 2.86


    const calculateValues = () => {
      const newLeftSums = new Array(Zstats.length).fill(0);
      const newRightSums = new Array(Zstats.length).fill(0);
      const newtotalValues = [...totalValues];

      for (let row = 1; row < tableData.length; row++) {
        const leftValue = tableData[row][0];
        const rightValue = tableData[row][1];

        if (Array.isArray(leftValue) && leftValue.length > 0 && leftValue[0]) {
          const zstatsArray = extractZstatsFromCell(leftValue);
          for (let i = 0; i < zstatsArray.length; i++) {
            newLeftSums[i] += zstatsArray[i];
          }
        }

        if (Array.isArray(rightValue) && rightValue.length > 0 && rightValue[0]) {
          const zstatsArray = extractZstatsFromCell(rightValue);
          for (let i = 0; i < zstatsArray.length; i++) {
            newRightSums[i] += zstatsArray[i];
          }
        }
      }

      for (let i = 0; i < newLeftSums.length; i++) {
        newtotalValues[i] = parseFloat((newLeftSums[i] - newRightSums[i]).toFixed(2));
      }

      setLeftSums(newLeftSums);
      setRightSums(newRightSums);
      setTotalValues(newtotalValues);
    };


      const tableWidth = window.innerWidth - 128;
      const cellWidth = tableWidth / 2 - 40;

      const renderSeasonOptions = () => {
        var startYear = currPlayerStartSeason;
        const endYear = 2023; // Assuming you want to show until 2023
        if (startYear < 2015) {
            startYear = 2015;
        }
        const options = [];
        for (let year = startYear; year <= endYear; year++) {
          options.push(<option key={year} value={year}>{year}</option>);
        }
        return options;
    };

    const extractZstatsFromCell = (cellContent) => {
      const zstatsArray = [];
      if (Array.isArray(cellContent)) {
        const divContent = cellContent[2].props.children;
        for (let i = 0; i < divContent.length; i++) {
          const spanContent = divContent[i].props.children;
          if (Array.isArray(spanContent)) {
            zstatsArray.push(parseFloat(spanContent[1].props.children));
          }
        }
      }
      return zstatsArray;
    };

    const getColorClassName = (value) => {
      if (value < 0) {
        return 'negative';
      } else if (value > 0) {
        if (value > 4) {
          return 'strong-positive';
        } else {
          return 'positive';
        }
      } else if (value <= 0.5) {
        return 'neutral';
      } else {
        return 'strong-positive';
      }
    };

    return (
      <div className="container mx-auto p-4">
        <input
          type="text"
          placeholder="Enter player name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 mr-4 p-2 border rounded"
        />
        <button onClick={handleSearch} type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Search</button>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 m-4 ">
          {players.map((player, index) => (
            <div
              key={index}
              className={`p-4 m-8 shadow-lg rounded-xl cursor-pointer transition duration-300 ${selectedPlayer === player ? 'bg-orange-200' : 'bg-slate-200 hover:shadow-xl hover:bg-orange-100'}`}
              onClick={() => handlePlayerClick(player)}
            >
              <h3 className="font-bold text-xl mb-2 text-center">
                {player.name}
              </h3>
              <div className="relative h-32 mb-2 ">
                {player.imageUrl ? (
                  <img
                    src={player.imageUrl}
                    alt={player.name}
                    className="w-full h-full object-contain mx-auto"
                  />
                ) : (
                  <img
                    src="https://cdn.mos.cms.futurecdn.net/CPAhzgowLi2NtrP9HfVy9Y-1200-80.png"
                    alt="Image Not Available"
                    className="w-full h-full object-contain mx-auto rounded-lg"
                  />
                )}
              </div>
              <div className="flex items-center justify-center space-x-2">
                <p className="text-lg font-bold">{player.teamName}</p>
                <img
                  src={player.teamImage}
                  alt={player.teamName + ' logo'}
                  className="w-12 h-12 object-cover"
                />
              </div>
            </div>
          ))}
        </div>
        {showSeason && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={() => { setShowSeason(false); setShowSeason(false); setGraphDone(false); }}>&times;</span>
              <h2>Seasons</h2>
              <select value={season} onChange={handleSeasonChange} className="bg-white-500 text-black px-4 py-2 rounded">
                {renderSeasonOptions()}
              </select>
              <button onClick={() => { handleStats(); setShowStats(true); setGraphDone(true); }} type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                Get stats
              </button>
            </div>
          </div>
        )}
        {showStats && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={() => { setShowStats(false); }}>&times;</span>
              <h2 className="modal-title">Average Stats and ZStats</h2>
              <table className="stats-table">
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
                      <td className="z-score-cell">
                        <span style={{
                          backgroundColor: Zstats[index] < 0 ? `hsl(0, 100%, ${50 - Math.abs(Zstats[index] * 20)}%)` : (Zstats[index] > 0 ? `hsl(120, 100%, ${50 - Math.abs(Math.min(Zstats[index], 4) * 10)}%)` : (Zstats[index] <= 0.5 ? 'lightgreen' : 'green'))
                        }}>
                          {Zstats[index]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

<div className="comparison-container">
          <div className="comparison-table">
            <table className="comparison-table-inner">
              <tbody>
                {tableData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, colIndex) => (
                      <td
                        key={`${rowIndex}-${colIndex}`}
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                        className="comparison-cell"
                      >
                        {Array.isArray(cell) ? cell : cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="comparison-buttons">
            <button onClick={clearTable} className="clear-button">Clear</button>
            <button onClick={calculateValues} className="calculate-button">Calculate</button>
          </div>
          <div className="comparison-totals">
            <div className="total-row">
              <span className="total-label">Left:</span>
              {leftSums.map((value, index) => (
                <span key={index} className={`total-value ${getColorClassName(value)}`} style={{
                  backgroundColor: value < 0 ? `hsl(0, 100%, ${50 - Math.abs(value * 20)}%)` : (value > 0 ? `hsl(120, 100%, ${50 - Math.abs(Math.min(value, 4) * 10)}%)` : (value <= 0.5 ? 'lightgreen' : 'green'))
                }}>
                  {value}
                </span>
              ))}
            </div>
            <div className="total-row">
              <span className="total-label">Right:</span>
              {rightSums.map((value, index) => (
                <span key={index} className={`total-value ${getColorClassName(value)}`} style={{
                  backgroundColor: value < 0 ? `hsl(0, 100%, ${50 - Math.abs(value * 20)}%)` : (value > 0 ? `hsl(120, 100%, ${50 - Math.abs(Math.min(value, 4) * 10)}%)` : (value <= 0.5 ? 'lightgreen' : 'green'))
                }}>
                  {value}
                </span>
              ))}
            </div>
            <div className="total-row">
              <span className="total-label">Total:</span>
              {totalValues.map((value, index) => (
                <span key={index} className={`total-value ${getColorClassName(value)}`} style={{
                  backgroundColor: value < 0 ? `hsl(0, 100%, ${50 - Math.abs(value * 20)}%)` : (value > 0 ? `hsl(120, 100%, ${50 - Math.abs(Math.min(value, 4) * 10)}%)` : (value <= 0.5 ? 'lightgreen' : 'green'))
                }}>
                  {value}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

export default Feature3Component;

