import React from 'react';
import { FaShieldAlt, FaGraduationCap, FaUserTie } from 'react-icons/fa';

const RoleBadge = ({ role, university, className = "" }) => {
    if (!role || role === 'student') return null;

    const badgeConfig = {
        admin: {
            label: 'Admin',
            icon: <FaShieldAlt size={10} />,
            bg: 'bg-red-50',
            text: 'text-red-500',
            border: 'border-red-100',
            font: 'font-black'
        },
        mentor: {
            label: 'Verified Mentor',
            icon: <FaGraduationCap size={10} />,
            bg: 'bg-[#001E80]/5',
            text: 'text-[#001E80]',
            border: 'border-[#001E80]/10',
            font: 'font-black'
        },
        studentLead: {
            label: `Student Lead @ ${university || 'University'}`,
            icon: <FaUserTie size={10} />,
            bg: 'bg-[#001E80]',
            text: 'text-white',
            border: 'border-transparent',
            font: 'font-bold'
        }
    };

    const config = badgeConfig[role];
    if (!config) return null;

    return (
        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] uppercase tracking-widest border transition-all shadow-sm ${config.bg} ${config.text} ${config.border} ${config.font} ${className}`}>
            {config.icon}
            <span>{config.label}</span>
        </div>
    );
};

export default RoleBadge;
