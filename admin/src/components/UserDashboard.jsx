// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseclient';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { 
  TbChartLine,
  TbChartBar,
  TbChartPie,
  TbChartArea,
  TbDatabase,
  TbDownload,
  TbRefresh,
  TbCalendarStats,
  TbUsers,
  TbBabyCarriage,
  TbHeartRateMonitor,
  TbActivityHeartbeat,
  TbChartDots3,
  TbFileExport,
  TbReportAnalytics,
  TbTrendingDown,
  TbTrendingUp,
  TbLoader2,
  TbAlertCircle,
  TbChartRadar
} from 'react-icons/tb';
import { 
  HiOutlineChartSquareBar,
  HiOutlinePresentationChartLine,
  HiOutlineDocumentReport
} from 'react-icons/hi';
import {
  BiPulse,
  BiStats,
  BiLineChart
} from 'react-icons/bi';
import {
  RiPulseLine,
  RiHeartPulseLine
} from 'react-icons/ri';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState({
    deathRates: [],
    infantMortalityRates: [],
    totalFertilityRates: [],
    birthRates: [],
    sexRatioComparison: [],
    sexRatioHMIS: []
  });
  const [selectedYear, setSelectedYear] = useState('all');
  const [chartType, setChartType] = useState('line');

  const COLORS = ['#6366f1', '#22d3ee', '#f59e0b', '#ef4444', '#84cc16', '#a855f7'];

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch all data in parallel
      const [
        deathRatesRes,
        infantMortalityRes,
        fertilityRes,
        birthRatesRes,
        sexRatioCompRes,
        sexRatioHMISRes
      ] = await Promise.all([
        supabase.from('death_rates').select('*').order('year', { ascending: true }),
        supabase.from('infant_mortality_rates').select('*').order('year', { ascending: true }),
        supabase.from('total_fertility_rates').select('*').order('year', { ascending: true }),
        supabase.from('birth_rates').select('*').order('year', { ascending: true }),
        supabase.from('sex_ratio_comparison').select('*').order('year', { ascending: true }),
        supabase.from('sex_ratio_sindhudurg_hmis').select('*').order('year_range', { ascending: true })
      ]);

      // Check for errors
      const responses = [
        deathRatesRes,
        infantMortalityRes,
        fertilityRes,
        birthRatesRes,
        sexRatioCompRes,
        sexRatioHMISRes
      ];

      for (const res of responses) {
        if (res.error) throw res.error;
      }

      setData({
        deathRates: deathRatesRes.data || [],
        infantMortalityRates: infantMortalityRes.data || [],
        totalFertilityRates: fertilityRes.data || [],
        birthRates: birthRatesRes.data || [],
        sexRatioComparison: sexRatioCompRes.data || [],
        sexRatioHMIS: sexRatioHMISRes.data || []
      });

    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Get all unique years from all datasets
  const getAllYears = () => {
    const years = new Set();
    data.deathRates.forEach(item => years.add(item.year));
    data.infantMortalityRates.forEach(item => years.add(item.year));
    data.totalFertilityRates.forEach(item => years.add(item.year));
    data.birthRates.forEach(item => years.add(item.year));
    data.sexRatioComparison.forEach(item => years.add(item.year));
    return Array.from(years).sort((a, b) => b - a);
  };

  // Filter data by selected year
  const filterDataByYear = (dataset) => {
    if (selectedYear === 'all') return dataset;
    return dataset.filter(item => item.year === parseInt(selectedYear));
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-xl">
          <p className="font-semibold text-gray-800">{`Year: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Prepare data for combined sex ratio chart
  const prepareSexRatioData = () => {
    const combined = [];
    
    // Add comparison data
    data.sexRatioComparison.forEach(item => {
      if (selectedYear === 'all' || item.year === parseInt(selectedYear)) {
        combined.push({
          year: item.year.toString(),
          'Maharashtra Rural': item.maharashtra_scd_rural,
          'Sindhudurg': item.sindhudurg_scd
        });
      }
    });

    // Add HMIS data
    data.sexRatioHMIS.forEach(item => {
      combined.push({
        year: item.year_range,
        'Sindhudurg HMIS': item.sex_ratio
      });
    });

    return combined.sort((a, b) => {
      const yearA = parseInt(a.year.split('-')[0]);
      const yearB = parseInt(b.year.split('-')[0]);
      return yearA - yearB;
    });
  };

  // Prepare data for radar chart
  const prepareRadarData = () => {
    const latestYear = Math.max(...getAllYears());
    const categories = ['Death Rate', 'IMR', 'TFR', 'Birth Rate'];
    
    const latestData = {
      deathRate: data.deathRates.find(d => d.year === latestYear),
      imr: data.infantMortalityRates.find(d => d.year === latestYear),
      tfr: data.totalFertilityRates.find(d => d.year === latestYear),
      birthRate: data.birthRates.find(d => d.year === latestYear)
    };

    if (!latestData.deathRate || !latestData.imr || !latestData.tfr || !latestData.birthRate) {
      return [];
    }

    return [
      {
        category: 'Death Rate',
        India: latestData.deathRate?.india_srs || 0,
        Maharashtra: latestData.deathRate?.maharashtra_srs || 0,
        Sindhudurg: latestData.deathRate?.sindhudurg_scd_rural || 0
      },
      {
        category: 'IMR',
        India: (latestData.imr?.india_srs || 0) / 10, // Scale down for better visualization
        Maharashtra: (latestData.imr?.maharashtra_srs || 0) / 10,
        Sindhudurg: (latestData.imr?.sindhudurg_scd_rural || 0) / 10
      },
      {
        category: 'TFR',
        India: (latestData.tfr?.india_srs || 0) * 5, // Scale up for better visualization
        Maharashtra: (latestData.tfr?.maharashtra_srs || 0) * 5,
        Sindhudurg: (latestData.tfr?.sindhudurg_scd_rural || 0) * 5
      },
      {
        category: 'Birth Rate',
        India: latestData.birthRate?.india_srs || 0,
        Maharashtra: latestData.birthRate?.maharashtra_srs || 0,
        Sindhudurg: latestData.birthRate?.sindhudurg_scd_rural || 0
      }
    ];
  };

  // Export dashboard data as CSV
  const exportToCSV = () => {
    const csvData = [];
    
    // Combine all data
    const years = getAllYears();
    years.forEach(year => {
      const row = { year };
      
      const deathRate = data.deathRates.find(d => d.year === year);
      if (deathRate) {
        row['death_rate_india'] = deathRate.india_srs;
        row['death_rate_maharashtra'] = deathRate.maharashtra_srs;
        row['death_rate_sindhudurg'] = deathRate.sindhudurg_scd_rural;
      }
      
      const imr = data.infantMortalityRates.find(d => d.year === year);
      if (imr) {
        row['imr_india'] = imr.india_srs;
        row['imr_maharashtra'] = imr.maharashtra_srs;
        row['imr_sindhudurg'] = imr.sindhudurg_scd_rural;
      }
      
      const tfr = data.totalFertilityRates.find(d => d.year === year);
      if (tfr) {
        row['tfr_india'] = tfr.india_srs;
        row['tfr_maharashtra'] = tfr.maharashtra_srs;
        row['tfr_sindhudurg'] = tfr.sindhudurg_scd_rural;
      }
      
      const birthRate = data.birthRates.find(d => d.year === year);
      if (birthRate) {
        row['birth_rate_india'] = birthRate.india_srs;
        row['birth_rate_maharashtra'] = birthRate.maharashtra_srs;
        row['birth_rate_sindhudurg'] = birthRate.sindhudurg_scd_rural;
      }
      
      csvData.push(row);
    });
    
    // Convert to CSV string
    const headers = Object.keys(csvData[0] || {}).join(',');
    const rows = csvData.map(row => Object.values(row).join(',')).join('\n');
    const csv = `${headers}\n${rows}`;
    
    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `health_statistics_dashboard_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <TbLoader2 className="animate-spin h-14 w-14 text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-700 text-lg font-medium">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-5 rounded-xl shadow-lg">
            <TbAlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
            <p className="font-semibold text-lg">Error Loading Dashboard</p>
            <p className="text-sm mt-2">{error}</p>
            <button
              onClick={fetchAllData}
              className="mt-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2.5 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 inline-flex items-center gap-2 font-medium shadow-lg"
            >
              <TbRefresh className="h-5 w-5" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-xl p-6 mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <TbReportAnalytics className="text-indigo-600 h-10 w-10" />
                Health Statistics Dashboard
              </h1>
              <p className="text-gray-600 mt-2">Comprehensive health data analysis for India, Maharashtra, and Sindhudurg</p>
            </div>
            <div className="flex gap-3">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium text-gray-700 bg-white hover:border-gray-300 transition-colors"
              >
                <option value="all">All Years</option>
                {getAllYears().map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <button
                onClick={fetchAllData}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-2.5 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center gap-2 font-medium shadow-lg"
              >
                <TbRefresh size={18} />
                Refresh
              </button>
              <button
                onClick={exportToCSV}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-5 py-2.5 rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 flex items-center gap-2 font-medium shadow-lg"
              >
                <TbFileExport size={18} />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-semibold uppercase tracking-wide">Death Rate Records</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{data.deathRates.length}</p>
                <p className="text-xs text-gray-500 mt-1">Total Entries</p>
              </div>
              <RiHeartPulseLine className="text-blue-500 text-4xl opacity-80" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-cyan-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-semibold uppercase tracking-wide">IMR Records</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{data.infantMortalityRates.length}</p>
                <p className="text-xs text-gray-500 mt-1">Total Entries</p>
              </div>
              <TbBabyCarriage className="text-cyan-500 text-4xl opacity-80" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-violet-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-semibold uppercase tracking-wide">TFR Records</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{data.totalFertilityRates.length}</p>
                <p className="text-xs text-gray-500 mt-1">Total Entries</p>
              </div>
              <TbUsers className="text-violet-500 text-4xl opacity-80" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-amber-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-semibold uppercase tracking-wide">Birth Rate Records</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{data.birthRates.length}</p>
                <p className="text-xs text-gray-500 mt-1">Total Entries</p>
              </div>
              <TbCalendarStats className="text-amber-500 text-4xl opacity-80" />
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Death Rates Chart */}
          <div className="bg-white rounded-xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <TbActivityHeartbeat className="text-rose-500 h-6 w-6" />
                Death Rates Comparison
              </h2>
              <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full font-medium">
                per 1,000 population
              </span>
            </div>
            {filterDataByYear(data.deathRates).length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={filterDataByYear(data.deathRates)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="year" 
                    tick={{ fontSize: 12 }}
                    stroke="#666"
                  />
                  <YAxis 
                    label={{ value: 'Rate', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
                    tick={{ fontSize: 12 }}
                    stroke="#666"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line
                    type="monotone"
                    dataKey="india_srs"
                    stroke="#6366f1"
                    name="India SRS"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="maharashtra_srs"
                    stroke="#22d3ee"
                    name="Maharashtra SRS"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="sindhudurg_scd_rural"
                    stroke="#f59e0b"
                    name="Sindhudurg Rural"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                <div className="text-center">
                  <TbDatabase className="text-5xl text-gray-300 mb-3" />
                  <p className="font-medium">No data available</p>
                </div>
              </div>
            )}
          </div>

          {/* Infant Mortality Rates Chart */}
          <div className="bg-white rounded-xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <TbBabyCarriage className="text-cyan-500 h-6 w-6" />
                Infant Mortality Rates
              </h2>
              <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full font-medium">
                per 1,000 live births
              </span>
            </div>
            {filterDataByYear(data.infantMortalityRates).length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={filterDataByYear(data.infantMortalityRates)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="year"
                    tick={{ fontSize: 12 }}
                    stroke="#666"
                  />
                  <YAxis 
                    label={{ value: 'Rate per 1000', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
                    tick={{ fontSize: 12 }}
                    stroke="#666"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="india_srs" fill="#6366f1" name="India SRS" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="maharashtra_srs" fill="#22d3ee" name="Maharashtra SRS" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="sindhudurg_scd_rural" fill="#f59e0b" name="Sindhudurg Rural" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                <div className="text-center">
                  <TbDatabase className="text-5xl text-gray-300 mb-3" />
                  <p className="font-medium">No data available</p>
                </div>
              </div>
            )}
          </div>

          {/* Total Fertility Rates Chart */}
          <div className="bg-white rounded-xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <TbUsers className="text-violet-500 h-6 w-6" />
                Total Fertility Rates
              </h2>
              <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full font-medium">
                children per woman
              </span>
            </div>
            {filterDataByYear(data.totalFertilityRates).length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={filterDataByYear(data.totalFertilityRates)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="year"
                    tick={{ fontSize: 12 }}
                    stroke="#666"
                  />
                  <YAxis 
                    label={{ value: 'Rate', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
                    tick={{ fontSize: 12 }}
                    stroke="#666"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Area
                    type="monotone"
                    dataKey="india_srs"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.6}
                    name="India SRS"
                  />
                  <Area
                    type="monotone"
                    dataKey="maharashtra_srs"
                    stroke="#22d3ee"
                    fill="#22d3ee"
                    fillOpacity={0.6}
                    name="Maharashtra SRS"
                  />
                  <Area
                    type="monotone"
                    dataKey="sindhudurg_scd_rural"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    fillOpacity={0.6}
                    name="Sindhudurg Rural"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                <div className="text-center">
                  <TbDatabase className="text-5xl text-gray-300 mb-3" />
                  <p className="font-medium">No data available</p>
                </div>
              </div>
            )}
          </div>

          {/* Birth Rates Chart */}
          <div className="bg-white rounded-xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <TbCalendarStats className="text-amber-500 h-6 w-6" />
                Birth Rates Comparison
              </h2>
              <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full font-medium">
                per 1,000 population
              </span>
            </div>
            {filterDataByYear(data.birthRates).length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={filterDataByYear(data.birthRates)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="year"
                    tick={{ fontSize: 12 }}
                    stroke="#666"
                  />
                  <YAxis 
                    label={{ value: 'Rate', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
                    tick={{ fontSize: 12 }}
                    stroke="#666"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line
                    type="monotone"
                    dataKey="india_srs"
                    stroke="#6366f1"
                    name="India SRS"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="maharashtra_srs"
                    stroke="#22d3ee"
                    name="Maharashtra SRS"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="sindhudurg_scd_rural"
                    stroke="#f59e0b"
                    name="Sindhudurg Rural"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                <div className="text-center">
                  <TbDatabase className="text-5xl text-gray-300 mb-3" />
                  <p className="font-medium">No data available</p>
                </div>
              </div>
            )}
          </div>

          {/* Sex Ratio Combined Chart */}
          <div className="bg-white rounded-xl shadow-xl p-6 lg:col-span-2 hover:shadow-2xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <HiOutlineChartSquareBar className="text-emerald-500 h-6 w-6" />
                Sex Ratio Analysis
              </h2>
              <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full font-medium">
                females per 1,000 males
              </span>
            </div>
            {prepareSexRatioData().length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={prepareSexRatioData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="year"
                    tick={{ fontSize: 12 }}
                    stroke="#666"
                  />
                  <YAxis 
                    label={{ value: 'Sex Ratio', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
                    tick={{ fontSize: 12 }}
                    stroke="#666"
                    domain={[900, 1050]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="Maharashtra Rural" fill="#6366f1" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="Sindhudurg" fill="#22d3ee" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="Sindhudurg HMIS" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[350px] text-gray-500">
                <div className="text-center">
                  <TbDatabase className="text-5xl text-gray-300 mb-3" />
                  <p className="font-medium">No data available</p>
                </div>
              </div>
            )}
          </div>

          {/* Comparative Radar Chart */}
          {prepareRadarData().length > 0 && (
            <div className="bg-white rounded-xl shadow-xl p-6 lg:col-span-2 hover:shadow-2xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <TbChartRadar className="text-indigo-500 h-6 w-6" />
                  Comparative Analysis (Latest Year)
                </h2>
                <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full font-medium">
                  Normalized values
                </span>
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <RadarChart data={prepareRadarData()}>
                  <PolarGrid stroke="#e0e0e0" />
                  <PolarAngleAxis dataKey="category" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis tick={{ fontSize: 10 }} />
                  <Radar
                    name="India"
                    dataKey="India"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.3}
                  />
                  <Radar
                    name="Maharashtra"
                    dataKey="Maharashtra"
                    stroke="#22d3ee"
                    fill="#22d3ee"
                    fillOpacity={0.3}
                  />
                  <Radar
                    name="Sindhudurg"
                    dataKey="Sindhudurg"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    fillOpacity={0.3}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Trends Summary */}
        <div className="mt-6 bg-white rounded-xl shadow-xl p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <BiStats className="text-indigo-600 h-6 w-6" />
            Key Insights & Trends
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.deathRates.length >= 2 && (
              <div className="bg-gradient-to-r from-rose-50 to-rose-100 rounded-xl p-4 border border-rose-200">
                <p className="text-sm font-bold text-rose-800 flex items-center gap-2">
                  <RiPulseLine className="h-5 w-5" />
                  Death Rate Trend
                </p>
                <p className="text-xs text-rose-700 mt-2 flex items-center gap-1">
                  {data.deathRates[0].india_srs > data.deathRates[data.deathRates.length - 1].india_srs
                    ? <><TbTrendingUp className="h-4 w-4" /> Increasing</> 
                    : <><TbTrendingDown className="h-4 w-4" /> Decreasing</>} over time
                </p>
              </div>
            )}
            
            {data.infantMortalityRates.length >= 2 && (
              <div className="bg-gradient-to-r from-cyan-50 to-cyan-100 rounded-xl p-4 border border-cyan-200">
                <p className="text-sm font-bold text-cyan-800 flex items-center gap-2">
                  <TbBabyCarriage className="h-5 w-5" />
                  IMR Progress
                </p>
                <p className="text-xs text-cyan-700 mt-2">
                  {data.infantMortalityRates[0].india_srs < data.infantMortalityRates[data.infantMortalityRates.length - 1].india_srs
                    ? '✅ Improving steadily' : '⚠️ Needs focused attention'}
                </p>
              </div>
            )}
            
            {data.totalFertilityRates.length >= 2 && (
              <div className="bg-gradient-to-r from-violet-50 to-violet-100 rounded-xl p-4 border border-violet-200">
                <p className="text-sm font-bold text-violet-800 flex items-center gap-2">
                  <TbUsers className="h-5 w-5" />
                  Fertility Rate Status
                </p>
                <p className="text-xs text-violet-700 mt-2">
                  Current TFR: {data.totalFertilityRates[0]?.india_srs || 'N/A'}
                  {data.totalFertilityRates[0]?.india_srs <= 2.1 ? ' (Below replacement level)' : ''}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600 bg-white/50 rounded-lg p-4">
          <p className="font-medium">Data Source: Sample Registration System (SRS) & Survey of Causes of Death (SCD)</p>
          <p className="mt-1 text-gray-500">Last updated: {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;