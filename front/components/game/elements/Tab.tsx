import React from 'react'

const Tab = (props: any) => {
  const {type, mode, text, bfunction} = props;
  return (
    <div className="border border-gray-100 dark:border-gray-700 rounded-3xl bg-white dark:bg-gray-800 px-8 pt-12 shadow-2xl shadow-gray-600/10 dark:shadow-none sm:px-12 lg:px-8 hover:bg-white/80">
        <div className="mb-12 space-y-4">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">Adverser: {type}</h3>
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">Mode: {mode}</h3>
            <p className="mb-6 text-gray-600 dark:text-gray-300">{text}</p>
            <button className="block font-medium text-primary" onClick={bfunction}>Try it</button>
        </div>
    </div>
  )
}

export default Tab