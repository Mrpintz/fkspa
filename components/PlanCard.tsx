
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Plan } from '../types';
import { CheckIcon } from './icons/Icons';

interface PlanCardProps {
  plan: Plan;
  price: string;
  features: string[];
  color: string;
  onSelectPlan: (plan: Plan) => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, price, features, color, onSelectPlan }) => {
    const { user } = useAuth();
    const isCurrentPlan = user?.plan === plan;

  return (
    <div className={`border rounded-xl p-6 flex flex-col bg-gray-800/50 border-gray-700 ${isCurrentPlan ? `border-${color} ring-2 ring-${color}` : ''}`}>
      <h3 className={`text-2xl font-bold text-white`}>{plan}</h3>
      <p className="text-4xl font-extrabold my-4 text-white">{price}</p>
      <p className="text-gray-400 mb-6 h-12">Perfect for starting with our exclusive AI music library.</p>
      
      <ul className="space-y-3 mb-8 text-gray-300 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <CheckIcon />
            <span className="ml-2">{feature}</span>
          </li>
        ))}
      </ul>
      
      <button 
        onClick={() => onSelectPlan(plan)}
        disabled={isCurrentPlan}
        className={`w-full py-3 font-semibold rounded-lg transition-colors ${isCurrentPlan ? 'bg-gray-600 text-gray-400 cursor-default' : `bg-${color} text-white hover:bg-opacity-80`}`}
      >
        {isCurrentPlan ? 'Current Plan' : `Switch to ${plan}`}
      </button>
    </div>
  );
};

export default PlanCard;
