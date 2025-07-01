import React, { useEffect, useState } from 'react';
import StatsCard from './StatsCard';
import { Users, MousePointerClick, Clock } from 'lucide-react';

const StatsOverview = () => {
  const [trackingData, setTrackingData] = useState([]);
  const [trendVisitors, setTrendVisitors] = useState(0);
  const [trendUnique, setTrendUnique] = useState(0);
  const [trendClicks, setTrendClicks] = useState(0);

  const [prevStats, setPrevStats] = useState({
    visitors: 0,
    unique: 0,
    clicks: 0,
  });

  useEffect(() => {
    const fetchTrackingData = async () => {
      try {
        const res = await fetch('http://webanalytics.softsincs.com/api/tracking/all/');
        const data = await res.json();

        setTrackingData(data);

        // Current stats
        const currentVisitors = data.length;
        const uniqueIPs = new Set(data.map((item) => item.ip));
        const currentUnique = uniqueIPs.size;
        const currentClicks = data.reduce((acc, curr) => acc + (curr.clicks || 0), 0);

        // Trends
        if (prevStats.visitors > 0) {
          const vChange = (((currentVisitors - prevStats.visitors) / prevStats.visitors) * 100).toFixed(1);
          setTrendVisitors(parseFloat(vChange));
        }

        if (prevStats.unique > 0) {
          const uChange = (((currentUnique - prevStats.unique) / prevStats.unique) * 100).toFixed(1);
          setTrendUnique(parseFloat(uChange));
        }

        if (prevStats.clicks > 0) {
          const cChange = (((currentClicks - prevStats.clicks) / prevStats.clicks) * 100).toFixed(1);
          setTrendClicks(parseFloat(cChange));
        }

        setPrevStats({
          visitors: currentVisitors,
          unique: currentUnique,
          clicks: currentClicks,
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };

    fetchTrackingData();
    const interval = setInterval(fetchTrackingData, 10000);

    return () => clearInterval(interval);
  }, [prevStats]);

  const totalVisitors = trackingData.length;
  const uniqueUsers = new Set(trackingData.map((item) => item.ip)).size;
  const totalClicks = trackingData.reduce((acc, curr) => acc + (curr.clicks || 0), 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <StatsCard
        title="Total Visitors"
        value={totalVisitors.toLocaleString()}
        icon={<Users className="w-6 h-6" />}
        trend={trendVisitors}
        color="from-blue-500 to-cyan-500"
      />
      <StatsCard
        title="Unique Users"
        value={uniqueUsers.toLocaleString()}
        icon={<MousePointerClick className="w-6 h-6" />}
        trend={trendUnique}
        color="from-purple-500 to-pink-500"
      />
      <StatsCard
        title="Total Clicks"
        value={totalClicks.toLocaleString()}
        icon={<Clock className="w-6 h-6" />}
        trend={trendClicks}
        color="from-green-500 to-emerald-500"
      />
    </div>
  );
};

export default StatsOverview;
