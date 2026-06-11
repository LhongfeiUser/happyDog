import React from 'react';
import { Collapse } from 'antd';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQ[];
}

export const FAQSection: React.FC<FAQSectionProps> = ({ faqs }) => {
  const items = faqs.map((faq, index) => ({
    key: String(index),
    label: <span style={{ fontWeight: 500 }}>{faq.question}</span>,
    children: <p style={{ margin: 0 }}>{faq.answer}</p>,
  }));

  return (
    <Collapse
      items={items}
      defaultActiveKey={['0']}
      style={{ borderRadius: 16, overflow: 'hidden' }}
    />
  );
};

export default FAQSection;
