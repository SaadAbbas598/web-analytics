import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Globe, MapPin } from 'lucide-react';

// Get emoji flag from ISO country code
const getFlag = (countryCode) => {
  if (!countryCode) return '🏳️';
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt()));
};

const GeographicMap = () => {
  const [countryData, setCountryData] = useState([]);
  const [cityData, setCityData] = useState([]);

  useEffect(() => {
    const fetchTrackingData = async () => {
      try {
        const res = await fetch('http://webanalytics.softsincs.com/api/tracking/all/');
        const data = await res.json();

        const countryMap = {};
        const cityMap = {};
        const total = data.length;

        data.forEach((item) => {
          const location = item.locationInfo || {};
          const countryCode = location.country || 'UN';
          const cityName = location.city || 'Unknown';

          // Country aggregation
          if (!countryMap[countryCode]) {
            countryMap[countryCode] = {
              visitors: 1,
            };
          } else {
            countryMap[countryCode].visitors++;
          }

          // City aggregation
          const cityKey = `${cityName},${countryCode}`;
          if (!cityMap[cityKey]) {
            cityMap[cityKey] = {
              city: cityName,
              country: countryCode,
              visitors: 1,
            };
          } else {
            cityMap[cityKey].visitors++;
          }
        });

        const countryArr = Object.entries(countryMap)
          .map(([code, info]) => ({
            country: code,
            visitors: info.visitors,
            percentage: ((info.visitors / total) * 100).toFixed(1),
            flag: getFlag(code),
          }))
          .sort((a, b) => b.visitors - a.visitors)
          .slice(0, 7); // top 7 countries

        const cityArr = Object.values(cityMap)
          .sort((a, b) => b.visitors - a.visitors)
          .slice(0, 5); // top 5 cities

        setCountryData(countryArr);
        setCityData(cityArr);
      } catch (error) {
        console.error('Failed to fetch geographic tracking data', error);
      }
    };

    fetchTrackingData();
  }, []);

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
                      style={{ width: `${country.percentage * 2}%` }} // visual boost
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
