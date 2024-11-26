import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setCoinshow } from '../stores/coinshowSlice'

const CoinAnimation = ({showAnimation}) => {
    const [coins, setCoins] = useState([])
    const dispatch = useDispatch()

    useEffect(() => {
        if (showAnimation) {
            const newCoins = Array.from({length: 70}, (_, i) => {
                return {
                    id: i,
                    left: `${Math.random() * 100}%`,
                    delay: `${Math.random() * 1.4}s`
                }
            })
    
            setCoins(newCoins)
            
            const timer = setTimeout(() => {
                dispatch(setCoinshow(false))
                setCoins([])
            }, 3000)

            return () => clearTimeout(timer)
        }
    }, [showAnimation, dispatch])

    return (
        <div className='fixed inset-0 left-0 top-0 z-50 pointer-events-none'>
            {
                (showAnimation) && (
                        <div className="absolute overflow-hidden inset-0 top-0 left-0 group h-[100vh]">
                            {coins.map((coin) => (
                                <div style={{left: coin.left, animationDelay: coin.delay}} className="absolute -bottom-10 w-2 h-2 bg-yellow-500 rounded-full animate-moveUp" key={coin.id}></div>
                            ))}
                        </div>
                )
            }
        </div>
    )
}

export default CoinAnimation