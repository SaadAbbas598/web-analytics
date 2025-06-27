
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Activity } from 'lucide-react';

const RealTimeVisitors = ({ count }) => {
  const [animatedCount, setAnimatedCount] = useState(0);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 1000);
      
      // Simulate real-time count changes
      const change = Math.floor(Math.random() * 10) - 5;
      setAnimatedCount(prev => Math.max(0, prev + change));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setAnimatedCount(count);
  }, [count]);

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
            <p className="text-3xl font-bold text-white">{animatedCount.toLocaleString()}</p>
          </div>
          <Activity className="w-6 h-6 text-green-400" />
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeVisitors;
