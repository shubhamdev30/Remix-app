import React from 'react';
import { NavLink } from 'react-router-dom'
const RecentLinks = ({ links, limit }) => {
  // Sort links by timestamp in descending order
  const sortedLinks = links.sort((a, b) => b.timestamp - a.timestamp);

  // Get a subset of most recent links based on the limit
  const mostRecentLinks = sortedLinks.slice(0, limit);
  const linkStyle = {
    color: "black",
    textDecoration: 'underline',
    cursor: 'pointer', // Add a pointer cursor on hover
  };

  return (
    <div>
      <ul>
        {mostRecentLinks.map((link) => (
          <li key={link.id}>
            <NavLink  style={linkStyle}  to={`/Datable?id=${link.id}`}>{link.label}</NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentLinks;
