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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useDisclosure,
} from '@chakra-ui/react';
import { jwtDecode } from 'jwt-decode';

function Dashboard() {
  const [favorites, setFavorites] = useState([]);
  const [username, setUsername] = useState('User');
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [articles, setArticles] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

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
    } catch (error) {
      console.error('Token decoding error or token expired:', error);
      logout();
    }
  }, [navigate]);

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
      setArticles(response.data); // Make sure this line correctly updates the articles state
    } catch (error) {
      console.error('Failed to fetch articles:', error);
      if (error.response && error.response.status === 401) {
        logout(); // Handle unauthorized access, possibly due to expired token
      }
    }
  };

  const showPlayerDetails = (player) => {
    setSelectedPlayer(player);
    onOpen();
  };

  const showArticleDetails = (article) => {
    setSelectedArticle(article); // Define setSelectedArticle state handler
    onOpen(); // Use the same modal controls or define a new one for articles
  };

  function logout() {
    localStorage.removeItem('token');
    navigate('/login');
  }

  return (
    <Flex direction="column" align="center" m={5}>
      <Heading mb={4}>Welcome to your Stats Dash, {username}!</Heading>
      <Text fontSize="2xl" mb={2}>
        Saved Player Stats
      </Text>
      <Flex wrap="wrap" justify="center">
        {favorites.map((fav, index) => (
          <Box
            key={index}
            p={5}
            m={2}
            borderWidth="1px"
            borderRadius="lg"
            shadow="md"
            cursor="pointer"
            onClick={() => showPlayerDetails(fav)}
            className="transition duration-300 ease-in-out hover:shadow-lg"
          >
            <Flex direction="column" align="center">
              <Image
                boxSize="100px"
                src={fav.player_image_url || 'https://via.placeholder.com/150'}
                alt={fav.player_name || 'Unknown Player'}
                mb={2}
                className="rounded-full"
              />
              <Text fontSize="xl" fontWeight="bold">
                {fav.player_name || 'Unknown Player'}
              </Text>
              <Text>{fav.team_name || 'No Team'}</Text>
            </Flex>
          </Box>
        ))}
      </Flex>
      <Flex wrap="wrap" justify="center">
        {articles.map((article, index) => (
          <Box
            key={index}
            p={5}
            m={2}
            borderWidth="1px"
            borderRadius="lg"
            shadow="md"
            cursor="pointer"
            className="transition duration-300 ease-in-out hover:shadow-lg"
            onClick={() => showArticleDetails(article)} // Define `showArticleDetails` function to handle click
          >
            <Flex direction="column" align="center">
              <Image
                boxSize="100px"
                src={article.image_url || 'https://via.placeholder.com/150'}
                alt={article.title || 'Article'}
                mb={2}
                className="rounded-full"
              />
              <Text fontSize="xl" fontWeight="bold">
                {article.title}
              </Text>
              <Text>{article.source}</Text>
            </Flex>
          </Box>
        ))}
      </Flex>

      {selectedPlayer && (
        <Modal isOpen={isOpen} onClose={onClose} className="relative z-50">
          <ModalOverlay />
          <ModalContent className="max-w-xl mx-auto p-5 bg-white rounded-lg shadow-xl">
            <ModalHeader className="text-lg font-semibold text-center">
              {selectedPlayer.player_name}
            </ModalHeader>
            <ModalCloseButton className="absolute top-3 right-3 text-gray-400 hover:text-gray-500" />

            <ModalBody>
              <Flex direction="column" align="center" mb={4}>
                <Image
                  src={
                    selectedPlayer.player_image_url ||
                    'https://via.placeholder.com/150'
                  }
                  alt={selectedPlayer.player_name}
                  className="w-full h-auto mb-4 rounded-lg"
                  fallbackSrc="https://via.placeholder.com/150"
                />
                <Flex align="center" justify="center" mb={4}>
                  <Text fontSize="xl" fontWeight="bold" mr={3}>
                    {selectedPlayer.team_name}
                  </Text>
                  {selectedPlayer.team_logo ? (
                    <Image
                      src={selectedPlayer.team_logo}
                      alt={`${selectedPlayer.team_name} logo`}
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
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Stat</Th>
                      <Th isNumeric>Value</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {[
                      'points_per_game',
                      'rebounds_per_game',
                      'assists_per_game',
                      'blocks_per_game',
                      'steals_per_game',
                      'fg_percentage',
                      'ft_percentage',
                      'turnovers_per_game',
                      'plus_minus',
                    ].map((stat) => (
                      <Tr key={stat}>
                        <Td>
                          {stat
                            .replace(/_/g, ' ')
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </Td>
                        <Td
                          isNumeric
                          fontWeight="extrabold"
                          fontSize="lg"
                          color="blue.600"
                        >
                          {selectedPlayer[stat]}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Flex>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      <Button onClick={logout} colorScheme="red" mt={4}>
        Logout
      </Button>
    </Flex>
  );
}

export default Dashboard;
