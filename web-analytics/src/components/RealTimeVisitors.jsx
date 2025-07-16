import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Activity } from 'lucide-react';

const RealTimeVisitors = () => {
  const [liveCount, setLiveCount] = useState(0);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const fetchLiveVisitors = async () => {
      try {
        const res = await fetch('https://webanalytics.softsincs.com/api/tracking/all/');
        const data = await res.json();

        const now = new Date();
        const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);

        const liveVisitors = data.filter(entry => {
          const lastVisit = new Date(entry.lastVisit?.$date);
          return lastVisit >= oneMinuteAgo;
        });

        setPulse(true);
        setTimeout(() => setPulse(false), 1000);
        setLiveCount(liveVisitors.length);
      } catch (err) {
        console.error('Error fetching live visitors:', err);
      }
    };

    fetchLiveVisitors();
    const interval = setInterval(fetchLiveVisitors, 5000); // refresh every 5 seconds
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
            <p className="text-3xl font-bold text-white">{liveCount.toLocaleString()}</p>
          </div>
          <Activity className="w-6 h-6 text-green-400" />
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeVisitors;
