import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useUserAuth } from '../../hooks/useUserAuth';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { LuHandCoins, LuWalletMinimal } from "react-icons/lu";
import { IoMdCard } from "react-icons/io";
import { addThousandsSeprator } from '../../utils/helper';
import InfoCard from '../../components/Cards/InfoCard';
import RecentTransactions from '../../components/Dashboard/RecentTransactions';
import FinanceOverview from '../../components/Dashboard/FinanceOverview';
import ExpenseTransactions from '../../components/Dashboard/ExpenseTransactions';
import Last30DaysExpenses from '../../components/Dashboard/Last30DaysExpenses';
import RecentIncomeWithChart from '../../components/Dashboard/RecentIncomeWithChart';
import RecentIncome from '../../components/Dashboard/RecentIncome';

const Home = () => {

  useUserAuth();

  const navigate = useNavigate();

  const [dashBoardData, setDashBoardData] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchDashboardData = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await axiosInstance.get(
        `${API_PATHS.DASHBOARD.GET_DATA}`
      );

      if (response.data) {
        setDashBoardData(response.data);
      }

    } catch (error) {
      console.log("Something went wrong please try again later.", error);
    } finally {
      setLoading(false);
    }

  }

  useEffect(() => {
    fetchDashboardData();
    return () => { };
  }, [])


  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className='my-5 mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <InfoCard
            icon={<IoMdCard/>}
            label="Total Balance"
            value={addThousandsSeprator(dashBoardData?.totalBalance || 0)}
            color="bg-primary"
          />

          <InfoCard
            icon={<LuWalletMinimal/>}
            label="Total Income"
            value={addThousandsSeprator(dashBoardData?.totalIncome || 0)}
            color="bg-orange-500"
          />

          <InfoCard
            icon={<LuHandCoins/>}
            label="Total Expense"
            value={addThousandsSeprator(dashBoardData?.totalExpense  || 0)}
            color="bg-red-500"
          />
       </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
          <RecentTransactions
            transactions={dashBoardData?.recentTransactions}
            onSeenMore={()=>navigate("/expense")}
          />
       

       <FinanceOverview
          totalBalance={dashBoardData?.totalBalance || 0}
          totalIncome={dashBoardData?.totalIncome || 0}
          totalExpense={dashBoardData?.totalExpense || 0}
       /> 

          <ExpenseTransactions 
          transactions={dashBoardData?.last30DaysExpenses?.transactions || []}
          onSeeMore={()=>navigate("/expense")}
       />

       <Last30DaysExpenses
          data={dashBoardData?.last30DaysExpenses?.transactions || []}
       />

       <RecentIncomeWithChart
          data={dashBoardData?.last60DaysIncome?.transactions?.slice(0,4) || []}
          totalIncome={dashBoardData?.totalIncome || 0}
        /> 

        <RecentIncome
          transactions={dashBoardData?.last60DaysIncome?.transactions || []}
          onSeeMore={()=>navigate("/income")}
        />

        </div>
        </div>
    </DashboardLayout>
  )
}

export default Home