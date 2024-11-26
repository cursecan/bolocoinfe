import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { db } from './firebase.js'

import { 
  collection, doc, getDocs, 
  limit, onSnapshot, orderBy, query, 
  setDoc
} from 'firebase/firestore'

import Home from './pages/Home'
import ButtonNavigation from './components/ButtonNavigation'
import Earning from './pages/Earning'
import Friends from './pages/Friends'
import Wallet from './pages/Wallet'
import Leader from './pages/Leader'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectUser, setUser } from './stores/userSlice.js'
import CalculateNums from './components/CalculateNums.jsx'
import Loading from './pages/Loading.jsx'
import { selectCalculate } from './stores/calculateSlice.js'
import { selectMessage, setMessage } from './stores/massageSlice.js'
import CoinAnimation from './components/CoinAnimation.jsx'
import { selectCoinshow } from './stores/coinshowSlice.js'
import { ToastContainer, toast } from 'react-toastify'

import "react-toastify/dist/ReactToastify.css";

function App() {

  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const calculate = useSelector(selectCalculate)
  const message = useSelector(selectMessage)
  const coinShow = useSelector(selectCoinshow)
  
  const [webApp, setWebApp] = useState()

  const processLinks = (links) => {
    return Object.entries(links).reduce((ac, [key, value]) => {
      acc[key] = {
        ...value,
        time: value.time ? value.time.toMillis() : null
      }
      return acc
    }, {})
  }

  useEffect(() => {
    const getUser = () => {
      const unsub = onSnapshot(doc(db, 'users', webApp.id), async (docSnap) => {
        if (docSnap.exists()) {
          dispatch(
            setUser({
              uid: webApp.id,
              firstName: docSnap.data().firstName,
              lastName: docSnap.data().lastName,
              username: docSnap.data().username,
              balance: docSnap.data().balance,
              isMining: docSnap.data().isMining,
              isPremium: docSnap.data().isPremium,
              mineRate: docSnap.data().mineRate,
              miningStartDate: docSnap.data().miningStartDate ? 
                docSnap.data().miningStartDate.toMillis() : null,
              languageCode: docSnap.data().languageCode
            })
          )
          console.log(docSnap.data());
        } else {
          await setDoc(doc(db, 'users', webApp.id), {
            userid: webApp.id,
            firstName: webApp.firstName,
            lastName: webApp.lastName,
            username: webApp.username,
            languageCode: webApp.languageCode,
            isMining: false,
            balance: 0.0,
            mineRate: 0.001,
            miningStartDate: null,
            isPremium: webApp.isPremium
          })
        }
      })

      return () => {
        unsub()
      }
    }
    
    if (webApp) {
      getUser()
    }
  }, [dispatch, webApp])

  useEffect(() => {
    const tg = window.Telegram.WebApp
    tg.ready()
    

    if (tg?.initDataUnsafe?.user?.id) {
      const userId = tg.initDataUnsafe.user.id
      const userIdString = userId.toString()

      setWebApp({
        id: userIdString,
        firstName: tg?.initDataUnsafe?.user?.first_name,
        lastName: tg?.initDataUnsafe?.user?.last_name,
        username: tg?.initDataUnsafe?.user?.username,
        languageCode: tg?.initDataUnsafe?.user?.language_code,
        isPremium: tg?.initDataUnsafe?.user?.is_premium
      })

      tg.expand()
    } else {
      setWebApp({
        id: '12341234',
        firstName: 'Firstname',
        lastName: 'Lastname',
        username: '@username',
        languageCode: 'en',
        isPremium: false
      })
    }

  }, [])

  useEffect(() => {
    const showToast = () => {
      if (message?.text) {
        toast(message.text)
        dispatch(
          setMessage(null)
        )
      }
    }

    showToast()
  }, [message])

  

  return (
    <>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        {
          (user && calculate) && <ButtonNavigation />
        }
        {user && (
          <>
            <CalculateNums />
            <ToastContainer
              closeButton={() => false}
              autoClose={2000}
              toastClassName={() => `bg-gray-700 text-white relative px-5 py-3 rounded-b border-b-4 ${message.varian === 'info' ? 'border-blue-400' : 'border-gray-200'}`}
            />
            <CoinAnimation showAnimation={coinShow} />
          </>
        )}
        <Routes>
          <Route path='*' Component={Loading} />
          <Route path='/' Component={Home} />
          <Route path='/earning' Component={Earning} />
          <Route path='/friend' Component={Friends} />
          <Route path='/wallet' Component={Wallet} />
          <Route path='/leader' Component={Leader} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
