import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import type { Pet } from '@/types';
import Tag from './Tag';

interface PetCardProps {
  pet: Pet;
  className?: string;
}

export default function PetCard({ pet, className = '' }: PetCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/pet/${pet.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className={`flex-shrink-0 w-56 bg-white rounded-card shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer overflow-hidden group ${className}`}
    >
      <div className="relative overflow-hidden">
        <img
          src={pet.avatar}
          alt={pet.name}
          className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3">
          <Tag variant={pet.vaccinated ? 'vaccinated' : 'unvaccinated'}>
            {pet.vaccinated ? '已打疫苗' : '未打疫苗'}
          </Tag>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-800 group-hover:text-forest transition-colors duration-200">
            {pet.name}
          </h3>
          <span className="text-xs px-2 py-1 bg-cream text-forest rounded-full">
            {pet.species === 'dog' ? '🐕 狗狗' : '🐱 猫咪'}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-3">{pet.breed}</p>

        <div className="flex items-center gap-1 text-sm text-gray-500">
          <MapPin className="w-4 h-4 text-forest" />
          <span>距您 {pet.distance} 米</span>
        </div>
      </div>
    </div>
  );
}
