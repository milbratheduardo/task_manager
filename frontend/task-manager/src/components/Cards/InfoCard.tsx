import React from 'react';

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}

const InfoCard = ({ icon, label, value, color }: InfoCardProps) => {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-2 md:w-2 h-3 md:h-5 ${color} rounded-full`} />
      
      <div className="flex items-center gap-1 text-xs md:text-[14px] text-gray-500">
        <span className="text-sm md:text-[15px] text-black font-semibold">{value}</span>
        <span className="text-gray-500">{label}</span>
      </div>
    </div>
  );
};

export default InfoCard;
