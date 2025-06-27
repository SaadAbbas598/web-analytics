import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Wrapper Card component
export const Card = ({ className, children }) => {
  return (
    <div className={classNames("rounded-xl border bg-card text-card-foreground shadow", className)}>
      {children}
    </div>
  );
};

// Card Header
export const CardHeader = ({ className, children }) => {
  return (
    <div className={classNames("flex flex-col space-y-1.5 p-6", className)}>
      {children}
    </div>
  );
};

// Card Title
export const CardTitle = ({ className, children }) => {
  return (
    <h3 className={classNames("text-2xl font-semibold leading-none tracking-tight", className)}>
      {children}
    </h3>
  );
};

// Card Description
export const CardDescription = ({ className, children }) => {
  return (
    <p className={classNames("text-sm text-muted-foreground", className)}>
      {children}
    </p>
  );
};

// Card Content
export const CardContent = ({ className, children }) => {
  return (
    <div className={classNames("p-6 pt-0", className)}>
      {children}
    </div>
  );
};
 export default Card;