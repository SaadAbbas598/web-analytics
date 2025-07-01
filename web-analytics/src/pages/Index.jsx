import React, { useEffect, useState } from 'react';
import { Eye, Users, TrendingUp, Clock, Globe } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

import StatsCard from '../components/StatsCard';
import VisitorChart from '../components/VisitorChart';
import GeographicMap from '../components/GeographicMap';
import TrafficSources from '../components/TrafficSources';
import RealTimeVisitors from '../components/RealTimeVisitors';
import DeviceBreakdown from '../components/DeviceBreakdown';

const Index = () => {
  const [data, setData] = useState([]);
  const [now, setNow] = useState(new Date());
  const [stats, setStats] = useState({
    totalVisitors: 0,
    pageViews: 0,
    realTime: 0,
    bounceRate: 0,
    avgSession: 0,
  });

  useEffect(() => {
    fetchData();

    const intervalNow = setInterval(() => setNow(new Date()), 1000);
    const intervalData = setInterval(fetchData, 10000);

    return () => {
      clearInterval(intervalData);
      clearInterval(intervalNow);
    };
  }, []);

  async function fetchData() {
    try {
      const res = await fetch('http://webanalytics.softsincs.com/api/tracking/all/');
      const arr = await res.json();

      setData(arr);
      calcStats(arr);
    } catch (e) {
      console.error('API fetch failed', e);
    }
  }

  function calcStats(arr) {
    const totalVisitors = arr.length;

    const totalPageViews = arr.reduce((sum, e) => sum + 1, 0);

    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
    const realTime = arr.filter(e => {
      const d = new Date(e.lastVisit?.$date || e.date);
      return d >= fiveMinAgo;
    }).length;

    const uniqueSessions = new Set(arr.map(e => e.ip)).size;

    const avgSession = arr.length
      ? Math.floor(arr.reduce((sum, e) => sum + (e.timeOnPage || 0), 0) / arr.length)
      : 0;

    const bounceRate = 0; // compute if bounce data exists

    setStats({
      totalVisitors,
      pageViews: totalPageViews,
      realTime,
      bounceRate,
      avgSession,
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* 📅 Header */}
      <header className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">VisitorPulse</h1>
              <p className="text-purple-200 text-sm">Advanced Analytics Dashboard</p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-white font-medium">{now.toLocaleDateString()}</p>
            <p className="text-purple-200 text-sm">{now.toLocaleTimeString()}</p>
          </div>
        </div>
      </header>

      {/* 🧭 Main */}
      <main className="container mx-auto px-6 py-8 space-y-8">
        <RealTimeVisitors count={stats.realTime} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Visitors"
            value={stats.totalVisitors.toLocaleString()}
            icon={<Users className="w-6 h-6" />}
            trend={0}
            color="from-blue-500 to-cyan-500"
          />
          <StatsCard
            title="Page Views"
            value={stats.pageViews.toLocaleString()}
            icon={<Eye className="w-6 h-6" />}
            trend={0}
            color="from-green-500 to-emerald-500"
          />
          <StatsCard
            title="Bounce Rate"
            value={`${stats.bounceRate}%`}
            icon={<TrendingUp className="w-6 h-6" />}
            trend={0}
            color="from-orange-500 to-red-500"
          />
          <StatsCard
            title="Avg. Session"
            value={`${Math.floor(stats.avgSession / 60)}m ${stats.avgSession % 60}s`}
            icon={<Clock className="w-6 h-6" />}
            trend={0}
            color="from-purple-500 to-pink-500"
          />
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-black/20 backdrop-blur-lg border border-white/10">
            {['overview', 'geography', 'devices', 'sources'].map(tab => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="text-white data-[state=active]:bg-white/20"
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2"><VisitorChart data={data} /></div>
              <TrafficSources data={data} />
            </div>
          </TabsContent>

          <TabsContent value="geography">
            <GeographicMap data={data} />
          </TabsContent>

          <TabsContent value="devices">
            <DeviceBreakdown data={data} />
          </TabsContent>

          <TabsContent value="sources">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TrafficSources data={data} detailed />
              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Top Referrers</CardTitle>
                  <CardDescription className="text-purple-200">External sites driving traffic</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Optionally, you can compute this from referrer field as before */}
                  <p className="text-purple-200">See Traffics tab for referrer breakdown.</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
