import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Globe, MapPin } from 'lucide-react';

const GeographicMap = () => {
  const countryData = [
    { country: 'United States', visitors: 18245, percentage: 45.2, flag: '🇺🇸' },
    { country: 'United Kingdom', visitors: 8932, percentage: 22.1, flag: '🇬🇧' },
    { country: 'Canada', visitors: 4521, percentage: 11.2, flag: '🇨🇦' },
    { country: 'Germany', visitors: 3210, percentage: 7.9, flag: '🇩🇪' },
    { country: 'France', visitors: 2156, percentage: 5.3, flag: '🇫🇷' },
    { country: 'Australia', visitors: 1876, percentage: 4.6, flag: '🇦🇺' },
    { country: 'Japan', visitors: 1542, percentage: 3.8, flag: '🇯🇵' }
  ];

  const cityData = [
    { city: 'New York', country: 'US', visitors: 5420 },
    { city: 'London', country: 'UK', visitors: 4321 },
    { city: 'Toronto', country: 'CA', visitors: 2156 },
    { city: 'Berlin', country: 'DE', visitors: 1876 },
    { city: 'Paris', country: 'FR', visitors: 1542 }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Countries */}
      <Card className="bg-black/20 backdrop-blur-lg border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Globe className="w-5 h-5" />
            <span>Top Countries</span>
          </CardTitle>
          <CardDescription className="text-purple-200">
            Visitor distribution by country
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {countryData.map((country, index) => (
              <div key={index} className="flex items-center justify-between group hover:bg-white/5 p-2 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{country.flag}</span>
                  <div>
                    <p className="text-white font-medium">{country.country}</p>
                    <p className="text-purple-200 text-sm">{country.percentage}% of total</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">{country.visitors.toLocaleString()}</p>
                  <div className="w-20 h-2 bg-white/10 rounded-full mt-1">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000"
                      style={{ width: `${country.percentage * 2}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cities */}
      <Card className="bg-black/20 backdrop-blur-lg border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <MapPin className="w-5 h-5" />
            <span>Top Cities</span>
          </CardTitle>
          <CardDescription className="text-purple-200">
            Most active cities worldwide
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cityData.map((city, index) => (
              <div key={index} className="flex items-center justify-between group hover:bg-white/5 p-2 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{city.city}</p>
                    <p className="text-purple-200 text-sm">{city.country}</p>
                  </div>
                </div>
                <p className="text-white font-semibold">{city.visitors.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default GeographicMap;