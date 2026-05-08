import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart as PieIcon, RotateCcw } from 'lucide-react';

const COLORS = ['#00f2ff', '#7000ff'];

const NewsDistributionChart = ({ news, onFilter, onReset, activeFilter }) => {
  const data = useMemo(() => {
    const spaceCount = news.filter(n => n.id.startsWith('space') || n.id.startsWith('mock')).length;
    const techCount = news.filter(n => n.id.startsWith('tech')).length;
    
    return [
      { name: 'Space', value: spaceCount },
      { name: 'Tech', value: techCount },
    ];
  }, [news]);

  const total = data.reduce((acc, cur) => acc + cur.value, 0);

  return (
    <div className="glass-card chart-card flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 text-lg font-bold">
          <PieIcon size={20} className="text-accent-purple" />
          Content Mix
        </div>
        {activeFilter && (
          <button 
            onClick={onReset}
            className="text-xs flex items-center gap-1 text-accent-blue hover:underline bg-transparent border-none cursor-pointer"
          >
            <RotateCcw size={12} /> Show All
          </button>
        )}
      </div>

      <div className="flex-1 w-full flex flex-col items-center justify-center relative min-h-[280px]">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
              onClick={(entry) => onFilter(entry.name)}
              cursor="pointer"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                  opacity={activeFilter && activeFilter !== entry.name ? 0.3 : 1}
                  stroke="none"
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(10, 10, 20, 0.9)', 
                borderColor: 'var(--glass-border)',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                color: 'var(--text-primary)'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-[-10px]">
          <span className="text-3xl font-bold">{total}</span>
          <span className="text-[10px] text-text-secondary uppercase tracking-widest">Articles</span>
        </div>

        {/* Legend / Counts Section */}
        <div className="w-full flex justify-center gap-8 mt-6">
          {data.map((entry, i) => (
            <div 
              key={i} 
              className={`flex items-center gap-3 cursor-pointer transition-all ${activeFilter === entry.name ? 'scale-110' : ''}`}
              onClick={() => onFilter(entry.name)}
            >
              <div style={{ width: 12, height: 12, borderRadius: '3px', backgroundColor: COLORS[i] }}></div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold" style={{ color: activeFilter === entry.name ? COLORS[i] : 'var(--text-primary)' }}>
                  {entry.name}
                </span>
                <span className="text-[10px] text-text-secondary">
                  {entry.value} items
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsDistributionChart;
