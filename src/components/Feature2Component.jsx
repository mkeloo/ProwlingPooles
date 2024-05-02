import React, { useState, useEffect } from 'react';
import axios from 'axios';
import playerData from '../utils/players';
import PlayerStatsGraph from './PlayerGraphComponent';
import {
  Select,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Button,
  useToast,
} from '@chakra-ui/react';
import { jwtDecode } from 'jwt-decode';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const Feature2Component = () => {
  const nbaApiKey = import.meta.env.VITE_REACT_APP_API_KEY;
  const toast = useToast();
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [players, setPlayers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [playersInfo, setPlayersInfo] = useState([]);
  const [season, setSeason] = useState('2023');
  const [showSeason, setShowSeason] = useState(false);
  const [currPlayer, setCurrPlayer] = useState('');
  const [stats, setStats] = useState([]);
  const [showStats, setShowStats] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  const [graphDone, setGraphDone] = useState(false);
  const [preProcessedArr, setPreProcessedArr] = useState([]);
  const [currPlayerStartSeason, setcurrPlayerStartSeason] = useState(2023);
  const handleSearch = (e) => {
    e.preventDefault();
    const searchLower = searchTerm.trim().toLowerCase();
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

  const handleStats = async () => {
    const response = getDataForPlayerAndSeason(currPlayer, season);
  };
  const handlePlayerClick = async (player) => {
    setSelectedPlayer(player === selectedPlayer ? null : player);
    const firstName = player.name.split(' ')[0];
    const lastName = player.name.split(' ').pop();
    var selectedID = '';
    var startSeason = '';
    const playersInfoCurr = await searchNames(lastName);
    for (let i = 0; i < playersInfoCurr.length; i++) {
      if (playersInfoCurr[i].name.split(' ')[0] == firstName) {
        selectedID = playersInfoCurr[i].id;
        startSeason = playersInfoCurr[i].start;
      }
    }
    setcurrPlayerStartSeason(startSeason);
    setCurrPlayer(selectedID);
    setShowSeason(true);
    handleSavePlayerStats(selectedID);
  };
  const handleSeasonChange = (event) => {
    setShowSeason(true);
    setSeason(event.target.value);
  };
  function convertToNumber(str) {
    // Remove leading "+" or "-"
    const sign = str.startsWith('-') ? '-' : '';
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
        season: _season,
      },
      headers: {
        'X-RapidAPI-Key': nbaApiKey,
        'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com',
      },
    };

    try {
      const response = await axios.request(options);
      const arr = response.data.response;
      setPreProcessedArr(arr);
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
      for (let i = 0; i < arr.length; i++) {
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
      fieldGoalPercentage = fieldGoalMakes / fieldGoalAttempts;
      freeThrowPercentage = freeThrowMakes / freeThrowAttempts;
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
        Turnovers: totalTurnovers.toFixed(1),
      };
      const statsArr = Object.entries(currStats);

      setStats(statsArr);
    } catch (error) {
      console.error(error);
    }
  };
  const searchNames = async (name) => {
    const options = {
      method: 'GET',
      url: 'https://api-nba-v1.p.rapidapi.com/players',
      params: { search: name },
      headers: {
        'X-RapidAPI-Key': nbaApiKey,
        'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com',
      },
    };

    try {
      const response = await axios.request(options);
      const playersInfoNew = response.data.response.map((player) => ({
        id: player.id,
        name: `${player.firstname} ${player.lastname}`,
        start: player.nba.start,
      }));

      setPlayersInfo(playersInfoNew);
      return playersInfoNew;
    } catch (error) {
      console.error(error);
    }
  };

  const renderSeasonOptions = () => {
    var startYear = currPlayerStartSeason;
    const endYear = 2023;
    if (startYear < 2015) {
      startYear = 2015;
    }
    const options = [];
    for (let year = startYear; year <= endYear; year++) {
      options.push(
        <option key={year} value={year}>
          {year}
        </option>
      );
    }
    return options;
  };

  const handleSavePlayerStats = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast({
        title: 'Authentication Error',
        description: 'No authentication token found.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    let decoded;
    try {
      decoded = jwtDecode(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      toast({
        title: 'Token Error',
        description: 'Failed to decode token.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const payload = {
      userId: decoded.id,
      player_id: currPlayer,
      season: season,
      points: stats.find((stat) => stat[0] === 'Points')[1],
      rebounds: stats.find((stat) => stat[0] === 'Rebounds')[1],
      assists: stats.find((stat) => stat[0] === 'Assists')[1],
      blocks: stats.find((stat) => stat[0] === 'Blocks')[1],
      steals: stats.find((stat) => stat[0] === 'Steals')[1],
      plus_minus: stats.find((stat) => stat[0] === 'PlusMinus')[1],
      field_goal_percentage: stats.find(
        (stat) => stat[0] === 'FieldGoalPercentage'
      )[1],
      free_throw_percentage: stats.find(
        (stat) => stat[0] === 'FreeThrowPercentage'
      )[1],
      turnovers: stats.find((stat) => stat[0] === 'Turnovers')[1],
    };

    try {
      const response = await axios.post(
        'https://prowling-pooles-backend.onrender.com/api/player_statistics',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast({
        title: 'Statistics Saved',
        description: 'Player statistics saved successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Failed to save player statistics:', error);
      toast({
        title: 'Error',
        description: 'Failed to save player statistics. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <div className="container mx-auto p-4 ">
      <input
        type="text"
        placeholder="Enter player name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-1 mr-4 p-2 border rounded"
      />
      <button
        onClick={handleSearch}
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Search
      </button>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 m-4 ">
        {players.map((player, index) => (
          <div
            key={index}
            className={`p-4 m-8 shadow-lg rounded-xl cursor-pointer transition duration-300 ${
              selectedPlayer === player
                ? 'bg-orange-200'
                : 'bg-slate-200 hover:shadow-xl hover:bg-orange-100'
            }`}
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
            <span
              className="close"
              onClick={() => {
                setShowSeason(false);
                setShowSeason(false);
                setGraphDone(false);
              }}
            >
              &times;
            </span>
            <h2>Seasons</h2>
            <select
              value={season}
              onChange={handleSeasonChange}
              className="bg-white-500 text-black px-4 py-2 rounded"
            >
              {renderSeasonOptions()}
            </select>
            <button
              onClick={() => {
                handleStats();
                setShowStats(true);
                setGraphDone(true);
              }}
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Get stats
            </button>
          </div>
        </div>
      )}
      {graphDone && (
        <div className="modal" style={{ textAlign: 'center' }}>
          <h1 className="text-2xl font-bold mt-6">
            Player Stats Throughout the Season
          </h1>
          <div
            className="modal-content"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '1200px',
            }}
          >
            <PlayerStatsGraph data={preProcessedArr} />
          </div>
        </div>
      )}
      {/* Add the savePlayerStats button */}
      {showStats && (
        <div className="modal">
          <div className="modal-content">
            <span
              className="close"
              onClick={() => {
                setShowStats(false);
                setGraphDone(false);
              }}
            >
              &times;
            </span>
            <h2>Player Stats</h2>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Stat</Th>
                  <Th>Value</Th>
                </Tr>
              </Thead>
              <Tbody>
                {stats.map((stat, index) => (
                  <Tr key={index}>
                    <Td>{stat[0]}</Td>
                    <Td>{stat[1]}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <Button
              onClick={handleSavePlayerStats}
              colorScheme="blue"
              size="lg"
              className="mt-4"
            >
              Save Player Stats
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feature2Component;
