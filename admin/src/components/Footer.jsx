import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { supabase } from '../supabaseclient';
import { Link } from 'react-router-dom';
import translations from "../Translation.json";

const Footer = ({language}) => {
  const [visitorCount, setVisitorCount] = useState(0);
  const [lastUpdated, setLastUpdated] = useState('');
  const [loading, setLoading] = useState(true);
  const t = translations[language];

  useEffect(() => {
    trackVisitor();
    fetchStatistics();

    // Real-time updates
    const subscription = supabase
      .channel('site_statistics')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'site_statistics' },
        (payload) => {
          if (payload.new) {
            setVisitorCount(payload.new.visitor_count || 0);
            setLastUpdated(formatDate(payload.new.last_updated));
          }
        }
      )
      .subscribe();

    return () => subscription.unsubscribe();
  }, []);

  const trackVisitor = async () => {
    try {
      const counted = sessionStorage.getItem('visitor_counted');
      if (!counted) {
        await supabase.rpc('increment_visitor_count');
        sessionStorage.setItem('visitor_counted', 'true');
      }
    } catch (error) {
      console.error('Error tracking visitor:', error);
    }
  };

  const fetchStatistics = async () => {
    try {
      const { data, error } = await supabase
        .from('site_statistics')
        .select('visitor_count, last_updated')
        .eq('id', 1)
        .single();

      if (error) throw error;

      if (data) {
        setVisitorCount(data.visitor_count || 0);
        setLastUpdated(formatDate(data.last_updated));
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatVisitorCount = (count) => {
    return count.toLocaleString('en-IN');
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-4">
        {/* Main Content - Single Row on Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          
          {/* Office Information - Condensed */}
          <div className="text-center md:text-left">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-1">
              Civil Surgeon Office
            </h3>
            <p className="text-gray-400 text-xs">Sindhudurg District, Maharashtra</p>
          </div>

          {/* Contact Information - Inline */}
          <div className="text-center">
            <div className="flex flex-col md:flex-row md:justify-center md:space-x-4 space-y-1 md:space-y-0 text-xs">
              <span className="flex items-center justify-center">
                <FaMapMarkerAlt className="mr-1 text-gray-400" size={12} />
                <span className="text-gray-300">Oros, Sindhudurg</span>
              </span>
              <span className="flex items-center justify-center">
                <FaPhone className="mr-1 text-gray-400" size={12} />
                <span className="text-gray-300">108</span>
              </span>
              <span className="flex items-center justify-center">
                <FaEnvelope className="mr-1 text-gray-400" size={12} />
                <span className="text-gray-300 truncate">civilsurgeon.sindhudurg@maharashtra.gov.in</span>
              </span>
            </div>
          </div>

          {/* Statistics - Compact */}
          <div className="text-center md:text-right">
            <div className="text-xs space-y-1">
              <div>
                <span className="text-gray-400">Visitors:</span>{' '}
                <span className="font-semibold text-white">
                  {loading ? '---' : formatVisitorCount(visitorCount)}
                </span>
              </div>
              <div className="text-gray-400">
                Updated: {loading ? '---' : lastUpdated}
              </div>
            </div>
          </div>
        </div>

        {/* Copyright - Thin Strip */}
        <div className="border-t border-gray-700 mt-3 pt-2 text-center text-gray-400">
          <p className="text-xs">
            © {currentYear} Civil Surgeon Office Sindhudurg | Government of Maharashtra
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;