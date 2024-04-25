import React, {useState, useEffect} from 'react';
import { config } from 'dotenv';
import axios from 'axios';


const Feature2Component = () => {

    const nbaApiKey = import.meta.env.VITE_REACT_APP_API_KEY;
    const [searchTerm, setSearchTerm] = useState('');
    const [players, setPlayers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [playersInfo, setPlayersInfo] = useState([]);
    const [season, setSeason] = useState('2023');
    const [showSeason, setShowSeason] = useState(false);
    const [currPlayer, setCurrPlayer] = useState("");
    const [stats, setStats] = useState([]);
    const [showStats, setShowStats] = useState(false);
    const handleSearch = async () => {
        if(!searchTerm) return;
        const data = searchNames(searchTerm);
        setShowModal(false);
        setShowStats(false);
        setShowSeason(false);
        console.log(data);
    };
    const handleStats = async () => {
        const response = getDataForPlayerAndSeason(currPlayer, season);
        console.log(response.data)
    }
    const handlePlayerClick = (player) => {
        // Handle click on player row (e.g., show more details)
        console.log('Clicked on player:', player.name);
        console.log('With id:', player.id);
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
          console.log("hiiii");
          console.log(response.data);
          const arr = response.data.response;
          console.log(arr);
          var points = 0;
          var rebounds = 0;
          var assists = 0;
          var blocks = 0;
          var steals = 0;
          var total = 0;
          var plusMinus = 0;
          var fieldGoalPercentage = 0;
          var fieldGoalMakes = 0;
          var fieldGoalAttempts = 0;
          var freeThrowPercentage = 0;
          var freeThrowMakes = 0;
          var freeThrowAttempts = 0;
          var totalTurnovers = 0;
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
            totalTurnovers += arr[i].turnovers;
            total += 1;
        }
        points /= total;
        rebounds /= total;
        assists /= total;
        blocks /= total;
        steals /= total;
        fieldGoalPercentage = fieldGoalMakes/fieldGoalAttempts;
        freeThrowPercentage = freeThrowMakes/freeThrowAttempts;
        totalTurnovers /= total;
        const currStats = {
            Points: points.toFixed(1),
            Rebounds: rebounds.toFixed(1),
            Assists: assists.toFixed(1),
            Blocks: blocks.toFixed(1),
            Steals: steals.toFixed(1),
            PlusMinus: plusMinus.toFixed(1),
            FieldGoalPercentage: fieldGoalPercentage.toFixed(2),
            FreeThrowPercentage: freeThrowPercentage.toFixed(2),
            Turnovers: totalTurnovers.toFixed(1)
        }
        const statsArr = Object.entries(currStats);
        console.log(statsArr);

        setStats(statsArr);

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
                    <span className="close" onClick={() => {setShowModal(false); setShowSeason(false); setShowStats(false)}}>&times;</span>
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
                    <button onClick={() => {handleStats(); setShowStats(true);}} type="submit">Get stats</button>
                </div>
                </div>
            )}
            {showStats && (
                <div className="modal">
                <div className="modal-content">
                    <span className="close" onClick={() => {setShowStats(false);}}>&times;</span>
                    <h2>Average Stats</h2>
                    <table>
                    <thead>
                        <tr>
                        <th>Stats</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats.map(([key, value]) => (
                        <tr>
                            <td>{key}: {value}</td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                </div>
            )}
        </div>
    );
};

export default Feature2Component;