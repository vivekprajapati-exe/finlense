import React, { Suspense } from 'react';
import DashboardPage from './page';
import {BarLoader} from "react-spinners";
const DashboardLayout = () => {
  return (
    <div>
        <Suspense fallback={<BarLoader className='mt-4' width={"100%"} />}>
        <DashboardPage/>
        </Suspense>
      
    </div>
  )
}

export default DashboardLayout
