import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Eye, Users, Clock, Globe, MousePointerClick } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import StatsCard from "../components/StatsCard";
import VisitorChart from "../components/VisitorChart";
import GeographicMap from "../components/GeographicMap";
import TrafficSources from "../components/TrafficSources";
import RealTimeVisitors from "../components/RealTimeVisitors";
import DeviceBreakdown from "../components/DeviceBreakdown";

const Index = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [analytics, setAnalytics] = useState({
    totalVisitors: 0,
    pageViews: 0,
    totalClicks: 0,
    totalTimeSpent: 0,
  });
  const [topReferrers, setTopReferrers] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const { web_id, exp } = decoded;

      if (Date.now() >= exp * 1000) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      fetchAnalytics(web_id, token);
    } catch (err) {
      console.error("Invalid token", err);
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, []);

  const fetchAnalytics = async (web_id, token) => {
    try {
      const res = await fetch(
        `https://webanalytics.softsincs.com/api/tracking/${web_id}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();

      const uniqueDevices = new Set();
      let clicks = 0;
      let timeSpent = 0;
      const referrerMap = {};

      data.forEach((entry) => {
        uniqueDevices.add(entry.device_id);
        clicks += entry.clicks || 0;
        timeSpent += entry.timeOnPage || 0;

        const site = entry.referrer
          ? new URL(entry.referrer).hostname
          : "Direct";
        referrerMap[site] = (referrerMap[site] || 0) + 1;
      });

      const totalRef = Object.values(referrerMap).reduce((a, b) => a + b, 0);
      const topReferrerList = Object.entries(referrerMap)
        .map(([site, visitors]) => ({
          site,
          visitors,
          percentage: ((visitors / totalRef) * 100).toFixed(1),
        }))
        .sort((a, b) => b.visitors - a.visitors)
        .slice(0, 5);

      setAnalytics({
        totalVisitors: uniqueDevices.size,
        pageViews: data.length,
        totalClicks: clicks,
        totalTimeSpent: timeSpent,
      });

      setTopReferrers(topReferrerList);
    } catch (err) {
      console.error("Analytics fetch failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <header className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">VisitorPulse</h1>
              <p className="text-purple-200 text-sm">Analytics Dashboard</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-medium">{currentTime.toLocaleDateString()}</p>
            <p className="text-purple-200 text-sm">
              {currentTime.toLocaleTimeString()}
            </p>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
              className="mt-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <RealTimeVisitors count={analytics.totalVisitors} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Visitors"
            value={analytics.totalVisitors.toLocaleString()}
            icon={<Users />}
            color="from-blue-500 to-cyan-500"
          />
          <StatsCard
            title="Page Views"
            value={analytics.pageViews.toLocaleString()}
            icon={<Eye />}
            color="from-green-500 to-emerald-500"
          />
          <StatsCard
            title="Total Clicks"
            value={analytics.totalClicks.toLocaleString()}
            icon={<MousePointerClick />}
            color="from-orange-500 to-yellow-500"
          />
          <StatsCard
            title="Time Spent"
            value={`${Math.floor(analytics.totalTimeSpent / 60)}m ${
              analytics.totalTimeSpent % 60
            }s`}
            icon={<Clock />}
            color="from-purple-500 to-pink-500"
          />
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-black/20 border border-white/10">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="geography">Geography</TabsTrigger>
            <TabsTrigger value="devices">Devices</TabsTrigger>
            <TabsTrigger value="sources">Traffic Sources</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <VisitorChart />
              </div>
              <div>
                <TrafficSources />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="geography">
            <GeographicMap />
          </TabsContent>
          <TabsContent value="devices">
            <DeviceBreakdown />
          </TabsContent>

          <TabsContent value="sources">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TrafficSources detailed />
              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle>Top Referrers</CardTitle>
                  <CardDescription className="text-purple-200">
                    Sites driving traffic
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topReferrers.map((ref, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
                            <Globe className="w-4 h-4 text-purple-300" />
                          </div>
                          <span className="font-medium">{ref.site}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            {ref.visitors.toLocaleString()}
                          </p>
                          <p className="text-purple-200 text-sm">
                            {ref.percentage}%
                          </p>
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
