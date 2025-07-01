import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const VisitorChart = () => {
  const data = [
    { name: 'Mon', visitors: 4200, pageViews: 8400 },
    { name: 'Tue', visitors: 3800, pageViews: 7600 },
    { name: 'Wed', visitors: 5200, pageViews: 10400 },
    { name: 'Thu', visitors: 4800, pageViews: 9600 },
    { name: 'Fri', visitors: 6200, pageViews: 12400 },
    { name: 'Sat', visitors: 5800, pageViews: 11600 },
    { name: 'Sun', visitors: 4600, pageViews: 9200 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/80 backdrop-blur-lg border border-white/20 rounded-lg p-3">
          <p className="text-white font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.dataKey === 'visitors' ? 'Visitors' : 'Page Views'}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-black/20 backdrop-blur-lg border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Visitor Trends</CardTitle>
        <CardDescription className="text-purple-200">
          Weekly visitor and page view analytics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="visitorsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="pageViewsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9ca3af', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9ca3af', fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="visitors"
                stroke="#8b5cf6"
                strokeWidth={2}
                fill="url(#visitorsGradient)"
              />
              <Area
                type="monotone"
                dataKey="pageViews"
                stroke="#06b6d4"
                strokeWidth={2}
                fill="url(#pageViewsGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default VisitorChart;
