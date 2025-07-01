import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Monitor, Smartphone, Tablet } from 'lucide-react';
import * as UAParser from 'ua-parser-js'; // ✅ Correct for Vite

const DeviceBreakdown = () => {
  const [deviceData, setDeviceData] = useState([]);
  const [browserData, setBrowserData] = useState([]);
  const [osData, setOsData] = useState([]);

  useEffect(() => {
    const fetchTrackingData = async () => {
      try {
        const res = await fetch('http://webanalytics.softsincs.com/api/tracking/all/');
        const data = await res.json();

        const deviceMap = {};
        const browserMap = {};
        const osMap = {};
        const totalUsers = data.length;

        data.forEach((item) => {
          // Count device types
          const deviceType = item.deviceType || 'Desktop';
          deviceMap[deviceType] = (deviceMap[deviceType] || 0) + 1;

          // Parse user-agent
          const parser = new UAParser(item.browser);
          const browserName = parser.getBrowser().name || 'Others';
          const osName = parser.getOS().name || 'Others';

          browserMap[browserName] = (browserMap[browserName] || 0) + 1;
          osMap[osName] = (osMap[osName] || 0) + 1;
        });

        const iconMap = {
          Desktop: <Monitor className="w-6 h-6" />,
          Mobile: <Smartphone className="w-6 h-6" />,
          Tablet: <Tablet className="w-6 h-6" />
        };

        const colorMap = {
          Desktop: 'from-blue-500 to-cyan-500',
          Mobile: 'from-green-500 to-emerald-500',
          Tablet: 'from-purple-500 to-pink-500'
        };

        const browserColorMap = {
          Chrome: '#4285f4',
          Safari: '#34c759',
          Firefox: '#ff9500',
          Edge: '#0078d4',
          Others: '#8e8e93'
        };

        const osColorMap = {
          Windows: '#00bcf2',
          macOS: '#007aff',
          Android: '#34c759',
          iOS: '#ff9500',
          Linux: '#8e8e93',
          Others: '#aaaaaa'
        };

        const deviceArr = Object.entries(deviceMap).map(([type, count]) => ({
          type,
          percentage: ((count / totalUsers) * 100).toFixed(1),
          visitors: count,
          icon: iconMap[type] || <Monitor className="w-6 h-6" />,
          color: colorMap[type] || 'from-gray-500 to-gray-700'
        }));

        const browserArr = Object.entries(browserMap).map(([name, count]) => ({
          name,
          percentage: ((count / totalUsers) * 100).toFixed(1),
          color: browserColorMap[name] || browserColorMap['Others']
        }));

        const osArr = Object.entries(osMap).map(([name, count]) => ({
          name,
          percentage: ((count / totalUsers) * 100).toFixed(1),
          color: osColorMap[name] || osColorMap['Others']
        }));

        setDeviceData(deviceArr);
        setBrowserData(browserArr);
        setOsData(osArr);
      } catch (error) {
        console.error('Error fetching tracking data:', error);
      }
    };

    fetchTrackingData();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Devices */}
      <Card className="bg-black/20 backdrop-blur-lg border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Device Types</CardTitle>
          <CardDescription className="text-purple-200">Visitor device breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {deviceData.map((device, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 bg-gradient-to-r ${device.color} rounded-lg flex items-center justify-center text-white`}>
                      {device.icon}
                    </div>
                    <div>
                      <p className="text-white font-medium">{device.type}</p>
                      <p className="text-purple-200 text-sm">{device.visitors.toLocaleString()} visitors</p>
                    </div>
                  </div>
                  <span className="text-white font-semibold">{device.percentage}%</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full">
                  <div className={`h-full bg-gradient-to-r ${device.color} rounded-full transition-all duration-1000`} style={{ width: `${device.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Browsers */}
      <Card className="bg-black/20 backdrop-blur-lg border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Browsers</CardTitle>
          <CardDescription className="text-purple-200">Popular browsers used</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {browserData.map((browser, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: browser.color }}></div>
                  <span className="text-white">{browser.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-20 h-2 bg-white/10 rounded-full">
                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${browser.percentage}%`, backgroundColor: browser.color }}></div>
                  </div>
                  <span className="text-purple-200 text-sm w-12 text-right">{browser.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* OS */}
      <Card className="bg-black/20 backdrop-blur-lg border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Operating Systems</CardTitle>
          <CardDescription className="text-purple-200">OS distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {osData.map((os, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: os.color }}></div>
                  <span className="text-white">{os.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-20 h-2 bg-white/10 rounded-full">
                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${os.percentage}%`, backgroundColor: os.color }}></div>
                  </div>
                  <span className="text-purple-200 text-sm w-12 text-right">{os.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeviceBreakdown;
