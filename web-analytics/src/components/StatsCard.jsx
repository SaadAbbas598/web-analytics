import React from 'react';
import { Card, CardContent } from '../components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({ title, value, icon, trend, color }) => {
  const isPositive = trend > 0;

  return (
    <Card className="bg-black/20 backdrop-blur-lg border-white/10 hover:bg-black/30 transition-all duration-300 group">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
            isPositive ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
          }`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{Math.abs(trend)}%</span>
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
          <p className="text-purple-200 text-sm">{title}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
