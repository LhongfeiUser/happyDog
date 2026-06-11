import React from 'react';

interface ProcessStep {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface ServiceProcessProps {
  steps: ProcessStep[];
  currentStep?: number;
}

export const ServiceProcess: React.FC<ServiceProcessProps> = ({
  steps,
  currentStep = -1,
}) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
      {steps.map((step, index) => (
        <div key={index} style={{ textAlign: 'center', flex: 1, position: 'relative' }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              backgroundColor: index <= currentStep ? '#FF6B35' : '#f0f0f0',
              color: index <= currentStep ? 'white' : '#999',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              fontWeight: 'bold',
              margin: '0 auto 16px',
            }}
          >
            {step.icon || index + 1}
          </div>
          <h4 style={{ marginBottom: 8, fontSize: 16 }}>{step.title}</h4>
          <p style={{ fontSize: 12, color: '#666' }}>{step.description}</p>
          {index < steps.length - 1 && (
            <div
              style={{
                position: 'absolute',
                top: 30,
                left: '60%',
                width: '80%',
                height: 2,
                backgroundColor: index < currentStep ? '#FF6B35' : '#f0f0f0',
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default ServiceProcess;
