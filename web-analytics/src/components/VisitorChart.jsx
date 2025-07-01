import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import dayjs from 'dayjs';

const VisitorChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Mock data for demonstration
        const mockData = generateMockData();
        setChartData(mockData);
        
        // Uncomment to use real API when ready
        // const res = await fetch('http://webanalytics.softsincs.com/api/tracking/all/');
        // const rawData = await res.json();
        // processData(rawData);
        
      } catch (err) {
        console.error('Error loading chart data:', err);
        setError('Failed to load data');
        setChartData(generateMockData()); // Fallback to mock data
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  const processData = (rawData) => {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    const dayStats = daysOfWeek.reduce((acc, day) => {
      acc[day] = { visitors: new Set(), pageViews: 0 };
      return acc;
    }, {});

    rawData.forEach(entry => {
      const lastVisitDate = entry.lastVisit?.$date || entry.date;
      if (!lastVisitDate) return;

      const day = dayjs(lastVisitDate).format('ddd');
      const ip = entry.ip;

      if (dayStats[day]) {
        if (ip) dayStats[day].visitors.add(ip);
        dayStats[day].pageViews += 1;
      }
    });

    const formatted = daysOfWeek.map(day => ({
      name: day,
      visitors: dayStats[day]?.visitors.size || 0,
      pageViews: dayStats[day]?.pageViews || 0
    }));

    setChartData(formatted);
  };

  const generateMockData = () => {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return daysOfWeek.map(day => ({
      name: day,
      visitors: Math.floor(Math.random() * 100) + 50,
      pageViews: Math.floor(Math.random() * 200) + 100
    }));
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="font-medium text-white">{label}</p>
          {payload.map((entry, index) => (
            <p 
              key={index} 
              className="text-sm mt-1"
              style={{ color: entry.color }}
            >
              <span className="font-medium capitalize">{entry.dataKey}:</span> {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Card className="bg-black/20 backdrop-blur-lg border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Visitor Trends</CardTitle>
          <CardDescription className="text-purple-200">
            Weekly visitor and page view analytics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-8 w-40 bg-gray-700 rounded mb-4"></div>
              <div className="h-64 w-full bg-gray-800 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-black/20 backdrop-blur-lg border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Visitor Trends</CardTitle>
          <CardDescription className="text-purple-200">
            Weekly visitor and page view analytics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex flex-col items-center justify-center space-y-2">
            <span className="text-red-400">⚠️ {error}</span>
            <p className="text-purple-200 text-sm">Showing demo data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

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
            <AreaChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              className="text-xs"
            >
              <defs>
                <linearGradient id="visitorsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="pageViewsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#374151" 
                vertical={false}
              />
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
                width={40}
              />
              <Tooltip 
                content={<CustomTooltip />}
                cursor={{ stroke: '#4b5563', strokeWidth: 1 }}
              />
              <Area
                type="monotone"
                dataKey="visitors"
                stroke="#8b5cf6"
                strokeWidth={2}
                fill="url(#visitorsGradient)"
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
              <Area
                type="monotone"
                dataKey="pageViews"
                stroke="#06b6d4"
                strokeWidth={2}
                fill="url(#pageViewsGradient)"
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default VisitorChart;