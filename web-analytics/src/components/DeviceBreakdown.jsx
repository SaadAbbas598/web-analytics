import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Monitor, Smartphone, Tablet } from 'lucide-react';

const DeviceBreakdown = () => {
  const deviceData = [
    {
      type: 'Desktop',
      percentage: 58.4,
      visitors: 26145,
      icon: <Monitor className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      type: 'Mobile',
      percentage: 35.2,
      visitors: 15746,
      icon: <Smartphone className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-500'
    },
    {
      type: 'Tablet',
      percentage: 6.4,
      visitors: 2864,
      icon: <Tablet className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const browserData = [
    { name: 'Chrome', percentage: 65.2, color: '#4285f4' },
    { name: 'Safari', percentage: 18.7, color: '#34c759' },
    { name: 'Firefox', percentage: 8.9, color: '#ff9500' },
    { name: 'Edge', percentage: 5.1, color: '#0078d4' },
    { name: 'Others', percentage: 2.1, color: '#8e8e93' }
  ];

  const osData = [
    { name: 'Windows', percentage: 45.8, color: '#00bcf2' },
    { name: 'macOS', percentage: 28.4, color: '#007aff' },
    { name: 'Android', percentage: 15.2, color: '#34c759' },
    { name: 'iOS', percentage: 8.9, color: '#ff9500' },
    { name: 'Linux', percentage: 1.7, color: '#8e8e93' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Device Types */}
      <Card className="bg-black/20 backdrop-blur-lg border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Device Types</CardTitle>
          <CardDescription className="text-purple-200">
            Visitor device breakdown
          </CardDescription>
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
                  <div 
                    className={`h-full bg-gradient-to-r ${device.color} rounded-full transition-all duration-1000`}
                    style={{ width: `${device.percentage}%` }}
                  ></div>
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
          <CardDescription className="text-purple-200">
            Popular browsers used
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {browserData.map((browser, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: browser.color }}
                  ></div>
                  <span className="text-white">{browser.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-20 h-2 bg-white/10 rounded-full">
                    <div 
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ 
                        width: `${browser.percentage}%`,
                        backgroundColor: browser.color 
                      }}
                    ></div>
                  </div>
                  <span className="text-purple-200 text-sm w-12 text-right">{browser.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Operating Systems */}
      <Card className="bg-black/20 backdrop-blur-lg border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Operating Systems</CardTitle>
          <CardDescription className="text-purple-200">
            OS distribution
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {osData.map((os, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: os.color }}
                  ></div>
                  <span className="text-white">{os.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-20 h-2 bg-white/10 rounded-full">
                    <div 
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ 
                        width: `${os.percentage}%`,
                        backgroundColor: os.color 
                      }}
                    ></div>
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