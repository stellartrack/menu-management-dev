import React from 'react';
import { useLocation } from 'react-router-dom';

const Breadcrumbs = () => {
  const location = useLocation();
  const paths = location.pathname.split('/').filter(p => p);

  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        <li className="breadcrumb-item"><a href="/">Home</a></li>
        {paths.map((path, i) => {
          const href = '/' + paths.slice(0, i + 1).join('/');
          const isLast = i === paths.length - 1;
          return (
            <li
              key={i}
              className={`breadcrumb-item ${isLast ? 'active' : ''}`}
              {...(isLast ? { 'aria-current': 'page' } : {})}
            >
              {isLast ? path : <a href={href}>{path}</a>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
