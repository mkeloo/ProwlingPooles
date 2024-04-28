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
} from '@chakra-ui/react';
import playerData from '../utils/players.json';
import allTeamsData from '../utils/Teams2023/allTeamsData';

const Feature1 = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchTerm, setSearchTerm] = useState('');
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [additionalStats, setAdditionalStats] = useState(null);

  const getTeamIdByName = (teamName) => {
    const division = Object.values(playerData.NBA).find((division) =>
      division.teams.some((team) => team.name === teamName)
    );
    if (!division) return null;

    const team = division.teams.find((team) => team.name === teamName);
    return team ? team.id : null;
  };

  const fetchPlayerId = async (lastName, teamId) => {
    const options = {
      method: 'GET',
      url: 'https://api-nba-v1.p.rapidapi.com/players',
      params: { name: lastName, team: teamId },
      headers: {
        'X-RapidAPI-Key': import.meta.env.VITE_REACT_APP_API_KEY,
        'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com',
      },
    };

    try {
      const response = await axios.request(options);
      if (
        response.data &&
        response.data.api &&
        response.data.api.players.length > 0
      ) {
        const player = response.data.api.players.find(
          (p) => p.lastName.toLowerCase() === lastName.toLowerCase()
        );
        if (player) {
          return player.playerId;
        } else {
          console.error(
            `No players found with the last name ${lastName} in team ${teamName}`
          );
          return null;
        }
      } else {
        console.error(`No players found with the last name ${lastName}`);
        return null;
      }
    } catch (error) {
      console.error('Error fetching player ID:', error);
      return null;
    }
  };

  const fetchPlayerStats = async (playerId) => {
    const options = {
      method: 'GET',
      url: 'https://api-nba-v1.p.rapidapi.com/players/statistics',
      params: { id: playerId },
      headers: {
        'X-RapidAPI-Key': import.meta.env.VITE_REACT_APP_API_KEY,
        'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com',
      },
    };

    try {
      const response = await axios.request(options);
      setAdditionalStats(response.data.api.statistics);
      onOpen();
    } catch (error) {
      console.error('Error fetching player statistics:', error);
    }
  };

  const handlePlayerSelect = async (player) => {
    setSelectedPlayer(player);
    const lastName = player.name.split(' ').slice(-1).join(' ');
    const teamId = getTeamIdByName(player.teamName);

    if (!teamId) {
      console.error(`No team ID found for team name ${player.teamName}`);
      setAdditionalStats({
        message: `No team ID found for team name ${player.teamName}`,
      });
      onOpen();
      return;
    }

    const playerId = await fetchPlayerId(lastName, teamId);
    if (playerId) {
      await fetchPlayerStats(playerId);
    } else {
      setAdditionalStats(null);
    }
    onOpen();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const searchLower = searchTerm.trim().toLowerCase();

    const filteredPlayers = allTeamsData
      .filter((player) => {
        const fullName = `${player.firstname} ${player.lastname}`.toLowerCase();
        return fullName.includes(searchLower);
      })
      .map((player) => {
        let teamInfo = { name: undefined, logo: undefined };

        for (const divisionKey in playerData.NBA) {
          if (playerData.NBA.hasOwnProperty(divisionKey)) {
            const division = playerData.NBA[divisionKey];
            const team = division.teams.find((t) => t.id === player.teamId);
            if (team) {
              teamInfo = { name: team.name, logo: team.image_url };
              break;
            }
          }
        }

        return {
          name: `${player.firstname} ${player.lastname}`,
          teamName: teamInfo.name,
          teamImage: teamInfo.logo,
          playerId: player.id,
          pos: player.leagues.standard.pos,
        };
      });

    setPlayers(filteredPlayers);
  };

  return (
    <div className="container mx-auto p-4">
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {players.map((player, index) => (
          <div
            key={index}
            className="p-4 shadow rounded hover:shadow-lg cursor-pointer transition-all duration-300"
            onClick={() => handlePlayerSelect(player)}
          >
            <h3 className="font-bold text-xl mb-2">{player.name}</h3>
            <img
              src={player.teamImage}
              alt={player.teamName}
              className="w-32 h-32 object-cover mx-auto"
            />
            <p className="text-sm mb-2">
              {player.pos} - {player.teamName}
            </p>
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
              <img
                src={selectedPlayer.image_url || 'default-image.png'}
                alt={selectedPlayer.name}
                className="w-full h-auto"
              />
              {additionalStats ? (
                <div>
                  <p>Points: {additionalStats.points}</p>
                  <p>Rebounds: {additionalStats.rebounds}</p>
                  <p>Assists: {additionalStats.assists}</p>
                </div>
              ) : (
                <p>No statistics available for this player.</p>
              )}
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
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
