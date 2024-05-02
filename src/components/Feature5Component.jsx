import React, { useState } from 'react';
import axios from 'axios';
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
  Text,
} from '@chakra-ui/react';
import teamData from '../utils/leader';
import playerData from '../utils/players';
import { FaStar } from 'react-icons/fa';

const Feature5Component = () => {
  const [isHovered, setIsHovered] = useState(false);
  const nbaApiKey = import.meta.env.VITE_REACT_APP_API_KEY;
  const [searchTerm, setSearchTerm] = useState('');

  const [stats1, setStats1] = useState([]);
  const [showStats1, setShowStats1] = useState(false);

  const [team1Leader, setLeader1] = useState([]);

  const [stats2, setStats2] = useState([]);
  const [showStats2, setShowStats2] = useState(false);

  const [team2Leader, setLeader2] = useState([]);
  const [firstTeamid, setFirst] = useState(-1);

  const handleSelectChange1 = async (event) => {
    const selectedValue = event.target.value;
    setSearchTerm(selectedValue);
    setLeader1([]);
    if (selectedValue === 'null') {
      setShowStats1(false);
      setStats1([]);
      setLeader1([]);
      return;
    }
    const teamLeaderData = teamData.teams.find(
      (team) => team.id === parseInt(selectedValue)
    );
    if (teamLeaderData) {
      setLeader1({
        pointsLeader: teamLeaderData.pointsLeader,
        ppg: teamLeaderData.ppg,
        assistLeader: teamLeaderData.assistLeader,
        apg: teamLeaderData.apg,
        reboundLeader: teamLeaderData.reboundLeader,
        rpg: teamLeaderData.rpg,
      });
    }
    const options = {
      method: 'GET',
      url: 'https://api-nba-v1.p.rapidapi.com/teams/statistics',
      params: {
        id: selectedValue,
        season: 2023,
      },
      headers: {
        'X-RapidAPI-Key': nbaApiKey,
        'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com',
      },
    };

    try {
      const response = await axios.request(options);
      // console.log("hiiii");
      // console.log(response.data);
      const arr = response.data.response;
      // console.log(arr);
      var points = 0;
      var rebounds = 0;
      var assists = 0;
      var blocks = 0;
      var steals = 0;
      var plusMinus = 0;
      var fieldGoalPercentage = 0;
      var freeThrowPercentage = 0;
      var totalTurnovers = 0;
      var games = 0;
      for (let i = 0; i < arr.length; i++) {
        points += arr[i].points;
        rebounds += arr[i].totReb;
        assists += arr[i].assists;
        blocks += arr[i].blocks;
        steals += arr[i].steals;
        plusMinus += arr[i].plusMinus;
        fieldGoalPercentage += parseFloat(arr[i].fgp);
        fieldGoalPercentage = fieldGoalPercentage.toFixed(1) + '%';
        freeThrowPercentage += parseFloat(arr[i].ftp);
        freeThrowPercentage = freeThrowPercentage.toFixed(1) + '%';
        totalTurnovers += arr[i].turnovers;
        games += arr[i].games;
      }
      points /= games;
      rebounds /= games;
      assists /= games;
      blocks /= games;
      steals /= games;
      plusMinus /= games;
      totalTurnovers /= games;
      const gameStats = {
        Points: points.toFixed(1),
        Rebounds: rebounds.toFixed(1),
        Assists: assists.toFixed(1),
        Blocks: blocks.toFixed(1),
        Steals: steals.toFixed(1),
        'Plus Minus': plusMinus.toFixed(1),
        'Field Goal %': fieldGoalPercentage,
        'Free Throw %': freeThrowPercentage,
        Turnovers: totalTurnovers.toFixed(1),
      };
      const statsArr = Object.entries(gameStats);
      // console.log(statsArr);

      setStats1(statsArr);
      setShowStats1(true);
    } catch (error) {
      console.error(error);
      setShowStats1(false);
    }

    // getTeam1Leaders(selectedValue);
  };

  const handleSelectChange2 = async (event) => {
    const selectedValue = event.target.value;
    setSearchTerm(selectedValue);
    setLeader2([]);
    if (selectedValue === 'null') {
      setShowStats2(false);
      setStats2([]);
      setLeader2([]);
      return;
    }
    const teamLeaderData = teamData.teams.find(
      (team) => team.id === parseInt(selectedValue)
    );
    if (teamLeaderData) {
      setLeader2({
        pointsLeader: teamLeaderData.pointsLeader,
        ppg: teamLeaderData.ppg,
        assistLeader: teamLeaderData.assistLeader,
        apg: teamLeaderData.apg,
        reboundLeader: teamLeaderData.reboundLeader,
        rpg: teamLeaderData.rpg,
      });
    }
    const options = {
      method: 'GET',
      url: 'https://api-nba-v1.p.rapidapi.com/teams/statistics',
      params: {
        id: selectedValue,
        season: 2023,
      },
      headers: {
        'X-RapidAPI-Key': nbaApiKey,
        'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com',
      },
    };

    try {
      const response = await axios.request(options);
      console.log('hiiiifrom2');
      // console.log(response.data);
      const arr = response.data.response;
      console.log(arr);
      var points = 0;
      var rebounds = 0;
      var assists = 0;
      var blocks = 0;
      var steals = 0;
      var plusMinus = 0;
      var fieldGoalPercentage = 0;
      var freeThrowPercentage = 0;
      var totalTurnovers = 0;
      var games = 0;
      for (let i = 0; i < arr.length; i++) {
        points += arr[i].points;
        rebounds += arr[i].totReb;
        assists += arr[i].assists;
        blocks += arr[i].blocks;
        steals += arr[i].steals;
        plusMinus += arr[i].plusMinus;
        fieldGoalPercentage += parseFloat(arr[i].fgp);
        fieldGoalPercentage = fieldGoalPercentage.toFixed(1) + '%';
        freeThrowPercentage += parseFloat(arr[i].ftp);
        freeThrowPercentage = freeThrowPercentage.toFixed(1) + '%';
        totalTurnovers += arr[i].turnovers;
        games += arr[i].games;
      }
      points /= games;
      rebounds /= games;
      assists /= games;
      blocks /= games;
      steals /= games;
      plusMinus /= games;
      totalTurnovers /= games;
      const gameStats = {
        Points: points.toFixed(1),
        Rebounds: rebounds.toFixed(1),
        Assists: assists.toFixed(1),
        Blocks: blocks.toFixed(1),
        Steals: steals.toFixed(1),
        'Plus Minus': plusMinus.toFixed(1),
        'Field Goal %': fieldGoalPercentage,
        'Free Throw %': freeThrowPercentage,
        Turnovers: totalTurnovers.toFixed(1),
      };
      const statsArr = Object.entries(gameStats);
      console.log(statsArr);

      setStats2(statsArr);
      setShowStats2(true);
    } catch (error) {
      console.error(error);
      setShowStats2(false);
    }
  };

  const renderOptions = () => {
    const divisions = [
      'Atlantic',
      'Central',
      'Southeast',
      'Northwest',
      'Pacific',
      'Southwest',
    ];
    return divisions.flatMap((division) =>
      playerData.NBA[division].teams.map((team) => (
        <option key={team.id} value={team.id}>
          {team.name}
        </option>
      ))
    );
  };

  return (
    <Box className="bg-gray-50 p-4 rounded-lg shadow">
      <Flex
        direction="flex"
        align="center"
        justify="center"
        gap="6"
        mb="5"
        className="bg-white p-4 rounded-lg shadow-sm"
      >
        <Box className="text-center">
          <span className="font-bold text-lg">Team 1</span>
          <Select
            name="team1"
            id="team1"
            className="mt-1 form-select block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            onChange={handleSelectChange1}
          >
            <option value="null">Please Select A Team</option>
            {renderOptions()}
          </Select>
        </Box>
        <Box className="text-center">
          <span className="font-bold text-lg">Team 2</span>
          <Select
            name="team2"
            id="team2"
            className="mt-1 form-select block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            onChange={handleSelectChange2}
          >
            <option value="null">Please Select A Team</option>
            {renderOptions()}
          </Select>
        </Box>
        <FaStar
          color={isHovered ? 'blue' : 'orange'}
          size="60px"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{ cursor: 'pointer' }}
          className="transition-colors duration-300"
        />
      </Flex>

      <Flex direction={['column', 'row']} gap="5" className="mt-4">
        {showStats1 && (
          <Box flex="1" boxShadow="md" p="6" rounded="md" className="bg-white">
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th>Stat</Th>
                  <Th isNumeric>Value</Th>
                </Tr>
              </Thead>
              <Tbody>
                {stats1.map(([key, value]) => (
                  <Tr key={key}>
                    <Td fontWeight="semibold">{key}</Td>
                    <Td
                      isNumeric
                      fontWeight="extrabold"
                      fontSize="lg"
                      color="blue.600"
                    >
                      {value}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <Box my="4" direction="flex" align="center" justify="center">
              <Text fontSize="xl" fontWeight="bold" textAlign="center" mb="2">
                Team 1 Leaders
              </Text>
              <Table variant="simple">
                <Tbody>
                  <Tr>
                    <Td fontWeight="semibold">Points Leader:</Td>
                    <Td
                      textAlign="center"
                      isNumeric
                      fontWeight="extrabold"
                      fontSize="lg"
                      color="blue.600"
                    >
                      {team1Leader.pointsLeader} ({team1Leader.ppg} PPG)
                    </Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="semibold">Assists Leader:</Td>
                    <Td
                      textAlign="center"
                      isNumeric
                      fontWeight="extrabold"
                      fontSize="lg"
                      color="blue.600"
                    >
                      {team1Leader.assistLeader} ({team1Leader.apg} APG)
                    </Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="semibold">Rebounds Leader:</Td>
                    <Td
                      textAlign="center"
                      isNumeric
                      fontWeight="extrabold"
                      fontSize="lg"
                      color="blue.600"
                    >
                      {team1Leader.reboundLeader} ({team1Leader.rpg} RPG)
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </Box>
          </Box>
        )}
        {showStats2 && (
          <Box flex="1" boxShadow="md" p="6" rounded="md" className="bg-white">
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th>Stat</Th>
                  <Th isNumeric>Value</Th>
                </Tr>
              </Thead>
              <Tbody>
                {stats2.map(([key, value]) => (
                  <Tr key={key}>
                    <Td fontWeight="semibold">{key}</Td>
                    <Td
                      isNumeric
                      fontWeight="extrabold"
                      fontSize="lg"
                      color="blue.600"
                    >
                      {value}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <Box my="4" direction="flex" align="center" justify="center">
              <Text fontSize="xl" fontWeight="bold" textAlign="center" mb="2">
                Team 2 Leaders
              </Text>
              <Table variant="simple">
                <Tbody>
                  <Tr>
                    <Td fontWeight="semibold">Points Leader:</Td>
                    <Td
                      textAlign="center"
                      isNumeric
                      fontWeight="extrabold"
                      fontSize="lg"
                      color="blue.600"
                    >
                      {team2Leader.pointsLeader} ({team2Leader.ppg} PPG)
                    </Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="semibold">Assists Leader:</Td>
                    <Td
                      textAlign="center"
                      isNumeric
                      fontWeight="extrabold"
                      fontSize="lg"
                      color="blue.600"
                    >
                      {team2Leader.assistLeader} ({team2Leader.apg} APG)
                    </Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="semibold">Rebounds Leader:</Td>
                    <Td
                      textAlign="center"
                      isNumeric
                      fontWeight="extrabold"
                      fontSize="lg"
                      color="blue.600"
                    >
                      {team2Leader.reboundLeader} ({team2Leader.rpg} RPG)
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </Box>
          </Box>
        )}
      </Flex>
    </Box>
  );
};

export default Feature5Component;
