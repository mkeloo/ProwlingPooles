import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalFooter,
  Text,
  Textarea,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useDisclosure,
  SimpleGrid,
  Input,
  useToast,
} from '@chakra-ui/react';
import PlayerStatsGraph from '../components/PlayerGraphComponent';

import { jwtDecode } from 'jwt-decode';

function Dashboard() {
  const [favorites, setFavorites] = useState([]);
  const [username, setUsername] = useState('User');
  const [articles, setArticles] = useState([]);
  const [playerStatistics, setPlayerStatistics] = useState([]);
  const [playerComparisons, setPlayerComparisons] = useState([]);
  const [teamComparisons, setTeamComparisons] = useState([]);
  const [selectedItem, setSelectedPlayer] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();
  const [modalContentType, setModalContentType] = useState(null);
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
  const [isItemSelectedModalOpen, setIsItemSelectedModalOpen] = useState(false);
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const decoded = jwtDecode(token);
      setUsername(decoded.username || 'User');
      fetchFavorites(token);
      fetchArticles(token);
      fetchPlayerStatistics(token);
      fetchPlayerComparisons(token);
      fetchTeamComparisons(token);
      fetchNotes(token);
    } catch (error) {
      console.error('Token decoding error or token expired:', error);
      logout();
    }
  }, [navigate]);

  const onOpenAddNoteModal = () => {
    setIsAddNoteModalOpen(true);
  };

  const onCloseAddNoteModal = () => {
    setIsAddNoteModalOpen(false);
  };

  const onOpenItemSelectedModal = () => {
    setIsItemSelectedModalOpen(true);
  };

  const onCloseItemSelectedModal = () => {
    setIsItemSelectedModalOpen(false);
  };

  const fetchNotes = async (token) => {
    try {
      const response = await axios.get(
        'https://prowling-pooles-backend.onrender.com/api/notes',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotes(response.data);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      if (error.response && error.response.status === 401) {
        logout();
      }
    }
  };

  const handleNoteChange = (e, field) => {
    field === 'title'
      ? setNoteTitle(e.target.value)
      : setNoteContent(e.target.value);
  };

  const saveNote = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast({
        title: 'Authentication Error',
        description: 'You must be logged in to save notes.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
      navigate('/login');
      return;
    }
    const headers = { Authorization: `Bearer ${token}` };
    const noteData = { title: noteTitle, content: noteContent };

    try {
      if (selectedNote) {
        await axios.put(
          `https://prowling-pooles-backend.onrender.com/api/notes/${selectedNote.id}`,
          noteData,
          { headers }
        );
        toast({
          title: 'Note Updated',
          description: 'Your note has been updated successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        await axios.post(
          'https://prowling-pooles-backend.onrender.com/api/notes',
          noteData,
          { headers }
        );
        toast({
          title: 'Note Created',
          description: 'Your new note has been created successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      }
      fetchNotes(token);
      onClose();
      clearForm();
    } catch (error) {
      console.error('Failed to save or update note:', error);
      toast({
        title: 'Error',
        description: 'There was an error saving the note.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const clearForm = () => {
    setNoteTitle('');
    setNoteContent('');
    setSelectedNote(null);
  };

  const editNote = (note) => {
    setSelectedNote(note);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    onOpen();
  };

  const deleteNote = async (noteId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      await axios.delete(
        `https://prowling-pooles-backend.onrender.com/api/notes/${noteId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchNotes(token);
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  const fetchFavorites = async (token) => {
    try {
      const response = await axios.get(
        'https://prowling-pooles-backend.onrender.com/api/favorites',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFavorites(response.data);
      console.log('Favorites:', response.data);
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
      if (error.response && error.response.status === 401) {
        logout();
      }
    }
  };

  const fetchArticles = async (token) => {
    try {
      const response = await axios.get(
        'https://prowling-pooles-backend.onrender.com/api/articles',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Articles:', response.data);
      setArticles(response.data); // Make sure this line correctly updates the articles state
    } catch (error) {
      console.error('Failed to fetch articles:', error);
      if (error.response && error.response.status === 401) {
        logout(); // Handle unauthorized access, possibly due to expired token
      }
    }
  };

  const fetchPlayerStatistics = async (token) => {
    try {
      const response = await axios.get(
        'https://prowling-pooles-backend.onrender.com/api/player_statistics',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Player Statistics:', response.data);
      setPlayerStatistics(response.data);
    } catch (error) {
      console.error('Failed to fetch player statistics:', error);
    }
  };

  const fetchPlayerComparisons = async (token) => {
    try {
      const response = await axios.get(
        'https://prowling-pooles-backend.onrender.com/api/players_comparisons',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Player Comparisons:', response.data);
      setPlayerComparisons(response.data);
    } catch (error) {
      console.error('Failed to fetch player comparisons:', error);
    }
  };

  const fetchTeamComparisons = async (token) => {
    try {
      const response = await axios.get(
        'https://prowling-pooles-backend.onrender.com/api/team_comparisons',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Team Comparisons:', response.data);
      setTeamComparisons(response.data);
    } catch (error) {
      console.error('Failed to fetch team comparisons:', error);
    }
  };
  const showFavoritesDetails = (fav) => {
    setSelectedPlayer(fav);
    setModalContentType('favorites');
    onOpen();
  };

  const showArticleDetails = (article) => {
    setSelectedPlayer(article);
    setModalContentType('article');
    onOpen();
  };

  const showPlayerStatisticsDetails = (stat) => {
    setSelectedPlayer(stat);
    setModalContentType('playerStatistics');
    onOpen();
  };

  const showPlayerComparisonsDetails = (comparison) => {
    setSelectedPlayer(comparison);
    setModalContentType('playerComparisons');
    onOpen();
  };

  const showTeamComparisonsDetails = (comparison) => {
    setSelectedPlayer(comparison);
    setModalContentType('teamComparisons');
    onOpen();
  };

  const renderModalContent = () => {
    switch (modalContentType) {
      case 'favorites':
        return renderFavoritesDetails();
      case 'article':
        return renderArticlesDetails();
      case 'playerStatistics':
        return renderPlayerStatisticsDetails();
      case 'playerComparisons':
        return renderPlayerComparisonsDetails();
      case 'teamComparisons':
        return renderTeamComparisonsDetails();
      default:
        return <Text>No content available.</Text>;
    }
  };

  function logout() {
    localStorage.removeItem('token');
    navigate('/login');
  }

  const renderTeamComparisonsDetails = () => {
    if (!selectedItem) return <Text>No data available.</Text>;

    const team1Info = {
      name: selectedItem.team1_name,
      imageUrl: selectedItem.team1_image_url,
      stats: [
        ['Points per Game', selectedItem.team1_points_per_game],
        ['Rebounds per Game', selectedItem.team1_rebounds_per_game],
        ['Assists per Game', selectedItem.team1_assists_per_game],
        ['Blocks per Game', selectedItem.team1_blocks_per_game],
        ['Steals per Game', selectedItem.team1_steals_per_game],
        ['Plus Minus', selectedItem.team1_plus_minus],
        ['Field Goal Percentage', selectedItem.team1_field_goal_percentage],
        ['Free Throw Percentage', selectedItem.team1_free_throw_percentage],
        ['Turnovers per Game', selectedItem.team1_turnovers_per_game],
      ],
      leaders: {
        pointsLeader: selectedItem.team1_points_leader,
        ppg: selectedItem.team1_ppg,
        assistLeader: selectedItem.team1_assist_leader,
        apg: selectedItem.team1_apg,
        reboundLeader: selectedItem.team1_rebound_leader,
        rpg: selectedItem.team1_rpg,
      },
    };

    const team2Info = {
      name: selectedItem.team2_name,
      imageUrl: selectedItem.team2_image_url,
      stats: [
        ['Points per Game', selectedItem.team2_points_per_game],
        ['Rebounds per Game', selectedItem.team2_rebounds_per_game],
        ['Assists per Game', selectedItem.team2_assists_per_game],
        ['Blocks per Game', selectedItem.team2_blocks_per_game],
        ['Steals per Game', selectedItem.team2_steals_per_game],
        ['Plus Minus', selectedItem.team2_plus_minus],
        ['Field Goal Percentage', selectedItem.team2_field_goal_percentage],
        ['Free Throw Percentage', selectedItem.team2_free_throw_percentage],
        ['Turnovers per Game', selectedItem.team2_turnovers_per_game],
      ],
      leaders: {
        pointsLeader: selectedItem.team2_points_leader,
        ppg: selectedItem.team2_ppg,
        assistLeader: selectedItem.team2_assist_leader,
        apg: selectedItem.team2_apg,
        reboundLeader: selectedItem.team2_rebound_leader,
        rpg: selectedItem.team2_rpg,
      },
    };

    return (
      <ModalBody overflowY="auto" maxH="70vh">
        <Flex
          Flex
          direction={{ base: 'column', md: 'row' }}
          wrap="wrap"
          className="mt-4"
        >
          <Box flex="1" boxShadow="md" p="6" rounded="md" className="bg-white">
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
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th>Stat</Th>
                  <Th isNumeric>Value</Th>
                </Tr>
              </Thead>
              <Tbody>
                {team1Info.stats.map(([key, value]) => (
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
                      {team1Info.leaders.pointsLeader} ({team1Info.leaders.ppg}{' '}
                      PPG)
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
                      {team1Info.leaders.assistLeader} ({team1Info.leaders.apg}{' '}
                      APG)
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
                      {team1Info.leaders.reboundLeader} ({team1Info.leaders.rpg}{' '}
                      RPG)
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </Box>
          </Box>
          <Box flex="1" boxShadow="md" p="6" rounded="md" className="bg-white">
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
                {team2Info.stats.map(([key, value]) => (
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
                      {team2Info.leaders.pointsLeader} ({team2Info.leaders.ppg}{' '}
                      PPG)
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
                      {team2Info.leaders.assistLeader} ({team2Info.leaders.apg}{' '}
                      APG)
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
                      {team2Info.leaders.reboundLeader} ({team2Info.leaders.rpg}{' '}
                      RPG)
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </Box>
          </Box>
        </Flex>
      </ModalBody>
    );
  };

  const renderFavoritesDetails = () => {
    if (!selectedItem) return <Text>No data available.</Text>;

    // Extract the necessary data from the selected favorite item
    const {
      player_image_url:
        playerImageUrl = 'https://www.logodesignlove.com/images/classic/nba-logo.jpg',
      player_name: playerName,
      team_name: teamName,
      team_image_url: teamImageUrl,
      points_per_game: pointsPerGame,
      rebounds_per_game: reboundsPerGame,
      assists_per_game: assistsPerGame,
      blocks_per_game: blocksPerGame,
      steals_per_game: stealsPerGame,
      fg_percentage: fgPercentage,
      ft_percentage: ftPercentage,
      turnovers_per_game: turnoversPerGame,
      plus_minus: plusMinus,
    } = selectedItem;

    // Mapping stats to a more readable format
    const stats = {
      'Points per Game': pointsPerGame,
      'Rebounds per Game': reboundsPerGame,
      'Assists per Game': assistsPerGame,
      'Blocks per Game': blocksPerGame,
      'Steals per Game': stealsPerGame,
      'Field Goal Percentage': fgPercentage,
      'Free Throw Percentage': ftPercentage,
      'Turnovers per Game': turnoversPerGame,
      'Plus/Minus': plusMinus,
    };

    return (
      <ModalBody overflowY="auto" maxH="70vh">
        <Flex direction="column" align="center" mb={4}>
          <Image
            src={playerImageUrl}
            alt={playerName || 'Unknown Player'}
            className="w-full h-auto mb-4 rounded-lg"
            fallbackSrc="https://www.logodesignlove.com/images/classic/nba-logo.jpg"
          />
          <Flex align="center" justify="center" mb={4}>
            <Text fontSize="xl" fontWeight="bold" mr={3}>
              {teamName || 'No Team'}
            </Text>
            {teamImageUrl ? (
              <Image
                src={teamImageUrl}
                alt={`${teamName} logo`}
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
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Stat</Th>
              <Th isNumeric>Value</Th>
            </Tr>
          </Thead>
          <Tbody>
            {Object.entries(stats).map(([stat, value]) => (
              <Tr key={stat}>
                <Td>{stat}</Td>
                <Td
                  isNumeric
                  fontWeight="extrabold"
                  fontSize="lg"
                  color="blue.600"
                >
                  {value !== null ? value : 'N/A'}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </ModalBody>
    );
  };

  const renderPlayerStatisticsDetails = () => {
    if (!selectedItem) return <Text>No data available.</Text>;

    const {
      points,
      rebounds,
      assists,
      blocks,
      steals,
      plus_minus: plusMinus,
      field_goal_percentage: fgPercentage,
      free_throw_percentage: ftPercentage,
      turnovers,
    } = selectedItem;

    // Pre-process data for the graph (assuming multiple entries for each game)
    const preProcessedArr = [
      {
        points,
        assists,
        rebounds,
        blocks,
        steals,
        fgPercentage,
        ftPercentage,
        turnovers,
        plusMinus,
      },
    ]; // This would ideally be an array of game stats if more data is available

    return (
      <ModalBody overflowY="auto" maxH="70vh">
        <Flex direction="column" align="center" mb={4}>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Statistic</Th>
                <Th isNumeric>Value</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>Points</Td>
                <Td isNumeric fontWeight="extrabold">
                  {points}
                </Td>
              </Tr>
              <Tr>
                <Td>Rebounds</Td>
                <Td isNumeric fontWeight="extrabold">
                  {rebounds}
                </Td>
              </Tr>
              <Tr>
                <Td>Assists</Td>
                <Td isNumeric fontWeight="extrabold">
                  {assists}
                </Td>
              </Tr>
              <Tr>
                <Td>Blocks</Td>
                <Td isNumeric fontWeight="extrabold">
                  {blocks}
                </Td>
              </Tr>
              <Tr>
                <Td>Steals</Td>
                <Td isNumeric fontWeight="extrabold">
                  {steals}
                </Td>
              </Tr>
              <Tr>
                <Td>Field Goal %</Td>
                <Td isNumeric fontWeight="extrabold">
                  {(fgPercentage * 100).toFixed(1)}%
                </Td>
              </Tr>
              <Tr>
                <Td>Free Throw %</Td>
                <Td isNumeric fontWeight="extrabold">
                  {(ftPercentage * 100).toFixed(1)}%
                </Td>
              </Tr>
              <Tr>
                <Td>Turnovers</Td>
                <Td isNumeric fontWeight="extrabold">
                  {turnovers}
                </Td>
              </Tr>
              <Tr>
                <Td>Plus/Minus</Td>
                <Td isNumeric fontWeight="extrabold">
                  {plusMinus}
                </Td>
              </Tr>
            </Tbody>
          </Table>
          <PlayerStatsGraph data={preProcessedArr} />
        </Flex>
      </ModalBody>
    );
  };

  const renderArticlesDetails = () => {
    if (!selectedItem) return <Text>No data available.</Text>;

    const {
      title,
      source,
      url,
      image_url: imageUrl,
      saved_at: savedAt,
    } = selectedItem;

    // Format date
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date(savedAt).toLocaleDateString(
      'en-US',
      dateOptions
    );

    return (
      <ModalBody overflowY="auto" maxH="70vh">
        <Flex direction={{ base: 'column', md: 'row' }} wrap="wrap">
          <Image
            src={imageUrl}
            alt={`Image for ${title}`}
            fallbackSrc="https://via.placeholder.com/500"
            boxSize="100%"
            objectFit="cover"
            borderRadius="lg"
            maxH="300px"
          />
          <Box p="4" borderWidth="1px" borderRadius="lg" width="100%">
            <Text fontSize="2xl" fontWeight="bold" mb="2">
              {title}
            </Text>
            <Text fontSize="md" color="gray.600" mb="4">
              Published by {source} on {formattedDate}
            </Text>
            <Button
              as="a"
              href={url}
              target="_blank"
              colorScheme="blue"
              width="full"
            >
              Read Full Article
            </Button>
          </Box>
        </Flex>
      </ModalBody>
    );
  };

  const renderPlayerComparisonsDetails = () => {
    if (!selectedItem) return <Text>No data available.</Text>;

    const comparisonData = [
      {
        label: 'Points',
        comparison1: selectedItem.points_comparison1,
        comparison2: selectedItem.points_comparison2,
        delta: selectedItem.points_delta,
      },
      {
        label: 'Rebounds',
        comparison1: selectedItem.rebounds_comparison1,
        comparison2: selectedItem.rebounds_comparison2,
        delta: selectedItem.rebounds_delta,
      },
      {
        label: 'Assists',
        comparison1: selectedItem.assists_comparison1,
        comparison2: selectedItem.assists_comparison2,
        delta: selectedItem.assists_delta,
      },
      {
        label: 'Blocks',
        comparison1: selectedItem.blocks_comparison1,
        comparison2: selectedItem.blocks_comparison2,
        delta: selectedItem.blocks_delta,
      },
      {
        label: 'Steals',
        comparison1: selectedItem.steals_comparison1,
        comparison2: selectedItem.steals_comparison2,
        delta: selectedItem.steals_delta,
      },
      {
        label: 'FG%',
        comparison1: selectedItem.fg_percentage_comparison1,
        comparison2: selectedItem.fg_percentage_comparison2,
        delta: selectedItem.fg_percentage_delta,
      },
      {
        label: 'FT%',
        comparison1: selectedItem.ft_percentage_comparison1,
        comparison2: selectedItem.ft_percentage_comparison2,
        delta: selectedItem.ft_percentage_delta,
      },
      {
        label: 'Turnovers',
        comparison1: selectedItem.turnovers_comparison1,
        comparison2: selectedItem.turnovers_comparison2,
        delta: selectedItem.turnovers_delta,
      },
      {
        label: 'Total',
        comparison1: selectedItem.total_comparison1,
        comparison2: selectedItem.total_comparison2,
        delta: selectedItem.total_delta,
      },
    ];

    // Function to determine color based on delta value
    const getColorFromDelta = (delta) => {
      if (delta > 0) return 'green.300'; // Positive difference
      if (delta < 0) return 'red.300'; // Negative difference
      return 'gray.300'; // No significant difference
    };

    return (
      <ModalBody overflowY="auto" maxH="70vh">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Statistic</Th>
              <Th isNumeric>Players List 1</Th>
              <Th isNumeric>Players List 2</Th>
              <Th isNumeric>Delta</Th>
            </Tr>
          </Thead>
          <Tbody>
            {comparisonData.map((item, index) => (
              <Tr key={index}>
                <Td>{item.label}</Td>
                <Td isNumeric>{item.comparison1.toFixed(2)}</Td>
                <Td isNumeric>{item.comparison2.toFixed(2)}</Td>
                <Td
                  isNumeric
                  fontWeight="extrabold"
                  backgroundColor={getColorFromDelta(item.delta)}
                >
                  {item.delta.toFixed(2)}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </ModalBody>
    );
  };

  return (
    <div className="w-full px-32 bg-slate-200">
      <div className="flex flex-col">
        <div className="flex items-center justify-center m-6">
          <h1 className="text-4xl font-bold mb-4">NBA Saved Stats</h1>
        </div>
        <Flex justifyContent="space-between" alignItems="center" mb={4}>
          <Button onClick={onOpenAddNoteModal} colorScheme="blue">
            Add Note
          </Button>
        </Flex>
        {/* <SimpleGrid columns={3} spacing={4}>
          {notes.map((note) => (
            <Box key={note.id} p={4} shadow="md" borderWidth="1px" rounded="md">
              <Text
                fontWeight="bold"
                mb={2}
                onClick={() => editNote(note)}
                cursor="pointer"
              >
                {note.title}
              </Text>
              <Text noOfLines={1}>{note.content}</Text>
              <Button
                size="sm"
                colorScheme="red"
                onClick={() => deleteNote(note.id)}
              >
                Delete
              </Button>
            </Box>
          ))}
        </SimpleGrid> */}
        <div className="mb-8 bg-white rounded-3xl p-6">
          <h2 className="text-3xl mb-2 font-extrabold font-monospace">Notes</h2>
          <div className="grid grid-cols-3 gap-4">
            {notes.map((note) => (
              <div
                key={note.id}
                className="p-4 shadow-md border-2 border-gray-300 rounded-md"
              >
                <h3
                  className="font-bold mb-2 cursor-pointer"
                  onClick={() => editNote(note)}
                >
                  {note.title}
                </h3>
                <p className="truncate">{note.content}</p>
                <button
                  className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md"
                  onClick={() => deleteNote(note.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        <Modal isOpen={isAddNoteModalOpen} onClose={onCloseAddNoteModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{selectedNote ? 'Edit Note' : 'Add Note'}</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <Input
                placeholder="Title"
                value={noteTitle}
                onChange={(e) => handleNoteChange(e, 'title')}
                mb={3}
              />
              <Textarea
                placeholder="Write your note here..."
                value={noteContent}
                onChange={(e) => handleNoteChange(e, 'content')}
              />
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={saveNote}>
                Save
              </Button>
              <Button onClick={onCloseAddNoteModal}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        {/* Display Favorites */}
        <div className="mb-8 bg-white rounded-3xl p-6">
          <h2 className="text-3xl mb-2 font-extrabold font-monospace">
            Player Stats
          </h2>
          <div className="grid grid-cols-4">
            {favorites.map((fav, index) => (
              <div
                key={index}
                className="p-5 m-2 border-2 border-gray-300 rounded-lg shadow-md cursor-pointer hover:shadow-lg"
                onClick={() => showFavoritesDetails(fav)}
              >
                <div className="flex items-center">
                  <img
                    className="w-24 h-24 object-cover rounded-full"
                    src={
                      fav.player_image_url || 'https://via.placeholder.com/150'
                    }
                    alt={fav.player_name || 'Unknown Player'}
                  />
                  <div className="ml-4">
                    <p className="text-xl font-bold mb-1">
                      {fav.player_name || 'Unknown Player'}
                    </p>
                    <p>{fav.team_name || 'No Team'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* <hr className="w-full border-gray-300 border-4 rounded-full " /> */}

        {/* Display Articles */}
        <div className="mb-8 bg-white rounded-3xl p-6 my-4">
          <h2 className="text-3xl mb-2 font-extrabold font-monospace">
            Articles
          </h2>
          <div className="grid grid-cols-2">
            {articles.map((article, index) => (
              <div
                key={index}
                className="p-5 m-2 border-2 border-gray-300 rounded-lg shadow-md cursor-pointer hover:shadow-lg"
                onClick={() => showArticleDetails(article)}
              >
                <div className="flex items-center">
                  <img
                    className="w-24 h-24 object-cover rounded-full"
                    src={article.image_url || 'https://via.placeholder.com/150'}
                    alt={article.title || 'Article'}
                  />
                  <div className="ml-4">
                    <p className="text-xl font-bold mb-1">{article.title}</p>
                    <p>{article.source}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* <hr className="w-full border-gray-300 border-4 rounded-full m-4 " /> */}

        {/* Display Player Statistics */}
        <div className="mb-8 bg-white rounded-3xl p-6 my-4">
          <h2 className="text-3xl mb-2 font-extrabold font-monospace ">
            Player Statistics
          </h2>
          <div className="grid grid-cols-3">
            {playerStatistics.map((stat, index) => (
              <div
                key={index}
                className="p-5 m-2 border-2 border-gray-300 rounded-lg shadow-md cursor-pointer hover:shadow-lg"
                onClick={() => showPlayerStatisticsDetails(stat)}
              >
                <p className="text-xl font-bold mb-1">
                  {stat.player_name || 'Unknown Player'}
                </p>
                <p>Season: {stat.season}</p>
                <p>Points: {stat.points}</p>
                <p>Rebounds: {stat.rebounds}</p>
              </div>
            ))}
          </div>
        </div>
        {/* <hr className="w-full border-gray-300 border-4 rounded-full m-4 " /> */}

        {/* Display Player Comparisons */}
        <div className="mb-8 bg-white rounded-3xl p-6 my-4">
          <h2 className="text-3xl mb-2 font-extrabold font-monospace">
            Players Comparisons
          </h2>
          <div className="grid grid-cols-3">
            {playerComparisons.map((comparison, index) => (
              <div
                key={index}
                className="p-5 m-2 border-2 border-gray-300 rounded-lg shadow-md cursor-pointer hover:shadow-lg"
                onClick={() => showPlayerComparisonsDetails(comparison)}
              >
                <p className="text-xl font-bold mb-1">
                  Comparison: Player A vs Player B
                </p>
                <p>Season: {comparison.season}</p>
              </div>
            ))}
          </div>
        </div>
        {/* <hr className="w-full border-gray-300 border-4 rounded-full m-4 " /> */}
        {/* Display Team Comparisons */}
        <div className="mb-8 bg-white rounded-3xl p-6 my-4">
          <h2 className="text-3xl mb-2 font-extrabold font-monospace">
            Team Comparisons
          </h2>
          <div className="grid grid-cols-2">
            {teamComparisons.map((comparison, index) => (
              <div
                key={index}
                className="p-5 m-2 border-2 border-gray-300 rounded-lg shadow-md cursor-pointer hover:shadow-lg"
                onClick={() => showTeamComparisonsDetails(comparison)}
              >
                <p className="text-xl font-bold mb-1">
                  {comparison.team1_name} vs {comparison.team2_name}
                </p>
                {/* <p>Season: {comparison.season}</p> */}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* <hr className="w-full border-gray-300 border-4 rounded-full m-4 " /> */}

      {/* Modal */}
      {selectedItem && (
        <Modal isOpen={isOpen} onClose={onClose} className="relative z-50">
          <ModalOverlay />
          <ModalContent
            className="max-w-full mx-auto p-5 bg-white rounded-lg shadow-xl"
            maxW={{ base: '90%', md: '80%', lg: '70%' }}
          >
            <ModalHeader className="text-lg font-semibold text-center">
              {selectedItem.player_name || 'Content Details'}
            </ModalHeader>
            <ModalCloseButton className="absolute top-3 right-3 text-gray-400 hover:text-gray-500" />
            <ModalBody>{renderModalContent()}</ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {/* Logout Button */}
      <div className="flex items-center justify-center p-4 pb-8">
        <Button onClick={logout} colorScheme="red" mt={4}>
          Logout
        </Button>
      </div>
    </div>
  );
}

export default Dashboard;
