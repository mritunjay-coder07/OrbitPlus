import React from 'react';
import { Users } from 'lucide-react';

const PeopleInSpace = ({ people, total }) => {
  return (
    <div className="glass-card people-card">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Users size={20} className="text-accent-blue" />
          Humans in Space
        </h3>
        <span className="live-badge" style={{ padding: '0.2rem 0.6rem', fontSize: '0.8rem' }}>
          Total: {total}
        </span>
      </div>
      
      <div className="people-list">
        {people.length > 0 ? (
          people.map((person, index) => (
            <div key={index} className="person-item">
              <span className="person-name">{person.name}</span>
              <span className="craft-tag">{person.craft}</span>
            </div>
          ))
        ) : (
          <div className="text-center text-text-secondary py-4">
            Loading astronaut data...
          </div>
        )}
      </div>
    </div>
  );
};

export default PeopleInSpace;
