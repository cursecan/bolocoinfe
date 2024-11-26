import { doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { db } from '../firebase'
import { selectUser } from '../stores/userSlice'
import { formatNumber } from '../utils/mining.js'
import { selectCalculate } from '../stores/calculateSlice.js'
import { setMessage } from '../stores/massageSlice.js'


const MiningButton = () => {
    const user = useSelector(selectUser)
    const calculate = useSelector(selectCalculate)
    const dispatch = useDispatch()

    const startFarming = async () => {
        try {
            dispatch(
                setMessage({varian: 'info', text: 'Mining is startting...'})
            )
            await updateDoc(doc(db, 'users', user.uid), {
             isMining: true,
             miningStartDate: serverTimestamp()
            })
        } catch (error) {
            console.error('Error starting farming:', error);
            dispatch(
                setMessage({varian: 'error', text: 'Error, please try again!'})
            )
        }
    }

    return (
        <div className="space-y-2 mt-5">
            <div className="">
                <span className='text-white bg-gray-600 rounded-lg px-4 py-1'>Balance: B {formatNumber(user.balance)}</span>
            </div>
            <div className='bg-gray-700 p-4 rounded-lg relative'>
                {/* Upgrade Button */}
                <div className="absolute right-0 top-0 -translate-y-3">
                    <button className='px-3 py-1 text-xs uppercase rounded bg-gray-100 text-black'>Upgrade</button>
                </div>

                <div className="flex justify-between items-center mb-2">
                    <span className="text-white">
                        {(user.isMining && 'Activated') || 'Deactivated'}
                    </span>
                    <div className="text-white">
                        <span className="text-sm">
                            { formatNumber(user.mineRate)} B/s
                        </span>
                    </div>
                </div>
                {/* Progress */}
                <div className="bg-gray-300/40 rounded-xl h-2"></div>

                {/* Mining value */}
                <div className="flex mt-2 justify-between items-center">
                    <span className='text-lg font-semibold'>
                        B { formatNumber(calculate.mined)}
                    </span>
                    <span>
                        {String(calculate.remainingTime.hours).padStart(2,'0')}h{' '}
                        {String(calculate.remainingTime.minutes).padStart(2,'0')}m{' '}
                        {String(calculate.remainingTime.seconds).padStart(2,'0')}s
                    </span>
                </div>
                {
                    !user.isMining && !calculate.canClaim && (
                        <button onClick={startFarming} className='font-semibold mt-4 w-full bg-blue-600 px-4 py-2 rounded-xl text-white'>
                            Start Mining
                        </button>
                    )
                }
                {
                    (user.isMining && !calculate.canClaim) && (
                        <button disabled className='mt-4 w-full bg-blue-200 px-4 py-2 rounded-xl text-white'>
                            Mining is active...
                        </button>
                    )
                }
            </div>
        </div>
    )
}

export default MiningButton