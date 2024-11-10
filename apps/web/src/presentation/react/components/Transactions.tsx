import { useContext, useEffect, useState } from 'react'
import { TransactionsPresenter } from '../../common/presenter/transactions/TransactionsPresenter'
import { TransactionsPresenterState } from '../../common/presenter/transactions/TransactionsPresenterState'
import { presenters } from '../context'
import { usePresenter } from '../hooks/usePresenter'
import { Transaction } from './Transaction'

export const Transactions = function (props: {
  className?: string
}) {
  const { transactionsPresenter } = useContext(presenters)
  const { transactions } = usePresenter<TransactionsPresenter, TransactionsPresenterState>(transactionsPresenter)
  const [totalTx, setTotalTx] = useState<TransactionsPresenterState['transactions']>([])
  useEffect(() => {
      setTotalTx([...transactions, ...totalTx.slice(0,12)])
  }, [transactions])

  return (
    <div className={`${props.className ?? ''}`}>
      <span className='inline-block md:text-2xl max-md:text-xl font-extrabold mt-1'>Transactions</span>
      <ul className='flex flex-col-reverse mt-4' >
        {
          totalTx.slice(0,12).map((transaction) => (
            <li key={`${transaction.id}`}>
              <Transaction
                type={transaction.type}
                color={transaction.color}
                message={transaction.message}
                id={transaction.id}
                at={transaction.at}
                url={transaction.url}
              />
            </li>
          ))
        }
      </ul>
    </div>
  )
}
