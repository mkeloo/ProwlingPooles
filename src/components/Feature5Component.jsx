import React, { useState } from 'react';
import axios from 'axios';
import { Select,
    Flex,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Box,
} from '@chakra-ui/react';
import teamData from '../utils/leader';
     

const Feature5Component = () => {
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
        if (selectedValue === "null") {
            setShowStats1(false);
            setStats1([]);
            setLeader1([]);
            return;
        }
        const teamLeaderData = teamData.teams.find(team => team.id === parseInt(selectedValue));
        if (teamLeaderData) {
            setLeader1({
                pointsLeader: teamLeaderData.pointsLeader,
                ppg: teamLeaderData.ppg,
                assistLeader: teamLeaderData.assistLeader,
                apg: teamLeaderData.apg,
                reboundLeader: teamLeaderData.reboundLeader,
                rpg: teamLeaderData.rpg
            });
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

        // getTeam1Leaders(selectedValue);
    };

    
    

    const handleSelectChange2 = async (event) => {
        const selectedValue = event.target.value;
        setSearchTerm(selectedValue);
        setLeader2([]);
        if (selectedValue === "null") {
            setShowStats2(false);
            setStats2([]);
            setLeader2([]);
            return;
        }
        const teamLeaderData = teamData.teams.find(team => team.id === parseInt(selectedValue));
        if (teamLeaderData) {
            setLeader2({
                pointsLeader: teamLeaderData.pointsLeader,
                ppg: teamLeaderData.ppg,
                assistLeader: teamLeaderData.assistLeader,
                apg: teamLeaderData.apg,
                reboundLeader: teamLeaderData.reboundLeader,
                rpg: teamLeaderData.rpg
            });
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
        <Box>
             <Flex gap="20px" mb="20px" align="center">
            <Box>
                Team 1
                <Select name="team1" id="team1" className="form-control" onChange={handleSelectChange1}>
                    <option value="null">Please Select A Team</option>
                    <option value="1">Atlanta Hawks</option>
                    <option value="2">Boston Celtics</option>
                    <option value="4">Brooklyn Nets</option>
                    <option value="5">Charlotte Hornets</option>
                    <option value="6">Chicago Bulls</option>
                    <option value="7">Cleveland Cavaliers</option>
                    <option value="8">Dallas Mavericks</option>
                    <option value="9">Denver Nuggets</option>
                    <option value="10">Detroit Pistons</option>
                    <option value="11">Golden State Warriors</option>
                    <option value="14">Houston Rockets</option>
                    <option value="15">Indiana Pacers</option>
                    <option value="16">Los Angeles Clippers</option>
                    <option value="17">Los Angeles Lakers</option>
                    <option value="19">Memphis Grizzlies</option>
                    <option value="20">Miami Heat</option>
                    <option value="21">Milwaukee Bucks</option>
                    <option value="22">Minnesota Timberwolves</option>
                    <option value="23">New Orleans Pelicans</option>
                    <option value="24">New York Knicks</option>
                    <option value="25">Oklahoma City Thunder</option>
                    <option value="26">Orlando Magic</option>
                    <option value="27">Philadelphia 76ers</option>
                    <option value="28">Phoenix Suns</option>
                    <option value="29">Portland Trail Blazers</option>
                    <option value="30">Sacramento Kings</option>
                    <option value="31">San Antonio Spurs</option>
                    <option value="38">Toronto Raptors</option>
                    <option value="40">Utah Jazz</option>
                    <option value="41">Washington Wizards</option>
                </Select>
            </Box>
            <Box>
                Team 2
                <Select name="team2" id="team2" className="form-control" onChange={handleSelectChange2}>
                <option value="null">Please Select A Team</option>
                    <option value="1">Atlanta Hawks</option>
                    <option value="2">Boston Celtics</option>
                    <option value="4">Brooklyn Nets</option>
                    <option value="5">Charlotte Hornets</option>
                    <option value="6">Chicago Bulls</option>
                    <option value="7">Cleveland Cavaliers</option>
                    <option value="8">Dallas Mavericks</option>
                    <option value="9">Denver Nuggets</option>
                    <option value="10">Detroit Pistons</option>
                    <option value="11">Golden State Warriors</option>
                    <option value="14">Houston Rockets</option>
                    <option value="15">Indiana Pacers</option>
                    <option value="16">Los Angeles Clippers</option>
                    <option value="17">Los Angeles Lakers</option>
                    <option value="19">Memphis Grizzlies</option>
                    <option value="20">Miami Heat</option>
                    <option value="21">Milwaukee Bucks</option>
                    <option value="22">Minnesota Timberwolves</option>
                    <option value="23">New Orleans Pelicans</option>
                    <option value="24">New York Knicks</option>
                    <option value="25">Oklahoma City Thunder</option>
                    <option value="26">Orlando Magic</option>
                    <option value="27">Philadelphia 76ers</option>
                    <option value="28">Phoenix Suns</option>
                    <option value="29">Portland Trail Blazers</option>
                    <option value="30">Sacramento Kings</option>
                    <option value="31">San Antonio Spurs</option>
                    <option value="38">Toronto Raptors</option>
                    <option value="40">Utah Jazz</option>
                    <option value="41">Washington Wizards</option>
                </Select>
            </Box>
            </Flex>

            {/* <p>Selected Team ID: {searchTerm}</p> */}
            <Flex direction={["column", "row"]} gap="20px">
                {showStats1 && (
                    <Box flex="1" boxShadow="md" p="6" rounded="md" bg="white">
                        {/* <Box mb="4">
                            <Text fontSize="lg" fontWeight="bold">Team 1 Leaders</Text>
                            <Text>Points Leader: {team1Leader.pointsLeader} ({team1Leader.ppg} PPG)</Text>
                            <Text>Assists Leader: {team1Leader.assistLeader} ({team1Leader.apg} APG)</Text>
                            <Text>Rebounds Leader: {team1Leader.reboundLeader} ({team1Leader.rpg} RPG)</Text>
                        </Box> */}
                        <Table size="sm">
                            <Thead>
                                <Tr><Th>Stat</Th><Th>Value</Th></Tr>
                            </Thead>
                            <Tbody>
                                {stats1.map(([key, value]) => (
                                    <Tr key={key}>
                                        <Td>{key}</Td><Td>{value}</Td>
                                    </Tr>
                                ))}
                                <Tr fontSize="lg" fontWeight="bold">Team 1 Leaders</Tr>
                                <Tr>Points Leader: {team1Leader.pointsLeader} ({team1Leader.ppg} PPG)</Tr>
                                <Tr>Assists Leader: {team1Leader.assistLeader} ({team1Leader.apg} APG)</Tr>
                                <Tr>Rebounds Leader: {team1Leader.reboundLeader} ({team1Leader.rpg} RPG)</Tr>
                            </Tbody>
                        </Table>
                    </Box>
                )}
                {showStats2 && (
                    <Box flex="1" boxShadow="md" p="6" rounded="md" bg="white">
                        <Table size="sm">
                            <Thead>
                                <Tr><Th>Stat</Th><Th>Value</Th></Tr>
                            </Thead>
                            <Tbody>
                                {stats2.map(([key, value]) => (
                                    <Tr key={key}>
                                        <Td>{key}</Td><Td>{value}</Td>
                                    </Tr>
                                ))}
                                <Tr fontSize="lg" fontWeight="bold">Team 2 Leaders</Tr>
                                <Tr>Points Leader: {team2Leader.pointsLeader} ({team2Leader.ppg} PPG)</Tr>
                                <Tr>Assists Leader: {team2Leader.assistLeader} ({team2Leader.apg} APG)</Tr>
                                <Tr>Rebounds Leader: {team2Leader.reboundLeader} ({team2Leader.rpg} RPG)</Tr>
                            </Tbody>
                        </Table>
                    </Box>
                )}
            </Flex>
        </Box>
    );
};

export default Feature5Component;
