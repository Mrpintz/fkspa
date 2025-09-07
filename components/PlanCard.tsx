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

    // TailwindCSS needs full class names, so we can't use dynamic template strings like `ring-${color}` reliably.
    // We map the prop to a full class name instead.
    const colorClasses = {
        'gray-700': { ring: 'ring-gray-500', bg: 'bg-gray-700', shadow: 'shadow-gray-900/60' },
        'indigo-600': { ring: 'ring-indigo-500', bg: 'bg-indigo-600', shadow: 'shadow-indigo-900/60' },
        'purple-600': { ring: 'ring-purple-500', bg: 'bg-purple-600', shadow: 'shadow-purple-900/60' },
    };

    const currentPlanStyles = colorClasses[color as keyof typeof colorClasses] || colorClasses['gray-700'];

    const baseClasses = "rounded-xl p-6 flex flex-col bg-gray-800/50 transition-all duration-300";
    const currentPlanClasses = `border-transparent ${currentPlanStyles.ring} ring-2 shadow-xl ${currentPlanStyles.shadow} scale-[1.03]`;
    const inactivePlanClasses = "border border-gray-700 hover:border-gray-500 hover:scale-[1.02]";

  return (
    <div className={`${baseClasses} ${isCurrentPlan ? currentPlanClasses : inactivePlanClasses}`}>
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
        className={`w-full py-3 font-semibold rounded-lg transition-colors ${isCurrentPlan ? 'bg-gray-600 text-gray-400 cursor-default' : `${currentPlanStyles.bg} text-white hover:bg-opacity-80`}`}
      >
        {isCurrentPlan ? 'Current Plan' : `Switch to ${plan}`}
      </button>
    </div>
  );
};

export default PlanCard;
