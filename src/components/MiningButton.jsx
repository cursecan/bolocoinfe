import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { db } from '../firebase'
import { selectUser } from '../stores/userSlice'
import { calculateMineValue, formatNumber } from '../utils/mining.js'
import { selectCalculate } from '../stores/calculateSlice.js'
import { setMessage } from '../stores/massageSlice.js'
import { setCoinshow } from '../stores/coinshowSlice.js'


const MiningButton = () => {
    const user = useSelector(selectUser)
    const calculate = useSelector(selectCalculate)
    const dispatch = useDispatch()

    const [claimDiasble, setClaimDisable] = useState(false)

    const MAX_MINE_RATE = 100

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

    const claimRewards = async () => {
        try {
            dispatch(
                setMessage({varian: 'info', text: 'Claiming coin in progress...'})
            )

            setClaimDisable(true)
            
            const getServerTime = async (db, userId) => {
                await updateDoc(doc(db, 'users', userId), {
                    time: serverTimestamp()
                })

                const checkTime = async () => {
                    const docSnap = await getDoc(
                        doc(db, 'users', userId)
                    )

                    const serverTime = docSnap.data()?.time

                    if (serverTime) {
                        return serverTime
                    } else {
                        return new Promise((resolve) => {
                            setTimeout(() => resolve(checkTime()), 1000)
                        })
                    }
                }

                return checkTime()
            }

            const serverNow = await getServerTime(db, user.uid)
            
            const timeDifference = serverNow.toMillis() - user.miningStartDate

            if (timeDifference >= 6 * 60 * 60 * 1000) {
                dispatch(setCoinshow(true))
                const mineAmount = calculateMineValue(
                    user.miningStartDate,
                    user.mineRate
                )

                const newBalance = Number((user.balance + mineAmount).toFixed(2))
                
                await updateDoc(doc(db, 'users', user.uid), {
                    balance: newBalance,
                    isMining: false,
                    miningStartDate: null
                })
                setClaimDisable(false)

            } else {
                dispatch(setMessage({
                    varian: 'error',
                    text: 'Error please try again!'
                }))
            }

        } catch (error) {
            console.log(error);
            dispatch(setMessage({
                varian: 'error',
                text: 'Error please try again!'
            }))
        }
    }

    const addPrecise = (a, b) => {
        return parseFloat((a + b).toFixed(3))
    }

    const getUpgradeStep = (rate) => {
        if (rate < 0.01) return 0.001
        if (rate < 0.1) return 0.01
        if (rate < 1) return 0.1
        return Math.pow(10, Math.floor(Math.log10(rate))) 
    }

    const getUpgradePrice = (nexRate) => {
        return nexRate * 100000
    }

    const getNextUpgradeRate = () => {
        const step = getUpgradeStep(user.mineRate)
        return Math.min(addPrecise(user.mineRate. step), MAX_MINE_RATE)
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
                {
                    calculate.canClaim && (
                        <button disabled={claimDiasble} onClick={claimRewards} className='font-semibold mt-4 w-full bg-green-600 px-4 py-2 rounded-xl text-white'>
                            Claim Reward
                        </button>
                    )
                }
            </div>
        </div>
    )
}

export default MiningButton