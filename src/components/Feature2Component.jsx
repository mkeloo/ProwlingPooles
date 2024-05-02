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
  Image,
  Heading,
  Text,
  SimpleGrid,
  Input,
} from '@chakra-ui/react';
import { jwtDecode } from 'jwt-decode';

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
    <Box className="container mx-auto p-4">
      <Flex mb={4}>
        <Input
          type="text"
          placeholder="Enter player name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          flex="1"
          mr={4}
          p={2}
          border="1px"
          borderColor="gray.200"
          rounded="md"
        />
        <Button
          onClick={handleSearch}
          colorScheme="blue"
          px={4}
          py={2}
          rounded="md"
        >
          Search
        </Button>
      </Flex>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={2} className="m-4">
        {players.map((player, index) => (
          <Box
            key={index}
            p={4}
            m={8}
            shadow="lg"
            rounded="xl"
            cursor="pointer"
            transition="duration-300"
            bg={selectedPlayer === player ? 'orange.200' : 'slate.200'}
            _hover={{ shadow: 'xl', bg: 'orange.100' }}
            onClick={() => handlePlayerClick(player)}
          >
            <Heading fontSize="xl" mb={2} textAlign="center">
              {player.name}
            </Heading>
            <Box className="relative h-32 mb-2">
              <Image
                src={
                  player.imageUrl ||
                  'https://cdn.mos.cms.futurecdn.net/CPAhzgowLi2NtrP9HfVy9Y-1200-80.png'
                }
                alt={player.name || 'Image Not Available'}
                className="w-full h-full object-contain mx-auto"
              />
            </Box>
            <Flex alignItems="center" justifyContent="center" spaceX={2}>
              <Text fontSize="lg" fontWeight="bold">
                {player.teamName}
              </Text>
              <Image
                src={player.teamImage}
                alt={`${player.teamName} logo`}
                boxSize="3rem"
                objectFit="cover"
              />
            </Flex>
          </Box>
        ))}
      </SimpleGrid>
      {showSeason && (
        <Box className="modal">
          <Box className="modal-content">
            <Button className="close" onClick={() => setShowSeason(false)}>
              &times;
            </Button>
            <Heading fontSize="lg" mb={4}>
              Seasons
            </Heading>
            <Select
              value={season}
              onChange={handleSeasonChange}
              bg="white"
              color="black"
              px={4}
              py={2}
              rounded="md"
            >
              {renderSeasonOptions()}
            </Select>
            <Button
              onClick={() => {
                handleStats();
                setShowStats(true);
                setGraphDone(true);
              }}
              colorScheme="blue"
              px={4}
              py={2}
              rounded="md"
              mt={4}
            >
              Get stats
            </Button>
          </Box>
        </Box>
      )}
      {graphDone && (
        <div className="modal text-center">
          <h2 className="text-2xl font-bold mt-6">
            Player Stats Throughout the Season
          </h2>
          <div className="flex items-center justify-between">
            <PlayerStatsGraph data={preProcessedArr} />
          </div>
        </div>
      )}

      {showStats && (
        <div className="flex justify-center items-between">
          <Box className="modal">
            <Box className="modal-content">
              <Button className="close" onClick={() => setShowStats(false)}>
                &times;
              </Button>
              <Heading fontSize="lg" mb={4}>
                Player Stats
              </Heading>
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
                mt={4}
              >
                Save Player Stats
              </Button>
            </Box>
          </Box>
        </div>
      )}
    </Box>
  );
};

export default Feature2Component;
