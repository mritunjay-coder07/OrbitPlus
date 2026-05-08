import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Gauge } from 'lucide-react';

const SpeedChart = ({ history }) => {
  return (
    <div className="glass-card chart-card">
      <div className="chart-title">
        <Gauge size={20} className="text-accent-blue" />
        ISS Velocity Trend (km/h)
      </div>

      {history.length < 2 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-text-secondary gap-2">
          <div className="animate-pulse">Waiting for telemetry...</div>
          <p className="text-xs">Need at least 2 data points</p>
        </div>
      ) : (
        <div className="flex-1 w-full" style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
              <XAxis
                dataKey="time"
                stroke="var(--text-secondary)"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="var(--text-secondary)"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                domain={['auto', 'auto']}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--glass-border)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)',
                  color: 'var(--text-primary)'
                }}
                itemStyle={{ color: 'var(--accent-blue)' }}
              />
              <Line
                type="monotone"
                dataKey="speed"
                stroke="var(--accent-blue)"
                strokeWidth={3}
                dot={false}
                animationDuration={500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default SpeedChart;
