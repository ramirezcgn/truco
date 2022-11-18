import React from 'react';
import { Link } from 'react-router-dom';

export const Start = () => {
  return (
    <div>
      <h2>Welcome to Truco</h2>
      <Link to='game'>Start</Link>
    </div>
  );
}
