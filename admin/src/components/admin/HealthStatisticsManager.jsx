// src/components/admin/HealthStatisticsManager.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseclient";
import { 
  FaSpinner, FaTrash, FaEdit, FaSave, FaTimes, 
  FaPlus, FaFileUpload, FaDatabase, FaChartBar 
} from 'react-icons/fa';
import AlertMessage from '../common/AlertMessage';

const HealthStatisticsManager = ({ setError, setSuccess, error, success }) => {
  const [healthStats, setHealthStats] = useState({
    deathRates: [],
    infantMortalityRates: [],
    totalFertilityRates: [],
    birthRates: [],
    sexRatioComparison: [],
    sexRatioHMIS: []
  });
  const [selectedStatType, setSelectedStatType] = useState('deathRates');
  const [editingStatId, setEditingStatId] = useState(null);
  const [newStatEntry, setNewStatEntry] = useState({});
  const [loading, setLoading] = useState(true);

  const statsConfig = {
    deathRates: {
      tableName: 'death_rates',
      displayName: 'Death Rates',
      icon: '💀',
      color: 'red',
      fields: [
        { name: 'year', type: 'number', label: 'Year', required: true, min: 1900, max: 2100 },
        { name: 'india_srs', type: 'number', label: 'India SRS', step: '0.01', min: 0 },
        { name: 'maharashtra_srs', type: 'number', label: 'Maharashtra SRS', step: '0.01', min: 0 },
        { name: 'sindhudurg_scd_rural', type: 'number', label: 'Sindhudurg SCD Rural', step: '0.01', min: 0 }
      ]
    },
    infantMortalityRates: {
      tableName: 'infant_mortality_rates',
      displayName: 'Infant Mortality Rates',
      icon: '👶',
      color: 'blue',
      fields: [
        { name: 'year', type: 'number', label: 'Year', required: true, min: 1900, max: 2100 },
        { name: 'india_srs', type: 'number', label: 'India SRS', min: 0 },
        { name: 'maharashtra_srs', type: 'number', label: 'Maharashtra SRS', min: 0 },
        { name: 'sindhudurg_scd_rural', type: 'number', label: 'Sindhudurg SCD Rural', step: '0.01', min: 0 }
      ]
    },
    totalFertilityRates: {
      tableName: 'total_fertility_rates',
      displayName: 'Total Fertility Rates',
      icon: '🤰',
      color: 'green',
      fields: [
        { name: 'year', type: 'number', label: 'Year', required: true, min: 1900, max: 2100 },
        { name: 'india_srs', type: 'number', label: 'India SRS', step: '0.01', min: 0 },
        { name: 'maharashtra_srs', type: 'number', label: 'Maharashtra SRS', step: '0.01', min: 0 },
        { name: 'sindhudurg_scd_rural', type: 'number', label: 'Sindhudurg SCD Rural', step: '0.01', min: 0 }
      ]
    },
    birthRates: {
      tableName: 'birth_rates',
      displayName: 'Birth Rates',
      icon: '👶',
      color: 'purple',
      fields: [
        { name: 'year', type: 'number', label: 'Year', required: true, min: 1900, max: 2100 },
        { name: 'india_srs', type: 'number', label: 'India SRS', step: '0.01', min: 0 },
        { name: 'maharashtra_srs', type: 'number', label: 'Maharashtra SRS', min: 0 },
        { name: 'sindhudurg_scd_rural', type: 'number', label: 'Sindhudurg SCD Rural', step: '0.01', min: 0 }
      ]
    },
    sexRatioComparison: {
      tableName: 'sex_ratio_comparison',
      displayName: 'Sex Ratio Comparison',
      icon: '⚖️',
      color: 'orange',
      fields: [
        { name: 'year', type: 'number', label: 'Year', required: true, min: 1900, max: 2100 },
        { name: 'maharashtra_scd_rural', type: 'number', label: 'Maharashtra SCD Rural', min: 0, max: 2000 },
        { name: 'sindhudurg_scd', type: 'number', label: 'Sindhudurg SCD', min: 0, max: 2000 }
      ]
    },
    sexRatioHMIS: {
      tableName: 'sex_ratio_sindhudurg_hmis',
      displayName: 'Sex Ratio Sindhudurg (HMIS)',
      icon: '📊',
      color: 'teal',
      fields: [
        { name: 'year_range', type: 'text', label: 'Year Range', required: true, placeholder: 'e.g., 2017-2018', pattern: '\\d{4}-\\d{4}' },
        { name: 'sex_ratio', type: 'number', label: 'Sex Ratio', min: 0, max: 2000 }
      ]
    }
  };

  useEffect(() => {
    fetchHealthStatistics();
  }, [selectedStatType]);

  const fetchHealthStatistics = async () => {
    try {
      setLoading(true);
      setError("");
      
      const config = statsConfig[selectedStatType];
      const { data, error } = await supabase
        .from(config.tableName)
        .select("*")
        .order(config.fields[0].name === 'year_range' ? 'year_range' : 'year', { ascending: false });
      
      if (error) throw error;
      
      setHealthStats(prev => ({
        ...prev,
        [selectedStatType]: data || []
      }));
    } catch (err) {
      console.error("Error fetching health statistics:", err);
      setError("Failed to load health statistics. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  const validateInput = (field, value) => {
    if (field.required && !value) {
      return `${field.label} is required`;
    }
    
    if (field.type === 'number' && value) {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) {
        return `${field.label} must be a valid number`;
      }
      if (field.min !== undefined && numValue < field.min) {
        return `${field.label} must be at least ${field.min}`;
      }
      if (field.max !== undefined && numValue > field.max) {
        return `${field.label} must be at most ${field.max}`;
      }
    }
    
    if (field.pattern && value) {
      const regex = new RegExp(field.pattern);
      if (!regex.test(value)) {
        return `${field.label} format is invalid (${field.placeholder || field.pattern})`;
      }
    }
    
    return null;
  };

  const addHealthStatEntry = async () => {
    try {
      setError("");
      setSuccess("");
      
      const config = statsConfig[selectedStatType];
      
      for (const field of config.fields) {
        const error = validateInput(field, newStatEntry[field.name]);
        if (error) {
          setError(error);
          return;
        }
      }

      const { data, error } = await supabase
        .from(config.tableName)
        .insert([newStatEntry])
        .select()
        .single();

      if (error) throw error;

      setHealthStats(prev => ({
        ...prev,
        [selectedStatType]: [data, ...prev[selectedStatType]]
      }));
      
      setNewStatEntry({});
      setSuccess(`${config.displayName} entry added successfully!`);
      setTimeout(() => setSuccess(""), 3000);

    } catch (err) {
      console.error('Error adding health statistic:', err);
      if (err.code === '23505') {
        setError("An entry for this year/year range already exists");
      } else {
        setError(err.message || "Failed to add entry. Please try again.");
      }
    }
  };

  const updateHealthStatEntry = async (id, updatedData) => {
    try {
      setError("");
      setSuccess("");
      
      const config = statsConfig[selectedStatType];
      const primaryKey = config.tableName === 'sex_ratio_sindhudurg_hmis' ? 'id' : 'year';
      
      for (const field of config.fields) {
        if (field.name !== primaryKey) {
          const error = validateInput(field, updatedData[field.name]);
          if (error) {
            setError(error);
            return;
          }
        }
      }

      const { data, error } = await supabase
        .from(config.tableName)
        .update(updatedData)
        .eq(primaryKey, id)
        .select()
        .single();

      if (error) throw error;

      setHealthStats(prev => ({
        ...prev,
        [selectedStatType]: prev[selectedStatType].map(item => 
          (config.tableName === 'sex_ratio_sindhudurg_hmis' ? item.id : item.year) === id ? data : item
        )
      }));
      
      setEditingStatId(null);
      setSuccess(`${config.displayName} entry updated successfully!`);
      setTimeout(() => setSuccess(""), 3000);

    } catch (err) {
      console.error('Error updating health statistic:', err);
      setError(err.message || "Failed to update entry. Please try again.");
    }
  };

  const deleteHealthStatEntry = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;

    try {
      setError("");
      setSuccess("");
      
      const config = statsConfig[selectedStatType];
      const primaryKey = config.tableName === 'sex_ratio_sindhudurg_hmis' ? 'id' : 'year';
      
      const { error } = await supabase
        .from(config.tableName)
        .delete()
        .eq(primaryKey, id);

      if (error) throw error;

      setHealthStats(prev => ({
        ...prev,
        [selectedStatType]: prev[selectedStatType].filter(item => 
          (config.tableName === 'sex_ratio_sindhudurg_hmis' ? item.id : item.year) !== id
        )
      }));
      
      setSuccess(`${config.displayName} entry deleted successfully!`);
      setTimeout(() => setSuccess(""), 3000);

    } catch (err) {
      console.error('Error deleting health statistic:', err);
      setError(err.message || "Failed to delete entry. Please try again.");
    }
  };

  const exportToCSV = () => {
    const config = statsConfig[selectedStatType];
    const data = healthStats[selectedStatType];
    
    if (data.length === 0) {
      setError("No data to export");
      return;
    }

    const headers = config.fields.map(f => f.label).join(',');
    const rows = data.map(item => 
      config.fields.map(f => item[f.name] || '').join(',')
    ).join('\n');
    
    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.tableName}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    setSuccess("Data exported successfully!");
    setTimeout(() => setSuccess(""), 3000);
  };

  const getColorClasses = (color) => {
    const colors = {
      red: 'border-red-500 text-red-600 bg-red-50',
      blue: 'border-blue-500 text-blue-600 bg-blue-50',
      green: 'border-green-500 text-green-600 bg-green-50',
      purple: 'border-purple-500 text-purple-600 bg-purple-50',
      orange: 'border-orange-500 text-orange-600 bg-orange-50',
      teal: 'border-teal-500 text-teal-600 bg-teal-50'
    };
    return colors[color] || 'border-gray-500 text-gray-600 bg-gray-50';
  };

  return (
    <>
      <AlertMessage error={error} success={success} setError={setError} setSuccess={setSuccess} />
      
      {/* Statistics Type Selection */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaChartBar className="text-pink-600" />
          Select Statistics Type
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(statsConfig).map(([key, config]) => (
            <button
              key={key}
              onClick={() => {
                setSelectedStatType(key);
                setNewStatEntry({});
                setEditingStatId(null);
              }}
              className={`px-4 py-3 rounded-lg border-2 font-medium transition-all flex items-center gap-2 ${
                selectedStatType === key
                  ? getColorClasses(config.color)
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <span className="text-xl">{config.icon}</span>
              <span className="text-sm">{config.displayName}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Add New Entry Form */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FaPlus className="text-green-600" />
            Add New {statsConfig[selectedStatType].displayName} Entry
          </h2>
          <button
            onClick={exportToCSV}
            disabled={healthStats[selectedStatType].length === 0}
            className="bg-gray-600 text-white px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-700 transition-colors flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <FaFileUpload />
            Export CSV
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {statsConfig[selectedStatType].fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              <input
                type={field.type}
                step={field.step}
                min={field.min}
                max={field.max}
                pattern={field.pattern}
                placeholder={field.placeholder}
                value={newStatEntry[field.name] || ''}
                onChange={(e) => setNewStatEntry(prev => ({
                  ...prev,
                  [field.name]: field.type === 'number' ? 
                    (e.target.value ? parseFloat(e.target.value) : '') : 
                    e.target.value
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
              />
              {field.placeholder && (
                <p className="text-xs text-gray-500 mt-1">{field.placeholder}</p>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={addHealthStatEntry}
          disabled={loading}
          className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-md font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <FaPlus />
              Add Entry
            </>
          )}
        </button>
      </div>

      {/* Current Entries List */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaDatabase className="text-blue-600" />
          Current {statsConfig[selectedStatType].displayName} Entries
          {healthStats[selectedStatType].length > 0 && (
            <span className="text-sm font-normal text-gray-500">
              ({healthStats[selectedStatType].length} entries)
            </span>
          )}
        </h2>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <FaSpinner className="animate-spin h-8 w-8 text-pink-600" />
          </div>
        ) : healthStats[selectedStatType].length === 0 ? (
          <div className="text-center py-12">
            <FaDatabase className="text-gray-300 text-5xl mx-auto mb-4" />
            <p className="text-gray-500">No entries added yet.</p>
            <p className="text-gray-400 text-sm mt-2">Add your first entry using the form above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {statsConfig[selectedStatType].fields.map((field) => (
                    <th
                      key={field.name}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {field.label}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {healthStats[selectedStatType].map((entry) => {
                  const primaryKey = selectedStatType === 'sexRatioHMIS' ? entry.id : entry.year;
                  const isEditing = editingStatId === primaryKey;
                  
                  return (
                    <tr key={primaryKey} className={isEditing ? 'bg-yellow-50' : 'hover:bg-gray-50'}>
                      {statsConfig[selectedStatType].fields.map((field) => (
                        <td key={field.name} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {isEditing ? (
                            <input
                              type={field.type}
                              step={field.step}
                              min={field.min}
                              max={field.max}
                              pattern={field.pattern}
                              value={entry[field.name] || ''}
                              onChange={(e) => {
                                const newValue = field.type === 'number' ? 
                                  (e.target.value ? parseFloat(e.target.value) : null) : 
                                  e.target.value;
                                
                                setHealthStats(prev => ({
                                  ...prev,
                                  [selectedStatType]: prev[selectedStatType].map(item =>
                                    (selectedStatType === 'sexRatioHMIS' ? item.id : item.year) === primaryKey
                                      ? { ...item, [field.name]: newValue }
                                      : item
                                  )
                                }));
                              }}
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-pink-500 focus:border-pink-500"
                              disabled={field.name === 'year' || field.name === 'year_range'}
                            />
                          ) : (
                            <span className={field.type === 'number' ? 'font-mono' : ''}>
                              {entry[field.name] || '-'}
                            </span>
                          )}
                        </td>
                      ))}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                        {isEditing ? (
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => updateHealthStatEntry(primaryKey, entry)}
                              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors flex items-center gap-1"
                            >
                              <FaSave size={12} />
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setEditingStatId(null);
                                fetchHealthStatistics();
                              }}
                              className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 transition-colors flex items-center gap-1"
                            >
                              <FaTimes size={12} />
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => setEditingStatId(primaryKey)}
                              className="text-indigo-600 hover:text-indigo-900 p-1 hover:bg-indigo-50 rounded transition-colors"
                              title="Edit"
                            >
                              <FaEdit size={14} />
                            </button>
                            <button
                              onClick={() => deleteHealthStatEntry(primaryKey)}
                              className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors"
                              title="Delete"
                            >
                              <FaTrash size={14} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Statistics Summary */}
      {healthStats[selectedStatType].length > 0 && (
        <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-600 font-medium">Total Entries</p>
              <p className="text-2xl font-bold text-blue-900">{healthStats[selectedStatType].length}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-green-600 font-medium">Latest Year</p>
              <p className="text-2xl font-bold text-green-900">
                {healthStats[selectedStatType][0]?.year || healthStats[selectedStatType][0]?.year_range || '-'}
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-sm text-purple-600 font-medium">Oldest Year</p>
              <p className="text-2xl font-bold text-purple-900">
                {healthStats[selectedStatType][healthStats[selectedStatType].length - 1]?.year || 
                 healthStats[selectedStatType][healthStats[selectedStatType].length - 1]?.year_range || '-'}
              </p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <p className="text-sm text-orange-600 font-medium">Data Type</p>
              <p className="text-xl font-bold text-orange-900">{statsConfig[selectedStatType].icon}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HealthStatisticsManager;