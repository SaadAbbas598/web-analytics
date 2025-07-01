import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';

const TRAFFIC_COLORS = {
  'Organic Search': '#8b5cf6',
  'Direct': '#06b6d4',
  'Social Media': '#10b981',
  'Referral': '#f59e0b',
  'Email': '#ef4444',
  'Other': '#6b7280'
};

const TrafficSources = ({ detailed = false }) => {
  const [sourceData, setSourceData] = useState([]);

  useEffect(() => {
    const fetchSources = async () => {
      try {
        const res = await fetch('http://webanalytics.softsincs.com/api/tracking/all/');
        const data = await res.json();

        const total = data.length;
        const sourceMap = {};

        data.forEach(entry => {
          const ref = entry.referrer || '';
          const name = formatSource(ref);
          if (!sourceMap[name]) sourceMap[name] = 1;
          else sourceMap[name]++;
        });

        const result = Object.entries(sourceMap)
          .map(([name, count]) => ({
            name,
            visitors: count,
            value: parseFloat(((count / total) * 100).toFixed(1)),
            color: TRAFFIC_COLORS[name] || TRAFFIC_COLORS['Other']
          }))
          .sort((a, b) => b.visitors - a.visitors);

        setSourceData(result);
      } catch (err) {
        console.error('Failed to fetch traffic sources:', err);
      }
    };

    fetchSources();
  }, []);

  const formatSource = (referrer) => {
    const ref = referrer.toLowerCase();

    if (!ref || ref === '') return 'Direct';
    if (ref.includes('google') || ref.includes('bing') || ref.includes('yahoo') || ref.includes('duckduckgo'))
      return 'Organic Search';
    if (ref.includes('facebook') || ref.includes('twitter') || ref.includes('instagram') || ref.includes('linkedin'))
      return 'Social Media';
    if (ref.includes('mail') || ref.includes('email')) return 'Email';
    if (ref.startsWith('http')) return 'Referral';

    return 'Other';
  };

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
