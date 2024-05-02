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
  //   Image,
  useToast,
  Button,
} from '@chakra-ui/react';
import teamData from '../utils/leader';
import playerData from '../utils/players';
import { FaStar } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';

const Feature5Component = () => {
  const [isHovered, setIsHovered] = useState(false); //not in use
  const toast = useToast(); //used to display toast notifications

  const nbaApiKey = import.meta.env.VITE_REACT_APP_API_KEY; //NBA API Key
  const [searchTerm, setSearchTerm] = useState(''); //holds selected team from 1 or 2

  const [team1Info, setTeam1Info] = useState({ name: '', imageUrl: '' }); //stores team 1 name and image
  const [team2Info, setTeam2Info] = useState({ name: '', imageUrl: '' }); //stores team 2 name and logo

  const [stats1, setStats1] = useState([]); //stores team 1 stats
  const [showStats1, setShowStats1] = useState(false); //boolean to show stats
  const [team1Leader, setLeader1] = useState([]); //stores team 1 stat leader's

  const [stats2, setStats2] = useState([]); //stores team 2 stats
  const [showStats2, setShowStats2] = useState(false); //boolean to show stats
  const [team2Leader, setLeader2] = useState([]); //stores team 1 stat leader's

  const [firstTeamid, setFirst] = useState(-1); //not in use

  const handleSelectChange1 = async (event) => { //called for team 1 dropdown
    const selectedValue = event.target.value;
    setSearchTerm(selectedValue);
    setLeader1([]);
    if (selectedValue === 'null') { //resets team 1 vars when not selected
      setShowStats1(false);
      setStats1([]);
      setLeader1([]);
      setTeam1Info({ name: '', imageUrl: '' }); // Reset team info
      return;
    }

    const team = playerData.NBA[ //gets selected team's id #, name, logo
      Object.keys(playerData.NBA).find((division) =>
        playerData.NBA[division].teams.some(
          (t) => t.id === parseInt(selectedValue)
        )
      )
    ].teams.find((t) => t.id === parseInt(selectedValue));

    if (team) { //log check previous function
      console.log('Selected Team ID:', selectedValue);
      setTeam1Info({
        id: selectedValue,
        name: team.name,
        imageUrl: getTeamImageUrl(selectedValue),
      });
    }

    const teamLeaderData = teamData.teams.find(
      (team) => team.id === parseInt(selectedValue)
    );
    if (teamLeaderData) { //retrieve team's stats leaders
      setLeader1({
        pointsLeader: teamLeaderData.pointsLeader,
        ppg: teamLeaderData.ppg,
        assistLeader: teamLeaderData.assistLeader,
        apg: teamLeaderData.apg,
        reboundLeader: teamLeaderData.reboundLeader,
        rpg: teamLeaderData.rpg,
      });
    }
    const options = { //set up API call
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
      const response = await axios.request(options); //call api
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
      for (let i = 0; i < arr.length; i++) { //assign JSON vars to local vars
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
      points /= games; //find per game stats
      rebounds /= games;
      assists /= games;
      blocks /= games;
      steals /= games;
      plusMinus /= games;
      totalTurnovers /= games;
      const gameStats = { //format stats
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

      setStats1(statsArr); //set stats to stats1
      setShowStats1(true); //show stats1
    } catch (error) {
      console.error(error);
      setShowStats1(false);
    }

    // getTeam1Leaders(selectedValue);
  };

  const handleSelectChange2 = async (event) => { //same as handleSelectChange1 but for team 2 dropdown
    const selectedValue = event.target.value; 
    setSearchTerm(selectedValue);
    setLeader2([]);
    if (selectedValue === 'null') {
      setShowStats2(false);
      setStats2([]);
      setLeader2([]);
      setTeam2Info({ name: '', imageUrl: '' }); // Reset team info

      return;
    }

    const team = playerData.NBA[
      Object.keys(playerData.NBA).find((division) =>
        playerData.NBA[division].teams.some(
          (t) => t.id === parseInt(selectedValue)
        )
      )
    ].teams.find((t) => t.id === parseInt(selectedValue));

    if (team) {
      setTeam2Info({
        id: selectedValue,
        name: team.name,
        imageUrl: getTeamImageUrl(selectedValue),
      });
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

  const renderOptions = () => { //creates the options for team 1 and 2 dropdowns
    const divisions = [ 
      'Atlantic',
      'Central',
      'Southeast',
      'Northwest',
      'Pacific',
      'Southwest',
    ];
    return divisions.flatMap((division) => //returns map of team names to be displayed
      playerData.NBA[division].teams.map((team) => (
        <option key={team.id} value={team.id}>
          {team.name}
        </option>
      ))
    );
  };

  const getTeamImageUrl = (teamId) => { //gets the logos of each team
    const divisions = [
      'Atlantic',
      'Central',
      'Southeast',
      'Northwest',
      'Pacific',
      'Southwest',
    ];

    for (let division of divisions) {
      const team = playerData.NBA[division].teams.find( //retrieves the url for each team's logo
        (team) => team.id === parseInt(teamId)
      );
      if (team) {
        return team.image_url;
      }
    }
    return null;
  };

  const saveComparison = async () => { //saves comparision of teams to database if user logged in and saves
    const token = localStorage.getItem('token'); //gets JWT
    const decoded = jwtDecode(token); //decodes JWT
    const userId = decoded.id;

    if (!token) { //if not authenticated
      toast({
        title: 'Authentication Error',
        description: 'No authentication token found.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try { //couldn't decode 
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

    const payload = { //sets up comparision to be saved to database
      userId,
      team1_id: team1Info.id,
      team1_name: team1Info.name,
      team1_image_url: team1Info.imageUrl,
      team1_points_per_game: parseFloat(
        stats1.find(([key]) => key === 'Points')[1]
      ),
      team1_rebounds_per_game: parseFloat(
        stats1.find(([key]) => key === 'Rebounds')[1]
      ),
      team1_assists_per_game: parseFloat(
        stats1.find(([key]) => key === 'Assists')[1]
      ),
      team1_blocks_per_game: parseFloat(
        stats1.find(([key]) => key === 'Blocks')[1]
      ),
      team1_steals_per_game: parseFloat(
        stats1.find(([key]) => key === 'Steals')[1]
      ),
      team1_plus_minus: parseFloat(
        stats1.find(([key]) => key === 'Plus Minus')[1]
      ),
      team1_field_goal_percentage: parseFloat(
        stats1.find(([key]) => key === 'Field Goal %')[1]
      ),
      team1_free_throw_percentage: parseFloat(
        stats1.find(([key]) => key === 'Free Throw %')[1]
      ),
      team1_turnovers_per_game: parseFloat(
        stats1.find(([key]) => key === 'Turnovers')[1]
      ),
      team1_points_leader: team1Leader.pointsLeader,
      team1_ppg: team1Leader.ppg,
      team1_assist_leader: team1Leader.assistLeader,
      team1_apg: team1Leader.apg,
      team1_rebound_leader: team1Leader.reboundLeader,
      team1_rpg: team1Leader.rpg,
      team2_id: team2Info.id,
      team2_name: team2Info.name,
      team2_image_url: team2Info.imageUrl,
      team2_points_per_game: parseFloat(
        stats2.find(([key]) => key === 'Points')[1]
      ),
      team2_rebounds_per_game: parseFloat(
        stats2.find(([key]) => key === 'Rebounds')[1]
      ),
      team2_assists_per_game: parseFloat(
        stats2.find(([key]) => key === 'Assists')[1]
      ),
      team2_blocks_per_game: parseFloat(
        stats2.find(([key]) => key === 'Blocks')[1]
      ),
      team2_steals_per_game: parseFloat(
        stats2.find(([key]) => key === 'Steals')[1]
      ),
      team2_plus_minus: parseFloat(
        stats2.find(([key]) => key === 'Plus Minus')[1]
      ),
      team2_field_goal_percentage: parseFloat(
        stats2.find(([key]) => key === 'Field Goal %')[1]
      ),
      team2_free_throw_percentage: parseFloat(
        stats2.find(([key]) => key === 'Free Throw %')[1]
      ),
      team2_turnovers_per_game: parseFloat(
        stats2.find(([key]) => key === 'Turnovers')[1]
      ),
      team2_points_leader: team2Leader.pointsLeader,
      team2_ppg: team2Leader.ppg,
      team2_assist_leader: team2Leader.assistLeader,
      team2_apg: team2Leader.apg,
      team2_rebound_leader: team2Leader.reboundLeader,
      team2_rpg: team2Leader.rpg,
    };

    console.log('Comparison payload:', payload);

    try {
      const response = await axios.post( //send to database
        'https://prowling-pooles-backend.onrender.com/api/team_comparisons',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      toast({ //success
        title: 'Comparison Saved',
        description: 'Team comparison saved successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) { //failure
      console.error('Failed to save comparison:', error);
      toast({
        title: 'Error',
        description: 'Failed to save comparison. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
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
          <span className="font-bold text-lg">Team 1</span> {/* team 1 dropdown */}
          <Select
            name="team1"
            id="team1"
            className="mt-1 form-select block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            onChange={handleSelectChange1}
          > {/* calls handleSelectChange1 upon change */}
            <option value="null">Please Select A Team</option>
            {renderOptions()} {/* generate teams */}
          </Select>
        </Box>
        <Box className="text-center">
          <span className="font-bold text-lg">Team 2</span> {/* team 1 dropdown */}
          <Select
            name="team2"
            id="team2"
            className="mt-1 form-select block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            onChange={handleSelectChange2}
          > {/* calls handleSelectChange1 upon change */}
            <option value="null">Please Select A Team</option>
            {renderOptions()} {/* generate teams */}
          </Select>
        </Box>
        <Button onClick={saveComparison} colorScheme="blue"> {/*save comparison button */}
          Save Comparison
        </Button>
      </Flex>

      <Flex direction={['column', 'row']} gap="5" className="mt-4">
        {showStats1 && (
          <Box flex="1" boxShadow="md" p="6" rounded="md" className="bg-white"> {/*only displays if showStats1 is true */}
            {/* Display the team's logo centered and larger from team1Info */}
            {team1Info.imageUrl && (
              <div className="flex flex-col items-center my-4">
                <h2 className="text-3xl font-bold mb-4">{team1Info.name}</h2>
                <div className="relative">
                  <img
                    src={team1Info.imageUrl}
                    alt={`${team1Info.name} logo`}
                    className="w-48 h-48 object-cover"
                  />
                </div>
              </div>
            )}
            {/* Statistics Table */}
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
                ))} {/*display contents of stats1 */}
              </Tbody>
            </Table>
            <Box my="4" direction="flex" align="center" justify="center">
              <Text fontSize="xl" fontWeight="bold" textAlign="center" mb="2">
                Team 1 Leaders
              </Text> {/*display team 1 stats leaders */}
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
            {/* Display the team's logo centered and larger */}
            {/*same as Team1 box but for Team2 */}
            {team2Info.imageUrl && (
              <div className="flex flex-col items-center my-4">
                <h2 className="text-3xl font-bold mb-4">{team2Info.name}</h2>
                <div className="relative">
                  <img
                    src={team2Info.imageUrl}
                    alt={`${team2Info.name} logo`}
                    className="w-48 h-48 object-cover"
                  />
                </div>
              </div>
            )}
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
