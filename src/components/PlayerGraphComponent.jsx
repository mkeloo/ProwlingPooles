import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const PlayerStatsGraph = ({ data }) => {
  // Map over the data array and extract points along with the game number (index)
  const formattedData = data.map((item, index) => ({
    gameNumber: index + 1,
    points: item.points
  }));

  return (
    <LineChart
      width={800}
      height={400}
      data={formattedData}
      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="gameNumber" label={{ value: 'Game Number', position: 'bottom' }}/>
      <YAxis label={{ value: 'Points', angle: -90, position: 'insideLeft' }}/>
      <Tooltip />
      <Legend align="right" verticalAlign="top" layout="vertical" />
      <Line type="monotone" dataKey="points" stroke="#8884d8" />
    </LineChart>
  );
};

export default PlayerStatsGraph;