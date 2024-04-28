import React, { useState } from 'react';
import axios from 'axios';

const Feature5Component = () => {
    const nbaApiKey = import.meta.env.VITE_REACT_APP_API_KEY;
    const [searchTerm, setSearchTerm] = useState('');
    const [stats1, setStats1] = useState([]);
    const [showStats1, setShowStats1] = useState(false);
    const [stats2, setStats2] = useState([]);
    const [showStats2, setShowStats2] = useState(false);

    const handleSelectChange1 = async (event) => {
        const selectedValue = event.target.value;
        setSearchTerm(selectedValue);
        if (selectedValue === "null") {
            setShowStats1(false);
            setStats1([]);
            return;
        }
        const options = {
            method: 'GET',
            url: 'https://api-nba-v1.p.rapidapi.com/teams/statistics',
            params: {
              id: selectedValue,
              season: 2023
            },
            headers: {
                 'X-RapidAPI-Key': nbaApiKey,
                 'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
            }
        };

        try{
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
            for(let i = 0; i < arr.length; i++) {
                points += arr[i].points;
                rebounds += arr[i].totReb;
                assists += arr[i].assists;
                blocks += arr[i].blocks;
                steals += arr[i].steals;
                plusMinus += arr[i].plusMinus;
                fieldGoalPercentage += arr[i].fgp;
                freeThrowPercentage += arr[i].ftp;
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
                PlusMinus: plusMinus.toFixed(1),
                FieldGoalPercentage: fieldGoalPercentage,
                FreeThrowPercentage: freeThrowPercentage,
                Turnovers: totalTurnovers.toFixed(1)
            }
            const statsArr = Object.entries(gameStats);
            // console.log(statsArr);

            setStats1(statsArr);
            setShowStats1(true);
        }
        catch (error) {
            console.error(error);
            setShowStats1(false);
        }
    };

    const handleSelectChange2 = async (event) => {
        const selectedValue = event.target.value;
        setSearchTerm(selectedValue);
        if (selectedValue === "null") {
            setShowStats2(false);
            setStats2([]);
            return;
        }
        const options = {
            method: 'GET',
            url: 'https://api-nba-v1.p.rapidapi.com/teams/statistics',
            params: {
              id: selectedValue,
              season: 2023
            },
            headers: {
                 'X-RapidAPI-Key': nbaApiKey,
                 'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
            }
        };

        try{
            const response = await axios.request(options);
            console.log("hiiiifrom2");
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
            for(let i = 0; i < arr.length; i++) {
                points += arr[i].points;
                rebounds += arr[i].totReb;
                assists += arr[i].assists;
                blocks += arr[i].blocks;
                steals += arr[i].steals;
                plusMinus += arr[i].plusMinus;
                fieldGoalPercentage += arr[i].fgp;
                freeThrowPercentage += arr[i].ftp;
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
                PlusMinus: plusMinus.toFixed(1),
                FieldGoalPercentage: fieldGoalPercentage,
                FreeThrowPercentage: freeThrowPercentage,
                Turnovers: totalTurnovers.toFixed(1)
            }
            const statsArr = Object.entries(gameStats);
            console.log(statsArr);

            setStats2(statsArr);
            setShowStats2(true);
        }
        catch (error) {
            console.error(error);
            setShowStats2(false);
        }
    };



    return (
        <div>
            <select name="team1" id="team1" className="form-control" onChange={handleSelectChange1}>
              <option value="null">Please Select A Team</option>
              <option value="1">Atlanta Hawks</option>
              <option value="2">Boston Celtics</option>
              <option value="3">Brooklyn Nets</option>
              <option value="4">Charlotte Hornets</option>
              <option value="5">Chicago Bulls</option>
              <option value="6">Cleveland Cavaliers</option>
              <option value="7">Dallas Mavericks</option>
              <option value="8">Denver Nuggets</option>
              <option value="9">Detroit Pistons</option>
              <option value="10">Golden State Warriors</option>
              <option value="11">Houston Rockets</option>
              <option value="12">Indiana Pacers</option>
              <option value="13">Los Angeles Clippers</option>
              <option value="14">Los Angeles Lakers</option>
              <option value="15">Memphis Grizzlies</option>
              <option value="16">Miami Heat</option>
              <option value="17">Milwaukee Bucks</option>
              <option value="18">Minnesota Timberwolves</option>
              <option value="19">New Orleans Pelicans</option>
              <option value="20">New York Knicks</option>
              <option value="21">Oklahoma City Thunder</option>
              <option value="22">Orlando Magic</option>
              <option value="23">Philadelphia 76ers</option>
              <option value="24">Phoenix Suns</option>
              <option value="25">Portland Trail Blazers</option>
              <option value="26">Sacramento Kings</option>
              <option value="27">San Antonio Spurs</option>
              <option value="28">Toronto Raptors</option>
              <option value="29">Utah Jazz</option>
              <option value="30">Washington Wizards</option>
            </select>

            <select name="team2" id="team2" className="form-control" onChange={handleSelectChange2}>
              <option value="null">Please Select A Team</option>
              <option value="1">Atlanta Hawks</option>
              <option value="2">Boston Celtics</option>
              <option value="3">Brooklyn Nets</option>
              <option value="4">Charlotte Hornets</option>
              <option value="5">Chicago Bulls</option>
              <option value="6">Cleveland Cavaliers</option>
              <option value="7">Dallas Mavericks</option>
              <option value="8">Denver Nuggets</option>
              <option value="9">Detroit Pistons</option>
              <option value="10">Golden State Warriors</option>
              <option value="11">Houston Rockets</option>
              <option value="12">Indiana Pacers</option>
              <option value="13">Los Angeles Clippers</option>
              <option value="14">Los Angeles Lakers</option>
              <option value="15">Memphis Grizzlies</option>
              <option value="16">Miami Heat</option>
              <option value="17">Milwaukee Bucks</option>
              <option value="18">Minnesota Timberwolves</option>
              <option value="19">New Orleans Pelicans</option>
              <option value="20">New York Knicks</option>
              <option value="21">Oklahoma City Thunder</option>
              <option value="22">Orlando Magic</option>
              <option value="23">Philadelphia 76ers</option>
              <option value="24">Phoenix Suns</option>
              <option value="25">Portland Trail Blazers</option>
              <option value="26">Sacramento Kings</option>
              <option value="27">San Antonio Spurs</option>
              <option value="28">Toronto Raptors</option>
              <option value="29">Utah Jazz</option>
              <option value="30">Washington Wizards</option>
            </select>

            {/* <p>Selected Team ID: {searchTerm}</p> */}
            {showStats1 &&(
                <div className="statistics">
                <table>
                    <thead>
                        <tr>
                        <th>Stats</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats1.map(([key, value]) => (
                            <tr>
                                <td>{key}: {value}</td>
                            </tr>
                          ))}
                    </tbody>
                </table>
                </div>
            )}
            {showStats2 &&(
                <div className="statistics">
                <table>
                    <thead>
                        <tr>
                        <th>Stats</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats2.map(([key, value]) => (
                            <tr>
                                <td>{key}: {value}</td>
                            </tr>
                          ))}
                    </tbody>
                </table>
                </div>
            )}

        </div>
    );
};

export default Feature5Component;
