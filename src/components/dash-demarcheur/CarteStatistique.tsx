import React from 'react';
import { UiIcon } from '../UiIcons';

interface CarteStatistiqueProps {
    icon: string;
    label: string;
    value: string | number;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    color?: 'blue' | 'indigo' | 'emerald' | 'amber' | 'rose' | 'slate';
}

export const CarteStatistique: React.FC<CarteStatistiqueProps> = ({
    icon,
    label,
    value,
    trend,
}) => {
    return (
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-colors flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                    <UiIcon name={icon as any} className="w-3.5 h-3.5" />
                </div>
            </div>
            <div className="flex items-baseline justify-between gap-2 mt-1">
                <h4 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">{value}</h4>
                {trend && (
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${trend.isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                        {trend.isPositive ? '↑' : '↓'} {trend.value}%
                    </span>
                )}
            </div>
        </div>
    );
};
