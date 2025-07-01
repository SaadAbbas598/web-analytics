import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Activity } from 'lucide-react';

const RealTimeVisitors = () => {
  const [visitorCount, setVisitorCount] = useState(0);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const fetchVisitorCount = async () => {
      try {
        const res = await fetch('http://webanalytics.softsincs.com/api/tracking/all/');
        const data = await res.json();

        const now = new Date();
        const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

        const liveVisitors = data.filter(item => {
          const lastVisit = new Date(item.lastVisit?.$date || item.lastVisit);
          return lastVisit >= fiveMinutesAgo;
        });

        setVisitorCount(liveVisitors.length);
      } catch (error) {
        console.error('Failed to fetch visitor data:', error);
      }
    };

    fetchVisitorCount();
    const interval = setInterval(() => {
      fetchVisitorCount();
      setPulse(true);
      setTimeout(() => setPulse(false), 1000);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-lg border-green-500/30">
      <CardContent className="p-6">
        <div className="flex items-center justify-center space-x-4">
          <div className={`relative ${pulse ? 'animate-pulse' : ''}`}>
            <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
          </div>
          <div className="text-center">
            <p className="text-green-300 text-sm font-medium">LIVE VISITORS</p>
            <p className="text-3xl font-bold text-white">{visitorCount.toLocaleString()}</p>
          </div>
          <Activity className="w-6 h-6 text-green-400" />
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeVisitors;
