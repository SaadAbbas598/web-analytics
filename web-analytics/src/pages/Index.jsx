import React, { useState, useEffect } from 'react';
import {
  Eye,
  Users,
  TrendingUp,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  MousePointerClick,
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import StatsCard from '../components/StatsCard';
import VisitorChart from '../components/VisitorChart';
import GeographicMap from '../components/GeographicMap';
import TrafficSources from '../components/TrafficSources';
import RealTimeVisitors from '../components/RealTimeVisitors';
import DeviceBreakdown from '../components/DeviceBreakdown';

const Index = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [analytics, setAnalytics] = useState({
    totalVisitors: 0,
    pageViews: 0,
    totalClicks: 0,
    totalTimeSpent: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('http://webanalytics.softsincs.com/api/tracking/all/');
        const data = await res.json();

        const uniqueDevices = new Set();
        let clicks = 0;
        let timeSpent = 0;

        data.forEach(entry => {
          uniqueDevices.add(entry.device_id);
          clicks += entry.clicks || 0;
          timeSpent += entry.timeOnPage || 0;
        });

        setAnalytics({
          totalVisitors: uniqueDevices.size,
          pageViews: data.length,
          totalClicks: clicks,
          totalTimeSpent: timeSpent,
        });
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
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
              <p className="text-white font-medium">{currentTime.toLocaleDateString()}</p>
              <p className="text-purple-200 text-sm">{currentTime.toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Real-time Banner */}
        <div className="mb-8">
          <RealTimeVisitors count={analytics.totalVisitors} />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Visitors"
            value={analytics.totalVisitors.toLocaleString()}
            icon={<Users className="w-6 h-6" />}
            color="from-blue-500 to-cyan-500"
          />
          <StatsCard
            title="Page Views"
            value={analytics.pageViews.toLocaleString()}
            icon={<Eye className="w-6 h-6" />}
            color="from-green-500 to-emerald-500"
          />
          <StatsCard
            title="Total Clicks"
            value={analytics.totalClicks.toLocaleString()}
            icon={<MousePointerClick className="w-6 h-6" />}
            color="from-orange-500 to-yellow-500"
          />
          <StatsCard
            title="Total Time Spent"
            value={`${Math.floor(analytics.totalTimeSpent / 60)}m ${analytics.totalTimeSpent % 60}s`}
            icon={<Clock className="w-6 h-6" />}
            color="from-purple-500 to-pink-500"
          />
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-black/20 backdrop-blur-lg border border-white/10">
            <TabsTrigger value="overview" className="text-white data-[state=active]:bg-white/20">
              Overview
            </TabsTrigger>
            <TabsTrigger value="geography" className="text-white data-[state=active]:bg-white/20">
              Geography
            </TabsTrigger>
            <TabsTrigger value="devices" className="text-white data-[state=active]:bg-white/20">
              Devices
            </TabsTrigger>
            <TabsTrigger value="sources" className="text-white data-[state=active]:bg-white/20">
              Traffic Sources
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <VisitorChart />
              </div>
              <div>
                <TrafficSources />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="geography" className="space-y-6">
            <GeographicMap />
          </TabsContent>

          <TabsContent value="devices" className="space-y-6">
            <DeviceBreakdown />
          </TabsContent>

          <TabsContent value="sources" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TrafficSources detailed={true} />
              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Top Referrers</CardTitle>
                  <CardDescription className="text-purple-200">
                    External sites driving traffic
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { site: 'google.com', visitors: 15420, percentage: 42.3 },
                      { site: 'facebook.com', visitors: 8932, percentage: 24.5 },
                      { site: 'twitter.com', visitors: 4521, percentage: 12.4 },
                      { site: 'linkedin.com', visitors: 3210, percentage: 8.8 },
                      { site: 'youtube.com', visitors: 2156, percentage: 5.9 }
                    ].map((referrer, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
                            <Globe className="w-4 h-4 text-purple-300" />
                          </div>
                          <span className="text-white font-medium">{referrer.site}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-semibold">{referrer.visitors.toLocaleString()}</p>
                          <p className="text-purple-200 text-sm">{referrer.percentage}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
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
