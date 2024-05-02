import React from 'react';
import Feature5Component from '../components/Feature5Component'; //all the code for this feature here

const Feature5 = () => {
  return (
    <div style={{ minHeight: '100vh', width: '100%', alignItems: 'center' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 'bold', textAlign: 'center', width: '100%' }}>Team Performance Analyzer</h1>
      <Feature5Component />
    </div>
  );
};

export default Feature5;
