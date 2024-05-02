import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Scatter } from 'recharts';

const PlayerStatsGraph = ({ data }) => {
  // Map over the data array and extract points along with the game number (index)
  const formattedDataPoints = data.map((item, index) => ({
    gameNumber: index + 1,
    points: item.points
  }));
  const formattedDataAssists = data.map((item, index) => ({
    gameNumber: index + 1,
    assists: item.assists
  }));
  const formattedDataRebounds = data.map((item, index) => ({
    gameNumber: index + 1,
    rebounds: item.defReb + item.offReb
  }));
  

  return (
    <div>
    {/* Points LineChart */}
    <LineChart
      width={800}
      height={400}
      data={formattedDataPoints}
      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="gameNumber" label={{ value: 'Game Number', position: 'bottom' }}/>
      <YAxis label={{ value: 'Points', angle: -90, position: 'insideLeft' }}/>
      <Tooltip />
      <Legend align="right" verticalAlign="top" layout="vertical" />
      <Line type="monotone" dataKey="points" stroke="#8884d8" />
      <Scatter data={formattedDataPoints} fill="#8884d8" line />
    </LineChart>

    {/* Rebounds LineChart */}
    <LineChart
      width={800}
      height={400}
      data={formattedDataRebounds}
      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="gameNumber" label={{ value: 'Game Number', position: 'bottom' }}/>
      <YAxis label={{ value: 'Rebounds', angle: -90, position: 'insideLeft' }}/>
      <Tooltip />
      <Legend align="right" verticalAlign="top" layout="vertical" />
      <Line type="monotone" dataKey="rebounds" stroke="#ffc658" />
      <Scatter data={formattedDataRebounds} fill="#ffc658" line />
    </LineChart>

    {/* Assists LineChart */}
    <LineChart
      width={800}
      height={400}
      data={formattedDataAssists}
      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="gameNumber" label={{ value: 'Game Number', position: 'bottom' }}/>
      <YAxis label={{ value: 'Assists', angle: -90, position: 'insideLeft' }}/>
      <Tooltip />
      <Legend align="right" verticalAlign="top" layout="vertical" />
      <Line type="monotone" dataKey="assists" stroke="#82ca9d" />
      <Scatter data={formattedDataAssists} fill="#82ca9d" line />
    </LineChart>
  </div>
    

  );
};

export default PlayerStatsGraph;