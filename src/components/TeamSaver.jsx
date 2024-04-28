import React, { useState } from 'react';
import axios from 'axios';
import { Button, Input, VStack } from '@chakra-ui/react';
import { saveAs } from 'file-saver';

const FetchPlayersComponent = () => {
  const [teamId, setTeamId] = useState('');
  const [season, setSeason] = useState('');

  const fetchAndDownloadPlayers = async () => {
    const options = {
      method: 'GET',
      url: `https://api-nba-v1.p.rapidapi.com/players`,
      params: { team: teamId, season: season },
      headers: {
        'X-RapidAPI-Key': import.meta.env.VITE_REACT_APP_API_KEY,
        'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com',
      },
    };

    try {
      const response = await axios.request(options);
      const blob = new Blob([JSON.stringify(response.data, null, 2)], {
        type: 'application/json',
      });
      saveAs(blob, `team${teamId}_${season}.json`);
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

  return (
    <VStack spacing={4}>
      <Input
        placeholder="Enter Team ID"
        value={teamId}
        onChange={(e) => setTeamId(e.target.value)}
      />
      <Input
        placeholder="Enter Season Year"
        value={season}
        onChange={(e) => setSeason(e.target.value)}
      />
      <Button colorScheme="blue" onClick={fetchAndDownloadPlayers}>
        Download Players JSON
      </Button>
    </VStack>
  );
};

export default FetchPlayersComponent;
