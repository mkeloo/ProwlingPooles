import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Scatter,
} from 'recharts';

const PlayerStatsGraph = ({ data }) => {
  // Map over the data array and extract points along with the game number (index)
  const formattedDataPoints = data.map((item, index) => ({
    gameNumber: index + 1,
    points: item.points,
  }));
  const formattedDataAssists = data.map((item, index) => ({
    gameNumber: index + 1,
    assists: item.assists,
  }));
  const formattedDataRebounds = data.map((item, index) => ({
    gameNumber: index + 1,
    rebounds: item.defReb + item.offReb,
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {/* Points LineChart */}
      <div>
        <LineChart
          width={window.innerWidth / 2 - 50} // Adjust width for half the screen size minus padding
          height={400}
          data={formattedDataPoints}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="gameNumber"
            label={{ value: 'Game Number', position: 'bottom' }}
          />
          <YAxis
            label={{ value: 'Points', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip />
          <Legend align="right" verticalAlign="top" layout="vertical" />
          <Line type="monotone" dataKey="points" stroke="#8884d8" />
          <Scatter data={formattedDataPoints} fill="#8884d8" line />
        </LineChart>
      </div>

      {/* Rebounds LineChart */}
      <div>
        <LineChart
          width={window.innerWidth / 2 - 50} // Same width adjustment as above
          height={400}
          data={formattedDataRebounds}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="gameNumber"
            label={{ value: 'Game Number', position: 'bottom' }}
          />
          <YAxis
            label={{ value: 'Rebounds', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip />
          <Legend align="right" verticalAlign="top" layout="vertical" />
          <Line type="monotone" dataKey="rebounds" stroke="#FF3333" />
          <Scatter data={formattedDataRebounds} fill="#FF3333" line />
        </LineChart>
      </div>

      {/* Assists LineChart */}
      <div>
        <LineChart
          width={window.innerWidth / 2 - 50} // Adjust to ensure full usage of available space
          height={400}
          data={formattedDataAssists}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="gameNumber"
            label={{ value: 'Game Number', position: 'bottom' }}
          />
          <YAxis
            label={{ value: 'Assists', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip />
          <Legend align="right" verticalAlign="top" layout="vertical" />
          <Line type="monotone" dataKey="assists" stroke="#006CFF" />
          <Scatter data={formattedDataAssists} fill="#006CFF" line />
        </LineChart>
      </div>
    </div>
  );
};

export default PlayerStatsGraph;
