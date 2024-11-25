import { doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { db } from '../firebase'
import { selectUser } from '../stores/userSlice'
import { formatNumber } from '../utils/mining.js'
import { selectCalculate } from '../stores/calculateSlice.js'


const MiningButton = () => {
    const user = useSelector(selectUser)
    const calculate = useSelector(selectCalculate)
    const dispatch = useDispatch()

    const startFarming = async () => {
        try {
            await updateDoc(doc(db, 'users', user.uid), {
             isMining: true,
             miningStartDate: serverTimestamp()
            })
        } catch (error) {
            console.error('Error starting farming:', error);
        }
    }

    return (
        <div className="">
            {
                user && calculate &&
                    <div className='bg-gray-800 p-4 rounded-lg w-full'>
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
                        <div className="flex justify-between items-center">
                            <span>
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
                                <button onClick={startFarming} className=' mt-6 w-full bg-blue-500 text-white'>
                                    Start Mining
                                </button>
                            )
                        }
                    </div>
            }
        </div>
    )
}

export default MiningButton