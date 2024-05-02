import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Container,
  Heading,
  Text,
  Link,
  Input,
  Button,
  VStack,
  FormControl,
  FormLabel,
  Select,
  SimpleGrid,
  Image,
  Flex,
  IconButton,
  useToast,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon, StarIcon } from '@chakra-ui/icons';
import { jwtDecode } from 'jwt-decode';

const newsSources = [
  {
    id: 1,
    name: 'nba_canada',
    image_url: 'https://basketball.bc.ca/files/CanadaSeriesBelllogo1.png',
  },
  {
    id: 2,
    name: 'NBA',
    image_url:
      'https://w0.peakpx.com/wallpaper/758/947/HD-wallpaper-nba-national-basketball-association-usa-basketball-nba-logo-emblem.jpg',
  },
  {
    id: 3,
    name: 'bleacher_report',
    image_url: 'https://static-assets.bleacherreport.net/img/br_630_height.png',
  },
  {
    id: 4,
    name: 'Yahoo',
    image_url:
      'https://play-lh.googleusercontent.com/z1i9m4nWm_FpoZif0ATggWhSTofoIhcTypSGFzwwkV_yBd74AJJUFUtWbAM9BeecoQ',
  },
  {
    id: 5,
    name: 'ESPN',
    image_url:
      'https://www.newscaststudio.com/wp-content/uploads/2017/01/espn-nba-logo.png',
  },
  {
    id: 6,
    name: 'SLAM',
    image_url:
      'https://slamgoods.com/cdn/shop/files/SLAM_Logo_2021-orange_1080x.png?v=1709299867',
  },
];

const Feature4 = () => {
  const [articles, setArticles] = useState([]);
  const [source, setSource] = useState('');
  const [team, setTeam] = useState('');
  const [player, setPlayer] = useState('');
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(0);
  const [savedArticles, setSavedArticles] = useState(new Set());
  const toast = useToast();

  useEffect(() => {
    fetchArticles();
  }, [page]);

  const generateUniqueId = () => {
    const timestamp = Date.now().toString(36);
    const randomString = Math.random().toString(36).substr(2, 5);
    return timestamp + randomString;
  };

  const fetchArticles = async () => {
    const params = {
      source,
      team,
      player,
      limit,
      offset: page * limit,
    };

    const options = {
      method: 'GET',
      url: 'https://nba-latest-news.p.rapidapi.com/articles',
      headers: {
        'X-RapidAPI-Key': import.meta.env.VITE_REACT_APP_API_KEY,
        'X-RapidAPI-Host': 'nba-latest-news.p.rapidapi.com',
      },
      params: params,
    };

    try {
      const response = await axios.request(options);
      const articlesWithIds = response.data.map((article) => ({
        ...article,
        article_id: generateUniqueId(), // Assuming you have a function to generate unique IDs
      }));
      console.log('Fetched articles:', articlesWithIds); // Debugging statement
      console.log(generateUniqueId());
      setArticles(articlesWithIds);
    } catch (error) {
      console.error(error);
    }
  };

  const getSourceImage = (sourceName) => {
    const found = newsSources.find(
      (ns) => ns.name.toLowerCase() === sourceName.toLowerCase()
    );
    return found ? found.image_url : 'https://via.placeholder.com/100x50';
  };

  const saveArticle = async (article) => {
    if (savedArticles.has(article.article_id)) {
      toast({
        title: 'Already saved.',
        description: 'This article is already in your saved list.',
        status: 'info',
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: 'Authentication Error',
          description: 'No authentication token found.',
          status: 'error',
          duration: 2000,
          isClosable: true,
        });
        return;
      }

      // Retrieve the correct image URL from newsSources based on the article's source
      const image_url = getSourceImage(article.source);

      console.log('Saving article with ID:', article.article_id);

      const response = await axios.post(
        'https://prowling-pooles-backend.onrender.com/api/articles',
        {
          article_id: article.article_id,
          title: article.title,
          source: article.source,
          url: article.url,
          image_url: image_url, // Use the retrieved image URL
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSavedArticles(new Set([...savedArticles, article.article_id]));
      toast({
        title: 'Article Saved',
        description: 'The article has been saved successfully.',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Failed to save the article:', error);
      toast({
        title: 'Error',
        description: 'Failed to save the article. Please try again.',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.xl" centerContent>
      <VStack spacing={4} align="stretch" mt={5}>
        <Box p={5} shadow="md" borderWidth="1px">
          <Heading fontSize="xl">NBA News</Heading>
          <FormControl>
            <FormLabel>Source</FormLabel>
            <Select
              placeholder="Select source"
              onChange={(e) => setSource(e.target.value)}
            >
              {newsSources.map((ns) => (
                <option value={ns.name.toLowerCase()} key={ns.id}>
                  {ns.name}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Team</FormLabel>
            <Input
              placeholder="Team name"
              value={team}
              onChange={(e) => setTeam(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Player</FormLabel>
            <Input
              placeholder="Player name"
              value={player}
              onChange={(e) => setPlayer(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Limit</FormLabel>
            <Input
              type="number"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
            />
          </FormControl>
          <Button
            onClick={() => {
              setPage(0);
              fetchArticles();
            }}
            mt={4}
            colorScheme="blue"
          >
            Fetch News
          </Button>
        </Box>
        <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing={10}>
          {articles.map((article, index) => (
            <Box key={index} p={5} shadow="md" borderWidth="1px">
              <Image
                src={getSourceImage(article.source)}
                alt={`${article.source} logo`}
                mb={4}
              />
              <Heading fontSize="md">{article.title}</Heading>
              <Text mt={2}>{article.source}</Text>
              <Link href={article.url} isExternal color="teal.500">
                Read more
              </Link>
              <Button
                onClick={() => saveArticle(article)}
                leftIcon={<StarIcon />}
                colorScheme="yellow"
                size="sm"
                mt={2}
              >
                Save Article
              </Button>
            </Box>
          ))}
        </SimpleGrid>
        <Flex justifyContent="center" mt={4}>
          <IconButton
            icon={<ChevronLeftIcon />}
            isDisabled={page === 0}
            onClick={() => setPage(page - 1)}
          />
          <Text mx={2}>Page {page + 1}</Text>
          <IconButton
            icon={<ChevronRightIcon />}
            onClick={() => setPage(page + 1)}
          />
        </Flex>
      </VStack>
    </Container>
  );
};

export default Feature4;
