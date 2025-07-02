import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../components/ui/card';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const VisitorChart = () => {
  const [data, setData] = useState([]);

  // Fetch and group data by weekday
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://webanalytics.softsincs.com/api/tracking/all/');
        const result = await res.json();

        const grouped = {};

        result.forEach(item => {
          const date = new Date(item.lastVisit.$date);
          const weekday = date.toLocaleDateString('en-US', { weekday: 'short' }); // e.g., "Mon"

          if (!grouped[weekday]) {
            grouped[weekday] = {
              name: weekday,
              pageViews: 0,
              visitorsSet: new Set()
            };
          }

          grouped[weekday].pageViews += 1;
          grouped[weekday].visitorsSet.add(item.device_id);
        });

        const weekdayOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

        const chartData = weekdayOrder.map(day => {
          const entry = grouped[day] || { pageViews: 0, visitorsSet: new Set() };
          return {
            name: day,
            pageViews: entry.pageViews,
            visitors: entry.visitorsSet.size
          };
        });

        setData(chartData);
      } catch (error) {
        console.error('Error fetching visitor data:', error);
      }
    };

    fetchData();
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
            <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="visitorsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="pageViewsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
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
