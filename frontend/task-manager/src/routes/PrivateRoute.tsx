import React from 'react'
import { Outlet } from 'react-router-dom';

type Props = {
  allowedRoles: string[];
};

const PrivateRoute = ({}: Props) => {
  return <Outlet />
};

export default PrivateRoute