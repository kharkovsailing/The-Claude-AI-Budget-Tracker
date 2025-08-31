import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const LakehouseBudgetTracker = () => {
  const [selectedView, setSelectedView] = useState('overview');
  const [selectedMonth, setSelectedMonth] = useState('Nov-25');

  // Budget data
  const budgetData = {
    expenses: {
      rent: 10000,
      staff: 18000,
      supplies: 9000,
      utilities: 6000
    },
    revenue: {
      bagels: 15000,
      cakes: 2000,
      coffee: 30000,
      granola: 5000
    }
  };

  // Actual data by month
  const actualData = {
    'Jul-25': {
      expenses: { rent: 12500, staff: 17640, supplies: 10710, utilities: 7680 },
      revenue: { bagels: 19500, cakes: 2160, coffee: 36600, granola: 6200 }
    },
    'Aug-25': {
      expenses: { rent: 10700, staff: 16020, supplies: 8100, utilities: 4920 },
      revenue: { bagels: 15000, cakes: 1420, coffee: 37200, granola: 6050 }
    },
    'Sep-25': {
      expenses: { rent: 11500, staff: 15480, supplies: 11340, utilities: 5940 },
      revenue: { bagels: 12600, cakes: 1620, coffee: 22200, granola: 5450 }
    },
    'Oct-25': {
      expenses: { rent: 11600, staff: 18900, supplies: 7020, utilities: 7620 },
      revenue: { bagels: 15300, cakes: 1580, coffee: 35700, granola: 3900 }
    },
    'Nov-25': {
      expenses: { rent: 12600, staff: 15300, supplies: 11610, utilities: 5280 },
      revenue: { bagels: 13500, cakes: 1440, coffee: 30300, granola: 6100 }
    }
  };

  const months = ['Jul-25', 'Aug-25', 'Sep-25', 'Oct-25', 'Nov-25'];

  // Calculate totals
  const calculateTotals = (data) => {
    const expenseTotal = Object.values(data.expenses).reduce((sum, val) => sum + val, 0);
    const revenueTotal = Object.values(data.revenue).reduce((sum, val) => sum + val, 0);
    return { expenseTotal, revenueTotal, netIncome: revenueTotal - expenseTotal };
  };

  const budgetTotals = calculateTotals(budgetData);

  // Prepare chart data
  const chartData = months.map(month => {
    const actual = actualData[month];
    const actualTotals = calculateTotals(actual);
    return {
      month,
      budgetRevenue: budgetTotals.revenueTotal,
      actualRevenue: actualTotals.revenueTotal,
      budgetExpenses: budgetTotals.expenseTotal,
      actualExpenses: actualTotals.expenseTotal,
      budgetNet: budgetTotals.netIncome,
      actualNet: actualTotals.netIncome
    };
  });

  // Prepare cumulative P&L data
  const cumulativeData = months.map((month, index) => {
    const monthsToInclude = months.slice(0, index + 1);
    let cumulativeBudgetNet = 0;
    let cumulativeActualNet = 0;
    
    monthsToInclude.forEach(m => {
      const actual = actualData[m];
      const actualTotals = calculateTotals(actual);
      cumulativeBudgetNet += budgetTotals.netIncome;
      cumulativeActualNet += actualTotals.netIncome;
    });

    return {
      month,
      cumulativeBudgetNet,
      cumulativeActualNet
    };
  });

  // Product performance data
  const productData = months.map(month => ({
    month,
    bagelsBudget: budgetData.revenue.bagels,
    bagelsActual: actualData[month].revenue.bagels,
    cakesBudget: budgetData.revenue.cakes,
    cakesActual: actualData[month].revenue.cakes,
    coffeeBudget: budgetData.revenue.coffee,
    coffeeActual: actualData[month].revenue.coffee,
    granolaBudget: budgetData.revenue.granola,
    granolaActual: actualData[month].revenue.granola
  }));

  const selectedActual = actualData[selectedMonth];
  const selectedTotals = calculateTotals(selectedActual);

  const formatCurrency = (value) => `$${value.toLocaleString()}`;
  const calculateVariance = (actual, budget) => {
    const variance = actual - budget;
    const percentage = ((variance / budget) * 100).toFixed(1);
    return { variance, percentage };
  };

  return (
    <div className="max-w-7xl mx-auto p-4 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-xl p-8 mb-6 border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">The Lakehouse Restaurant</h1>
            <p className="text-lg text-gray-600">Financial Performance Dashboard</p>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium text-blue-700 bg-blue-100 px-4 py-2 rounded-full">
              FY 2025-26 Budget Tracker
            </div>
            <p className="text-xs text-gray-500 mt-1">Jul-Nov 2025 Performance</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setSelectedView('overview')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              selectedView === 'overview' 
                ? 'bg-blue-600 text-white shadow-lg transform scale-105' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
            }`}
          >
            📊 Overview
          </button>
          <button
            onClick={() => setSelectedView('monthly')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              selectedView === 'monthly' 
                ? 'bg-blue-600 text-white shadow-lg transform scale-105' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
            }`}
          >
            📅 Monthly Detail
          </button>
          <button
            onClick={() => setSelectedView('products')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              selectedView === 'products' 
                ? 'bg-blue-600 text-white shadow-lg transform scale-105' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
            }`}
          >
            🏷️ Product Performance
          </button>
        </div>

        {selectedView === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl border-2 border-green-200 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white text-xl">💰</span>
                  </div>
                  <h3 className="text-xl font-bold text-green-800">Budget Revenue</h3>
                </div>
                <p className="text-3xl font-bold text-green-700 mb-2">{formatCurrency(budgetTotals.revenueTotal)}</p>
                <p className="text-sm text-green-600 font-medium">Monthly Target</p>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-2xl border-2 border-red-200 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white text-xl">💸</span>
                  </div>
                  <h3 className="text-xl font-bold text-red-800">Budget Expenses</h3>
                </div>
                <p className="text-3xl font-bold text-red-700 mb-2">{formatCurrency(budgetTotals.expenseTotal)}</p>
                <p className="text-sm text-red-600 font-medium">Monthly Budget</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl border-2 border-blue-200 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white text-xl">📈</span>
                  </div>
                  <h3 className="text-xl font-bold text-blue-800">Target Net Income</h3>
                </div>
                <p className="text-3xl font-bold text-blue-700 mb-2">{formatCurrency(budgetTotals.netIncome)}</p>
                <p className="text-sm text-blue-600 font-medium">Monthly Profit Goal</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-lg">
              <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                <span className="mr-3">📊</span>Revenue vs Budget Trend
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Line type="monotone" dataKey="budgetRevenue" stroke="#10b981" strokeWidth={3} name="Budget Revenue" strokeDasharray="5 5" />
                  <Line type="monotone" dataKey="actualRevenue" stroke="#3b82f6" strokeWidth={3} name="Actual Revenue" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-lg">
              <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                <span className="mr-3">📈</span>Monthly Performance Comparison
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `${(value/1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="budgetRevenue" fill="#10b981" name="Budget Revenue" opacity={0.7} />
                  <Bar dataKey="actualRevenue" fill="#3b82f6" name="Actual Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-lg">
              <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                <span className="mr-3">💹</span>Cumulative P&L Performance
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={cumulativeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `${(value/1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Line type="monotone" dataKey="cumulativeBudgetNet" stroke="#10b981" strokeWidth={3} name="Cumulative Budget P&L" strokeDasharray="5 5" />
                  <Line type="monotone" dataKey="cumulativeActualNet" stroke="#ef4444" strokeWidth={3} name="Cumulative Actual P&L" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {selectedView === 'monthly' && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <label className="text-lg font-medium">Select Month:</label>
              <select 
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {months.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-xl font-semibold mb-4 text-green-700">Revenue Analysis - {selectedMonth}</h3>
                <div className="space-y-3">
                  {Object.entries(budgetData.revenue).map(([category, budgetValue]) => {
                    const actualValue = selectedActual.revenue[category];
                    const { variance, percentage } = calculateVariance(actualValue, budgetValue);
                    return (
                      <div key={category} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <div>
                          <span className="font-medium capitalize">{category}</span>
                          <div className="text-sm text-gray-600">
                            Budget: {formatCurrency(budgetValue)} | Actual: {formatCurrency(actualValue)}
                          </div>
                        </div>
                        <div className={`font-semibold ${variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {percentage > 0 ? '+' : ''}{percentage}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-xl font-semibold mb-4 text-red-700">Expense Analysis - {selectedMonth}</h3>
                <div className="space-y-3">
                  {Object.entries(budgetData.expenses).map(([category, budgetValue]) => {
                    const actualValue = selectedActual.expenses[category];
                    const { variance, percentage } = calculateVariance(actualValue, budgetValue);
                    return (
                      <div key={category} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <div>
                          <span className="font-medium capitalize">{category}</span>
                          <div className="text-sm text-gray-600">
                            Budget: {formatCurrency(budgetValue)} | Actual: {formatCurrency(actualValue)}
                          </div>
                        </div>
                        <div className={`font-semibold ${variance <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {percentage > 0 ? '+' : ''}{percentage}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-xl font-semibold mb-4 text-blue-800">Net Income Summary - {selectedMonth}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-lg text-gray-600">Budget Net Income</p>
                  <p className="text-2xl font-bold text-blue-600">{formatCurrency(budgetTotals.netIncome)}</p>
                </div>
                <div className="text-center">
                  <p className="text-lg text-gray-600">Actual Net Income</p>
                  <p className="text-2xl font-bold text-blue-800">{formatCurrency(selectedTotals.netIncome)}</p>
                </div>
                <div className="text-center">
                  <p className="text-lg text-gray-600">Variance</p>
                  <p className={`text-2xl font-bold ${selectedTotals.netIncome >= budgetTotals.netIncome ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(selectedTotals.netIncome - budgetTotals.netIncome)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedView === 'products' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Product Performance Over Time</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg border">
                <h4 className="text-lg font-semibold mb-4">Bagels Performance</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={productData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Line type="monotone" dataKey="bagelsBudget" stroke="#10b981" strokeDasharray="5 5" name="Budget" />
                    <Line type="monotone" dataKey="bagelsActual" stroke="#f59e0b" strokeWidth={2} name="Actual" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-lg border">
                <h4 className="text-lg font-semibold mb-4">Coffee Performance</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={productData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Line type="monotone" dataKey="coffeeBudget" stroke="#10b981" strokeDasharray="5 5" name="Budget" />
                    <Line type="monotone" dataKey="coffeeActual" stroke="#8b5cf6" strokeWidth={2} name="Actual" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-lg border">
                <h4 className="text-lg font-semibold mb-4">Cakes Performance</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={productData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Line type="monotone" dataKey="cakesBudget" stroke="#10b981" strokeDasharray="5 5" name="Budget" />
                    <Line type="monotone" dataKey="cakesActual" stroke="#ef4444" strokeWidth={2} name="Actual" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-lg border">
                <h4 className="text-lg font-semibold mb-4">Granola Performance</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={productData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Line type="monotone" dataKey="granolaBudget" stroke="#10b981" strokeDasharray="5 5" name="Budget" />
                    <Line type="monotone" dataKey="granolaActual" stroke="#06b6d4" strokeWidth={2} name="Actual" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LakehouseBudgetTracker;