import React, { useState } from 'react';
import axios from 'axios';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Image,
  Flex,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import playerData from '../utils/players';
import allTeamsData from '../utils/Teams2023/allTeamsData';
import { jwtDecode } from 'jwt-decode';

const Feature1 = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchTerm, setSearchTerm] = useState('');
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [additionalStats, setAdditionalStats] = useState(null);
  const [savedPlayers, setSavedPlayers] = useState(new Set()); // Stores the IDs of saved players

  const getTeamIdByName = (teamName) => {
    const division = Object.values(playerData.NBA).find((division) =>
      division.teams.some((team) => team.name === teamName)
    );
    if (!division) return null;

    const team = division.teams.find((team) => team.name === teamName);
    return team ? team.id : null;
  };

  const handlePlayerSelect = async (player) => {
    setSelectedPlayer(player);
    const lastName = player.name.split(' ').pop();
    const playerFromAllTeams = allTeamsData.find(
      (p) => p.lastname.toLowerCase() === lastName.toLowerCase()
    );

    if (!playerFromAllTeams) {
      console.error(
        `Player with last name ${lastName} not found in allTeamsData.`
      );
      setAdditionalStats({
        message: `Player with last name ${lastName} not found.`,
      });
      onOpen();
      return;
    }

    const playerId = playerFromAllTeams.id;
    player.id = playerId;
    await fetchPlayerStats(playerId);
    onOpen();
  };

  const convertToNumber = (str) => {
    const number = parseFloat(str);
    return isNaN(number) ? 0 : number;
  };

  const fetchPlayerStats = async (playerId) => {
    const season = '2023';
    const options = {
      method: 'GET',
      url: 'https://api-nba-v1.p.rapidapi.com/players/statistics',
      params: { id: playerId, season: season },
      headers: {
        'X-RapidAPI-Key': import.meta.env.VITE_REACT_APP_API_KEY,
        'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com',
      },
    };

    try {
      const response = await axios.request(options);
      const stats = response.data.response;

      if (stats && stats.length) {
        let totals = {
          points: 0,
          rebounds: 0,
          assists: 0,
          blocks: 0,
          steals: 0,
          plusMinus: 0,
          FG_percent: 0,
          fieldGoalMakes: 0,
          fieldGoalAttempts: 0,
          FT_percent: 0,
          freeThrowMakes: 0,
          freeThrowAttempts: 0,
          turnovers: 0,
          games: stats.length,
        };

        stats.forEach((game) => {
          totals.points += game.points;
          totals.rebounds += game.totReb;
          totals.assists += game.assists;
          totals.blocks += game.blocks;
          totals.steals += game.steals;
          totals.plusMinus += convertToNumber(game.plusMinus);
          totals.fieldGoalMakes += game.fgm;
          totals.fieldGoalAttempts += game.fga;
          totals.freeThrowMakes += game.ftm;
          totals.freeThrowAttempts += game.fta;
          totals.turnovers += game.turnovers;
        });

        let averages = {
          Points: (totals.points / totals.games).toFixed(1),
          Rebounds: (totals.rebounds / totals.games).toFixed(1),
          Assists: (totals.assists / totals.games).toFixed(1),
          Blocks: (totals.blocks / totals.games).toFixed(1),
          Steals: (totals.steals / totals.games).toFixed(1),
          FieldGoalPercentage: (
            totals.fieldGoalMakes / totals.fieldGoalAttempts
          ).toFixed(2),
          FreeThrowPercentage: (
            totals.freeThrowMakes / totals.freeThrowAttempts
          ).toFixed(2),
          Turnovers: (totals.turnovers / totals.games).toFixed(1),
          PlusMinus: (totals.plusMinus / totals.games).toFixed(1),
        };

        setAdditionalStats(averages);
        onOpen();
      } else {
        setAdditionalStats({
          message:
            'No statistics available for this player for season ' + season,
        });
        onOpen();
      }
    } catch (error) {
      console.error('Error fetching player statistics:', error);
      setAdditionalStats({
        message: 'Failed to fetch statistics due to an error.',
      });
      onOpen();
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const searchLower = searchTerm.trim().toLowerCase();

    let allPlayers = [];
    if (playerData && playerData.NBA) {
      Object.values(playerData.NBA).forEach((division) => {
        if (division && division.teams) {
          division.teams.forEach((team) => {
            if (team && team.players) {
              team.players.forEach((player) => {
                if (player.name.toLowerCase().includes(searchLower)) {
                  allPlayers.push({
                    id: player.id,
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

  const savePlayer = async () => {
    if (!selectedPlayer || !selectedPlayer.id || !additionalStats) {
      console.error(
        'Invalid player data or statistics missing:',
        selectedPlayer
      );
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);
      const userId = decoded.id;

      const payload = {
        userId,
        playerId: selectedPlayer.id,
        player_name: selectedPlayer.name,
        team_name: selectedPlayer.teamName,
        player_image_url: selectedPlayer.imageUrl,
        team_image_url: selectedPlayer.teamImage,
        points_per_game: additionalStats.Points,
        rebounds_per_game: additionalStats.Rebounds,
        assists_per_game: additionalStats.Assists,
        blocks_per_game: additionalStats.Blocks,
        steals_per_game: additionalStats.Steals,
        fg_percentage: additionalStats.FieldGoalPercentage,
        ft_percentage: additionalStats.FreeThrowPercentage,
        turnovers_per_game: additionalStats.Turnovers,
        plus_minus: additionalStats.PlusMinus,
      };

      const response = await axios.post(
        'https://prowling-pooles-backend.onrender.com/api/favorites',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Player saved successfully!', response.data);
      setSavedPlayers(new Set([...savedPlayers, selectedPlayer.id]));
    } catch (error) {
      console.error(
        'Error saving player:',
        error.response?.data?.message || error.message
      );
    }
  };

  const isPlayerSaved = (playerId) => {
    return savedPlayers.has(playerId);
  };

  return (
    <div className="container mx-auto p-4 ">
      <form onSubmit={handleSearch} className="flex mb-4">
        <input
          type="text"
          placeholder="Enter player name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 mr-4 p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 m-4 ">
        {players.map((player, index) => (
          <div
            key={index}
            className="p-4 m-8 shadow-lg rounded-xl hover:shadow-xl cursor-pointer transition duration-300 bg-slate-200"
            onClick={() => handlePlayerSelect(player)}
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
                // <div className="absolute inset-0 bg-slate-900 opacity-75 flex items-center justify-center rounded-lg">
                //   <span className="text-white text-sm">
                //     Image Not Available
                //   </span>
                // </div>
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

      {selectedPlayer && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{selectedPlayer.name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Flex direction="column" align="center" mb={4}>
                <Image
                  src={selectedPlayer.imageUrl || 'default-image.png'}
                  alt={selectedPlayer.name}
                  className="w-full h-auto mb-4 rounded-lg"
                  fallbackSrc="https://www.logodesignlove.com/images/classic/nba-logo.jpg"
                />
                <Flex align="center" justify="center" mb={4}>
                  <Text fontSize="xl" fontWeight="bold" mr={3}>
                    {selectedPlayer.teamName}
                  </Text>
                  {selectedPlayer.teamImage ? (
                    <Image
                      src={selectedPlayer.teamImage}
                      alt={`${selectedPlayer.teamName} logo`}
                      boxSize="3rem"
                    />
                  ) : (
                    <Flex
                      align="center"
                      justify="center"
                      boxSize="3rem"
                      borderWidth="1px"
                      borderColor="gray.300"
                      borderRadius="md"
                      backgroundColor="gray.100"
                    >
                      <Text fontSize="sm" color="gray.500">
                        Image Not Available
                      </Text>
                    </Flex>
                  )}
                </Flex>
              </Flex>
              {additionalStats ? (
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Stat</Th>
                      <Th isNumeric>Value</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {Object.entries(additionalStats).map(([stat, value]) => (
                      <Tr key={stat}>
                        <Td>{stat}</Td>
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
              ) : (
                <Text>
                  {additionalStats?.message ||
                    'No additional statistics available.'}
                </Text>
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                onClick={() => savePlayer(selectedPlayer)}
                leftIcon={
                  <StarIcon
                    color={
                      isPlayerSaved(selectedPlayer.id)
                        ? 'yellow.500'
                        : 'gray.300'
                    }
                  />
                }
                colorScheme="teal"
                mr={3}
              >
                Save Player
              </Button>
              <Button colorScheme="blue" onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};

export default Feature1;
