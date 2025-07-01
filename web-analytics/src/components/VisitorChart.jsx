import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import dayjs from 'dayjs';

const VisitorChart = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const res = await fetch('http://webanalytics.softsincs.com/api/tracking/all/');
        const rawData = await res.json();

        // Initialize 7-day stats
        const dayStats = {
          Mon: { visitors: new Set(), pageViews: 0 },
          Tue: { visitors: new Set(), pageViews: 0 },
          Wed: { visitors: new Set(), pageViews: 0 },
          Thu: { visitors: new Set(), pageViews: 0 },
          Fri: { visitors: new Set(), pageViews: 0 },
          Sat: { visitors: new Set(), pageViews: 0 },
          Sun: { visitors: new Set(), pageViews: 0 }
        };

        rawData.forEach(entry => {
          const lastVisitDate = entry.lastVisit?.$date || entry.date;
          if (!lastVisitDate) return;

          const day = dayjs(lastVisitDate).format('ddd'); // 'Mon', 'Tue', etc.
          const ip = entry.ip;

          if (dayStats[day]) {
            if (ip) dayStats[day].visitors.add(ip);
            dayStats[day].pageViews += 1; // each entry is 1 page view
          }
        });

        const formatted = Object.entries(dayStats).map(([day, stats]) => ({
          name: day,
          visitors: stats.visitors.size,
          pageViews: stats.pageViews
        }));

        setChartData(formatted);
      } catch (err) {
        console.error('Error loading chart data:', err);
      }
    };

    fetchChartData();
  }, []);

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
            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
