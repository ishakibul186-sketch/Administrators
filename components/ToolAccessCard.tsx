
import React, { useState } from 'react';
import { ToolData } from '../types';
import { addOrUpdateTool } from '../services/firebase';

interface ToolAccessCardProps {
  tool: ToolData;
  onRefresh: () => void;
}

const ToolAccessCard: React.FC<ToolAccessCardProps> = ({ tool, onRefresh }) => {
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      // Toggle status and save to DB
      await addOrUpdateTool(tool.id, !tool.status, tool.error);
      // Wait a brief moment for visual feedback then refresh
      setTimeout(() => {
        onRefresh();
        setIsToggling(false);
      }, 500);
    } catch (error) {
      console.error("Failed to toggle status", error);
      setIsToggling(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:border-cyan-200 transition-all duration-300 hover:shadow-lg relative overflow-hidden group">
      {/* Decorator Line */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${tool.status ? 'bg-emerald-500' : 'bg-rose-500'} transition-colors duration-300`}></div>

      <div className="pl-2">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-800 group-hover:text-cyan-700 transition-colors">
              {tool.id}
            </h3>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1">
              Tool Configuration
            </p>
          </div>
          
          {/* Status Badge */}
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
            tool.status 
              ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
              : 'bg-rose-50 text-rose-600 border-rose-200'
          }`}>
            {tool.status ? 'ACTIVE' : 'DISABLED'}
          </span>
        </div>

        {/* Error Message Display */}
        <div className="mb-6">
          <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase">
            Error Message
          </label>
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 text-sm font-mono text-slate-600 break-all">
            {tool.error || <span className="text-slate-300 italic">No error message set</span>}
          </div>
        </div>

        {/* Toggle Control */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <span className="text-sm font-medium text-slate-600">
            Availability Status
          </span>
          
          <button 
            onClick={handleToggle}
            disabled={isToggling}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 ${
              tool.status ? 'bg-emerald-500' : 'bg-slate-300'
            } ${isToggling ? 'opacity-50 cursor-wait' : 'cursor-pointer'}`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 shadow-sm ${
                tool.status ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToolAccessCard;
