import React from 'react';

export default function Loading() {
  return (
    <div className="loading-container">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}
