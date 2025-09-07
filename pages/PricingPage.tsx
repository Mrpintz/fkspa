
import React from 'react';
import PlanCard from '../components/PlanCard';
import { PLAN_DETAILS } from '../constants';
import { useAuth } from '../contexts/AuthContext';
import { Plan } from '../types';

const PricingPage: React.FC = () => {
    const { login } = useAuth();

    const handleSelectPlan = (plan: Plan) => {
        // In a real app, this would go to a checkout flow.
        // Here, we'll just log the user in with that plan.
        login(plan);
        alert(`You've been switched to the ${plan} plan!`);
    }

  return (
    <div className="container mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl">
          Choose Your Plan
        </h1>
        <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-lg sm:max-w-2xl mx-auto md:mt-5 md:text-xl">
          Unlock more music and higher quality audio by upgrading your plan.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {PLAN_DETAILS.map((planDetail) => (
          <PlanCard 
            key={planDetail.plan}
            plan={planDetail.plan}
            price={planDetail.price}
            features={planDetail.features}
            color={planDetail.color}
            onSelectPlan={handleSelectPlan}
          />
        ))}
      </div>
    </div>
  );
};

export default PricingPage;
