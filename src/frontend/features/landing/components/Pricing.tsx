import React from 'react';
import { Check } from 'lucide-react';

const plans = [
  {
    name: "Free",
    price: "0",
    description: "For individuals just getting started.",
    features: [
      "1 Project",
      "Up to 10 Members",
      "All Features Included"
    ],
    highlight: false,
    buttonText: "Start for Free",
    period: ""
  },
  {
    name: "Starter",
    price: "29.000",
    currency: "₫",
    description: "For small teams managing multiple goals.",
    features: [
      "+1 Projects",
      "Up to 10 Members",
      "All Features Included"
    ],
    highlight: false,
    buttonText: "Get Starter",
    period: "/+1 project"
  },
  {
    name: "Unlimited",
    price: "69.000",
    currency: "₫",
    description: "No limits. For teams that move fast.",
    features: [
      "Unlimited Projects",
      "Unlimited Members",
      "All Features Included"
    ],
    highlight: true,
    buttonText: "Go Unlimited",
    period: "/month"
  }
];

const Pricing: React.FC = () => {
  return (
    <div id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">Pricing</h2>
          <p className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">Simple, transparent pricing</p>
          <p className="mt-4 text-lg text-slate-500 font-light">
            Choose the plan that fits your team's size. No hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`relative rounded-2xl p-8 transition-all duration-300 flex flex-col ${
                plan.highlight 
                  ? 'bg-slate-900 text-white shadow-xl scale-105 z-10 ring-4 ring-indigo-500/20' 
                  : 'bg-white text-slate-900 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1'
              }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 right-0 -mt-3 -mr-3 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-lg">
                  Best Value
                </div>
              )}

              <div className="mb-6">
                <h3 className={`text-lg font-semibold ${plan.highlight ? 'text-slate-100' : 'text-slate-900'}`}>{plan.name}</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                  <span className={`text-lg font-medium ml-1 ${plan.highlight ? 'text-slate-400' : 'text-slate-500'}`}>{plan.currency}</span>
                  {plan.period && <span className={`text-sm ml-1 ${plan.highlight ? 'text-slate-400' : 'text-slate-500'}`}>{plan.period}</span>}
                </div>
                <p className={`mt-2 text-sm ${plan.highlight ? 'text-slate-400' : 'text-slate-500'}`}>{plan.description}</p>
              </div>

              <div className="flex-grow">
                <ul className="space-y-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                        plan.highlight ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
                      }`}>
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span className={`text-sm ${plan.highlight ? 'text-slate-300' : 'text-slate-600'}`}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <button className={`w-full py-3 px-4 rounded-xl text-sm font-semibold transition-all shadow-sm ${
                  plan.highlight 
                    ? 'bg-indigo-500 hover:bg-indigo-600 text-white hover:shadow-indigo-500/25' 
                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                }`}>
                  {plan.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
