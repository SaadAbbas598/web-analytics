import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';

const TrafficSources = ({ detailed = false }) => {
  const sourceData = [
    { name: 'Organic Search', value: 42.3, visitors: 18945, color: '#8b5cf6' },
    { name: 'Direct', value: 28.7, visitors: 12846, color: '#06b6d4' },
    { name: 'Social Media', value: 15.2, visitors: 6802, color: '#10b981' },
    { name: 'Referral', value: 8.9, visitors: 3982, color: '#f59e0b' },
    { name: 'Email', value: 4.9, visitors: 2194, color: '#ef4444' }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-black/80 backdrop-blur-lg border border-white/20 rounded-lg p-3">
          <p className="text-white font-medium">{data.name}</p>
          <p className="text-purple-200 text-sm">{data.visitors.toLocaleString()} visitors</p>
          <p className="text-purple-200 text-sm">{data.value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-black/20 backdrop-blur-lg border-white/10">
      <CardHeader>
        <CardTitle className="text-white">{detailed ? 'Detailed Traffic Sources' : 'Traffic Sources'}</CardTitle>
        <CardDescription className="text-purple-200">
          Where your visitors are coming from
        </CardDescription>
      </CardHeader>
      <CardContent>
        {detailed ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9ca3af', fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="visitors" radius={[4, 4, 0, 0]}>
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div>
            <div className="h-64 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {sourceData.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: source.color }}
                    ></div>
                    <span className="text-white text-sm">{source.name}</span>
                  </div>
                  <span className="text-purple-200 text-sm font-medium">{source.value}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrafficSources;