import React, { useState } from 'react';
import axios from 'axios';

const Feature1 = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [playerStats, setPlayerStats] = useState([]);
  const [savedSearches, setSavedSearches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPlayers = async (searchTerm) => {
    setLoading(true);
    setError(null);

    const options = {
      method: 'GET',
      url: `https://api-nba-v1.p.rapidapi.com/players`,
      params: { search: searchTerm },
      headers: {
        'X-RapidAPI-Key': import.meta.env.VITE_REACT_APP_API_KEY,
        'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com',
      },
    };

    try {
      const response = await axios.request(options);
      setPlayerStats(response.data.response);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const fetchPlayerStats = async (playerId, season) => {
    setLoading(true);
    setError(null);

    const statsOptions = {
      method: 'GET',
      url: `https://api-nba-v1.p.rapidapi.com/players/statistics`,
      params: { id: playerId, season: season },
      headers: {
        'X-RapidAPI-Key': import.meta.env.VITE_REACT_APP_API_KEY,
        'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com',
      },
    };

    try {
      const response = await axios.request(statsOptions);
      setSelectedPlayer(response.data.response);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm) return;
    fetchPlayers(searchTerm);
  };

  const handlePlayerSelect = (player) => {
    fetchPlayerStats(player.id, '2020');
  };

  const handleSaveSearch = () => {
    const searchName = prompt('Enter a name for your saved search:');
    if (searchName) {
      setSavedSearches((prevSearches) => [
        ...prevSearches,
        { name: searchName, data: selectedPlayer },
      ]);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter player name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p>Error fetching data: {error.message}</p>}
      <ul>
        {playerStats.map((player) => (
          <li key={player.id} onClick={() => handlePlayerSelect(player)}>
            {player.firstname} {player.lastname}
          </li>
        ))}
      </ul>
      {selectedPlayer && (
        <div>
          <h2>Player Statistics</h2>
          <p>
            {selectedPlayer.firstname} {selectedPlayer.lastname}
          </p>
          <button onClick={handleSaveSearch}>Save This Search</button>
        </div>
      )}
      {savedSearches.length > 0 && (
        <div>
          <h2>Saved Searches</h2>
          <ul>
            {savedSearches.map((search, index) => (
              <li key={index}>{search.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Feature1;
