import React, {useState, useEffect} from 'react';
import axios from 'axios';


const Feature2Component = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [players, setPlayers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [playersInfo, setPlayersInfo] = useState([]);
    const [season, setSeason] = useState('2023');
    const [showSeason, setShowSeason] = useState(false);
    const handleSearch = async () => {
        if(!searchTerm) return;
        const data = searchNames(searchTerm);
        console.log(data);
    };
    const handlePlayerClick = (player) => {
        // Handle click on player row (e.g., show more details)
        console.log('Clicked on player:', player.name);
        console.log('With id:', player.id);
        setShowSeason(true);
      };
      const handleSeasonChange = (event) => {
        // Handle click on player row (e.g., show more details)
        // console.log('Clicked on player:', player.name);
        // console.log('With id:', player.id);
        setShowSeason(true);
        setSeason(event.target.value);

      };
    const getDataForPlayerAndSeason = async (player, season) => {
        const axios = require('axios');
        const options = {
        method: 'GET',
        url: 'https://api-nba-v1.p.rapidapi.com/players',
        params: {
            team: '1',
            season: '2021'
        },
        headers: {
            'X-RapidAPI-Key': process.env.API_KEY,
            'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
        }
        };
    
        try {
            const response = await axios.request(options);
            console.log(response.data);
            
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
            'X-RapidAPI-Key': process.env.API_KEY,
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
            console.log(playersInfo);
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
                    <span className="close" onClick={() => {setShowModal(false); setShowSeason(false);}}>&times;</span>
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
                    <span className="close" onClick={() => setShowSeason(false)}>&times;</span>
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
                </div>
                </div>
            )}
        </div>
    );
};

export default Feature2Component;