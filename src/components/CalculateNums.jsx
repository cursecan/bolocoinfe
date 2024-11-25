import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectUser } from '../stores/userSlice'
import { calculateMineValue } from '../utils/mining'
import { setCalculate } from '../stores/calculateSlice'

const CalculateNums = () => {
    const dispatch = useDispatch()
    const user = useSelector(selectUser)

    const [waiting, setWaiting] = useState(true)
    const [mined, setMined] = useState(0)
    const [remainingTime, setRemainingTime] = useState({
        hours: 6,
        minutes: 0,
        seconds: 0
    })
    const [progress, setProgress] = useState(0)
    const [canClaim, setCanClaim] = useState(false)

    const MAX_MINE_RATE = 100.0

    const calculateProgress = (miningStartTime) => {
        if (!miningStartTime) return 0

        const now = Date.now()
        const totalMiningTime = 6 * 60 * 60 * 1000
        const elapsedTime = now - (miningStartTime.seconds * 1000)

        if (elapsedTime >= totalMiningTime.seconds * 1000) {
            setCanClaim(true)
            return 100
        }

        const progress = (elapsedTime / totalMiningTime) * 100
        
        return Math.min(Math.max(progress, 0), 100)
    }

    const calculateRemainingTime = (miningStartTime) => {
        if (!miningStartTime) {
            return {hours: 6, minutes: 0, seconds: 0}
        }

        const now = Date.now()
        const totalMiningTime = 6 * 60 * 60 * 1000
        const endTime = (miningStartTime.seconds * 1000) + totalMiningTime        
        
        const remainingTime = Math.max(endTime-now, 0)

        if (remainingTime === 0) {
            return {
                hours: 0, minutes: 0, seconds: 0
            }
        }

        const hours = Math.floor(remainingTime/ (60 * 60 * 1000))
        const minutes = Math.floor(
            (remainingTime % (60 * 60 * 1000)) / (60 * 1000)
        )
        const seconds = Math.floor((remainingTime % (60 * 1000))/1000)
    
        return {hours, minutes, seconds}
    }

    useEffect(() => {
        let worker = null

        const updateFuction = () => {
            const udpateProgress = () => {
                const currentProgress = calculateProgress(user.miningStartDate)
                setProgress(currentProgress)
            }

            const updateMineValue = () => {
                const currentMineValue = calculateMineValue(user.miningStartDate, user.mineRate) 
                setMined(currentMineValue)
                setWaiting(false)
            }

            const updateRemainingTime = () => {
                const timeLeft = calculateRemainingTime(user.miningStartDate)
                
                setRemainingTime(timeLeft)

                if (
                    timeLeft.hours === 0 &&
                    timeLeft.minutes === 0 &&
                    timeLeft.seconds === 0
                ) {
                    setRemainingTime({hours: 0, minutes: 0, seconds: 0})
                }
            }

            udpateProgress()
            updateMineValue()
            updateRemainingTime()
        }
        
        if (user.isMining && user.miningStartDate) {
            
            
            const workerCode  = `
                let interval = null;
                self.onmessage = function(e) {
                    if (e.data==='start') {
                        interval = setInterval(() => {
                            self.postMessage('tick');
                            }, 1000
                        )
                    } else if (e.data === 'stop') {
                        clearInterval(interval)
                    }
                }
            `
            const blob = new Blob([workerCode], {
                type: "application/javascript"
            })
            worker = new Worker(URL.createObjectURL(blob))
    
            worker.onmessage = updateFuction;
            worker.postMessage('start')
        } else {
            setProgress(0)
            setMined(0)
            setRemainingTime({hours: 0, minutes: 0, seconds: 0})
            setCanClaim(false)
            setWaiting(false)
        }

        return () => {
            if (worker) {
                worker.postMessage('stop')
                worker.terminate()
            }
        }

    }, [user.isMining, user.miningStartDate, user.mineRate])

    useEffect(() => {
        
        if(!waiting) {
            dispatch(
                setCalculate({
                    mined: mined,
                    remainingTime: remainingTime,
                    progress: progress,
                    canClaim: canClaim,
                })
            )
        }
    }, [waiting, mined, remainingTime, progress, canClaim, dispatch])

    return <></>
}

export default CalculateNums