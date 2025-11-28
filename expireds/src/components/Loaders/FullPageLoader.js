'use client'

import { Spinner } from "@heroui/react";
export const FullPageLoader = () => {
  return (
    <div className="center">
      <Spinner color="warning" variant="wave" size='lg'/>
    </div>
  );
};
